<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { icons } from "feather-icons";
import { useIntl } from "vue-intl";
import ToggleSwitch from "./ToggleSwitch.vue";

export type savedInput = {
  name: string;
  includeText: boolean;
};

const intl = useIntl();
const emits = defineEmits<{
  (e: "opening"): void;
  (e: "opened"): void;
  (e: "closing"): void;
  (e: "closed", result: null | savedInput): void;
  (e: "removed"): void;
}>();

const props = withDefaults(
  defineProps<{
    showing: boolean;
  }>(),
  {
    showing: false,
  }
);

const dialogAttrObserver = new MutationObserver((mutations, observer) => {
  mutations.forEach(async (mutation) => {
    if (mutation.attributeName === "open") {
      const dialog = mutation.target as HTMLDialogElement;

      const isOpen = dialog.hasAttribute("open");
      if (!isOpen) return;

      dialog.removeAttribute("inert");

      // set focus
      const focusTarget = dialog.querySelector("[autofocus]") as HTMLElement;
      focusTarget && focusTarget.focus();

      emits("opening");
      await animationsComplete(dialog);
      emits("opened");
    }
  });
});
// track deletion
const dialogDeleteObserver = new MutationObserver((mutations, observer) => {
  mutations.forEach((mutation) => {
    mutation.removedNodes.forEach((removedNode) => {
      if (removedNode.nodeName === "DIALOG") {
        removedNode.removeEventListener("click", lightDismiss);
        removedNode.removeEventListener("close", dialogClose);
        emits("removed");
      }
    });
  });
});
async function animationsComplete<eType extends HTMLElement>(element: eType) {
  Promise.allSettled(
    element.getAnimations().map((animation) => animation.finished)
  );
} // click outside the dialog handler
const lightDismiss = (e: Event) => {
  const element = e.target as HTMLDialogElement;
  if (element.nodeName === "DIALOG") {
    element.close("dismiss");
  }
};

const dialogRef = ref<HTMLDialogElement | null>(null);
onMounted(async () => {
  const dialog = dialogRef.value;
  if (dialog) {
    dialog.addEventListener("click", lightDismiss);
    dialog.addEventListener("close", dialogClose);

    dialogAttrObserver.observe(dialog, {
      attributes: true,
    });

    dialogDeleteObserver.observe(document.body, {
      attributes: false,
      subtree: false,
      childList: true,
    });

    // prevent page load @keyframes playing
    await animationsComplete(dialog);
    // remove loading attribute
    dialog.removeAttribute("loading");
  }
});
function showModal() {
  const element = dialogRef.value;
  if (element) {
    element.showModal();
  }
}
defineExpose({
  showModal,
});

watch(
  () => props.showing,
  (v, ov) => {
    const element = dialogRef.value;
    if (v && !ov && element) {
      element.showModal();
    }
  }
);

const setting = ref<savedInput>({
  name: "",
  includeText: false,
});
function nameInputHandler(e: Event) {
  e.preventDefault();
  const element = e.target as HTMLInputElement;
  if (element) {
    setting.value.name = element.value;
  }
}

const dialogClose = async (e: Event) => {
  const element = e.target as HTMLDialogElement;
  element.setAttribute("inert", "");
  emits("closing");
  await animationsComplete(element);
  emits("closed", element.returnValue === "confirm" ? setting.value : null);
};

