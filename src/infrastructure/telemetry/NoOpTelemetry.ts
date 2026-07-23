import type { TelemetryPort } from "@application/ports/TelemetryPort.js";

/**
 * Privacy-first observability: it observes nothing and tells no one.
 * Emits to the developer console only when the `debug` feature flag is on,
 * so that we can pretend we have a distributed tracing backend.
 */
export class NoOpTelemetry implements TelemetryPort {
  public constructor(private readonly debug: boolean = false) {}

  public recordEvent(name: string, attributes: Record<string, string | number | boolean> = {}): void {
    if (this.debug) {
      // eslint-disable-next-line no-console
      console.debug(`[telemetry] ${name}`, attributes);
    }
  }

  public startSpan(name: string): { end(): void } {
    const start = performance.now();
    return {
      end: () => {
        if (this.debug) {
          // eslint-disable-next-line no-console
          console.debug(`[span] ${name} took ${(performance.now() - start).toFixed(3)}ms`);
        }
      }
    };
  }
}
