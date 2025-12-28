<template>
    <div
        class="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 via-pink-100 to-orange-100 px-4">
        <div class="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl max-w-xl w-full p-8 md:p-12">
            <h2 class="text-3xl font-bold text-gray-800 mb-2 text-center">聯絡我們</h2>
            <p class="text-gray-600 mb-8 text-center">
                有任何問題或合作需求，歡迎填寫下方表單，我們將盡快與您聯繫！
            </p>
            <form @submit.prevent="handleSubmit" class="space-y-5">
                <div>
                    <label for="name" class="block text-gray-700 mb-1">姓名</label>
                    <input id="name" v-model="form.name" type="text" required
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-400 transition" />
                </div>
                <div>
                    <label for="email" class="block text-gray-700 mb-1">E-Mail</label>
                    <input id="email" v-model="form.email" type="email" required
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-400 transition" />
                </div>
                <div>
                    <label for="phone" class="block text-gray-700 mb-1">電話</label>
                    <input id="phone" v-model="form.phone" type="tel" required
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-400 transition" />
                </div>
                <div>
                    <label for="message" class="block text-gray-700 mb-1">內容</label>
                    <textarea id="message" v-model="form.message" rows="4" required
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-400 transition resize-none"></textarea>
                </div>
                <button type="submit"
                    class="w-full py-2 rounded-lg bg-gradient-to-r from-yellow-300 to-pink-400 text-white font-semibold text-lg shadow hover:from-pink-400 hover:to-yellow-300 transition">
                    送出
                </button>
            </form>
            <div v-if="submitted" class="mt-6 text-green-600 text-center font-semibold">
                已收到您的訊息，感謝您的聯絡！
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({
  public: true
})

const form = ref({
    name: '',
    email: '',
    phone: '',
    message: ''
})
const submitted = ref(false)

const handleSubmit = () => {
    // TODO: 可串接API或寄信
    submitted.value = true
    setTimeout(() => {
        submitted.value = false
        form.value = { name: '', email: '', phone: '', message: '' }
    }, 3000)
}
</script>