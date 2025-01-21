import { defineStore } from 'pinia';
// import { getJson } from 'common/api/detail/index';
import { getTime, isEmpty } from '../../utils';
// import type { newDetailRes } from '../../api/detail/model';
import { store } from '../index';
import { useStorage } from '../storage';
import type { SaleTypeEnum } from '../enum/details';

const storage = useStorage({ key: 'DETAIL_' });
interface audioStatusTime {
  currentTime: number;
  duration: number;
}

export interface DetailState {
  payInfoArr: Array<any>;
  /** 是否为活动状态， 因为现在大部分场景都是有活动的   避免页面会闪一下  默认是有活动的状态 */
  activity: boolean;
  /** 选择优惠弹框状态 */
  selectDiscount: boolean;
  /** 记录是否点击课程详情页的按钮进入的tab我的课程 */
  is_my_curriculum: boolean;
  detail: any;
  /** 是否已购买 0 为未购买 */
  isPay: number;
  /** 支付按钮是否禁止，“已抢光” */
  avaliable: boolean;
  /** 是否为抢购阶段 **/
  isPromotionState: boolean;
  /** 是否已领取红包 */
  recivedCoupon: boolean;
  /** 详情页渲染的购买用户的来源标签 */
  bubbleTags: Array<string>;
  /** 选择的优惠券id */
  coupon_user_id: null | number;
  /**  套餐所有课程加起来的的价格 */
  package_purchase_price: number;
  /** 套餐的所有课程加起来的原价    减去上面的已经优惠的价格就是优惠价 */
  package_original_price: number;
  /** 红包和秒杀开启状态 */
  saleState: boolean;
  /** 记录每一节课的上一次学的课表id */
  curriculumLastLessonId: Record<string, string>;
  /** 记录视频课程的上一次学习时间 */
  lessonLastTime: Record<string, string>;
  audioStatusTime: audioStatusTime;
  /** 当前运行时免费的课程id */
  free_curriculum_id: number;
  /** 选取的物料的id */
  materialId: number;
  created_orderinfo: Record<string, any>;
  material_id: number;
  evaluateCourseDetail?: {
    learned_rate: number;
    curriculum_id: number;
    cover_url: string;
    title: string;
    tag: string;
  };
  /** 是否正在支付中 */
  isPaying: boolean;
  /** 快手资源位活动 */
  is_resourceActivitie: boolean;
  /**  快手搜索活动 */
  is_searchActiviitie: boolean;
  /**  套餐支付需要传选择的套餐课程 固定套餐默认选择全部 */
  packageArr: Array<number>;
  /** 用户最后观看的课程 */
  last_course: number;
  /**  倒计时结束时间 */
  countEndTime: number;
  /** 设置当前是否展示宏观包 */
  showRed: boolean;
  /** 点击红包后的弹窗 */
  showDrawer: boolean;
  /** 优惠类型 */
  saleType?: SaleTypeEnum;
  countTime: number;
  /** 是否支持新版的2.0支付 */
  is_new_pay: boolean;
  /** 支付2.0的时候需要透传的参数 */
  extraData: any;
  /** 是否展示中间的购买弹窗 */
  showSalePromat: boolean;
  /** 是否授权过，如果授权过则不弹起 */
  isShowAuth: boolean;
  /** 半屏和全屏的切换状态 true为全屏 */
  isChange: boolean;
  /** H5站外支付用的id */
  h5OrderID: string;
  on_show_status: boolean;
  /** ios上面是否可购买 默认不可购买 请求到配置文件之后进行初始化 */
  ios_can_sale: boolean;
  author: object;
  /** 推广码携带的code */
  experience_code: string;
  questionArray: Array<object>;
  grayScale: boolean;
  subscribeMessage: any;
  dyDefaultServeType: string; // 抖音小程序默认的客服类型
  coursesDetail: any;
  page_param: any;
}
/**
 * @description 用户相关的公共状态
 */
