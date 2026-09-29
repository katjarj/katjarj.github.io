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

**Never write `font:` shorthand in a rule that also sets `font-variation-settings`.** The shorthand *resets* the variation settings, and the production minifier reorders declarations so the shorthand lands last — which silently discarded the SOFT/WONK/opsz axes in the built site and rendered Fraunces with its default, sharper cuts. Dev was unaffected (no minifier), so this only ever showed up on preview and the deployed site. Use the longhands (`font-family`, `font-size`, `font-weight`, `line-height`) for every Fraunces rule. It applies only to Fraunces; the Barlow Condensed shorthands are safe, having no variation settings to lose.

## Content

All resume content lives in `src/data/resume.js`. Edit content there, not in markup. Cards are rendered by `Card.astro`; the only card written inline is the extracurricular one.

Entries are plain objects: `title`, `org`, `when`, `pts` (an array of bullet strings). Grouping is by a tag on the entry — `group` for experience, `cat` for projects — matched against an id in the array that owns the label and rating (see Signs). Adding an entry is one object; adding or re-ordering a whole group is a one-line change to that array. Only the _signs_ carry a trail rating, in a `diff` field; individual entries do not.

## Design

Concept: minimal editorial layout with ski and PNW details, not a literal mountain hero.

### Modes and palette

Two modes, `data-mode="day"` (bluebird) and `"night"` (night ski), stored in localStorage behind a try/catch and set on `<html>`. All variables live in the global style block in `src/pages/index.astro`.

- **There is no peach.** The old coral `#F0805A` was ~2.5:1 on the cream — a fine decorative wash, far too low for text. `--accent` is now `var(--ink)` in bluebird (high contrast in both modes); night ski still overrides it with amber. Four rules consume it, all `:focus-visible` outlines.
- **The sign is two browns and nothing else.** `--sign-bg` (`#3a2a26`) for the board and the mode button's fill; `--post` (`#6a4a46`) for the cap, the Back row, the post and the button's hover. `--sign-rim`, the old gold, has been **deleted** — not just unused. `--post` is the bears' own flank brown, sampled from the PNG, so the sign is the bears' material and does not dim at night.
- **The mode button is the one element that inverts**: a dark plate in bluebird, the sign's cream with a near-black label in night ski, driven off `--btn-fill` / `--btn-hover` / `--btn-text` so a state change is one line. Its border is `2px solid var(--sign-bg)` — the fill colour, so there is no visible outline, but the 2px holds the button's size and follows the fill on hover so no ring appears.
- **Contact is two bears on the snow** — LinkedIn left, GitHub right — standing on `public/bear.png` (Flaticon, Victoruler; the attribution is required by the licence and sits with them in `.credit`). The label is **real HTML text** on the bear's flank, not baked into the PNG, so it stays selectable and is read by screen readers; the `<img>` is `alt="" aria-hidden`. **They live outside every `.layer`** and are pinned to the viewport at `z-index: 20` — above the section pages (10), below the mode button (300) — so they survive a pan. They are shown **only on a layer that actually contains a sign** (`showLayer` tests for `.sign-wrap`), and they cross-fade in and out on every transition: the trail map and the two sub-signs get them, every card list does not. `visibility: hidden` is what takes them out of the tab order and the hit-testing, not just the paint — an `opacity: 0` link would still be focusable and still clickable through a card. The credit leaves with them, since it is their attribution. `.bears` is `display: contents` so each bear can position itself; below 780px the pair centres on the foot of the viewport instead, still fixed, since in flow they would scroll away.
- Signature element: one full-screen `<canvas id="world">` holds the whole scene — sky, three tiled ridgelines, the snow slope, the firs. Every run pans that one canvas; the environment never changes, it only moves.
  - The world repeats with period `W` (viewport width). Ridges and fir bands are both drawn tiled, so there is never a seam.
  - A run crosses a **whole number of periods** (`PERIODS_STRAIGHT = 2` for the left/right runs, `PERIODS_ANGLED = 1` for the angled pair — keyed on shape, not colour) and starts and ends on anchors (multiples of `W`), so trees, snow and sign come back identical. `PAN_MS = 1600` for a two-period run and scales with distance, so the world always slides at one constant speed, eased in and out.
  - `cam` has **no vertical axis**: the camera never lifts, and the view never drifts with the cursor. A run is translation only — never a cross-fade, never a rotation.
  - Ridges move at 6% / 18% / 40% of the camera, stars at 3%. The far ridges therefore keep a drifting phase across runs — deliberate, so nothing ever pops.
  - `MIRROR` reverses the **camera's travel, not the arrow**: an upright run (right, one period) mirrors to `upleft` (left, one period). Mapping it to itself would pan further in the same direction.
  - Clicking while a run is in flight turns it around — the camera keeps its position and the new pan ends on the nearest anchor.
  - The snow is one flat gradient with nothing drawn on it. The firs and the ridges are what show the movement.
  - `prefers-reduced-motion`: no pan at all; the section appears at once.
