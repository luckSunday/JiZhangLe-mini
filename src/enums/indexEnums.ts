/**
 * 任务类型
 */
export enum taskTypeEnum {
  /** 短剧 */
  shortPlay = 1,
  /** 小测试 */
  mini = 2,
  /** 小说 */
  novel = 3,
  /** 课程分销 */
  class = 4,
}
/**
 * 平台类型
 */
export enum platformEnum {
  /** 抖音 */
  dy = 1,
  /** 快手 */
  ks,
  /** 微信 */
  wx,
}
/**
 * 搜索页tab栏类型
 */
export enum searchTabEnum {
  /** 综合 */
  result = 0,
  /** 变现 */
  realization = 1,
  /** 爆款案例 */
  hotCase = 2,
}
/**
 * 榜单类型
 */
export enum theChartsEnum {
  /** 高转化榜单 */
  overallList = 0,
  /** 潜力好剧 */
  newList = 1,
}

/**
 * 剧集列表排序
 */
export enum sortEnum {
  /** 综合 */
  result = 1,
  /** 上架时间 */
  new,
  /** 收益最高 */
  tall,
  /** 最多投稿 */
  max,
}
/**
 * 新手破冰进度
 */
export enum NewbieTaskEnum {
  /** 绑定推广号 */
  p1 = 0,
  /** 发布视频任务完成推广 */
  p2,
  /** 查看任务收益数据 */
  p3,
  /** 邀请好友升级收益 */
  p4,
  /** 赚取第一笔金 */
  p5,
}
