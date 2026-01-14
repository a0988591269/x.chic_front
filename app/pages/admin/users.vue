<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    
    <div class="flex flex-col md:flex-row justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      
      <div class="flex gap-3 w-full md:w-auto mb-4 md:mb-0">
        <div class="relative">
          <input 
            v-model="filter.keyword" 
            placeholder="搜尋姓名或 Email..." 
            class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-64 transition"
          />
          <span class="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>
        
        <select v-model="filter.status" class="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer">
          <option value="all">全部狀態</option>
          <option value="active">啟用中</option>
          <option value="suspended">停權</option>
        </select>

        <button @click="handleSearch" class="bg-gray-800 text-white px-5 py-2 rounded-lg hover:bg-gray-700 transition shadow-sm">
          篩選
        </button>
      </div>
      
      <div>
        <button 
          @click="openModal('create')" 
          class="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition flex items-center gap-2 font-medium"
        >
          <span class="text-xl leading-none">+</span> 新增會員
        </button>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      <table class="w-full text-left border-collapse">
        <thead class="bg-gray-50 text-gray-600 uppercase text-xs font-semibold tracking-wider border-b border-gray-200">
          <tr>
            <th class="p-4">ID</th>
            <th class="p-4">姓名</th>
            <th class="p-4">Email</th>
            <th class="p-4">權限組</th>
            <th class="p-4 text-center">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="member in memberList" :key="member.id" class="hover:bg-blue-50 transition duration-150">
            <td class="p-4 text-gray-500">#{{ member.id }}</td>
            <td class="p-4 font-bold text-gray-800">{{ member.name }}</td>
            <td class="p-4 text-gray-600">{{ member.email }}</td>
            <td class="p-4">
              <div class="flex gap-1 flex-wrap">
                <span 
                  v-for="perm in member.permissions" 
                  :key="perm"
                  class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded border border-gray-200"
                >
                  {{ perm }}
                </span>
              </div>
            </td>
            <td class="p-4">
              <div class="flex justify-center gap-3">
                <button @click="openModal('view', member)" class="text-gray-400 hover:text-blue-600 transition" title="檢視詳細">
                  <span class="material-icons-outlined">👁️</span>
                </button>
                
                <button @click="openModal('edit_perm', member)" class="text-gray-400 hover:text-orange-500 transition" title="編輯權限">
                  <span class="material-icons-outlined">🛡️</span>
                </button>
                
                <button @click="deleteMember(member)" class="text-gray-400 hover:text-red-500 transition" title="刪除會員">
                  <span class="material-icons-outlined">🗑️</span>
                </button>
              </div>
            </td>
          </tr>
          
          <tr v-if="memberList.length === 0">
            <td colspan="5" class="p-8 text-center text-gray-400">
              查無資料
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <AdminUsersCreateModal
      v-model="isModalOpen"
      :mode="modalMode"
      :initial-data="selectedMember"
      @submit="handleSave"
    />

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';

definePageMeta({
  layout: "backend", // 強制使用 backend.vue
  middleware: "admin",
});

// --- Type 定義 ---
interface Member {
  id: number;
  name: string;
  email: string;
  permissions: string[];
}

// --- 狀態管理 ---
const isModalOpen = ref(false);
const modalMode = ref<'create' | 'view' | 'edit_perm'>('create');
const filter = ref({ keyword: '', status: 'all' });
const selectedMember = ref<Member | undefined>(undefined);

// 模擬資料
const memberList = ref<Member[]>([
  { id: 101, name: 'Benson 阿龎', email: 'benson@dev.com', permissions: ['admin', 'editor'] },
  { id: 102, name: '新進員工', email: 'newbie@dev.com', permissions: ['viewer'] },
]);

// --- 邏輯 Actions ---

const handleSearch = () => {
  // 僅使用 ElMessage 做提示，UI 保持 Tailwind
  ElMessage.info(`正在搜尋：${filter.value.keyword || '全部'}`);
};

const openModal = (mode: 'create' | 'view' | 'edit_perm', member?: Member) => {
  modalMode.value = mode;
  selectedMember.value = member;
  isModalOpen.value = true;
};

// 處理子元件的 Submit 事件
const handleSave = (data: Member) => {
  if (modalMode.value === 'create') {
    // 新增邏輯
    const newId = Math.floor(Math.random() * 1000);
    memberList.value.push({ ...data, id: newId });
    ElMessage.success('新增會員成功！🎉');
  } else {
    // 編輯邏輯
    const index = memberList.value.findIndex(m => m.id === data.id);
    if (index !== -1) {
      memberList.value[index] = { ...memberList.value[index], ...data };
      ElMessage.success('權限已更新！✅');
    }
  }
};

// 刪除邏輯：使用 ElMessageBox (這是重點需求)
const deleteMember = (member: Member) => {
  ElMessageBox.confirm(
    `確定要刪除會員「${member.name}」嗎？刪除後無法復原。`,
    '⚠️ 刪除警告',
    {
      confirmButtonText: '確定刪除',
      cancelButtonText: '取消',
      type: 'warning',
      draggable: true, // Element Plus 的新功能，讓彈窗可拖曳
    }
  )
    .then(() => {
      memberList.value = memberList.value.filter(m => m.id !== member.id);
      ElMessage.success('會員已刪除 🗑️');
    })
    .catch(() => {
      ElMessage.info('已取消刪除');
    });
};
</script>