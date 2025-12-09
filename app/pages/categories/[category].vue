<template>
    <div class="max-w-7xl mx-auto px-4 py-8">
        <!-- 篩選區塊 -->
        <div class="flex flex-col md:flex-row md:items-end gap-4 mb-8">
            <div class="flex-1 flex flex-col md:flex-row gap-4">
                <!-- 搜尋 -->
                <div class="flex items-center gap-2">
                    <input v-model="filters.keyword" type="text" placeholder="搜尋商品名稱"
                        class="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-pink-400 transition w-48" />
                </div>
                <!-- 價格區間 -->
                <div class="flex items-center gap-2">
                    <input v-model.number="filters.priceMin" type="number" min="0" placeholder="最低價"
                        class="border border-gray-300 rounded-lg px-3 py-2 w-20 focus:outline-none focus:border-pink-400 transition" />
                    <span class="text-gray-400">-</span>
                    <input v-model.number="filters.priceMax" type="number" min="0" placeholder="最高價"
                        class="border border-gray-300 rounded-lg px-3 py-2 w-20 focus:outline-none focus:border-pink-400 transition" />
                </div>
                <!-- 類別 -->
                <!-- <div>
                    <select v-model="filters.category"
                        class="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-pink-400 transition">
                        <option value="">全部類別</option>
                        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
                    </select>
                </div> -->
            </div>
            <button @click="resetFilters"
                class="bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg px-4 py-2 font-medium transition">
                清除條件
            </button>
        </div>

        <!-- 商品列表 -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div v-for="item in pagedProducts" :key="item.productId"
                class="bg-white rounded-xl shadow hover:shadow-lg transition flex flex-col">
                <NuxtLink :to="`/products/${category}/${item.productId}`">
                    <img :src="`http://localhost:5042${item.imageUrl}`" :alt="`${item.productName}`" class="rounded-t-xl object-cover h-48 w-full" />
                    <div class="p-4 flex-1 flex flex-col">
                        <h3 class="font-semibold text-lg text-gray-800 mb-1 truncate">{{ item.productName }}</h3>
                        <div class="flex items-center gap-2 mb-2">
                            <span v-if="item.discountPrice < item.price" class="text-pink-500 font-bold text-xl">
                                ${{ item.discountPrice }}
                            </span>
                            <span v-if="item.discountPrice < item.price"
                                class="text-gray-400 line-through text-sm">
                                ${{ item.price }}
                            </span>
                            <span v-else class="text-gray-800 font-bold text-xl">${{ item.price }}</span>
                        </div>
                        <div class="text-gray-500 text-sm mb-2">銷售量：{{ item.totalSales }}</div>
                    </div>
                </NuxtLink>
            </div>
        </div>

        <!-- 分頁 -->
        <div class="flex justify-center mt-10">
            <nav class="inline-flex rounded-md shadow-sm" aria-label="Pagination">
                <button @click="prevPage" :disabled="page === 1"
                    class="px-3 py-1 rounded-l-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-100 disabled:opacity-50">
                    上一頁
                </button>
                <button v-for="p in totalPages" :key="p" @click="goPage(p)" :class="[
                    'px-3 py-1 border-t border-b border-gray-300 bg-white text-gray-700 hover:bg-pink-100',
                    p === page ? 'font-bold text-pink-500 border-pink-400' : 'border-gray-300'
                ]">
                    {{ p }}
                </button>
                <button @click="nextPage" :disabled="page === totalPages"
                    class="px-3 py-1 rounded-r-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-100 disabled:opacity-50">
                    下一頁
                </button>
            </nav>
        </div>
    </div>
</template>

<script setup lang="ts">
import { NuxtLink } from '#components'

const route = useRoute()
const { category } = route.params
console.log('目前類別：', category)

// 假資料，實際請串接API
interface Product {
    productId: number;
    productName: string;
    shortDescription: string;
    longDescription: string;
    categoryId: number;
    isActive: boolean;
    totalSales: number;
    rating: number;
    isHot: boolean;
    isNew: boolean;
    isRecommended: boolean;
    productVariantId: number;
    sku: string;
    price: number;
    discountPrice: number;
    stockQty: number;
    imageUrl: string;
}
const {data: resp} = await useFetch<Product[]>('http://localhost:5042/api/Product/GetBySlug', {
    params: {
        slug: category as string
    }
})
// const allProducts = ref([
//     {
//         id: 1,
//         name: '經典白T',
//         image: 'https://source.unsplash.com/400x300/?tshirt,white',
//         price: 690,
//         discountPrice: 590,
//         sales: 120,
//         category: '上衣'
//     },
//     {
//         id: 2,
//         name: '牛仔褲',
//         image: 'https://source.unsplash.com/400x300/?jeans',
//         price: 1290,
//         discountPrice: 990,
//         sales: 80,
//         category: '褲子'
//     },
//     {
//         id: 3,
//         name: '棒球帽',
//         image: 'https://source.unsplash.com/400x300/?cap',
//         price: 390,
//         discountPrice: 390,
//         sales: 60,
//         category: '配件'
//     },
//     // ...可再補充更多假資料
// ])

// const categories = ref(['上衣', '褲子', '配件'])

const filters = ref({
    keyword: '',
    priceMin: null as number | null,
    priceMax: null as number | null,
    category: ''
})

const resetFilters = () => {
    filters.value = {
        keyword: '',
        priceMin: null,
        priceMax: null,
        category: ''
    }
}

// 篩選後的商品
const filteredProducts = computed(() => {
    return (resp.value ?? []).filter(p => {
        const matchKeyword = !filters.value.keyword || p.productName.includes(filters.value.keyword)
        // const matchCategory = !filters.value.category || p.category === filters.value.category
        const matchMin = filters.value.priceMin == null || p.discountPrice >= filters.value.priceMin
        const matchMax = filters.value.priceMax == null || p.discountPrice <= filters.value.priceMax
        // return matchKeyword && matchCategory && matchMin && matchMax
        return matchKeyword && matchMin && matchMax
    })
})

// 分頁
const page = ref(1)
const pageSize = 12
const totalPages = computed(() => Math.ceil(filteredProducts.value.length / pageSize))
const pagedProducts = computed(() =>
    filteredProducts.value.slice((page.value - 1) * pageSize, page.value * pageSize)
)
console.log('分頁商品數量：', pagedProducts.value)

const goPage = (p: number) => {
    page.value = p
}
const prevPage = () => {
    if (page.value > 1) page.value--
}
const nextPage = () => {
    if (page.value < totalPages.value) page.value++
}
</script>