export const useDetailStore = defineStore({
  id: 'detail',
  state: (): DetailState => ({
    payInfoArr: [], // 从点击支付开始记录一个json  显示在任何失败的弹窗里面,便于排查错误  每次点击开始支付的时候赋[]
    selectDiscount: false,
    is_my_curriculum: false,
    detail: {},
    isPay: 1,
    avaliable: true,
    isPromotionState: false,
    recivedCoupon: false,
    bubbleTags: ['粉丝专享'],
    activity: true,
    coupon_user_id: null,
    package_purchase_price: 0, // 套餐所有课程加起来的的价格
    package_original_price: 0, // 套餐的所有课程加起来的原价    减去上面的已经优惠的价格就是优惠价
    saleState: false,
    curriculumLastLessonId: {},
    evaluateCourseDetail: undefined,
    audioStatusTime: {
      currentTime: 0,
      duration: 0,
    },
    free_curriculum_id: 0,
    lessonLastTime: {},
    materialId: 0,
    created_orderinfo: {},
    material_id: 0,
    isPaying: false,
    is_resourceActivitie: false,
    is_searchActiviitie: false,
    packageArr: [],
    last_course: 0,
    countEndTime: 0,
    showRed: false,
    showDrawer: false,
    saleType: undefined,
    countTime: 0,
    is_new_pay: false,
    extraData: null,
    showSalePromat: false,
    isShowAuth: false,
    isChange: false,
    h5OrderID: '',
    on_show_status: false,
    // #ifdef MP-TOUTIAO
    ios_can_sale: false, // ios上面是否可购买 默认不可购买 请求到配置文件之后进行初始化
    // #endif
    // #ifndef MP-TOUTIAO
    ios_can_sale: true, // ios上面是否可购买 默认不可购买 请求到配置文件之后进行初始化
    // #endif
    author: {},
    experience_code: '',
    questionArray: [], // 默认的问题咨询的问题列表
    grayScale: false, // 首页是否变灰
    subscribeMessage: null, // {} //快手模板消息配置id  startStudy 开始学习  applyRefund 申请退款 applyServe  申诉
    dyDefaultServeType: 'default',
    coursesDetail: {},
    page_param: {}, // 页面携带的参数
  }),
  getters: {
    getIspay(): number {
      return this.isPay;
    },
    getCurriculumLastLessonId(): Record<string, string> {
      return this.curriculumLastLessonId || storage.getItem('curriculumLastLessonId');
    },
    getEvaluateCourseDetail(): Required<DetailState>['evaluateCourseDetail'] {
      return this.evaluateCourseDetail || storage.getItem('evaluateCourseDetail') || {};
    },
    getLessonLastTime(): Record<string, string> {
      return isEmpty(this.lessonLastTime) ? storage.getItem('lessonLastTime') : this.lessonLastTime;
    },
    geth5OrderID(): string {
      return this.h5OrderID || storage.getItem('h5OrderID');
    },
  },
  actions: {
    set_payInfoArr(info) {
      this.payInfoArr.push({ ...info, time: getTime() });
    },
    set_page_param(param) {
      this.page_param = param;
    },
    setDyDefaultServeType(str) {
      this.dyDefaultServeType = str;
    },
    setQuestionArray(ques) {
      this.questionArray = ques;
    },
    setSubscribeMessage(mes) {
      this.subscribeMessage = mes;
    },
    set_experience_code(code) {
      this.experience_code = code;
    },
    setH5OrderID(id) {
      this.h5OrderID = id;
      storage.setItem('h5OrderID', id);
    },
    set_coupon_user_id(coupon_user_id) {
      this.coupon_user_id = coupon_user_id;
    },
    setPromitionState(statsus: boolean) {
      this.isPromotionState = statsus;
    },
    setPackagePurchasePrice(price) {
      this.package_purchase_price = price;
    },
    setPackageOriginalPrice(price) {
      this.package_original_price = price;
    },
    setPackageArr(arr) {
      this.packageArr = arr;
    },
    setCreatedOrderinfo(info) {
      this.created_orderinfo = info;
    },
    setIsPaying(paying: boolean) {
      this.isPaying = paying;
    },
    setMaterialId(id) {
      this.materialId = id;
    },
    setFreeCurriculum_id(curriculum_id: number) {
      this.free_curriculum_id = curriculum_id;
    },
    setAudioStatusTime(audioStatusTime) {
      this.audioStatusTime = audioStatusTime;
      console.log('this.audioStatusTime---------->', this.audioStatusTime);
    },
    setLessonLastTime(lessonLastTime) {
      this.lessonLastTime = lessonLastTime;
      storage.setItem('lessonLastTime', lessonLastTime);
    },
    setCurriculumLastLessonId(lesonIds) {
      this.curriculumLastLessonId = lesonIds;
      storage.setItem('curriculumLastLessonId', lesonIds);
    },
    setPay(pay: number) {
      this.isPay = pay;
    },
    setIsMyCurriculum(status: boolean) {
      this.is_my_curriculum = status;
    },
    setDetail(detail: any) {
      this.detail = detail;
    },
    setSelectDiscount(status: boolean) {
      this.selectDiscount = status;
    },
    setEvaluateCourseDetail(info: Required<DetailState>['evaluateCourseDetail']) {
      this.evaluateCourseDetail = info;
      storage.setItem('evaluateCourseDetail', info);
    },
    setLastCourse(course: number) {
      this.last_course = course;
    },
    setRecivedCoupon(val: boolean) {
      this.recivedCoupon = val;
    },
    setCountEndTime(time: number) {
      this.countEndTime = time;
    },
    setShowRed(val: boolean) {
      this.showRed = val;
    },
    setAvaliable(val: boolean) {
      this.avaliable = val;
    },
    setIsNewPay(val: boolean) {
      this.is_new_pay = val;
    },
    setExtraData(val: object) {
      this.extraData = val;
    },
    setShowSalePromat(val: boolean) {
      this.showSalePromat = val;
    },
    setIsShowAuth(val: boolean) {
      this.isShowAuth = val;
    },
    setIsChange(val: boolean) {
      this.isChange = val;
    },
    setOnShowStatus(val: boolean) {
      this.on_show_status = val;
    },
    setIosCanSale(val: boolean) {
      this.ios_can_sale = val;
    },
    setAuthor(val: object) {
      this.author = val;
    },
    setExperience_code(val: string) {
      this.experience_code = val;
    },
    setActivity(bool: boolean) {
      this.activity = bool;
    },
    setGrayScale(bool: boolean) {
      this.grayScale = bool;
    },
    // async updateActivity() {
    //   const res = await getJson();
    //   console.log('getJsongetJson', res);
    //   console.log('set_activityset_activity', res);
    //   this.setActivity(res.activity);
    //   this.setGrayScale(res.grayScale);
    //   // #ifdef MP-TOUTIAO
    //   if (res && res.questionArray) {
    //     this.setQuestionArray(res.questionArray.dy);
    //     this.setSubscribeMessage(res.subscribeMessage);
    //     const systemInfo = uni.getSystemInfoSync();
    //     if (
    //       systemInfo.platform === 'ios' &&
    //       (systemInfo.appName === 'Douyin' || systemInfo.hostName === 'Douyin')
    //     ) {
    //       this.setIosCanSale(res.iosCanpay);
    //       if (!res.iosCanpay) {
    //         uni.hideTabBar({
    //           animation: false,
    //         });
    //       } else {
    //         uni.showTabBar();
    //       }
    //     } else {
    //       this.setIosCanSale(true);
    //       uni.showTabBar();
    //     }
    //   }
    //   if (res && res.dyDefaultServeType) {
    //     this.setDyDefaultServeType(res.dyDefaultServeType);
    //   }
    //   // #endif
    //   // #ifdef MP-KUAISHOU
    //   this.setQuestionArray(res.questionArray.ks);
    //   // #endif
    //   // #ifdef MP-WEIXIN
    //   this.setQuestionArray(res.questionArray.wx);
    //   // #endif
    // },
  },
});

export function useDetailStoreWithOut() {
  return useDetailStore(store);
}
