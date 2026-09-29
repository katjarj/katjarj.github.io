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

The file runs in **the order the site navigates**, one `───` banner per section, so the shape of the site is readable top to bottom:

| Section | Exports |
| --- | --- |
| Who | `links`, `intro` |
| The trail map | `trailMap` — the four landing runs; every `id` names a layer |
| Experience | `experience` (all entries, flat) + `experienceGroups` (the sub-sign) |
| Projects | `projectCategories` (the sub-sign) + `projects` |
| Extracurricular | `extracurricular` |
| Skills | `skills` |

- **One flat `experience` array, tagged not bucketed.** It used to be `education` (a lone object) + `work` + `other`, split by employment type — but the site only ever filters by the `group` tag, so those buckets were a leftover from the source document. The page's `const experience = [education, ...work, ...other]` special case is gone. Array order is only ever seen *within* a group, so entries are ordered by the sub-signs and dropping a job in anywhere is safe.
- **Sign-row arrays sit with the content they divide**: `experienceGroups` right after `experience`, `projectCategories` right before `projects`.
- Entries are plain objects: `title`, `org`, `when`, `pts` (an array of bullet strings). Grouping is by a tag on the entry — `group` for experience, `cat` for projects — matched against an id in the array that owns the label and rating (see Signs). Adding an entry is one object; adding or re-ordering a whole group is a one-line change to that array. Only the _signs_ carry a trail rating, in a `diff` field; individual entries do not.
- **`extracurricular` is grouped per organisation by the page** (`byOrg` in the frontmatter), not here — so keep one org's roles next to each other; the page folds them in order.

## Design

Concept: minimal editorial layout with ski and PNW details, not a literal mountain hero.

### Modes and palette

Two modes, `data-mode="day"` (bluebird) and `"night"` (night ski), stored in localStorage behind a try/catch and set on `<html>`. All variables live in the global style block in `src/pages/index.astro`.

- **Switching modes is a sunrise, not a cross-fade.** `blend` runs 0 (day) → 1 (night) over `MODE_MS` on a private rAF loop, and the whole palette is mixed along the way: `mixAt()` runs day → `MID` → night. `MID` is **which hour the change passes through, and it differs by direction** — `GOLD` on the way down, `DAWN` on the way up, set once in `runModeChange` and read inside `mixAt`, so a new colour variable has to be added to `VARS`, `GOLD` **and** `DAWN`. Both real palettes are read straight out of the CSS by `readAll()`, which briefly wears each mode, so the stylesheet stays the one place a colour is written down. `GOLD` and `DAWN` are the only colour literals in the script.
- **`GOLD` is near-day bright and `DAWN` is not, on purpose.** The sunset has the sun in frame to justify a punchy orange (bg luminance 208); the sunrise has none, so `DAWN` sits at roughly the **midpoint of night and day for every colour** (bg 141). That is what makes the sunrise smooth rather than a lurch — reusing `GOLD` put 90% of the luminance change into the first half. The other half of the fix is that **`DAWN` is warm, not grey**: a sunrise with no colour in it just reads as a grey fade. The warmth is concentrated where it shows, `--sky-lo` (horizon) and `--snow` (the largest area on screen) at ~40% saturation against `GOLD`'s 83–89%, with the top of the sky left a dusky violet because that is what a dawn overhead is. Warmth at a *fixed luminance* is free — measured per frame, peak luminance change 3.21 → 3.16 and saturation swing 1.43 → 1.47, against 6.13 / 7.70 for the original `GOLD`-on-the-way-up. The chroma swing is what the eye reads as a jolt; the fade itself is not.
- **Easing is `smoothstep` (`k²(3−2k)`), and the "nicer" curves are worse here.** `easeInOutQuad` and `smootherstep` have more peaked curves (max rate 2.0 and 1.875 vs 1.5), which concentrate *more* of the change into the middle — the opposite of what is wanted. All three were measured; do not "upgrade" this to a higher-order ease.
- **The DOM has to travel too.** The canvas is only half the page; the cards and the sign are opaque DOM. `paintChrome()` writes each mixed value as an **inline** property on `<html>` each frame (inline beats any selector, so `[data-mode='night']` cannot fight it), and `releaseChrome()` drops them all at the end so the stylesheet is back in sole charge. `data-mode` is set immediately on click, before the animation, which is safe for exactly that reason.
- **The sun only sets, and only during a change.** The view faces west, so a sunset is in front of you and a sunrise comes up behind your back: `sunSets` is `to > from` in `runModeChange`, so switching **to night** shows the sun going down and switching **to day shows none**. The golden light is still used either way — dawn is warm too, it just arrives from off-screen. `drawSun()` also returns early unless `0 < t < 1`, so both resting scenes are pixel-identical to what they were before this existed. It is drawn *before* `drawRidge(RIDGE_FAR, …)`, which is the whole trick: the far ridge is an opaque fill, so it cuts the disc in half as the sun drops behind it. Its path is **absolute in H** (`SUN_TOP` −0.08 → `SUN_END` 0.34), not relative to the ridge — a ridge-relative arc made the visible window swing from 1156ms to 312ms depending on where the peak happened to be, because the far ridge spans 0.08H–0.30H. A tall peak still swallows the sun sooner than a low shoulder, which is correct; it just no longer decides where the arc starts.
- **Stars are the sun's opposite number.** `Palette.night` is gone; it is `starAlpha`, a float, and `drawStars` multiplies each star's alpha by it, so they come out as the sun goes down and go in as it comes up. They used to be a hard `if (!p.night) return`.
- `prefers-reduced-motion` short-circuits the whole thing: the two scenes swap instantly, no sun, no fade — the old behaviour.

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

