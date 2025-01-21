import { onUnmounted, reactive, toRefs } from 'vue';
/**
 * @description 封装音频播放功能，暴露相应的ref类型数据便于视图响应
 */
export function useInnerAudio(
  src: string,
  config: {
    autoplay?: boolean;
    loop?: boolean;
    startTime?: number;
    playbackRate?: number;
  } = {
    autoplay: true,
  },
) {
  const state = reactive({
    /** 当前音频长度，单位：s */
    duration: 0,
    /** 当前播放位置，单位：s */
    currentTime: 0,
    /** 当前是否正在播放 */
    playing: false,
    loading: false,
  });

  const audioContext = uni.createInnerAudioContext();
  audioContext.obeyMuteSwitch = false;
  /** 设置播放地址 */
  const setSrc = (_src: string) => {
    if (_src) {
      console.log('_src', _src);

      audioContext.src = _src;
      if (config.autoplay) {
        play();
      }
    }
  };
  setSrc(src);
  audioContext.autoplay = !!config.autoplay;
  audioContext.loop = !!config.loop;

  const play = () => {
    audioContext.play();
    state.loading = true;
  };
  const pause = () => {
    audioContext.pause();
  };
  const stop = () => {
    audioContext.stop();
  };
  const destroy = () => {
    audioContext.destroy();
  };
  /** 播放进度跳转，单位 s */
  const seek = (time: number) => {
    audioContext.seek(time);
  };

  let timer: ReturnType<typeof setTimeout>;
  audioContext.onTimeUpdate(() => {
    state.currentTime = audioContext.currentTime;
    state.playing = true;
    state.loading = false;
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      state.playing = false;
    }, 300);
  });

  audioContext.onCanplay(() => {
    console.log('onCanplay');
    state.duration = audioContext?.duration;
  });

  audioContext.onError(() => {
    if (audioContext.src) {
      // uni.showModal({
      //   content: '音频暂时无法播放，请稍后再试！',
      //   showCancel: false,
      // });
    }
  });
  try {
    onUnmounted(destroy);
  } catch (e) {
    // TODO handle the exception
  }

  return { ...toRefs(state), play, pause, stop, destroy, seek, setSrc };
}
