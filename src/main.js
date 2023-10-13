import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

import pinia from '@/stores'

// vant4 桌面端适配引入模块后自动生效
import '@vant/touch-emulator'

const app = createApp(App)

app.use(pinia)
app.use(router)

app.mount('#app')
