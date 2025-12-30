<template>
  <section
    class="min-h-screen bg-white flex items-center justify-center px-4 py-12"
  >
    <div class="max-w-5xl w-full flex flex-col md:flex-row gap-12 items-center">
      <!-- 品牌圖片區 -->
      <div class="w-full md:w-2/5 flex flex-col items-center">
        <div
          class="w-full aspect-square rounded-2xl overflow-hidden shadow border border-gray-200 bg-gray-50 mb-6"
        >
          <img
            src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80"
            alt="品牌形象"
            class="object-cover w-full h-full"
          />
        </div>
        <div class="flex gap-3">
          <img
            src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80"
            alt="品牌服飾"
            class="w-16 h-16 rounded-lg object-cover border border-gray-200"
          />
          <img
            src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=200&q=80"
            alt="品牌配件"
            class="w-16 h-16 rounded-lg object-cover border border-gray-200"
          />
        </div>
      </div>
      <!-- 品牌故事區 -->
      <div class="flex-1 flex flex-col justify-center">
        <h1
          class="text-4xl font-extrabold text-gray-800 mb-4 tracking-tight text-center md:text-left"
        >
          關於 X.Chic
        </h1>
        <div class="space-y-5 text-gray-700 text-lg leading-relaxed">
          <p>
            X.Chic，誕生於一個對「生活美感」充滿熱情的設計師腦海裡。品牌名稱中的「X」象徵無限可能，「Chic」則代表著簡約而不失品味的時尚態度。我們相信，穿搭不只是外在的裝飾，更是每個人獨特故事的延伸。
          </p>
          <p>
            從一開始，X.Chic
            就堅持「設計源於生活」。我們的每一件服飾、每一款配件，靈感都來自於城市的日常、旅行的片段、甚至是一杯咖啡的溫度。團隊成員來自不同領域，卻都對細節有著近乎苛求的執著，從布料選擇、剪裁設計到包裝，每一步都親自把關，只為讓你收到的不只是商品，而是一份專屬於你的美好體驗。
          </p>
          <p>
            X.Chic
            不追逐短暫的流行，而是希望陪你走過每個季節、每個重要時刻。無論是簡約的白T、俐落的褲裝，還是畫龍點睛的小配件，我們都希望你能自在搭配，穿出屬於自己的態度與自信。
          </p>
          <p>
            我們相信，時尚可以很簡單，也可以很有溫度。X.Chic
            期待成為你生活中的靈感來源，讓每一天都能因為一件好衣服而變得更有質感、更有故事。
          </p>
        </div>
        <div class="flex flex-wrap gap-2 mt-6">
          <span
            class="inline-block bg-gray-50 text-gray-600 font-medium px-3 py-1 rounded border border-gray-200"
            >自創設計</span
          >
          <span
            class="inline-block bg-gray-50 text-gray-600 font-medium px-3 py-1 rounded border border-gray-200"
            >質感選品</span
          >
          <span
            class="inline-block bg-gray-50 text-gray-600 font-medium px-3 py-1 rounded border border-gray-200"
            >生活靈感</span
          >
          <span
            class="inline-block bg-gray-50 text-gray-600 font-medium px-3 py-1 rounded border border-gray-200"
            >細節堅持</span
          >
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
definePageMeta({
  requiresGuest: true,
});
</script>
