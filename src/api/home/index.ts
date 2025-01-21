import request from '/@/utils/request';
import type { getProductListParams } from './module/params';
/**
 * @description 小程序登录，获取openid
 * @param {MiniappLoginParams} params
 * @return {MiniappLoginModel}
 */
export function getProductList(params: getProductListParams) {
  return request.get<any>('/home/productList', params);
}

/** 广告上报 */
export function recordAd(params) {
  return request.post<any, any>('/api/advert/saveWatchAdvertRecord', params);
}
