<template>
  <el-dialog
    v-model="visible"
    :title="titleMap[mode]"
    width="600px"
    destroy-on-close
    :close-on-click-modal="false"
    class="rounded-lg" 
  >
    <div class="p-2">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        
        <div class="grid grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">姓名</label>
            <el-input 
              v-model="formData.name" 
              placeholder="請輸入姓名" 
              :disabled="mode === 'view' || mode === 'edit_perm'"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <el-input 
              v-model="formData.email" 
              placeholder="請輸入 Email" 
              :disabled="mode !== 'create'"
            />
          </div>
        </div>

        <div v-if="mode === 'edit_perm' || mode === 'view'" 
             class="bg-orange-50 border border-orange-200 rounded-md p-4">
          <h4 class="text-sm font-bold text-orange-800 mb-3 flex items-center gap-2">
            🛡️ 權限設定
          </h4>
          
          <el-checkbox-group v-model="formData.permissions" :disabled="mode === 'view'">
            <div class="flex gap-4">
              <el-checkbox label="admin" border>管理員</el-checkbox>
              <el-checkbox label="editor" border>編輯者</el-checkbox>
              <el-checkbox label="viewer" border>檢視者</el-checkbox>
            </div>
          </el-checkbox-group>
        </div>

      </form>
    </div>

    <template #footer>
      <span class="dialog-footer flex justify-end gap-3">
        <el-button @click="visible = false">
          {{ mode === 'view' ? '關閉' : '取消' }}
        </el-button>
        
        <el-button 
          v-if="mode === 'create'" 
          type="primary" 
          @click="handleSubmit"
        >
          確認新增
        </el-button>
        
        <el-button 
          v-if="mode === 'edit_perm'" 
          type="warning" 
          @click="handleSubmit"
        >
          更新權限
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

// 定義資料介面
interface MemberData {
  id?: number;
  name: string;
  email: string;
  permissions: string[];
}

const props = defineProps<{
  modelValue: boolean;
  mode: 'create' | 'view' | 'edit_perm';
  initialData?: MemberData;
}>();

const emit = defineEmits(['update:modelValue', 'submit']);

// --- 狀態 ---
const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

const formData = ref<MemberData>({
  name: '',
  email: '',
  permissions: [],
});

const titleMap = {
  create: '✨ 新增會員',
  view: '📄 會員詳細資料',
  edit_perm: '🛡️ 編輯權限管理',
};

// --- 監聽資料變化 (初始化表單) ---
watch(
  () => props.initialData,
  (newVal) => {
    if (newVal && props.mode !== 'create') {
      formData.value = JSON.parse(JSON.stringify(newVal)); // Deep Copy
    } else {
      formData.value = { name: '', email: '', permissions: [] }; // Reset
    }
  },
  { immediate: true, deep: true }
);

const handleSubmit = () => {
  // 這裡可以加入簡單驗證
  if (!formData.value.name) return;
  emit('submit', { ...formData.value });
  visible.value = false;
};
</script>