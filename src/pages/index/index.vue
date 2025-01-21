<script setup lang="ts">
  import { onPageInit } from '/@/hooks/event/onPageInit';

  onPageInit(() => {}, true);
</script>

<template>
  <kt-layout
    background="#F7F8FA"
    :header="{ customTitle: true }"
    style="z-index: 999999 !important"
  >
    <!-- height-mode="fixed" -->

    <template #header>
      <view>首页</view>
    </template>
    <view class="w-full h-full homebox"> </view>
  </kt-layout>
</template>

<style scoped></style>
