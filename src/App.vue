<script setup lang="ts">
import TextPlayer, {
  playerCallbacksType,
  textPlayerStyleType,
} from "./components/TextPlayer.vue";
import PlaybackControl from "./components/PlaybackControl.vue";
import { sampleText } from "./components/sampleText";
import { ref } from "vue";

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
    console.log(`percentage:${progress}`);
  },
};

const playing = ref(false);
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
      :onStopPress="
        () => {
          playing = false;
        }
      "
    />
  </header>
  <TextPlayer
    :text="inputText"
    :onInput="onInput"
    :styleConfig="defaultStyle"
    :speed="300"
    :playback="playing"
    :playback-callbacks="callback"
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
</style>
