// @ts-expect-error
import { AD_ID, PlatformName } from '/@/constants';
export enum CostCode {
  /** 广告播放提前取消,不执行任何操作 */
  ad_cancel,
  /** 存在价格,执行支付逻辑 */
  pay_success,
  /** 视频播放完毕,执行跳转结果 */
  ad_success,
  /** 环境不支持广告,直接生成结果 */
  ad_nonsupport,
  /** 跳过广告，例如宿主是代理商,直接生成结果 */
  ad_skip,
  /** 宿主环境版本过低,直接生成结果 */
  version_low,
  /** 播放异常,直接下单生成结果 */
  ad_error,
  /** 超出后台设置的广告次数 */
  out_of_limit,
}
const { platform } = uni.getSystemInfoSync();

export class AdVideo {
  /** 激励广告的ID */
  ad_id: string;
  /** 是否跳过广告，例如用户是代理商 */
  skip = false;
  /** 广告实例 */
  instance?: UniNamespace.RewardedVideoAdContext;
  constructor(options: { rewarded: string }) {
    this.ad_id = options.rewarded;
  }

  /**
   * @desc 调用广告播放
   * @param skip 是否跳过广告，例如用户是代理商
   */
  play(skip = false): Promise<{ code: CostCode; msg: string }> {
    return new Promise((resolve) => {
      const errorHandler = ({ errCode }) => {
        uni.hideLoading();
        this.instance?.offError(errorHandler);
        resolve({ code: CostCode.ad_error, msg: `广告加载错误:${errCode}` });
      };
      const successHandler = ({ isEnded }) => {
        console.log('successHandler', isEnded);
        this.instance?.offClose(successHandler);
        if (isEnded) {
          resolve({ code: CostCode.ad_success, msg: '广告播放完毕!' });
        } else {
          resolve({ code: CostCode.ad_cancel, msg: '广告提前关闭!' });
        }
      };

      if (skip) {
        resolve({ code: CostCode.ad_skip, msg: '跳过广告!' });
      } else {
        uni.showLoading({
          title: '加载中...',
        });
        if (platform === 'devtools') {
          uni.hideLoading();
          resolve({
            code: CostCode.version_low,
            msg: '开发工具不支持激励广告,将直接展示结果',
          });
          return false;
        }
        // #ifdef MP-TOUTIAO
        if (tt.createRewardedVideoAd)
          this.instance = tt.createRewardedVideoAd({ adUnitId: this.ad_id });
        // #endif
        // #ifdef MP-KUAISHOU
        if (ks.createRewardedVideoAd)
          // @ts-expect-error
          this.instance = ks.createRewardedVideoAd({
            type: 100011056,
            unitId: this.ad_id,
          });
        // #endif
        // #ifdef MP-WEIXIN
        if (wx.createRewardedVideoAd)
          this.instance = wx.createRewardedVideoAd({ adUnitId: this.ad_id });
        // #endif
        if (!this.instance) {
          uni.hideLoading();
          resolve({
            code: CostCode.ad_nonsupport,
            msg: 'APP环境不支持激励广告,将直接展示结果',
          });
        } else {
          this.instance.onClose(successHandler);
          this.instance.onError(errorHandler);

          this.instance
            .show()
            .then(() => {
              uni.hideLoading();
            })
            .catch((err) => {
              console.log('广告组件出现问题', err);
              uni.hideLoading();
              // 可以手动加载一次
              this.instance!.load().then(() => {
                return this.instance!.show();
              });
            });
        }
      }
    });
  }
}

const Instance = new AdVideo(AD_ID[PlatformName]!);
export default Instance;
