<script setup lang="ts">
import { computed } from "@vue/reactivity";
import { onMounted, onUnmounted, onUpdated, Ref, ref, watch } from "vue";

export type textPlayerStyleType = {
  paddingInline: string;
  textAlign: "center" | "start" | "end";

  backgroundColor: string;
  color: string;

  fontSize: string;
  fontWeight: number | "bold" | "normal";
  lineHeight: string;
  letterSpacing?: string;
};

export type onProgress = (
  currentTimeMs: number,
  totalDurationMs: number,
  progressPercentage: number
) => void;
export type onFinish = () => void;
export type playerCallbacksType = {
  onProgress: onProgress;
  onFinish: onFinish;
};

const props = defineProps<{
  text: string;
  onInput: (e: Event) => void;
  styleConfig: textPlayerStyleType;
  speed: number;
  playback: boolean;
  playbackCallbacks: playerCallbacksType;
}>();
const { backgroundColor, ...rest } = props.styleConfig;
const fps = 30;
const interval = 1000 / fps;

const paragraph = ref<HTMLParagraphElement | null>(null);
const editor = ref<HTMLTextAreaElement | null>(null);

function createAnimation<eleType extends HTMLElement>(
  ele: eleType,
  playbackSpeed: number
) {
  const scrollHeight = ele.scrollHeight;
  const clientHeight = ele.clientHeight;
  const ani = ele.animate(
    [
      { transform: `translate(0px,${clientHeight / 2}px)`, offset: 0 },
      {
        transform: `translate(0px,${clientHeight / 2 - scrollHeight}px)`,
        offset: 1,
      },
    ],
    {
      easing: "linear",
      iterations: 1,
      duration: (scrollHeight / playbackSpeed) * 1000,
      fill: "forwards",
    }
  );
  return ani;
}

const animation = ref<Animation | null>(null);
const observer = ref<ResizeObserver | null>(null);

//create new animation onMount, when <p> is resized
//and when content change
function useAnimation(elementToAnimate: Ref<HTMLParagraphElement | null>) {
  onMounted(() => {
    const ele = elementToAnimate.value;
    if (ele) {
      const ani = createAnimation(ele, props.speed);
      ani.pause();
      animation.value = ani;

      const newObserver = new ResizeObserver((entries) => {
        const entry = entries.at(0);
        if (entry) {
          console.log(`<p> element resized. Creating new animation object`);
          if (animation.value) {
            animation.value.cancel();
          }
          const newAni = createAnimation(
            entry.target as HTMLParagraphElement,
            props.speed
          );
          newAni.pause();
          animation.value = newAni;
        }
      });
      observer.value = newObserver;
      newObserver.observe(ele);
    }
  });
  onUnmounted(() => {
    if (observer.value) {
      observer.value.disconnect();
    }
  });
  //on content change
  watch(
    () => {
      return props.text;
    },
    (nv, ov, cleanup) => {
      const ele = elementToAnimate.value;
      if (ele) {
        const ani = createAnimation(ele, props.speed);
        ani.pause();
        animation.value = ani;
      }
      cleanup(() => {
        if (animation.value) {
          animation.value.cancel();
        }
      });
    }
  );
}

useAnimation(paragraph);

function usePlayback(animation: Ref<Animation | null>) {
  onUpdated(() => {
    if (animation.value) {
      if (props.playback) {
        animation.value.play();
      } else {
        animation.value.pause();
      }
    }
  });
}

usePlayback(animation);

const progress = ref<number | null>(null);
const timerId = ref<number | null>(null);