Two kinds of Back share one handler, and both now carry their own `data-dir`: a sign's Back row pans the way its arrow points, and a card page's Back button pans the way its arrow points. **Every Back's arrow and its pan come from the same value**, so they cannot disagree — this is the same rule as `diff` driving both a run's class and its `<Symbol>`. The card page's direction is `MIRROR_DIR[run.dir]`, derived at build time from the run that reached it (`backDir` on `LAYERS`/`projectLayers`, `backOf(trailMap, …)` for the two top-level pages); it was previously a hardcoded `←` text glyph on all four, which was wrong on all but one. `MIRROR_DIR` in the frontmatter and `MIRROR` in the script are twins and must stay identical; `MIRROR[lastDir]` is only the fallback for a Back with no direction of its own. The forward handler is scoped `.run-btn:not([data-back])` so the two never both fire on one button. **Back must not set `lastDir`** — that has to keep meaning "the run you skied to get here", or repeated Backs would mirror an already-mirrored direction and drift off course.

### Cards

Sections are cards, not a list on bare snow. `.entry` is `--post` timber at a 10px radius; `.entries` is a one-column grid, and projects use `.entries-2` (two columns, collapsing to one below 720px). Extracurricular is grouped by organisation into `.entry-org`, with `.org-name` as the card title and each role in a `.role` block.

**Card text is the sign's cream, never the page's `--ink`** — `--ink` is a dark plum in bluebird and would sit at 1.7:1 on brown. Card colours hang off `--card-ink` / `--card-body` / `--card-dim` / `--card-line`; **`--card-dim` is 84% and must not go lower**, the first value clearing 4.5:1 on `--post` in _both_ modes (72% drops the dates to 3.8:1 in night ski).

### Mobile

The scene is full-bleed, so a phone sees less of it and the same words sit over different ground than on a wide screen. Every phone rule lives in one **`max-width: 779px`** block near the end of the page's global style block, and a second `(max-height: 520px) and (orientation: landscape)` block beside it. **Desktop is untouched** — the scrim and the touch-target padding are phone-only by decision, because the desktop look (text floating on snow) is the one the owner wants.

- **There is no scrim, and there must not be one.** Three attempts at giving the card-page heading something behind it were all rejected by the owner: a full-page `linear-gradient` on `.sec-inner::before`, a tighter one on a `.sec-head` wrapper, and then a `text-shadow` halo in `--bg`. They failed for three separate reasons and none of them was a tuning problem — a wash with edges reads as a box sitting on the snow however finely it is tuned, **"decorative gradients" are on the Avoid list below**, and the halo was simply unwanted. **The h2 sits on the world on mobile exactly as it does on desktop. Leave it alone.** The same goes for every other element: the cards are opaque `--post` panels and the back button is a solid chip, so nothing on a card page needs a background. Do not propose a fourth.
- **`position` is load-bearing on `.bears`.** The mobile block gives the pair `left`/`right`/`bottom`; without `position: fixed` those offsets are inert and the pair falls into normal flow at the top of the body, on top of the name. This was a live bug, not a hypothetical.
- **`.bear` must stay a containing block on mobile.** `.bear-text` is `position: absolute` (`left`/`top` in percent of the bear's flank), so it anchors to `.bear` — which is `position: absolute` on desktop. The phone block sets `.bear { position: relative }`, never `static`: `relative` keeps the bear in the flex row *and* re-establishes the containing block, whereas `static` lets both labels fall through to the now-fixed `.bears` and pile into the middle of the pair. Switching absolute → relative also converts the desktop `left`/`right`/`bottom` into relative *offsets*, so the phone block resets them with `inset: auto` **and** an explicit `.bear:first-of-type, .bear:last-of-type { left: auto; right: auto }` — the pseudo-class selectors out-specify a bare `.bear`, and a media query adds no specificity of its own.
- **Breakpoints are disjoint on purpose.** The wide-screen `.sec-inner` padding is `min-width: **780px**`, not 700. An overlapping 700/779 pair means both apply between 700 and 779 and source order silently decides — raise one, never both.
- **Landscape is height-bound, not width-bound.** The sign is ~398px tall (4 rows at ~55px + 40px cap + 84px post) and an iPhone in landscape offers ~347px, so it overflows. The **post is the only compressible part** (84px → 34px); the board and cap are fixed. `orientation: landscape` is in the query so a short desktop window does not get a stubby post.
- `text-size-adjust: 100%` is pinned on `html`: iOS Safari inflates text in landscape, which silently changes every `clamp()` in the file. Notch/home-indicator clearance is `env(safe-area-inset-*)` via `max()`, on the mode button, the bears and the credit.
- `.sec-scroll` is the only thing that scrolls on a phone, so it carries `overscroll-behavior: contain` — the page behind it must not rubber-band.

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
