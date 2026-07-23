import type { ClockPort } from "@application/ports/ClockPort.js";
import { CalendarDate } from "@domain/value-objects/CalendarDate.js";

/** Production adapter reading the host system clock at the very edge. */
export class SystemClock implements ClockPort {
  public today(): CalendarDate {
    return CalendarDate.fromNativeDate(new Date());
  }
}

/** Deterministic adapter for tests and time-travel debugging. */
export class FixedClock implements ClockPort {
  public constructor(private readonly fixed: CalendarDate) {}
  public today(): CalendarDate {
    return this.fixed;
  }
}
