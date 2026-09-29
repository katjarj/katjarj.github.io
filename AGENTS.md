# AGENTS.md

Instructions for any AI agent working on this repo. Read fully before editing.

## Project
Katja Radovic-Jonsson's personal site (resume content plus personality). Repo: `katjarj.github.io`, served at https://katjarj.github.io via GitHub Pages.

## Workflow rules (from the owner)
- Append every prompt the owner gives you to `PROMPTS.md` before taking action, verbatim, numbered. Redact personal contact details (phone, email) as `[redacted]`. This repo is public.
- Keep this file current when decisions change.
- Do NOT commit files without explicitly being told to.
- Do not run build commands, etc. automatically. Let the user know if they need to be run.

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
- Forests: PNW spire firs — a bare leader, then nine overlapping tiers, each a downward chevron so the union is solid while the sides serrate. Each tier hangs for `h * 0.26` but is clipped at `hemY`, and the lowest tier ends on a shallow flat hem with the trunk below it, so a fir never tapers to a point or flares into a cup. Placed as seeded bands (`FIRS`, `srng(83)`), each band cut into `n` equal slots with exactly one fir per slot, nudged off its slot centre by a seeded jitter (`JITTER`) — pure random clumps the shoulder and leaves bald patches, so spacing must stay stratified. Each band is placed by how far it stands *below the snow crest* (`d0`/`d1`, in units of `H`) — never by an absolute screen line, or the treeline floats above the snow at the sides of the viewport where the crest drops ~46px. The base comes from `snowTopY(x)`, the same quadratic the slope is filled with, so slope and forest can never disagree about where the ground is. Four flat tones (`--tree-1` palest to `--tree-4` darkest) instead of two, dealt round-robin from a seeded offset within each band, so a thick shoulder does not blend into one mass and both tones always appear. The left shoulder carries `extraL` extra firs, so the two sides are deliberately unequal. Heights scale with the viewport, capped so a fir is never wider than a fifth of the screen. Every visible fir from every tile goes into one list sorted by depth before drawing — the forest must never be painted tile by tile, or a pale far tree lands on top of a dark near one.
- The trail sign is **flat**: solid fills, no borders, no box/drop shadows, no gradients, and no motion on hover (no translate, no scale). Corner radii are the one concession to softness — 10px on the cap and board, 7px on each run button, 4px at the foot of the post. Hover is a flat `rgba(255,255,255,0.10)` wash via `::after` only. Note that `<button>` carries a 2px UA border, so `.run-btn` must set `border: 0` explicitly. The board is sized with a real `width: min(480px, 90vw)`, not `min-width` — it is a content-sized flex item, so `min-width` alone leaves it at its narrowest. **The cap stays content-sized and centred above it** — do not pin it to the board's width: a full-length cap reads as a header strip, and the overhang is what makes it a sign cap. The two signs read alike because the board is the same width and the stack below it is the same, not because every part is the same width. `.run-name` is `white-space: nowrap` so no row is ever taller than the row opposite it. Every sign carries the same four-part stack — cap, four runs, post, hint — so the sub-sign repeats the hint too. Arrow and symbol sizes live in CSS with `clamp()` and `height: auto`; the inline `width`/`height` attributes were removed because they would otherwise win. The difficulty symbols are sized by **height**, not width, in `.run-tag` (`--sym-h`), and the double-black pair needs no special case: every symbol's viewBox is 18 units tall with a 14-unit glyph centred in it, so one shared height gives all four the same pixel height and the same centre line, and each box's own aspect ratio supplies the width. The square is the one exception at 13 units rather than 14: a filled square covers its whole bounding box, a circle ~78% and a diamond ~50%, so at equal box height the square reads larger — a deliberate optical correction, centred on 9,9. `--sym-w` is `calc(var(--sym-h) * 31 / 18)`, where 31/18 is the double-black pair's own viewBox aspect — that box is the widest case and fixes the tag width, so the `31` must be re-derived if that viewBox is ever resized.
- **The sub-sign.** The green Experience run does not open a list — it opens a *second trail sign* (`layer-experience`), the same `<Sign>` object as the landing one. **Four options fan them out the way the main sign does: first ←, second ↖, third ↗, fourth →** (`DIRS` in the frontmatter, which the Back row's `dir: 'right'` completes). Left and right are the two-period traverses and the angled pair are one period each, so the pan distance already matches the arrow — nothing extra to animate.
- `groups` in `src/data/resume.js` owns the sub-sign: the order, the label and the `diff`. Each entry carries a `group: '<id>'` tag, so adding a job is a one-line change in the data and re-ordering or re-rating a whole group is a one-line change in `groups`. A group with no matching entries is filtered out (`LAYERS`) and is drawn as neither a run nor a layer. One layer per group is generated from the same array, so a new group needs no new markup.
- **Signs are data, and `Sign.astro` is the only place a sign is drawn.** `<Sign cap="SKILLS" runs={skillRuns} />` renders the cap, the board of runs, the post and the hint. A new sign is therefore an array plus one line of markup — never a copy of the sign's markup. The `.layer` wrapper stays in the page, because it carries the `id` and the `active` class, which is navigation state rather than presentation.
  - A run is `{ id, title, diff, dir }`. **`diff` drives both the `.run-*` class and the `<Symbol>` from one value**, so a row's colour and its symbol can never drift apart. `dir` is the arrow and the way the camera travels.
  - **A run with no `diff` is unrated**: `Sign.astro` gives it `run-back` styling and no symbol. That is what the Back row is, and it is how any sign adds its own way home.
  - The main sign's runs are `trailMap` in `src/data/resume.js`; the sub-sign's are built from `groups` plus a Back row. The click handler binds to `.run-btn` generically, so **a new sign's rows need no JavaScript at all**.
- Navigation is a **stack** (`trail`/`current` in the script), not a hardcoded target. Back pops the layer you actually came from, so a list returns to the sign above it and a sign nested any depth returns to *its* parent rather than to the map. Two kinds of Back share one handler: a list's Back has no `data-dir` and retraces the run via `MIRROR[lastDir]`, while a sign's Back row carries its own `data-dir` and pans the way its arrow points. The forward handler is scoped `.run-btn:not([data-back])` so the two never both fire on one button. Back must **not** set `lastDir` — that has to keep meaning "the run you skied to get here", or repeated Backs would mirror an already-mirrored direction and drift off course.
- `MIRROR` reverses the *camera's travel*, not the arrow, so an upright run (right, one period) mirrors to `upleft` (left, one period) — mapping it to itself would pan further in the same direction.
- Colour is the only thing telling the runs apart, so each rated run repeats its rating as a symbol. Experience's three groups are rated green (Technical), blue (Non-technical) and black (Education). **Back is deliberately unrated**: it wears `--sign-rim`, the sign's own frame brown, and carries no symbol, because it is wayfinding rather than a run — a rating colour would claim a grade it does not have, and double black in particular is the hardest run on the board.
- The four difficulty glyphs live in **one** place: `src/components/Symbol.astro` (`<Symbol diff="green|blue|black|dblack" label />`). The trail sign, the sub-sign, the project ratings and `Entry.astro` all render from it, so they can never drift apart in shape or size. The run arrows have the same treatment in `src/components/Arrow.astro` (`<Arrow dir="left|upleft|upright|right" />` — an `up` glyph is also defined but no longer used by the four-way fan), used only by `Sign.astro`. All three components set no dimensions — CSS owns size.
- Avoid: decorative gradients, card grids, ALL CAPS labels, fade-in-on-scroll everywhere, icy-blue palettes.

## Privacy (hard rules)
- Never add the owner's phone number or any email address anywhere (site, repo, commits, docs).
- Contact is LinkedIn and GitHub links only.
- Never commit the resume .docx or any file containing contact details.

## Deploy
Push to `main`; `.github/workflows/deploy.yml` builds and deploys. One-time: repo Settings, Pages, Source = GitHub Actions. Repo must be public.

Astro needs **Node >= 22.12.0** (it refuses to run on 20). Local dev is Node 24, and the number is also declared as `engines.node` in `package.json`. The workflow pins it explicitly with `withastro/action`'s `node-version` input, because that action's own default is still Node 20 — which is exactly how the CI build fails while a local build passes. If the runner ever reports an unsupported Node again, that input is the first thing to check.

## Commands
`npm install`, `npm run dev`, `npm run build`, `npm run preview`.

## Open items
- Confirm GitHub username in `links.github`.
- Co-op and TA entries ended Aug 2026; owner may want a "now" section.
- Confirm project difficulty ratings.
- Confirm the fir shape (flat hem, visible trunk stub, nine tiers) reads right on a phone as well as a desktop.
