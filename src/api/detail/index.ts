import request from '../../utils/request';

import type { getCommentDetailRes } from './model';

/**
 * @description 获取默认配置信息
 */
export function getJson() {
  return request.get('/test/getJsonX');
}

/**
 * @description H5支付获取验证码
 *  @param {string} curriculum_id 课程id
 * @returns
 */
export function getPhoneValidateCode(params: { phone: string }) {
  return request.get<any, getCommentDetailRes>('/V1/Pay/getPhoneValidateCode', params);
}

// H5支付下单
export function doPayH5(params: {
  service: number;
  openid?: string;
  agent_id: number;
  spread_id: number;
  amount: number;
  order_source: string;
  app_edition: string;
  curriculum_id: number;
  phone: string;
  code: number;
  return_url?: string;
}) {
  return request.post<any, { h5_url: string; h5_content: string; order_id: string }>(
    'V1/Pay/doPayH5',
    params,
  );
}

// 新获取群聊id
export function getCurriculumGroupId(params) {
  return request.get<any, any>('/chat_group/getCurriculumGroupId', params);
}
