<!--
* @description 搜索框（输入功能可选）
* @fileName  SearchInput
* @author userName
* @date 2022-11-05 11:51:12
-->
<script lang="ts">
  import type { PropType } from 'vue';
  import { computed, defineComponent } from 'vue';
  import { addUnit } from '/@/utils';
  import { isArray } from 'lodash';
  import KtIcon from '../kt-icon/kt-icon.vue';
  // #ifdef MP-KUAISHOU
  import KsPlaceholder from './ks-placeholder.vue';
  // #endif

  export default defineComponent({
    name: 'SearchBar',
    components: {
      KtIcon,
      // #ifdef MP-KUAISHOU
      KsPlaceholder,
      // #endif
    },
    props: {
      value: {
        type: String,
      },
      /** 输入框宽度 */
      width: {
        type: Number,
        default: 694,
      },
      /** 输入框高度 */
      height: {
        type: Number,
        default: 64,
      },
      /** 组件总高度，用于启用fixed定位后占位；
       * 通过paddingTop属性调整输入框在组件内容的位置 */
      wrapHeight: {
        type: Number,
        default: 100,
      },
      /** 组件总高度，用于启用fixed定位后占位；
       * 通过paddingTop属性调整输入框在组件内容的位置 */
      wrapBackground: {
        type: String,
        default: 'white',
      },
      paddingTop: {
        type: Number,
        default: 18,
      },
      /** 是否启用fixed定位,可修改top属性调整位置 */
      fixed: {
        type: Boolean,
        default: true,
      },
      /** 使用自定义导航栏时，fixed定位的top偏移值，单位px */
      top: {
        type: Number,
        default: 0,
      },
      /** 组件功能类型，输入框还是按钮 */
      mode: {
        type: String as PropType<'input' | 'button'>,
        default: 'input',
      },
      placeholder: {
        type: [String, Array] as PropType<string | string[]>,
      },
      /** 是否自动聚焦 */
      focus: {
        type: Boolean,
        default: true,
      },
      /** 边框圆角 */
      radius: {
        type: Number,
        default: 0,
      },
      /** 背景颜色 */
      bg: {
        type: String,
        default: '',
      },
    },
    emits: {
      input: (_e) => true,
      'update:value': (value: string) => value,
      confirm: (_e) => true,
    },
    setup(props, { emit }) {
      const wrapStyle = computed(() => ({
        height: addUnit(props.wrapHeight, 'rpx'),
        paddingTop: addUnit(props.paddingTop, 'rpx'),
        background: props.wrapBackground,
        top: addUnit(props.top),
        borderRadius: addUnit(props.radius),
      }));
      console.log('wrapStyle', wrapStyle);

      const inputStyle = computed(() => ({
        height: addUnit(props.height, 'rpx'),
        width: addUnit(props.width, 'rpx'),
      }));

      const realPlaceholder = computed<any>(() => {
        if (props.mode === 'input') {
          return isArray(props.placeholder) ? props.placeholder[0] : props.placeholder;
        } else {
          return isArray(props.placeholder) ? props.placeholder : [props.placeholder || ''];
        }
      });
      function onInput(e) {
        emit(`update:value`, e.detail.value);
        emit(`input`, e);
      }
      function onClean() {
        emit(`update:value`, '');
        emit(`input`, { detail: { value: '' } });
        emit(`confirm`, { detail: { value: '' } });
      }
      return { wrapStyle, realPlaceholder, inputStyle, onInput, onClean };
    },
  });
</script>

<template>
  <view class="w-full" :style="{ height: wrapStyle.height }">
    <view class="left-0 z-30 w-full" :class="{ fixed }" :style="wrapStyle">
      <label
        class="box-border flex items-center px-8 mx-auto rounded-full"
        :class="bg ? bg : 'bg-gray-100'"
        :style="inputStyle"
        for="searchbar"
        @click="
          (e) => {
            mode === 'button' && $emit(`confirm`, e);
          }
        "
      >
        <KtIcon name="search" :size="36" class="text-gray-400" />
        <input
          v-if="mode === 'input'"
          id="searchbar"
          type="text"
          class="flex-1 w-full pl-10 text-2xs"
          :focus="focus"
          :placeholder="realPlaceholder"
          :placeholder-style="{
            color: 'rgb(156,163,175)',
            fontSize: '26rpx',
            lineHeight: '40rpx',
          }"
          :value="value"
          @input="onInput"
          @confirm="
            (e) => {
              $emit(`confirm`, e);
            }
          "
        />

        <!-- #ifndef MP-KUAISHOU -->
        <swiper
          v-else
          :indicator-dots="false"
          :autoplay="true"
          :interval="2000"
          disable-touch
          vertical
          circular
          class="flex-1 w-full h-20"
        >
          <swiper-item v-for="(str, index) in realPlaceholder" :key="index">
            <view class="pl-10 text-gray-400 text-2xs text-ellipsis">{{ str }}</view>
          </swiper-item>
        </swiper>
        <!-- #endif -->
        <!-- #ifdef MP-KUAISHOU -->
        <!-- eslint-disable-next-line vue/valid-v-else -->
        <KsPlaceholder v-else :list="realPlaceholder" />
        <!-- #endif -->

        <view v-show="value" class="flex-shrink-0 p-6" @click="onClean()">
          <KtIcon name="close-filled" :size="36" class="text-gray-400" />
        </view>
      </label>
    </view>
  </view>
</template>

<style lang="scss">
  .input-placeholder {
    @apply text-gray-400;
  }
</style>
