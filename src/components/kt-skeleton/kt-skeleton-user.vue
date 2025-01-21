<!--
* @description  骨架屏组件（课程列表）
* @fileName  kt-skeleton-list
* @author chengwei
* @date 2022-11-14 15:34:20
-->
<script lang="ts" setup name="KtSkeletonList">
  import { addUnit } from '/@/utils';
  import { propsUser } from './props';

  defineProps(propsUser);
</script>

<template>
  <view v-if="visible" class="px-14" :class="{ 'animate-pulse': animate }">
    <view class="flex items-center w-full my-12">
      <view
        class="bg-gray-200"
        :class="[avatarShape === 'circle' ? 'rounded-full' : 'rounded-md']"
        :style="{ width: addUnit(width, 'rpx'), height: addUnit(height, 'rpx') }"
      />
      <view class="flex-1 pl-10">
        <view v-for="i in count" :key="i" class="h-16 my-5 bg-gray-200 rounded" />
      </view>
    </view>
  </view>
</template>
