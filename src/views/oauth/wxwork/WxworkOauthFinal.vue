<script setup>
import { showConfirmDialog } from 'vant'
import 'vant/es/dialog/style'
import { useRoute, useRouter } from 'vue-router'
import { ref } from 'vue'
import { wxWorkEmployeeInfoService } from '@/apis/oauth'
import { useUserStore } from '@/stores'
const userStore = useUserStore()
const route = useRoute()
const router = useRouter()
const code = ref('')
const userinfo = ref(null)

code.value = route.query.code

const initPage = async () => {
  // 将code重新给到后端，然后后端获取需要的所有用户详细信息
  const response = await wxWorkEmployeeInfoService(code.value)
  // console.log(response.data)
  userinfo.value = response.data

  if (userinfo.value) {
    userStore.setUserinfo(response.data)
    router.replace({ path: '/add-invite', query: { ...userinfo.value } })
  } else {
    console.error('获取员工id失败')
    // 弹出对话框？询问用户是否跳转到重新授权页面？
    showConfirmDialog({
      message: '获取基础信息失败，是否重新尝试获取？',
      theme: 'round-button'
    })
      .then(() => {
        // on confirm
        router.replace('/oauth')
      })
      .catch(() => {
        // on cancel
      })
  }
}

// 初始化页面，马上访问后端获取oauth链接
initPage()
</script>

<template>
  <div>
    <!--oauth获取页面code-->
    <!-- <p>CODE：{{ code }}</p> -->
    <!-- <p>USERINFO：{{ userinfo }}</p> -->
    <van-loading color="#1989fa">获取信息中...</van-loading>
  </div>
</template>

<style scoped></style>