- Forests: PNW spire firs — a bare leader, then nine overlapping tiers, each a downward chevron, so the union is solid while the sides serrate. Each tier hangs for `h * 0.26` but is clipped at `hemY`, and the lowest tier ends on a shallow flat hem with the trunk below, so a fir never tapers to a point nor flares into a cup. Placed as seeded bands (`FIRS`, `srng(83)`).
  - Placement is **crest-relative**: each band sits `d0`/`d1` below the snow crest in units of `H`, never on an absolute screen line, or the treeline floats above the snow at the sides of the viewport where the crest drops ~46px. The base comes from `snowTopY(x)` — the same quadratic the slope is filled with — so slope and forest can never disagree about where the ground is.
  - Spacing is **stratified**: each band is cut into `n` equal slots with exactly one fir per slot, nudged off its slot centre by a seeded jitter (`JITTER = 0.38`). Pure random clumps the shoulder and leaves bald patches.
  - Four flat tones (`--tree-1` palest to `--tree-4` darkest) dealt round-robin from a seeded offset, so a thick shoulder does not blend into one mass and all four always appear. The left shoulder carries `extraL` extra firs and may weight its own tone cycle (`tonesL`), so the two sides are deliberately unequal.
  - **Every visible fir from every tile goes into one list, sorted by depth, before drawing.** The forest must never be painted tile by tile, or a pale far tree lands on top of a dark near one. Heights scale with the viewport, capped so a fir is never wider than a fifth of the screen.
### Signs

`Sign.astro` is the only place a sign is drawn: cap, board of runs, post. A new sign is an array plus one line of markup. The `.layer` wrapper stays in the page — it carries the `id` and the `active` class, which is navigation state, not presentation.

- A run is `{ id, title, diff, dir }`. **`diff` drives both the `.run-*` class and the `<Symbol>` from one value**, so a row's colour and its symbol can never drift apart. `dir` is the arrow and the way the camera travels.
- **A run with no `diff` is unrated**: `Sign.astro` gives it `run-back` styling and no symbol. That is what every Back row is, and it is how any sign adds its own way home.
- **Back points at its parent** — the reverse of the run that reached the sign. Each sign has its own direction list in the frontmatter.
- The click handler binds to `.run-btn` generically, so **a new sign's rows need no JavaScript at all**.

| Sign | Cap | Rows |
| --- | --- | --- |
| Trail map | `TRAIL MAP` | `trailMap` |
| Experience | `EXPERIENCE` | `groups` + Back → |
| Projects | `PROJECTS` | `projectCats` + Back ↗ |
| Skills | — | one page, banded by header |

The Experience sub-sign is reached by the green left run, so its Back is →; Projects is reached by the blue up-left run, so its Back is ↗. Each sub-sign generates its own list layers from the same array, so a new group or category needs no new markup. A group with no matching entries is filtered out and is drawn as neither a run nor a layer. **Skills is deliberately not a sign**: its three categories are not a choice, they are one list, so the double-black run opens a single page with a card per category under an `.org-name` header.

The `.back-btn` on a list page is a **solid `--post` chip, not an outline**: outlined, it was only 4.5:1 on the cream and read as faint, and a solid chip is 6.7:1 while matching the sign's own Back row — the button looks like the run you came down. It hovers with the same `rgba(255,255,255,0.10)` wash as a run row.

