<script setup lang="ts">
import { nanoid } from "nanoid";
import { onMounted, onUpdated, Ref, ref } from "vue";
import { useIntl } from "vue-intl";
import { configType } from "./TypographyConfig.vue";

export type storedConfigType = {
  id: string;
  createdDate: string;
  config: configType;
};

const props = defineProps<{
  config: configType;
}>();

const emits = defineEmits<{
  (e: "configLoaded", newConfig: configType): void;
}>();

const DBName = "teleprompterDB";
const DBVersion = 1;
const DBStoreName = "config";

const db = ref<IDBDatabase | null>(null);
const configs = ref<Array<storedConfigType>>([]);
const selectedConfig = ref<storedConfigType | null>(null);

const saveButtonHandler = () => {
  const configToSave: storedConfigType = {
    id: nanoid(),
    createdDate: `${Date.now()}`,
    config: { ...props.config },
  };

  saveConfig(configToSave);
};

const readButtonHandler = () => {
  if (selectedConfig.value) emits("configLoaded", selectedConfig.value.config);
};

const deleteButtonHandler = () => {
  if (selectedConfig.value) {
    deleteConfig(selectedConfig.value);
  }
};

const refreshButtonHandler = () => {
  getConfigs();
};

const liClickHandler = (e: Event) => {
  const element = e.currentTarget as HTMLElement;
  if (element.tagName === "LI" && element.id) {
    if (!selectedConfig.value || selectedConfig.value.id !== element.id) {
      const config = configs.value.find((c) => c.id === element.id);
      if (config) selectedConfig.value = config;
    } else {
      selectedConfig.value = null;
    }
  }
};

function openDb(successCallback?: () => void, upgradeCallback?: () => void) {
  console.log("openDb ...");
  var req = indexedDB.open(DBName, DBVersion);
  req.onsuccess = function (evt) {
    // Equal to: db = req.result;
    db.value = this.result;
    console.debug(`DB:${DBName} opened successfully`);
    successCallback && successCallback();
  };
  req.onerror = function (evt) {
    console.error("error openning IndexDB:" + DBName);
    console.error(req.error);
  };

  req.onupgradeneeded = function (evt) {
    console.log("openDb.onupgradeneeded");
    var store = req.result.createObjectStore(DBStoreName, {
      keyPath: "id",
    });

    store.createIndex("configName", "configName", { unique: false });
    upgradeCallback && upgradeCallback();
  };
}

function openTransactionGetObjectStore(
  db: Ref<IDBDatabase | null>,
  store_name: string,
  mode: IDBTransactionMode
) {
  if (db.value) {
    var tx = db.value.transaction(store_name, mode);
    function transactionErrorHandler() {
      console.error(`Some error happened in tranaction:`);
      console.error(tx.error);
    }
    tx.addEventListener("error", transactionErrorHandler);
    return tx.objectStore(store_name);
  }
}

function getAll(
  store: IDBObjectStore,
  success_callback: (result: any) => void
) {
  const req = store.getAll();
  req.onsuccess = function (evt) {
    const result = req.result;
    if (result) success_callback(result);
  };
  req.onerror = () => {
    console.error(
      `Error happened while calling getAll from store${store.name}`
    );
  };
}

function saveConfig(config: storedConfigType) {
  const objectStore = openTransactionGetObjectStore(
    db,
    DBStoreName,
    "readwrite"
  );
  if (objectStore) {
    const req = objectStore.add(config);
    req.onsuccess = function () {
      console.log(`Config:${config.id} successfully added.`);
      getConfigs();
    };
    req.onerror = function () {
      console.error(`Error while saving config:`);
      console.error(config);
    };
  }
}

function getConfigs() {
  const objectStore = openTransactionGetObjectStore(
    db,
    DBStoreName,
    "readonly"
  );
  if (objectStore) {
    getAll(objectStore, (result) => {
      if (Array.isArray(result)) {
        configs.value = result as storedConfigType[];
      }
    });
  }
}

function deleteConfig(config: storedConfigType) {
  const objectStore = openTransactionGetObjectStore(
    db,
    DBStoreName,
    "readwrite"
  );
  if (objectStore) {
    const req = objectStore.delete(config.id);
    req.onsuccess = () => {
      console.log(`Stored config:${config.id} deleted .`);
      getConfigs();
    };
    req.onerror = () => {
      console.error(`Some error happened while deleting config:${config.id}`);
    };
  }
}

onMounted(() => {
  openDb(() => {
    getConfigs();
  });
});

const intl = useIntl();
</script>
<template>
  <div>
    <ul class="configList" v-if="configs">
      <li
        v-for="config in configs"
        :id="config.id"
        @click="liClickHandler"
        :class="{
          configListItem: true,
          selectedConfig: selectedConfig && selectedConfig.id === config.id,
        }"
      >
        <span>{{ config.id }}</span> <span>{{ config.createdDate }}</span>
      </li>
    </ul>

    <div>
      <button @click="saveButtonHandler">
        {{
          intl.formatMessage({
            id: "savePreferenceLabel",
            defaultMessage: "保存设置",
          })
        }}
      </button>
      <button @click="readButtonHandler">
        {{
          intl.formatMessage({
            id: "readPreferenceLabel",
            defaultMessage: "读取设置",
          })
        }}
      </button>
      <button @click="deleteButtonHandler">
        {{
          intl.formatMessage({
            id: "deletePreferenceLabel",
            defaultMessage: "删除设置",
          })
        }}
      </button>
    </div>
  </div>
</template>
<style scoped>
.configList {
  list-style-type: none;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.configListItem {
  display: flex;
  justify-content: space-between;
  user-select: none;

  cursor: pointer;
}
.selectedConfig {
  background-color: black;
}
</style>
