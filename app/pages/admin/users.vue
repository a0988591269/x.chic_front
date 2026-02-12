<template>
  <div class="p-6 bg-gray-50 min-h-screen font-sans">
    <div
      class="flex flex-col md:flex-row justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100 gap-4">
      <div class="flex gap-3 w-full md:w-auto flex-wrap items-center">
        <UInput v-model="searchEmail" icon="i-heroicons-magnifying-glass" placeholder="搜尋Email..." class="w-64" />

        <USelect v-model="searchStatus" :items="statusOptions" option-attribute="label" value-attribute="value"
          class="w-40" placeholder="選擇狀態" />
      </div>

      <div>
        <UButton icon="i-heroicons-plus" size="md" color="primary" variant="solid" label="新增會員"
          class="font-bold cursor-pointer" />
      </div>
    </div>

    <UCard :ui="{ body: 'p-0 sm:p-0', shadow: 'shadow-md' }">
      <UTable ref="table" :column-filters="columnFilters" :data="data" :columns="columns" class="w-full">
        <template #permissions-cell="{ row }">
          <div class="flex gap-1 flex-wrap">
            <UBadge v-for="perm in row.original.permissions" :key="perm" color="neutral" variant="subtle" size="sm">
              {{ perm }}
            </UBadge>
          </div>
        </template>
      </UTable>

      <div v-if="data.length === 0" class="p-8 text-center text-gray-500 flex flex-col items-center">
        <UIcon name="i-heroicons-circle-stack" class="w-8 h-8 mb-2" />
        <p>查無資料</p>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, h } from "vue";
import type { TableColumn } from "@nuxt/ui";

definePageMeta({
  layout: "backend",
  middleware: "admin",
});

// --- Type 定義 ---
interface Member {
  id: number;
  name: string;
  email: string;
  status: string;
  permissions: string[];
}

const table = useTemplateRef('table')
const UBadge = resolveComponent('UBadge')

// --- 狀態管理 (State Management) ---
const searchEmail = ref('');
const searchStatus = ref('');

const columns: TableColumn<Member>[] = [
  {
    accessorKey: "id", // 對應資料屬性
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "姓名",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "status",
    header: "狀態",
    cell: ({ row }) => {
      const status = row.original.status;
      const color = status === "1" ? "green" : "red";
      const label = status === "1" ? "啟用中" : "停權";
      return h(UBadge, { color, variant: "subtle" }, () => label);
    }
  },
  {
    accessorKey: "permissions",
    header: "權限組",
  },
  {
    id: "actions",
    header: "操作",
  },
];

const statusOptions = [
  { label: '全部狀態', value: '' },
  { label: '啟用中', value: '1' },
  { label: '停權', value: '0' }
];

// 模擬資料
const data = ref<Member[]>([
  {
    id: 101,
    name: "Benson 阿龎",
    email: "benson@dev.com",
    status: "1",
    permissions: ["admin", "editor"],
  },
  {
    id: 102,
    name: "新進員工",
    email: "newbie@dev.com",
    status: "0",
    permissions: ["viewer"],
  },
]);

const columnFilters = computed(() => {
  const filters = [];

  if (searchEmail.value.trim()) {
    filters.push({
      id: "email",
      value: searchEmail.value,
    });
  }

  if (searchStatus.value) {
    filters.push({
      id: "status",
      value: searchStatus.value
    });
  }

  return filters;
});

</script>
