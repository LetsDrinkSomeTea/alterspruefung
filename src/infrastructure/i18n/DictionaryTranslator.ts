import type { LocaleTag, TranslationPort } from "@application/ports/TranslationPort.js";

type Dictionary = Record<string, string>;

/**
 * A fully-featured, six-locale internationalisation subsystem for a webpage
 * that displays one date. Supports interpolation via {placeholder} tokens.
 * The Klingon and Emoji locales are provided for completeness and for the
 * inevitable expansion into non-terrestrial spirits markets.
 */
const DICTIONARIES: Record<LocaleTag, Dictionary> = {
  "de-DE": {
    title: "Altersprüfung Deutschland",
    headline: "Wer heute volljährig wird, ist geboren am:",
    explanation: "Zum Kauf von Spirituosen ({age}+) muss dieser Tag erreicht sein.",
    label: "Geburtsdatum",
    ageNote: "Diese Person wird heute genau {age} Jahre alt.",
    footer: "Mindestalter für Alkoholkauf in Deutschland"
  },
  "en-US": {
    title: "Age Verification Germany",
    headline: "Someone reaching legal age today was born on:",
    explanation: "To purchase spirits ({age}+) this date must be reached.",
    label: "Date of birth",
    ageNote: "This person turns exactly {age} years old today.",
    footer: "Minimum age for purchasing alcohol in Germany"
  },
  "de-BY": {
    title: "Oidaschau Bayern",
    headline: "Wer heid voijähri wead, is gebuan am:",
    explanation: "Fian Schnaps ({age}+) muassd des Datum daglangt hom.",
    label: "Gebuadsdog",
    ageNote: "De Person wead heid genau {age} Joah oid.",
    footer: "Mindestoida fian Alkohoikauf in Deitschland"
  },
  "la-VA": {
    title: "Probatio Aetatis Germaniae",
    headline: "Qui hodie maior fit, natus est die:",
    explanation: "Ad vinum ardens emendum ({age}+) hic dies attingendus est.",
    label: "Dies natalis",
    ageNote: "Haec persona hodie exacte {age} annos nata est.",
    footer: "Aetas minima ad alcoholem emendum in Germania"
  },
  tlh: {
    title: "ben nI'ghach nISwI'",
    headline: "DaHjaj nI'law'choHbogh ghaH boghpu':",
    explanation: "HIq ngaSwI' ({age}+) Daje'meH jaj naDev nItojnIS.",
    label: "boghjaj",
    ageNote: "DaHjaj {age} ben ghaH.",
    footer: "Qov'a' HIq je'meH poH"
  },
  emoji: {
    title: "🔞🇩🇪🍺",
    headline: "🎂👉🍾 today ➡️ born on:",
    explanation: "🥃 ({age}+) 📅✅",
    label: "🎂📅",
    ageNote: "🎉 = {age} 🎂 today",
    footer: "🔞🍺🇩🇪"
  }
};

export class DictionaryTranslator implements TranslationPort {
  public constructor(public readonly locale: LocaleTag) {}

  public translate(key: string, params: Record<string, string> = {}): string {
    const dict = DICTIONARIES[this.locale] ?? DICTIONARIES["de-DE"];
    const template = dict[key] ?? DICTIONARIES["de-DE"][key] ?? key;
    return template.replace(/\{(\w+)\}/g, (_m, name: string) => params[name] ?? `{${name}}`);
  }

  public static supportedLocales(): LocaleTag[] {
    return Object.keys(DICTIONARIES) as LocaleTag[];
  }
}
