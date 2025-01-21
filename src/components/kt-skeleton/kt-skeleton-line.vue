<!--
* @description  骨架屏组件（课程列表）
* @fileName  kt-skeleton-list
* @author chengwei
* @date 2022-11-14 15:34:20
-->
<script lang="ts" setup name="KtSkeletonList">
  import { addUnit } from '/@/utils';
  import { propsLine } from './props';
  defineProps(propsLine);
</script>

<template>
  <view v-if="visible" class="px-14" :class="{ 'animate-pulse': animate }">
    <view
      v-for="i in count"
      :key="i"
      class="bg-gray-200 rounded"
      :class="{
        'mt-8 h-16': size === 'default',
        'mt-14 h-32 rounded-md': size === 'large',
        'mt-12 h-24 rounded-md': size === 'middle',
        'mt-10 h-18': size === 'small',
        'mt-6 h-14': size === 'mini',
      }"
      :style="{ width: addUnit(width, 'rpx') }"
    />
  </view>
</template>
