import { CompositionRoot } from "@infrastructure/di/CompositionRoot.js";
import { DetermineEligibilityBirthDateQuery } from "@application/index.js";
import type { LocaleTag } from "@application/ports/TranslationPort.js";
import { DictionaryTranslator } from "@infrastructure/i18n/DictionaryTranslator.js";
import { FeatureFlags } from "@config/FeatureFlags.js";
import { applyTheme } from "@presentation/theme/tokens.js";
import { UiStateMachine } from "@presentation/state/UiStateMachine.js";
import {
  AgeVerificationCard,
  registerComponents
} from "@presentation/components/AgeVerificationCard.js";
import { startMatrixRain, burstConfetti } from "@presentation/components/effects.js";

/**
 * The application entry point / bootstrapper. Its job is to stand up the entire
 * hexagonal architecture in order to subtract eighteen from the current year
 * and print the result. It does so with pride.
 */
async function bootstrap(): Promise<void> {
  const machine = new UiStateMachine();
  machine.dispatch({ type: "BOOT" });

  applyTheme();
  registerComponents();

  const flags = FeatureFlags.fromEnvironment();
  const mount = document.getElementById("app");
  if (!mount) throw new Error("Mount point #app not found — this is fine, actually not.");

  // Optional decorative background.
  if (flags.isEnabled("matrix-rain")) {
    const canvas = document.createElement("canvas");
    canvas.id = "rain";
    Object.assign(canvas.style, {
      position: "fixed",
      inset: "0",
      zIndex: "0",
      pointerEvents: "none"
    } as CSSStyleDeclaration);
    document.body.prepend(canvas);
    startMatrixRain(canvas);
  }

  const card = new AgeVerificationCard();
  mount.appendChild(card);
  card.renderLoading();

  let locale: LocaleTag = detectLocale();
  let beverageClass: "spirits" | "beer-and-wine" = "spirits";

  const rerender = async (): Promise<void> => {
    machine.dispatch({ type: "COMPUTE" });
    const root = await CompositionRoot.bootstrap(locale);
    const handler = root.eligibilityHandler();
    const translator = root.getTranslator();
    const model = handler.handle(
      new DetermineEligibilityBirthDateQuery(beverageClass, locale)
    );
    document.title = translator.translate("title");

    card.setHandlers({
      onLocaleChange: (next) => {
        locale = next;
        void rerender();
      },
      onBeverageChange: (next) => {
        beverageClass = next;
        void rerender();
      }
    });
    card.render(
      model,
      {
        label: translator.translate("label"),
        footer: translator.translate("footer"),
        ageNote: translator.translate("ageNote")
      },
      DictionaryTranslator.supportedLocales(),
      locale
    );
    machine.dispatch({ type: "RESOLVED" });
    if (flags.isEnabled("confetti")) burstConfetti();
  };

  await rerender();

  // Register the service worker for offline-first, install-to-homescreen glory.
  if ("serviceWorker" in navigator) {
    const base = import.meta.env.BASE_URL ?? "/";
    navigator.serviceWorker.register(`${base}sw.js`).catch(() => {
      /* offline support is a nice-to-have; failure is non-fatal */
    });
  }
}

function detectLocale(): LocaleTag {
  const supported = DictionaryTranslator.supportedLocales();
  if (typeof location !== "undefined") {
    const forced = new URLSearchParams(location.search).get("locale") as LocaleTag | null;
    if (forced && supported.includes(forced)) return forced;
  }
  const nav = typeof navigator !== "undefined" ? navigator.language : "de-DE";
  return nav.startsWith("de") ? "de-DE" : "en-US";
}

void bootstrap();