function useUpdateProgressFromPlayback(
  animation: Ref<Animation | null>,
  onProgress: onProgress
) {
  watch(
    [() => props.playback, animation],
    (nv, ov, cleanup) => {
      const [pb, ani] = nv;
      if (timerId.value && !pb) {
        console.log(`paused .clearing interval callback`);
        clearInterval(timerId.value);
        timerId.value = null;
      }
      timerId.value = setInterval(() => {
        if (ani) {
          const duration = ani.effect?.getTiming().duration;
          const currentTime = ani.currentTime;
          if (pb) {
            if (duration && currentTime) {
              progress.value = currentTime / +duration;
              onProgress(currentTime, +duration, progress.value);
            }
          }
        }
      }, interval);

      if (!pb && timerId.value) {
        clearInterval(timerId.value);
        timerId.value = null;
      }
      cleanup(() => {
        timerId.value && clearInterval(timerId.value);
      });
    },
    { flush: "post" }
  );
}
useUpdateProgressFromPlayback(animation, props.playbackCallbacks.onProgress);

function useFinishCallback() {
  watch(
    [animation, () => props.playbackCallbacks.onFinish],
    (nv, ov, cleanup) => {
      const [animation, onFinish] = nv;
      if (animation) {
        animation.addEventListener("finish", onFinish);
      }
      cleanup(() => {
        animation?.removeEventListener("finish", onFinish);
      });
    }
  );
}
useFinishCallback();

//restore progress for new animation
function useRestoreProgress(animation: Ref<Animation | null>) {
  watch([animation, progress], (nv) => {
    const [animation, progress] = nv;
    if (animation && progress) {
      const duration = animation.effect?.getTiming().duration;
      if (duration) {
        animation.currentTime = +duration * progress;
        props.playbackCallbacks.onProgress(
          animation.currentTime!,
          +duration,
          progress
        );
      }
    }
  });
}
useRestoreProgress(animation);

function clamp(v: number, min: number, max: number) {
  if (v > max) return max;
  else if (v < min) return min;
  return v;
}

//reflect playback position on editor
function useReflectPlaybackPositionOnEditor(
  progressP: Ref<number | null>,
  editorP: Ref<HTMLTextAreaElement | null>
) {
  watch(
    [() => props.playback, progressP, editorP],
    (nv, ov, cleanup) => {
      const [playing, pgs, edt] = nv;
      if (!playing) {
        if (pgs && edt) {
          edt.scrollTo(
            0,
            clamp(
              edt.scrollHeight * pgs - edt.clientHeight / 2,
              0,
              edt.scrollHeight
            )
          );
        }
      }
    },
    { flush: "post" }
  );
}

useReflectPlaybackPositionOnEditor(progress, editor);

function scrollHandler(e: Event) {
  const element = e.target as HTMLTextAreaElement;
  let pgs =
    (element.scrollTop + element.clientHeight / 2) / element.scrollHeight;
  progress.value = clamp(pgs, 0, 1);
}
function useUpdateProgressFromEditorScroll() {
  watch(
    editor,
    (nv, ov, cleanup) => {
      if (nv) {
        nv.addEventListener("scroll", scrollHandler);
      }
      // cleanup(() => {
      //   if (nv) nv.removeEventListener("scroll", scrollHandler);
      // });
    },
    { flush: "post" }
  );
}
useUpdateProgressFromEditorScroll();
</script>

<template>
  <div class="container" :style="{ backgroundColor }">
    <p
      ref="paragraph"
      class="textPlayer"
      :style="{ ...rest, opacity: props.playback ? '1' : '0', zIndex: -1 }"
    >
      {{ text }}
    </p>
    <textarea
      ref="editor"
      class="input"
      :style="{ ...rest, display: !props.playback ? 'block' : 'none' }"
      :value="text"
      @input="props.onInput"
    >
    </textarea>
  </div>
</template>

<style scoped>
.container {
  overflow-y: hidden;

  margin-block: 0;
  margin-inline: 0;

  position: fixed;
  inset-inline: 0;
  inset-block-start: 0;

  block-size: 100vh;
}
.input,
.textPlayer {
  position: absolute;
  inset-inline: 0;
  inset-block: 0;
  margin-block: 0;
  margin-inline: 0;
  resize: none;

  font-family: sans-serif;
  white-space: pre-wrap;
  overflow-wrap: break-word;

  background-color: transparent;
}
</style>
