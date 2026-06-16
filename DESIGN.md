---
name: Project Management Tool
description: A focused Kanban workspace for developers — boards, lists, and cards.
colors:
  steel-blue: "#2e5070"
  steel-blue-deep: "#25425c"
  steel-blue-pale: "#daeaf5"
  canvas: "#f8f8f8"
  surface: "#eeeeee"
  card: "#ffffff"
  border: "#d4d4d4"
  ink: "#1a2030"
  ink-muted: "#515462"
  danger: "#a33434"
  danger-pale: "#f9dddd"
  status-todo-text: "#2e5070"
  status-todo-fill: "#daeaf5"
  status-progress-text: "#8a4030"
  status-progress-fill: "#f5e0d8"
  status-done-text: "#3d5c28"
  status-done-fill: "#dff0d4"
typography:
  display:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "2rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "normal"
  body:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "0.82rem"
    fontWeight: 800
    lineHeight: 1.4
    letterSpacing: "0.02em"
  caption:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "0.85rem"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0.08em"
rounded:
  pill: "999px"
  md: "8px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.steel-blue}"
    textColor: "{colors.card}"
    rounded: "{rounded.md}"
    padding: "0 1rem"
    height: "2.75rem"
  button-primary-hover:
    backgroundColor: "{colors.steel-blue-deep}"
    textColor: "{colors.card}"
  button-ghost:
    backgroundColor: "{colors.card}"
    textColor: "{colors.steel-blue}"
    rounded: "{rounded.md}"
    padding: "0 0.55rem"
    height: "1.9rem"
  button-ghost-hover:
    backgroundColor: "{colors.steel-blue-pale}"
    textColor: "{colors.steel-blue}"
  button-pill:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 1rem"
    height: "2.75rem"
  card:
    backgroundColor: "{colors.card}"
    rounded: "{rounded.md}"
    padding: "0.85rem"
  input:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    height: "2.75rem"
    padding: "0 0.85rem"
  chip-todo:
    backgroundColor: "{colors.status-todo-fill}"
    textColor: "{colors.status-todo-text}"
    rounded: "{rounded.pill}"
    padding: "0.2rem 0.6rem"
  chip-progress:
    backgroundColor: "{colors.status-progress-fill}"
    textColor: "{colors.status-progress-text}"
    rounded: "{rounded.pill}"
    padding: "0.2rem 0.6rem"
  chip-done:
    backgroundColor: "{colors.status-done-fill}"
    textColor: "{colors.status-done-text}"
    rounded: "{rounded.pill}"
    padding: "0.2rem 0.6rem"
---

# Design System: Project Management Tool

## 1. Overview

**Creative North Star: "The Quiet Workshop"**

This is a focused tool for people who make things. The interface should feel like a well-kept workspace: every element has a reason to be there, nothing is decorative, and the work occupies center stage. Warm and approachable without being casual — the kind of app you'd actually leave open on a second monitor without it demanding attention.

