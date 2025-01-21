<script lang="ts" setup>
  import { useRoute } from '/@/hooks/core/useRoute';
  // import { ref } from 'vue';
  const props = defineProps({
    list: {
      type: Array,
      default: () => [],
    },
  });
  function goVideoErr(e, item) {
    console.log('e', e);
    if (e.detail.errNo) {
      // 菜单跳转
      useRoute({
        url: '/pages/shareDetails/shareDetails',
        params: {
          product_id: item?.product_id,
        },
      });
    }
  }
  function imgLoad(item) {
    item.isShow = true;
    // console.log('itme', item);
  }
</script>

<template>
  <view class="flex flex-wrap items-center justify-between w-full px-8">
    <view v-for="item of list" :key="item.product_id" class="mt-6 overflow-hidden rounded w-177">
      <button
        open-type="navigateToVideoView"
        :data-video-id="item.dy_product_bind?.video_id"
        @navigatetovideoview="goVideoErr($event, item)"
      >
        <view style="pointer-events: none">
          <view class="w-177 h-235" :style="item.isShow ? '' : `background: ${item.bg}`">
            <image
              @load="imgLoad(item)"
              :src="item?.cover_image"
              mode="aspectFill"
              class="w-177 h-235"
            />
          </view>
          <view class="flex items-center w-full h-40 px-10 bg-white">
            <image
              mode="widthFix"
              :src="
                item?.user?.headimg_url || 'https://ttmini.yizhiwechat.com/ugc/mycontent/empty.png'
              "
              class="flex-shrink-0 w-20 h-20 mr-4 rounded-full"
            />
            <view class="text-sm h-40 mb-2 text-ellipsis leading-40 text-[#151620] font-medium">
              {{ item?.title || '暂无信息' }}
            </view>
          </view>
        </view>
      </button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
  .list-container {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 0 16rpx;
    .list {
      width: calc(50% - 8rpx);
      display: flex;
      flex-direction: column;
    }
  }
</style>
