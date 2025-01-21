<script setup lang="ts">
  import { ref } from 'vue';
  import { useRoute } from '/@/hooks/core/useRoute';
  const headerHeight = ref(0);
  const textArr = ref([
    '1. 广告单价 每次广告完播收益为0.1 - 0.2元；',
    '2. 收益结算 当日产生的广告收益，将在第二天晚上12点左右进行结算，结算完成后可提现。',
    '3. 提现多久到账 提现秒到账，如遇特殊情况，触发平台风控，则需要进入人工审核，此情况可联系客服处理。',
    '4. 关于刷广告 平台有强大的防刷系统，刷广告无法产生收益还会被封号，并追究法律责任。',
  ]);
</script>

<template>
  <kt-layout
    v-model:headerHeight="headerHeight"
    height-mode="fixed"
    background="#F6F6F6"
    :header="{ title: '常见问题' }"
  >
    <view class="px-12">
      <view
        class="flex items-center justify-center w-full text-lg font-semibold text-black pt-18 leading-18"
      >
        <image
          src="https://ttmini.yizhiwechat.com/ugc/mine/problem.png"
          mode="scaleToFill"
          class="mr-4 w-18 h-18"
        />
        常见问题
      </view>
      <view class="mx-8 mt-24">
        <view class="mb-14 text-[#454648] text-sm" v-for="(i, index) in textArr" :key="index">
          {{ i }}
        </view>
      </view>
      <view class="fixed left-0 w-full bottom-88">
        <view
          class="w-259 h-54 mx-auto rounded-[200rpx] flex items-center justify-center text-[#151620] text-base font-semibold bg-[#FFF] mt-16"
          @click="useRoute({ type: 'navigateBack' })"
        >
          返回
        </view>
      </view>
    </view>
  </kt-layout>
</template>

<style scoped lang="scss"></style>
