<!--
* @description  公共的底部组件
* @fileName  kt-footer
* @author userName
* @date 2022-11-08 17:20:09
-->
<script lang="ts">
  import { computed, defineComponent } from 'vue';
  import { useAppStoreWithOut, useUserStoreWithOut } from '/@/store';
  import { useClipboard } from '/@/hooks/core';
  import { addUnit, getPx } from '/@/utils';
  import KtTouchShow from '../kt-touch-show/kt-touch-show.vue';
  import { props } from './props';

  // @ts-expect-error
  import { footerConfig } from '/@/constants';

  export default defineComponent({
    name: 'KtFooter',
    components: {
      KtTouchShow,
    },
    props,
    emits: {
      /**
       * @description 获取计算完成footer组件高度时的回调
       * @param {number} height header导航栏高度，单位px
       */
      loaded: (height: number) => typeof height === 'number',
    },
    setup(_, { emit }) {
      const AppStore = useAppStoreWithOut();
      const UserStore = useUserStoreWithOut();
      // import { onShow } from '@dcloudio/uni-app';

      const info = computed(() => {
        return `用户id: ${UserStore.getUserId}
手机型号：${AppStore.getSystemInfo.model}
手机品牌：${AppStore.getSystemInfo.brand}
操作系统版本：${AppStore.getSystemInfo.system}
操作系统类型：${AppStore.getSystemInfo.platform}
app版本号：${AppStore.getSystemInfo.version}
客户端基础库版本：${AppStore.getSystemInfo.SDKVersion}
场景值：${AppStore.getScene}
`;
      });

      function showInfoHander() {
        useClipboard(`${info.value}OpenID：${UserStore.getOpenid}`);
      }
      const minHeight = addUnit(footerConfig.minHeight, 'rpx');

      emit('loaded', getPx(minHeight));

      return { info, minHeight, footerConfig, showInfoHander, addUnit };
    },
  });
</script>

<template>
  <view class="flex items-center justify-center pt-12" :style="{ minHeight }">
    <KtTouchShow>
      <image
        :src="footerConfig.image"
        :style="{
          width: addUnit(footerConfig.imageWidth, 'rpx'),
          height: addUnit(footerConfig.imageHeight, 'rpx'),
        }"
        mode="aspectFit"
        class="block mx-auto"
      />
      <template #info>
        <view class="flex justify-center mb-4 text-xs text-center text-gray-500">
          <text space="nbsp">
            {{ info }}
          </text>
        </view>
      </template>
    </KtTouchShow>
  </view>
</template>

<style lang="scss"></style>
