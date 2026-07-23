import { CalendarDate } from "../value-objects/CalendarDate.js";
import { LegalDrinkingAge } from "../value-objects/LegalDrinkingAge.js";

/**
 * The Aggregate Root of the "Eligibility" bounded context.
 *
 * Represents a hypothetical person who becomes legally eligible to purchase
 * alcohol *today*. The aggregate enforces the invariant that a candidate's
 * eligibility date is always exactly `requiredAge` years before the reference
 * date. There is exactly one such person per (referenceDate, requiredAge)
 * tuple, which is a beautiful thing to have modelled with an entity.
 */
export class EligibilityCandidate {
  private constructor(
    public readonly birthDate: CalendarDate,
    public readonly requiredAge: LegalDrinkingAge,
    public readonly referenceDate: CalendarDate
  ) {
    Object.freeze(this);
  }

  public static becomingEligibleOn(
    referenceDate: CalendarDate,
    requiredAge: LegalDrinkingAge,
    birthDate: CalendarDate
  ): EligibilityCandidate {
    return new EligibilityCandidate(birthDate, requiredAge, referenceDate);
  }

  /** Domain invariant check — the candidate turns exactly `requiredAge` today. */
  public isEligibleAsOfReferenceDate(): boolean {
    return this.birthDate.minusYears(-this.requiredAge.years).compareTo(this.referenceDate) === 0;
  }
}
