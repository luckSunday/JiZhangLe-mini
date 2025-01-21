<!--
* @description  骨架屏组件（课程列表）
* @fileName  kt-skeleton-list
* @author chengwei
* @date 2022-11-14 15:34:20
-->
<script lang="ts" setup name="KtSkeletonList">
  import { propsBase } from './props';

  defineProps(propsBase);
</script>

<template>
  <view v-if="visible" class="px-14" :class="{ 'animate-pulse': animate }">
    <view v-for="i in count" :key="i" class="my-12 flex w-full">
      <view class="h-90 w-120 rounded-md bg-gray-200"></view>
      <view class="flex-1 pl-10">
        <view class="mt-5 h-16 rounded bg-gray-200"></view>
        <view class="mt-5 h-16 w-2/3 rounded bg-gray-200"></view>
        <view class="mt-5 h-16 w-1/2 rounded bg-gray-200"></view>
        <view class="mt-5 h-16 rounded bg-gray-200"></view>
      </view>
    </view>
  </view>
</template>
