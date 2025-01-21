<!--
* @description  参数1
* @fileName  kt-safe
* @author machaunqi
* @date 2023-08-21 11:27:15
-->
<script lang="ts" setup>
  // #ifndef MP
  import { useAppStoreWithOut } from '/@/store/index';
  const appStore = useAppStoreWithOut();
  // #endif
</script>

<template>
  <!-- #ifdef H5 -->
  <view class="safe-area" />
  <!-- #endif -->
  <!-- #ifndef H5 -->
  <view
    :style="{
      paddingBottom: `${appStore.getSystemInfo.safeAreaInsets?.bottom}rpx`,
    }"
  />
  <!-- #endif -->
</template>

<style lang="scss"></style>
