/**
 * A feature-flag subsystem for a static webpage. Flags are resolved from URL
 * query parameters (e.g. `?ff.debug=on`), enabling per-request experimentation
 * without a redeploy — the sort of operational agility a birthday calculator
 * demands. Falls back to compile-time defaults.
 */
export type FeatureFlagName = "wasm-arithmetic" | "debug" | "confetti" | "matrix-rain";

export class FeatureFlags {
  private constructor(private readonly flags: Map<FeatureFlagName, boolean>) {}

  private static readonly DEFAULTS: Record<FeatureFlagName, boolean> = {
    "wasm-arithmetic": true,
    debug: false,
    confetti: true,
    "matrix-rain": true
  };

  public static fromEnvironment(): FeatureFlags {
    const map = new Map<FeatureFlagName, boolean>(
      Object.entries(FeatureFlags.DEFAULTS) as [FeatureFlagName, boolean][]
    );
    if (typeof location !== "undefined" && location.search) {
      const params = new URLSearchParams(location.search);
      for (const name of Object.keys(FeatureFlags.DEFAULTS) as FeatureFlagName[]) {
        const raw = params.get(`ff.${name}`);
        if (raw !== null) {
          map.set(name, raw === "on" || raw === "true" || raw === "1");
        }
      }
    }
    return new FeatureFlags(map);
  }

  public isEnabled(name: FeatureFlagName): boolean {
    return this.flags.get(name) ?? false;
  }
}
