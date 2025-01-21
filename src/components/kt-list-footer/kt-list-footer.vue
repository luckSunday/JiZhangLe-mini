<!--
* @description  数据列表底部的loading和结束状态
* @fileName  list-footer
* @author 成崴
* @date 2022-04-13 10:30:59
-->
<script lang="ts" setup name="KtListFooter">
  import { computed } from 'vue';
  import { useRoute } from '/@/hooks/core';
  import { listFooterEmits, listFooterProps } from './props';
  // import { onShow } from '@dcloudio/uni-app';
  const props = defineProps(listFooterProps);
  defineEmits(listFooterEmits);

  const listStatus = computed(() => {
    const status = props.status;
    if (typeof status === 'string') {
      return status;
    }
    if (status.loading) {
      return 'loading';
    }
    if (status.error) {
      return 'error';
    }
    if (status.empty) {
      return 'empty';
    }
    if (status.finished) {
      return 'finished';
    }
    return 'loading';
  });

  function goHome() {
    useRoute({
      type: 'reLaunch',
      url: '/pages/index/index',
    });
  }
</script>

<template>
  <slot v-if="listStatus === 'loading'" name="loading">
    <view class="flex items-center justify-center h-36">
      <!-- <image
        src="https://ttmini.yizhiwechat.com/ktts/icons/list-loading.svg"
        mode="aspectFill"
        class="w-72 h-18"
      /> -->
      <view class="loading-dot dot1" />
      <view class="loading-dot dot2" />
      <view class="loading-dot dot3" />
      <view class="loading-dot dot4" />
    </view>
  </slot>
  <slot v-else-if="listStatus === 'empty'" name="empty">
    <view class="flex flex-col items-center justify-center pt-120">
      <image
        src="https://ttmini.yizhiwechat.com/ktts/empty.png"
        mode="aspectFit"
        class="h-128 w-176"
      />
      <text class="mt-10 text-sm text-gray-400">{{ emptyText }}</text>
      <button
        v-if="emptyShowBtn"
        class="mt-8 text-white rounded-full h-36 w-120 bg-primary text-md leading-36"
        @click="goHome"
      >
        回到首页
      </button>
    </view>
  </slot>
  <slot v-else-if="listStatus === 'finished'" name="finished">
    <view class="flex items-center justify-center h-20 text-sm text-gray-300">
      - 没有更多了 -
    </view>
  </slot>
  <slot v-else-if="listStatus === 'error'" name="error">
    <view
      class="flex items-center justify-center h-48 text-sm text-gray-400"
      @click="$emit('retry')"
    >
      重新加载
    </view>
  </slot>
</template>

<style lang="scss" scoped>
  .loading-dot {
    @apply h-16 w-16 rounded-full;
    animation-name: zoom-dot;
    animation-duration: 300ms;
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite;
    animation-direction: alternate;
    &.dot1 {
      @apply bg-gray-600;

      animation-delay: -300ms;
    }
    &.dot2 {
      @apply bg-gray-500;
      animation-delay: -200ms;
    }
    &.dot3 {
      @apply bg-gray-400;
      animation-delay: -100ms;
    }
    &.dot4 {
      @apply bg-gray-300;
      animation-delay: 0;
    }
  }
  @keyframes zoom-dot {
    0% {
      transform: scale(0);
    }
    100% {
      transform: scale(0.5);
    }
  }
</style>
