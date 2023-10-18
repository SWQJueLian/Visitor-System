import { defineStore } from 'pinia'
// eslint-disable-next-line no-unused-vars
import { ref } from 'vue'

export const useUserStore = defineStore(
  'User',
  () => {
    // 用户基础信息
    const userinfo = ref({})

    // 设置用户基础信息
    const setUserinfo = (value) => {
      userinfo.value = value
    }

    return {
      userinfo,
      setUserinfo
    }
  },
  {
    // 持久化存储到cookies
    persist: true
  }
)
