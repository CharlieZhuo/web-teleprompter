<script setup lang="ts">
import { onMounted, onUpdated } from "vue";

const props = defineProps<{
  options: Array<string>;
  selected: string;
  onChange: (newValue: string) => void;
}>();
function checkSelectedIsValid() {
  const valid = props.options.some((option) => {
    return option === props.selected;
  });
  if (!valid)
    console.error(
      `Selected option :${
        props.selected
      } is not present among options:${props.options.join(",")}`
    );
}
onMounted(() => {
  checkSelectedIsValid();
});
onUpdated(() => {
  checkSelectedIsValid();
});
</script>
<template>
  <div class="multiButtonContainer">
    <button
      v-for="option in props.options"
      :key="option"
      class="button"
      :class="{ styles: props.selected === option }"
    >
      {{ option }}
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
  background-color: transparent;
  color: black;
}
</style>
