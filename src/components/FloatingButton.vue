<script setup lang="ts">
import { icons } from "feather-icons";

const emits = defineEmits<{
  (e: "click"): void;
}>();
const props = defineProps<{
  label:
    | {
        type: "text";
        text: string;
      }
    | {
        type: "featherIcon";
        featherIcon: string;
      };
}>();
const clickHandler = () => {
  emits("click");
};
</script>
<template>
  <button class="fab" @click="clickHandler">
    <i v-if="props.label.type === 'featherIcon'">
      <div v-html="icons[props.label.featherIcon].toSvg()"></div
    ></i>
    <span v-if="props.label.type === 'text'"> {{ props.label.text }}</span>
  </button>
</template>
<style>
.fab {
  position: absolute;

  z-index: 10;

  inset-inline-end: 10vw;
  inset-block-end: 10vh;

  appearance: none;
  inline-size: 60px;
  block-size: 60px;

  display: grid;
  place-items: center;

  background-color: hsla(0, 0%, 70%, 0.314);
  color: black;

  backdrop-filter: blur(3px);

  border: 0px;
  border-radius: 50%;

  box-shadow: 0px 0px 2px 1px rgb(85, 85, 85);

  transition: background-color 0.3s ease-out;
}
.fab:hover:not(:active) {
  background-color: hsl(0, 0%, 90%);
  box-shadow: 0px 0px 3px 2px rgb(85, 85, 85);
}
</style>
