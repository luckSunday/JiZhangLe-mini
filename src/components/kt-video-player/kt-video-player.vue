<!--
* @description  基于video.js的视频播放组件，目前仅供H5平台使用
* @fileName  kt-video-player
* @author chengwei
* @date 2023-02-23 10:09:02
-->
<script setup lang="ts">
  import { computed, onMounted, onUnmounted, ref, unref, watch } from 'vue';
  import VideoJs from 'video.js';
  // import 'video.js/dist/video-js.min.css'; //已改用CDN引入
  import { isArray } from 'lodash';
  import { addUnit } from '/@/utils';
  import { props as comProps } from './props';

  const props = defineProps(comProps);

  const emits = defineEmits({
    timeupdate: (_e: { detail: { currentTime: number } }) => true,
    play: () => true,
    pause: () => true,
    error: (_e) => true,
    ended: () => true,
    loadedmetadata: (_e: { detail: { duration: number } }) => true,
    durationchange: (_e: { detail: { duration: number } }) => true,
  });

  const Player = ref<ReturnType<typeof VideoJs>>();
  const isLive = computed(() => props.type === 'video/x-flv');

  onMounted(() => {
    console.log('props.videoId', props.videoId);

    const elWrapper = document.querySelector('#video-player-container')!;
    elWrapper.innerHTML = `<video class="video-js" id="${props.videoId}" style="width: ${addUnit(
      props.width,
      'rpx',
    )};height: ${addUnit(props.height, 'rpx')};" controls playsinline webkit-playsinlin>
  <source src="${props.src}" type="${props.type}" >
</video>`;
    // 控速配置
    const playbackRates = isArray(props.playbackRates)
      ? props.playbackRates
      : props.playbackRates
      ? [0.5, 1, 1.25, 1.5, 2, 2.5]
      : [];

    Player.value = VideoJs(
      props.videoId,
      {
        playbackRates,
        playbackRate: 1,
        width: addUnit(props.width, 'rpx'),
        height: addUnit(props.height, 'rpx'),
        language: 'zh-CN',
        muted: props.muted,
        controls: true,
        // autoplay: props.autoplay,
        loop: props.loop,
        controlBar: {
          children: [
            { name: 'playToggle' },
            {
              name: 'volumePanel',
              inline: false,
            },
            { name: 'currentTimeDisplay' },
            { name: 'durationDisplay' },
            { name: 'timeDivider' },
            { name: 'progressControl' },
            { name: 'remainingTimeDisplay' },
            ...(unref(isLive) ? [{ name: 'LiveDisplay' }] : [{ name: 'playbackRateMenuButton' }]),
            { name: 'fullscreenToggle' },
          ],
        },
        userActions: {
          click: true,
          doubleClick: true,
        },
      },
      () => {
        const instance = unref(Player);
        instance?.poster(props.poster);
        if (props.autoplay) {
          instance?.play();
        }
      },
    );

    const instance = unref(Player);
    if (instance) {
      // @ts-expect-error
      instance.on('play', function () {
        // 开始播放
        console.log('开始播放');
        emits('play');
      });
      // @ts-expect-error
      instance.on('pause', function () {
        // 暂停
        console.log('暂停');
        emits('pause');
      });
      // @ts-expect-error
      instance.on('loadedmetadata', function () {
        // 成功获取资源长度
        console.log('成功获取资源长度');
        emits('loadedmetadata', { detail: { duration: instance.duration() } });
      });
      // @ts-expect-error
      instance.on('timeupdate', function () {
        // 播放时间改变
        emits('timeupdate', { detail: { currentTime: instance.currentTime() } });
      });
      // @ts-expect-error
      instance.on('ended', function () {
        // 播放结束
        console.log('播放结束');
        emits('ended');
      });
      // @ts-expect-error
      instance.on('durationchange', function () {
        // 资源长度改变
        console.log('资源长度改变', instance.duration());
        emits('durationchange', { detail: { duration: instance.duration() } });
      });
      // @ts-expect-error
      instance.on('error', (err) => {
        console.log('请求数据时遇到错误');
        emits('error', err);
      });
      // instance.on('playing', function () {
      //   // 开始回放
      //   console.log('开始播放');
      // });
      // instance.on('suspend', function () {
      //   // 延迟下载
      //   console.log('延迟下载');
      // });
      // instance.on('loadstart', function () {
      //   // 客户端开始请求数据
      //   console.log('客户端开始请求数据');
      // });
      // instance.on('progress', function () {
      //   // 客户端正在请求数据
      //   console.log('客户端正在请求数据');
      //   instance.play();
      // });
      // instance.on('abort', function () {
      //   // 客户端主动终止下载（不是因为错误引起）
      //   console.log('客户端主动终止下载');
      // });
      // instance.on('stalled', function () {
      //   // 网速失速
      //   console.log('网速失速');
      // });
      // instance.on('loadeddata', function () {
      //   // 渲染播放画面
      //   console.log('渲染播放画面');
      // });
      // instance.on('waiting', function () {
      //   // 等待数据，并非错误
      //   console.log('等待数据');
      // });
      // instance.on('canplay', function () {
      //   // 可以播放，但中途可能因为加载而暂停
      //   console.log('可以播放，但中途可能因为加载而暂停');
      //   emits('loadedmetadata');
      // });
      // instance.on('canplaythrough', function () {
      //   // 可以播放，歌曲全部加载完毕
      //   console.log('可以播放，歌曲全部加载完毕');
      // });
      // instance.on('seeking', function () {
      //   // 寻找中
      //   console.log('寻找中');
      // });
      // instance.on('seeked', function () {
      //   // 寻找完毕
      //   console.log('寻找完毕');
      // });
      // instance.on('ratechange', function () {
      //   // 播放速率改变
      //   console.log('播放速率改变');
      // });
      // instance.on('volumechange', function () {
      //   // 音量改变
      //   console.log('音量改变');
      // });
    }
  });

  function seek(currentTime: number) {
    const instance = unref(Player);
    instance?.currentTime(currentTime);
  }

  onUnmounted(() => {
    unref(Player)?.dispose();
  });

  watch(
    () => props.src,
    (value) => {
      console.log('src changed:', value);
      const instance = unref(Player);
      instance?.src([{ src: value, type: props.type }]);
      if (props.poster) {
        instance?.poster(props.poster);
      }
      if (props.autoplay) {
        instance?.play();
      }
    },
  );
  defineExpose({
    Player,
    seek,
  });
</script>

<template>
  <view id="video-player-container" class="w-full h-full" />
</template>
