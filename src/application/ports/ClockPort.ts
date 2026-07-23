import type { CalendarDate } from "@domain/value-objects/CalendarDate.js";

/**
 * Outbound port abstracting the concept of "now".
 *
 * Time is a side effect, and side effects belong at the edges of the system.
 * By hiding the system clock behind a port, the entire application core becomes
 * a pure, deterministic, referentially transparent function of its inputs —
 * which is the sort of sentence one puts in an architecture deck.
 */
export interface ClockPort {
  today(): CalendarDate;
}
