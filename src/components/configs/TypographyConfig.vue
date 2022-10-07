<script setup lang="ts">
import NumberInput from "./NumberInput.vue";
import MultiButtonToggle, { buttonOption } from "./MultiButtonToggle.vue";
import extractNumber from "../../util/extractNumber";
import ToggleSwitch from "./ToggleSwitch.vue";
import StorageManager from "./StorageManager.vue";

export type configType = {
  paddingInline: string;
  textAlign: "center" | "start" | "end";

  backgroundColor: string;
  color: string;

  fontSize: string;
  fontWeight: number;
  lineHeight: string;

  horizontalMirror: boolean;
  verticalMirror: boolean;
  applyMirrorToAll: boolean;

  playbackSpeedPxPerSeceond: number;
};
const emits = defineEmits<{
  (e: "config", newConfig: configType): void;
}>();

const props = defineProps<{
  config: configType;
  text: string;
}>();

function generateHandler(
  keyParam: keyof configType,
  transformer?: (v: number) => string | number
) {
  return (nv: number) => {
    const newConfig = {
      ...props.config,
      [keyParam]: transformer ? transformer(nv) : nv,
    };
    emits("config", newConfig);
  };
}
const fontSizeHandler = generateHandler("fontSize", (v) => v + "px");
const fontWeightHandler = generateHandler("fontWeight");
const lineHeightHandler = generateHandler("lineHeight", (v) => v + "%");
const paddingHandler = generateHandler("paddingInline", (v) => v + "%");
const playbackSpeedHandler = generateHandler("playbackSpeedPxPerSeceond");

const configLoadHandler = (newConfig: configType) => {
  emits("config", newConfig);
};

function generateMultiButtonsHandler(
  keyParam: keyof configType,
  transformer?: (v: string) => string
) {
  return (nv: string) => {
    const newConfig = {
      ...props.config,
      [keyParam]: transformer ? transformer(nv) : nv,
    };
    emits("config", newConfig);
  };
}
const alignHandler = generateMultiButtonsHandler("textAlign");

const hmHanlder = () => {
  const newConfig = { ...props.config };
  newConfig.horizontalMirror = !newConfig.horizontalMirror;
  emits("config", newConfig);
};
const vmHanlder = () => {
  const newConfig = { ...props.config };
  newConfig.verticalMirror = !newConfig.verticalMirror;
  emits("config", newConfig);
};
const mirrorAllHandler = () => {
  const newConfig = { ...props.config };
  newConfig.applyMirrorToAll = !newConfig.applyMirrorToAll;
  emits("config", newConfig);
};

