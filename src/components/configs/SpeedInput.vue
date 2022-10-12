<script setup lang="ts">
import { computed } from "@vue/reactivity";
import { inject } from "vue";
import { useIntl } from "vue-intl";
import { localeKey } from "../../IntlTypes";
import { lockedSpeedType, playbackConfigType } from "./TypographyConfig.vue";
import NumberInput from "./NumberInput.vue";
import { default as feather } from "feather-icons";

const intl = useIntl();
const locale = inject(localeKey);
const emits = defineEmits<{
  (e: "valueChange", newValue: number, type: lockedSpeedType): void;
  (e: "lockChange", type: lockedSpeedType): void;
}>();
const props = defineProps<{
  config: playbackConfigType;
  type: lockedSpeedType;
}>();

function inputChangeHandler(nv: number) {
  emits("valueChange", nv, props.type);
}
function lockClickHandler(e: Event) {
  emits("lockChange", props.type);
}
const label = computed(() => {
  switch (props.type) {
    case "totalTimeSecond":
      return intl.formatMessage({
        id: "totalTimeSecondLabel",
        defaultMessage: "总时长(秒)",
        description: "playback speed (in total seconds) input label.",
      });
    case "characterPerMinute":
      return intl.formatMessage({
        id: "characterPerMinuteLabel",
        defaultMessage: "字/分钟",
        description: "playback speed (in characters per minute) input label.",
      });
    case "wordPerMinute":
      return intl.formatMessage({
        id: "wordPerMinuteLabel",
        defaultMessage: "词/分钟",
        description: "playback speed (in words per minute) input label.",
      });
    default:
      return "";
  }
});
const bound = computed(() => {
  switch (props.type) {
    case "characterPerMinute":
      return { min: 60, max: 1800 };
    case "totalTimeSecond":
      return { min: 0, max: Number.MAX_SAFE_INTEGER };
    case "wordPerMinute":
      return { min: 10, max: 300 };
  }
});
</script>
<template>
  <div :class="$style.inputContainer">
    <NumberInput
      :label="label"
      :style="{ flex: `1 1 0` }"
      :value="props.config.speed[props.type]"
      :min="bound.min"
      :max="bound.max"
      @Change="inputChangeHandler"
    ></NumberInput>
    <button
      :class="$style.lockButton"
      @click="lockClickHandler"
      :style="{
        backgroundColor:
          props.config.lockedSpeed === props.type
            ? `rgb(132, 132, 132)`
            : `rgb(208, 208, 208)`,
      }"
    >
      <i
        :style="{
          inlineSize: `24px`,
          blockSize: `24px`,
        }"
        v-html="
          feather.icons[
            props.config.lockedSpeed === props.type ? 'lock' : 'unlock'
          ].toSvg({ stroke: `black ` })
        "
      ></i>
    </button>
  </div>
</template>
<style module>
.inputContainer {
  margin-block: 0.3em;

  display: flex;
  gap: 1em;
}
.lockButton {
  appearance: none;
  display: grid;
  place-items: center;
  padding-block: 5px;
  padding-inline: 10px;
  margin-block: 0;
  margin-inline: 0;

  border: 1px solid black;
}
</style>
