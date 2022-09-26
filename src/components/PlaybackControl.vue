<script setup lang="ts">
import ProgressBar from "./ProgressBar.vue";
import PlaybackTime from "./PlaybackTime.vue";
import { playbackStatusType } from "../App.vue";
const props = defineProps<{
  playing: boolean;
  onPlayPausePress: () => void;
  onStopPress: () => void;
  playbackStatus: playbackStatusType;
}>();
const emit = defineEmits<{
  (e: "change", newProgress: number): void;
}>();
</script>
<template>
  <div class="container">
    <button @click="onPlayPausePress">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        class="icon play"
        v-if="!playing"
      >
        <polygon points="5 3 19 12 5 21 5 3"></polygon>
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        class="icon stop"
        v-if="playing"
      >
        <rect x="6" y="4" width="4" height="16"></rect>
        <rect x="14" y="4" width="4" height="16"></rect>
      </svg>
    </button>

    <button @click="onStopPress">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        :style="{ stroke: 'red' }"
        class="icon stop"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      </svg>
    </button>

    <ProgressBar
      :progress="props.playbackStatus.progressPercentage"
      @change="(npgs) => $emit('change', npgs)"
    ></ProgressBar>
    <PlaybackTime
      :currentTimeMs="props.playbackStatus.currentTimeMs"
      :totalDurationMs="props.playbackStatus.totalDurationMs"
    ></PlaybackTime>
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
