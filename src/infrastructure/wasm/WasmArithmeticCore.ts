import type { ArithmeticCorePort } from "@application/ports/ArithmeticCorePort.js";

/**
 * A hand-assembled WebAssembly module exporting a single function
 * `sub(a: i32, b: i32) -> i32` that returns `a - b`.
 *
 * Yes, we compiled a subtraction to WebAssembly. No, JavaScript's `-` operator
 * was not sufficiently enterprise. The bytes below are a complete, valid
 * `.wasm` binary written by hand — no toolchain, no build step, just raw
 * near-metal performance for the hottest code path in the platform: computing
 * `currentYear - 18`.
 *
 * Module layout:
 *   magic + version
 *   type section  : (i32, i32) -> i32
 *   func section  : one function of type 0
 *   export section: "sub" -> func 0
 *   code section  : local.get 0; local.get 1; i32.sub; end
 */
const WASM_BYTES = new Uint8Array([
  0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00, // \0asm, version 1
  0x01, 0x07, 0x01, 0x60, 0x02, 0x7f, 0x7f, 0x01, 0x7f, // type: (i32,i32)->i32
  0x03, 0x02, 0x01, 0x00, // func: [type 0]
  0x07, 0x07, 0x01, 0x03, 0x73, 0x75, 0x62, 0x00, 0x00, // export "sub" -> func 0
  0x0a, 0x09, 0x01, 0x07, 0x00, 0x20, 0x00, 0x20, 0x01, 0x6b, 0x0b // code
]);

type SubtractFn = (a: number, b: number) => number;

export class WasmArithmeticCore implements ArithmeticCorePort {
  public readonly backendName = "WebAssembly (hand-assembled i32.sub)";
  private constructor(private readonly sub: SubtractFn) {}

  /**
   * Instantiate the module. Because `WebAssembly.instantiate` is asynchronous
   * (as all serious compute pipelines are), construction is likewise async.
   */
  public static async instantiate(): Promise<WasmArithmeticCore> {
    const { instance } = await WebAssembly.instantiate(WASM_BYTES, {});
    const sub = instance.exports.sub as SubtractFn;
    return new WasmArithmeticCore(sub);
  }

  public subtract(minuend: number, subtrahend: number): number {
    return this.sub(minuend, subtrahend);
  }
}

/**
 * Pure-JavaScript fallback for environments where instantiating a 41-byte
 * WebAssembly module is somehow a bridge too far. Used automatically by the
 * composition root if the WASM core fails to instantiate, and by unit tests
 * that value their sanity.
 */
export class JavaScriptArithmeticCore implements ArithmeticCorePort {
  public readonly backendName = "JavaScript (fallback)";
  public subtract(minuend: number, subtrahend: number): number {
    return minuend - subtrahend;
  }
}
