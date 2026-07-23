/**
 * An immutable, timezone-agnostic calendar date value object.
 *
 * We deliberately do NOT use the native `Date` object across layer boundaries
 * because `Date` is a mutable, timezone-cursed abomination that has caused more
 * production incidents than SQL injection. Here it is quarantined behind a
 * value object with a total ordering and proleptic-Gregorian semantics.
 */
export class CalendarDate {
  private constructor(
    public readonly year: number,
    public readonly month: number, // 1-12
    public readonly day: number // 1-31
  ) {
    Object.freeze(this);
  }

  public static of(year: number, month: number, day: number): CalendarDate {
    if (month < 1 || month > 12) {
      throw new RangeError(`Month out of range: ${month}`);
    }
    if (day < 1 || day > 31) {
      throw new RangeError(`Day out of range: ${day}`);
    }
    return new CalendarDate(year, month, day);
  }

  public static fromNativeDate(date: Date): CalendarDate {
    return new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
  }

  /**
   * Subtract a whole number of years, correctly handling the single most
   * over-discussed edge case in this entire codebase: someone born on
   * 29 February. Per German civil-law convention (§ 187 f. BGB, analog),
   * such a person is deemed to have their birthday on 1 March in non-leap
   * years. We honour that here because we are nothing if not thorough.
   */
  public minusYears(years: number): CalendarDate {
    const targetYear = this.year - years;
    if (this.month === 2 && this.day === 29 && !CalendarDate.isLeapYear(targetYear)) {
      return new CalendarDate(targetYear, 3, 1);
    }
    return new CalendarDate(targetYear, this.month, this.day);
  }

  public static isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  public compareTo(other: CalendarDate): number {
    if (this.year !== other.year) return this.year - other.year;
    if (this.month !== other.month) return this.month - other.month;
    return this.day - other.day;
  }

  public toISOString(): string {
    const mm = String(this.month).padStart(2, "0");
    const dd = String(this.day).padStart(2, "0");
    return `${this.year}-${mm}-${dd}`;
  }
}
