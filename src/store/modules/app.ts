import { defineStore } from 'pinia';
import dayjs from 'dayjs';
import { store } from '../index';
import { useStorage } from '../storage';
import { isEmpty } from '/@/utils';
import type { LoginShareTemplate, getEditionModel } from '../../api/public/model';

// @ts-expect-error
import { PlatformName } from '/@/constants';
import type { extConfig } from '../../types/config';

export interface AppState {
  platformName: PlatformNames;
  systemInfo: Partial<UniNamespace.GetSystemInfoResult>;
  scene: number | string;
  hasLeftIcon: boolean;
  menuButtonBounding: UniApp.GetMenuButtonBoundingClientRectRes;
  /** 储分享信息， */
  share_info: LoginShareTemplate;
  /** 标记用户用户环境是否可以支付 */
  is_can_pay: boolean;
  /** 是否是背景音乐 */
  backgroudAudioStatus: boolean;
  edition_config: null | getEditionModel;
  role: string;
  ext_config: null | extConfig;
  mid: number;
  agent_id: number;
  group_consultant_id: number;
  consultant_id: number;
  /** 半屏和全屏的切换状态 true为全屏 */
  is_full_screen: boolean;
  /** 退款订单列表，因退款后，接口返回的的状态有延迟，无法及时更新咨询室状态 */
  refund_List: Array<number>;
  paymentVersion: string; // 支付版本
  msgCard: boolean; // 公告弹框提示
  todayTime: string; // 今天时间
  networkType: string; // 是否有网络
}

const storage = useStorage<keyof AppState>({ key: 'APP_STORE_' });

