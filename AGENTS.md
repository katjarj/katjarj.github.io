# AGENTS.md

Instructions for any AI agent working on this repo. Read fully before editing.

## Project
Katja Radovic-Jonsson's personal site (resume content plus personality). Repo: `katjarj.github.io`, served at https://katjarj.github.io via GitHub Pages.

## Workflow rules (from the owner)
- Append every prompt the owner gives you to `PROMPTS.md`, verbatim, numbered. Redact personal contact details (phone, email) as `[redacted]`. This repo is public.
- Keep this file current when decisions change.

## Stack
Astro (static output), plain CSS (no Tailwind, no UI kit), a little vanilla JS. Fonts are self-hosted via Fontsource: Fraunces Variable (text and headings, uses SOFT/WONK axes) and Barlow Condensed (dates, section titles, trail-sign feel). Do not swap in generic fonts (Inter, Roboto, etc.).

## Content
All resume content lives in `src/data/resume.js`. Edit content there, not in markup. `Entry.astro` renders one entry. Project difficulty (`green`/`blue`/`black`) is a ski-trail-style rating; initial values are agent guesses, to be confirmed by the owner.

## Design
- Concept: minimal editorial layout with ski and Pacific Northwest details, not a literal mountain hero.
- Modes: `bluebird` (light, Alpenglow: cream #F3ECE2, plum #3B2A3F, coral #F0805A) and `night ski` (dark: spruce #12201B, amber #FFB340). CSS variables live in the global style block in `src/pages/index.astro`; mode is stored in localStorage (try/catch) and set as `data-mode` on `<html>`.
- Signature element: one full-screen `<canvas id="world">` holding the whole scene — sky, three tiled ridgelines, the snow slope, and the firs. Every run pans that single canvas.
  - The world repeats horizontally with period `W` (viewport width): ridges and fir bands are both drawn tiled, so there is never a seam.
  - A run crosses a whole number of periods (`PERIODS_STRAIGHT = 2` for green/double-black, `PERIODS_ANGLED = 1` for blue/black) and starts and ends at anchors (multiples of `W`), so the trees, snow and sign come back identical. Runs are horizontal only — `cam` has no vertical axis, the camera never lifts, and the view never drifts with the cursor. Duration scales with distance (`PAN_MS = 1600` for a two-period run), so the world always slides past at one constant speed; eased in and out. A run is translation only — never a cross-fade, never a rotation.
  - Ridges move at 6% / 18% / 40% of the camera and stars at 3%, for parallax. That means the far ridges keep a drifting phase across runs (deliberate: no snapping, so nothing ever pops).
  - Clicking while a run is in flight turns the run around (the camera keeps its position; the new pan starts where it is and ends on the nearest anchor).
  - The snow is one flat gradient with nothing drawn on it (no contour lines); the firs and the ridges are what show the movement.
  - `prefers-reduced-motion`: no pan at all — the section appears at once.
- Forests: PNW spire firs — a bare leader, then nine overlapping tiers, each a downward chevron so the union is solid while the sides serrate. Each tier hangs for `h * 0.26` but is clipped at `hemY`, and the lowest tier ends on a shallow flat hem with the trunk below it, so a fir never tapers to a point or flares into a cup. Placed as seeded bands (`FIRS`, `srng(83)`) mirrored to both shoulders, far trees pale blue, near trees dark. Heights scale with the viewport, capped so a fir is never wider than a fifth of the screen. Every visible fir from every tile goes into one list sorted by depth before drawing — the forest must never be painted tile by tile, or a pale far tree lands on top of a dark near one.
- Avoid: decorative gradients, card grids, ALL CAPS labels, fade-in-on-scroll everywhere, icy-blue palettes.

## Privacy (hard rules)
- Never add the owner's phone number or any email address anywhere (site, repo, commits, docs).
- Contact is LinkedIn and GitHub links only.
- Never commit the resume .docx or any file containing contact details.

## Deploy
Push to `main`; `.github/workflows/deploy.yml` builds and deploys. One-time: repo Settings, Pages, Source = GitHub Actions. Repo must be public.

## Commands
`npm install`, `npm run dev`, `npm run build`, `npm run preview`.

## Open items
- Confirm GitHub username in `links.github`.
- Co-op and TA entries ended Aug 2026; owner may want a "now" section.
- Confirm project difficulty ratings.
- Confirm the fir shape (flat hem, visible trunk stub, nine tiers) reads right on a phone as well as a desktop.
