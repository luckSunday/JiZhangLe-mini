<!--
* @description  按钮组件
* @fileName  kt-button
* @author chengwei
* @date 2022-11-07 10:32:09
-->
<script lang="ts">
  import type { CSSProperties, PropType } from 'vue';
  import { defineComponent } from 'vue';
  import { useRoute } from '/@/hooks/core';
  import { debounce } from 'lodash';

  export default defineComponent({
    name: 'KtButton',
    inheritAttrs: false,
    props: {
      /**
       * @description 按钮类型
       */
      type: {
        type: String as PropType<'default' | 'primary' | 'text' | 'link'>,
        default: 'default',
      },
      /**
       * @description 按钮大小
       */
      size: {
        type: String as PropType<'default' | 'large' | 'middle' | 'small' | 'mini'>,
        default: 'default',
      },
      /**
       * @description 按钮形状
       */
      shape: {
        type: String as PropType<'round' | 'circle'>,
        default: 'round',
      },
      /**
       * @description 将按钮宽度调整为其父宽度的选项
       */
      block: {
        type: Boolean,
        default: false,
      },
      /**
       * @description 设置危险状态,将按钮设置为红色
       */
      danger: {
        type: Boolean,
        default: false,
      },
      /**
       * @description 设置禁用状态
       */
      disabled: {
        type: Boolean,
        default: false,
      },
      /**
       * @description 幽灵属性，使按钮背景透明
       */
      ghost: {
        type: Boolean,
        default: false,
      },
      /**
       * @description 点击跳转的地址
       */
      href: {
        type: String,
      },
      customStyle: {
        type: [String, Object] as PropType<CSSProperties | string>,
        default: '',
      },
      /** 防抖函数间隔时间 */
      debounce: {
        type: Number,
        default: 300,
      },
    },
    emits: {
      click: (_event) => true,
    },
    setup(props, { emit }) {
      const onClick = debounce(
        function (e) {
          if (props.href) {
            useRoute(props.href);
          }
          emit('click', e);
        },
        props.debounce,
        { leading: true, trailing: false },
      );
      return { onClick };
    },
  });
</script>

<template>
  <button
    class="button-default"
    :class="{
      'button-primary': type === 'primary',
      'button-text': type === 'text',
      'button-link': type === 'link',
      'button-size-large': size === 'large',
      'button-size-middle': size === 'middle',
      'button-size-small': size === 'small',
      'button-size-mini': size === 'mini',
      '!rounded-full': shape === 'circle',
      'fill-available !flex': block,
      '!text-danger': danger && ['text', 'link', 'default'].includes(type),
      '!text-primary': ghost && ['primary'].includes(type),
      '!bg-danger': danger && ['primary'].includes(type),
      '!border-danger': danger && ['primary', 'default'].includes(type),
      '!bg-transparent': ghost || ['text', 'link'].includes(type),
      'pointer-events-none !opacity-80': disabled,
    }"
    :style="customStyle"
    @click="onClick"
  >
    <slot></slot>
  </button>
</template>

<style>
  .fill-available {
    width: -webkit-fill-available;
  }
</style>
