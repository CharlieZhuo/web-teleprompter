<script setup lang="ts">
import { computed } from "@vue/reactivity";

const props = defineProps<{
  currentTimeMs: number;
  totalDurationMs: number;
}>();
function formatTime(timeInMs: number) {
  const minute = Math.floor(timeInMs / 60000);
  const second = ((timeInMs / 1000) % 60).toFixed(0);
  return `${minute}:${+second < 10 ? "0" : ""}${second}`;
}
const currentTime = computed(() => {
  return formatTime(props.currentTimeMs);
});
const duration = computed(() => {
  return formatTime(props.totalDurationMs);
});
</script>
<template>
  <p class="timeContainer">
    <span class="time">{{ currentTime }}</span
    >/<span class="time">{{ duration }}</span>
  </p>
</template>

<style scoped>
.timeContainer {
  font-family: monospace;
  display: flex;
  gap: 0.3rem;
}
</style>
