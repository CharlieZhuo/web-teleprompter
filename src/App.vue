<script setup lang="ts">
import TextPlayer, { playerCallbacksType } from "./components/TextPlayer.vue";
import PlaybackControl from "./components/PlaybackControl.vue";
import { sampleText } from "./components/sampleText";
import { ref, watch } from "vue";
import TypographyConfig from "./components/configs/TypographyConfig.vue";
import { configType } from "./components/configs/TypographyConfig.vue";
import FloatingButton from "./components/FloatingButton.vue";
import { default as feather, icons } from "feather-icons";
import CollapsePanel from "./components/CollapsePanel.vue";

export type playbackStatusType = {
  currentTimeMs: number;
  totalDurationMs: number;
  progressPercentage: number;
};

const defaultStyle: configType = {
  color: "white",
  backgroundColor: "black",
  fontSize: "70px",
  fontWeight: 500,
  lineHeight: "150%",
  textAlign: "center",
  paddingInline: "10%",
  applyMirrorToAll: false,
  horizontalMirror: false,
  verticalMirror: false,
  playbackSpeedPxPerSeceond: 35,
};

const config = ref(defaultStyle);
const onNewConfig = (newConfig: configType) => {
  console.debug(`new config:`);
  console.debug(newConfig);
  config.value = newConfig;
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

watch(
  config,
  (nc) => {
    const appElement = document.getElementById("app");
    if (appElement) {
      appElement.style.transform = nc.applyMirrorToAll
        ? `scale(${nc.horizontalMirror ? -1 : 1},${nc.verticalMirror ? -1 : 1})`
        : "";
    }
  },
  { deep: true }
);
const showPanel = ref(true);
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
    <CollapsePanel :collapsed="!showPanel">
      <TypographyConfig
        :config="config"
        :text="inputText"
        @config="onNewConfig"
      ></TypographyConfig>
    </CollapsePanel>
  </header>
  <main class="main">
    <TextPlayer
      ref="playerRef"
      :text="inputText"
      :onInput="onInput"
      :config="config"
      :playback="playing"
      :playback-callbacks="callback"
      :callback-config="{ frequency: 30 }"
    />
  </main>
  <FloatingButton
    :label="{
      type: 'featherIcon',
      featherIcon: 'sliders',
    }"
    @click="showPanel = !showPanel"
  ></FloatingButton>
</template>

<style scoped>
.header {
  position: relative;
  z-index: 2;
  background-color: hsl(0, 0%, 20%);

  overflow-x: hidden;
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
