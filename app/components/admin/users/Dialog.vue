<template>
  <UModal
    v-model:open="isOpen"
    :title="titleMap[mode]"
    :description="descriptionMap[mode]"
  >
    <template #body>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-700"
              >姓名 <span class="text-red-500">*</span></label
            >
            <UInput
              v-model="formData.name"
              placeholder="請輸入姓名"
              :disabled="mode === 'view' || mode === 'edit_perm'"
              class="w-full"
            />
          </div>

          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-700"
              >Email
              <span class="text-red-500" v-if="mode === 'create'"
                >*</span
              ></label
            >
            <UInput
              v-model="formData.email"
              placeholder="請輸入 Email"
              icon="i-heroicons-envelope"
              :disabled="mode !== 'create'"
              class="w-full"
            />
          </div>
        </div>

        <div
          v-if="mode === 'edit_perm' || mode === 'view'"
          class="bg-orange-50/50 border border-orange-200 rounded-lg p-4 space-y-3"
        >
          <div
            class="text-sm font-bold text-orange-800 flex items-center gap-2"
          >
            <UIcon name="i-heroicons-shield-check" />
            權限設定
          </div>

          <div class="flex gap-4 flex-wrap">
            <UCheckbox
              v-model="formData.permissions"
              value="admin"
              label="管理員"
              :disabled="mode === 'view'"
            />
            <UCheckbox
              v-model="formData.permissions"
              value="editor"
              label="編輯者"
              :disabled="mode === 'view'"
            />
            <UCheckbox
              v-model="formData.permissions"
              value="viewer"
              label="檢視者"
              :disabled="mode === 'view'"
            />
          </div>
        </div>
      </form>
    </template>

    <template #footer>
      <div class="flex justify-end gap-3 w-full">
        <UButton color="neutral" variant="ghost" @click="isOpen = false">
          {{ mode === "view" ? "關閉" : "取消" }}
        </UButton>

        <UButton v-if="mode === 'create'" color="primary" @click="handleSubmit">
          確認新增
        </UButton>

        <UButton
          v-if="mode === 'edit_perm'"
          color="warning"
          @click="handleSubmit"
        >
          更新權限
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";

interface MemberData {
  id?: number;
  name: string;
  email: string;
  permissions: string[]; // 這裡儲存 checkbox 的選取值
}

const props = defineProps<{
  open: boolean; // 接收 v-model:open
  mode: "create" | "view" | "edit_perm";
  initialData?: MemberData;
}>();

const emit = defineEmits(["update:open", "submit"]);

// --- 雙向綁定 (v-model:open) ---
const isOpen = computed({
  get: () => props.open,
  set: (val) => emit("update:open", val),
});

const formData = ref<MemberData>({
  name: "",
  email: "",
  permissions: [],
});

const titleMap = {
  create: "✨ 新增會員",
  view: "📄 會員詳細資料",
  edit_perm: "🛡️ 編輯權限管理",
};

const descriptionMap = {
  create: "請填寫以下資訊以建立新帳號。",
  view: "檢視目前的會員資訊。",
  edit_perm: "請勾選此會員擁有的系統權限。",
};

// --- 監聽資料變化 ---
watch(
  () => props.initialData,
  (newVal) => {
    if (newVal && props.mode !== "create") {
      // 確保 permissions 是陣列，避免 checkbox 報錯
      formData.value = {
        ...JSON.parse(JSON.stringify(newVal)),
        permissions: newVal.permissions || [],
      };
    } else {
      formData.value = { name: "", email: "", permissions: [] };
    }
  },
  { immediate: true, deep: true }
);

const handleSubmit = () => {
  if (!formData.value.name) return; // 簡單驗證
  emit("submit", { ...formData.value });
  isOpen.value = false;
};
</script>
