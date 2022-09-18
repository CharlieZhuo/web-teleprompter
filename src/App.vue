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

const callbacks: playerCallbacksType = {
  onFinish() {},
  onProgress(currentTimeMs, totalDurationMs) {},
};

const inputText = ref(sampleText);
const onInput = (e: Event) => {
  const inputElement = e.target as HTMLInputElement;
  inputText.value = inputElement.value;
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
    :playback-callbacks="callbacks"
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
