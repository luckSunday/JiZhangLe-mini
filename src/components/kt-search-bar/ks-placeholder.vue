<!--
* @description  滚动的Placeholder文字，快手上swiper出现异常，所以有此组件
* @fileName  ks-placeholder
* @author chengwei
* @date 2022-12-12 11:42:56
-->
<script lang="ts">
  import type { PropType } from 'vue';
  import { defineComponent, ref } from 'vue';
  import { onUnload } from '@dcloudio/uni-app';
  import { isArray } from 'lodash';

  export default defineComponent({
    props: {
      list: {
        type: Array as PropType<string[]>,
        default: () => [],
      },
    },
    setup(props) {
      const current = ref(0);
      const animate = ref(true);

      const timer = setInterval(() => {
        const values = props.list;
        if (isArray(values) && values.length > 1) {
          animate.value = true;
          current.value++;
          if (current.value >= values.length) {
            setTimeout(() => {
              current.value = 0;
              animate.value = false;
            }, 500);
          }
        }
      }, 2500);

      onUnload(() => {
        try {
          clearInterval(timer);
        } catch (_) {}
      });
      return { current, animate };
    },
  });
</script>

<template>
  <view class="h-20 w-full flex-1 overflow-hidden">
    <view
      class="flex flex-col"
      :class="{ 'transition-transform': animate }"
      :style="{ transform: `translate3d(0,-${40 * current}rpx,0)` }"
    >
      <view
        v-for="(str, index) in list"
        :key="index"
        class="h-20 flex-shrink-0 pl-10 text-2xs text-gray-400 text-ellipsis"
      >
        {{ str }}
      </view>
      <view class="h-20 flex-shrink-0 pl-10 text-2xs text-gray-400 text-ellipsis">
        {{ list[0] }}
      </view>
    </view>
  </view>
</template>
