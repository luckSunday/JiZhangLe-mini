import type { AjaxRequestConfig } from 'uni-ajax';
import request from '../../utils/request';
import type {
  BindAgentParams,
  MiniappLoginParams,
  UserSubscribeMessageParams,
  UvParams,
  doPayParams,
} from './param';
import type {
  KsSubscribeMessageModel,
  MiniappLoginModel,
  OssSignModel,
  WeixinJssdkConfig,
  getEditionModel,
  FaceInfoModel,
  userConsultDetailModel,
  orderConsultRecord,
  doPayModel,
} from './model';

/**
 * @description 小程序登录，获取openid
 * @param {MiniappLoginParams} params
 * @return {MiniappLoginModel}
 */
export function getOpenid(params: MiniappLoginParams, config: AjaxRequestConfig = {}) {
  return request.get<any, MiniappLoginModel>('/login/getOpenId', params, config);
}
/**
 * @description 图片安全检测V2
 */
export function imageAntiDirt(params) {
  return request.post<any, any>('/common/imageAntiDirt', params);
}

/**
 * @description 绑定代理商
 * @param {BindAgentParams} params
 * @return {number} 绑定成功的spread_id
 */
export function bindAgent(params: BindAgentParams) {
  return request.post<any, { id: number }>('/V1/Common/bindAgent', params);
}

/**
 * @description Uv数据上报
 * @return {void}
 */
export function recordUv(params: UvParams) {
  return request.post('/V1/Common/addSpreadsUv', params, {
    unintercept: true,
    hideModal: true,
  });
}

/**
 * @description 输入框词汇风险检测
 */
export function textAntidirt(params) {
  return request.post<any, any>('/V1/Common/textAntiDirt', params, {
    hideModal: true,
    unintercept: true,
  });
}

/**
 * @description 上报错误日志
 */
export function pushErrorForLogge(data) {
  return request.post<any, any>('/common/pushErrorForLogge', data, { hideModal: true });
}

/**
 * 阿里云oss签名
 * @param {string} path oss路径
 * @returns
 */
export function getAliOssToken(params) {
  return request.get<any, OssSignModel>('/agent/getOssToken', params);
}

/**
 * 腾讯云存储桶&cdn域名等信息
 */
export function getCosRegion() {
  return request.get('/V1/Common/getCosRegion', {});
}

/**
 * 腾讯云cos签名
 */
export function getCosSign() {
  return request.get('/V1/Common/tencentcloudsignature', {});
}

/**
 * @desc 获取快手订阅模板列表
 * @param params
 * @returns
 */
export function getSubscribeMessageOfKs(params: {
  notify_scene: 'purchase' | 'refund' | 'appeal';
}) {
  return request.get<any, KsSubscribeMessageModel[]>('/curriculum/message/getSceneNotifys', params);
}

// 记录用户订阅模板
export function saveUserSubscribeMessage(params: UserSubscribeMessageParams) {
  return request.post('/curriculum/message/saveUserNotify', params, { hideModal: true });
}

/**
 * @desc 获取微信JSSDK签名
 */
export function getWxJssdkConfig(params: { url: string }) {
  return request.get<any, WeixinJssdkConfig>('/wechat/getJsSdk', params);
}

/**
 * @desc app检查更新
 */
export function getEdition(params: { version_type: string; edition_number: string }) {
  return request.get<any, getEditionModel>('/login/getEdition', params);
}

/**
 * 生成视频的封面
 * @returns {golang_url}
 */
export function getVideoFirstFrame(params: { video_url: string }) {
  console.log('getVideoFirstFramegetVideoFirstFrame', params);
  return request.post<any, string>('/dy/getVideoFirstFrameDelete', params, {
    baseURL: 'https://image-to-video.yizhiweixin.com',
  });
}

/**
 * @description 生成小程序二维码
 */
export function getQrcode(params) {
  return request.get('/V1/Common/qrcode', params, { hideModal: true });
}

