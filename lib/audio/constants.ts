/** Audio engine tuning + UI constants. */

export const MIN_DELAY_SECONDS = 0;
export const MAX_DELAY_SECONDS = 120;

/** Quick-adjust step buttons (seconds). */
export const DELAY_STEPS = [
  { label: "-60s", value: -60 },
  { label: "-10s", value: -10 },
  { label: "-1s", value: -1 },
  { label: "+1s", value: 1 },
  { label: "+10s", value: 10 },
  { label: "+60s", value: 60 },
] as const;

/** One-tap presets (seconds). */
export const DELAY_PRESETS = [3, 5, 8, 10, 15] as const;

export const WORKLET_MODULE_URL = "/worklets/delay-processor.js";
export const WORKLET_PROCESSOR_NAME = "delay-processor";
