// Category search keywords, translated per language — used to bias the
// Google News query toward a category. Untranslated English keywords in a
// non-English edition tend to just get dropped by Google's matching, which
// makes every category collapse into "top stories" for non-English users.

const KEYWORDS_BY_LANG: Record<string, Record<string, string>> = {
  en: {
    top: "",
    local: "local news",
    sports: "sports",
    business: "business economy",
    technology: "technology",
    entertainment: "entertainment",
    health: "health",
    weather: "weather",
  },
  pt: {
    top: "",
    local: "notícias locais",
    sports: "desporto",
    business: "economia negócios",
    technology: "tecnologia",
    entertainment: "entretenimento",
    health: "saúde",
    weather: "tempo meteorologia",
  },
  es: {
    top: "",
    local: "noticias locales",
    sports: "deportes",
    business: "economía negocios",
    technology: "tecnología",
    entertainment: "entretenimiento",
    health: "salud",
    weather: "clima tiempo",
  },
  fr: {
    top: "",
    local: "actualités locales",
    sports: "sport",
    business: "économie affaires",
    technology: "technologie",
    entertainment: "divertissement",
    health: "santé",
    weather: "météo",
  },
  de: {
    top: "",
    local: "lokale Nachrichten",
    sports: "Sport",
    business: "Wirtschaft",
    technology: "Technologie",
    entertainment: "Unterhaltung",
    health: "Gesundheit",
    weather: "Wetter",
  },
  it: {
    top: "",
    local: "notizie locali",
    sports: "sport",
    business: "economia affari",
    technology: "tecnologia",
    entertainment: "intrattenimento",
    health: "salute",
    weather: "meteo",
  },
  nl: {
    top: "",
    local: "lokaal nieuws",
    sports: "sport",
    business: "economie",
    technology: "technologie",
    entertainment: "entertainment",
    health: "gezondheid",
    weather: "weer",
  },
};

// Reduces a Google News `hl` value (e.g. "es-419", "pt-150", "zh-Hant") down
// to the base language key used above.
function baseLang(hl: string): string {
  const lower = hl.toLowerCase();
  if (lower.startsWith("es")) return "es";
  if (lower.startsWith("pt")) return "pt";
  return lower.split("-")[0];
}

export function getCategoryKeyword(category: string, hl: string): string {
  const table = KEYWORDS_BY_LANG[baseLang(hl)] ?? KEYWORDS_BY_LANG.en;
  return table[category] ?? KEYWORDS_BY_LANG.en[category] ?? "";
}
