<script setup lang="ts">
import TextPlayer, {
  playerCallbacksType,
  textPlayerStyleType,
} from "./components/TextPlayer.vue";
import PlaybackControl from "./components/PlaybackControl.vue";
import ProgressBarVue from "./components/ProgressBar.vue";
import { sampleText } from "./components/sampleText";
import { ref } from "vue";
import ProgressBar from "./components/ProgressBar.vue";
import PlaybackTime from "./components/PlaybackTime.vue";

const defaultStyle: textPlayerStyleType = {
  color: "white",
  backgroundColor: "black",
  fontSize: "30px",
  fontWeight: "normal",
  lineHeight: "150%",
  textAlign: "center",
  paddingInline: "4em",
};

const inputText = ref(sampleText);
const onInput = (e: Event) => {
  const inputElement = e.target as HTMLInputElement;
  inputText.value = inputElement.value;
};
const callback: playerCallbacksType = {
  onFinish: () => {
    playing.value = false;
  },
  onProgress: (currentTime, duration, progress) => {
    playbackProgress.value = {
      progressPercentage: progress,
      currentTimeMs: currentTime,
      totalDurationMs: duration,
    };
  },
};

const playing = ref(false);

//should only be set by onProgress callback
const playbackProgress = ref<{
  currentTimeMs: number;
  totalDurationMs: number;
  progressPercentage: number;
}>({ currentTimeMs: 0, totalDurationMs: 0, progressPercentage: 0 });
const playerRef = ref<InstanceType<typeof TextPlayer> | null>(null);

const stopButtonHandler = () => {
  if (playerRef.value) playerRef.value.stopPlayback();
  playing.value = false;
};
</script>

<template>
  <header class="header">
    <PlaybackControl
      :playing="playing"
      :onPlayPausePress="
        () => {
          playing = !playing;
        }
      "
      :onStopPress="stopButtonHandler"
    />
    <div class="progressContainer">
      <ProgressBar
        :progress="playbackProgress.progressPercentage"
        @change="(newProgress) => playerRef?.setProgress(newProgress)"
      ></ProgressBar>
      <PlaybackTime
        :current-time-ms="playbackProgress.currentTimeMs"
        :total-duration-ms="playbackProgress.totalDurationMs"
      ></PlaybackTime>
    </div>
  </header>
  <TextPlayer
    ref="playerRef"
    :text="inputText"
    :onInput="onInput"
    :styleConfig="defaultStyle"
    :speed="300"
    :playback="playing"
    :playback-callbacks="callback"
    :callback-config="{ frequency: 30 }"
  />
</template>

<style scoped>
.header {
  position: absolute;
  z-index: 2;
  inset-inline: 0;
  inset-block-start: 0;
  height: max-content;
}
.progressContainer {
  display: flex;
  align-items: center;
  width: 50%;
}
</style>
