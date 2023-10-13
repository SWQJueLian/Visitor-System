<script setup>
import { ref } from 'vue'

defineOptions({
  name: 'LayoutPage'
})

const active = ref(0)
</script>

<template>
  <div>
    <router-view></router-view>
    <van-tabbar route v-model="active" safe-area-inset-bottom>
      <van-tabbar-item to="/add-invite" icon="calendar-o"
        >邀请访客</van-tabbar-item
      >
      <van-tabbar-item to="/my-invite" icon="manager-o"
        >我的邀请</van-tabbar-item
      >
    </van-tabbar>
  </div>
</template>

<style scoped></style>
