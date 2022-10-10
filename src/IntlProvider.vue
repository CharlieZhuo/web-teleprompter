<script setup lang="ts">
import { createIntl, IntlConfig } from "@formatjs/intl";
import { provideIntl } from "vue-intl";

const props = defineProps<{ config: IntlConfig<string> }>();
provideIntl(createIntl(props.config));
</script>
<template>
  <slot></slot>
</template>