const nameInput = ref("");
</script>
<template>
  <dialog ref="dialogRef" id="megaDialog" inert loading modal-mode="mega">
    <form method="dialog" class="form">
      <header class="header">
        <i v-html="icons['save'].toSvg()"></i>
        <h3>
          {{
            intl.formatMessage({
              id: "saveModalHeader",
              defaultMessage: "保存设置",
            })
          }}
        </h3>
        <!-- <button
          onclick="this.closest('dialog').close('close')"
          type="button"
          :title="
            intl.formatMessage({
              id: 'closeModal',
              defaultMessage: '关闭对话框',
            })
          "
        >
          <title>
            {{
              intl.formatMessage({
                id: "closeModal",
                defaultMessage: "关闭对话框",
              })
            }}
          </title>
          <i v-html="icons['x'].toSvg()"> </i>
        </button> -->
      </header>
      <article class="article">
        <section class="labelled-input">
          <label for="configName">{{
            intl.formatMessage({
              id: "saveModalNameInputLabel",
              defaultMessage: "配置名称",
            })
          }}</label>
          <input
            id="configName"
            name="configName"
            type="text"
            required
            @change="nameInputHandler"
            :value="setting.name"
          />
        </section>
        <section class="labelled-input">
          <label for="includeText">{{
            intl.formatMessage({
              id: "saveModalIncludeTextLabel",
              defaultMessage: "包含文字",
            })
          }}</label>
          <ToggleSwitch
            @change="() => (setting.includeText = !setting.includeText)"
            :checked="setting.includeText"
          ></ToggleSwitch>
        </section>
      </article>
      <footer class="footer">
        <menu class="menu">
          <button type="reset" value="clear">
            {{
              intl.formatMessage({
                id: "saveModalResetButton",
                defaultMessage: "重置",
              })
            }}
          </button>
        </menu>
        <menu>
          <!-- focusTarget -->
          <button
            autofocus
            type="button"
            onclick="this.closest('dialog').close('cancel')"
          >
            {{
              intl.formatMessage({
                id: "saveModalCancel",
                defaultMessage: "取消",
              })
            }}
          </button>
          <button type="submit" value="confirm">
            {{
              intl.formatMessage({
                id: "saveModalConfirm",
                defaultMessage: "保存",
              })
            }}
          </button>
        </menu>
      </footer>
    </form>
  </dialog>
</template>
<style scoped>
html:has(#megaDialog[open][modal-mode="mega"]) {
  overflow: hidden;
}

#megaDialog {
  display: grid;
  background: hsl(0, 0%, 16%);
  color: hsl(0, 0%, 94%);
  max-inline-size: min(90vw, 20rem);
  max-block-size: min(80vh, 100%);
  max-block-size: min(80dvb, 100%);
  margin: auto;
  padding: 0;
  position: fixed;
  inset: 0;
  border-radius: 0.3rem;
  --shadow-color: 0deg 0% 0%;
  box-shadow: 0.3px 0.5px 0.7px hsl(var(--shadow-color) / 0.11),
    0.8px 1.6px 2px -0.8px hsl(var(--shadow-color) / 0.11),
    2.1px 4.1px 5.2px -1.7px hsl(var(--shadow-color) / 0.11),
    5px 10px 12.6px -2.5px hsl(var(--shadow-color) / 0.11);
  z-index: 99;
  overflow: hidden;
  transition: opacity 0.5s ease-out;
}

#megaDialog:not([open]) {
  pointer-events: none;
  opacity: 0;
}

#megaDialog::backdrop {
  backdrop-filter: blur(10px);
  transition: backdrop-filter 0.5s ease;
}

#megaDialog[loading] {
  visibility: hidden;
}

@media (--motionOK) {
}

.form {
  display: grid;
  grid-template-rows: auto 1fr auto;
  align-items: start;
  max-block-size: 80vh;
  max-block-size: 80dvb;
}

.article {
  overflow-y: auto;
  max-block-size: 100%; /* safari */
  overscroll-behavior-y: contain;
  display: grid;
  justify-items: flex-start;
  gap: 0.6rem;
  padding-inline: 1rem;
  padding-block: 2rem;
  background: hsl(0, 0%, 34%);
}
.labelled-input {
  inline-size: 100%;
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
}
.labelled-input input {
  text-align: end;
  font-size: 1rem;
}
.header {
  display: flex;
  gap: var(--size-3);
  /* justify-content: space-between; */
  align-items: center;
  padding-block: 0.3rem;
  padding-inline: 1rem;
}
.header > button {
  border-radius: var(--radius-round);
  padding: 0.75ch;
  aspect-ratio: 1;
  flex-shrink: 0;
  place-items: center;
  stroke: currentColor;
  stroke-width: 3px;
}

.footer {
  display: flex;
  flex-wrap: wrap;
  gap: var(--size-3);
  justify-content: space-between;
  align-items: flex-start;
  padding-block: 0.3rem;
  padding-inline: 1rem;
}
menu {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  padding-inline-start: 0;
}
menu:only-child {
  margin-inline-start: auto;
}

@media (max-width: 410px) {
  .menu button[type="reset"] {
    display: none;
  }
}

.header .footer {
  background-color: var(--surface-2);

  @media (--OSdark) {
    background-color: var(--surface-1);
  }
}
</style>
