import {
  MAX_DELAY_SECONDS,
  MIN_DELAY_SECONDS,
  WORKLET_MODULE_URL,
  WORKLET_PROCESSOR_NAME,
} from "./constants";
import { clamp } from "@/lib/utils";
import type { PlaybackStatus } from "@/types";

export interface AudioEngineCallbacks {
  onStatus?: (status: PlaybackStatus) => void;
  onError?: (message: string) => void;
  /** Fired ~10x/sec with the live (ramping) delay in seconds. */
  onDelayChange?: (currentDelaySeconds: number) => void;
  /** Fired when Web Audio processing is unavailable (CORS) but direct play works. */
  onProcessingUnavailable?: (reason: string) => void;
}

/**
 * Core PlayDelay audio engine.
 *
 * Graph:  <audio> -> MediaElementSource -> AudioWorklet(delay) -> Gain -> destination
 *
 * When a stream's CORS headers forbid Web Audio processing, the engine falls
 * back to direct <audio> playback (delay disabled) and reports it so the UI
 * can guide the user.
 */
export class AudioEngine {
  private audio: HTMLAudioElement | null = null;
  private context: AudioContext | null = null;
  private source: MediaElementAudioSourceNode | null = null;
  private workletNode: AudioWorkletNode | null = null;
  private gain: GainNode | null = null;

  private callbacks: AudioEngineCallbacks;
  private workletReady = false;
  private processingEnabled = false;
  private targetDelay = 0;
  private volume = 0.8;
  private muted = false;
  private currentUrl: string | null = null;

  constructor(callbacks: AudioEngineCallbacks = {}) {
    this.callbacks = callbacks;
  }

  get isProcessingEnabled() {
    return this.processingEnabled;
  }

  /** The URL currently loaded into the graph (or null). */
  getLoadedUrl(): string | null {
    return this.currentUrl;
  }

  private setStatus(status: PlaybackStatus) {
    this.callbacks.onStatus?.(status);
  }

  private fail(message: string) {
    this.callbacks.onError?.(message);
    this.setStatus("error");
  }

  /** Lazily create the AudioContext + worklet module (must be after a user gesture). */
  private async ensureContext(): Promise<boolean> {
    if (typeof window === "undefined") return false;
    if (this.context && this.workletReady) return true;

    try {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      this.context = new Ctx();
      await this.context.audioWorklet.addModule(WORKLET_MODULE_URL);
      this.workletReady = true;
      return true;
    } catch (err) {
      console.error("Failed to init AudioContext/worklet", err);
      return false;
    }
  }

  /** Load a stream URL and build the processing graph. */
  async load(url: string): Promise<void> {
    this.currentUrl = url;
    this.setStatus("loading");

    // Tear down any previous element/graph but keep the context.
    this.teardownGraph();

    const audio = new Audio();
    audio.crossOrigin = "anonymous";
    audio.preload = "auto";
    audio.src = url;
    this.audio = audio;

    audio.addEventListener("error", () => {
      this.handleLoadError();
    });

    const ok = await this.ensureContext();
    if (!ok || !this.context) {
      // No Web Audio at all — direct playback only.
      this.processingEnabled = false;
      this.callbacks.onProcessingUnavailable?.(
        "Web Audio API is not available in this browser. Delay is disabled."
      );
      this.applyVolumeToElement();
      this.setStatus("paused");
      return;
    }

    try {
      this.source = this.context.createMediaElementSource(audio);
      this.gain = this.context.createGain();
      this.gain.gain.value = this.muted ? 0 : this.volume;

      this.workletNode = new AudioWorkletNode(
        this.context,
        WORKLET_PROCESSOR_NAME,
        { numberOfInputs: 1, numberOfOutputs: 1, outputChannelCount: [2] }
      );

      this.workletNode.port.onmessage = (event) => {
        const data = event.data;
        if (data?.type === "delay") {
          this.callbacks.onDelayChange?.(data.current);
        }
      };

      this.source.connect(this.workletNode);
      this.workletNode.connect(this.gain);
      this.gain.connect(this.context.destination);

      this.processingEnabled = true;
      this.pushDelay();
      this.setStatus("paused");
    } catch (err) {
      console.error("Web Audio graph build failed; falling back", err);
      this.processingEnabled = false;
      this.callbacks.onProcessingUnavailable?.(
        "This stream cannot be processed by Web Audio (likely CORS). Playing without delay."
      );
      this.applyVolumeToElement();
      this.setStatus("paused");
    }
  }

