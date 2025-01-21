import type { PropType } from 'vue';

export const propsBase = {
  /** 启用动画 */
  animate: {
    type: Boolean,
    default: true,
  },
  /** 显示骨架 */
  visible: {
    type: Boolean,
    default: true,
  },
  /** 需要生成的骨架个数 */
  count: {
    type: Number,
    default: 1,
  },
};

export const propsCard = {
  ...propsBase,
  width: {
    type: Number,
    default: 694,
  },
  height: {
    type: Number,
    default: 260,
  },
  centerX: {
    type: Boolean,
    default: true,
  },
};

export const propsUser = {
  ...propsBase,
  width: {
    type: Number,
    default: 120,
  },
  height: {
    type: Number,
    default: 120,
  },
  avatarShape: {
    type: String as PropType<'circle' | 'square'>,
    default: 'circle',
  },
};

export const propsLine = {
  ...propsBase,
  width: {
    type: [Number, String],
    default: 'auto',
  },
  size: {
    type: String as PropType<'large' | 'middle' | 'small' | 'default' | 'mini'>,
    default: 'default',
  },
};
