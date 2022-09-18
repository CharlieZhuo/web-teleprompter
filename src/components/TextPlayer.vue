<script setup lang="ts">
import { onMounted, onUpdated, ref } from "vue";

export type textPlayerStyleType = {
  paddingInline: string;
  textAlign: "center" | "start" | "end";

  backgroundColor: string;
  color: string;

  fontSize: string;
  fontWeight: number | "bold" | "normal";
  lineHeight: string;
  letterSpacing?: string;
};

export type playerCallbacksType = {
  //called 30 times per seconds during playback
  onProgress: (currentTimeMs: number, totalDurationMs: number) => void;
  onFinish: () => void;
};

const props = defineProps<{
  text: string;
  onInput: (e: Event) => void;
  styleConfig: textPlayerStyleType;
  speed: number;
  playback: boolean;
  playbackCallbacks: playerCallbacksType;
}>();
const { backgroundColor, ...rest } = props.styleConfig;

const paragraph = ref<HTMLParagraphElement | null>(null);
const animation = ref<Animation | null>(null);

onMounted(() => {});
onUpdated(() => {
  if (paragraph.value && props.playback) {
    const pElement = paragraph.value;
    const totalHeight = pElement.scrollHeight;
    const displayingHeight = pElement.clientHeight;
    console.log(`totalHeight:${totalHeight},clientHeight:${displayingHeight}`);
    const ani = paragraph.value.animate(
      [
        { transform: `translate(0px,${displayingHeight / 2}px)`, offset: 0 },
        {
          transform: `translate(0px,${displayingHeight / 2 - totalHeight}px)`,
          offset: 1,
        },
      ],
      {
        easing: "linear",
        iterations: 1,
        duration: (totalHeight / props.speed) * 1000,
        fill: "forwards",
      }
    );
    animation.value = ani;
  }
});
</script>

<template>
  <div class="container" :style="{ backgroundColor }">
    <p v-if="playback" ref="paragraph" class="textPlayer" :style="{ ...rest }">
      {{ text }}
    </p>
    <textarea
      v-if="!playback"
      type="text"
      class="input"
      :style="{ ...rest }"
      :value="text"
      @input="onInput"
    >
    </textarea>
  </div>
</template>

<style scoped>
.container {
  overflow-y: hidden;

  margin-block: 0;
  margin-inline: 0;

  position: fixed;
  inset-inline: 0;
  inset-block-start: 0;

  block-size: 100vh;
}
.input,
.textPlayer {
  position: absolute;
  inset-inline: 0;
  inset-block: 0;
  margin-block: 0;
  margin-inline: 0;
  resize: none;

  font-family: sans-serif;

  background-color: transparent;
}
</style>
