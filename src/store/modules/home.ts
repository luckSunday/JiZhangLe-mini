import { defineStore } from 'pinia';
import { taskTypeEnum } from '/@/enums/indexEnums';
import { store } from '../index';
import { HomeEnum } from '../enum/home';
import { useStorage } from '../storage';

const storage = useStorage({ key: 'HOME_STORE_' });
export interface HomeState {
  itemOrderInfo: Array<any>;
  itemTeacherInfo: Array<any>;
  itemCourseInfo: Array<any>;
  route_type_id: number | null;
  coupon_list: Array<any> | null;
  current_learn_cudId: number | null;
  isUserScreenRecording: false;
  user_id: string | null;
  type_list: Array<any> | null;
  BackgroudAudioStatus: number | null;
  is_phone: number;
  user_agent_id: number | null;
  courses_type: number;
  my_agent_id: number | null;
  my_spread_id: number | null;
  phone_num: number | null;
  ks_customer_url: '';
  my_author_id: '';
  prevStudyData: number | null;
  is_resourceActivitie: boolean; // 是否为快手的资源位 活动进入的app  默认不是
  is_searchActiviitie: boolean; // 是否为快手的搜索活动  默认不是
  is_child_agent: number; // 是不是为子代理 1是 0 不是
  superior_id: number | null; // 如果自己是子代理 这个是父级代理的id
  type_id: number; // 首页分类id
  child_types: Array<any>; // 二级分类
  platform_type: number; // 首页数据来源平台 1抖音 2 快手 3 微信
  task_type: number; // 首页数据任务类型 1短剧 2 小说
  search_history: Array<string>; // 搜索历史记录
  default_tab: Array<any>; // 平台及任务切换tab默认数据
  search_video: object | null; // 视频播放页数据
  show_data_center_team_data: boolean; // 推广数据页是否显示团队数据
  newbie_data: object | null; // 新手指南
  empowerError: number; // 授权是否失败 -1 默认 0 相册未授权 1 网络未授权
}

