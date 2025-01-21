<!--
* @description  骨架屏组件（图片卡片）
* @fileName  kt-skeleton-navs
* @author chengwei
* @date 2022-11-14 15:34:20
-->
<script lang="ts" setup name="KtSkeletonNavs">
  import { propsBase } from './props';

  defineProps(propsBase);
</script>

<template>
  <view v-if="visible" class="flex flex-wrap justify-around" :class="{ 'animate-pulse': animate }">
    <view v-for="i in count" :key="i">
      <view class="mx-auto h-36 w-36 rounded-full bg-gray-200"></view>
      <view class="mx-auto mt-10 h-12 w-42 rounded bg-gray-200"></view>
    </view>
  </view>
</template>
