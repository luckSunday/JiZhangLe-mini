import { ref } from 'vue';
import { uploadFileToOss } from '/@/utils/upload.oss';
import dayjs from 'dayjs';

// #ifdef H5
import wxJssdk from 'weixin-js-sdk';
import { getWxJssdkConfig } from '/@/api/public';
import { useAppStoreWithOut } from '../../store/modules/app';
// #endif
import { getSetting, openSetting } from '../../utils/auth';

interface File {
  tempFilePath: string;
  duration: number;
  fileSize: number;
}
// #ifdef H5
export async function useWeixinJssdk() {
  const AppStore = useAppStoreWithOut();
  const isIOS = AppStore.getSystemInfo.platform === 'ios';

  return new Promise((resolve, reject) => {
    if (AppStore.getIsWeixinBrowser) {
      const url = isIOS ? location.href.split('#')[0] : location.href;
      console.log('shareurl', url);
      getWxJssdkConfig({ url }).then((res) => {
        const { debug, appId, timestamp, nonceStr, signature } = res;
        wxJssdk.config({
          debug, // 开启调试模式,调用的所有 api 的返回值会在客户端 alert 出来，若要查看传入的参数，可以在 pc 端打开，参数信息会通过 log 打出，仅在 pc 端时才会打印。
          appId, // 必填，公众号的唯一标识
          timestamp, // 必填，生成签名的时间戳
          nonceStr, // 必填，生成签名的随机串
          signature, // 必填，签名
          jsApiList: ['startRecord', 'stopRecord', 'translateVoice', 'onVoicePlayEnd'], // 必填，需要使用的 JS 接口列表
        });
        wxJssdk.ready(function () {
          // wxJssdk.hideAllNonBaseMenuItem();

          wxJssdk.checkJsApi({
            jsApiList: ['startRecord', 'stopRecord', 'translateVoice', 'onVoicePlayEnd'],
            success(res) {
              console.log('res', res);
            },
          });
          resolve(true);
        });
        wxJssdk.error(() => {
          reject();
        });
      });
    } else {
      reject();
    }
  });
}
// #endif

/**
 * @description 录音
 * @param {Object} opt - 基本配置
 * @param {UniNamespace.RecorderManagerStartOptions} opt.startOptions - 小程序开始录音配置
 * @param {Function} opt.onUpload - 录音后是否开始上传
 * @param {Number} opt.minSecond - 最小录音时长
 * @param {Number} opt.minSecond - 最小录音时长
 * @param {Fn} opt.onStart - 开始录音回调
 * @param {Fn} opt.onStop - 停止录音回调
 * @param {Fn} opt.onError - 异常录音回调
 * @param {Boolean} opt.required - 是否必须使用
 */
export function useVoiceRecord(opt?: {
  startOptions?: UniNamespace.RecorderManagerStartOptions;
  onUpload?: boolean;
  minSecond?: number;
  maxSecond?: number;
  onStart?: () => void;
  onStop?: (File: File) => void;
  onError?: () => void;
  required?: boolean;
}) {
  const {
    onError,
    onStart,
    onStop,
    onUpload = true,
    minSecond,
    maxSecond = 120,
    startOptions = {},
  } = opt || {};
  const file = ref<File>();
  /** 是否开启录音 */
  const isRecording = ref(false);
  /** 是否上传中 */
  const uploading = ref(false);
  /** 是否有录音权限 */
  const hasPremise = ref(false);

  // #ifdef MP-TOUTIAO
  const recorderManager = uni.getRecorderManager();
  const isCancel = ref(false);
  recorderManager.onStart(() => {
    isRecording.value = true;
    onStart?.();
  });

  recorderManager.onStop(async (val: File) => {
    isRecording.value = false;
    if (isCancel.value) {
      return;
    }
    if (minSecond && val.duration > minSecond * 1000) {
      uni.showToast({
        title: `录音时长不能${minSecond}秒`,
        icon: 'none',
      });
      return;
    }
    file.value = val;
    if (onUpload) {
      uploading.value = true;
      const tempFilePath = await uploadAudio(file.value.tempFilePath);
      uploading.value = false;
      if (!tempFilePath) {
        return;
      }
      val.tempFilePath = tempFilePath || '';
      file.value = val;
    }
    onStop?.(file.value);
  });

  recorderManager.onError((e) => {
    console.log('error', e);
    if (e.errMsg === 'operateRecorder:fail auth deny') {
      uni.showModal({
        title: '提示',
        content: `获取相关权限失败，\n请在设置页中允许相关权限使用`,
        confirmText: '打开设置',
        success({ confirm }) {
          if (confirm) {
            requirePremise();
          }
        },
      });
    } else {
      isRecording.value = false;
      onError?.();
    }
  });
  // #endif

  // #ifdef H5
  // useWeixinJssdk().then(() => {
  //   const localId = ref('');

  //   wxJssdk.onVoiceRecordEnd({
  //     complete(res) {
  //       localId.value = res.localId;
  //       wxJssdk.translateVoice({
  //         localId: '', // 需要识别的音频的本地Id，由录音相关接口获得
  //         isShowProgressTips: 1, // 默认为1，显示进度提示
  //         success(res) {
  //           console.log('translateVoice', localId.value, res);
  //         },
  //       });
  //     },
  //   });
  // });
  // #endif
  function offStop() {
    recorderManager.offStop();
  }

  function start() {
    // #ifdef MP-TOUTIAO
    recorderManager.start({
      sampleRate: 16000,
      numberOfChannels: 1,
      encodeBitRate: 25000,
      frameSize: 2,
      format: 'aac',
      duration: maxSecond * 1000,
      ...startOptions,
    });
    // #endif

    // #ifdef H5
    isRecording.value = true;
    onStart?.();
    // wxJssdk.startRecord();
    // mediaRecorder?.start();
    // #endif
  }
  /**
   * @description 取消方法
   * @param {Boolean} cancel - 是不是取消如果是不走上传
   */
  function stop(cancel = false) {
    // #ifdef MP-TOUTIAO
    recorderManager.stop();
    // #endif

    // #ifdef H5
    wxJssdk.stopRecord();
    // #endif
    isCancel.value = cancel;
  }

  function handleSoundRecording() {
    if (isRecording.value) {
      stop();
    } else {
      start();
    }
  }

  async function uploadAudio(filePath) {
    return await uploadFileToOss({
      filePath,
      path: `zixun/${dayjs().format('YYYY-MM-DD')}/audio`,
    }).catch(() => {
      uni.showModal({
        title: '提示',
        content: '录音文件上传遇到问题，请稍候再试！',
        showCancel: false,
      });
    });
  }
  function requirePremise() {
    getSetting('scope.record').then((res) => {
      if (!res && opt?.required) {
        hasPremise.value = false;
        openSetting('scope.record').then((res) => {
          if (res) {
            hasPremise.value = true;
          } else {
            hasPremise.value = false;
          }
        });
      } else {
        hasPremise.value = true;
      }
    });
  }
  return {
    isRecording,
    file,
    uploading,
    offStop,
    start,
    stop,
    handleSoundRecording,
    uploadAudio,
  };
}