const alignOptions: buttonOption[] = [
  {
    optionValue: "start",
    featherIcon: "align-left",
  },
  {
    optionValue: "center",
    featherIcon: "align-center",
  },
  {
    optionValue: "end",
    featherIcon: "align-right",
  },
];
</script>
<template>
  <div class="configContainer">
    <div class="configPanel">
      <form class="configForm" @submit.prevent>
        <NumberInput
          :element-id="'fontSizeInput'"
          :label="'大小px'"
          :min="14"
          :max="100"
          :value="extractNumber(props.config.fontSize) || 0"
          @change="fontSizeHandler"
        ></NumberInput>
        <NumberInput
          :element-id="'fontWeightInput'"
          :label="'粗细'"
          :value="extractNumber(props.config.fontWeight) || 0"
          :max="900"
          :min="100"
          @Change="fontWeightHandler"
        ></NumberInput>
      </form>
      <p class="panelLabel">字体</p>
    </div>
    <div class="configPanel">
      <form class="configForm" @submit.prevent>
        <NumberInput
          :element-id="'lineHeightInput'"
          :label="'行高%'"
          :value="extractNumber(props.config.lineHeight) || 0"
          :min="100"
          :max="300"
          @Change="lineHeightHandler"
        ></NumberInput>
        <NumberInput
          :element-id="'paddingInput'"
          :label="'水平空白%'"
          :min="0"
          :max="40"
          :value="extractNumber(props.config.paddingInline) || 0"
          @Change="paddingHandler"
        ></NumberInput>
        <MultiButtonToggle
          :options="alignOptions"
          :label="'对齐方式'"
          :selected="props.config.textAlign"
          @change="alignHandler"
        ></MultiButtonToggle>
      </form>
      <p class="panelLabel">段落</p>
    </div>
    <div class="configPanel">
      <form class="configForm" @submit.prevent>
        <NumberInput
          :element-id="'lineHeightInput'"
          :label="'每秒像素'"
          :value="props.config.playbackSpeedPxPerSeceond"
          :min="10"
          :max="300"
          @Change="playbackSpeedHandler"
        ></NumberInput>
      </form>
      <p class="panelLabel">播放速度</p>
    </div>
    <div class="configPanel">
      <form class="configForm" @submit.prevent>
        <div
          :style="{
            display: 'flex',
          }"
        >
          <button
            id="vmButton"
            @click="vmHanlder"
            :style="{
              boxShadow: props.config.verticalMirror
                ? 'inset 0px 0px 0px 4px black'
                : 'none',
              transition: `box-shadow 0.3s ease-out`,
            }"
          >
            <svg
              :style="{
                transform: props.config.verticalMirror ? 'scale(1,-1)' : '',
              }"
              width="48"
              height="48"
              version="1.1"
              viewBox="0 0 16.933 16.933"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="m13.88 13.575h-10.699l2.5659-3.3366h5.566z"
                style="stroke-width: 0.26458px; stroke: #000"
              />
              <path
                d="m.86125 8.4667h15.211v-.08787"
                style="
                  fill: none;
                  stroke-dasharray: 2.4, 0.6, 0.3, 0.6;
                  stroke-dashoffset: 1.35;
                  stroke-width: 0.3;
                  stroke: #000;
                "
              />
              <path
                d="m3.1818 3.0943h10.699l-2.5659 3.3366h-5.566z"
                style="fill: none; stroke-width: 0.26458px; stroke: #000"
              />
            </svg>
          </button>
          <button
            id="hmButton"
            @click="hmHanlder"
            :style="{
              boxShadow: props.config.horizontalMirror
                ? 'inset 0px 0px 0px 4px black'
                : 'none',
              transition: `box-shadow 0.3s ease-out`,
            }"
          >
            <svg
              width="48"
              height="48"
              version="1.1"
              viewBox="0 0 16.933 16.933"
              xmlns="http://www.w3.org/2000/svg"
              :style="{
                transform: 'rotate(90deg) '.concat(
                  props.config.horizontalMirror ? ' scale(1,-1)' : ''
                ),
              }"
            >
              <path
                d="m13.88 13.575h-10.699l2.5659-3.3366h5.566z"
                style="stroke-width: 0.26458px; stroke: #000"
              />
              <path
                d="m.86125 8.4667h15.211v-.08787"
                style="
                  fill: none;
                  stroke-dasharray: 2.4, 0.6, 0.3, 0.6;
                  stroke-dashoffset: 1.35;
                  stroke-width: 0.3;
                  stroke: #000;
                "
              />
              <path
                d="m3.1818 3.0943h10.699l-2.5659 3.3366h-5.566z"
                style="fill: none; stroke-width: 0.26458px; stroke: #000"
              />
            </svg>
          </button>
        </div>
        <ToggleSwitch
          :checked="props.config.applyMirrorToAll"
          :id="'mirrorAll'"
          :label="'应用镜像至整个APP'"
          @change="mirrorAllHandler"
        ></ToggleSwitch>
      </form>
      <p class="panelLabel">镜像</p>
    </div>
    <div class="configPanel">
      <StorageManager
        :config="props.config"
        @config-loaded="configLoadHandler"
      ></StorageManager>
      <p class="panelLabel">保存与读取设置</p>
    </div>
  </div>
</template>
<style scoped>
.configContainer {
  display: flex;
  align-items: stretch;
  gap: 1rem;

  overflow-x: scroll;
  overflow-y: hidden;

  transition: block-size 0.4s ease-out;
}
.configContainer > *:not(:last-child) {
  border-right: solid 1px gray;
}
.configPanel {
  padding-inline: 0.5rem;
  padding-block: 0.2rem;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;

  touch-action: manipulation;
}
.configContainer button {
  appearance: none;
  display: grid;
  place-items: center;
  padding-block: 5px;
  padding-inline: 10px;
  margin-block: 0;
  margin-inline: 0;

  border: 1px solid black;

  background-color: rgb(208, 208, 208);
}
.configContainer button:hover:not(:active) {
  background-color: rgb(245, 245, 245);
}
.configForm svg {
  transition: transform 0.3s ease-out;
}
.panelLabel {
  margin-inline: 0;
  margin-block: 0;
}
</style>
