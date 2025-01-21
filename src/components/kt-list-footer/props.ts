import type { PropType } from 'vue';

export interface ListStatus {
  loading: boolean;
  finished: boolean;
  empty?: boolean;
  error?: any;
}

export const listFooterProps = {
  status: {
    type: [String, Object] as PropType<ListStatus | keyof ListStatus>,
    default: 'loading',
  },
  emptyText: {
    type: String,
    default: '没有更多了',
  },
  emptyShowBtn: {
    type: Boolean,
  },
};

export const listFooterEmits = {
  /**
   * @description error状态下用户点击重试
   */
  retry: () => true,
};
