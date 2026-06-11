# Reference design — salat-mahenoor portfolio

Source: https://salat-mahenoor-ai-creative-develope.vercel.app/

## Background

- Base: white (`#ffffff`)
- Dot grids: `radial-gradient(rgb(153, 204, 238) 1px, transparent 1px)` at ~40% opacity, 2px spacing
- Secondary dots: `rgb(0, 119, 181)` at ~20% opacity
- Static glow: `radial-gradient(12.5% 12.5% at 50% 37.5%, rgb(226, 232, 240), transparent)`
- Mouse spotlight: large soft radial gradient follows cursor (brightens area under pointer)

## Typography & color

- Body text: `rgb(4, 8, 22)` — near-black navy
- Muted text: slate gray
- Primary CTA: bright blue button, pill shape

## Navigation

- Centered floating pill navbar
- White / glass background, soft shadow, rounded-full

## Showcase cards (“Selected Work”)

- Large media block: `rounded-3xl`, dark near-black interior, soft drop shadow
- Below media: two-column layout on desktop
  - Left: bold project title
  - Right: description + text links (“Read case study →”, “View project”)
- Generous vertical spacing between cards

## PlayDelay adaptation

- Same background + spotlight interaction site-wide
- Feature sections use showcase card layout
- PlayDelay brand blue/coral accents on light base (not a 1:1 clone)
