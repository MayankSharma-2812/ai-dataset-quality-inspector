---
name: AegisData AI
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#c7c4d7'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#908fa0'
  outline-variant: '#464554'
  surface-tint: '#c0c1ff'
  primary: '#c0c1ff'
  on-primary: '#1000a9'
  primary-container: '#8083ff'
  on-primary-container: '#0d0096'
  inverse-primary: '#494bd6'
  secondary: '#4cd7f6'
  on-secondary: '#003640'
  secondary-container: '#03b5d3'
  on-secondary-container: '#00424e'
  tertiary: '#ffb783'
  on-tertiary: '#4f2500'
  tertiary-container: '#d97721'
  on-tertiary-container: '#452000'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#acedff'
  secondary-fixed-dim: '#4cd7f6'
  on-secondary-fixed: '#001f26'
  on-secondary-fixed-variant: '#004e5c'
  tertiary-fixed: '#ffdcc5'
  tertiary-fixed-dim: '#ffb783'
  on-tertiary-fixed: '#301400'
  on-tertiary-fixed-variant: '#703700'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  data-display:
    fontFamily: JetBrains Mono
    fontSize: 18px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: -0.01em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.2'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 32px
  container-max: 1440px
---

## Brand & Style
The design system for this enterprise ML observability platform is built on a foundation of **High-Performance Precision**. It targets data scientists and ML engineers who require authoritative, real-time insights into model health.

The visual style is **Ultra-Modern Dark Mode**, utilizing a sophisticated blend of **Glassmorphism** and **Technical Minimalism**. The UI should feel like a high-end command center—precise, expansive, and deep. Key characteristics include:
- **Translucency:** Widespread use of `backdrop-blur-md` to create depth without clutter.
- **Luminosity:** Subtle border glows and ambient background orbs suggest data flowing behind the interface.
- **Technical Rigor:** Strict alignment, monospaced data points, and clear status indicators to ensure enterprise-grade reliability.

## Colors
This design system operates on a deep Slate-950 base (`#020617`) to provide maximum contrast for technical data.

- **Primary Gradient:** A high-energy transition from Indigo (`#6366F1`) to Cyan (`#06B6D4`) used for primary actions, progress bars, and active states.
- **Functional Accents:** Emerald, Amber, and Rose are used strictly for status signaling (Pass, Warning, Critical) to maintain high semantic clarity.
- **Surface Palette:** Layers are constructed using Zinc-900 with varying levels of opacity to facilitate glassmorphic effects. 
- **Borders:** Subtle `white/10` borders create a "wireframe" feel that defines edges in dark environments without visual heaviness.

## Typography
The typographic hierarchy balances modern approachability with technical precision.

- **Headlines:** Use **Plus Jakarta Sans** for a contemporary, clean look in navigation and section titles.
- **Interface & Body:** **Inter** provides high legibility for settings, descriptions, and tooltips.
- **Metrics & Code:** **JetBrains Mono** is mandatory for all numerical data, P-values, model weights, and logs. This monospaced choice ensures that columns of numbers remain perfectly aligned during real-time updates.
- **Scale:** On mobile, `headline-lg` should scale down to 24px to maintain readability within condensed dashboards.

## Layout & Spacing
The system utilizes a **Fluid Grid** with fixed maximum constraints to handle data-dense dashboards across ultrawide monitors and laptop screens.

- **Grid Model:** 12-column layout on desktop, 4-column on mobile.
- **Rhythm:** A 4px base unit governs all padding and margins. Dashboard widgets should typically utilize 24px (6 units) of internal padding.
- **Data Density:** In model observability views, vertical spacing can be reduced to 8px or 12px between list items to maximize information density without sacrificing clarity.
- **Responsiveness:** At tablet breakpoints, the sidebar collapses into a rail, and grid modules reflow from a 3-column to a 1-column stack.

## Elevation & Depth
Depth is communicated through **Optical Layers** rather than traditional heavy shadows.

- **Level 1 (Base):** Slate-950 background with soft, large-scale indigo background blurs (orbs).
- **Level 2 (Containers):** Zinc-900 at 60% opacity with `backdrop-blur-md` and a 1px border of `white/10`.
- **Level 3 (Popovers/Modals):** Zinc-800 at 80% opacity with a secondary "glow" border using the primary indigo-cyan gradient at 20% opacity.
- **Interaction:** On hover, glass containers should increase their border opacity from 10% to 25% to provide tactile feedback.

## Shapes
The shape language is **Soft (0.25rem)**, reflecting an industrial, "machined" aesthetic that feels precise rather than "bubbly."

- **Standard Elements:** Buttons, inputs, and small widgets use `0.25rem` (4px).
- **Cards & Containers:** Large dashboard panels use `rounded-lg` (8px).
- **Status Indicators:** Pills and tags for "Pass/Fail" use `rounded-full` to distinguish them from structural UI elements.

## Components
- **Buttons:** Primary buttons use the Indigo-to-Cyan gradient with white text. Ghost buttons use the gradient for the border only. All buttons feature a subtle inner glow.
- **Dashboard Cards:** Semi-transparent glass containers. Headers within cards should have a 1px separator line at `white/5` opacity.
- **Data Inputs:** Dark, inset fields with JetBrains Mono text. On focus, the 1px border glows with the primary cyan color.
- **Status Chips:** Small, high-contrast badges using the functional Emerald, Amber, or Rose colors. These should include a 4px dot icon for accessibility.
- **Charts:** Line and area charts should use the primary gradient for the main data series, with a "glow" effect on the line itself. Grid lines in charts should be kept at extremely low visibility (`white/5`).
- **Telemetry Lists:** High-density rows with monospaced values. Alternate row striping is replaced by 1px horizontal dividers.