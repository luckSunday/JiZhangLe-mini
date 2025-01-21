import { onUnmounted, reactive, ref, toRefs } from 'vue';
import { uploadFileToOss } from '/@/utils/upload.oss';
import dayjs from 'dayjs';

/**
 * @description 封装音频录音功能
 */
// #ifdef H5
import wxJssdk from 'weixin-js-sdk';
// #endif
// #ifdef MP-TOUTIAO
const recorderManager = uni.getRecorderManager();
const options = {
  sampleRate: 16000,
  numberOfChannels: 1,
  encodeBitRate: 25000,
  frameSize: 2,
  format: 'aac',
};
// #endif
const isRecording = ref(false);

export function useVoiceRecord() {
  // #ifdef MP-TOUTIAO
  const initAudio = () => {
    recorderManager.onStart(() => {
      isRecording.value = true;
    });
    recorderManager.onStop((res) => {
      uploadAudio(res.tempFilePath);
      isRecording.value = false;
    });
    recorderManager.onError((e) => {
      console.log('error', e);
      isRecording.value = false;
    });
  };
  // #endif

  // #ifdef H5
  const initAudio = () => {
    wxJssdk.onVoiceRecordEnd({
      // 录音时间超过一分钟没有停止的时候会执行 complete 回调
      complete(res) {
        const localId = res.localId;
      },
    });
  };

  // #endif
  initAudio();

  const startRecord = () => {
    // #ifdef H5
    wxJssdk.startRecord({
      success(res) {
        // var localId = res.localId;
        console.log('startRecord suss', res);
      },
      complete(res) {
        console.log('completecompletecomplete ', res);
      },
      fail(fail) {
        console.log('failfailfailfail ', fail);
      },
    });
    setTimeout(function () {
      stopRecord();
    }, 10000);
    // #endif
    // #ifdef MP-TOUTIAO
    recorderManager.start(options);
    // #endif
  };
  const stopRecord = () => {
    // #ifdef H5
    wxJssdk.stopRecord({
      success(res) {
        // var localId = res.localId;
        console.log('stopRecordstopRecord', res);
      },
    });
    // #endif
    // #ifdef MP-TOUTIAO
    recorderManager.stop();
    isRecording.value = false;
    // #endif
  };
  function uploadAudio(filePath) {
    uploadFileToOss({
      filePath,
      path: `zixun/${dayjs().format('YYYY-MM-DD')}/audio`,
    }).then((res) => {});
  }
  return { startRecord, isRecording };
}
