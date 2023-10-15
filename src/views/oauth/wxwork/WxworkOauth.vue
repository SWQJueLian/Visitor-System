<script setup>
import { wxWorkGetOAuthURLService } from '@/apis/oauth'
import { ref } from 'vue'

const resp_val = ref('')

const oauth_url = ref('')
const initPage = async () => {
  const resp = await wxWorkGetOAuthURLService()
  console.log(resp)
  resp_val.value = resp
  oauth_url.value = resp.data.oauth_url
  // 特殊符号在IOS中会报错，所以要对url进行编码、解码
  location.href = decodeURIComponent(oauth_url.value)
}

// 初始化页面，马上访问后端获取oauth链接
initPage()
</script>

<template>
  <div>
    <van-loading color="#1989fa" />
    <!--oauth获取页面-->
    <!-- <p>url：{{ oauth_url }}</p>
    <p>resp{{ resp_val }}</p> -->
  </div>
</template>

<style scoped></style>
