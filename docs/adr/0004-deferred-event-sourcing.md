# ADR 0004: Defer the Event-Sourced Write Side to Q3

- **Status:** Proposed (indefinitely)
- **Date:** 2026-07-23

## Context

The current system is read-only: it answers "what birth date turns 18 today?"
A truly complete CQRS implementation would pair this read side with an
event-sourced write side capable of recording, e.g., `AgeVerificationAttempted`
and `SpiritsPurchaseAuthorised` events into an append-only log.

## Decision

We acknowledge the write side in our architecture, gesture at it confidently in
stakeholder meetings, and defer its implementation to "Q3" — a quarter that,
much like the legal drinking date, is always exactly some fixed distance away.

## Consequences

- **Positive:** The architecture appears complete without the cost of building
  half of it. Nobody stores anything, which is excellent for GDPR.
- **Negative:** None. This is the finest kind of decision: one that produces a
  document and no code.
