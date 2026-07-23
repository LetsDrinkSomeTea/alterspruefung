/**
 * Design tokens. A single source of truth for the visual language of an
 * application whose entire visual language is "a card with a date on it".
 * Exposed as CSS custom properties by `applyTheme`.
 */
export const designTokens = {
  color: {
    brandStart: "#667eea",
    brandEnd: "#764ba2",
    surface: "#ffffff",
    ink: "#1f2430",
    inkMuted: "#6b7280",
    onBrand: "#ffffff",
    accent: "#f6c453"
  },
  radius: { card: "20px", inner: "15px" },
  space: { xs: "8px", sm: "12px", md: "20px", lg: "30px", xl: "40px" },
  font: {
    family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    display: "clamp(2rem, 6vw, 2.75rem)",
    body: "1.1rem"
  },
  elevation: { card: "0 20px 60px rgba(0,0,0,0.3)" }
} as const;

export function applyTheme(root: HTMLElement = document.documentElement): void {
  const set = (name: string, value: string) => root.style.setProperty(name, value);
  set("--c-brand-start", designTokens.color.brandStart);
  set("--c-brand-end", designTokens.color.brandEnd);
  set("--c-surface", designTokens.color.surface);
  set("--c-ink", designTokens.color.ink);
  set("--c-ink-muted", designTokens.color.inkMuted);
  set("--c-on-brand", designTokens.color.onBrand);
  set("--c-accent", designTokens.color.accent);
  set("--r-card", designTokens.radius.card);
  set("--r-inner", designTokens.radius.inner);
  set("--sp-md", designTokens.space.md);
  set("--sp-lg", designTokens.space.lg);
  set("--sp-xl", designTokens.space.xl);
  set("--font-family", designTokens.font.family);
  set("--font-display", designTokens.font.display);
  set("--elevation-card", designTokens.elevation.card);
}
