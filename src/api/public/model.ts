export interface BasePagingModel<T> {
  current_page: number;
  data: T[];
  last_page: number;
  to: number;
  total: number;
}
export interface FaceInfoModel {
  face: {
    code: number;
    data: {
      FaceInfos: {
        FaceAttributesInfo: {
          Mask: boolean;
          Roll: number;
          Yaw: number;
        };
        X: number;
        Y: number;
      }[];
    };
  };
}
export interface HomeBannerModel {
  banner_img: string;
  jump_app_id?: any;
  miniapp_id: number;
  product_id: number;
  sort: number;
  tt_miniapp_product: {
    id: number;
    index_path: string;
    is_hot: 0 | 1;
    miniapp_id: number;
    product_id: number;
    product_info_list: {
      created_at: string;
      icon_url: string;
      id: number;
      name: string;
    };
    remark: string;
    result_path: string;
    text: string;
    type_id: number;
  };
  tt_miniapp_product_id: number;
  type: number;
}

export interface classifyModel {
  id: number;
  name: string;
  miniapp_id?: number;
  sort?: number;
}

export interface LoginAgentInfoModel {
  agent_id: number;
  dy_user_id: number;
  spread_id: number;
  superior_id: number;
  is_child_agent: number;
  author_id: number;
  login_agent_id: number;
  consultant_id: number;
}

export interface LoginShareTemplate {
  desc: string;
  imageUrl: string;
  templateId: string;
  title: string;
  hashtag_list:Array<string>;
  videoTag:string
}

export interface MiniappLoginModel {
  agent: LoginAgentInfoModel;
  openid: string;
  token: string;
  headimg_url: string;
  is_new: boolean;
  nickname: string;
  phone: string;
  is_phone: number;
  user_id: number;
  tt_share_template: LoginShareTemplate;
  off_openid: string;
  is_follower: number;
  wx_openid: string;
  role: string;
  name: string;
  consultant_type?: number;
  consultant_id?: number;
  agent_id?: number;
  im_id: string;
}

export interface OssSignModel {
  accessid: string;
  host: string;
  policy: string;
  signature: string;
  expire: number;
  dir: string;
  time: string;
  cdn_host: string;
}

export interface KsSubscribeMessageModel {
  notify_id: number;
  tpl_id: string;
  tpl_title: string;
}

export type WeixinJssdkApi =
  | 'updateAppMessageShareData'
  | 'updateTimelineShareData'
  | 'onMenuShareWeibo'
  | 'onMenuShareQZone'
  | 'hideMenuItems'
  | 'showMenuItems'
  | 'hideAllNonBaseMenuItem'
  | 'showAllNonBaseMenuItem';
export interface WeixinJssdkConfig {
  appId: string;
  debug: boolean;
  jsApiList: WeixinJssdkApi[];
  nonceStr: string;
  openTagList: string[];
  signature: string;
  timestamp: number;
}

export interface getEditionModel {
  describe: string;
  edition_force: number;
  edition_issue: number;
  edition_name: string;
  edition_number: number;
  edition_silence: number;
  edition_url: string;
  id: number;
  package_type: number;
  version_type: string;
}

export interface consultantAvatar {
  consultant_id: number;
  image_url: string;
}

export interface consultantInfo {
  city: string;
  consultant_id: number;
  consultant_info_id: number;
  educational_background: string;
  firm: string;
  firm_locations: string;
  grade: string;
  honor: string;
  id_card_back: null;
  id_card_head: null;
  introduction: string;
  licence: string;
  province: string;
  tags: string;
  term: number;
}

export interface consultantDetail {
  consultant_avatar: consultantAvatar;
  consultant_id: number;
  consultant_info: consultantInfo;
  name: string;
  openid: string;
  phone: string;
  status: number;
  type: number;
}
export interface domainDetail {
  domain_id: number;
  domain: string;
}
export interface consultingBrief {
  amount: string;
  brief: string;
  consulting_brief_id: number;
  consulting_id: number;
  district: string;
  domain_detail: domainDetail;
  domain_id: number;
}
export interface customerDetail {
  customer_id: number;
  name: string;
  openid: string;
  phone: string;
  status: number;
}
export interface userDetail {
  headimg_url: string;
  miniapp_id: number;
  nickname: string;
  openid: string;
  phone: string;
  platform: string;
  status: number;
  user_id: number;
}
export interface consultingDetail {
  axb_phone: null;
  begin_time: string;
  consultant_detail: consultantDetail;
  consultant_id: number;
  consultant_phone: null;
  consulting_brief: consultingBrief;
  consulting_id: number;
  customer_detail: customerDetail;
  customer_id: number;
  duration: number;
  finish_time: string;
  group_id: number;
  is_pay: number;
  order_id: number;
  phase: number;
  price: number;
  type: number;
  user_detail: userDetail;
  user_id: number;
  user_phone: string;
  consultant_user: consultantUser;
  remain_send_count: number;
}
export interface consultantUser {
  consultant_user_id: number;
  consulting_id: number;
  consultant_id: number;
  remark: string;
  tags: string;
}
export interface userConsultDetailModel {
  consulting_detail: consultingDetail;
}

export interface orderConsultRecord {
  consultant_id: number;
  consulting_id: number;
  consulting_record_id: number;
  created_at: string;
  customer_id: number;
  is_received: number;
  notice: string;
  operation: string;
  operation_content: string;
  receiver: string;
  sender: string;
  user_id: number;
  record_content: string;
  record_type: string;
  is_sending: Boolean;
  has_withdrawn: Number;
  withdraw_time?: number;
}

export interface payData {
  order_id: string;
  order_token: string;
  url: string;
}
export interface doPayModel {
  data: payData;
  out_trade_no: string;
}
