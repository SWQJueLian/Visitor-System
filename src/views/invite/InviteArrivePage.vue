<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div>访客到达-扫描页面{{ route.params.invite_id }}</div>
</template>

<style scoped></style>
