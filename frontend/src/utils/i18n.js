import uz from "../languages/uz.json";
import en from "../languages/en.json";
import ru from "../languages/ru.json";

const translations = { uz, en, ru };

export const t = (key, lang) => {
  const langData = translations[lang] || translations["uz"];
  const keys = key.split(".");

  let result = langData;
  for (const k of keys) {
    if (result && typeof result === "object" && result[k]) {
      result = result[k];
    } else {
      console.warn(`Missing translation key: ${key} for language ${lang}`);
      return key;
    }
  }
  return result;
};
