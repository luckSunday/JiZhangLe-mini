<script setup lang="ts">
function errorfn(err) {
  console.log(err,'客服入口报错');
  
 }
</script>

<template>
  <button open-type="im" data-im-id="280976984" @error="errorfn">
    <slot>
      <view class="flex items-center justify-between w-full h-50">
        <image
          src="https://ttmini.yizhiwechat.com/ugc/mine/customer-service.png"
          mode="scaleToFill"
          class="mr-8 w-18 h-18"
        />
        <view class="flex-1 text-[#151620] text-28 font-medium text-left">官方客服</view>
        <image
          src="https://ttmini.yizhiwechat.com/ugc/mine/right-icon.png"
          mode="scaleToFill"
          class="w-18 h-18"
        />
      </view>
    </slot>
  </button>
</template>

<style scoped></style>
