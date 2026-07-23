/**
 * Outbound port for high-performance integer arithmetic.
 *
 * Subtracting 18 from a four-digit number is, admittedly, within the
 * capabilities of the JavaScript engine. But by routing it through a
 * pluggable port we retain the option to swap in a WebAssembly core, a
 * remote arithmetic microservice, or an FPGA, should throughput requirements
 * ever demand it. Architecture is about keeping options open.
 */
export interface ArithmeticCorePort {
  /** Returns `minuend - subtrahend`. */
  subtract(minuend: number, subtrahend: number): number;
  /** Human-readable identifier of the compute backend, for telemetry. */
  readonly backendName: string;
}
