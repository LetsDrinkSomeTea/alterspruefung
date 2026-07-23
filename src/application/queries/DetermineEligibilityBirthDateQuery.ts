import type { LocaleTag } from "../ports/TranslationPort.js";

/**
 * A Query in the CQRS sense: an immutable request for information that causes
 * no state mutation. Commands would live in a parallel hierarchy, but this
 * system is, mercifully, read-only. (An event-sourced write side was scoped
 * but deferred to Q3 — see docs/adr/0004.)
 */
export class DetermineEligibilityBirthDateQuery {
  public constructor(
    public readonly beverageClass: "spirits" | "beer-and-wine",
    public readonly locale: LocaleTag
  ) {
    Object.freeze(this);
  }
}
