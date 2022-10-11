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
    case "pxPerSeceond":
      return intl.formatMessage({
        id: "speedPxLabel",
        defaultMessage: "滚动速度（像素/秒）",
        description: "playback speed (in px per second) input label.",
      });

    case "totalTimeMiliSecond":
      return intl.formatMessage({
        id: "totalTimeMiliSecondLabel",
        defaultMessage: "总时长（毫秒）",
        description: "playback speed (in total miliseconds) input label.",
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
</script>
<template>
  <div :class="$style.inputContainer">
    <NumberInput
      :label="label"
      :style="{ flex: `1 1 0` }"
      :value="props.config.speed[props.type]"
      :min="10"
      :max="300"
      @Change="inputChangeHandler"
    ></NumberInput>
    <button :class="$style.lockButton" @click="lockClickHandler">
      <i
        v-html="
          feather.icons[
            props.config.lockedSpeed === props.type ? 'unlock' : 'lock'
          ].toSvg()
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
  display: block;
}
</style>
