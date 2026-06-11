# PlayDelay Audio Engine

This document explains how PlayDelay delays a live radio stream by 0–120
seconds, smoothly and without clicks.

## Overview

The engine is built on the **Web Audio API** with a custom **AudioWorklet**
that implements a **ring buffer** delay line. The signal graph is:

```
HTMLAudioElement (stream)
        │  (MediaElementAudioSourceNode)
        ▼
AudioWorkletNode  "delay-processor"   ← ring buffer, 0–120s
        │
        ▼
GainNode (volume / mute)
        │
        ▼
AudioContext.destination (speakers)
```

- `lib/audio/audio-engine.ts` — the `AudioEngine` class builds and owns the
  graph and exposes imperative controls (`load`, `play`, `pause`, `setDelay`,
  `setVolume`, `setMuted`, `resetDelay`, `destroy`).
- `public/worklets/delay-processor.js` — the `AudioWorkletProcessor` that does
  the actual delaying on the audio render thread.
- `hooks/use-audio-engine.ts` — bridges the engine to the Zustand store and
  exposes React-friendly callbacks.

## The ring buffer

A ring buffer (circular buffer) is a fixed-size array with a moving write
pointer. We size it for the maximum delay:

```
capacity = ceil(MAX_DELAY_SECONDS * sampleRate) + sampleRate   // +1s headroom
```

At 48 kHz and 120 s that's ~5.76M samples per channel (~23 MB × 2 channels).

Each render quantum the processor:

1. **Writes** the incoming sample to `buffer[writePos]`.
2. **Reads** a sample `delaySamples` behind the write pointer:
   `readPos = (writePos - currentDelaySamples + capacity) % capacity`.
3. Advances `writePos` (wrapping with modulo).

Because `currentDelaySamples` can be fractional, the read uses **linear
interpolation** between the two nearest samples for clean output.

## Smooth, click-free delay changes

Jumping the read pointer to a new delay instantly would produce an audible
click (a discontinuity). Instead, the processor keeps two values:

- `targetDelaySamples` — what the user asked for.
- `currentDelaySamples` — the delay actually in effect right now.

Every sample, `currentDelaySamples` moves toward `targetDelaySamples` by at
most `maxRampRate` (default `0.02` samples/sample ≈ a ~2% temporary
speed-up/slow-down). This is effectively a gentle varispeed during the
transition — inaudible in practice, and it guarantees there are no clicks.

The processor reports the live `currentDelay` back to the UI ~10×/second over
its message port so the player can show "adjusting… → in sync".

## Messages

Main thread → worklet:

| Message                               | Effect                          |
| ------------------------------------- | ------------------------------- |
| `{ type: "setDelay", seconds }`       | Set the target delay (clamped). |
| `{ type: "reset" }`                   | Clear the buffer, delay → 0.    |

Worklet → main thread:

| Message                               | Meaning                         |
| ------------------------------------- | ------------------------------- |
| `{ type: "delay", current }`          | Live delay in seconds (~10/s).  |

## CORS handling

`createMediaElementSource` requires the media to be CORS-clean, so the engine
sets `audio.crossOrigin = "anonymous"`. If the stream's server doesn't return
the right CORS headers:

1. The `<audio>` element fires an `error`.
2. The engine retries **without** `crossOrigin` for direct playback.
3. It reports `onProcessingUnavailable`, the UI shows a "direct play (no delay)"
   badge, and the sync guidance tells the user to delay their TV/video instead.

The **Stream Tester** (`services/stream-service.ts → test()`) runs the same
checks ahead of time:

- can the element load metadata?
- can it play?
- does a `crossOrigin` load succeed (i.e. is Web Audio processing available)?

## Keyboard shortcuts

Implemented in `hooks/use-keyboard-shortcuts.ts`:

| Key       | Action          |
| --------- | --------------- |
| `m`       | Mute / unmute   |
| `space`   | Play / pause    |
| `↑` / `↓` | +1s / −1s delay |

(Disabled while typing in inputs.)

## Why an AudioWorklet (not ScriptProcessorNode or DelayNode)?

- **`DelayNode`** caps `maxDelayTime` and isn't designed for long (minutes)
  delays or smooth re-targeting; a worklet ring buffer handles 120s cleanly.
- **`ScriptProcessorNode`** is deprecated and runs on the main thread, causing
  glitches under load. The AudioWorklet runs on the dedicated audio thread.
