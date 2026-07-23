/**
 * Outbound port for observability. GDPR-compliant by construction: the
 * production adapter is a no-op that stores nothing, transmits nothing, and
 * respects the user's dignity absolutely. We still abstract it behind a port,
 * because one day the analytics team will want dashboards, and we will be
 * ready with zero core changes.
 */
export interface TelemetryPort {
  recordEvent(name: string, attributes?: Record<string, string | number | boolean>): void;
  startSpan(name: string): { end(): void };
}
