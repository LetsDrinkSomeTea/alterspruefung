import { describe, it, expect } from "vitest";
import { DetermineEligibilityBirthDateHandler } from "@application/handlers/DetermineEligibilityBirthDateHandler.js";
import { DetermineEligibilityBirthDateQuery } from "@application/queries/DetermineEligibilityBirthDateQuery.js";
import { FixedClock } from "@infrastructure/clock/SystemClock.js";
import { JavaScriptArithmeticCore } from "@infrastructure/wasm/WasmArithmeticCore.js";
import { DictionaryTranslator } from "@infrastructure/i18n/DictionaryTranslator.js";
import { NoOpTelemetry } from "@infrastructure/telemetry/NoOpTelemetry.js";
import { CalendarDate } from "@domain/value-objects/CalendarDate.js";

function buildHandler(today: CalendarDate) {
  return new DetermineEligibilityBirthDateHandler(
    new FixedClock(today),
    new JavaScriptArithmeticCore(),
    new DictionaryTranslator("de-DE"),
    new NoOpTelemetry(false)
  );
}

describe("DetermineEligibilityBirthDateHandler — the use case, end to end", () => {
  it("computes the 18+ birth date for spirits", () => {
    const handler = buildHandler(CalendarDate.of(2026, 7, 23));
    const result = handler.handle(new DetermineEligibilityBirthDateQuery("spirits", "de-DE"));
    expect(result.isoDate).toBe("2008-07-23");
    expect(result.localisedDate).toBe("23.07.2008");
    expect(result.requiredAgeYears).toBe(18);
  });

  it("computes the 16+ birth date for beer and wine", () => {
    const handler = buildHandler(CalendarDate.of(2026, 7, 23));
    const result = handler.handle(
      new DetermineEligibilityBirthDateQuery("beer-and-wine", "de-DE")
    );
    expect(result.isoDate).toBe("2010-07-23");
    expect(result.requiredAgeYears).toBe(16);
  });
});
