<template>
  <div class="p-6 bg-gray-50 min-h-screen font-sans">
    <div
      class="flex flex-col md:flex-row justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100 gap-4"
    >
      <div class="flex gap-3 w-full md:w-auto flex-wrap items-center">
        <UInput
          v-model="filter.keyword"
          icon="i-heroicons-magnifying-glass"
          placeholder="搜尋姓名或 Email..."
          class="w-64"
        />

        <USelect
          v-model="filter.status"
          :items="statusOptions"
          class="w-40"
          placeholder="選擇狀態"
        />

        <UButton
          color="neutral"
          variant="solid"
          label="篩選"
          @click="handleSearch"
        />
      </div>

      <div>
        <UButton
          icon="i-heroicons-plus"
          size="md"
          color="primary"
          variant="solid"
          label="新增會員"
          @click="openModal('create')"
          class="font-bold cursor-pointer"
        />
      </div>
    </div>

    <UCard :ui="{ body: 'p-0 sm:p-0', shadow: 'shadow-md' }">
      <UTable :data="memberList" :columns="columns" class="w-full">
        <template #permissions-cell="{ row }">
          <div class="flex gap-1 flex-wrap">
            <UBadge
              v-for="perm in row.original.permissions"
              :key="perm"
              color="neutral"
              variant="subtle"
              size="sm"
            >
              {{ perm }}
            </UBadge>
          </div>
        </template>

        <template #actions-cell="{ row }">
          <div class="flex items-center gap-2">
            <UButton
              icon="i-heroicons-eye"
              size="xs"
              color="neutral"
              variant="ghost"
              @click="openModal('view', row.original)"
            />
            <UButton
              icon="i-heroicons-shield-check"
              size="xs"
              color="warning"
              variant="ghost"
              @click="openModal('edit_perm', row.original)"
            />
            <UButton
              icon="i-heroicons-trash"
              size="xs"
              color="error"
              variant="ghost"
              @click="confirmDelete(row.original)"
            />
          </div>
        </template>
      </UTable>

      <div
        v-if="memberList.length === 0"
        class="p-8 text-center text-gray-500 flex flex-col items-center"
      >
        <UIcon name="i-heroicons-circle-stack" class="w-8 h-8 mb-2" />
        <p>查無資料</p>
      </div>
    </UCard>

    <AdminUsersDialog
      v-model:open="isModalOpen"
      :mode="modalMode"
      :initial-data="selectedMember"
      @submit="handleSave"
    />

    <UModal
      v-model:open="isDeleteModalOpen"
      title="⚠️ 刪除警告"
      description="確定要刪除此會員嗎？動作無法復原。"
    >
      <template #footer>
        <div class="flex justify-end gap-3 w-full">
          <UButton
            color="neutral"
            variant="ghost"
            label="取消"
            @click="isDeleteModalOpen = false"
          />
          <UButton color="error" label="確定刪除" @click="executeDelete" />
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref, h } from "vue";
import { useToast } from "#imports";

definePageMeta({
  layout: "backend",
  middleware: "admin",
});

// --- Type 定義 ---
interface Member {
  id: number;
  name: string;
  email: string;
  permissions: string[];
}

// --- Nuxt UI v3 / TanStack Table Column 定義 ---
// 這裡修正了你遇到的 "Columns require an id" 錯誤
const columns = [
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
    accessorKey: "permissions",
    header: "權限組",
  },
  {
    id: "actions", // 🔥 關鍵：虛擬欄位必須給 id
    header: "操作",
  },
];

const statusOptions = ["全部狀態", "啟用中", "停權"];

// --- 狀態管理 ---
// 注意：Nuxt UI v3 的 Modal 建議使用 v-model:open
const isModalOpen = ref(false);
const modalMode = ref<"create" | "view" | "edit_perm">("create");
const filter = ref({ keyword: "", status: "" });
const selectedMember = ref<Member | undefined>(undefined);
const toast = useToast();

const isDeleteModalOpen = ref(false);
const memberToDelete = ref<Member | null>(null);

// 模擬資料
const memberList = ref<Member[]>([
  {
    id: 101,
    name: "Benson 阿龎",
    email: "benson@dev.com",
    permissions: ["admin", "editor"],
  },
  {
    id: 102,
    name: "新進員工",
    email: "newbie@dev.com",
    permissions: ["viewer"],
  },
]);

// --- 邏輯 Actions ---

const handleSearch = () => {
  toast.add({
    title: "搜尋中",
    description: `關鍵字：${filter.value.keyword}`,
    icon: "i-heroicons-magnifying-glass",
  });
};

const openModal = (mode: "create" | "view" | "edit_perm", member?: Member) => {
  modalMode.value = mode;
  selectedMember.value = member;
  isModalOpen.value = true;
};

const handleSave = (data: Member) => {
  if (modalMode.value === "create") {
    const newId = Math.floor(Math.random() * 1000);
    memberList.value.push({ ...data, id: newId });
    toast.add({
      title: "成功",
      description: "新增會員成功！🎉",
      color: "success",
    });
  } else {
    const index = memberList.value.findIndex((m) => m.id === data.id);
    if (index !== -1) {
      memberList.value[index] = { ...memberList.value[index], ...data };
      toast.add({
        title: "更新",
        description: "權限已更新！✅",
        color: "success",
      });
    }
  }
};

const confirmDelete = (member: Member) => {
  memberToDelete.value = member;
  isDeleteModalOpen.value = true;
};

const executeDelete = () => {
  if (memberToDelete.value) {
    memberList.value = memberList.value.filter(
      (m) => m.id !== memberToDelete.value!.id
    );
    toast.add({
      title: "已刪除",
      description: `會員 ${memberToDelete.value.name} 已移除`,
      color: "error",
    });
    isDeleteModalOpen.value = false;
  }
};
</script>
