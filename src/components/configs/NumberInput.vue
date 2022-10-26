<script setup lang="ts">
import { computed } from "@vue/reactivity";
import { nanoid } from "nanoid";

const props = defineProps<{
  elementId?: string;
  label: string;
  value: number;
  min: number;
  max: number;
}>();
const emits = defineEmits<{
  (e: "change", newValue: number): void;
}>();
const onChange = (e: Event) => {
  const element = e.target as HTMLInputElement;
  const value = +element.value;
  if (value < props.max && value > props.min) emits("change", value);
};

const id = computed(() => {
  if (props.elementId) return props.elementId;
  else return nanoid();
});
</script>
<template>
  <label class="numberInputLabel" :for="id">
    <span>
      {{ props.label }}
    </span>
    <input
      class="numberInput"
      :id="id"
      :name="props.elementId"
      type="number"
      :value="props.value"
      :max="props.max"
      :min="props.min"
      @change="onChange"
    />
  </label>
</template>
<style scoped>
.numberInputLabel {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1em;

  margin-block: 0.3rem;
}
.numberInputLabel span {
  min-inline-size: max-content;
}
.numberInput {
  text-align: end;
  inline-size: 5em;
}
</style>
