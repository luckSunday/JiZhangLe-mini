import { defineStore } from 'pinia';
import log from 'video.js/dist/types/utils/log';
import { useStorage } from '../storage';
import { store } from '../index';
const storage = useStorage({ key: 'SHORT_STORE_' });
export interface shortState {
  /** 全部分类的数组元数据 */
  typeShortList: Array<any>;
  /** 全部分类当前是第几个剧 */
  typeDisplayIndex: Array<any>;
  /** 当前展示的剧 */
  displayList: Array<any>;
  originDisplayIndex: Array<any>;
  nowPLayShortResources: Array<any>;
  nowPlayShortCurrent: Array<any>;
  nowPlayShort: Array<any>;
  videoTypeCurrent: number;
  playbackRate: number;
  editShortAllCount: number;
  pageShortType: number;
  pageFontSize: object;
  ctrWeek: boolean;
  currentTime: number;
  nowTime: number;
  slideTime: number;
  showBottomDetail: boolean;
  contentHeight: number;
  maxLine: number;
  maxWidthLength: number;
  maxNum: number;
  /** 是否第一次打开短剧 */
  isOpenShort: boolean;
  /** 有没有右滑过 */
  haveMoveRight: boolean;
  bottomOpacity: number;
  /** 是否展示顶部筛选 */
  showListTopType: boolean;
}

