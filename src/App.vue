<script setup></script>

<template>
  <div>
    <router-view v-slot="{ Component }">
      <!-- 一级路由只缓存Layout，详情页等等不缓存 -->
      <keep-alive :include="['LayoutPage']">
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>

<style scoped></style>
