<script lang="ts" setup>
import { provide, ref } from "vue";
import { IntlConfig } from "@formatjs/intl";
import { localeKey, localeType } from "./IntlTypes";
import enMessages from "../compiled-lang/en.json";
import { computed } from "@vue/reactivity";
import IntlProvider from "./IntlProvider.vue";

const currentLocaleLabel = ref<localeType>("简中");

function mapLabelToCode(label: localeType) {
  switch (label) {
    case "EN":
      return "en";
    case "简中":
      return "zh-hans";
  }
}

const clickHandler = () => {
  if (currentLocaleLabel.value === "EN") currentLocaleLabel.value = "简中";
  else if (currentLocaleLabel.value === "简中") {
    console.log(`setting locale to EN`);
    currentLocaleLabel.value = "EN";
  }
};

const setLocale = (newLocale: localeType) => {
  console.log(`new locale:${newLocale}`);
  currentLocaleLabel.value = newLocale;
};

const config = computed(() => {
  let messages;
  switch (currentLocaleLabel.value) {
    case "EN":
      messages = enMessages;
      break;

    default:
      messages = undefined;
      break;
  }
  const config: IntlConfig<string> = {
    locale: mapLabelToCode(currentLocaleLabel.value),
    defaultLocale: "zh-hans",
    messages: messages,
  };
  return config;
});

provide(localeKey, {
  currentLocale: currentLocaleLabel,
  setLocale: setLocale,
});
</script>
<template>
  <IntlProvider :config="config" :key="config.locale">
    <slot></slot
  ></IntlProvider>
</template>
