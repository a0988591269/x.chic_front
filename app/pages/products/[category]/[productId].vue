<template>
  <div class="max-w-6xl mx-auto px-4 py-10">
    <div class="flex flex-col md:flex-row gap-10">
      <!-- 商品圖片輪播 -->
      <div class="md:w-1/2 flex flex-col items-center">
        <!-- 輪播主圖 -->
        <div
          class="w-full aspect-square bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden relative">
          <img :src="images?.[activeImage]" :alt="product?.name" class="object-contain w-full h-full transition" />
          <!-- dot 指示器 -->
          <div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            <button v-for="(img, idx) in images" :key="idx" @click="activeImage = idx" :class="[
              'w-3 h-3 rounded-full',
              activeImage === idx ? 'bg-gray-500' : 'bg-gray-300'
            ]"></button>
          </div>
        </div>
        <!-- 縮圖列 -->
        <div class="flex gap-2 mt-4">
          <img v-for="(img, idx) in images" :key="idx" :src="img" :alt="`商品圖片${idx + 1}`" @click="activeImage = idx"
            :class="[
              'w-16 h-16 object-cover rounded-lg border cursor-pointer transition',
              activeImage === idx ? 'border-gray-500 ring-2 ring-gray-300' : 'border-gray-200'
            ]" />
        </div>
      </div>
      <!-- 商品資訊 -->
      <div class="md:w-1/2 flex flex-col gap-4">
        <h1 class="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{{ product?.name }}</h1>
        <p class="text-gray-600 text-base mb-2">{{ product?.summary }}</p>
        <div class="flex items-center gap-3 mb-2">
          <span v-if="product && product.discountPrice < product.price" class="text-gray-700 font-bold text-2xl">
            ${{ product.discountPrice }}
          </span>
          <span v-if="product && product.discountPrice < product.price" class="text-gray-400 line-through text-lg">
            ${{ product.price }}
          </span>
          <span v-else class="text-gray-800 font-bold text-2xl">${{ product?.price }}</span>
          <span v-if="product && product.discountPrice < product.price"
            class="ml-2 bg-gray-100 text-gray-500 text-sm font-semibold px-2 py-0.5 rounded">
            -{{ discountPercent }}%
          </span>
        </div>
        <div class="flex items-center gap-4 text-gray-600 text-base">
          <span>銷售量：{{ product?.sales }}</span>
          <span class="flex items-center gap-1">
            <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z" />
            </svg>
            {{ product?.rating }} / 5
          </span>
        </div>
        <div class="flex items-center gap-3 mt-2">
          <label for="qty" class="text-gray-700">購買數量</label>
          <select id="qty" v-model="quantity"
            class="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:border-gray-500">
            <option v-for="n in 20" :key="n" :value="n">{{ n }}</option>
          </select>
        </div>
        <div class="mt-2 text-gray-500 text-sm">
          保固資訊：{{ product?.warranty }}
        </div>
        <button
          class="mt-6 w-full py-3 rounded-lg bg-gray-700 text-white font-semibold text-lg shadow hover:bg-gray-800 transition">
          加入購物車
        </button>
      </div>
    </div>

    <!-- 商品頁籤 -->
    <div class="mt-12">
      <div class="flex border-b border-gray-200 mb-6">
        <button v-for="tab in tabs" :key="tab.key" @click="activeTab = tab.key" :class="[
          'px-6 py-3 -mb-px font-medium text-base border-b-2 transition',
          activeTab === tab.key
            ? 'border-gray-700 text-gray-800'
            : 'border-transparent text-gray-500 hover:text-gray-700'
        ]">
          {{ tab.label }}
          <span v-if="tab.key === 'reviews'" class="ml-1 text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">{{
            product?.reviews.length }}</span>
        </button>
      </div>
      <div>
        <div v-if="activeTab === 'features'" class="text-gray-700 leading-relaxed">
          <ul class="list-disc pl-6 space-y-1">
            <li v-for="(f, idx) in product?.features" :key="idx">{{ f }}</li>
          </ul>
        </div>
        <div v-else-if="activeTab === 'reviews'">
          <div v-if="product && product.reviews.length === 0" class="text-gray-400">尚無評價</div>
          <div v-else class="space-y-4">
            <div v-for="(review, idx) in product?.reviews" :key="idx" class="border-b pb-3">
              <div class="flex items-center gap-2 mb-1">
                <span class="font-semibold text-gray-700">{{ review.user }}</span>
                <span class="flex items-center text-yellow-400 text-sm">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z" />
                  </svg>
                  {{ review.rating }}/5
                </span>
              </div>
              <div class="text-gray-600 text-sm">{{ review.comment }}</div>
            </div>
          </div>
        </div>
        <div v-else-if="activeTab === 'specs'" class="text-gray-700">
          <table class="w-full text-left">
            <tbody>
              <tr v-for="(val, key) in product?.specs" :key="key">
                <th class="py-1 pr-4 font-medium text-gray-600">{{ key }}</th>
                <td class="py-1 text-gray-700">{{ val }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else-if="activeTab === 'policy'" class="text-gray-700 leading-relaxed">
          <ul class="list-disc pl-6 space-y-1">
            <li v-for="(p, idx) in product?.policy" :key="idx">{{ p }}</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 推薦/排行 -->
    <div class="mt-14 grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- 熱門推薦 -->
      <div>
        <h2 class="text-xl font-bold text-gray-800 mb-4">熱門推薦</h2>
        <div class="grid grid-cols-2 gap-4">
          <div v-for="item in hotProducts" :key="item.id"
            class="bg-white rounded-lg shadow p-3 flex flex-col items-center">
            <img :src="item.image" :alt="item.name" class="w-20 h-20 object-cover rounded mb-2" />
            <div class="text-gray-700 font-medium text-sm truncate">{{ item.name }}</div>
            <div class="text-gray-700 font-bold text-base">${{ item.discountPrice }}</div>
          </div>
        </div>
      </div>
      <!-- 銷售排行 -->
      <div>
        <h2 class="text-xl font-bold text-gray-800 mb-4">銷售排行</h2>
        <ol class="space-y-3">
          <li v-for="(item, idx) in topSales" :key="item.id" class="flex items-center gap-3">
            <span class="w-6 h-6 flex items-center justify-center bg-gray-200 text-gray-700 font-bold rounded-full">{{
              idx + 1 }}</span>
            <img :src="item.image" :alt="item.name" class="w-10 h-10 object-cover rounded" />
            <span class="flex-1 truncate text-gray-700">{{ item.name }}</span>
            <span class="text-gray-700 font-semibold">${{ item.discountPrice }}</span>
          </li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// 假資料，實際請串接API
const route = useRoute()
const { category, productId } = route.params
console.log('目前類別：', category)
console.log('目前商品：', productId)
interface Product {
  name: string
  summary: string
  images: string[]
  price: number
  discountPrice: number
  sales: number
  rating: number
  warranty: string
  features: string[]
  reviews: { user: string; rating: number; comment: string }[]
  specs: Record<string, string>
  policy: string[]

}

const { data: product } = useFetch<Product>(() => `http://localhost:5042/api/product/${productId}`)
// const product = ref({
//   name: '經典白T',
//   summary: '簡約百搭的經典白T，採用100%純棉布料，舒適親膚，適合各種場合穿搭。',
//   images: [
//     'https://source.unsplash.com/600x600/?tshirt,white',
//     'https://source.unsplash.com/600x600/?tshirt,fashion',
//     'https://source.unsplash.com/600x600/?tshirt,model'
//   ],
//   price: 690,
//   discountPrice: 590,
//   sales: 120,
//   rating: 4.6,
//   warranty: '一年保固',
//   features: ['100% 純棉親膚', '台灣設計製造', '經典百搭款式', '舒適透氣'],
//   reviews: [
//     { user: '小美', rating: 5, comment: '質感很好，穿起來很舒服！' },
//     { user: '阿志', rating: 4, comment: '版型不錯，會再回購。' }
//   ],
//   specs: {
//     '材質': '100% 棉',
//     '尺寸': 'S / M / L / XL',
//     '顏色': '白色',
//     '產地': '台灣'
//   },
//   policy: [
//     '七天鑑賞期內可退換貨（需保持商品全新）',
//     '如有瑕疵請於三日內聯繫客服',
//     '退換貨運費依平台規定辦理'
//   ]
// })

const images = product.value?.images
const activeImage = ref(0)
const quantity = ref(1)

const discountPercent = computed(() =>
  product.value && product.value.discountPrice < product.value.price
    ? Math.round((1 - product.value.discountPrice / product.value.price) * 100)
    : 0
)

const tabs = [
  { key: 'features', label: '商品特色' },
  { key: 'reviews', label: '商品評價' },
  { key: 'specs', label: '商品規格' },
  { key: 'policy', label: '退/換貨需知' }
]
const activeTab = ref('features')

// 推薦與排行假資料
const hotProducts = [
  {
    id: 2,
    name: '牛仔褲',
    image: 'https://source.unsplash.com/200x200/?jeans',
    discountPrice: 990
  },
  {
    id: 3,
    name: '棒球帽',
    image: 'https://source.unsplash.com/200x200/?cap',
    discountPrice: 390
  }
]
const topSales = [
  {
    id: 1,
    name: '經典白T',
    image: 'https://source.unsplash.com/200x200/?tshirt,white',
    discountPrice: 590
  },
  {
    id: 2,
    name: '牛仔褲',
    image: 'https://source.unsplash.com/200x200/?jeans',
    discountPrice: 990
  }
]
</script>