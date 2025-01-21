export interface BasePagingParams {
  page: number;
  page_size?: number;
}
export interface BindAgentParams {
  mid?: number;
  platform?: PlatformType;
  agent_id: number;
  openid: string;
  nickname?: string;
  avatar_url?: string;
  unionid?: string;
  dy_user_id?: number;
  author_id?: number;
}

export interface MiniappLoginParams {
  mid?: number;
  platform?: PlatformType;
  code?: string;
  test_openid?: string;
  test_user_id?: number;
  openid?: string;
  unionid?: string;
}

enum ToutiaoType {
  dy = 1,
  tt,
}

export interface UvParams {
  mid: number;
  node_id: number;
  openid: string;
  agent_id: number;
  spread_id: number;
  curriculum_id: number;
  platform?: PlatformType;
  type?: ToutiaoType;
}

export interface UserSubscribeMessageParams {
  notify_ids: number[];
  curriculum_id: number;
  agent_id: number;
  spread_id: number;
  notify_scene: 'purchase' | 'refund';
}

export interface doPayParams {
  /**总价 */
  pay_amount: number;
  /**数量 */
  pay_num: number;
  /**代理商ID */
  agent_id: number;
  /**律师ID */
  consultant_id: number;
  /**律师IDskuid */
  consultant_sku_id: number;
  /**订单号，重复支付需要传入 */
  out_trade_no?: number;
}
