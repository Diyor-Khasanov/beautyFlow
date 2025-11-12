import uz from "../languages/uz.json";
import en from "../languages/en.json";
import ru from "../languages/ru.json";

const translations = { uz, en, ru };

/**
 * Tarjima kalitini topish funksiyasi
 * @param {string} key
 * @param {string} lang
 * @returns {string}
 */
export const translate = (key, lang) => {
  const langData = translations[lang] || translations["uz"];
  const keys = key.split(".");

  let result = langData;
  for (const k of keys) {
    if (result && typeof result === "object" && result[k]) {
      result = result[k];
    } else {
      return `TPL_MISSING[${key}]`;
    }
  }
  return result;
};
