import { defineStore } from 'pinia'
// eslint-disable-next-line no-unused-vars
import { ref } from 'vue'

export const useUserStore = defineStore(
  'User',
  () => {
    // 用户登录token
    const token = ref('')

    return {
      token
    }
  },
  {
    // 持久化存储到cookies
    persist: true
  }
)
