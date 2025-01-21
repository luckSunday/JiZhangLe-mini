export enum SaleTypeEnum {
  /** 秒杀 */
  FlashKilling = 1,
  /** 优惠 */
  Preferential,
}

export enum LessonType {
  /** 视频课程 */
  video = 1,
  /** 音频课程 */
  audio,
  /** 图文课程 */
  rich,
  /** 练习 */
  drill,
  /** 考试 */
  exam,
  /** 图片课程 */
  image,
  /** 问答课程 */
  question,
  /** 直播课程 */
  livebroadcast,
  /** 语音跟读 */
  voice,
}

export enum defaultRolePhoto {
  /** 小程序用户 */
  user = 'https://ttmini.yizhiwechat.com/advisory/roleDefaultPhoto/user-default.png',
  /** 律师 */
  consultant = 'https://ttmini.yizhiwechat.com/advisory/roleDefaultPhoto/lawyer-default.png',
  /** 客服 */
  customer = 'https://ttmini.yizhiwechat.com/advisory/roleDefaultPhoto/kefu-default.png',
}
