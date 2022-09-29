<script setup lang="ts">
import { computed } from "@vue/reactivity";
import { onMounted, onUnmounted, onUpdated, ref, watch } from "vue";
import { clamp } from "../composables/Animations";
import { usePointerEvent } from "../composables/usePointerEvent";

const props = defineProps<{
  progress: number;
}>();

const emit = defineEmits<{
  (e: "change", newProgress: number): void;
}>();

const railRef = ref<HTMLDivElement | null>(null);
const thumbRef = ref<HTMLDivElement | null>(null);

const updateCounter = ref(0);

const observerRef = ref<ResizeObserver | null>(null);
onMounted(() => {
  const observer = new ResizeObserver((entries) => {
    const entry = entries[0];

    const rail = entry.target as HTMLDivElement;
    const thumb = thumbRef.value;
    if (rail && thumb) {
      const railRect = rail.getBoundingClientRect();
      const translate = (props.progress - 0.5) * railRect.width;
      const transform = `translate(${translate}px,0px)`;
      thumb.style.transform = transform;
    }
  });
  railRef.value && observer.observe(railRef.value);
  observerRef.value = observer;
});

onUnmounted(() => {
  if (observerRef.value) {
    observerRef.value.disconnect();
  }
});

onUpdated(() => {
  updateCounter.value++;
  const rail = railRef.value;
  const thumb = thumbRef.value;
  if (rail && thumb) {
    const railRect = rail.getBoundingClientRect();
    const translate = (props.progress - 0.5) * railRect.width;
    const transform = `translate(${translate}px,0px)`;
    thumb.style.transform = transform;
  }
});

function calculatePointerPositionPercentage(e: PointerEvent) {
  const element = e.currentTarget as HTMLDivElement;
  if (element) {
    const rect = element.getBoundingClientRect();
    const percentage = (e.clientX - rect.x) / rect.width;
    return clamp(percentage, 0, 1);
  }
}

usePointerEvent(railRef, {
  onDown(e) {
    const newProgress = calculatePointerPositionPercentage(e);
    newProgress && emit("change", newProgress);
  },
  onMove: (e: PointerEvent) => {
    const newProgress = calculatePointerPositionPercentage(e);
    newProgress && emit("change", newProgress);
  },
});
</script>
<template>
  <div ref="railRef" class="progressRail">
    <div ref="thumbRef" class="progressThumb"></div>
  </div>
</template>
<style scoped>
.progressRail {
  margin-inline: 1rem;

  flex: 1 1 0px;
  display: flex;
  justify-content: center;
  place-items: center;
  height: 15px;

  background-color: hsl(0, 0%, 80%);

  outline: 1px solid hsl(0, 0%, 62%);
  border-radius: 10px;
}
.progressThumb {
  width: 40px;
  height: 40px;

  background-color: white;

  border: 1px solid black;
  border-radius: 50%;

  box-shadow: inset 2px 0px 2px rgb(164, 164, 164);
}
</style>