/**
 * @description 图片转Base64,专门用于跨域图片转码
 */
export function getImgBase64(params) {
  return request.post<any, { img_base64: string; img_base64_head: string }>(
    '/V1/Common/getImgBase64',
    params,
  );
}

/**
 * 获取人脸信息
 * @returns {golang_url}
 */
export function getFaceData(params: { img_url: string }) {
  return request.post<any, FaceInfoModel>('/player/getFaceData', params);
}
/**
 * @description V1/公共/获取代理信息
 */
export function getAgentInfo(params: { agent_id: string }) {
  return request.get<any, any>('/V1/Common/getAgentInfo', params);
}

/**
 * @description 获取咨询室内基础信息 H5
 * @return {type}
 */
export function getOrderConsultDetail(param: { consulting_id: number; role: String }) {
  return request.get<any, userConsultDetailModel>('/worker_consulting/getDetail', param);
}

/**
 * @description 获取咨询室记录 H5 和 小程序公用
 * @return {type}
 */
export function getOrderConsultRecord(
  param: {
    consulting_id: number;
    role: string;
    count: number;
    latest_record_id: number;
    newest_record_id: number;
  },
  api = 'user_consulting',
) {
  return request.get<any, Array<orderConsultRecord>>(`/${api}/getRecords`, param);
}

// 下单
export function doPay(params: doPayParams) {
  return request.post<any, doPayModel>('/pay/doPay', params);
}

/**
 * @description 检查订单支付状态
 * @return {type}
 */
export function getOrderStatus(param: { out_trade_no: string; is_test: number }) {
  return request.get<any, userConsultDetailModel>('/order/getOrderStatus', param);
}

/**
 * @description 获取虚拟手机号码
 * @return {type}
 */
export function getXPhone(param: { consulting_id: number; consultant_phone: string }) {
  return request.get<any, userConsultDetailModel>('/worker_consulting/getXPhone', param);
}

/**
 * @description 获取虚拟手机号码
 * @return {type}
 */
export function getAgentMiniAppExperienceQrcode(param) {
  return request.get<any, userConsultDetailModel>('/open/getAgentMiniAppExperienceQrcode', param);
}

/**
 * @description 解密手机号码
 */
export function decryptPhone(param: { encryptedData: string; iv: string }) {
  return request.post<any, any>('/common/decryptPhone', param);
}

/**
 * @description 清空未读消息
 */
export function clearUnreadCount(param: { consulting_id: number }) {
  return request.post<any, any>('/service_counter/clearUnreadCount', param);
}

/**
 *@description 用户删除消息
 */
export function deleteMessage(
  param: { consulting_id: number; consulting_record_id: number },
  api = 'user_consulting',
) {
  return request.post<any, any>(`/${api}/deleteMessage`, param);
}

/**
 * @description 用户撤回消息
 */
export function withdrawMessage(
  param: { consulting_id: number; consulting_record_id: number },
  api = 'user_consulting',
) {
  return request.post<any, any>(`/${api}/withdrawMessage`, param);
}

/** 
  @description 获取当前语音回放
 */
export function getRecordDetail(param: { consulting_id: number; consulting_record_id: number }) {
  return request.post<any, any>('/worker_consulting/getRecordDetail', param);
}

/**
 * @description 抖音通用交易组件签名
 */
export function getByteAuthorization(param: { data: Array<any, any> }) {
  return request.post<any, any>('/pay/getByteAuthorization', param);
}

/**
 * @description 抖音通用交易组件消费
 */
export function orderfulfilling(param: { out_trade_no: number }) {
  return request.post<any, any>('/order/orderfulfilling', param);
}

/**
 * @description 验证用户是否已经确认消费
 */
export function getOrderInfo(param: { consulting_id: number }) {
  return request.post<any, any>('/order/getOrderInfo', param);
}

/**
 * @description 上传华为云

 */
export function getOBSUploadInfo(params) {
  return request.get<any, any>('/huawei/getOBSUploadInfo',params);
}

