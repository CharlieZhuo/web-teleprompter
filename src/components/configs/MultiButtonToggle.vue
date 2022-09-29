<script setup lang="ts">
import { onMounted, onUpdated } from "vue";
import { replace, default as feather } from "feather-icons";
export type buttonOption = { optionValue: string; featherIcon?: string };

const props = defineProps<{
  label?: string;
  options: Array<buttonOption>;
  selected: string;
}>();
const emits = defineEmits<{
  (e: "change", newValue: string): void;
}>();
onMounted(() => {
  replace();
});
onUpdated(() => {
  replace();
});

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
      <i v-if="option.featherIcon" v-bind:data-feather="option.featherIcon"></i>
      <span v-if="!option.featherIcon">{{ option.optionValue }}</span>
    </button>
  </div>
</template>
<style scoped>
.multiButtonContainer {
  display: flex;
  align-items: center;
  gap: 5px;
}
.multiButtonContainer > .button:not(:last-child, :only-child) {
  border-inline-end: 1px solid gray;
}
.button {
  appearance: none;

  display: grid;
  place-items: center;

  background-color: hsl(0, 0%, 70%);
  color: black;
  border: 1px solid white;
}
.selected {
  box-shadow: inset 0px 0px 2px 2px black;
}
</style>
