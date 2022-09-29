<script setup lang="ts">
import ProgressBar from "./ProgressBar.vue";
import PlaybackTime from "./PlaybackTime.vue";
import { playbackStatusType } from "../App.vue";
import { onMounted, onUnmounted, onUpdated, ref } from "vue";
import feather, { icons } from "feather-icons";
const props = defineProps<{
  playing: boolean;
  onPlayPausePress: () => void;
  onStopPress: () => void;
  playbackStatus: playbackStatusType;
}>();
const emit = defineEmits<{
  (e: "change", newProgress: number): void;
}>();
const inFullscreen = ref(false);

const fsChangeHandler = () => {
  inFullscreen.value = Boolean(document.fullscreenElement);
};
onMounted(() => {
  document.addEventListener("fullscreenchange", fsChangeHandler);
  fsChangeHandler();
});
onUpdated(() => {});
onUnmounted(() => {
  document.removeEventListener("fullscreenchange", fsChangeHandler);
});

const fsButtonHandler = () => {
  if (inFullscreen.value) {
    document.exitFullscreen();
  } else {
    document.documentElement.requestFullscreen();
  }
};
</script>
<template>
  <div class="container">
    <button
      @click="onPlayPausePress"
      :style="{
        stroke: props.playing ? 'blue' : 'green',
      }"
      v-html="
        props.playing
          ? feather.icons['pause'].toSvg({ stroke: 'blue' })
          : feather.icons['play'].toSvg({ stroke: 'green' })
      "
    ></button>

    <button
      @click="onStopPress"
      v-html="feather.icons['square'].toSvg({ stroke: 'red' })"
    ></button>

    <ProgressBar
      :progress="props.playbackStatus.progressPercentage"
      @change="(npgs) => $emit('change', npgs)"
    ></ProgressBar>
    <PlaybackTime
      :currentTimeMs="props.playbackStatus.currentTimeMs"
      :totalDurationMs="props.playbackStatus.totalDurationMs"
    ></PlaybackTime>
    <button
      @click="fsButtonHandler"
      v-html="
        inFullscreen
          ? feather.icons['minimize'].toSvg()
          : feather.icons['maximize'].toSvg()
      "
    ></button>
  </div>
</template>
<style scoped>
.container {
  display: flex;
  align-items: center;
  gap: 1rem;

  padding-inline: 1rem;
}
.container button {
  appearance: none;

  display: grid;
  place-items: center;

  padding: 2px 5px;

  border-radius: 10%;

  background-color: hsl(0, 0%, 50%);
}

.container button:hover:not(:active) {
  background-color: hsl(0, 0%, 70%);
}
.play {
  stroke: hsl(134, 63%, 41%);
}

.pause {
  stroke: hsl(0, 72%, 57%);
}
.icon {
  width: 36px;
  height: 36px;
  fill: none;

  stroke-width: 2px;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: transform 0.4s;
}
</style>
