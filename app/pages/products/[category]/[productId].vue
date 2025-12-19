<template>
  <div v-if="product" class="max-w-6xl mx-auto px-4 py-10 font-sans">
    <div class="flex flex-col md:flex-row gap-10">

      <div class="md:w-1/2 flex flex-col items-center">
        <div
          class="w-full aspect-square bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden relative group border border-gray-100">
          <img :src="`http://localhost:5042${currentImages[activeImageIndex]}`" :alt="product.name"
            class="object-contain w-full h-full transition-transform duration-500 group-hover:scale-105" />
        </div>
        <div class="flex gap-3 mt-4 overflow-x-auto w-full px-1 py-1">
          <button v-for="(img, idx) in currentImages" :key="idx" @click="activeImageIndex = idx" :class="[
            'w-20 h-20 flex-shrink-0 rounded-lg border-2 overflow-hidden transition-all',
            activeImageIndex === idx ? 'border-gray-800 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
          ]">
            <img :src="`http://localhost:5042${img}`" class="w-full h-full object-cover" />
          </button>
        </div>
      </div>

      <div class="md:w-1/2 flex flex-col gap-5">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 tracking-tight">{{ product.name }}</h1>
          <p class="text-gray-500 mt-2 text-base">{{ product.summary }}</p>
        </div>

        <div class="flex items-baseline gap-3">
          <template v-if="displayDiscountPrice && displayDiscountPrice < displayPrice">
            <span class="text-3xl font-bold text-red-600">${{ displayDiscountPrice }}</span>
            <span class="text-lg text-gray-400 line-through">${{ displayPrice }}</span>
            <span class="bg-red-50 text-red-600 text-xs font-bold px-2 py-1 rounded">
              -{{ discountPercent }}%
            </span>
          </template>
          <template v-else>
            <span class="text-3xl font-bold text-gray-900">${{ displayPrice }}</span>
          </template>
        </div>

        <div class="flex items-center gap-4 text-sm text-gray-600 border-b border-gray-100 pb-4">
          <span>已售出 {{ product.sales }}</span>
          <span class="w-px h-4 bg-gray-300"></span>
          <span class="flex items-center gap-1 text-yellow-500 font-bold">
            ★ {{ product.rating }}
          </span>
        </div>

        <div class="space-y-4">
          <div v-for="option in product.options" :key="option.id">
            <h3 class="text-sm font-bold text-gray-800 mb-2">{{ option.name }}</h3>
            <div class="flex flex-wrap gap-2">
              <button v-for="val in option.values" :key="val.id" @click="handleSelectOption(option.name, val.id)"
                :disabled="isOptionDisabled(option.name, val.id)" :class="[
                  'px-4 py-2 border rounded-md text-sm transition-all relative',
                  // 1. 選中狀態
                  selectedOptions[option.name] === val.id
                    ? 'border-gray-900 bg-gray-900 text-white shadow-md'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400',
                  // 2. 禁用狀態 (庫存不足)
                  isOptionDisabled(option.name, val.id)
                    ? 'opacity-40 cursor-not-allowed bg-gray-50 decoration-slate-400 line-through'
                    : ''
                ]">
                {{ val.value }}
              </button>
            </div>
          </div>
        </div>

        <div class="p-4 bg-gray-50 rounded-lg mt-2">
          <div class="flex items-center justify-between mb-3">
            <label for="qty" class="text-sm font-bold text-gray-700">購買數量</label>
            <span v-if="currentVariant" class="text-sm text-blue-600 font-medium">
              剩餘庫存: {{ currentVariant.stockQty }}
            </span>
            <span v-else class="text-sm text-gray-400">請選擇規格查看庫存</span>
          </div>

          <div class="flex gap-4">
            <div class="relative w-32">
              <select id="qty" v-model="quantity"
                class="w-full appearance-none border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent">
                <option v-for="n in (currentVariant?.stockQty || 20)" :key="n" :value="n">{{ n }}</option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>

            <button :disabled="!currentVariant || currentVariant.stockQty <= 0" class="flex-1 py-2 rounded-lg font-bold text-lg shadow-sm transition-all
              disabled:bg-gray-300 disabled:cursor-not-allowed
              bg-gray-800 text-white hover:bg-gray-900 hover:shadow-lg">
              {{ currentVariant ? (currentVariant.stockQty > 0 ? '加入購物車' : '目前缺貨') : '請選擇規格' }}
            </button>
          </div>
        </div>

        <div class="text-xs text-gray-500 flex gap-4 mt-2">
          <span>✓ 100% 正品保證</span>
          <span>✓ 快速出貨</span>
          <span>✓ 14 天鑑賞期</span>
        </div>

      </div>
    </div>

    <div class="mt-16">
      <div class="flex border-b border-gray-200">
        <button v-for="tab in tabs" :key="tab.key" @click="activeTab = tab.key" :class="[
          'px-8 py-4 -mb-px font-medium text-base border-b-2 transition-colors',
          activeTab === tab.key
            ? 'border-gray-800 text-gray-900'
            : 'border-transparent text-gray-500 hover:text-gray-700'
        ]">
          {{ tab.label }}
          <span v-if="tab.key === 'reviews'" class="ml-1 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
            {{ product.reviews.length }}
          </span>
        </button>
      </div>

      <div class="py-8 text-gray-700 leading-relaxed min-h-[200px]">
        <div v-show="activeTab === 'features'">
          <ul class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <li v-for="(f, idx) in product.features" :key="idx" class="flex items-center gap-2">
              <span class="w-2 h-2 bg-gray-800 rounded-full"></span> {{ f }}
            </li>
          </ul>
          <div class="mt-6 prose max-w-none" v-html="product.description"></div>
        </div>

        <div v-show="activeTab === 'specs'">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 max-w-2xl">
            <div v-for="(val, key) in product.specs" :key="key"
              class="flex justify-between border-b border-gray-100 pb-2">
              <span class="text-gray-500">{{ key }}</span>
              <span class="font-medium text-gray-900">{{ val }}</span>
            </div>
          </div>
        </div>

        <div v-show="activeTab === 'reviews'" class="space-y-6 max-w-3xl">
          <div v-for="(review, idx) in product.reviews" :key="idx" class="bg-gray-50 p-4 rounded-lg">
            <div class="flex items-center justify-between mb-2">
              <div class="font-bold text-gray-900">{{ review.user }}</div>
              <div class="text-yellow-500 text-sm">★ {{ review.rating }}</div>
            </div>
            <p class="text-gray-600">{{ review.comment }}</p>
            <div class="text-xs text-gray-400 mt-2">{{ review.date }}</div>
          </div>
        </div>

        <div v-show="activeTab === 'policy'">
          <ul class="list-disc pl-5 space-y-2">
            <li v-for="p in product.policy" :key="p">{{ p }}</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="mt-10 border-t pt-10 grid grid-cols-1 md:grid-cols-2 gap-12">
      <div>
        <h2 class="text-xl font-bold mb-6">也許你會喜歡</h2>
        <div class="grid grid-cols-2 gap-6">
          <div v-for="item in hotProducts" :key="item.id" class="group cursor-pointer">
            <div class="overflow-hidden rounded-lg mb-2">
              <img :src="item.image" class="w-full h-40 object-cover transition duration-300 group-hover:scale-105" />
            </div>
            <h3 class="font-medium text-gray-900 group-hover:underline">{{ item.name }}</h3>
            <p class="font-bold text-gray-800">${{ item.discountPrice }}</p>
          </div>
        </div>
      </div>
      <div>
        <h2 class="text-xl font-bold mb-6">本週熱銷排行</h2>
        <div class="space-y-4">
          <div v-for="i in 3" :key="i" class="flex items-center gap-4 group cursor-pointer">
            <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
              {{ i }}
            </div>
            <div class="w-16 h-16 bg-gray-100 rounded overflow-hidden">
              <img src="https://placehold.co/100x100" class="w-full h-full object-cover" />
            </div>
            <div>
              <div class="font-medium text-gray-900 group-hover:text-gray-600">熱銷商品名稱 {{ i }}</div>
              <div class="text-sm text-gray-500">已售出 {{ 1000 - i * 50 }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

// --- 1. 定義介面 (對應 SQL 結構轉換後的 JSON) ---
interface OptionValue {
  id: number; // 對應 ProductOptionValueId
  value: string; // 對應 Value
}

interface ProductOption {
  id: number; // 對應 ProductOptionId
  name: string; // 對應 Name (顏色, 尺寸)
  values: OptionValue[];
}

interface Variant {
  id: number; // 對應 ProductVariantId
  sku: string;
  price: number;
  discountPrice: number | null;
  stockQty: number;
  optionValueIds: number[]; // 關鍵：對應 ProductVariantOptionValues 的聚合結果
  images: string[]; // 對應 ProductVariantImages
}

interface Review {
  user: string;
  rating: number;
  comment: string;
  date: string;
}

interface ProductDetail {
  id: number;
  name: string;
  summary: string; // ShortDescription
  description: string; // LongDescription
  price: number; // 預設價格
  discountPrice: number | null;
  sales: number;
  rating: number;
  options: ProductOption[];
  variants: Variant[];
  reviews: Review[];
  features: string[]; // 模擬資料
  policy: string[]; // 模擬資料
  specs: Record<string, string>; // 模擬資料
}

// --- 2. 模擬資料 (實際應從 API 取得) ---
const product_temp = ref<ProductDetail>({
  id: 1,
  name: "極簡高磅數純棉寬版 T 恤",
  summary: "舒適透氣，四季皆宜的必備單品。",
  description: "<p>採用 100% 美國棉，經過特殊水洗處理...</p>",
  price: 590,
  discountPrice: 490,
  sales: 1205,
  rating: 4.8,
  options: [
    {
      id: 1, name: "顏色", values: [
        { id: 101, value: "白色" },
        { id: 102, value: "黑色" },
        { id: 103, value: "淺灰" }
      ]
    },
    {
      id: 2, name: "尺寸", values: [
        { id: 201, value: "S" },
        { id: 202, value: "M" },
        { id: 203, value: "L" }
      ]
    }
  ],
  variants: [
    // 白色 S (有貨)
    { id: 11, sku: "W-S", price: 590, discountPrice: 490, stockQty: 10, optionValueIds: [101, 201], images: ["https://placehold.co/600x600/white/333?text=White-S","https://placehold.co/600x600/white/333?text=White-SSS"] },
    // 白色 M (缺貨)
    { id: 12, sku: "W-M", price: 590, discountPrice: 490, stockQty: 0, optionValueIds: [101, 202], images: ["https://placehold.co/600x600/white/333?text=White-M"] },
    // 黑色 S (有貨)
    { id: 21, sku: "B-S", price: 590, discountPrice: null, stockQty: 5, optionValueIds: [102, 201], images: ["https://placehold.co/600x600/black/FFF?text=Black-S"] },
    // 黑色 M (有貨)
    { id: 22, sku: "B-M", price: 590, discountPrice: null, stockQty: 20, optionValueIds: [102, 202], images: ["https://placehold.co/600x600/black/FFF?text=Black-M"] },
    // 淺灰 L (有貨)
    { id: 33, sku: "G-L", price: 650, discountPrice: 600, stockQty: 3, optionValueIds: [103, 203], images: ["https://placehold.co/600x600/gray/FFF?text=Gray-L"] }
  ],
  reviews: [
    { user: "Alice", rating: 5, comment: "質感很好！", date: "2023-12-01" },
    { user: "Bob", rating: 4, comment: "稍微偏大。", date: "2023-12-05" }
  ],
  features: ["100% 純棉", "預縮處理", "無縫標籤"],
  policy: ["七天鑑賞期", "退貨無負擔"],
  specs: { "材質": "棉", "產地": "台灣" }
});

// --- 2. 實際應從 API 取得 ---
const route = useRoute();
const { category, productId } = route.params;
console.log('目前類別：', category, '產品ID：', productId);
// 實際型別是 Ref<ProductDetail | null>
const { data: product } = await useFetch<ProductDetail>(`http://localhost:5042/api/Product/GetProductDetail/${productId}`);

// --- 3. 狀態管理 ---
const activeImageIndex = ref(0);
const quantity = ref(1);
const activeTab = ref('features');
const selectedOptions = ref<Record<string, number>>({}); // Key: OptionName, Value: ValueId

// 頁籤設定
const tabs = [
  { key: 'features', label: '商品特色' },
  { key: 'specs', label: '詳細規格' },
  { key: 'reviews', label: '評價' },
  { key: 'policy', label: '運送與退貨' }
];

// --- 4. 核心邏輯：計算目前選中的變體 ---
const currentVariant = computed(() => {
  if (!product.value) return undefined;

  // 取得所有已選的 Value Ids
  const selectedIds = Object.values(selectedOptions.value);

  // 必須所有規格都選了才算選中變體
  if (selectedIds.length < product.value.options.length) return undefined;

  // 尋找完全匹配的 Variant
  return product.value.variants.find(v =>
    selectedIds.every(id => v.optionValueIds.includes(id))
  );
});

// --- 5. 核心邏輯：連動檢查 (Check Availability) ---
// 判斷某個選項是否應該被 Disabled (反白)
const isOptionDisabled = (optionName: string, valueId: number) => {
  if (!product.value) return true;

  // 1. 建立一個「假設選了這個選項」的狀態
  // 我們保留當前已選的其他選項，但覆蓋(或新增)目前正在檢查的這個選項
  const mockSelection = { ...selectedOptions.value, [optionName]: valueId };
  const mockIds = Object.values(mockSelection);

  // 2. 檢查是否有任何 Variant 符合這個假設狀態
  // 條件：必須包含所有 mockIds，且 StockQty > 0
  const hasAvailableVariant = product.value.variants.some(v =>
    v.stockQty > 0 &&
    mockIds.every(id => v.optionValueIds.includes(id))
  );

  return !hasAvailableVariant;
};

// --- 6. 事件處理 ---
const handleSelectOption = (optionName: string, valueId: number) => {
  if (selectedOptions.value[optionName] === valueId) {
    // 如果點擊已選中的，則取消選取
    delete selectedOptions.value[optionName];
  } else {
    // 選取新的
    selectedOptions.value[optionName] = valueId;
  }

  // 切換圖片：如果有選出 Variant 且該 Variant 有圖，切換到第一張
  if (currentVariant.value && currentVariant.value.images.length > 0) {
    // 這裡簡化處理，實際可做更複雜的圖片切換
    activeImageIndex.value = 0;
  }
};

// --- 7. 顯示邏輯 (Computed Display) ---
const displayPrice = computed(() => currentVariant.value ? currentVariant.value.price : product.value ? product.value.price : 0);
const displayDiscountPrice = computed(() => currentVariant.value ? currentVariant.value.discountPrice : product.value ? product.value.discountPrice : 0);

// 計算折扣百分比
const discountPercent = computed(() => {
  const original = displayPrice.value;
  const discount = displayDiscountPrice.value;
  if (original == null) return 0;
  if (!discount || discount >= original) return 0;
  return Math.round(((original - discount) / original) * 100);
});

// 圖片列表 (優先顯示 Variant 圖片)
const currentImages = computed(() => {
  if (currentVariant.value && currentVariant.value.images.length > 0) {
    return currentVariant.value.images;
  }
  // 這裡應該回傳 ProductVariantImages 沒對應到的主圖，這裡用變體圖模擬
  if (product.value == null) {
    return [];
  }
  return product.value.variants.flatMap(v => v.images).slice(0, 4);
});

// 模擬熱門推薦
const hotProducts = ref([
  { id: 101, name: "休閒短褲", discountPrice: 390, image: "https://placehold.co/100x100?text=Shorts" },
  { id: 102, name: "漁夫帽", discountPrice: 290, image: "https://placehold.co/100x100?text=Hat" }
]);
</script>