export const useHomeStore = defineStore({
  id: 'home',
  state: (): HomeState => ({
    itemOrderInfo: [],
    itemTeacherInfo: [],
    itemCourseInfo: [],
    route_type_id: null,
    coupon_list: null,
    current_learn_cudId: null,
    isUserScreenRecording: false,
    user_id: '',
    type_list: [],
    BackgroudAudioStatus: null,
    is_phone: 0,
    user_agent_id: null,
    courses_type: 0,
    my_agent_id: null,
    my_spread_id: null,
    phone_num: null,
    ks_customer_url: '',
    my_author_id: '',
    prevStudyData: null,
    is_resourceActivitie: false, // 是否为快手的资源位 活动进入的app  默认不是
    is_searchActiviitie: false, // 是否为快手的搜索活动  默认不是
    is_child_agent: 0, // 是不是为子代理 1是 0 不是
    superior_id: null, // 如果自己是子代理 这个是父级代理的id
    type_id: 0, // 首页分类id
    child_types: [], // 二级分类
    platform_type: 1, // 首页数据来源平台 1抖音 2 快手 3 微信
    task_type: 1, // 首页数据任务类型 1短剧 2 小说
    search_history: [], // 搜索历史记录
    default_tab: [
      {
        title: '短剧',
        text: '短剧影视',
        url: 'https://ttmini.yizhiwechat.com/creator/index/banner/index-tab-video.png',
        activeUrl: 'https://ttmini.yizhiwechat.com/creator/index/banner/index-tab-video-active.png',
        value: taskTypeEnum.shortPlay,
      },
      {
        title: '小说',
        text: '小说推文',
        url: 'https://ttmini.yizhiwechat.com/creator/index/banner/index-tab-txt.png',
        activeUrl: 'https://ttmini.yizhiwechat.com/creator/index/banner/index-tab-txt-active.png',
        value: taskTypeEnum.novel,
      },
      // {
      //   title: '小测试',
      //   text: '娱乐小测试',
      //   url: 'https://ttmini.yizhiwechat.com/creator/index/banner/index-tab-mini.png',
      //   activeUrl: 'https://ttmini.yizhiwechat.com/creator/index/banner/index-tab-mini-active.png',
      //   value: taskTypeEnum.mini,
      // },
      // {
      //   title: '课程分销',
      //   text: '课程推广',
      //   url: 'https://ttmini.yizhiwechat.com/creator/index/banner/index-tab-class.png',
      //   activeUrl: 'https://ttmini.yizhiwechat.com/creator/index/banner/index-tab-class-active.png',
      //   value: taskTypeEnum.class,
      // },
    ], // 首页任务切换tab默认数据
    // 视频播放页数据
    search_video: null,
    show_data_center_team_data: false,
    newbie_data: null,
    empowerError: -1, // 授权是否失败 -1 默认 0 相册未授权 1 网络未授权
  }),
  getters: {
    getEmpowerError(): number {
      return this.empowerError;
    },
    // 首页数据来源平台 1抖音 2 快手 3 微信
    getPlatformType(): number {
      return this.platform_type;
    },
    // 首页数据任务类型 1 短剧 2 小说
    getTaskType(): number {
      return this.task_type;
    },
    // 搜索历史记录
    getSearchHistory(): Array<string> {
      if (this.search_history.length > 0) {
        return this.search_history;
      } else {
        this.search_history = storage.getItem(HomeEnum.SEARCH_HISTORY) || [];
        return storage.getItem(HomeEnum.SEARCH_HISTORY) || [];
      }
    },
    // 首页任务切换tab默认数据
    getDefaultTab(): Array<any> {
      return this.default_tab;
    },
    // 首页任务切换tab默认数据
    getSearchVideo(): any {
      return this.search_video
        ? this.search_video
        : storage.getItem(HomeEnum.SEARCH_VIDEO) || {
            title: '',
            videoUrl: '',
            poster: '',
          };
    },
    // 新手指南
    getNewbieData(): any {
      return this.newbie_data
        ? this.newbie_data
        : storage.getItem(HomeEnum.NEWBIE_DATA) || {
            newLv2: '23188',
            newLv3: '6951',
            newLv3YOY: '31',
            day: '2024-01-15',
            month: '01',
            week: '',
          };
    },
    // 推广数据页是否显示团队数据
    getShowDataCenterTeamData(): boolean {
      return this.show_data_center_team_data;
    },
  },

  actions: {
    set_itemOrderInfo(obj) {
      this.itemOrderInfo = [obj];
    },
    set_itemTeacherInfo(arr) {
      this.itemTeacherInfo = arr;
    },
    set_itemCourseInfo(obj) {
      this.itemCourseInfo = [obj];
    },
    set_type_id(id: number) {
      this.type_id = id;
    },
    set_child_types(child_types) {
      this.child_types = child_types;
    },
    set_is_searchActiviitie(status) {
      this.is_searchActiviitie = status;
    },
    set_is_resourceActivitie(status) {
      this.is_resourceActivitie = status;
    },
    set_ks_customer_url(url) {
      this.ks_customer_url = url;
    },
    setRouteTypeID(type_id) {
      this.route_type_id = type_id;
    },
    setCouponList(list) {
      this.coupon_list = list;
    },
    setCurrentLearnCurId(curId) {
      this.current_learn_cudId = curId;
    },
    setScreenRecordMode(val) {
      this.isUserScreenRecording = val;
    },
    setUserId(user_id) {
      this.user_id = user_id;
      uni.setStorageSync('kt-user-id', user_id);
    },
    setTypeList(list) {
      this.type_list = list;
    },
    setBackgroudAudioStatus(status) {
      this.BackgroudAudioStatus = status;
    },
    set_is_phone(phone) {
      this.is_phone = phone;
    },
    set_user_agent_id(user_agent_id) {
      this.user_agent_id = user_agent_id;
    },
    set_courses_type(type) {
      this.courses_type = type;
    },
    set_my_agent({ agent_id, spread_id, author_id, is_child_agent, superior_id }) {
      this.my_agent_id = agent_id;
      this.my_spread_id = spread_id;
      this.my_author_id = author_id;
      this.is_child_agent = is_child_agent;
      if (is_child_agent === 1) {
        this.superior_id = superior_id;
      }
    },
    set_phone_num(num) {
      this.phone_num = num;
    },
    setPrevStudyData(prevStudyData) {
      this.prevStudyData = prevStudyData;
    },
    // 首页数据来源平台 1抖音 2 快手 3 微信
    setPlatformType(type) {
      this.platform_type = type;
    },
    // 首页数据任务类型
    setTaskType(type) {
      this.task_type = type;
    },
    // 添加搜索历史记录
    setSearchHistory(str) {
      const arr = this.getSearchHistory;
      const num = arr.findIndex((i) => i === str);
      if (num === -1) {
        arr.unshift(str);
      } else {
        arr.splice(num, 1);
        arr.unshift(str);
      }
      this.search_history = arr;
      storage.setItem(HomeEnum.SEARCH_HISTORY, arr);
    },
    // 删除历史记录 -1 删除所有
    delSearchHistory(index: number) {
      if (index === -1 || isNaN(index)) {
        this.search_history = [];
        storage.setItem(HomeEnum.SEARCH_HISTORY, []);
      } else {
        const arr = [...this.search_history];
        arr.splice(index, 1);
        this.search_history = arr;
        storage.setItem(HomeEnum.SEARCH_HISTORY, arr);
      }
    },
    // 首页任务切换tab默认数据
    setDefaultTab(task) {
      const ind = this.default_tab.findIndex((i) => i.value === task);
      console.log(ind, 'ind');

      const v = this.default_tab.splice(ind, 1)[0];
      console.log(v, 9999);

      this.default_tab.unshift(v);
      console.log(this.default_tab, 'this.default_tab');
    },
    // 搜索页爆款案例地址存储
    setSearchVideo(obj) {
      obj.flag = true;
      this.search_video = obj;
      storage.setItem(HomeEnum.SEARCH_VIDEO, obj);
    },
    // 推广数据页是否显示团队数据
    setShowDataCenterTeamData(flag) {
      this.show_data_center_team_data = flag;
    },
    // 新手指南
    setNewbieData(data) {
      this.newbie_data = data;
      storage.setItem(HomeEnum.NEWBIE_DATA, data);
    },
    // 相册及网络授权状态
    setEmpowerError(status) {
      this.empowerError = status;
    },
  },
});

export function useHomeStoreWithOut() {
  return useHomeStore(store);
}
