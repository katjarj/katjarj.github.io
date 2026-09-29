# katjarj.github.io

**katjarj.github.io** — a personal site that is also a ski trail map.

You land at a signpost at the top of a mountain. Four runs leave it: Experience,
Personal Projects, Extracurricular and Skills. Each one is colour-coded and
arrowed the way a real run would be — green circle, blue square, black diamond,
double black — and taking one pans the camera across the same scene until you
arrive at the trail map again, a little further along. Nothing about the
landscape changes. You just ski through it.

It is built with [Astro](https://astro.build), plain CSS and a little vanilla
JS. No framework, no UI kit.

## About

I'm Katja, a computer science student at UBC. I build things at hackathons,
teach CPSC, and spend winters teaching skiing at Whistler Blackcomb.

- **Experience** — a software developer co-op in digital health, a teaching
  assistantship, ski instructor, private math tutor, retail tech
- **Personal Projects** — five hackathon builds, a course project, and this
  website
- **Extracurricular** — club leadership at UBC Women in Computer Science and
  STEM Sorority, plus student newspaper
- **Skills** — Python, C++, Java, C, R, Racket; TypeScript, React, Next.js;
  and a rotating pile of tools

Current roles are marked *present* rather than by end date. Based in Vancouver,
BC, and willing to relocate.

## Running it locally

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output to dist/
npm run preview  # serve the built site
```

Astro needs **Node 22.12 or newer**. Formatting is Prettier
(`npm run format`); see `AGENTS.md` for the design system, the sign's data
model, and the rules for working on this repo.

## Deploying

Push to `main`. [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)
builds and publishes to GitHub Pages. One-time setup: repo Settings → Pages →
Source = **GitHub Actions**. The repo has to be public.

## Credits

The bear icons on the landing page are
[Flaticon](https://www.flaticon.com/free-icons/bear) by Victoruler. Type is
Fraunces and Barlow Condensed, both via Fontsource.