export const useAppStore = defineStore({
  id: 'app',
  state: (): AppState => ({
    platformName: PlatformName,
    systemInfo: {},
    menuButtonBounding: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      height: 0,
      width: 0,
    },
    scene: '',
    hasLeftIcon: false,
    is_can_pay: false,
    share_info: {
      desc: '',
      imageUrl: '',
      templateId: '',
      title: '',
      videoTag: '',
      hashtag_list: [],
    },
    backgroudAudioStatus: false,
    edition_config: null,
    role: '',
    ext_config: null,
    mid: 1,
    // 分享传入的id
    agent_id: 0,
    group_consultant_id: 0,
    consultant_id: 0,
    is_full_screen: false,
    // 退款的列表
    refund_List: [],
    paymentVersion: '3.0',
    msgCard: true,
    todayTime: '',
    networkType: '',
  }),
  getters: {
    getNetworkType(): string {
      return this.networkType;
    },
    getIsFullScreen(): boolean {
      return this.is_full_screen;
    },
    getAgentId(): number {
      return this.agent_id;
    },
    getGroupConsultantId(): number {
      return this.group_consultant_id;
    },
    getConsultantId(): number {
      return this.consultant_id;
    },
    getMid(): number {
      return this.mid || 1;
    },
    getExtConfig(): extConfig {
      return this.ext_config!;
    },
    getRole(): string {
      return this.role;
    },
    isIos() {
      const systemInfo = this.getSystemInfo;
      return systemInfo.platform === 'ios';
    },
    getSystemInfo(): Partial<UniNamespace.GetSystemInfoResult> {
      return isEmpty(this.systemInfo) ? storage.getItem('systemInfo') || {} : this.systemInfo;
    },
    getMenuButtonBoundingClientRect(): AppState['menuButtonBounding'] {
      return this.menuButtonBounding;
    },
    getHasLeftIcon(): boolean {
      return this.hasLeftIcon;
    },
    getScene(): number | string {
      return this.scene || storage.getItem('scene');
    },
    getShareInfo(): LoginShareTemplate {
      return this.share_info;
    },
    /** 是否微信浏览器 */
    getIsWeixinBrowser(): boolean {
      // #ifdef H5
      const ua = navigator.userAgent.toLowerCase();
      return !!/micromessenger/.test(ua);
      // #endif
      return false;
    },
    getRefundList(): Array<number> {
      return this.refund_List;
    },
    getMsgCard(): boolean {
      return this.todayTime !== dayjs().format('YYYY-MM-DD');
    },
  },
  actions: {
    setNetworkType(str) {
      this.networkType = str;
    },
    setIsMoveToRight(status) {
      this.isMoveToRight = status;
      // storage.setItem('isMoveToRight', status);
    },
    setIsOpenShort(status) {
      this.isOpenShort = status;
      storage.setItem('isOpenShort', status);
    },
    setRefundList(id) {
      this.refund_List.push(id);
    },
    setIsFullScreen(status) {
      this.is_full_screen = status;
    },
    setAgentId(agent_id) {
      this.agent_id = agent_id;
    },
    setConsultantId(consultant_id) {
      this.consultant_id = consultant_id;
    },
    setGroupConsultantId(group_consultant_id) {
      this.group_consultant_id = group_consultant_id;
    },
    setMid(mid) {
      this.mid = mid;
    },
    setExtConfig(config) {
      this.ext_config = config;
    },
    setEditionConfig(config) {
      this.edition_config = config;
    },
    setIsCanPay(is_can_pay: boolean) {
      this.is_can_pay = is_can_pay;
    },
    setShareInfo(info: LoginShareTemplate) {
      this.share_info = info;
      storage.setItem('share_info', info);
    },
    setScene(scene: number | string) {
      this.scene = scene;
      storage.setItem('scene', scene);
    },
    setSystemInfo(): void {
      uni.getSystemInfo({
        success: (systemInfo) => {
          this.systemInfo = systemInfo;
          storage.setItem('systemInfo', systemInfo);
        },
      });
    },
    setMenuButtonBoundingClientRect(
      rect?: AppState['menuButtonBounding'],
    ): AppState['menuButtonBounding'] {
      if (rect) {
        return (this.menuButtonBounding = rect);
      }
      if (this.menuButtonBounding.height) {
        return this.menuButtonBounding;
      }

      const clientRect: AppState['menuButtonBounding'] = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        width: 0,
        height: 0,
      };
      const computedRect = (
        options: AppState['menuButtonBounding'] & {
          leftIcon?: AppState['menuButtonBounding'];
        },
      ) => {
        const { statusBarHeight } = this.getSystemInfo;

        clientRect.right = (this.getSystemInfo.windowWidth || 375) - options.left + 6 || 38;
        clientRect.height = options.height || 30;
        clientRect.top = options.top || (statusBarHeight || 0) + 10;
        clientRect.bottom = 10;

        // @description 头条小程序，已经自带了左侧返回按钮
        if (options.leftIcon) {
          this.hasLeftIcon = true;
          clientRect.left = options.leftIcon.left + options.leftIcon.width + 6;
        } else {
          // #ifdef MP-TOUTIAO
          clientRect.left = 48;
          // #endif
          // #ifndef MP-TOUTIAO
          clientRect.left = clientRect.right;
          // #endif
        }
      };

      // #ifdef MP-TOUTIAO
      try {
        const { leftIcon, capsule } = tt.getCustomButtonBoundingClientRect();
        if (leftIcon?.left) {
          computedRect({
            leftIcon,
            ...capsule,
          });
        } else if (capsule) {
          computedRect(capsule);
        } else {
          throw new Error('getCustomButtonBoundingClientRect is error');
        }
      } catch (err) {
        computedRect(uni.getMenuButtonBoundingClientRect());
      }
      // #endif
      // #ifndef MP-TOUTIAO
      computedRect(uni.getMenuButtonBoundingClientRect?.() || {});
      // #endif
      this.menuButtonBounding = clientRect;
      return this.menuButtonBounding;
    },
    setMsgCard(bool?: boolean): void {
      const today = dayjs().format('YYYY-MM-DD');
      this.todayTime !== today && (this.todayTime = today);
      // 登录退出时弹窗修改为可以弹出
      if (bool) {
        this.todayTime = '';
      }
    },
  },
});

export function useAppStoreWithOut() {
  return useAppStore(store);
}
