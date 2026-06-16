# Product

## Register

product

## Users

The primary user is the developer building this — a learner exploring Vue 3 and NestJS through a real, complete product. The design should demonstrate craft and feel satisfying to use personally, as a portfolio piece that reflects thoughtful engineering decisions.

Secondary context: if shared with others, they're small-team collaborators tracking work across boards and lists.

Primary job: navigate to the right board, see work-in-progress at a glance, move cards quickly between states (To Do → In Progress → Done).

## Product Purpose

A Kanban-style project management tool — boards, lists (columns), and cards — with drag-and-drop card movement, board visibility controls (private/shared), user accounts, and auth. Built as a learning project across 9 phases covering Vue 3, NestJS, Pinia, Prisma/SQLite, and JWT auth.

Success looks like: a working, polished tool you'd actually open daily and not be embarrassed to share.

## Brand Personality

Warm and precise. Friendly but never casual — professional enough for real work, human enough to not feel corporate. The Vercel dashboard's typographic clarity and deliberate use of space, with a warmer color palette and more approachable tone than Vercel's cold neutrality.

Three words: **approachable, purposeful, considered**.

Emotional goal: the app feels like it was made by someone who cares — not assembled.

## Anti-references

**Jira**: No dense tables, overwhelming information hierarchy, or corporate blue. Every screen should feel like it has room to breathe. Avoid the feeling of "enterprise software."

**Generic SaaS**: No cream/sand body backgrounds, gradient text, or rows of identical icon+heading+text cards. No eyebrow labels on every single section.

## Design Principles

1. **Warmth through content, not chrome** — friendliness comes from clear copy, sensible defaults, and color choices; not decorative borders, gradients, or badges.
2. **Precision at every interaction** — buttons, inputs, focus states, and hover affordances should feel deliberate and finished. No rough edges.
3. **Breathable density** — work is visible without overwhelming. No information hidden behind layers, but no wasted space either. Every element earns its position.
4. **Craft in the details** — this is a learning portfolio. The quality shows in hover states, transition timing, empty states, and error messages — not just the happy path.
5. **Accessible by default** — WCAG AA is the floor: contrast ratios, keyboard navigation, focus rings, semantic markup. Not a checkbox; a baseline expectation.

## Accessibility & Inclusion

- Target: WCAG 2.1 AA
- All interactive elements keyboard-navigable with visible focus indicators
- Color is never the sole conveyor of meaning (status columns must have text labels, not just color tags)
- Reduced motion: any animations added must respect `prefers-reduced-motion`
- Semantic HTML throughout (proper heading hierarchy, `<article>`, `<section>`, `<label>` elements)
