<script setup lang="ts">
import TextPlayer, {
  playerCallbacksType,
  textPlayerStyleType,
} from "./components/TextPlayer.vue";
import PlaybackControl from "./components/PlaybackControl.vue";
import { sampleText } from "./components/sampleText";
import { ref } from "vue";

export type playbackStatusType = {
  currentTimeMs: number;
  totalDurationMs: number;
  progressPercentage: number;
};

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
    playbackStatus.value = {
      progressPercentage: progress,
      currentTimeMs: currentTime,
      totalDurationMs: duration,
    };
  },
};

const playing = ref(false);

//should only be set by onProgress callback
const playbackStatus = ref<playbackStatusType>({
  currentTimeMs: 0,
  totalDurationMs: 0,
  progressPercentage: 0,
});
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
      @change="(newProgress) => playerRef?.setProgress(newProgress)"
      :playback-status="playbackStatus"
    />
  </header>
  <main class="main">
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
  </main>
</template>

<style scoped>
.header {
  position: relative;
  z-index: 2;
  background-color: hsl(0, 0%, 20%);
}
.main {
  height: 100%;
  position: relative;
}
.progressContainer {
  display: flex;
  align-items: center;
  width: 50%;
}
</style>
