import { useLanguageStore } from "@/stores/useLanguageStore";
import { translations } from "@/lib/i18n/translations";

export function useTranslation() {
  const { locale, setLocale } = useLanguageStore();
  const t = translations[locale];

  return { t, locale, setLocale };
}
