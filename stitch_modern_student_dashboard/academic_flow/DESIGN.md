---
name: Academic Flow
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#434655'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#784b00'
  on-tertiary: '#ffffff'
  tertiary-container: '#996100'
  on-tertiary-container: '#ffeedd'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 30px
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.01em
  button:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  container-max: 1280px
  gutter: 20px
---

## Brand & Style
The design system is engineered for a high-performance Student Assignment Tracker, prioritizing cognitive clarity and academic focus. The personality is professional yet approachable—acting as a "quiet assistant" that recedes into the background to let student data take center stage.

Drawing inspiration from high-productivity tools like Linear and Notion, the style is **refined minimalism**. It utilizes significant whitespace to reduce "assignment anxiety" and employs a structured information hierarchy. The emotional response should be one of organized calm, reliability, and momentum. The aesthetic leverages subtle tonal shifts rather than heavy lines to define structure.

## Colors
The palette is anchored by a functional **Soft Blue (#2563EB)**, used strategically for primary actions and focus states to signify progress and importance. 

- **Primary:** Used for the "Create Task" button, active navigation states, and primary checkboxes.
- **Secondary (Slate):** Used for metadata, icons, and less emphasis text to keep the UI light.
- **Tertiary (Amber):** Reserved strictly for "Due Soon" warnings or high-priority tags.
- **Neutrals:** A range of cool grays provides the structural scaffolding. `F9FAFB` is the primary canvas color, while `F3F4F6` is used for sidebar backgrounds and inset card wells.

## Typography
This design system utilizes **Inter** exclusively to maintain a cohesive, systematic feel. 

- **Headings:** Use Bold (700) weights with slight negative letter spacing to create a compact, modern look for dashboard titles and course names.
- **Body:** Set to Medium (500) weight by default. This provides better legibility on high-DPI screens than Standard/Regular weights, ensuring task descriptions are easy to scan.
- **Labels & Buttons:** Use SemiBold (600) to distinguish interactive elements from static metadata.

## Layout & Spacing
The layout follows a **Fluid Grid** model with a soft 4px baseline shift. 

- **Desktop:** A 12-column grid with 24px margins. Use a fixed-width sidebar (240px) for navigation, with a fluid main content area.
- **Tablet:** 8-column grid. The sidebar collapses into a drawer or a bottom bar.
- **Mobile:** Single column with 16px horizontal safe-areas. 
- **Spacing Logic:** Use `md` (16px) for internal card padding and `lg` (24px) for spacing between distinct sections or widgets.

## Elevation & Depth
Depth is communicated through **Tonal Layering** and **Ambient Shadows**. 

1. **Level 0 (Floor):** The base background (`#F9FAFB`).
2. **Level 1 (Cards):** Pure white surfaces with a 1px border (`#E5E7EB`) and a very soft, diffused shadow: `0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)`.
3. **Level 2 (Popovers/Modals):** High elevation with a more pronounced shadow to indicate temporary interaction. Use `0 10px 15px -3px rgba(0, 0, 0, 0.1)`.

Avoid heavy dark shadows; the goal is for elements to feel like they are gently resting on the surface.

## Shapes
The shape language is friendly and modern, utilizing a consistent **Rounded (12px - 16px)** radius.

- **Standard Elements (Buttons, Inputs):** Use 12px (`rounded-md`).
- **Main Containers (Task Cards, Course Cards):** Use 16px (`rounded-lg`).
- **Status Badges:** Use a pill-shape (full radius) to contrast against the structured rectangular grid.

## Components

- **Buttons:** Primary buttons use a solid `#2563EB` fill with white text. Secondary buttons use a white background with a 1px gray border. Hover states should involve a subtle darkening of the background and a scale-down effect (98%) on click.
- **Task Cards:** White background, 16px padding, 12px corner radius. Feature a Lucide-style "grip" icon for reordering and a circular checkbox on the left.
- **Inputs:** Large, 12px rounded corners with a 1px border (`#D1D5DB`). On focus, the border changes to Primary Blue with a 3px soft blue outer glow (ring).
- **Badges:** Use "Low-Saturation" backgrounds. For example, a "Math" tag should have a very light blue background with dark blue text to keep the interface professional and not "neon."
- **Icons:** Use **Lucide** icons with a 2px stroke width. Icons should always be accompanied by labels or have a consistent size (20px) to maintain visual balance.
- **Progress Bars:** Use a thick 8px track with a rounded cap. Use the Primary Blue for the progress fill and `#E5E7EB` for the track.