import { InjectionKey, Ref } from "vue";

export const supportedLocales = ["EN", "简中"] as const;
export type localeType = typeof supportedLocales[number];

export const localeKey = Symbol() as InjectionKey<{
  currentLocale: Ref<localeType>;
  setLocale: (newLocale: localeType) => void;
}>;
