import { describe, it, expect } from "vitest";
import { CalendarDate } from "@domain/value-objects/CalendarDate.js";

describe("CalendarDate — the value object we agonised over", () => {
  it("subtracts whole years", () => {
    const d = CalendarDate.of(2026, 7, 23).minusYears(18);
    expect(d.toISOString()).toBe("2008-07-23");
  });

  it("maps 29 February to 1 March in a non-leap target year (§187 BGB, analog)", () => {
    const d = CalendarDate.of(2024, 2, 29).minusYears(1);
    expect(d.toISOString()).toBe("2023-03-01");
  });

  it("keeps 29 February when the target year is itself a leap year", () => {
    const d = CalendarDate.of(2040, 2, 29).minusYears(16);
    expect(d.toISOString()).toBe("2024-02-29");
  });

  it("computes leap years by the full Gregorian rule", () => {
    expect(CalendarDate.isLeapYear(2000)).toBe(true);
    expect(CalendarDate.isLeapYear(1900)).toBe(false);
    expect(CalendarDate.isLeapYear(2024)).toBe(true);
  });
});
