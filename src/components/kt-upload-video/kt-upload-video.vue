<!--
* @description  上传组件
* @fileName  kt-upload
* @author 成崴
* @date 2022-11-28 10:02:55
-->
<script lang="ts">
  import type { CSSProperties, PropType } from 'vue';
  import { defineComponent } from 'vue';
  import { authorize, getSetting, openSetting } from '/@/utils/auth';

  import dayjs from 'dayjs';
  import { uploadFileToOss } from '/@/utils/upload.oss';
  import { getVideoFirstFrame } from '/@/api/public';

  // import { PlatformName } from '/@/constants';

  export default defineComponent({
    name: 'KtUpload',
    props: {
      /** 上传后的结果，
       * 启用多选后value为array结构，
       * 如果未启用上传，则返回文件临时路径
       */
      value: {
        type: String,
      },
      /** 是否启用上传功能
       *  @default true
       */
      upload: {
        type: Boolean,
        default: true,
      },
      /** 指定文件上传的目录地址 */
      directory: {
        type: String,
        default: `zixun/${dayjs().format('YYYY-MM-DD')}/zixun-video/`,
      },
      /**
       * 是否压缩所选的视频源文件
       */
      compress: {
        type: Boolean,
        default: true,
      },
      showLoading: {
        type: Boolean,
        default: true,
      },
      customStyle: {
        type: Object as PropType<CSSProperties>,
        default: () => ({}),
      },
      /** 是否取上传后的视频第一帧作为封面 */
      useCover: {
        type: Boolean,
        default: false,
      },
    },
    emits: {
      /** 选择文件完成回调，
       * 如果需要压缩则是压缩后结果 */
      choose: (e: { tempFilePath: string }) => e,
      'update:value': (_value: string) => true,
      success: (_value: { path: string; cover?: string }) => true,
      progress: (_value: { progress: number }) => true,
    },
    setup(props, { emit }) {
      /** 选择文件时的交互类型 */
      const clooseImageSourceType = (type?: 'album' | 'camera') => {
        switch (type) {
          case 'album':
            return ['album'];
          case 'camera':
            return ['camera'];
          default:
            return ['album', 'camera'];
        }
      };
      /** 开始选择文件 */
      const chooseImage = (sourceType: string[]) => {
        if (!sourceType) {
          return console.error('sourceType must be camera or album');
        }

        uni.chooseVideo({
          sourceType,
          compressed: props.compress,
          success: async (e) => {
            const { tempFilePath, size, tempFile } = e;
            emit('choose', { tempFilePath });
            // 开始上传
            if (size > 188743680) {
              return uni.showModal({
                title: '提示',
                content: '对不起，您选择的视频文件体积超过180MB，无法上传！',
                showCancel: false,
              });
            }
            if (props.upload) {
              props.showLoading && uni.showLoading({ mask: true, title: '视频上传中' });
              const result = await uploadFileToOss({
                // #ifdef MP
                filePath: tempFilePath,
                // #endif
                // #ifndef MP
                filePath: tempFile,
                // #endif
                path: props.directory,
                onProgressUpdate(e) {
                  emit('progress', e);
                },
              }).catch(() => {
                uni.showModal({
                  title: '提示',
                  content: '文件上传遇到问题，请稍候再试！',
                  showCancel: false,
                });
              });
              result && onSuccess(result);
              result && props.showLoading && uni.hideLoading();
            }
          },
          fail: (e) => {
            console.log('视频文件选择错误', e);
            console.log('choose fail', e);
            if (e.errMsg === 'chooseImage:fail auth deny') {
              console.log('需要去授权');
              requirePremise('scope.camera');
              requirePremise('scope.writePhotosAlbum');
            } else if (!e.errMsg.includes('fail cancel')) {
              uni.showModal({
                content: '图片选择出错或者不支持选择视频图片，请重新选择',
                showCancel: false,
              });
            }
          },
        });
      };
      /** 点击上传按钮 */
      async function handler() {
        // #ifndef MP-TOUTIAO
        await authorize('scope.camera', true);
        await authorize('scope.writePhotosAlbum', true);
        // #endif

        chooseImage(clooseImageSourceType());
      }
      /** 上传成功，需要视频封面则在此加载封面地址 */
      function onSuccess(url) {
        emit('update:value', url);
        if (props.useCover) {
          uni.showLoading({ mask: true, title: '请稍候' });
          getVideoFirstFrame({ video_url: url })
            .then((cover) => {
              emit('success', { path: url, cover });
            })
            .finally(() => {
              uni.hideLoading();
            });
        } else {
          emit('success', { path: url });
        }
      }
      function requirePremise(scope) {
        getSetting(scope).then((res) => {
          if (!res) {
            hasPremise.value = false;
            openSetting(scope).then((res) => {
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
      return { handler };
    },
  });
</script>

<template>
  <view class="overflow-hidden" :style="customStyle" @click="handler">
    <slot>
      <view
        class="flex flex-col items-center justify-center text-gray-400 border border-gray-200 border-dashed rounded h-72 w-72"
      >
        <text class="font-thin"><kt-icon name="add" :size="42" /></text>
        <text class="mt-3 text-xs">上传视频</text>
      </view>
    </slot>
  </view>
</template>
