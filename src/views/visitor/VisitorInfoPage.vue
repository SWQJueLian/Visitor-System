<script setup>
import { useRoute } from 'vue-router'
import { ref } from 'vue'
import { baseurl } from '@/utils/request'
import vueQr from 'vue-qr/src/packages/vue-qr.vue'

const route = useRoute()
const qrcode_url = ref(`${baseurl}/visitor-arrive/${route.params.invite_id}`)
</script>

<template>
  <div>
    <van-grid :column-num="1" direction="horizontal">
      <van-grid-item> <van-icon name="smile-o" />欢迎您的到访~ </van-grid-item>
      <van-grid-item>
        <vue-qr :text="qrcode_url" :size="300"></vue-qr>
      </van-grid-item>
      <van-grid-item>
        <div>您可以截图保存此二维码，到达时将该二维码出示给门卫扫码！</div>
      </van-grid-item>
    </van-grid>
  </div>
</template>

<style scoped></style>
