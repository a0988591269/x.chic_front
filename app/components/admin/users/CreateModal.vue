<template>
  <UModal v-model:open="isOpen" title="新增會員" description="請輸入新會員的登入資訊">
    <template #body>
      <UForm :validate="validate" :state="state" class="space-y-4" @submit="onSubmit">

        <UFormField label="Email" name="email" required>
          <UInput v-model="state.email" placeholder="user@example.com" icon="i-heroicons-envelope" />
        </UFormField>

        <div class="flex justify-end gap-2 mt-6">
          <UButton label="取消" color="neutral" variant="ghost" @click="isOpen = false" />
          <UButton type="submit" label="確認新增" color="primary" loading-auto />
        </div>
      </UForm>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '@nuxt/ui'

// 定義與父層的雙向綁定
const isOpen = defineModel<boolean>('isOpen', { required: true })

// 定義事件：當新增成功時通知父層刷新列表
const emit = defineEmits<{
  (e: 'success', data: { email: string }): void
}>()

// 表單初始狀態
const state = reactive({
  email: ''
})

type Schema = typeof state

function validate(state: Partial<Schema>): FormError[] {
  const errors = []
  if (!state.email) errors.push({ name: 'email', message: '請輸入有效的 Email' })
  return errors
}

// 送出處理
async function onSubmit(event: FormSubmitEvent<Schema>) {
  // 模擬 API 請求延遲
  await new Promise(resolve => setTimeout(resolve, 1000))

  console.log('Form submitted:', event.data)

  // 通知父層並關閉 Modal
  emit('success', { email: event.data.email })
  isOpen.value = false

  // 重置表單 (可選)
  state.email = ''
}
</script>