**Flat by design**: solid fills, no borders, no shadows, no gradients, no motion on hover. Corner radii are the one concession — 10px cap and board, 7px each run button, 4px at the foot of the post. The **cap stays content-sized** and centred: a full-length cap reads as a header strip, and the overhang is what makes it a sign cap. The board's `padding` and `gap` are both the thickness of the dark frame showing around and between the rows, so they are design values, not just spacing. `.run-name` is `white-space: nowrap` so no row is taller than the row opposite it.

### Navigation

A **stack** (`trail` / `current`), not a hardcoded target. Back pops the layer you actually came from, so a list returns to the sign above it and a sign nested any depth returns to _its_ parent.

Two kinds of Back share one handler. A list's Back has no `data-dir` and retraces via `MIRROR[lastDir]`; a sign's Back row carries its own `data-dir` and pans the way its arrow points. The forward handler is scoped `.run-btn:not([data-back])` so the two never both fire on one button. **Back must not set `lastDir`** — that has to keep meaning "the run you skied to get here", or repeated Backs would mirror an already-mirrored direction and drift off course.

### Cards

Sections are cards, not a list on bare snow. `.entry` is `--post` timber at a 10px radius; `.entries` is a one-column grid, and projects use `.entries-2` (two columns, collapsing to one below 720px). Extracurricular is grouped by organisation into `.entry-org`, with `.org-name` as the card title and each role in a `.role` block.

**Card text is the sign's cream, never the page's `--ink`** — `--ink` is a dark plum in bluebird and would sit at 1.7:1 on brown. Card colours hang off `--card-ink` / `--card-body` / `--card-dim` / `--card-line`; **`--card-dim` is 84% and must not go lower**, the first value clearing 4.5:1 on `--post` in _both_ modes (72% drops the dates to 3.8:1 in night ski).

### Components

`Symbol.astro` (`<Symbol diff=… label />`) and `Arrow.astro` (`<Arrow dir=… />`) are the single source for the difficulty glyphs and the run arrows, so they can never drift apart in shape or size. An `up` glyph is defined but unused by the four-way fan. **Neither component sets any dimension — CSS owns size.**

Project screenshots live in `public/projects/`, referenced as `/projects/<name>.png` and **resized to 1200px wide** — the originals are several thousand pixels and 9.8MB in total, far more than a card slot needs. `Card.astro` is the one card for every entry. A project card is that card plus a `.shot` slot and a `.card-link` glued to the foot, so `img` and `github` are the only optional parts: an experience entry simply omits them, and an empty one falls back to a labelled placeholder. It takes the whole entry as `entry` and carries no `<style>`, because the card rules are in the page's global block — a card is the sign's timber wherever it lands.

The extracurricular card is the odd one out: it adds an org heading and a list of roles, so it stays inline in the page.

### Avoid

Decorative gradients, card grids, ALL CAPS labels, fade-in-on-scroll everywhere, icy-blue palettes.

## Privacy (hard rules)

- Never add the owner's phone number or any email address anywhere (site, repo, commits, docs).
- Contact is LinkedIn and GitHub links only.
- Never commit the resume .docx or any file containing contact details.

## Deploy

Push to `main`; `.github/workflows/deploy.yml` builds and deploys. One-time: repo Settings, Pages, Source = GitHub Actions. Repo must be public.

Astro needs **Node >= 22.12.0** (it refuses to run on 20). Local dev is Node 24, and the number is also declared as `engines.node` in `package.json`. The workflow pins it explicitly with `withastro/action`'s `node-version` input, because that action's own default is still Node 20 — which is exactly how the CI build fails while a local build passes. If the runner ever reports an unsupported Node again, that input is the first thing to check.

## Commands

`npm install`, `npm run dev`, `npm run build`, `npm run preview`.

Formatting is Prettier (`npm run format`, `npm run format:check`). It is a dev dependency, not a runtime one — if `format` reports a missing binary, run `npm install --save-dev prettier prettier-plugin-astro` rather than editing files by hand. It is not yet installed.

## Open items

- Co-op and TA entries ended Aug 2026; owner may want a "now" section.
- Confirm the fir shape (flat hem, visible trunk stub, nine tiers) reads right on a phone as well as a desktop.
- The left foreground firs lean darker than the right (`tonesL`); worth a look on both modes.
