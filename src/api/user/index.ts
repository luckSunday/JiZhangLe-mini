import request from '/@/utils/request';
import type { UserProductListParams } from './module/params';
import type { GetWithdrawRecordModule, WithdrawInfoModule } from './module/module';
/**
 * @description 获取用户收益统计
 * @return {MiniappLoginModel}
 */
export function getUserIncome() {
  return request.get<any, any>('/api/user/getUserIncome');
}
/**
 * @description 获取用户作品列表
 * @return {MiniappLoginModel}
 */
export function getUserProductList(params: UserProductListParams) {
  return request.get<any, any>('/api/user/getUserProductList', params);
}
/**
 * @description 解密手机号码
 */
export function decryptPhone(param: { encryptedData: string; iv: string }) {
  return request.post<any, any>('/common/decryptPhone', param);
}

/**
 * @description 获取一级类目
 * @return {MiniappLoginModel}
 */
export function categoryList() {
  return request.get<any, any>('/home/categoryList');
}
/**
 * @description 获取二级类目
 * @return {MiniappLoginModel}
 */
export function secondCategoryList(params: { category_id: string }) {
  return request.get<any, any>('/home/secondCategoryList', params);
}

/**
 * @description 保存主播入驻资料
 */
export function saveAnchorSettings(param: {
  phone: string;
  code: string;
  primary_category_id: string;
  seconds_category_id: string;
}) {
  return request.post<any, any>('/api/user/saveAnchorSettings', param);
}

/**
 * @description 保存用户提现信息
 */
export function saveUserWithdrawInfo(param: { alipay_name: string; alipay_account: string }) {
  return request.post<any, any>('/api/user/saveUserWithdrawInfo', param);
}

/**
 * @description 获取提现记录
 * @return {MiniappLoginModel}
 */
export function getWithdrawRecord(param) {
  return request.get<any, GetWithdrawRecordModule>('/api/user/getWithdrawRecord', param);
}

/**
 * @description 获取用户提现信息
 * @return {MiniappLoginModel}
 */
export function getWithdrawInfo() {
  return request.get<any, WithdrawInfoModule>('/api/user/getWithdrawInfo');
}

/**
 * @description 获取用户信息
 * @return {MiniappLoginModel}
 */
export function getUserInfo() {
  return request.get<any, any>('/api/user/getUserInfo');
}
/**
 * @description 保存用户头像昵称
 */
export function saveUserInfo(param) {
  return request.post<any, WithdrawInfoModule>('/login/saveUserInfo', param);
}
/**
 * @description 上报用户pv_uv记录
 */
export function saveUserPvUvRecord(param: {
  /**
   * 分类id 首页传
   */
  category_id?: string;
  /**
   * 作品id 详情传
   */
  product_id?: string;
  /**
   * 场景值 1首页 2详情
   */
  scene: string;
}) {
  return request.post<any, any>('/home/saveUserPvUvRecord', param);
}

/**
 * @description 获取浏览记录
 */
export function getBrowsingHistory(param: { page: string; page_size: string }) {
  return request.get<any, any>('/home/getBrowsingHistory', param);
}
// 提现
export function _withdrawV2(data) {
  return request.post<any, any>('/api/user/withdraw', data);
}
