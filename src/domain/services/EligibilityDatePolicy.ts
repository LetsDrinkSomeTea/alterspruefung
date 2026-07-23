import { CalendarDate } from "../value-objects/CalendarDate.js";
import { LegalDrinkingAge } from "../value-objects/LegalDrinkingAge.js";

/**
 * A stateless Domain Service encapsulating the single most important business
 * rule in the entire enterprise: to be exactly N years old today, you must
 * have been born exactly N years ago today.
 *
 * This rule is expressed declaratively so that, should the fundamental nature
 * of linear time ever change, we have a single point of modification.
 */
export class EligibilityDatePolicy {
  /**
   * @param subtractYears an injected arithmetic strategy. In production this is
   *   backed by a WebAssembly compute core for maximum throughput; in tests it
   *   may be a pure JavaScript fallback. The Domain does not care — it programs
   *   to the abstraction, per the Dependency Inversion Principle.
   */
  public computeRequiredBirthDate(
    referenceDate: CalendarDate,
    requiredAge: LegalDrinkingAge,
    subtractYears: (year: number, amount: number) => number
  ): CalendarDate {
    const targetYear = subtractYears(referenceDate.year, requiredAge.years);
    // Delegate leap-year and 29-Feb correctness to the value object.
    return referenceDate.minusYears(referenceDate.year - targetYear);
  }
}
