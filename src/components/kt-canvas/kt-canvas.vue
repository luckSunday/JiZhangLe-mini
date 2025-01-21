<!--
* @description  海报组件，用于传入配置生成海报
* @fileName  PosterCanvas
* @author chengwei
* @date 2022-09-15 16:39:27
-->
<script lang="ts">
  import { computed, defineComponent, getCurrentInstance, reactive } from 'vue';
  import { addUnit } from '/@/utils';
  import { getImgBase64, getQrcode } from '/@/api/public';
  import { useSaveFileToAlbum } from '/@/hooks/core/useSaveFileToAlbum';
  import { premissionCheck } from '/@/utils/permission';
  import { base64ToImage, breakLinesForCanvas, getImageInfo } from './index.fn';
  import type { PosterStepsModel } from './index';
  // @ts-expect-error
  import { mid, tid } from '/@/constants';

  export default defineComponent({
    props: {
      width: {
        type: Number,
        default: 750,
      },
      height: {
        type: Number,
        default: 2000,
      },
      /** 绘制成功后是否自动保存至相册 */
      writePhotosAlbum: {
        type: Boolean,
        default: true,
      },
      showLoading: {
        type: Boolean,
        default: true,
      },
    },
    emits: {
      success: (src: string) => !!src,
    },
    setup(props, { expose, emit }) {
      const { proxy } = getCurrentInstance()!;
      const canvasRect = reactive<{ width?: number; height?: number }>({});
      const canvasStyle = computed(() => ({
        width: addUnit(canvasRect.width || props.width),
        height: addUnit(canvasRect.height || props.height),
      }));
      const isIOS = uni.getSystemInfoSync().platform === 'ios';

      /**
       * @description 开始绘制海报
       * @param {number} width 海报的宽度，建议750px以内
       * @param {number} height 海报的高度，建议2000px以内，否则可能会出现报错
       * @param {string} bgColor 海报的背景颜色，默认填充白色
       * @param {string} bgImage 海报的背景图片，如果没有设置海报宽高，会以背景图片的宽高进行保存
       * @param {PosterStepsModel[]} steps 绘制海报的步骤
       * @param {string} qrcodePath 海报上的二维码path
       * @param {UniNamespace.GetUserInfoRes['userInfo']} userinfo 用户的头像昵称
       * @return {Promise<string>}
       */
      async function create(options: {
        width: number;
        height: number;
        bgImage: string;
        steps: PosterStepsModel[];
        bgColor?: string;
        qrcodePath?: string;
        userinfo?: UniNamespace.GetUserInfoRes['userInfo'];
      }) {
        props.showLoading &&
          uni.showLoading({
            mask: true,
            title: '保存中',
          });
        const canvasWidth = options.width || props.width;
        let canvasHeight = options.height || props.height;
        // #ifndef MP-TOUTIAO
        canvasRect.width = options.width;
        canvasRect.height = options.height;
        // #endif

        /** 设置用户头像昵称的默认值 */
        if (!options.userinfo) {
          options.userinfo = {
            avatarUrl: 'https://ttmini.yizhiwechat.com/yzInterstTest/fission/default-avatar.png',
            nickName: '匿名用户',
            openId: '',
          };
        }

        // @ts-expect-error
        const ctx = await proxy.getContext();
        /** 部分属性设置快手和抖音有差异，抽离统一处理 */
        const setFillStyle = (value: string) => {
          // #ifdef MP-KUAISHOU
          ctx.fillStyle = value;
          // #endif
          // #ifndef MP-KUAISHOU
          ctx.setFillStyle(value);
          // #endif
        };
        const setTextAlign = (value: string) => {
          // #ifdef MP-KUAISHOU
          ctx.textAlign = value;
          // #endif
          // #ifndef MP-KUAISHOU
          ctx.setTextAlign(value);
          // #endif
        };
        const setTextBaseline = (value: string) => {
          // #ifdef MP-KUAISHOU
          ctx.textBaseline = value;
          // #endif
          // #ifndef MP-KUAISHOU
          ctx.setTextBaseline(value);
          // #endif
        };
        const setStrokeStyle = (value: string) => {
          // #ifdef MP-KUAISHOU
          ctx.strokeStyle = value;
          // #endif
          // #ifndef MP-KUAISHOU
          ctx.setStrokeStyle(value);
          // #endif
        };
        const setLineWidth = (value: number) => {
          // #ifdef MP-KUAISHOU
          ctx.lineWidth = value;
          // #endif
          // #ifndef MP-KUAISHOU
          ctx.setLineWidth(value);
          // #endif
        };
        const setFont = (value: string) => {
          // #ifdef MP-KUAISHOU
          try {
            isIOS && ctx.setFontSize?.(value.match(/\d+/)?.toString());
          } catch (e) {}
          // #endif

          ctx.font = `${value} sans-serif`;
        };

        /** 填充背景色和背景图片 */
        if (options.bgColor) {
          ctx.save();
          setFillStyle(options.bgColor || 'white');
          ctx.fillRect(0, 0, canvasWidth, canvasHeight * 10);
          ctx.restore();
        }

        if (options.bgImage) {
          try {
            const image = await getImageInfo(options.bgImage);
            ctx.drawImage(image.path, 0, 0, image.width, image.height);
          } catch (e) {
            console.log('背景图片加载异常：', e);
          }
        }

        /** 循环steps,绘制海报 */
        for (let index = 0, steps_length = options.steps.length; index < steps_length; index++) {
          const { type, context, x, y, style } = options.steps[index];

          switch (type) {
            case 'image': {
              let image = '';
              try {
                if (context.startsWith('http')) {
                  image = (await getImageInfo(context)).path;
                } else if (/^(\{\{)\s*(qrcode)\s*(\}\})$/.test(context) && options.qrcodePath) {
                  const qrcode = await getQrcode({
                    path: options.qrcodePath,
                    tid,
                    mid,
                  });
                  if (typeof qrcode === 'string') {
                    image = `data:image/jpg;base64,${qrcode}`;
                  }
                } else if (
                  /^(\{\{)\s*(avatar)\s*(\}\})$/.test(context) &&
                  options.userinfo.avatarUrl
                ) {
                  const { img_base64, img_base64_head } = await getImgBase64({
                    url: options.userinfo.avatarUrl,
                  });
                  image = img_base64_head + img_base64;
                }
              } catch (e) {
                // TODO handle the exception
              }
              if (image) {
                const width = style.w || style.width;
                const height = style.h || style.height;
                image = await base64ToImage(image);
                if (style.arc) {
                  ctx.save();
                  ctx.beginPath();
                  ctx.arc(x + width / 2, y + height / 2, width / 2, 0, Math.PI * 2, false);
                  ctx.clip();
                  ctx.drawImage(image, x, y, width, height);
                  ctx.closePath();
                  ctx.restore();
                } else {
                  ctx.drawImage(image, x, y, width, height);
                }
              }
              break;
            }
            case 'text': {
              const { color, align, base, font, stroke } = style;

              const text = /^(\{\{)\s*(nickname)\s*(\}\})$/.test(context)
                ? options.userinfo.nickName
                : context;
              setFillStyle(color || '#333333');
              setTextAlign(align || 'left');
              setTextBaseline(base || 'middle');
              setFont(font || '32px');
              ctx.fillText(text, x, y);
              if (stroke) {
                setStrokeStyle(stroke);
                ctx.strokeText(text, x, y);
                ctx.stroke();
              }
              break;
            }
            case 'longtext': {
              const {
                color,
                align,
                base,
                font,
                width,
                autoHeight,
                lineHeight: lineHeightDiploid,
              } = style;
              const baseLineHeight = parseInt((font || '32px').match(/\d+/)?.[0] || '32');
              const lineHeight = Math.ceil(baseLineHeight * (lineHeightDiploid || 1.5));
              let lineLength = 0;
              // ctx.beginPath();
              setFillStyle(color || '#ffffff');
              setTextAlign(align || 'left');
              setTextBaseline(base || 'middle');
              setFont(font || '32px');
              /** 有换行额外拆分一行 */
              const content = context.split(/[\n|\r]+/g);
              content.forEach((paragraph) => {
                const lines = breakLinesForCanvas(paragraph, width, ctx);
                lines.forEach((line) => {
                  ctx.fillText(line, x, lineLength++ * lineHeight + y);
                });
              });
              // ctx.stroke();
              if (autoHeight) {
                canvasHeight += lineLength * lineHeight;
              }
              break;
            }
            case 'path': {
              let paths: [number, number][];
              let color: string = style.color || '#ffffff';
              let gradient;
              try {
                paths = JSON.parse(context);
                if (/^\[(.+)\]$/.test(color)) {
                  color = JSON.parse(color);
                  /** 渐变方向，默认是图形路径的前两个坐标的连线 */
                  const gradient_direction = style.gradient_direction
                    ? JSON.parse(style.gradient_direction)
                    : [...paths[0], ...paths[1]];
                  gradient = ctx.createLinearGradient(...gradient_direction);
                  for (let index = 0; index < color.length; index++) {
                    const element = color[index];
                    gradient.addColorStop(...element);
                  }
                }
              } catch (e) {
                paths = [];
                // TODO handle the exception
              }
              ctx.beginPath();
              setLineWidth(1);
              setStrokeStyle(gradient || color);
              paths.forEach((v, i) => {
                if (i) {
                  ctx.lineTo(...v);
                } else {
                  ctx.moveTo(...v);
                }
              });
              ctx.closePath();
              // @ts-expect-error
              if (style.fill) {
                setFillStyle(gradient || color);
                ctx.fill();
              } else {
                ctx.stroke();
              }
              break;
            }
          }
        }
        props.showLoading && uni.hideLoading();
        return output(ctx, canvasWidth, canvasHeight);
      }
      /** 输出绘制结果，判断是否自动保存至相册 */
      const output = (ctx, width, height) => {
        return new Promise<string>((resolve, reject) => {
          ctx.draw(false, () => {
            uni.canvasToTempFilePath({
              x: 0,
              y: 0,
              width,
              height,
              destWidth: width,
              destHeight: height,
              canvasId: 'poster-canvas',
              success({ tempFilePath }) {
                console.log('tempFilePath ', tempFilePath);
                resolve(tempFilePath);
                emit('success', tempFilePath);
                if (props.writePhotosAlbum) {
                  // #ifndef H5
                  saveImageToAlbum(tempFilePath);
                  // #endif
                }
              },
              fail(e) {
                console.log('canvasToTempFilePath fail', e);
                uni.showModal({
                  title: '提示',
                  content: '图片生成错误',
                  showCancel: false,
                });
                reject();
              },
            });
          });
        });
      };
      /** 判断相册权限，保存结果至相册 */
      const saveImageToAlbum = async (filePath: string) => {
        // useSaveFileToAlbum({
        //   filePath,
        //   type: 'image',
        // });
        if (plus.os.name !== 'iOS') {
          const status = await premissionCheck('EXTERNAL_STORAGE');
          if (status === 1) {
            useSaveFileToAlbum({
              filePath,
              type: 'image',
            });
          }
        } else {
          useSaveFileToAlbum({
            filePath,
            type: 'image',
          });
        }
      };

      expose({
        create,
        saveImageToAlbum,
      });
      return {
        canvasRect,
        canvasStyle,
        create,
        saveImageToAlbum,
      };
    },
    methods: {
      /** 获取画布上下文实例 */
      getContext() {
        return new Promise<UniNamespace.CanvasContext>((resolve, reject) => {
          // #ifdef MP-KUAISHOU
          uni
            .createSelectorQuery()
            .in(this)
            .select('#poster-canvas')

            .node(() => {})
            .exec(([dom]) => {
              if (dom.node) {
                resolve(dom.node.getContext());
              } else {
                reject();
              }
            });
          // #endif
          // #ifndef MP-KUAISHOU
          resolve(uni.createCanvasContext('poster-canvas', this));
          // #endif
        });
      },
    },
  });
</script>

<template>
  <view class="relative w-0 h-0 overflow-hidden">
    <canvas
      id="poster-canvas"
      class="absolute -left-[9999px] top-0"
      :style="canvasStyle"
      canvas-id="poster-canvas"
    ></canvas>
  </view>
</template>
