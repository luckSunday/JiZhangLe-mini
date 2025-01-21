<script setup lang="ts">
  import { onPageInit } from '/@/hooks/event/onPageInit';

  onPageInit(() => {
    console.log('onPageInit');
  }, true);
</script>

<template>
  <kt-layout background="#ffffff" height-mode="fixed" :header="{ title: `个人页面` }">
    <view
      class="w-full h-full pt-18"
      style="background: linear-gradient(180deg, #fff 0%, #f6f6f6 100%)"
    >
      请问恶趣味
    </view>
  </kt-layout>
</template>

<style scoped></style>
