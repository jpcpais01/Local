// Maps a country to its Google News edition (hl/gl/ceid). Searching a
// place's own local edition — instead of always forcing the US English
// edition — is what actually surfaces real local coverage for cities
// outside the US, and it naturally avoids cross-country name collisions
// (e.g. Lisbon, Portugal vs. Lisbon, Ohio) since each edition's index is
// scoped to that country's press.
//
// Values follow Google News' documented edition list (ceid = GL:HL, with
// UN M49 region codes used in place of a country for a couple of
// macro-language variants, e.g. "419" for Latin American Spanish).

export interface NewsLocale {
  hl: string;
  gl: string;
  ceid: string;
}

const DEFAULT_LOCALE: NewsLocale = { hl: "en-US", gl: "US", ceid: "US:en" };

const LOCALES: Record<string, NewsLocale> = {
  US: DEFAULT_LOCALE,
  GB: { hl: "en-GB", gl: "GB", ceid: "GB:en" },
  IE: { hl: "en-IE", gl: "IE", ceid: "IE:en" },
  CA: { hl: "en-CA", gl: "CA", ceid: "CA:en" },
  AU: { hl: "en-AU", gl: "AU", ceid: "AU:en" },
  NZ: { hl: "en-NZ", gl: "NZ", ceid: "NZ:en" },
  ZA: { hl: "en-ZA", gl: "ZA", ceid: "ZA:en" },
  IN: { hl: "en-IN", gl: "IN", ceid: "IN:en" },
  SG: { hl: "en-SG", gl: "SG", ceid: "SG:en" },
  MY: { hl: "en-MY", gl: "MY", ceid: "MY:en" },
  PH: { hl: "en-PH", gl: "PH", ceid: "PH:en" },
  PK: { hl: "en-PK", gl: "PK", ceid: "PK:en" },
  NG: { hl: "en-NG", gl: "NG", ceid: "NG:en" },
  KE: { hl: "en-KE", gl: "KE", ceid: "KE:en" },
  GH: { hl: "en-GH", gl: "GH", ceid: "GH:en" },

  PT: { hl: "pt-PT", gl: "PT", ceid: "PT:pt-150" },
  BR: { hl: "pt-BR", gl: "BR", ceid: "BR:pt-419" },

  ES: { hl: "es", gl: "ES", ceid: "ES:es" },
  MX: { hl: "es-419", gl: "MX", ceid: "MX:es-419" },
  AR: { hl: "es-419", gl: "AR", ceid: "AR:es-419" },
  CO: { hl: "es-419", gl: "CO", ceid: "CO:es-419" },
  CL: { hl: "es-419", gl: "CL", ceid: "CL:es-419" },
  PE: { hl: "es-419", gl: "PE", ceid: "PE:es-419" },
  VE: { hl: "es-419", gl: "VE", ceid: "VE:es-419" },
  UY: { hl: "es-419", gl: "UY", ceid: "UY:es-419" },

  FR: { hl: "fr", gl: "FR", ceid: "FR:fr" },
  BE: { hl: "fr", gl: "BE", ceid: "BE:fr" },
  CH: { hl: "de", gl: "CH", ceid: "CH:de" },
  DE: { hl: "de", gl: "DE", ceid: "DE:de" },
  AT: { hl: "de", gl: "AT", ceid: "AT:de" },
  IT: { hl: "it", gl: "IT", ceid: "IT:it" },
  NL: { hl: "nl", gl: "NL", ceid: "NL:nl" },
  PL: { hl: "pl", gl: "PL", ceid: "PL:pl" },
  SE: { hl: "sv", gl: "SE", ceid: "SE:sv" },
  NO: { hl: "no", gl: "NO", ceid: "NO:no" },
  DK: { hl: "da", gl: "DK", ceid: "DK:da" },
  FI: { hl: "fi", gl: "FI", ceid: "FI:fi" },
  GR: { hl: "el", gl: "GR", ceid: "GR:el" },
  CZ: { hl: "cs", gl: "CZ", ceid: "CZ:cs" },
  RO: { hl: "ro", gl: "RO", ceid: "RO:ro" },
  HU: { hl: "hu", gl: "HU", ceid: "HU:hu" },
  UA: { hl: "uk", gl: "UA", ceid: "UA:uk" },
  RU: { hl: "ru", gl: "RU", ceid: "RU:ru" },
  TR: { hl: "tr", gl: "TR", ceid: "TR:tr" },
  IL: { hl: "he", gl: "IL", ceid: "IL:he" },
  SA: { hl: "ar", gl: "SA", ceid: "SA:ar" },
  AE: { hl: "ar", gl: "AE", ceid: "AE:ar" },
  EG: { hl: "ar", gl: "EG", ceid: "EG:ar" },

  JP: { hl: "ja", gl: "JP", ceid: "JP:ja" },
  KR: { hl: "ko", gl: "KR", ceid: "KR:ko" },
  TW: { hl: "zh-TW", gl: "TW", ceid: "TW:zh-Hant" },
  HK: { hl: "zh-HK", gl: "HK", ceid: "HK:zh-Hant" },
  VN: { hl: "vi", gl: "VN", ceid: "VN:vi" },
  TH: { hl: "th", gl: "TH", ceid: "TH:th" },
  ID: { hl: "id", gl: "ID", ceid: "ID:id" },
  BD: { hl: "bn", gl: "BD", ceid: "BD:bn" },
};

export function getNewsLocale(countryCode?: string | null): NewsLocale {
  if (!countryCode) return DEFAULT_LOCALE;
  return LOCALES[countryCode.toUpperCase()] ?? DEFAULT_LOCALE;
}
