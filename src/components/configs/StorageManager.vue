<script setup lang="ts">
import { nanoid } from "nanoid";
import { onMounted, onUpdated, Ref, ref } from "vue";
import { useIntl } from "vue-intl";
import { deepCloneObjectProperty } from "../../util/deepCloneObjectProperty";
import { configType } from "./TypographyConfig.vue";

export type storedConfigType = {
  id: string;
  createdDate: string;
  config: any;
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
    config: deepCloneObjectProperty(props.config),
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

function generateHandler(id: string) {
  return () => {
    console.log(`clicked`);
    if (!selectedConfig.value || selectedConfig.value.id !== id) {
      const config = configs.value.find((c) => c.id === id);
      if (config) selectedConfig.value = config;
    } else {
      selectedConfig.value = null;
    }
  };
}

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
  <div
    :style="{
      overflowY: 'scroll',
      maxBlockSize: `15em`,
      flex: '1 1',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',

      border: `1px solid black`,
    }"
  >
    <table class="table">
      <thead>
        <tr>
          <th>
            {{
              intl.formatMessage({
                id: "preferenceNameHeader",
                defaultMessage: "名称",
              })
            }}
          </th>
          <th>
            {{
              intl.formatMessage({
                id: "preferenceCreatedDateHeader",
                defaultMessage: "创建日期",
              })
            }}
          </th>
          <th>
            {{
              intl.formatMessage({
                id: "preferenceIncludeTextHeader",
                defaultMessage: "包含文字？",
              })
            }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="config in configs"
          @click="generateHandler(config.id)()"
          :key="config.id"
          :class="{
            selectedConfig: selectedConfig && config.id === selectedConfig.id,
          }"
        >
          <td>
            {{ config.id }}
          </td>
          <td>
            {{
              intl.formatDate(+config.createdDate, {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
              })
            }}
          </td>
          <td>
            {{ "false" }}
          </td>
        </tr>
      </tbody>
    </table>

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
.table {
  table-layout: auto;
  width: 100%;
}
.table tr {
  cursor: pointer;
  user-select: none;
  padding-inline: 1em;

  font-size: 1.1rem;
}
@layer {
  .table tr:nth-child(even) {
    background-color: hsl(270, 12%, 16%);
  }
  .table tr:nth-child(odd) {
    background-color: hsl(75, 4%, 20%);
  }
}
.table td {
  word-break: keep-all;
  padding: 0.2em;
  text-align: center;
}
.table th {
  word-break: keep-all;

  background-color: hsl(0, 0%, 28%);
}
.selectedConfig {
  background-color: black;
}
</style>
