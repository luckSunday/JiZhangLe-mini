import { useDetailStoreWithOut } from '../../store';
const detailStore = useDetailStoreWithOut();
class AudioManager {
  background: null | boolean;
  InnerAudioContext: null | UniNamespace.InnerAudioContext | UniNamespace.BackgroundAudioManager;
  constructor() {
    this.background = null;
    this.InnerAudioContext = null;
  }

  testVideo() {
    try {
      if (
        !uni.canIUse('getBackgroundAudioManager') ||
        !uni.canIUse('createInnerAudioContext') ||
        !uni.getBackgroundAudioManager() ||
        !uni.createInnerAudioContext()
      ) {
        // #ifdef MP-TOUTIAO
        uni.showModal({
          title: '错误提示',
          content: '请升级系统版本，和抖音版本',
        });
        // #endif
        // #ifdef MP-KUAISHOU
        uni.showModal({
          title: '错误提示',
          content: '请升级系统版本，和快手版本',
        });
        // #endif
      }
    } catch (error) {
      // #ifdef MP-TOUTIAO
      uni.showModal({
        title: '错误提示',
        content: '请升级系统版本，和抖音版本',
      });
      // #endif
      // #ifdef MP-KUAISHOU
      uni.showModal({
        title: '错误提示',
        content: '请升级系统版本，和快手版本',
      });
      // #endif
    }
  }

  // 初始化音频管理器
  /**
   * @param  background  控制是背景音乐模式  还是不息屏模式 默认音乐不息屏
   *  @param type 是否走销毁逻辑
   */
  initAudioManager({ background, type }) {
    this.testVideo();
    if (!background && this.InnerAudioContext && type) {
      (this.InnerAudioContext as UniNamespace.InnerAudioContext).destroy();
    }
    this.background = background;
    if (background) {
      this.InnerAudioContext = uni.getBackgroundAudioManager();
    } else {
      // #ifdef MP-TOUTIAO
      this.InnerAudioContext = uni.createInnerAudioContext();
      this.InnerAudioContext.autoplay = true;
      this.InnerAudioContext.obeyMuteSwitch = false;
      // #endif
      // #ifdef MP-KUAISHOU
      this.InnerAudioContext = ks.createInnerAudioContext();
      this.InnerAudioContext.autoplay = true;
      ks.setInnerAudioOption({
        obeyMuteSwitch: false,
      });
      // #endif
      // #ifdef H5
      this.InnerAudioContext = uni.createInnerAudioContext();
      this.InnerAudioContext.autoplay = true;
      this.InnerAudioContext.obeyMuteSwitch = false;
      // #endif
    }
    console.log('InnerAudioContextInnerAudioContext', this.InnerAudioContext);
    this.set_listen();
  }

  // 设置属性
  set_attrs(params) {
    // 这里对应的属性就是背景音乐所支持的属性，字段同官方文档
    const attrArr = ['src', 'startTime', 'singer', 'title', 'epname'];
    for (const key in params) {
      // eslint-disable-next-line no-prototype-builtins
      if (this.InnerAudioContext!.hasOwnProperty(key)) {
        if (attrArr.includes(key) && params[key]) {
          this.InnerAudioContext![key] = params[key];
        }
      }
    }
  }

  // 设置当前播放进度
  set_seek(seek) {
    this.InnerAudioContext!.seek(seek);
  }

  set_listen() {
    this.InnerAudioContext!.onTimeUpdate(() => {
      detailStore.setAudioStatusTime({
        currentTime: this.InnerAudioContext!.currentTime,
        duration: this.InnerAudioContext!.duration,
      });
    });
    this.InnerAudioContext!.onError((e) => {
      console.log('音频文件解析出错，请重新刷新页面！---------------------->', e);
      // this.$yt.alert('警告', '音频文件解析出错，请重新刷新页面！', this)
    });
  }

  get_paused() {
    return this.InnerAudioContext!.paused;
  }

  onPlay(callBack) {
    // 背景音频播放事件
    if (this.InnerAudioContext) {
      this.InnerAudioContext.onPlay(() => {
        callBack();
        // #ifndef H5
        if (!this.background) {
          // 保持屏幕常亮
          uni.setKeepScreenOn({
            keepScreenOn: true,
          });
        }
        // #endif
      });
    }
  }

  onPause(callBack) {
    // 背景音频暂停事件
    if (this.InnerAudioContext) {
      this.InnerAudioContext.onPause(() => {
        callBack();
        // #ifndef H5
        if (!this.background) {
          uni.setKeepScreenOn({
            keepScreenOn: false,
          });
        }
        // #endif
      });
    }
  }

  onStop(callBack) {
    // 背景音频停止事件
    if (this.InnerAudioContext) {
      this.InnerAudioContext.onStop(() => {
        callBack();
        // #ifndef H5
        if (!this.background) {
          uni.setKeepScreenOn({
            keepScreenOn: false,
          });
        }
        // #endif
      });
    }
  }

  play() {
    this.InnerAudioContext!.play();
  }

  pause() {
    this.InnerAudioContext!.pause();
  }

  stop() {
    this.InnerAudioContext!.stop();
    this.InnerAudioContext = null;
  }

  //   onTimeUpdate(callBack) {
  //     // 背景音频播放进度更新事件
  //     this.InnerAudioContext.onTimeUpdate(() => {
  //       callBack(
  //         this.InnerAudioContext.currentTime,
  //         this.InnerAudioContext.duration
  //       );
  //     });
  //   }
  onCanplay(callBack) {
    // 背景音频进入可以播放状态，但不保证后面可以流畅播放
    if (this.InnerAudioContext) {
      this.InnerAudioContext.onCanplay(() => {
        callBack();
      });
    }
  }

  onEnded(callBack) {
    // 背景音频自然播放结束事件
    if (this.InnerAudioContext) {
      this.InnerAudioContext.onEnded(() => {
        callBack();
      });
    }
  }
}

export default new AudioManager();
