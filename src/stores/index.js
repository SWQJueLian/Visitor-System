import { createPinia } from 'pinia'

const pinia = createPinia()

export default pinia

// import { useUserStore } from './user'
// export { useUserStore }
// 直接导出user中的所有
export * from '@/stores/modules/user'
