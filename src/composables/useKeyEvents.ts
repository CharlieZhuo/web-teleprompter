import { onMounted, onUnmounted } from "vue";

export function useKeyEvents(handlers: {
  onDown?: (e: KeyboardEvent) => void;
}) {
  onMounted(() => {
    handlers.onDown && document.addEventListener("keydown", handlers.onDown);
  });
  onUnmounted(() => {
    handlers.onDown && document.removeEventListener("keydown", handlers.onDown);
  });
}