  private handleLoadError() {
    if (!this.audio) return;
    // With crossOrigin set, a missing CORS header makes the element fail.
    // Retry once WITHOUT crossOrigin for direct (non-processed) playback.
    if (this.audio.crossOrigin && this.currentUrl) {
      const url = this.currentUrl;
      this.teardownGraph();
      const audio = new Audio();
      audio.preload = "auto";
      audio.src = url;
      this.audio = audio;
      this.processingEnabled = false;
      audio.addEventListener("error", () => {
        this.fail(
          "Stream failed to load. The URL may be offline, invalid, or blocked."
        );
      });
      this.applyVolumeToElement();
      this.callbacks.onProcessingUnavailable?.(
        "This stream blocks cross-origin processing (CORS). Playing without delay — to sync, delay your TV/video instead."
      );
      this.setStatus("paused");
      return;
    }
    this.fail(
      "Stream failed to load. The URL may be offline, invalid, or blocked."
    );
  }

  async play(): Promise<void> {
    if (!this.audio) return;
    try {
      if (this.context && this.context.state === "suspended") {
        await this.context.resume();
      }
      await this.audio.play();
      this.setStatus("playing");
    } catch (err) {
      console.error("play() failed", err);
      this.fail("Playback was blocked. Tap play again to start audio.");
    }
  }

  pause(): void {
    this.audio?.pause();
    this.setStatus("paused");
  }

  async toggle(): Promise<void> {
    if (!this.audio) return;
    if (this.audio.paused) {
      await this.play();
    } else {
      this.pause();
    }
  }

  setVolume(volume: number): void {
    this.volume = clamp(volume, 0, 1);
    if (!this.muted) this.applyVolume();
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    this.applyVolume();
  }

  toggleMute(): boolean {
    this.muted = !this.muted;
    this.applyVolume();
    return this.muted;
  }

  private applyVolume() {
    const value = this.muted ? 0 : this.volume;
    if (this.gain && this.context) {
      this.gain.gain.setTargetAtTime(value, this.context.currentTime, 0.02);
    } else {
      this.applyVolumeToElement();
    }
  }

  private applyVolumeToElement() {
    if (this.audio) this.audio.volume = this.muted ? 0 : this.volume;
  }

  /** Set the absolute target delay (seconds). */
  setDelay(seconds: number): number {
    this.targetDelay = clamp(seconds, MIN_DELAY_SECONDS, MAX_DELAY_SECONDS);
    this.pushDelay();
    return this.targetDelay;
  }

  /** Adjust the delay by a relative amount (seconds). */
  stepDelay(delta: number): number {
    return this.setDelay(this.targetDelay + delta);
  }

  resetDelay(): number {
    this.targetDelay = 0;
    this.workletNode?.port.postMessage({ type: "reset" });
    return 0;
  }

  private pushDelay() {
    this.workletNode?.port.postMessage({
      type: "setDelay",
      seconds: this.targetDelay,
    });
  }

  getTargetDelay() {
    return this.targetDelay;
  }

  private teardownGraph() {
    try {
      this.source?.disconnect();
      this.workletNode?.disconnect();
      this.gain?.disconnect();
    } catch {
      /* noop */
    }
    if (this.audio) {
      this.audio.pause();
      this.audio.removeAttribute("src");
      this.audio.load();
    }
    this.source = null;
    this.workletNode = null;
    this.gain = null;
    this.audio = null;
  }

  /** Fully dispose the engine. */
  async destroy(): Promise<void> {
    this.teardownGraph();
    if (this.context) {
      try {
        await this.context.close();
      } catch {
        /* noop */
      }
      this.context = null;
      this.workletReady = false;
    }
  }
}
