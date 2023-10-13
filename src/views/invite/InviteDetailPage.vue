<script setup>
import { useRoute } from 'vue-router'
import vnpKeyboard from '@/components/vant-number-plate/vnp-keyboard.vue'
import { ref } from 'vue'
const route = useRoute()
const value = ref('粤A')
const show = ref(false)
</script>

<template>
  <div>访客详情页{{ route.params.invite_id }}</div>
  <div>
    <h3>示例一</h3>
    <van-cell-group>
      <van-field
        :model-value="value"
        readonly
        label="车牌号"
        @click="show = true"
      />
    </van-cell-group>
    <vnp-keyboard v-model="value" v-model:show="show"></vnp-keyboard>
  </div>
</template>

<style scoped></style>
