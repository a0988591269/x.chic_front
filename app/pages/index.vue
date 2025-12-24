<template>
  <div class="my-10">
    <UCarousel
      v-slot="{ item }"
      loop
      dots
      auto-scroll
      :items="items"
      :ui="{ item: 'basis-1/4' }"
    >
      <img :src="item" width="640" height="640" class="rounded-lg">
    </UCarousel>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  public: true,
  middleware: 'guest'
})
const items = [
  'https://picsum.photos/640/640?random=1',
  'https://picsum.photos/640/640?random=2',
  'https://picsum.photos/640/640?random=3',
  'https://picsum.photos/640/640?random=4',
  'https://picsum.photos/640/640?random=5',
  'https://picsum.photos/640/640?random=6'
]
</script>