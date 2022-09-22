<script setup lang="ts">
import { onMounted, onUpdated, ref, watch } from "vue";

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
const fps = 30;
const interval = 1000 / fps;

const paragraph = ref<HTMLParagraphElement | null>(null);
const editor = ref<HTMLTextAreaElement | null>(null);
const animation = ref<Animation | null>(null);

const timerId = ref();

const progress = ref<number | null>(null);

onUpdated(() => {
  if (!animation.value) {
    console.log(`creating new animation`);
    if (paragraph.value && props.playback) {
      const pElement = paragraph.value;
      const totalHeight = pElement.scrollHeight;
      const displayingHeight = pElement.clientHeight;
      console.log(
        `totalHeight:${totalHeight},clientHeight:${displayingHeight}`
      );
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

      //clear timer
      if (timerId.value) {
        clearInterval(timerId.value);
      }
      //set up timer to call onProgress callback periodicly
      timerId.value = setInterval(() => {
        if (animation.value) {
          const duration = animation.value.effect?.getTiming().duration;
          const currentTime = animation.value.currentTime;
          if (duration && currentTime) {
            progress.value = currentTime / +duration;
            props.playbackCallbacks.onProgress(currentTime, +duration);
          }
        }
      }, interval);
    }
  } else {
    if (props.playback) animation.value.play();
    else {
      animation.value.pause();

      if (progress.value && editor.value) {
        const textAreaElement = editor.value;
        textAreaElement.scrollTo(
          0,
          textAreaElement.scrollHeight * progress.value -
            textAreaElement.clientHeight / 2
        );
      }
    }
  }
});
</script>

<template>
  <div class="container" :style="{ backgroundColor }">
    <p
      ref="paragraph"
      class="textPlayer"
      :style="{ ...rest, opacity: props.playback ? '1' : '0', zIndex: -1 }"
    >
      {{ text }}
    </p>
    <textarea
      ref="editor"
      class="input"
      :style="{ ...rest, display: !props.playback ? 'block' : 'none' }"
      :value="text"
      @input="props.onInput"
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
  white-space: pre-wrap;
  overflow-wrap: break-word;

  background-color: transparent;
}
</style>
