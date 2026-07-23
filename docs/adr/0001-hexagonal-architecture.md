# ADR 0001: Adopt Hexagonal (Ports & Adapters) Architecture

- **Status:** Accepted
- **Date:** 2026-07-23
- **Deciders:** The Architecture Review Board (one person, wearing several hats)

## Context

We must display the date exactly 18 years ago from today, so that a person born
on that date is turning 18 and may legally purchase spirits in Germany.

A naive implementation would be:

```html
<script>document.body.textContent = new Date(Date.now()).getFullYear() - 18;</script>
```

This was rejected on the grounds that it is testable, readable, and finishes in
an afternoon, none of which generate architecture diagrams.

## Decision

We will implement a Hexagonal Architecture with four concentric layers:

1. **Domain** — pure business rules (value objects, entities, domain services).
2. **Application** — use cases orchestrating the domain via ports (CQRS).
3. **Infrastructure** — adapters implementing the ports (clock, WASM, i18n,
   telemetry) and the composition root / DI container.
4. **Presentation** — Web Components, a finite state machine, and design tokens.

Dependencies point strictly inward (the Dependency Rule). The domain knows
nothing of WebAssembly, DOM, or the passage of real time.

## Consequences

- **Positive:** Every layer is independently testable and swappable. We could
  replace the browser with a CLI, or the year with a quaternion, at minimal
  cost. The word "hexagonal" now appears in our README.
- **Negative:** There are now ~25 source files to compute `y - 18`. This is
  considered acceptable, indeed, the entire point.
