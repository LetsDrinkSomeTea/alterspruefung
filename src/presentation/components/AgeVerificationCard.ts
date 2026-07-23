import type { EligibilityBirthDateReadModel } from "@application/index.js";
import type { LocaleTag } from "@application/ports/TranslationPort.js";

/**
 * A custom element (Web Component) with Shadow DOM encapsulation rendering the
 * result card. Encapsulating a single card in Shadow DOM protects its styles
 * from the vast, sprawling stylesheet of this otherwise single-page site.
 */
export class AgeVerificationCard extends HTMLElement {
  static readonly tagName = "age-verification-card";
  private readonly root: ShadowRoot;
  private onLocaleChange?: (locale: LocaleTag) => void;
  private onBeverageChange?: (klass: "spirits" | "beer-and-wine") => void;

  public constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
  }

  public setHandlers(handlers: {
    onLocaleChange: (locale: LocaleTag) => void;
    onBeverageChange: (klass: "spirits" | "beer-and-wine") => void;
  }): void {
    this.onLocaleChange = handlers.onLocaleChange;
    this.onBeverageChange = handlers.onBeverageChange;
  }

  public renderLoading(): void {
    this.root.innerHTML = `${this.styles()}<div class="card"><p class="muted">Bootstrapping composition root…</p></div>`;
  }

  public render(
    model: EligibilityBirthDateReadModel,
    labels: { label: string; footer: string; ageNote: string },
    locales: LocaleTag[],
    activeLocale: LocaleTag
  ): void {
    const options = locales
      .map(
        (l) => `<option value="${l}" ${l === activeLocale ? "selected" : ""}>${l}</option>`
      )
      .join("");

    this.root.innerHTML = `
      ${this.styles()}
      <div class="card" role="region" aria-label="${model.headline}">
        <div class="toolbar">
          <select id="locale" aria-label="Locale">${options}</select>
          <div class="beverages" role="group" aria-label="Getränkeklasse">
            <button data-bev="spirits" class="${model.requiredAgeYears === 18 ? "active" : ""}">🥃 18+</button>
            <button data-bev="beer-and-wine" class="${model.requiredAgeYears === 16 ? "active" : ""}">🍺 16+</button>
          </div>
        </div>
        <h1>🍺 ${model.headline}</h1>
        <p class="muted">${model.explanation}</p>
        <div class="display">
          <div class="date-label">${labels.label}</div>
          <div class="date-value">${model.localisedDate}</div>
          <div class="age-info">${labels.ageNote.replace("{age}", String(model.requiredAgeYears))}</div>
        </div>
        <p class="footer">${labels.footer}: ${model.requiredAgeYears} Jahre</p>
        <p class="backend" title="The subtraction was executed by this compute backend.">
          ⚙ compute: ${model.computeBackend}
        </p>
      </div>`;

    const select = this.root.getElementById("locale") as HTMLSelectElement | null;
    select?.addEventListener("change", () =>
      this.onLocaleChange?.(select.value as LocaleTag)
    );
    this.root.querySelectorAll<HTMLButtonElement>("button[data-bev]").forEach((btn) => {
      btn.addEventListener("click", () =>
        this.onBeverageChange?.(btn.dataset["bev"] as "spirits" | "beer-and-wine")
      );
    });
  }

  private styles(): string {
    return `
    <style>
      :host { display: block; }
      .card {
        background: var(--c-surface, #fff);
        border-radius: var(--r-card, 20px);
        padding: var(--sp-xl, 40px);
        box-shadow: var(--elevation-card, 0 20px 60px rgba(0,0,0,.3));
        max-width: 600px; width: 100%; text-align: center;
        font-family: var(--font-family, sans-serif);
      }
      .toolbar { display: flex; justify-content: space-between; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
      select { padding: 6px 10px; border-radius: 8px; border: 1px solid #ddd; }
      .beverages button {
        border: 1px solid #ddd; background: #f7f7fb; border-radius: 8px;
        padding: 6px 10px; cursor: pointer; font-size: .95rem;
      }
      .beverages button.active { background: var(--c-brand-start,#667eea); color: #fff; border-color: transparent; }
      h1 { color: var(--c-ink,#333); margin-bottom: 16px; font-size: 1.6rem; }
      .muted { color: var(--c-ink-muted,#666); margin-bottom: 24px; line-height: 1.6; }
      .display {
        background: linear-gradient(135deg, var(--c-brand-start,#667eea), var(--c-brand-end,#764ba2));
        color: var(--c-on-brand,#fff); padding: var(--sp-lg,30px); border-radius: var(--r-inner,15px); margin: 20px 0;
      }
      .date-label { opacity: .9; margin-bottom: 10px; }
      .date-value { font-size: var(--font-display, 2.5rem); font-weight: 800; letter-spacing: 1px; }
      .age-info { opacity: .85; margin-top: 10px; font-size: .9rem; }
      .footer { margin-top: 24px; color: var(--c-ink-muted,#999); font-size: .9rem; }
      .backend { margin-top: 8px; color: #b3b8c4; font-size: .72rem; font-family: monospace; }
    </style>`;
  }
}

export function registerComponents(): void {
  if (!customElements.get(AgeVerificationCard.tagName)) {
    customElements.define(AgeVerificationCard.tagName, AgeVerificationCard);
  }
}
