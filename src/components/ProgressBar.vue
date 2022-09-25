<script setup lang="ts">
import { computed } from "@vue/reactivity";
import { onUpdated, ref, watch } from "vue";

const props = defineProps<{
  progress: number;
  onChange: null | ((newProgress: number) => void);
}>();
const railRef = ref<HTMLDivElement | null>(null);
const thumbRef = ref<HTMLDivElement | null>(null);

const pgs = computed(() => props.progress);

onUpdated(() => {
  const rail = railRef.value;
  const thumb = thumbRef.value;
  if (rail && thumb) {
    const railRect = rail.getBoundingClientRect();
    const translate = (props.progress - 0.5) * railRect.width;
    const transform = `translate(${translate}px,0px)`;
    thumb.style.transform = transform;
  }
});
</script>
<template>
  <div ref="railRef" class="rail">
    <div ref="thumbRef" class="thumb"></div>
  </div>
</template>
<style scoped>
.rail {
  flex: 1 1 0px;
  display: flex;
  justify-content: center;
  place-items: center;
  height: 15px;

  background-color: hsl(0, 0%, 80%);

  outline: 1px solid hsl(0, 0%, 62%);
  border-radius: 10px;
}
.thumb {
  width: 40px;
  height: 40px;

  background-color: white;

  border: 1px solid black;
  border-radius: 50%;

  box-shadow: inset 2px 0px 2px rgb(164, 164, 164);
}
</style>
