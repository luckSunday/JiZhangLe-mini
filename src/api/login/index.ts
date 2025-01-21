import request from '/@/utils/request';
/**
 * @description 小程序登录，获取openid
 * @param {MiniappLoginParams} params
 * @return {MiniappLoginModel}
 */
export function getOpenid(params, config = {}) {
  return request.get<any>('/login/getOpenId', params, config);
}
/**
 * @description 获取验证码
 * @param {MiniappLoginParams} params
 * @return {MiniappLoginModel}
 */
export function sendSms(params) {
  return request.get<any, any>('/common/sendSms', params);
}
