const platformValus: { [k in PlatformNames]: PlatformType } = {
  'mp-toutiao': '1',
  'mp-kuaishou': '2',
  'mp-weixin': '3',
};

const minds: { [k in PlatformNames]: number } = {
  h5: 1,
  'mp-toutiao': 1,
  'mp-kuaishou': 20,
  'mp-weixin': 99,
  app: 1,
};

export const tid = 70;

export const PlatformName: PlatformNames = process.env.UNI_PLATFORM! as PlatformNames;

/**
 * @description min用于小程序获取openid,记录uv等场景
 */
export const mid = minds[PlatformName];

export const platform = platformValus[PlatformName];

export const IsDevelop = process.env.NODE_ENV === 'development';

export const ApiUrl = {
  development: 'https://share-folder-api-dev.yizhiweixin.com/',
  production: 'https://share-folder-api.yizhiweixin.com',
};
// #ifdef H5-DEVELOP
ApiUrl.production = 'https://share-folder-api-dev.yizhiweixin.com/';
// #endif
// #ifdef H5-PRERELEASE
ApiUrl.production = 'https://share-folder-api.yizhiweixin.com';
// #endif

export const Headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json', // 'application/json; charset=utf-8',
  // 'X-Version': `${app_name}/${app_version}`,
};
export const TokenKey = 'token';
export const AD_ID: { [k in PlatformNames]?: { rewarded: string } } = {
  'mp-toutiao': {
    /** 激励视频广告ID */
    rewarded: '9yc59dy3f2wbl9fxav',
  },
  'mp-kuaishou': {
    rewarded: '',
  },
};
/**
 * @description 项目的页脚配置，目前仅支持配置一张图片
 * @param {boolean} enable 是否全局启用页脚
 * @param {string} image 内容图片的地址
 * @param {number} minHeight 页脚的最小高度(debug打开调试前的高度，单位rpx)
 */
export const footerConfig = {
  enable: false,
  image: 'https://ttmini.yizhiwechat.com/ktts/mine/logo.png',
  imageWidth: 174,
  imageHeight: 40,
  minHeight: 150,
};