export const useShortStore = defineStore({
  id: 'short',
  state: (): shortState => ({
    videoTypeCurrent: 1, // 当前的列表类型 1 全部 2待剪辑
    typeShortList: [[], []], // 短剧列表
    typeDisplayIndex: [0, 0], // 当前是第几个剧  里面的值只有0 1 2
    originDisplayIndex: [0, 0], // 当前是第几个剧  指的是总数据源
    displayList: [[], []],
    nowPlayShort: [{}, {}],
    nowPLayShortResources: [[], []], // 当前播放的剧的剧集
    nowPlayShortCurrent: [0, 0], // 当前播放的短剧剧集是第几集
    playbackRate: 1.0,
    editShortAllCount: 0,
    pageShortType: 1,
    pageFontSize: { size: 14, line: 20 },
    ctrWeek: false,
    currentTime: 0,
    nowTime: 0,
    slideTime: 0,
    showBottomDetail: true,
    contentHeight: 0,
    maxLine: 0,
    maxWidthLength: 0,
    maxNum: 0,
    isOpenShort: false,
    haveMoveRight: false,
    bottomOpacity: 1,
    showListTopType: false,
  }),
  getters: {
    getShowListTopType(): boolean {
      return this.showListTopType;
    },
    getBottomOpacity(): number {
      return this.bottomOpacity;
    },
    getIsFirstOpenShort(): any {
      return this.isOpenShort || storage.getItem('isOpenShort');
    },
    getMaxNum(): number {
      return this.maxWidthLength * this.maxLine;
    },
    getMaxWidthLength(): number {
      return this.maxWidthLength;
    },
    getMaxLine(): number {
      return this.maxLine;
    },
    getContentHeight(): number {
      return this.contentHeight;
    },
    getShowBottomDetail(): boolean {
      return this.showBottomDetail;
    },
    getSlideTime(): number {
      return this.slideTime;
    },
    getNowTime(): number {
      return this.nowTime;
    },
    getCurrentTime(): number {
      return this.currentTime;
    },
    getCtrWeek(): boolean {
      return this.ctrWeek;
    },
    getPageShortType(): number {
      return Number(this.pageShortType);
    },
    getEditShortAllCount(): number {
      return this.editShortAllCount;
    },
    getPlaybackRate(): number {
      return this.playbackRate === 1.0
        ? storage.getItem('playbackRate') || this.playbackRate
        : this.playbackRate;
    },
    getVideoTypeCurrent(): number {
      return this.videoTypeCurrent;
    },
    getNowPLayShortResources(): Array<any> {
      return this.nowPLayShortResources[this.videoTypeCurrent];
    },
    getNowPlayShortCurrent(): number {
      return this.nowPlayShortCurrent[this.videoTypeCurrent];
    },
    /** 获取全部分类的数组元数据 */
    getTypeShortList(): Array<any> {
      return this.typeShortList;
    },
    /** 获取全部分类当前是第几个剧 */
    getTypeDisplayIndex(): Array<any> {
      return this.typeDisplayIndex;
    },
    getDisplayList(): Array<any> {
      return this.displayList;
    },
    getOriginDisplayIndex(): Array<any> {
      return this.originDisplayIndex;
    },
    getNowPlayShort(): any {
      return this.nowPlayShort[this.videoTypeCurrent];
    },
    getPageFontSize(): object {
      return this.pageFontSize;
    },
  },

  actions: {
    setShowListTopType(status) {
      this.showListTopType = status;
    },
    setBottomOpacity(opacity) {
      this.bottomOpacity = opacity;
    },
    setIsFirstOpenShort(bool) {
      this.isOpenShort = bool;
      storage.setItem('isOpenShort', bool);
    },
    setMaxWidthLength(length) {
      this.maxWidthLength = length;
    },
    setMaxLine(line) {
      this.maxLine = line;
    },
    setContentHeight(height) {
      this.contentHeight = height;
    },
    setShowBottomDetail(status) {
      this.showBottomDetail = status;
    },
    setNowTime(number) {
      this.nowTime = number;
    },
    setSlideTime(number) {
      this.slideTime = number;
    },
    setCurrentTime(time) {
      this.currentTime = time;
    },
    /** 设置全部分类的数组元数据 */
    setTypeShortList(index, arr) {
      let carr = this.typeShortList[index];
      carr = carr.concat(arr);
      this.typeShortList[index] = carr;
    },

    setDisPlayData(typeIndex, originIndex) {
      const originList = this.typeShortList[typeIndex];
      const originListLength = originList.length; // 源数据长度
      const displayList: Array<any> = [];
      const displayIndex = this.typeDisplayIndex[typeIndex];
      displayList[displayIndex] = originList[this.originDisplayIndex[typeIndex]];
      displayList[displayIndex - 1 === -1 ? 2 : displayIndex - 1] =
        originList[originIndex - 1 === -1 ? originListLength - 1 : originIndex - 1];
      displayList[displayIndex + 1 === 3 ? 0 : displayIndex + 1] =
        originList[originIndex + 1 === originListLength ? 0 : originIndex + 1];

      this.displayList[typeIndex] = displayList;
    },
    setOriginDisplayIndex(typeIndex, originIndex) {
      this.originDisplayIndex[typeIndex] = originIndex;
    },
    /** 设置全部分类当前是第几个剧 */
    setTypeDisplayIndex(typeIndex, index) {
      this.typeDisplayIndex[typeIndex] = index;
    },
    setNowPLayShortResources(originType, arr) {
      this.nowPLayShortResources[originType] = arr;
    },
    setNowPlayShortCurrent(number) {
      this.nowPlayShortCurrent[this.videoTypeCurrent] = number;
    },
    setVideoTypeCurrent(num) {
      this.videoTypeCurrent = num;
    },
    setNowPlayShort(index, short) {
      this.nowPlayShort[index] = short;
    },
    setPlaybackRate(rate) {
      this.playbackRate = rate;
      storage.setItem('playbackRate', rate);
    },
    setEditShortAllCount(num) {
      this.editShortAllCount = num;
    },
    setPageShortType(num) {
      this.pageShortType = num;
    },
    setPageFontSize(font) {
      this.pageFontSize = font;
    },
    setCtrWeek(status) {
      this.ctrWeek = status;
    },
    resetData() {
      this.videoTypeCurrent = 1; // 当前的列表类型 1 全部 2待剪辑
      this.typeShortList = [[], []]; // 短剧列表
      this.typeDisplayIndex = [0, 0]; // 当前是第几个剧  里面的值只有0 1 2
      this.originDisplayIndex = [0, 0]; // 当前是第几个剧  指的是总数据源
      this.displayList = [[], []];
      this.nowPlayShort = [{}, {}];
      this.nowPLayShortResources = [[], []]; // 当前播放的剧的剧集
      this.nowPlayShortCurrent = [0, 0]; // 当前播放的短剧剧集是第几集
      this.editShortAllCount = 0;
      this.pageShortType = 1;
    },
    resetList(index) {
      this.typeShortList[index] = [];
      this.typeDisplayIndex[index] = 0;
      this.originDisplayIndex[index] = 0;
      this.displayList[index] = [];
      this.nowPlayShort[index] = {};
      this.nowPLayShortResources[index] = [];
      this.nowPlayShortCurrent[index] = 0;
    },
    resetRecomendList(index) {
      this.typeShortList[index] = [];
      this.typeDisplayIndex[index] = 0;
      this.originDisplayIndex[index] = 0;
      this.displayList[index] = [];
      this.nowPlayShort[index] = {};
      this.nowPLayShortResources[index] = [];
      this.nowPlayShortCurrent[index] = 0;
    },
  },
});

export function useShortStoreWithOut() {
  return useShortStore(store);
}
