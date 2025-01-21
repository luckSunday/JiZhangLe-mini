<script setup lang="ts">
  import { onHide, onLaunch, onShow } from '@dcloudio/uni-app';
  import { useAppStoreWithOut, useHomeStoreWithOut, useUserStoreWithOut } from '/@/store';
  import { aiConsole, showToast } from '/@/utils';
  import { getOpenid } from '/@/api/login';
  import { getAgentMiniAppExperienceQrcode } from '/@/api/public';
  import { onPushErrorForLogge } from '/@/hooks/event/reportErrorLogs';

  let pageOption;
  const appStore = useAppStoreWithOut();
  const userStore = useUserStoreWithOut();
  const homeStore = useHomeStoreWithOut();

  // onLaunch((option: any) => {
  //   return;
  //   let extConfig: extConfig | null = null;
  //   const ext = uni.getExtConfigSync();
  //   if (ext) {
  //     extConfig = ext.extConfig;
  //   }

  //   console.log('extConfig', extConfig, option);
  //   onPushErrorForLogge({
  //     api_url: 'uni.getExtConfigSync()',
  //     query: { option },
  //     code: '',
  //     msg: JSON.stringify({ extConfig }),
  //     route_path: 'App.vue',
  //   });
  //   appStore.setExtConfig(extConfig);
  //   if (process.env.NODE_ENV !== 'development') {
  //     aiConsole();
  //   }
  //   console.log('onLaunch', option);
  //   pageOption = option!.query;
  //   // 获取系统信息存到store
  //   appStore.setSystemInfo();
  //   appLogin();
  // });
  onShow(() => {
    // uni.getNetworkType({
    //   success(res) {
    //     if (res.networkType === 'none') {
    //       appStore.setNetworkType('none');
    //     } else {
    //       appStore.setNetworkType('yes');
    //     }
    //   },
    // });
    console.log('App Show');
  });
  onHide(() => {
    console.log('App Hide');
  });

  // async function appLogin() {
  //   const param = {
  //     code: '',
  //     mid: appStore.getExtConfig?.mid,
  //     // test_user_id: 1,
  //   };
  //   param.code = await getLoginCode();
  //   // console.log('code', await getLoginCode());
  //   // return;
  //   console.log('param', param);
  //   getOpenid(param)
  //     .then((res) => {
  //       // getAgentMiniAppExperienceQrcode({
  //       //   mid: 9,
  //       //   version:'latest',
  //       //   path:'/pages/index/index'
  //       // }).then((res)=>{
  //       //   console.log('getAgentMiniAppExperienceQrcode', res)
  //       // })
  //       console.log('getOpenid', res);
  //       userStore.setUserLoginInfo(res);
  //       onPushErrorForLogge({
  //         code: '',
  //         msg: res,
  //         query: param,
  //         api_url: '/login/getOpenId',
  //         route_path: 'App.vue',
  //       });
  //       userStore.setUserId(res.user_id);
  //       if (res?.primary_category?.category_id && res?.second_category?.category_id) {
  //         userStore.setClassification({
  //           primary_category_id: res?.primary_category?.category_id,
  //           seconds_category_id: res?.second_category?.category_id,
  //           title: res?.second_category?.title,
  //         });
  //       }
  //     })
  //     .catch((e) => {
  //       onPushErrorForLogge({
  //         code: e.code,
  //         msg: e.msg,
  //         query: param,
  //         api_url: '/login/getOpenId',
  //         route_path: 'App.vue',
  //       });
  //       console.log('getOpenidErr', e);
  //       if (Number(e.code) === 10003) {
  //         tt.showModal({
  //           title: '提示',
  //           content: '您的账号已被封禁，如有疑问请联系客服',
  //           showCancel: false,
  //         });
  //       }
  //     });
  // }
  /**
   * 封装获取login code,并自动递归重试2次
   * 返回false,则停止getOpenid接口的自动重试
   *  */
  // function getLoginCode(count = 0): Promise<string | false> {
  //   console.log('getLoginCode1');
  //   return new Promise(function (resolve) {
  //     uni.getProvider({
  //       service: 'oauth',
  //       success: (res) => {
  //         uni.login({
  //           provider: res.provider[0] as UniNamespace.LoginOptions['provider'],
  //           success: (res) => {
  //             const { code } = res;
  //             resolve(code);
  //           },
  //           fail: async (ret) => {
  //             console.log('getLoginCode fail', ret);
  //             if (count < 3) {
  //               resolve(await getLoginCode(count + 1));
  //             } else {
  //               resolve(false);
  //             }
  //           },
  //         });
  //       },
  //       fail(e) {
  //         console.log('getProvider fail', e);
  //         resolve('');
  //       },
  //     });
  //   });
  // }
</script>

<style lang="scss">
  @import './style/global.scss';
  @import 'tailwindcss/base';
  @import 'tailwindcss/utilities';

  /* 每个页面 公共css */

  /* 解决小程序和app滚动条的问题 */

  /* #ifdef MP-WEIXIN || APP-PLUS */
  ::-webkit-scrollbar {
    display: none;
    width: 0 !important;
    height: 0 !important;
    -webkit-ce: none;
    background: transparent;
    color: transparent;
  }

  /* #endif */

  /* 解决H5 的问题 */

  /* #ifdef H5 */
  uni-scroll-view .uni-scroll-view::-webkit-scrollbar {
    /* 隐藏滚动条，但依旧具备可以滚动的功能 */
    display: none;
    width: 0 !important;
    height: 0 !important;
    -webkit-ce: none;
    background: transparent;
    color: transparent;
  }

  /* #endif */</style
>./store copy
