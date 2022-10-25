import { onMounted, onUnmounted, ref, Ref, unref } from "vue";
export type handlerType = {
  onDown?: (e: PointerEvent) => void;
  onMove?: (e: PointerEvent) => void;
  onUp?: (e: PointerEvent) => void;
  onCancel?: (e: PointerEvent) => void;
};

export function usePointerEvent<eleType extends HTMLElement>(
  elementRef: eleType | null | Ref<eleType | null>,
  ...handlers: handlerType[]
) {
  const moving = ref(false);
  function onDownHandler(e: PointerEvent) {
    console.debug("pointerDown");
    moving.value = true;
    handlers.forEach((h) => {
      h.onDown && h.onDown(e);
    });
    const currentTarget = e.currentTarget as eleType;
    currentTarget.setPointerCapture(e.pointerId);
  }

  function onMoveHandler(e: PointerEvent) {
    if (moving.value) {
      //if primary button is not pressed anymore
      if (e.buttons % 2 !== 1) {
        onUpHandler(e);
      } else {
        handlers.forEach((h) => {
          h.onMove && h.onMove(e);
        });
      }
    }
  }

  function onUpHandler(e: PointerEvent) {
    console.debug("pointerUp");
    moving.value = false;
    handlers.forEach((h) => {
      h.onUp && h.onUp(e);
    });
    const currentTarget = e.currentTarget as eleType;
    currentTarget.releasePointerCapture(e.pointerId);
  }

  function onCancelHandler(e: PointerEvent) {
    console.debug(`pointer:${e.pointerId} canceled`);
    moving.value = false;
    handlers.forEach((h) => {
      h.onCancel && h.onCancel(e);
    });
    const currentTarget = e.currentTarget as eleType;
    currentTarget.releasePointerCapture(e.pointerId);
  }
  function blurHandler(e: FocusEvent) {
    moving.value = false;
  }
  function dragStartHandler(e: DragEvent) {
    e.preventDefault();
  }
  function clickHandler(e: MouseEvent) {
    e.preventDefault();
  }

  onMounted(() => {
    const element = unref(elementRef);
    if (element) {
      console.log(`adding pointer event listeners`);
      element.addEventListener("pointerdown", onDownHandler);
      element.addEventListener("pointermove", onMoveHandler);
      element.addEventListener("pointerup", onUpHandler);
      element.addEventListener("pointercancel", onCancelHandler);
      element.addEventListener("blur", blurHandler);
      element.addEventListener("dragstart", dragStartHandler);
      element.addEventListener("click", clickHandler);
    }
  });
  onUnmounted(() => {
    const element = unref(elementRef);
    if (element) {
      element.removeEventListener("pointerdown", onDownHandler);
      element.removeEventListener("pointermove", onMoveHandler);
      element.removeEventListener("pointerup", onUpHandler);
      element.removeEventListener("pointercancel", onCancelHandler);
      element.removeEventListener("blur", blurHandler);
      element.removeEventListener("dragstart", dragStartHandler);
      element.removeEventListener("click", clickHandler);
    }
  });
}
