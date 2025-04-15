<script setup lang="ts">
  import MainLayout from './components/Layout/MainLayout.vue'

  // 컴포넌트 임포트는 필요 없음
</script>

<template>
  <MainLayout>
    <router-view />
  </MainLayout>
</template>

<style>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
