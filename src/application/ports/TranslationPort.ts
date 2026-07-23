export type LocaleTag = "de-DE" | "en-US" | "de-BY" | "la-VA" | "tlh" | "emoji";

/**
 * Outbound port for internationalisation. A single-language webpage naturally
 * requires a full i18n subsystem supporting Standard German, English,
 * Bavarian, Ecclesiastical Latin, Klingon, and Emoji. One must plan for
 * international expansion into the Klingon spirits market.
 */
export interface TranslationPort {
  translate(key: string, params?: Record<string, string>): string;
  readonly locale: LocaleTag;
}
