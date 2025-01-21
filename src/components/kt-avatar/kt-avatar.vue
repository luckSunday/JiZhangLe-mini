<!--
* @description  用户头像
* @fileName  kt-avatar
* @author userName
* @date 2023-08-19 18:41:03
-->
<script lang="ts" setup>
  import { Props } from './props';
  defineProps(Props);
</script>

<template>
  <view
    class="overflow-hidden rounded-full"
    :style="{
      width: `${size}rpx`,
      height: `${size}rpx`,
      border: `${border}rpx solid ${borderColor}`,
    }"
  >
    <image class="w-full h-full" :src="url" mode="aspectFill" />
  </view>
</template>

<style lang="scss"></style>
