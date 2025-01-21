<!--
* @description  骨架屏组件（图片卡片）
* @fileName  kt-skeleton-tabs
* @author chengwei
* @date 2022-11-14 15:34:20
-->
<script lang="ts" setup name="KtSkeletonTabs">
  import { propsBase } from './props';

  defineProps(propsBase);
</script>

<template>
  <view v-if="visible" class="flex justify-between py-10" :class="{ 'animate-pulse': animate }">
    <view v-for="i in 6" :key="i" class="mx-auto mt-10 h-16 w-42 rounded bg-gray-200"> </view>
  </view>
</template>
