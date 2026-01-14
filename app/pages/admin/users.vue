<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    
    <div class="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
      <div class="flex gap-4">
        <input v-model="filter.keyword" placeholder="🔍 搜尋姓名或 Email..." class="border p-2 rounded w-64" />
        <select v-model="filter.status" class="border p-2 rounded">
          <option value="all">全部狀態</option>
          <option value="active">啟用中</option>
          <option value="suspended">停權</option>
        </select>
        <button @click="searchMembers" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          篩選
        </button>
      </div>
      
      <div>
        <button @click="openModal('create')" class="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 flex items-center gap-2">
          ➕ 新增會員
        </button>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="w-full text-left border-collapse">
        <thead class="bg-gray-100 border-b">
          <tr>
            <th class="p-4">ID</th>
            <th class="p-4">姓名</th>
            <th class="p-4">Email</th>
            <th class="p-4">角色權限</th>
            <th class="p-4">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="member in memberList" :key="member.id" class="border-b hover:bg-gray-50">
            <td class="p-4">{{ member.id }}</td>
            <td class="p-4 font-medium">{{ member.name }}</td>
            <td class="p-4 text-gray-600">{{ member.email }}</td>
            <td class="p-4">
              <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {{ member.role }}
              </span>
            </td>
            <td class="p-4 flex gap-2">
              <button @click="openModal('view', member)" class="text-gray-500 hover:text-blue-600" title="檢視">
                👁️
              </button>
              <button @click="openModal('edit_perm', member)" class="text-gray-500 hover:text-orange-600" title="編輯權限">
                🛡️
              </button>
              <button @click="deleteMember(member.id)" class="text-gray-500 hover:text-red-600" title="刪除">
                🗑️
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div class="bg-white rounded-lg shadow-xl w-1/2 p-6 animate-fade-in-up">
        
        <div class="flex justify-between items-center mb-4 border-b pb-2">
          <h3 class="text-xl font-bold text-gray-800">{{ modalTitle }}</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <div class="space-y-4">
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-bold mb-1">姓名</label>
              <input v-model="currentMember.name" :disabled="modalMode === 'view' || modalMode === 'edit_perm'" class="w-full border p-2 rounded bg-gray-50" />
            </div>
            <div>
              <label class="block text-sm font-bold mb-1">Email</label>
              <input v-model="currentMember.email" :disabled="modalMode !== 'create'" class="w-full border p-2 rounded bg-gray-50" />
            </div>
          </div>

          <div v-if="modalMode === 'edit_perm' || modalMode === 'view'" class="mt-4 p-4 bg-yellow-50 rounded border border-yellow-200">
            <h4 class="font-bold text-yellow-800 mb-2">權限設定</h4>
            <div class="flex gap-4">
              <label class="flex items-center gap-2">
                <input type="checkbox" v-model="currentMember.permissions" value="admin" :disabled="modalMode === 'view'" /> 管理員
              </label>
              <label class="flex items-center gap-2">
                <input type="checkbox" v-model="currentMember.permissions" value="editor" :disabled="modalMode === 'view'" /> 編輯者
              </label>
              <label class="flex items-center gap-2">
                <input type="checkbox" v-model="currentMember.permissions" value="viewer" :disabled="modalMode === 'view'" /> 檢視者
              </label>
            </div>
          </div>
        </div>

        <div class="mt-6 flex justify-end gap-3 border-t pt-4">
          <button @click="closeModal" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">取消</button>
          
          <button v-if="modalMode === 'create'" @click="submitCreate" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            確認新增
          </button>
          
          <button v-if="modalMode === 'edit_perm'" @click="submitUpdatePerms" class="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">
            更新權限
          </button>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

definePageMeta({
  layout: "backend", // 強制使用 backend.vue
  middleware: "admin",
});

// --- 狀態定義 ---
const isModalOpen = false;
const modalMode = ref('create'); // 'create', 'view', 'edit_perm'
const filter = ref({ keyword: '', status: 'all' });

// 模擬資料
const memberList = ref([
  { id: 1, name: '張三', email: 'zhang@example.com', role: 'Admin', permissions: ['admin', 'editor'] },
  { id: 2, name: '李四', email: 'li@example.com', role: 'User', permissions: ['viewer'] },
]);

// 當前操作的會員物件 (用於 Modal 綁定)
const currentMember = ref({ name: '', email: '', permissions: [] });

// --- 核心邏輯 ---

// 1. 動態標題
const modalTitle = computed(() => {
  switch (modalMode.value) {
    case 'create': return '✨ 新增會員';
    case 'view': return '📄 會員詳細資料';
    case 'edit_perm': return '🛡️ 編輯會員權限';
    default: return '';
  }
});

// 2. 開啟 Modal
const openModal = (mode, member = null) => {
  modalMode.value = mode;
  if (mode === 'create') {
    // 清空資料
    currentMember.value = { name: '', email: '', permissions: [] };
  } else {
    // 帶入資料 (Deep Copy 避免直接修改列表)
    currentMember.value = JSON.parse(JSON.stringify(member));
  }
  isModalOpen.value = true;
};

// 3. 關閉 Modal
const closeModal = () => {
  isModalOpen.value = false;
};

// 4. 模擬送出
const submitCreate = () => {
  alert(`新增會員：${currentMember.value.name}`);
  closeModal();
};

const submitUpdatePerms = () => {
  alert(`更新權限為：${currentMember.value.permissions.join(', ')}`);
  closeModal();
};

const deleteMember = (id) => {
  if(confirm('確定要刪除這位會員嗎？此動作無法復原。')) {
    memberList.value = memberList.value.filter(m => m.id !== id);
  }
};
</script>