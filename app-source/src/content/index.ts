import tr from "./tr.json";
import en from "./en.json";
import de from "./de.json";
import type { Dictionary, Locale } from "./types";

export const dictionaries: Record<Locale, Dictionary> = { tr, en, de };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export type { Dictionary, Locale, PageKey } from "./types";
