<script lang="ts" setup>
import { watch } from "vue";
import { useIntl } from "vue-intl";

const intl = useIntl();

watch(
  () => intl.locale,
  (v) => {
    const titleElement = document.getElementById("webTitle");
    if (titleElement) {
      let message = intl.formatMessage({
        id: "webTitle",
        defaultMessage: "网页提词器",
        description: "Web page title.",
      });
      titleElement.textContent = message;
    }
  },
  {
    immediate: true,
  }
);
</script>
