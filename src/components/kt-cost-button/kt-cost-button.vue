<!--
* @description  参数1
* @fileName  index
* @author userName
* @date 2022-09-08 19:01:42
-->
<script lang="ts">
  import type { PropType } from 'vue';
  import { computed, defineComponent } from 'vue';
  import { useAppStoreWithOut } from '/@/store/modules/app';
  import { useUserStoreWithOut } from '/@/store/modules/user';
  // import { useRecordUv } from '/@/hooks/core';
  import AdInstance, { CostCode } from './ad';
  import { recordAd } from '/@/api/home';
  import dayjs from 'dayjs';
  import { debounce } from 'lodash';
  // @ts-expect-error
  import { mid } from '/@/constants';
  import { onPushErrorForLogge } from '/@/hooks/event/reportErrorLogs'
  export default defineComponent({
    props: {
      // ai换脸小程序  暂时只能看广告
      aiFace: {
        type: Boolean,
        default: false,
      },
      productId: {
        type: Number,
        required: true,
      },
      /** 组件是否自动统计广告 */
      statistics: {
        type: Boolean,
        default: true,
      },
      /** 是否直接触发付费(广告||付款)逻辑,为false时通过ref调用trigger() */
      initiative: {
        type: Boolean,
        default: true,
      },
      /** 使用支付功能,并在使用时指定支付价格
       * 不传或者传0将使用默认逻辑
       *  */
      price: {
        type: [Number, String],
      },
      /**
       * 是否对代理商使用免费模式（低至1分钱）
       */
      agentIsFree: {
        type: Boolean,
        default: true,
      },
      mode: {
        default: 'ad',
        type: String as PropType<'ad' | 'pay'>,
      },
    },

    emits: {
      /** 在非自动触发逻辑下，点击按钮事件 */
      trigger: (_event) => true,
      /** @desc 付费流程成功（包含支付）
       *  @param {CostCode} code 状态码
       *  @param {number} ad_duration 广告播放时长
       *  @param {string} out_order_no 支付订单号，用于设置订单记录使用
       */
      success: (params: { code: CostCode; ad_duration?: number; out_order_no?: string }) =>
        !!params.code,
      /** 错误/取消支付或者提前中断广告 */
      cancel: (_e?: any) => true,
    },
    setup(props, { emit, expose }) {
      const AppStore = useAppStoreWithOut();
      const UserStore = useUserStoreWithOut();
      const pay_price = computed(() => {
        // ai换脸小程序  暂时只能看广告
        if (props.aiFace) {
          return 0;
        } else {
          return props.price || AppStore.getPrice(props.productId)?.price;
        }
      });
      // /** 付费模式：广告 | 付款 */
      // const mode = computed<'ad' | 'pay'>(() =>
      //   AppStore.is_can_pay && pay_price.value ? 'pay' : 'ad',
      // );
      /** 广告播放方法 */
      const onPlayAd = debounce(
        function () {
          // useRecordUv('reward', props.productId);
          // const { max_evoke_ad, overflow_evoke } = AppStore.ad_config;
          // const current_ad_count = parseInt(
          //   uni.getStorageSync(`ad_count${dayjs().format('MMDD')}`) || 0,
          // );
          // if (current_ad_count >= max_evoke_ad) {
          //   if (overflow_evoke) {
          //     emit('success', { code: CostCode.out_of_limit });
          //   } else {
          //     uni.showModal({
          //       title: '提示',
          //       content: '测试次数已达上限,请明天继续测试!',
          //       showCancel: false,
          //     });
          //   }
          // } else {
          const startTime = dayjs().unix();
          AdInstance.play(!!UserStore.user_agent_id).then(({ code }) => {
            /** 計算播放時長，判断是否有效广告 */
            const ad_duration = dayjs().unix() - startTime;
            if (code) {
              if (code === CostCode.ad_success) {
                if(props.statistics){
                  recordAd({
                    product_id: props.productId,
                    ad_time: ad_duration,
                    type: 1,
                  }).catch(e=>{
                    onPushErrorForLogge({
                      code: e.code,
                      msg: e.msg,
                      query: {
                        product_id: props.productId,
                        ad_time: ad_duration,
                        type: 1,
                        platform: 1, 
                      },
                      api_url: '/api/advert/saveWatchAdvertRecord',
                      route_path: 'kt-cost-button',
                    });
                  })
                }
                // useRecordUv('rewarded', props.productId);
                // uni.setStorageSync(`ad_count${dayjs().format('MMDD')}`, current_ad_count + 1);
              }
              emit('success', {
                code,
                ad_duration,
              });
            } else {
              emit('cancel');
            }
          });
          // }
        },
        500,
        { leading: true, trailing: false },
      );

      const checkPayStatus = ({ out_trade_no }) => {
        return new Promise((resolve, reject) => {
          function checkFn(count = 5) {
            getPayStatus({ out_trade_no })
              .then(({ status }) => {
                if (status) {
                  resolve(true);
                } else {
                  if (count) {
                    setTimeout(() => {
                      checkFn(count - 1);
                    }, 1000);
                  } else {
                    reject();
                  }
                }
              })
              .catch(() => {
                if (count) {
                  checkFn(count - 1);
                } else {
                  reject();
                }
                return Promise.reject();
              });
          }
          checkFn();
        });
      };

      /** 支付方法,目前仅支持快手 */
      const onPay = debounce(
        async function () {
          // uni.showLoading();
          const { data, out_order_no } = await doPay({
            return_url: '/pages/index/index',
            service: 5,
            openid: UserStore.getOpenid,
            agent_id: UserStore.getAgentId,
            spread_id: UserStore.getSpreadId,
            product_id: props.productId,
            miniapp_id: mid,
            amount: UserStore.user_agent_id && props.agentIsFree ? '0.01' : pay_price.value,
            // #ifdef MP-KUAISHOU
            app_edition: AppStore.getSystemInfo.host === 'KUAISHOU' ? 'ks' : 'ksjs',
            // #endif
          }).catch(console.log);
          uni.hideLoading();
          if (!data) {
            uni.showModal({
              title: '提示',
              content: '支付配置获取失败！',
              showCancel: false,
            });
            emit('cancel', '支付配置获取失败！');
            return;
          }
          let _App: any = uni;
          // #ifdef MP-KUAISHOU
          _App = ks;
          // #endif
          // #ifdef MP-TOUTIAO
          _App = tt;
          // #endif
          // #ifdef MP-WEIXIN
          _App = wx;
          // #endif
          _App.pay({
            serviceId: '1',
            orderInfo: data,
            service: 5,
            success: (res) => {
              console.log('pay sucess', res);
              if (res.errMsg === 'pay:ok') {
                uni.showLoading({ title: '支付检测中', mask: true });
                checkPayStatus({ out_trade_no: out_order_no })
                  .then(() => {
                    emit('success', { code: CostCode.pay_success, out_order_no });
                  })
                  .catch(() => {
                    uni.showModal({
                      title: '提示',
                      content: '未查询到成功支付订单，如有疑问请联系客服！',
                      showCancel: false,
                    });
                  })
                  .finally(() => {
                    uni.hideLoading();
                  });
              } else {
                emit('cancel', res);
              }
            },
            fail: (e) => {
              console.log('pay fail', e);
              emit('cancel', e);
            },
          });
        },
        500,
        { leading: true, trailing: false },
      );

      /** 分发对应的点击事件 */
      const dispatchEvent = (e) => {
        if (props.initiative) {
          if (props.mode === 'pay') {
            onPay();
          } else if (props.mode === 'ad') {
            onPlayAd();
          }
        } else {
          emit('trigger', e);
        }
      };
      /** 通过ref调用trigger(),唤起付费流程 */
      const trigger = () => (mode.value === 'pay' ? onPay() : onPlayAd());

      expose({
        trigger,
      });
      return { pay_price, onPay, onPlayAd, trigger, dispatchEvent };
    },
  });
</script>

<template>
  <view v-if="mode === 'pay'" @click="dispatchEvent">
    <slot name="pay" :price="pay_price"></slot>
  </view>
  <view v-else-if="mode === 'ad'" @click="dispatchEvent">
    <slot name="ad"></slot>
  </view>
</template>

<style lang="scss"></style>
