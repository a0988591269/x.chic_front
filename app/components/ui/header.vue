<template>
    <!-- Guide Bar -->
    <div class="h-[40px] bg-gray-200 grid grid-cols-2 justify-items-stretch content-center">
        <div class="flex justify-self-start items-center">
            <NuxtLink to="/">
                <input class="w-[60px] h-[30px] text-zinc-600" type="button" value="首頁">
            </NuxtLink>
            <div class="flex flex-nowrap self-center">
                <div class="flex items-center w-[16px]" @click="toggleCollapse">
                    <span><img src="~/assets/image/search.png"></span>
                </div>
                <div class="flex items-center w-[180px] h-auto px-3" :class="{ 'hidden': !isOpen, 'block': isOpen }">
                    <input type="text" class="h-[30px]" placeholder="請輸入查詢關鍵字">
                    <button type="submit" class="w-[60px] h-[30px] text-nowrap">搜尋</button>
                </div>
            </div>
        </div>
        <div v-if="!isLogin" class="flex justify-self-end items-center mx-3">
            <NuxtLink to="/">
                <input class="w-[60px] h-[30px] text-zinc-600" type="button" value="購物車">
            </NuxtLink>
            <NuxtLink to="/login">
                <a class="w-auto h-[30px] text-zinc-600" type="button" value="">登入</a>
            </NuxtLink>
            /
            <NuxtLink to="/login">
                <a class="w-auto h-[30px] text-zinc-600" type="button" value="">註冊</a>
            </NuxtLink>
        </div>
        <div v-else class="flex justify-self-end items-center mx-3">
            <NuxtLink to="/">
                <input class="w-[60px] h-[30px] text-zinc-600" type="button" value="購物車">
            </NuxtLink>
            <NuxtLink to="/">
                <a class="w-auto h-[30px] text-zinc-600" type="button" value="" v-on:click="auth.logout()">登出</a>
            </NuxtLink>
        </div>
    </div>
    <div>
        <NuxtLink to="/">
            <img src="~/assets/image/logo.png" alt="X.Chic creative studio" class="img-fluid justify-self-center">
        </NuxtLink>
    </div>
    <div>
        <ul id="nav">
            <li v-for="item in resp" :key="item.categoryId" class="main_menu">
                <NuxtLink :to="`/categories/${item.slug}`">
                    <span>{{ item.categoryName }}</span>{{ item.categoryEngName }}
                </NuxtLink>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~~/stores/auth';
const auth = useAuthStore();
const isLogin = computed(() => auth.isAuthenticated)

interface Category {
    categoryId: number;
    categoryName: string;
    categoryEngName: string;
    description: string;
    slug: string;
}

const isOpen = ref(false);
const toggleCollapse = () => {
    isOpen.value = !isOpen.value;
    return isOpen.value;
};
const { data: resp } = await useFetch<Category[]>('https://localhost:7197/api/Category')

</script>