The visual language borrows from the precision of developer tooling (Vercel's dashboard restraint, high-contrast type, generous breathing room) but softens the temperature just enough to feel human. Steel-blue ink on clean neutral canvas. Status is communicated through carefully chosen semantic color, not through visual theater.

This system explicitly rejects Jira-style information density, corporate blue-on-white monotony, and the generic SaaS scaffold of cream backgrounds, gradient text, and eyebrow labels on every section heading. If a screen feels like it was assembled from a component library checklist rather than designed for a purpose, something is wrong.

**Key Characteristics:**
- Flat tonal layering: depth via background steps (canvas → surface → card), never shadows
- One accent color used sparingly — steel blue as a signal, not decoration
- Semantic status colors that are informative, not festive
- Generous minimum touch targets (2.75rem), tight spacing within components
- No decorative elements: borders, radius, and whitespace do all structural work

## 2. Colors: The Quiet Palette

A restrained palette anchored in steel blue. The neutral band carries the structure; the accent speaks only when there is something to say.

### Primary
- **Steel Blue** (`#2e5070`): The primary accent. Used for interactive affordances (focused inputs, active states, accent text, CTA buttons), column "To Do" headers, and any element that communicates action or identity. Not decorative — only appears when pointing to something.
- **Steel Blue Deep** (`#25425c`): Hover and pressed state for primary interactive elements. Darker by ~15% lightness; same hue.
- **Steel Blue Pale** (`#daeaf5`): Fill for accent-highlighted backgrounds — focus outlines, status chips, notification areas. Never used as a surface color on its own.

### Neutral
- **Canvas** (`#f8f8f8`): App shell and board background. True neutral near-white, chroma zero. No warm or cool cast. *Previous implementation used a warm-sand tone (#f0ebe3); that has been superseded by this decision.*
- **Surface** (`#eeeeee`): Column/list backgrounds. One step darker than canvas; creates separation without shadow.
- **Card** (`#ffffff`): Pure white. Card faces, form inputs, modals.
- **Border** (`#d4d4d4`): Structural dividers. One weight, used consistently. Not decorative.
- **Ink** (`#1a2030`): Primary text. Has a deliberate slight navy cast — connects to the steel-blue accent family without reading as colored.
- **Ink Muted** (`#515462`): Secondary text, descriptions, placeholder labels. Passes WCAG AA (≥4.5:1) against card and canvas backgrounds.
- **Danger** (`#a33434`): Error states, destructive actions. Used with text labels, never color alone.
- **Danger Pale** (`#f9dddd`): Error message backgrounds.

### Semantic Status
These three sets are used exclusively for column/status labeling. They carry meaning; applying them to non-status UI is prohibited.
- **To Do**: text `#2e5070`, fill `#daeaf5`
- **In Progress**: text `#8a4030`, fill `#f5e0d8`
- **Done**: text `#3d5c28`, fill `#dff0d4`

### Named Rules
**The Signal Rule.** Steel blue appears on ≤15% of any given screen. Every time it appears, it is pointing at something actionable or meaningful. Decorative use makes it meaningless — and when the accent is meaningless, the whole information hierarchy collapses.

**The Status Quarantine Rule.** The three semantic status color sets (To Do / In Progress / Done) are quarantined to column headers and status chips. They never appear as backgrounds, text treatments, or decorative fills anywhere else on the screen.

## 3. Typography

**Body/UI Font:** Inter (with system-UI fallback stack)

No display/body pairing — this is a product, not a publication. Inter carries all hierarchy through weight and size alone.

**Character:** Clean, readable, slightly warm in heavier weights. At weight 700–800, Inter has enough visual personality to distinguish headings from body without a second typeface. The system uses weight as its primary contrast axis, not color or size alone.

### Hierarchy
- **Display** (700, 2rem, line-height 1.2, tracking −0.01em): App title ("Boards"), reserved for the top-level identity moment in the header. One per page.
- **Headline** (700, 1.5rem, line-height 1.3): Page section titles — "Board dashboard", "Log in", "Board name". Aria heading level h2.
- **Title** (700, ~1rem, line-height 1.4): Card titles, list column headings (h4). The workhorse label at the content level.
- **Body** (400, 15px, line-height 1.6): Descriptions, card text, prose content. Max line length 65–75ch; prefer grid `max-width` over `max-inline-size` wrapping.
- **Label** (800, 0.82rem, line-height 1.4, tracking 0.02em): Form field labels, button text in ghost buttons, UI micro-copy. Weight 800 gives authority at small sizes.
- **Caption** (700, 0.85rem, tracking 0.08em, uppercase): Status chips only. Used sparingly — not as a general eyebrow pattern.

### Named Rules
**The No-Eyebrow Rule.** Small-caps uppercase tracked text above section headings ("WELCOME BACK", "PROJECT MANAGEMENT", "SELECTED BOARD") is prohibited as a general scaffold. The caption style is reserved exclusively for status chips. Section context is conveyed through heading hierarchy and page structure — not decorative labels.

**The Weight Axis Rule.** Hierarchy is expressed through weight contrast (400 vs 700 vs 800), not size contrast alone. Never use more than three size steps on one screen. When in doubt, increase weight before increasing size.

## 4. Elevation

This system is **flat by default**. No shadows. Depth is expressed entirely through tonal surface layering: canvas (lightest) → surface → card (whitest). The hierarchy of surfaces is the hierarchy of depth.

Interactive state lift is handled through border-color transition (rest → accent), not shadow introduction. On hover, a card's border shifts from `--border` to `--steel-blue`; no `box-shadow` is added.

### Named Rules
**The Flat-By-Default Rule.** Shadows are prohibited on cards, columns, modals, and form inputs. If elevation needs to be expressed (e.g. a floating dropdown, a toast notification), use `background: #ffffff` + `border: 1px solid {colors.border}` over a dimmed background, not a shadow-lifted surface.

## 5. Components

### Buttons
Shape is determined by context. Pill radius (999px) for header/global actions; rectangular radius (8px) for form and inline actions.

- **Primary Button** (form submit, CTA): `background: #2e5070`, `color: #ffffff`, `border-radius: 8px`, `min-height: 2.75rem`, `padding: 0 1rem`, `font-weight: 800`. Hover: `background: #25425c`. Focus-visible: `outline: 2px solid #daeaf5`, `outline-offset: 2px`. Disabled: `opacity: 0.7`, `cursor: wait`.
- **Ghost/Inline Button** (Edit, Delete, Cancel, contextual actions): `background: transparent`, `color: #2e5070` (or `#a33434` for danger variant), `border: 1px solid #d4d4d4`, `border-radius: 8px`, `min-height: 1.9rem`, `padding: 0 0.55rem`, `font-size: 0.78rem`, `font-weight: 800`. Hover: `background: #daeaf5` (or `#f9dddd` for danger). No raised state.
- **Pill Button** (header: Log out, Dark/Light toggle): `background: #ffffff`, `color: #1a2030`, `border: 1px solid #d4d4d4`, `border-radius: 999px`, `min-height: 2.75rem`, `padding: 0 1rem`, `font-weight: 800`. Hover: `border-color: #2e5070`.

### Status Chips
Used exclusively in column headers to identify workflow state.

- **Pill shape**: `border-radius: 999px`, `padding: 0.2rem 0.6rem`, `font-size: 0.82rem`, `font-weight: 800`
- Colors: see Semantic Status in Colors section
- Always paired with a text label — the color alone is never sufficient

### Cards / Containers
The kanban card is the primary content atom.

- **Corner Style:** Gently curved (8px)
- **Background:** `#ffffff` (card white) over column surface (`#eeeeee`)
- **Border:** `1px solid #d4d4d4` at rest; `1px solid #2e5070` on hover/focus
- **Shadow Strategy:** None — see Elevation
- **Internal Padding:** `0.85rem` uniform
- **Drag affordance:** `draggable="true"`, `cursor: grab` on the article element (not a separate handle)
- **Edit form:** Inline within the card; no modal. Form fields inherit card background.

### Inputs / Fields
- **Style:** `background: #ffffff`, `border: 1px solid #d4d4d4`, `border-radius: 8px`, `min-height: 2.75rem`, `padding: 0 0.85rem`, `color: #1a2030`, `font: inherit`
- **Focus:** `border-color: #2e5070` + `outline: 2px solid #daeaf5`, `outline-offset: 1px`
- **Error:** `border-color: #a33434` + `aria-invalid="true"`, error message in `#a33434` below the field (never inside the input)
- **Disabled:** Not yet designed — treat as `opacity: 0.6`, `cursor: not-allowed`

### Navigation (App Header)
- Full-width strip, no card treatment. `background: inherit` (inherits canvas color from shell).
- Left: app title as a link (h1 "Boards", no visible underline at rest)
- Right: user name (ink, weight 800) + pill buttons (Log out, theme toggle)
- No bottom border or shadow separator
- Mobile: stack vertically at ≤760px; title above, actions below

### Column / List Panel
The primary structural container in board view.

- **Width:** Fixed `min-width: 280px`, allows horizontal scroll on overflow
- **Background:** `#eeeeee` (surface)
- **Corner style:** `8px` radius
- **Header:** Column title (h3 or equivalent weight) + status chip + action button (create card)
- **Card stack:** `display: flex; flex-direction: column; gap: 0.5rem; padding: 0.75rem`

## 6. Do's and Don'ts

### Do:
- **Do** use `#f8f8f8` for the board canvas background. The previous warm-sand tone (`#f0ebe3`) has been superseded. True neutral reads more sharply with the steel-blue accent and avoids the cream/sand AI-default signal.
- **Do** verify WCAG AA contrast before using any muted text. `#515462` on `#ffffff` passes; `#4f463d` on `#f0ebe3` (old palette) was marginal. If in doubt, darken the text color toward `#1a2030`.
- **Do** use weight contrast (400 → 700 → 800) as the primary hierarchy signal, not color or size.
- **Do** communicate status with both color and a text label. The status chips use both `background` and a text name ("To Do", "In Progress", "Done") — never drop the text.
- **Do** add `@media (prefers-reduced-motion: reduce)` alternatives for any animation introduced. State transitions (hover border color, focus ring) are safe; entering/exiting sequences need the override.
- **Do** use `aria-invalid`, `aria-describedby`, and visible error text below the field for all form validation errors.
- **Do** keep interactive elements at a minimum touch target of `2.75rem` (44px) height, even for small ghost buttons. Small buttons may have reduced visual height but should have expanded click zones via `padding` or `min-height`.

### Don't:
- **Don't** add eyebrow labels ("WELCOME BACK", "SELECTED BOARD", "PROJECT MANAGEMENT") above headings. This pattern appears throughout the current implementation and is the single most visible AI-scaffold tell. Remove them; let the heading carry the context on its own.
- **Don't** use the warm-sand background tone (`#f0ebe3` or any tone in the OKLCH L 0.84–0.97, C < 0.06, H 40–100 range). The system uses true neutral `#f8f8f8`.
- **Don't** use gradient text (`background-clip: text` with a gradient). All text is solid color.
- **Don't** use `border-left` greater than `1px` as a colored accent stripe on cards, list items, or alerts. Rewrite with a background tint, a full border, or no decoration.
- **Don't** use Jira-style information density: no dense tables, no status icons stacked with metadata, no drawer panels containing 15 fields. Every screen should have perceptible breathing room.
- **Don't** use the semantic status colors (To Do / In Progress / Done palette sets) outside their designated context. They're quarantined to column headers and chips.
- **Don't** add shadows to cards, columns, modals, or form inputs. The system is flat by design. Depth comes from surface layering.
- **Don't** use generic SaaS patterns: hero-metric blocks (big number, small label, supporting stats), identical icon+heading+text card grids repeated endlessly, or numbered section markers (01 / 02 / 03) as decorative scaffold.
