import { Big_Shoulders, Chakra_Petch } from "next/font/google";

export const nitroDisplay = Big_Shoulders({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-nitro-display",
  display: "swap",
  adjustFontFallback: false,
  preload: false,
});

export const nitroBody = Chakra_Petch({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-nitro-body",
  display: "swap",
  adjustFontFallback: false,
  preload: false,
});
