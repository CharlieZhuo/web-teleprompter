//create new animation onMount, when <p> is resized

import { onMounted, onUnmounted, onUpdated, ref, Ref, watch } from "vue";

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

//create new animation when:
//onMount,
//element is resized,
//content change
export function useAnimation<eleType extends HTMLElement>(
  elementToAnimate: Ref<eleType | null>,
  playbackSpeedPxPerSecond: number,
  ...restWatchItems: any[]
) {
  const animation = ref<Animation | null>(null);
  const observer = ref<ResizeObserver | null>(null);

  onMounted(() => {
    const ele = elementToAnimate.value;
    if (ele) {
      const ani = createAnimation(ele, playbackSpeedPxPerSecond);
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
            playbackSpeedPxPerSecond
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
    [
      () => {
        return playbackSpeedPxPerSecond;
      },
      ...restWatchItems.map((item) => {
        return () => item;
      }),
    ],
    (nv, ov, cleanup) => {
      const ele = elementToAnimate.value;
      if (ele) {
        const ani = createAnimation(ele, nv[0]);
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
  return { animation };
}

//control animation playback using prop
export function useReflectPlaybackProp(
  animationParam: Ref<Animation | null>,
  playbackParam: Readonly<Ref<Readonly<boolean>>>
) {
  watch([animationParam, playbackParam], ([animation, playback]) => {
    if (animation) {
      if (playback) {
        animation.play();
      } else {
        animation.pause();
      }
    }
  });
}

export function useUpdateProgressFromPlayback(
  animation: Ref<Animation | null>,
  playbackParam: Readonly<Ref<Readonly<boolean>>>,
  callback: (
    currentTimeMs: number,
    totalDurationMs: number,
    progressPercentage: number
  ) => void,
  callbackIntervalMs: number
) {
  const progress = ref<number>(0);
  const timerId = ref<number | null>(null);

  watch(
    [playbackParam, animation, () => callback],
    (nv, ov, cleanup) => {
      const [playback, animation, callback] = nv;

      if (animation) {
        if (timerId.value) {
          clearInterval(timerId.value);
          timerId.value = null;
          console.log(` Stopped calling progress callback`);
        } else if (playback) {
          timerId.value = setInterval(() => {
            if (animation) {
              const duration = animation.effect?.getTiming().duration;
              const currentTime = animation.currentTime;
              if (duration && currentTime) {
                progress.value = currentTime / +duration;
                callback(currentTime, +duration, progress.value);
              }
            }
          }, callbackIntervalMs);
        }
      }
    },
    { flush: "post" }
  );
  return { progress };
}

export function useFinishCallback(
  animation: Ref<Animation | null>,
  callback: () => void
) {
  watch([animation, () => callback], (nv, ov, cleanup) => {
    const [animation, onFinish] = nv;
    if (animation) {
      animation.addEventListener("finish", onFinish);
    }
    cleanup(() => {
      animation?.removeEventListener("finish", onFinish);
    });
  });
}

//restore progress for new animation
export function useRestoreProgressToNewAnimation(
  animation: Ref<Animation | null>,
  progress: Ref<number>,
  callback: (
    currentTimeMs: number,
    totalDurationMs: number,
    progressPercentage: number
  ) => void
) {
  watch([animation, progress, () => callback], (nv) => {
    const [animation, progress, onProgress] = nv;
    if (animation) {
      const duration = animation.effect?.getTiming().duration;
      if (duration) {
        animation.currentTime = +duration * progress;
        onProgress(animation.currentTime!, +duration, progress);
      }
    }
  });
}

export function clamp(v: number, min: number, max: number) {
  if (v > max) return max;
  else if (v < min) return min;
  return v;
}

//reflect playback position on editor
export function useReflectProgressOnEditor(
  playbackParam: Readonly<Ref<Readonly<boolean>>>,
  progressP: Ref<number>,
  editorP: Ref<HTMLTextAreaElement | null>
) {
  watch(
    [playbackParam, progressP, editorP],
    (nv) => {
      const [playing, progress, editor] = nv;
      if (!playing) {
        if (editor) {
          editor.scrollTo(
            0,
            clamp(
              editor.scrollHeight * progress - editor.clientHeight / 2,
              0,
              editor.scrollHeight
            )
          );
        }
      }
    },
    { flush: "post" }
  );
}

export function useUpdateProgressFromEditorScroll(
  progressP: Ref<number>,
  editorP: Ref<HTMLTextAreaElement | null>
) {
  function scrollHandler(e: Event) {
    const element = e.target as HTMLTextAreaElement;
    let pgs =
      (element.scrollTop + element.clientHeight / 2) / element.scrollHeight;
    progressP.value = clamp(pgs, 0, 1);
  }
  watch(
    editorP,
    (nv, ov, cleanup) => {
      if (nv) {
        nv.addEventListener("scroll", scrollHandler);
      }
      cleanup(() => {
        if (nv) {
          nv.removeEventListener("scroll", scrollHandler);
        }
      });
    },
    { flush: "post" }
  );
}
