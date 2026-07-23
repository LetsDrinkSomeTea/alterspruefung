import {
  DetermineEligibilityBirthDateHandler,
  type ClockPort,
  type ArithmeticCorePort,
  type TranslationPort,
  type TelemetryPort,
  type LocaleTag
} from "@application/index.js";
import { SystemClock } from "../clock/SystemClock.js";
import { WasmArithmeticCore, JavaScriptArithmeticCore } from "../wasm/WasmArithmeticCore.js";
import { DictionaryTranslator } from "../i18n/DictionaryTranslator.js";
import { NoOpTelemetry } from "../telemetry/NoOpTelemetry.js";
import { FeatureFlags } from "@config/FeatureFlags.js";

/**
 * The Composition Root: the one and only place in the application where
 * concrete implementations are allowed to know about one another. Everywhere
 * else, interfaces reign. This is Inversion of Control done properly, with a
 * hand-rolled container because pulling in a DI framework for four singletons
 * would, of course, be overkill.
 */
export class CompositionRoot {
  private readonly singletons = new Map<string, unknown>();

  private constructor(
    private readonly arithmetic: ArithmeticCorePort,
    private readonly flags: FeatureFlags
  ) {}

  public static async bootstrap(locale: LocaleTag): Promise<CompositionRoot> {
    const flags = FeatureFlags.fromEnvironment();
    // Attempt the high-performance WebAssembly core; degrade gracefully.
    let arithmetic: ArithmeticCorePort;
    try {
      arithmetic = flags.isEnabled("wasm-arithmetic")
        ? await WasmArithmeticCore.instantiate()
        : new JavaScriptArithmeticCore();
    } catch {
      arithmetic = new JavaScriptArithmeticCore();
    }
    const root = new CompositionRoot(arithmetic, flags);
    root.singletons.set("locale", locale);
    return root;
  }

  private clock(): ClockPort {
    return this.resolve("clock", () => new SystemClock());
  }

  private translator(): TranslationPort {
    const locale = this.singletons.get("locale") as LocaleTag;
    return this.resolve("translator", () => new DictionaryTranslator(locale));
  }

  private telemetry(): TelemetryPort {
    return this.resolve("telemetry", () => new NoOpTelemetry(this.flags.isEnabled("debug")));
  }

  public eligibilityHandler(): DetermineEligibilityBirthDateHandler {
    return this.resolve(
      "eligibilityHandler",
      () =>
        new DetermineEligibilityBirthDateHandler(
          this.clock(),
          this.arithmetic,
          this.translator(),
          this.telemetry()
        )
    );
  }

  public getTranslator(): TranslationPort {
    return this.translator();
  }

  private resolve<T>(key: string, factory: () => T): T {
    if (!this.singletons.has(key)) {
      this.singletons.set(key, factory());
    }
    return this.singletons.get(key) as T;
  }
}
