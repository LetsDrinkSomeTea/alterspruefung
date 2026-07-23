# ADR 0003: Ship Six Locales Including Klingon

- **Status:** Accepted
- **Date:** 2026-07-23

## Context

The site targets German consumers and is written in German. Product raised the
strategic risk of one day expanding beyond the German-speaking market.

## Decision

We will implement a full interpolating i18n subsystem behind a `TranslationPort`
with six locales: Standard German (`de-DE`), English (`en-US`), Bavarian
(`de-BY`), Ecclesiastical Latin (`la-VA`), Klingon (`tlh`), and Emoji (`emoji`).
The active locale is auto-detected from `navigator.language` and overridable via
`?locale=tlh`.

## Consequences

- **Positive:** We are ready for the Klingon spirits market the instant it opens.
- **Negative:** Five of the six locales will likely never be selected by a real
  user. This is a rounding error next to the WebAssembly decision.
