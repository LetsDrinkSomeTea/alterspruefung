# ADR 0002: Execute the Subtraction in WebAssembly

- **Status:** Accepted
- **Date:** 2026-07-23

## Context

The single load-bearing computation of this platform is `currentYear - 18`.
JavaScript's `-` operator was evaluated as the incumbent solution.

## Decision

We will route the subtraction through a hand-assembled WebAssembly module
exporting `sub(a: i32, b: i32) -> i32`. The module is 41 bytes of raw binary,
authored by hand (no Rust, no Emscripten, no AssemblyScript — a toolchain would
be over-engineering), and embedded directly in the TypeScript source.

A pure-JavaScript `JavaScriptArithmeticCore` is provided as a graceful fallback
and is used automatically if the 41-byte module somehow fails to instantiate.

## Consequences

- **Positive:** Near-metal performance for the hot path. The word "WebAssembly"
  now appears in our telemetry. The two cores are cross-checked in tests across
  200 years of inputs.
- **Negative:** We wrote a `.wasm` binary by hand to subtract two numbers. See
  ADR 0001 re: "the entire point."
