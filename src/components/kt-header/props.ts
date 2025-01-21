import type { ExtractPropTypes, PropType } from 'vue';
export const props = {
  title: {
    type: String,
  },
  /**
   * @description 标题文字的颜色，包含ID的文字颜色
   * @default black
   */
  color: {
    type: String as PropType<'white' | 'black'>,
    default: 'black',
  },
  /**
   * @description 导航栏背景色类型
   * @default white
   */
  type: {
    type: String as PropType<'custom' | string>,
    default: 'white',
  },
  /**
   * @description 是否不占用导航栏高度 仅使用custom背景时有效
   * @default true
   */
  shrink: {
    type: Boolean,
    default: false,
  },
  /**
   * @description 隐藏左侧Icon，主要是在抖音小程序和tabbar页面等场景使用
   */
  hideLeftIcon: {
    type: Boolean,
    // #ifdef MP-TOUTIAO
    default: true,
    // #endif
    // #ifndef MP-TOUTIAO
    // @ts-expect-error

    default: false,
    // #endif
  },
  /**
   * @description 标题文字是否居中对齐
   */
  textAlign: {
    type: String as PropType<'center' | 'left'>,
    // #ifdef MP-TOUTIAO
    default: 'left',
    // #endif
    // #ifndef MP-TOUTIAO
    // @ts-expect-error

    default: 'center',
    // #endif
  },
  /**
   * @description 是否为直播间专用头部
   */
  newTitle: {
    type: Boolean,
    default: false,
  },
  /**
   * @description 讲师姓名 newTitle == true 的时候存在
   */
  authorName: {
    type: String,
    default: '',
  },
  /**
   * @description 讲师头像 newTitle == true 的时候存在
   */
  authorAwatar: {
    type: String,
    default: '',
  },
  /**
   * @description 是否为自定义头部
   */
  customTitle: {
    type: Boolean,
    default: false,
  },
};

export type Props = ExtractPropTypes<typeof props>;
