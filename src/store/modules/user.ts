import { defineStore } from 'pinia';
import { useAppStoreWithOut, useHomeStoreWithOut } from '/@/store';
import { roleEnum } from '/@/enums/advice';
// import type { UpAgentLevelProgressDetails } from '/@/api/myRights/model';
// import type { agent, posterItem, top_agent, withDraw } from '../../api/user/model';
import { store } from '../index';
import { useRoute } from '../../hooks/core/useRoute';
import { UserEnum } from '../enum/user';
import { useStorage } from '../storage';

const storage = useStorage({ key: 'USER_STORE_' });
export interface UserState {
  mid: string;
  openid: string;
  unionid: string;
  token: string;
  login_agent_id: number;
  /** 代理商ID ,启动链接参数享有更高优先级 */
  agent_id: number;
  /** 推广号ID ,启动链接参数享有更高优先级 */
  spread_id: number;
  /** 抖音号ID,从抖音号授权获取 */
  dy_user_id: number;
  /** 登录者自己的 agent_id */
  user_agent_id: number;
  /** 登录者自己的 spread_id */
  user_spread_id: number;
  /** 是否被禁止，接口状态码5006即被封禁用户 */
  banned: boolean;
  userInfo?: Partial<UniApp.GetUserInfoRes['userInfo']>; // 用户授权的头像昵称等信息
  /** 用户id */
  user_id: number;
  /** 用户是否授权过手机号 */
  is_phone: number;
  /** 用户的手机号 当is_phone ==1 的时候存在 */
  phone: string;
  is_child_agent: number; // 是不是为子代理 1是 0 不是
  superior_id: number; // 如果自己是子代理 这个是父级代理的id
  is_can_pay: boolean; // 用户是否支持支付
  is_new_pay: boolean; // 是否支持新版的支付
  login_phone: number; // app平台登录手机号
  // 挂载页配置的时候  删除课程是否提示
  delCurriclum: boolean;
  // 挂载页配置的时候  保存配置提示
  saveCurriclum: boolean;
  notFirstOpen: boolean;
  isAgreePrivacy: boolean;
  /** 字节广告id */
  clickid: string;
  clickidQuery: string;
  role: roleEnum;
  name: string; // 律师姓名
  consultant_id: number | undefined; // 律师id
  user_bindconsultantId: number; // 用户绑定律师id
  loginIdentity: number | null;
  ruzhu_agentInfo: {
    agent_id: number;
    avatar: string;
    nickname: string;
    type: number;
  };
  h5_bind_agentId: number;
  im_id: string;
  /** 我的邀请码 */
  user_key: string;
  /** 顶级代理商 */
  top_agent: Partial<top_agent>;
  /** 用户自己的代理商信息 */
  user_agent: Partial<agent>;
  /** 是否注册过代理商 */
  agent_exist: number;
  /** 代理商提现信息 */
  user_with_draw: Partial<withDraw>;
  /** 邀请海报上的用户二维码 */
  user_qrcode_url: string;
  /** 邀请海报数组 */
  poster: posterItem[];
  /** 海报上的key */
  key: string;
  /** 登录页是否已经弹过隐私弹窗 */
  is_show_login: boolean;
  /** 登录页是否阅读并同意隐私协议 */
  is_agree_login: boolean;
  /** 是否已经下载过app */
  is_downLoad_app: boolean;
  /** 账号封禁状态 0封禁，1正常 */
  is_initial: number;
  /** 账号封禁理由 */
  remark: string;
  /** 伪数据 */
  dataIdentification: boolean;
  /** 用户是否注册 */
  user_register: boolean;
  /** 用户是否登录 */
  user_login: boolean;
  // levelDetail: Partial<UpAgentLevelProgressDetails>;
  /** 用户是否刚升级 */
  new_up: boolean;
  /** 用户等级 */
  uesr_level: number;
  /** 钱包收益记录待确认收益提示日期 */
  uesr_frozen_money_tip_date: string;
  /** 待提现 */
  money: string;
  /** 累计收益 */
  total_income: string;
  /** 近7日收益 */
  week_income: string;
  /** 是否作者 */
  is_anchor: number;
  /** 入驻一级分类 */
  primaryCategory: {
    category_id: number;
    pay_unlock_type: Array<number>;
    pid: number;
    sort: number;
    status: number;
    title: string;
    type: number;
  } | null;
  /** 入驻二级分类 */
  secondCategory: {
    category_id: number;
    pay_unlock_type: Array<number>;
    pid: number;
    sort: number;
    status: number;
    title: string;
    type: number;
  } | null;
  /** 页面展示分类信息 */
  classification: {
    /** 页面展示一级分类Id */
    primary_category_id: string;
    /** 页面展示二级分类Id */
    seconds_category_id: string;
    /** 页面展示二级分类标题 */
    title: string;
  } | null;
  shareDetailsImageArr: Array<any>;
  imageInfoTitle: string;
}
/**
 * @description 用户相关的公共状态
 */
