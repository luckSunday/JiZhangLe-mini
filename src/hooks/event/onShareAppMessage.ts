import { onHide, onShareAppMessage as onShare, onShow } from '@dcloudio/uni-app';
import type { Ref } from 'vue';
import { computed, ref, unref, watch } from 'vue';
import { getWxJssdkConfig } from '/@/api/public';
// #ifdef H5
import wxJssdk from 'weixin-js-sdk';
// #endif
import { useAppStoreWithOut } from '../../store/modules/app';
import { useUserStoreWithOut } from '../../store/modules/user';
// import { useRecordUv } from '../core/useRecordUv';

// import { isEmpty } from '../../utils';
// import { mid } from '/@/constants';
// #ifdef H5

export async function useWeixinJssdk() {
  const AppStore = useAppStoreWithOut();
  const isIOS = AppStore.getSystemInfo.platform === 'ios';

  return new Promise((resolve, reject) => {
    if (AppStore.getIsWeixinBrowser) {
      const url = isIOS ? location.href.split('#')[0] : location.href;
      console.log('shareurl', url);
      getWxJssdkConfig({ url }).then((res) => {
        const { debug, appId, timestamp, nonceStr, signature, jsApiList } = res;
        wxJssdk.config({
          debug, // 开启调试模式,调用的所有 api 的返回值会在客户端 alert 出来，若要查看传入的参数，可以在 pc 端打开，参数信息会通过 log 打出，仅在 pc 端时才会打印。
          appId, // 必填，公众号的唯一标识
          timestamp, // 必填，生成签名的时间戳
          nonceStr, // 必填，生成签名的随机串
          signature, // 必填，签名
          jsApiList, // 必填，需要使用的 JS 接口列表
        });
        wxJssdk.ready(function () {
          // wxJssdk.hideAllNonBaseMenuItem();
          resolve(true);
        });
        wxJssdk.error(() => {
          reject();
        });
      });
    } else {
      reject();
    }
  });
}
// #endif

interface AppMessage {
  path: string;
  title: string;
  desc: string;
  templateId: string;
  imageUrl: string;
  channel?: 'video';
  extra?: any;
  success?: (res: any) => void;
}

export function onShareAppMessage(share_path: string): { path: Ref<string> };
export function onShareAppMessage(set_share_path: () => string): { path: Ref<string> };
/** 设置页面分享信息，并判断调用了UV记录和获取产品价格 */
export function onShareAppMessage(obj) {
  const AppStore = useAppStoreWithOut();
  const UserStore = useUserStoreWithOut();
  const shareInfo = computed(() => AppStore.getShareInfo);
  const path = ref('');
  // watch(
  //   () => UserStore.getOpenid,
  //   (openid) => {
  //     if (openid) {
  //       if (share_path) {
  //         if (typeof share_path === 'function') {
  //           share_path = share_path();
  //         }
  //         path.value = share_path;
  //       } else {
  //         path.value = `/pages/index/index`;
  //       }
  //     }
  //   },
  //   { immediate: true },
  // );

  /** onShareAppMessage生命周期 */
  onShare((option) => {
    const params: AppMessage = {
      path: path.value,
      ...obj,
    };

    if (option.from === 'button' /* && option.channel === "video" */) {
      params.channel = 'video';
      params.success = () => {
        // useRecordUv('shoot', unref(curriculum_id));
      };
    } else {
      // useRecordUv('share', unref(curriculum_id));
    }
    console.log('分享参数：', params);
    return params;
  });
  // #ifdef H5
  if (AppStore.getIsWeixinBrowser) {
    const pageShowCount = ref(0);
    onShow(() => {
      pageShowCount.value += 1;
    });
    watch(
      [path, pageShowCount],
      (values) => {
        if (values.every(Boolean)) {
          useWeixinJssdk().then(() => {
            const { title, imageUrl, desc } = shareInfo.value;
            const link = `${window.location.origin}/#/${path.value}`;
            wxJssdk.updateAppMessageShareData({
              title,
              desc,
              link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号 JS 安全域名一致
              imgUrl: imageUrl,
            });
            wxJssdk.updateTimelineShareData({
              title, // 分享标题
              link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号 JS 安全域名一致
              imgUrl: imageUrl,
            });
            wxJssdk.showMenuItems(['menuItem:share:appMessage', 'menuItem:share:timeline']);
            wxJssdk.hideAllNonBaseMenuItem();
          });
        }
      },
      { immediate: true },
    );
    onHide(() => {
      if (AppStore.getIsWeixinBrowser) {
        wxJssdk.ready(function () {
          wxJssdk.hideAllNonBaseMenuItem();
        });
      }
    });
  }
  // #endif

  return { path };
}
