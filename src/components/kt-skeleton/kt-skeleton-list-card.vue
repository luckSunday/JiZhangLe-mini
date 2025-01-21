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
  <view
    v-if="visible"
    class="flex flex-wrap justify-between px-14"
    :class="{ 'animate-pulse': animate }"
  >
    <view v-for="i in count" :key="i" class="mb-12 w-168">
      <view class="h-126 rounded-md bg-gray-200"></view>
      <view class="p-5">
        <view class="h-16 rounded bg-gray-200"></view>
        <view class="mt-5 h-16 w-2/3 rounded bg-gray-200"></view>
        <view class="mt-5 h-16 w-3/4 rounded bg-gray-200"></view>
      </view>
    </view>
  </view>
</template>
