<!--
* @description  骨架屏组件（图片卡片）
* @fileName  kt-skeleton-card
* @author chengwei
* @date 2022-11-14 15:34:20
-->
<script lang="ts" setup name="KtSkeleton">
  import { addUnit } from '/@/utils';
  import { propsCard } from './props';

  defineProps(propsCard);
</script>

<template v-if="visible">
  <view
    v-for="i in count"
    :key="i"
    class="bg-gray-200 rounded-md"
    :class="{ 'animate-pulse': animate, 'mx-auto': centerX }"
    :style="{ width: addUnit(width, 'rpx'), height: addUnit(height, 'rpx') }"
  />
</template>
