<!--
* @description  图标组件
* @fileName  kt-icon
* @author chengwei
* @date 2022-11-07 10:35:12
-->
<script lang="ts">
  import type { PropType } from 'vue';
  import { computed, defineComponent } from 'vue';
  import { addUnit } from '/@/utils';
  import type { IconName } from './name';
  export default defineComponent({
    name: 'KtIcon',
    inheritAttrs: false,
    props: {
      name: {
        type: String as PropType<IconName>,
      },
      url: {
        type: String,
      },
      /**
       * @description 图标大小,基于字体大小，单位rpx
       */
      size: {
        type: Number,
        default: 32,
      },
      color: {
        type: String,
      },
      /** 图标宽度，默认取size，单位rpx */
      width: {
        type: Number,
      },
      /** 图标高度，默认取size，单位rpx */
      height: {
        type: Number,
      },
      /** 旋转角度 */
      rotate: {
        type: Number,
        default: 0,
      },
      /** 图标未垂直居中时调整位置使用 */
      offsetY: {
        type: Number,
        default: 0,
      },
      /** 图标水平方向需要时调整位置使用 */
      offsetX: {
        type: Number,
        default: 0,
      },
    },
    emits: {
      click: () => true,
    },
    setup(props) {
      const style = computed(() => {
        const { size, width, height, rotate, offsetX, offsetY } = props;
        return {
          fontSize: addUnit(size, 'rpx'),
          width: addUnit(width || size, 'rpx'),
          height: addUnit(height || size, 'rpx'),
          transform: `rotate(${rotate}deg) translate(${addUnit(offsetX, 'rpx')},${addUnit(
            offsetY,
            'rpx',
          )})`,
        };
      });

      return { style };
    },
  });
</script>

<template>
  <view
    class="flex items-center justify-center transition-transform"
    :style="style"
    @click="$emit('click')"
  >
    <text v-if="name" class="w-full h-full iconfont" :class="`icon-${name}`" />
    <image v-else-if="url" :src="url" class="w-full h-full" mode="aspectFit" />
  </view>
</template>

<style lang="scss">
  @font-face {
    font-family: 'iconfont'; /* Project id 3752001 */
    src: url('https://ttmini.yizhiwechat.com/advisory/iconfont/iconfont.woff2?t=1692439638692')
        format('woff2'),
      url('https://ttmini.yizhiwechat.com/advisory/iconfont/iconfont.woff?t=1692439638692')
        format('woff'),
      url('https://ttmini.yizhiwechat.com/advisory/iconfont/iconfont.ttf?t=1692439638692')
        format('truetype');
  }

  .iconfont {
    @apply flex items-center justify-center;

    font-family: 'iconfont';
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .icon-qr-code:before {
    content: '\e704';
  }

  .icon-a-013_luyin:before {
    content: '\e63a';
  }

  .icon-animal:before {
    content: '\e65c';
  }

  .icon-apps:before {
    content: '\e65d';
  }
</style>