export const useUserStore = defineStore({
  id: 'user',
  state: (): UserState => ({
    mid: '',
    openid: '',
    unionid: '',
    token: '',
    agent_id: 0,
    login_agent_id: 0,
    spread_id: 0,
    user_agent_id: 0,
    user_spread_id: 0,
    user_bindconsultantId: 0,
    dy_user_id: 0,
    banned: false,
    userInfo: undefined,
    user_id: 0,
    is_phone: 0,
    phone: '',
    address: null,
    is_child_agent: 0,
    superior_id: 0,
    is_can_pay: true,
    is_new_pay: true,
    login_phone: 0,
    user_list: [],
    delCurriclum: false,
    saveCurriclum: false,
    notFirstOpen: false,
    isAgreePrivacy: false,
    clickid: '',
    clickidQuery: '',
    role: '',
    name: '',
    consultant_id: 0,
    ruzhu_agentInfo: {
      agent_id: -1,
      avatar: '',
      nickname: '',
      type: -1,
    },
    h5_bind_agentId: -1,
    answer_questionInfo: {
      inputValue: '',
      audioList: [],
      mediaList: [],
    },
    im_id: '',
    user_key: '',
    top_agent: {},
    user_agent: {},
    agent_exist: 0,
    user_with_draw: {},
    user_qrcode_url: '',
    poster: [],
    key: '',
    is_show_login: false,
    is_agree_login: false,
    is_downLoad_app: false,
    is_initial: 1,
    remark: '账号异常',
    dataIdentification: false,
    user_register: false,
    user_login: false,
    levelDetail: {},
    new_up: false,
    uesr_level: 1,
    uesr_frozen_money_tip_date: '',
    money: '',
    total_income: '',
    week_income: '',
    is_anchor: 0,
    primaryCategory: null,
    secondCategory: null,
    classification: null,
    shareDetailsImageArr: [],
    imageInfoTitle: '',
  }),
  getters: {
    getImageInfoTitle(): string {
      return this.imageInfoTitle;
    },
    getTotalIncome(): string {
      return this.total_income;
    },
    getWeekIncome(): string {
      return this.week_income;
    },
    getMoney(): string {
      return this.money;
    },
    /** 用户是否登录 */
    getUserLogin(): boolean {
      return !!this.getToken;
    },
    /** 用户是否注册 */
    getUserRegister(): boolean {
      return this.user_register;
    },
    /** 账号封禁理由 */
    getRemark(): string {
      return this.remark;
    },
    /** 账号封禁 */
    getIsInitial(): boolean {
      return this.is_initial === 0;
    },
    /** 从本地缓存中读取是否下载过app */
    getIsDownLoadApp(): boolean {
      return this.is_downLoad_app || storage.getItem(UserEnum.IS_DOWNLOAD_APP);
    },
    /** 从本地缓存中读取是否已经展示过登录弹窗 */
    getIsShowLogin(): boolean {
      return this.is_show_login || storage.getItem(UserEnum.IS_SHOW_LOGIN);
    },
    /** 从本地缓存中读取是否已经同意隐私协议 */
    getIsAgreeLogin(): boolean {
      return this.is_agree_login || storage.getItem(UserEnum.IS_AGREE_LOGIN);
    },
    /** 海报上的key */
    getKey(): string {
      return this.key;
    },
    /** 用户的邀请海报 */
    getPoster(): posterItem[] {
      return this.poster;
    },
    /** 代理商的提现信息 */
    getUserWithDraw(): withDraw {
      return this.user_with_draw as withDraw;
    },
    /** 用户的微信号 */
    getUserWechatId(): string {
      return this.user_agent.wechat_id! || '';
    },
    /** 是否注册为代理商 */
    getIsAgent(): boolean {
      return !!(this.agent_exist === 1);
    },
    /** 是否为顶级代理 */
    getIsCore(): boolean {
      return !!this.user_agent.is_core;
    },
    /** 获取顶级代理（团长）信息 */
    getTopAgent(): top_agent {
      return this.top_agent as top_agent;
    },
    /** 用户邀请码 */
    getUserKey(): string {
      return this.user_key;
    },
    getRole(): string {
      return this.role;
    },
    getUserAddress(): UserAddressModel['user_address'] {
      return this.address!;
    },
    getPhoneNumber(): string {
      return this.phone;
    },
    getIsPhone(): number {
      return this.is_phone;
    },
    getNotFirstOpen(): boolean {
      return this.notFirstOpen || storage.getItem('notFirstOpen');
    },
    getSaveCurriclum(): boolean {
      return this.saveCurriclum || storage.getItem('saveCurriclum');
    },
    getDelCurriclum(): boolean {
      return this.delCurriclum || storage.getItem('delCurriclum');
    },
    getUserList(): Array<userListType> {
      return this.user_list.length ? this.user_list : storage.getItem(UserEnum.USER_LIST);
    },
    getToken(): string {
      return this.token;
    },
    getOpenid(): string {
      return this.openid;
    },
    getUserId(): number {
      return this.user_id || storage.getItem(UserEnum.USER_ID);
    },
    getAgentId(): number {
      return this.agent_id;
    },
    getSpreadId(): number {
      return this.spread_id || storage.getItem(UserEnum.SPREAD_ID);
    },
    getBanned(): boolean {
      return this.banned;
    },
    getUserInfo(): Partial<UniApp.GetUserInfoRes['userInfo']> {
      return this.userInfo 
      
    },
    getDataIdentification(): boolean {
      return this.dataIdentification;
    },
    getlevelDetail() {
      return this.levelDetail;
    },
    getNewUp() {
      return this.new_up;
    },
    getUesrLevel() {
      return this.uesr_level;
    },
    getUesrFrozenMoneyTipDate(): string {
      return (
        this.uesr_frozen_money_tip_date ||
        storage.getItem(UserEnum.UESR_FROZEN_MONEY_TIP_DATE) ||
        ''
      );
    },
    getIsAnchor(): number {
      return this.is_anchor;
    },
    getPrimaryCategory(): {
      category_id: number;
      pay_unlock_type: Array<number>;
      pid: number;
      sort: number;
      status: number;
      title: string;
      type: number;
    } | null {
      return this.primaryCategory;
    },
    getSecondCategory(): {
      category_id: number;
      pay_unlock_type: Array<number>;
      pid: number;
      sort: number;
      status: number;
      title: string;
      type: number;
    } | null {
      return this.secondCategory;
    },
    getClassification(): {
      /** 页面展示一级分类Id */
      primary_category_id: string;
      /** 页面展示二级分类Id */
      seconds_category_id: string;
      /** 页面展示二级分类标题 */
      title: string;
    } | null {
      return this.classification;
    },
    getShareDetailsImageArr() {
      return this.shareDetailsImageArr;
    },
  },
  actions: {
    setImageInfoTitle(title) {
      this.imageInfoTitle = title;
    },
    setTotalIncome(total_income) {
      this.total_income = total_income;
    },
    setWeekIncome(week_income) {
      this.week_income = week_income;
    },
    setMoney(money) {
      this.money = money;
    },
    /** 用户是否登录 */
    setUserRegister(state) {
      this.user_register = state;
    },
    /** 设置账号封禁理由 */
    setRemark(reamrkInfo) {
      this.remark = reamrkInfo;
    },
    /** 设置账号封禁状态 0封禁，1正常 */
    setIsInitial(stateType) {
      this.is_initial = stateType;
    },
    setIsDownLoadApp(ststus) {
      this.is_downLoad_app = ststus;
      storage.setItem(UserEnum.IS_DOWNLOAD_APP, ststus);
    },
    /** 设置是否同意隐私协议 */
    setIsAgreeLogin(status) {
      this.is_agree_login = status;
      storage.setItem(UserEnum.IS_AGREE_LOGIN, status);
    },
    /** 设置已经弹出过登录弹窗 */
    setIsShowLogin(status) {
      this.is_show_login = status;
      storage.setItem(UserEnum.IS_SHOW_LOGIN, status);
    },
    setKey(str) {
      this.key = str;
    },
    /** 设置用户的邀请海报 */
    setPoster(poster) {
      this.poster = poster;
    },
    /** 设置用户的邀请海报上的二维码 */
    setUserQrcodeUrl(url) {
      this.user_qrcode_url = url;
    },
    /** 设置用户的提现信息 */
    setUserWithDraw(info) {
      this.user_with_draw = info;
    },
    /** 设置用户的微信号 */
    setUserWechatId(wechat_id) {
      this.user_agent.wechat_id = wechat_id;
    },
    /** 当前用户登录成功时，记录该用户是否注册过代理商 */
    setAgentExist(agent_exist) {
      this.agent_exist = agent_exist;
    },
    /** 当前用户登录成功时，记录顶级代理（团长）信息 */
    setTopAgent(agent) {
      this.top_agent = agent;
    },
    /** 用户邀请码 */
    setUserKey(key: string) {
      this.user_key = key;
    },
    set_im_id(id) {
      this.im_id = id;
    },
    set_ruzhuAgentInfo(obj) {
      this.ruzhu_agentInfo = {
        agent_id: obj.agent_id,
        type: obj.type,
        avatar: obj.agent.avatar,
        nickname: obj.agent.nickname,
      };
    },
    set_loginIdentity(role, consultant_type) {
      if (role === roleEnum.customer) {
        this.loginIdentity = 0;
      } else {
        if (consultant_type === 0) {
          this.loginIdentity = 2;
        } else {
          this.loginIdentity = 1;
        }
      }
    },
    set_role(role, consultant_type) {
      if (role === roleEnum.customer || role === roleEnum.user) {
        this.role = role;
      } else {
        if (consultant_type === 0) {
          this.role = roleEnum.normal_consultant;
        } else {
          this.role = roleEnum.consultant;
        }
      }
    },
    set_clickidQuery(query) {
      this.clickidQuery = query;
    },
    setIsAgreePrivacy(status) {
      this.isAgreePrivacy = status;
      storage.setItem('isAgreePrivacy', status);
    },
    setNotFirstOpen(status) {
      this.notFirstOpen = status;
      storage.setItem('notFirstOpen', status);
    },
    setSaveCurriclum(status) {
      this.saveCurriclum = status;
      storage.setItem('saveCurriclum', status);
    },
    setDelCurriclum(status) {
      this.delCurriclum = status;
      storage.setItem('delCurriclum', status);
    },
    setUserList(list) {
      this.user_list = list;
      storage.setItem(UserEnum.USER_LIST, list);
    },
    setLoginPhone(phone) {
      this.login_phone = phone;
      storage.setItem(UserEnum.LOGIN_PHONE, phone);
    },
    setPhone(phone) {
      this.phone = phone;
      if (phone) {
        this.is_phone = 1;
      }
    },
    setClickid(status) {
      this.clickid = status;
    },
    setToken(token: string): void {
      this.token = token;
    },
    setOpenid(openid: string): void {
      this.openid = openid;
    },
    setUserId(id: number) {
      this.user_id = id;
      storage.setItem(UserEnum.USER_ID, id);
    },
    set_consultant_id(id: number | undefined) {
      this.consultant_id = id;
    },
    set_h5_bind_agentId(id) {
      this.h5_bind_agentId = id;
    },
    setName(n) {
      this.name = n;
    },
    /**
     * @description 当前用户登录成功时，记录用户信息
     */
    setUserAgent(agent) {
      const { nickname, headimg_url, phone, is_initial, remark } = agent;
      this.user_agent = agent;
      // 设置账号封禁状态
      this.setIsInitial(is_initial);
      this.setRemark(remark);
      this.setPhone(phone);
      // this.setUserInfo({ nickName: nickname, avatarUrl: headimg_url });
    },
    setUserLoginInfo(loginModel) {
      console.log('loginModel', loginModel);
      const {
        agent,
        top_agent,
        agent_exist,
        openid,
        token,
        is_anchor,
        primary_category,
        second_category,
        nickname,
        headimg_url,
      } = loginModel;

      this.setUserInfo({
        nickName: nickname,
        avatarUrl: headimg_url,
        primaryCategoryTitle: primary_category?.title,
        secondCategoryTitle: second_category?.title,
      });
      this.setAgentExist(agent_exist);
      this.setUserAgent(agent || {});
      this.setTopAgent(top_agent);
      console.log('openid', openid);
      this.setIsAnchor(is_anchor);
      this.setPrimaryCategory(primary_category);
      this.setSecondCategory(second_category);
      this.setToken(token);
      this.setOpenid(openid);
    },
    /**
     * @description 设置收益获取者的代理信息，一般从启动小程序的query参数中获取
     */
    setAgentInfo(agent_id: number, spread_id: number) {
      this.agent_id = agent_id;
      this.spread_id = spread_id;
      storage.setItem(UserEnum.AGENT_ID, agent_id);
      storage.setItem(UserEnum.SPREAD_ID, spread_id);
    },
    setAgentId(agent_id: number) {
      this.agent_id = agent_id;
      storage.setItem(UserEnum.AGENT_ID, agent_id);
    },
    setBanned(state: boolean) {
      this.banned = state;
      if (state) {
        useRoute({
          url: '/other/bannedPage/bannedPage',
          type: 'reLaunch',
        });
      }
    },
    setUserInfo(params: {
      nickName?: string;
      avatarUrl?: string;
      primaryCategoryTitle?: string;
      secondCategoryTitle?: string;
    }) {
      const info = {
        nickName: params.nickName || this.userInfo?.nickName,
        avatarUrl: params.avatarUrl || this.userInfo?.avatarUrl,
        primaryCategoryTitle: params?.primaryCategoryTitle || this.userInfo?.primaryCategoryTitle,
        secondCategoryTitle: params?.secondCategoryTitle || this.userInfo?.secondCategoryTitle,
      };
      this.userInfo = info;
    },
    /** 登录：重新获取code并解码openid */
    async login() {
      // ...
    },
    /** 退出登录：清除所有用户相关缓存 */
    logout(callback) {
      // ...
      this.setToken('');
      this.setOpenid('');
      const appStore = useAppStoreWithOut();
      const homeStore = useHomeStoreWithOut();
      homeStore.delSearchHistory(-1);
      homeStore.setPlatformType(1);
      homeStore.setTaskType(1);
      homeStore.setDefaultTab(1);
      uni.removeStorageSync(UserEnum.TOKEN);
      uni.removeStorageSync(UserEnum.OPENID);

      appStore.setMsgCard(true);
      storage.clear();
      setTimeout(() => {
        uni.hideLoading();
        storage.clear();
        appStore.setSystemInfo();
        callback();
      }, 1000);
    },
    // 设置伪数据状态
    setdataIdentification(bool: boolean) {
      this.dataIdentification = bool;
    },
    // setLevelDetail(info: UpAgentLevelProgressDetails) {
    //   this.levelDetail = info;
    // },
    setNewUp(v) {
      this.new_up = v;
    },
    setUesrLevel(v) {
      this.uesr_level = v;
    },
    setUesrFrozenMoneyTipDate(date: string) {
      this.uesr_frozen_money_tip_date = date;
      storage.setItem(UserEnum.UESR_FROZEN_MONEY_TIP_DATE, date);
    },
    setIsAnchor(num) {
      this.is_anchor = num;
    },
    setPrimaryCategory(obj) {
      this.primaryCategory = obj;
    },
    setSecondCategory(obj) {
      this.secondCategory = obj;
    },
    setClassification(obj: {
      /** 页面展示一级分类Id */
      primary_category_id: string;
      /** 页面展示二级分类Id */
      seconds_category_id: string;
      /** 页面展示二级分类标题 */
      title: string;
    }) {
      this.classification = obj;
    },
    setShareDetailsImageArr(arr) {
      this.shareDetailsImageArr = arr;
    },
  },
});

export function useUserStoreWithOut() {
  return useUserStore(store);
}
