<script setup lang="ts">
const props = defineProps<{
  id: string;
  checked: boolean;
}>();
const emits = defineEmits<{
  (e: "change", checked: boolean): void;
}>();
const onClick = (e: Event) => {
  emits("change", !props.checked);
};
</script>

<template>
  <button :id="props.id" @click="onClick"><slot></slot></button>
</template>
