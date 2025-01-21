import type { CSSProperties, PropType } from 'vue';

interface TabsItem {
  name: string;
  rect?: UniApp.NodeInfo;
}

export const TabsProps = {
  // 滑块的移动过渡时间，单位ms
  duration: {
    type: Number,
    default: 300,
  },
  // tabs标签数组
  list: {
    type: Array as PropType<TabsItem[]>,
    default: () => [],
  },
  // 滑块颜色
  lineColor: {
    type: String,
    default: '#285AFD',
  },
  // 菜单选择中时的样式
  activeStyle: {
    type: Object as PropType<CSSProperties>,
    default() {
      return {
        color: '#285AFD',
      };
    },
  },
  // 菜单非选中时的样式
  inactiveStyle: {
    type: Object as PropType<CSSProperties>,
    default() {
      return {
        color: '#C3C6CC',
      };
    },
  },
  showLine: {
    type: Boolean,
    default: true,
  },
  // 滑块长度
  lineWidth: {
    type: [String, Number],
    default: 18,
  },
  // 滑块高度
  lineHeight: {
    type: [String, Number],
    default: 3,
  },
  // 滑块背景显示大小，当滑块背景设置为图片时使用
  lineBgSize: {
    type: String,
    default: 'cover',
  },
  // 菜单item的样式
  itemStyle: {
    type: Object as PropType<CSSProperties>,
    default() {
      return {
        height: '36px',
      };
    },
  },
  // 菜单是否可滚动
  scrollable: {
    type: Boolean,
    default: true,
  },
  // 当前选中标签的索引
  current: {
    type: [Number, String],
    default: 0,
  },
  // 默认读取的键名
  keyName: {
    type: String,
    default: 'name',
  },
  wrapperStyle: {
    type: Object as PropType<CSSProperties>,
    default: () => ({}),
  },
};

export const TabsEmits = {
  click(info: TabsItem & { index: number }) {
    return info;
  },
  change(info: TabsItem & { index: number }) {
    return info;
  },
};
