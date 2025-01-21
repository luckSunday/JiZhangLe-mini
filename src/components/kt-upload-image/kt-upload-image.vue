<!--
* @description  上传组件
* @fileName  kt-upload
* @author 成崴
* @date 2022-11-28 10:02:55
-->
<script lang="ts">
  import type { CSSProperties, PropType } from 'vue';
  import { computed, defineComponent, getCurrentInstance, ref } from 'vue';
  import { authorize, getSetting, openSetting } from '/@/utils/auth';
  import { useAppStoreWithOut } from '/@/store';
  import { isArray, isObject } from 'lodash';
  import { addUnit, base64ToFile, imageToBase64, showToast } from '/@/utils';
  import { uploadFileToOss } from '/@/utils/upload.oss';
  import { uploadFileToObs } from '/@/utils/upload.obs';
  import { useInspectImage } from '/@/hooks/core';
  import { premissionCheck } from '/@/utils/permission';
  import dayjs from 'dayjs';

  // import { PlatformName } from '/@/constants';

  export default defineComponent({
    name: 'KtUpload',
    props: {
      /** 上传后的结果，
       * 启用多选后value为array结构，
       * 如果未启用上传，则返回文件临时路径
       */
      value: {
        type: [String, Array] as PropType<string | string[]>,
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
        default: `creator/creatorImage/${dayjs().format('YYYY-MM-DD')}/`,
      },
      /** 是否对图片内容进行安全检测
       * @default false
       */
      inspect: {
        type: Boolean,
        default: false,
      },
      /** 是否多选，
       * 启用后选择文件都将对value数组进行push操作
       * @default false
       */
      multiple: {
        type: Boolean,
        default: false,
      },
      /** 最大上传数量，仅多选模式下有效
       * @default 9
       */
      maxCount: {
        type: Number,
        default: 9,
      },
      /**
       * 图片压缩配置
       * @param {boolean} auto = [true] 是否自动压缩
       * @param {number} size = [1048576] 字节数，超出此大小才出发压缩
       * @param {number} height = [520] 压缩方式采用定高宽度度自适应的方式降低分辨率（由于快手安卓下画布高度有限制，超过500像素出现图像缺失）
       */
      compress: {
        type: [Object, Boolean] as PropType<
          { auto: boolean; size: number; height: number } | false
        >,
        default: () => ({
          auto: true,
          size: 1048576,
          height: 520,
        }),
      },
      customStyle: {
        type: Object as PropType<CSSProperties>,
        default: () => ({}),
      },
    },
    emits: {
      /** 选择文件完成回调，
       * 如果需要压缩则是压缩后结果 */
      choose: (e: { tempFilePaths: string[] }) => e,
      'update:value': (_value: string | string[]) => true,
    },
    setup(props, { emit, expose }) {
      const instance = getCurrentInstance();
      const AppStore = useAppStoreWithOut();
      const isIOS = AppStore.getSystemInfo.platform === 'ios';
      /** 是否有录音权限 */
      const hasPremise = ref(false);
      const compressConfig = computed(() =>
        isObject(props.compress)
          ? props.compress
          : {
              auto: true,
              size: 1048576,
              height: 520,
            },
      );
      const canvasRect = ref({
        width: addUnit(compressConfig.value.height),
        height: addUnit(compressConfig.value.height),
      });

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
      const chooseImage = async (sourceType: string[]) => {
        if (!sourceType) {
          return console.error('sourceType must be camera or album');
        }
        const options = {
          count: props.multiple
            ? props.maxCount - (isArray(props.value) ? props.value.length : 0)
            : 1,
          sourceType,
          sizeType: ['compressed'],
          success: async ({ tempFiles }) => {
            console.log('chooseImage success', tempFiles);
            const { auto, size } = compressConfig.value;
            if (isArray(tempFiles)) {
              if (
                props.multiple &&
                tempFiles.length + (isArray(props.value) ? props.value?.length : 0) > props.maxCount
              ) {
                uni.showModal({
                  title: '提示',
                  content: '您选择的文件数量太多了，请重新选择',
                  showCancel: false,
                });
                return false;
              }
              /** 由于File对象不能修改属性，
               * 设置副本用于保存压缩上传后的结果
               */
              let result: string[];
              // #ifndef H5
              result = tempFiles.map((v) => v.path);
              // #endif
              // #ifdef H5
              result = tempFiles.map((v) => v);
              // #endif
              // const result: string[] = tempFiles.map((v) => (v instanceof File ? v : v.path));
              // 判定压缩功能
              if (auto) {
                uni.showLoading({ mask: true, title: '图片压缩中' });
                for (let index = 0; index < tempFiles.length; index++) {
                  if (tempFiles[index].size > size) {
                    // @ts-expect-error
                    result[index] = await compressImage(tempFiles[index].path);
                  }
                }
              }

              emit('choose', { tempFilePaths: tempFiles.map((v) => v.path) });
              // 开始循环上传
              if (props.upload) {
                uni.showLoading({ mask: true, title: '图片上传中' });
                for (let index = 0; index < tempFiles.length; index++) {
                  // @ts-expect-error
                  result[index] = await uploadFileToObs({
                    filePath: result[index],
                  }).catch(() => {
                    uni.showModal({
                      title: '提示',
                      content: '文件上传遇到问题，请稍候再试！',
                      showCancel: false,
                    });
                  });
                }
              }
              // 开始图片风险检测
              if (props.inspect) {
                uni.showLoading({ mask: true, title: '图片检测中' });
                let safe = true;
                try {
                  if (result.every((v) => v.startsWith('http'))) {
                    for (let index = 0; index < result.length; index++) {
                      safe = await useInspectImage(result[0]);
                      if (!safe) {
                        break;
                      }
                    }
                  } else {
                    // #ifdef MP
                    for (let index = 0; index < result.length; index++) {
                      safe = await useInspectImage([await imageToBase64(result[index])]);
                      if (!safe) {
                        break;
                      }
                    }
                    // #endif
                  }
                } catch (e) {}

                if (!safe) {
                  // 图片存在风险
                  uni.hideLoading();
                  return false;
                }
              }
              if (props.multiple) {
                let values: string[] = [];
                if (isArray(props.value)) {
                  values = props.value;
                } else if (props.value) {
                  values = [props.value];
                }
                emit('update:value', [...values, ...result]);
              } else {
                emit('update:value', result[0]);
              }
            }
            uni.hideLoading();
          },
          fail: async (e) => {
            if (e.errMsg === 'chooseImage:fail auth deny') {
              console.log('需要去授权');
              requirePremise('scope.camera');
              requirePremise('scope.writePhotosAlbum');
            } else if (
              !e.errMsg.includes('fail cancel') &&
              isIOS &&
              e.code !== -2 &&
              e.code !== 0
            ) {
              const type =
                sourceType[0] === 'album'
                  ? 'CAMERA'
                  : sourceType[0] === 'camera'
                  ? 'EXTERNAL_STORAGE'
                  : 'CAMERA_EXTERNAL_STORAGE';
              // uni.showModal({
              //   content: `${type}-${JSON.stringify(e)}`,
              //   showCancel: false,
              // });
              const status = await premissionCheck(type);
              if (status === 1) {
                uni.showModal({
                  content: `图片选择出错或者不支持选择视频图片，请重新选择`,
                  showCancel: false,
                });
              }
            } else if (
              !isIOS &&
              (e.errMsg.includes('resultCode is weong') || e.errMsg.includes('User cancelled'))
            ) {
              // 取消选择
            } else if (e.code === 12 || e.code === 11) {
              const type =
                sourceType[0] === 'album'
                  ? 'EXTERNAL_STORAGE'
                  : sourceType[0] === 'camera'
                  ? 'CAMERA'
                  : 'CAMERA_EXTERNAL_STORAGE';
              premissionCheck(type);
            }
          },
        };
        if (!isIOS) {
          // #ifdef APP-PLUS
          // const type =
          //   sourceType[0] === 'album'
          //     ? 'EXTERNAL_STORAGE'
          //     : sourceType[0] === 'camera'
          //     ? 'CAMERA'
          //     : 'CAMERA_EXTERNAL_STORAGE';
          // const status: any = await premissionCheck(type);
          // if (status === 1) {
          uni.chooseImage(options);
          // }
          // #endif
          // #ifndef APP-PLUS
          uni.chooseImage(options);
          // #endif
        } else {
          uni.chooseImage(options);
        }
      };
      /** 点击上传按钮 */
      async function handler() {
        // #ifdef MP-KUAISHOU
        await authorize('scope.camera', true);
        await authorize('scope.writePhotosAlbum', true);
        // #endif
        chooseImage(await clooseImageSourceType());
        // if (isIOS && PlatformName !== 'h5') {
        //   uni.showActionSheet({
        //     itemList: ['拍照', '从相册选择'],
        //     success: (res) => {
        //       if (res.tapIndex === 0) {
        //         chooseImage(clooseImageSourceType('camera'));
        //       } else if (res.tapIndex === 1) {
        //         chooseImage(clooseImageSourceType('album'));
        //       }
        //     },
        //   });
        // } else {
        // chooseImage(clooseImageSourceType());
        // }
      }

      /** 手动压缩图片，
       * 压缩失败时直接上传原图
       * 因为存在多选，需要按顺序循环完成压缩
       */
      let ctx: UniApp.CanvasContext;
      function compressImage(path) {
        const { height } = compressConfig.value;
        return new Promise((resolve) => {
          try {
            uni.getImageInfo({
              src: path,
              success({ path: image_path, width: image_width, height: image_height }) {
                const width = Math.floor(height * (image_width / image_height));
                canvasRect.value = { width: addUnit(width), height: addUnit(height) };
                setTimeout(() => {
                  ctx = ctx ?? uni.createCanvasContext('compress-canvas', instance);
                  ctx.clearRect(0, 0, width, height);
                  ctx.drawImage(image_path, 0, 0, width, height);
                  ctx.draw(false, () => {
                    uni.canvasToTempFilePath({
                      x: 0,
                      y: 0,
                      width,
                      height,
                      destWidth: width,
                      destHeight: height,
                      canvasId: 'compress-canvas',
                      success({ tempFilePath }) {
                        // #ifdef H5
                        resolve(base64ToFile(tempFilePath));
                        // #endif
                        // #ifndef H5
                        resolve(tempFilePath);
                        // #endif
                      },
                      fail() {
                        throw new Error('画布导出图片错误错误');
                      },
                    });
                  });
                }, 100);
              },
              fail() {
                throw new Error('图片加载错误');
              },
            });
          } catch (e) {
            resolve(path);
          }
        });
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
      expose({
        handler,
      });
      return { handler, canvasRect };
    },
  });
</script>

<template>
  <view class="overflow-hidden" :style="customStyle">
    <view class="w-full h-full" @click="handler">
      <slot>
        <view
          class="flex flex-col items-center justify-center text-gray-400 border border-gray-200 border-dashed rounded h-72 w-72"
        >
          <text class="font-thin"><kt-icon name="add" :size="42" /></text>
          <text class="mt-3 text-xs">上传图片</text>
        </view>
      </slot>
    </view>
    <canvas
      id="compress-canvas"
      class="fixed left-[9999px] top-0"
      :style="canvasRect"
      canvas-id="compress-canvas"
    ></canvas>
  </view>
</template>

<style>
  :root {
    width: 100%;
  }
</style>
