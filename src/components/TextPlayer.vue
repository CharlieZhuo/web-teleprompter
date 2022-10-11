<script setup lang="ts">
import { computed } from "@vue/reactivity";
import { onUpdated, ref } from "vue";
import {
  clamp,
  useAnimation,
  useFinishCallback,
  useReflectPlaybackProp,
  useReflectProgressOnEditor,
  useRestoreProgressToNewAnimation,
  useUpdateProgressFromEditorScroll,
  useUpdateProgressFromPlayback,
} from "../composables/Animations";

import { configType } from "./configs/TypographyConfig.vue";

export type onProgress = (
  currentTimeMs: number,
  totalDurationMs: number,
  progressPercentage: number
) => void;
export type onFinish = () => void;
export type playerCallbacksType = {
  onProgress: onProgress;
  onFinish: onFinish;
};

const props = defineProps<{
  text: string;
  onInput: (e: Event) => void;
  config: configType;
  playback: boolean;
  playbackCallbacks: playerCallbacksType;
  callbackConfig: {
    frequency: number;
  };
}>();

const mirrorTransform = computed(() => {
  return props.config.applyMirrorToAll
    ? undefined
    : `scale(${props.config.horizontalMirror ? -1 : 1},${
        props.config.verticalMirror ? -1 : 1
      })`;
});

const fps = computed(() => props.callbackConfig.frequency);
const interval = computed(() => {
  return 1000 / fps.value;
});

const paragraph = ref<HTMLParagraphElement | null>(null);
const editor = ref<HTMLTextAreaElement | null>(null);

const { animation } = useAnimation(
  paragraph,
  computed(() => props.config.playbackConfig.speed.totalTimeMiliSecond),
  computed(() => props.text),
  computed(() => props.config)
);
useReflectPlaybackProp(
  animation,
  computed(() => props.playback)
);

useFinishCallback(animation, props.playbackCallbacks.onFinish);

const { progress } = useUpdateProgressFromPlayback(
  animation,
  computed(() => props.playback),
  props.playbackCallbacks.onProgress,
  interval.value
);

useRestoreProgressToNewAnimation(
  animation,
  progress,
  props.playbackCallbacks.onProgress
);

useReflectProgressOnEditor(
  computed(() => props.playback),
  progress,
  editor
);
useUpdateProgressFromEditorScroll(progress, editor);

function stopPlayback() {
  console.log(`Stopped playing.Setting progress to 0.`);
  progress.value = 0;
}

function setProgress(newProgress: number) {
  progress.value = clamp(newProgress, 0, 1);
}

defineExpose({ stopPlayback, setProgress });
</script>

<template>
  <div
    class="transformContainer"
    :style="{
      transform: mirrorTransform,
      transition: props.config.applyMirrorToAll
        ? ''
        : ' transform 0.3s ease-out',
    }"
  >
    <p
      ref="paragraph"
      class="textPlayer"
      :style="{
        ...props.config,
        opacity: props.playback ? '1' : '0',
        zIndex: -1,
      }"
    >
      {{ text }}
    </p>
    <textarea
      ref="editor"
      class="input"
      :style="{
        ...props.config,
        display: !props.playback ? 'block' : 'none',
        zIndex: 2,
        // opacity: 0,
      }"
      :value="text"
      @input="props.onInput"
    >
    <span class="spacer"></span>
    <span class="spacer"></span>
  </textarea
    >
    <div
      class="background"
      :style="{
        backgroundColor: props.config.backgroundColor,
        zIndex: -2,
      }"
    ></div>
  </div>
</template>

<style scoped>
.transformContainer {
  position: absolute;
  inset: 0;
}
.background {
  overflow-y: hidden;
  position: relative;

  height: 100%;

  margin-block: 0;
  margin-inline: 0;
}
.input,
.textPlayer {
  position: absolute;
  inset: 0;

  margin-block: 0;
  margin-inline: 0;
  resize: none;

  font-family: sans-serif;
  white-space: pre-wrap;
  overflow-wrap: break-word;

  background-color: transparent;
}

.input {
  border-width: 0px;
  outline: 0px solid white;
}
.spacer {
  height: 50%;
}
</style>
