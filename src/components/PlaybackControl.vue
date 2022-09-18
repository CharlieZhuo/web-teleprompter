<script setup lang="ts">
const props = defineProps<{
  playing: boolean;
  onPlayPausePress: () => void;
  onStopPress: () => void;
}>();
</script>
<template>
  <div class="container">
    <button id="playPause" @click="onPlayPausePress">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        class="icon"
        v-if="!playing"
        :style="{ stroke: 'green' }"
      >
        <polygon points="5 3 19 12 5 21 5 3"></polygon>
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        class="icon"
        v-if="playing"
        :style="{ stroke: 'blue' }"
      >
        <rect x="6" y="4" width="4" height="16"></rect>
        <rect x="14" y="4" width="4" height="16"></rect>
      </svg>
    </button>

    <button id="stop" @click="onStopPress">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        :style="{ stroke: 'red' }"
        class="icon"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      </svg>
    </button>
  </div>
</template>
<style scoped>
.container {
  display: flex;
}
.container button {
  display: grid;
  place-items: center;
}
.icon {
  width: 36px;
  height: 36px;
  fill: none;

  stroke-width: 2px;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: transform 0.4s;
}
</style>
