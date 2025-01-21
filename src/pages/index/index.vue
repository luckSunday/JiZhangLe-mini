<script setup lang="ts">
  import { onPageInit } from '/@/hooks/event/onPageInit';

  onPageInit(() => {}, true);
</script>

<template>
  <kt-layout background="#F7F8FA" :header="{ customTitle: true }">
    <!-- height-mode="fixed" -->

    <template #header>
      <view>首页</view>
    </template>
    <view class="w-full h-screen">
      <view class="w-full homebox flex flex-col pt-31 p-15">
        <view class="text-xl font-black text-[#000000] text-center">
          打牌记账乐·一款免费好用的产品
        </view>
        <view
          class="flex text-sm font-medium text-[#383838] items-center gap-10 justify-center mt-10"
        >
          <view>打牌记分</view>
          <view class="h-10 w-1 bg-[#383838]"></view>
          <wiew>智能广播</wiew>
          <view class="h-10 w-1 bg-[#383838]"></view>
          <wiew>永久免费</wiew>
        </view>
        <view
          class="bg-[#F8FEF6] rounded-full w-full flex justify-between items-center p-9 pl-20 mt-21"
        >
          <view class="flex items-center">
            <img
              v-for="(item, index) in 3"
              :key="index"
              src="https://img1.baidu.com/it/u=3068589403,2444156117&fm=253&app=120&size=w931&n=0&f=JPEG&fmt=auto?sec=1737651600&t=5239488b433e92996f884b51195f003f"
              alt=""
              class="!w-30 !h-30 rounded-full object-fill border-1 border-solid border-[#fff]"
              :style="{ marginLeft: `-${index * (30 * 0.2)}px` }"
            />
            <view class="text-[#383838] text-sm font-medium ml-11">记分人数10万+</view>
          </view>
          <view
            class="bg-[#000000] w-111 h-37 rounded-full text-[#fff] font-medium text-sm flex justify-center items-center"
          >
            实时通知
          </view>
        </view>
        <view class="flex mt-28">
          <view class="flex-1 boxitem h-150 rounded-[32px]">
            <img
              src="static/home/kfhome.jpg "
              class="w-full h-full rounded-[32px] object-fill"
              alt=""
            />
          </view>
          <view class="flex-1 boxitem h-150 ml-21 rounded-[32px]">
            <img
              src="static/home/jrhome.jpg "
              class="w-full h-full rounded-[32px] object-fill"
              alt=""
            />
          </view>
        </view>
      </view>
      <view class="bg-[#E1F3F9] w-full h-15 mt-19 mb-27"> </view>
      <view class="text-[#000000] font-medium text-[18px] flex items-center p-15">
        <view class="w-31 h-31 usebox rounded-full"></view>
        <view class="-ml-15">如何使用</view>
      </view>
    </view>
  </kt-layout>
</template>

<style scoped>
  .homebox {
    background: linear-gradient(-145deg, rgba(227, 241, 95, 1) 10%, rgba(255, 255, 255, 1) 100%);
  }
  .boxitem {
    background: radial-gradient(
      61.94% 190.79% at 14.17910447761194% 32.574197975639045%,
      rgba(0, 0, 0, 1) 0%,
      rgba(186, 232, 139, 1) 70.5%,
      rgba(192, 235, 150, 1) 100%
    );
  }
  .usebox {
    background: linear-gradient(122.54deg, #c1f7d5 0%, #dcf8a6 100%);
  }
</style>
