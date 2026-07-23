# 🍺 Altersprüfung — Enterprise Edition

> A cloud-native, domain-driven, hexagonal, CQRS, WebAssembly-accelerated,
> internationalised, offline-capable, feature-flagged platform for computing
> **today minus eighteen years**.

The website shows the date on which a person must have been born to turn 18
(or 16, for beer & wine) **today** — the German legal minimum age to buy
alcohol. This is one subtraction. We have surrounded it with an enterprise.

## Why?

Because the requirement was: _"make it completely over-engineered for what it
should be — but it must still be hostable on GitHub Pages."_ Challenge accepted.
The output is 100% static files. It deploys to GitHub Pages. It is also absurd.

## The one line this all replaces

```js
new Date().getFullYear() - 18
```

## What we built instead

| Concern | Over-engineered solution |
| --- | --- |
| Subtraction | Hand-assembled 41-byte **WebAssembly** module (`i32.sub`), JS fallback |
| Business rules | **Domain layer** — immutable value objects & an aggregate root |
| Orchestration | **Application layer** — CQRS query + handler, hexagonal **ports** |
| Wiring | **Composition root** with a hand-rolled **DI container** |
| The clock | Hidden behind a `ClockPort` so the core is pure & deterministic |
| Text | Six-locale **i18n** (de, en, Bavarian, Latin, Klingon, Emoji) |
| Observability | GDPR-perfect **no-op telemetry** with spans |
| UI | **Web Component** + Shadow DOM + a **finite state machine** |
| Styling | **Design tokens** → CSS custom properties |
| Config | **Feature flags** resolved from URL query params |
| Offline | **Service worker** + installable **PWA** manifest |
| Spectacle | Matrix-rain background + confetti (feature-flagged) |
| Delivery | **CI/CD** pipeline: type-check → test → build → deploy |
| Governance | Four **Architecture Decision Records** |

Architecture: `presentation → application → domain ← infrastructure`
(dependencies point inward; see [ADR 0001](docs/adr/0001-hexagonal-architecture.md)).

## Local development

```bash
npm install
npm run dev        # Vite dev server
npm test           # Vitest — includes cross-checking WASM vs JS over 200 years
npm run build      # tsc --noEmit && vite build  →  ./dist
npm run preview    # serve the production bundle
```

## Feature flags

Append to the URL:

| Flag | Effect | Default |
| --- | --- | --- |
| `?ff.wasm-arithmetic=off` | Use the JS arithmetic core | on |
| `?ff.debug=on` | Log telemetry spans to the console | off |
| `?ff.confetti=off` | Disable the celebratory confetti | on |
| `?ff.matrix-rain=off` | Disable the Matrix-rain background | on |
| `?locale=tlh` | Force a locale (`de-DE`,`en-US`,`de-BY`,`la-VA`,`tlh`,`emoji`) | auto |

## Deploying to GitHub Pages

Two supported paths — pick one:

**A. GitHub Actions (recommended, already wired).**
The workflow in `.github/workflows/deploy.yml` type-checks, tests, builds, and
deploys `dist/` on every push to `main`. Enable it once:

> Repo **Settings → Pages → Build and deployment → Source → GitHub Actions**

The site publishes at `https://<owner>.github.io/alterspruefung/`. The Vite
`base` is set to `/alterspruefung/` in `vite.config.ts` — change it if the repo
is renamed, or set it to `/` for a `<user>.github.io` root site.

**B. Branch-based (no build step) — if you insist on committing artifacts.**
Run `npm run build` and commit the contents of `dist/` to the branch/folder your
Pages source points at. Not recommended; the whole point of the pipeline is that
you never hand-build again.

## License

WTFPL. It computes `y - 18`.
