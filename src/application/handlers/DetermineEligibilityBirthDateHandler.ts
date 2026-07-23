import { CalendarDate, LegalDrinkingAge, EligibilityDatePolicy } from "@domain/index.js";
import type { ClockPort } from "../ports/ClockPort.js";
import type { ArithmeticCorePort } from "../ports/ArithmeticCorePort.js";
import type { TranslationPort } from "../ports/TranslationPort.js";
import type { TelemetryPort } from "../ports/TelemetryPort.js";
import type { DetermineEligibilityBirthDateQuery } from "../queries/DetermineEligibilityBirthDateQuery.js";
import type { EligibilityBirthDateReadModel } from "../queries/EligibilityBirthDateReadModel.js";

/**
 * Application Service / Query Handler orchestrating the use case.
 *
 * Note that this class contains *zero* business rules — those live in the
 * domain. It merely wires ports together, which is exactly what an application
 * service should do. If you find a leap-year check in here, escalate to the
 * architecture review board immediately.
 */
export class DetermineEligibilityBirthDateHandler {
  private readonly policy = new EligibilityDatePolicy();

  public constructor(
    private readonly clock: ClockPort,
    private readonly arithmetic: ArithmeticCorePort,
    private readonly translator: TranslationPort,
    private readonly telemetry: TelemetryPort
  ) {}

  public handle(query: DetermineEligibilityBirthDateQuery): EligibilityBirthDateReadModel {
    const span = this.telemetry.startSpan("determine-eligibility-birthdate");
    try {
      const requiredAge =
        query.beverageClass === "spirits"
          ? LegalDrinkingAge.forSpirits()
          : LegalDrinkingAge.forBeerAndWine();

      const today = this.clock.today();

      // The actual, load-bearing subtraction of the entire platform. It is
      // dispatched through the injected WebAssembly arithmetic core.
      const birthDate: CalendarDate = this.policy.computeRequiredBirthDate(
        today,
        requiredAge,
        (year, amount) => this.arithmetic.subtract(year, amount)
      );

      this.telemetry.recordEvent("eligibility.computed", {
        backend: this.arithmetic.backendName,
        requiredAge: requiredAge.years
      });

      return {
        isoDate: birthDate.toISOString(),
        localisedDate: this.formatLocalised(birthDate),
        requiredAgeYears: requiredAge.years,
        headline: this.translator.translate("headline"),
        explanation: this.translator.translate("explanation", {
          age: String(requiredAge.years)
        }),
        computeBackend: this.arithmetic.backendName
      };
    } finally {
      span.end();
    }
  }

  private formatLocalised(date: CalendarDate): string {
    const dd = String(date.day).padStart(2, "0");
    const mm = String(date.month).padStart(2, "0");
    return `${dd}.${mm}.${date.year}`;
  }
}
