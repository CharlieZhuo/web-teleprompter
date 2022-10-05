<script setup lang="ts">
import { computed } from "@vue/reactivity";
import { nanoid } from "nanoid";

const props = defineProps<{
  id?: string;
  label?: string;
  checked: boolean;
}>();
const emits = defineEmits<{
  (e: "change", checked: boolean): void;
}>();
const onClick = (e: Event) => {
  emits("change", !props.checked);
};
const id = computed(() => {
  id || nanoid();
});
</script>

<template>
  <label class="toggleSwitchLabel" v-if="props.label" for="id"
    >{{ props.label }}
  </label>
  <button
    :id="id"
    class="toggleSwitch"
    @click="onClick"
    :style="{
      backgroundColor: props.checked ? `#9ef075cc` : 'white',
    }"
  >
    <div
      class="thumb"
      :style="{
        transform: props.checked ? `translate(var(--blockSize), 0)` : '',
      }"
    ></div>
  </button>
</template>

<style>
.toggleSwitchLabel {
  inline-size: max-content;
}
.toggleSwitch {
  --inlineSize: 4rem;
  --blockSize: 2rem;
  appearance: none;

  padding-inline: 0;
  padding-block: 0;
  position: relative;
  display: inline-grid;
  place-items: center;

  inline-size: var(--inlineSize);
  block-size: var(--blockSize);

  border-radius: calc(0.5 * var(--blockSize));

  border: 0px;

  outline: 1px solid black;

  cursor: pointer;
  touch-action: none;

  transition: background-color 0.3s ease-out;
}

.thumb {
  --thumb-size: var(--blockSize);
  content: "";
  position: absolute;
  inset-inline-start: 0;
  inline-size: var(--thumb-size);
  block-size: var(--thumb-size);

  border-radius: 50%;

  background-color: hsla(0, 0%, 100%, 1);
  box-shadow: 0px 0px 0px 2px gray;

  outline: 1px solid black;

  transition: transform 0.3s linear;
}
.toggleSwitch:hover .thumb {
  box-shadow: 0px 0px 0px 4px gray;
}
</style>
