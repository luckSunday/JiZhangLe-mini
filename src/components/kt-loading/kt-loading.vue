<!--
* @description  课堂公共加载loading
* @fileName  kt-loading
* @author mcq
* @date 2022-11-01 14:04:56
-->
<script lang="ts">
  import { defineComponent } from 'vue';
  import { KeTangLoadingProps } from './props';
  export default defineComponent({
    props: KeTangLoadingProps,
  });
</script>

<template>
  <view
    v-if="loading"
    class="flex w-screen flex-col justify-center"
    :class="{ 'absolute top-0 bottom-0 left-0 right-0 items-center': middle }"
  >
    <image
      v-if="theme === 1"
      src="https://ttmini.yizhiwechat.com/keTang/v16/kt-load.gif"
      class="h-95 w-full"
      mode="aspectFit"
    >
    </image>
    <image
      v-else-if="theme === 2"
      src="https://ttmini.yizhiwechat.com/keTang/v147/kt-load2.gif"
      class="h-95 w-full"
      mode="aspectFit"
    >
    </image>
    <view class="load-msg" :class="{ theme2: theme === 2 }" :style="{ color }">
      {{ msg }}
    </view>
  </view>
  <slot v-else></slot>
</template>

<style lang="scss" scoped>
  @keyframes ellipsis {
    0% {
      width: 6rpx;
    }
    50% {
      width: 12rpx;
    }
    100% {
      width: 24rpx;
    }
  }
  .load-msg {
    color: #ff5a30;
    font-size: 28rpx;
    text-align: center;
    padding-top: 6rpx;
    &.theme2 {
      &::after {
        color: #1448ff;
      }
    }
    &::after {
      content: '\2026';
      overflow: hidden;
      display: inline-block;
      color: #ff5a30;
      font-size: 26rpx;
      vertical-align: bottom;
      animation: ellipsis 1s steps(3, end) both infinite;
    }
  }
</style>
