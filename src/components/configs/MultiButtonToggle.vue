<script setup lang="ts">
import { default as feather } from "feather-icons";
export type buttonOption = { optionValue: string; featherIcon?: string };

const props = defineProps<{
  label?: string;
  options: Array<buttonOption>;
  selected: string;
}>();
const emits = defineEmits<{
  (e: "change", newValue: string): void;
}>();

const onClick = (e: Event) => {
  const element = e.currentTarget as HTMLElement;
  if (element.tagName === "BUTTON" && element.id !== props.selected) {
    emits("change", element.id);
  }
};
</script>
<template>
  <div class="multiButtonContainer">
    <label v-if="props.label">{{ props.label }}</label>
    <button
      v-for="option in props.options"
      :key="option.optionValue"
      class="button"
      :class="{ selected: props.selected === option.optionValue }"
      :id="option.optionValue"
      v-on:click="onClick"
    >
      <i
        v-if="option.featherIcon"
        v-html="feather.icons[option.featherIcon].toSvg()"
      ></i>
      <span v-if="!option.featherIcon">{{ option.optionValue }}</span>
    </button>
  </div>
</template>
<style scoped>
.multiButtonContainer {
  display: flex;
  align-items: stretch;
  gap: 0.6rem;
}
.multiButtonContainer > .button:not(:last-child, :only-child) {
  border-inline-end: 1px solid gray;
}
.multiButtonContainer label {
  min-inline-size: max-content;
}
.button {
  appearance: none;

  display: grid;
  place-items: center;

  background-color: hsl(0, 0%, 70%);
  color: black;
  border: 1px solid white;

  padding-block: 0.2rem;
  padding-inline: 0.6rem;
  font-size: 1.1rem;

  inline-size: max-content;
}
.button i {
  display: grid;
  place-items: center;
}
.button span {
  inline-size: max-content;
}
.selected {
  outline: solid 5px white;
}
</style>
