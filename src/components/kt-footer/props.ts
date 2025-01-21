import type { ExtractPropTypes } from 'vue';
export const props = {
  /**
   * @description 是否启用调试，连续点击6次触发
   */
  debug: {
    type: Boolean,
    dafault: false,
  },
};
export type Props = ExtractPropTypes<typeof props>;
