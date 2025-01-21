export enum roleEnum {
  /** 用户 */
  user = 'user',
  /** 咨询师 */
  consultant = 'consultant',
  /** 客服 */
  customer = 'customer',
  /** 普通咨询师 */
  normal_consultant = 'normal_consultant',
}

// 消息类型为系统时要做的事情类型
export enum operationEnum {
  /** 填写信息 */
  fill = 'fill',
  /** 完成订单 */
  confirm = 'confirm',
  /** 评价 */
  comment = 'comment',
  /** 未履约 */
  argue = 'argue',
}

// 消息发送者
export enum senderEnum {
  /** 系统 */
  system = 'system',
  /** 提醒 */
  notice = 'notice',
  /** 用户 */
  user = 'user',
  /** 咨询师 */
  consultant = 'consultant',
  /** 客服 */
  customer = 'customer',
}

// 当前咨询类型
export enum AdviceTypeEnum {
  /** 电话咨询 */
  phone = 1,
  /** 图文咨询 */
  onLine,
  /** 问答 */
  answer,
}

// 当前订单状态
export enum AdvicePhaseEnum {
  /** 待服务 */
  wait = 1,
  /** 服务中 */
  serviceIng,
  /** 已完成 */
  complete,
  /** 已退款 */
  refund,
}
// 提醒类型
export enum noticeEnum {
  /** 无 */
  none = 'none',
  /** 下单 */
  paid = 'paid',
  /** 等待 */
  wait = 'wait',
  /** 接单 */
  begin = 'begin',
  /** 完成 */
  finsh = 'finsh',
  /** 催单成功 */
  urge_order_succeed = 'urge_order_succeed',
  /** 催单冷却 */
  urge_order_failed = 'urge_order_failed',
  /** 催回复成功 */
  urge_reply_succeed = 'urge_reply_succeed',
  /** 催回复冷却 */
  urge_reply_failed = 'urge_reply_failed',
}

// 消息类型
export enum recordTypeEnum {
  /** 文本 */
  text = 'text',
  /** 图片 */
  image = 'image',
  /** 音频 */
  audio = 'audio',
  /** 未接听 */
  dial_no_answer = 'dial_no_answer',
  /** 已拒绝 */
  dial_refuse = 'dial_refuse',
  /** 已取消 */
  dial_cancel = 'dial_cancel',
  /** 咨询师挂断 */
  dial_caller_cut = 'dial_caller_cut',
  /** 用户挂断 */
  dial_callee_cut = 'dial_callee_cut',
  /** 服务超时 */
  dial_service_timeout = 'dial_service_timeout',
}

// 履约状态
export enum phaseEnum {
  /** 已关闭 */
  close,
  /** 未开始 */
  not_started,
  /** 用户填写信息 */
  fill_info,
  /** 咨询师开始 */
  consultant_start,
  /** 用户开始 */
  user_start,
  /** 咨询师完成 */
  consultant_finish,
  /** 用户完成 */
  user_finish,
  /** 用户未完成 */
  user_un_finish,
}
