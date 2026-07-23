import { describe, it, expect } from "vitest";
import {
  WasmArithmeticCore,
  JavaScriptArithmeticCore
} from "@infrastructure/wasm/WasmArithmeticCore.js";

describe("WasmArithmeticCore — subtraction, but on the metal", () => {
  it("instantiates the hand-assembled module and subtracts correctly", async () => {
    const core = await WasmArithmeticCore.instantiate();
    expect(core.subtract(2026, 18)).toBe(2008);
    expect(core.subtract(2026, 16)).toBe(2010);
    expect(core.backendName).toContain("WebAssembly");
  });

  it("agrees with the JavaScript fallback for a range of inputs", async () => {
    const wasm = await WasmArithmeticCore.instantiate();
    const js = new JavaScriptArithmeticCore();
    for (let y = 1900; y <= 2100; y++) {
      expect(wasm.subtract(y, 18)).toBe(js.subtract(y, 18));
    }
  });
});
