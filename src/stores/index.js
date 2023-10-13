import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(persist)

export default pinia

// import { useUserStore } from './user'
// export { useUserStore }
// 直接导出user中的所有
export * from '@/stores/modules/user'
