<script setup lang="ts">
import { computed } from "@vue/reactivity";
import { onMounted, onUnmounted, ref, watch } from "vue";

const props = defineProps<{
  collapsed: boolean;
}>();
const contentBlockSize = ref(0);
const contentRef = ref<HTMLDivElement | null>(null);

const observer = ref<ResizeObserver | null>(null);

const containerRef = ref<HTMLDivElement | null>(null);

onMounted(() => {
  const contentElement = contentRef.value;
  if (contentElement) {
    contentBlockSize.value = contentElement.clientHeight;

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      contentBlockSize.value = entry.contentRect.height;
    });
    resizeObserver.observe(contentElement);

    observer.value = resizeObserver;
  }
});
onUnmounted(() => {
  const resizeObserver = observer.value;
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
});

watch(
  [
    contentBlockSize,
    () => {
      return props.collapsed;
    },
  ],
  ([size, collapsed]) => {
    const containerElement = containerRef.value;
    if (containerElement) {
      if (collapsed) containerElement.style.blockSize = "0";
      else {
        containerElement.style.blockSize = `${size}px`;
      }
    }
  }
);

const attributes = computed(() => {
  return {
    inert: props.collapsed,
    tabindex: props.collapsed ? -1 : 0,
  };
});
</script>
<template>
  <div class="CollapsePanelContainer" ref="containerRef">
    <div class="CollapsePanelContent" ref="contentRef" v-bind="attributes">
      <slot></slot>
    </div>
  </div>
</template>
<style>
.CollapsePanelContainer {
  position: relative;
  overflow-y: hidden;

  transition: block-size 0.3s ease-out;
}
.CollapsePanelContent {
  position: relative;
}
</style>
