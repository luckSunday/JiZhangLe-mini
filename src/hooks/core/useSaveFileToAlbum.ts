import { premissionCheck } from '/@/utils/permission';
import { authorize } from '/@/utils/auth';

const downloadFile = (url, onProgressUpdate?: (progress: number) => void, showModal?: boolean) => {
  return new Promise<string>((resolve, reject) => {
    showModal &&
      uni.showLoading({
        title: '保存中',
      });
    const downloadTask = uni.downloadFile({
      url,
      success({ tempFilePath }) {
        uni.hideLoading();
        resolve(tempFilePath);
      },
      fail() {
        uni.hideLoading();
        reject();
      },
    });
    downloadTask.onProgressUpdate(function ({ progress }) {
      onProgressUpdate?.(progress);
      showModal &&
        uni.showLoading({
          title: `${progress}%`,
        });
    });
  });
};

/**
 * @description 保存图片或视频至相册
 * @param {string} filePath 文件地址，http开头的文件会自动调用getImageInfo或者downloadFile
 * @param {image|video} type 指定媒体类型，没有指定会去查找路径的后缀进行判断
 * @param {boolean} showModal 弹框提示成功失败和进度消息，默认true
 */
export async function useSaveFileToAlbum(options: {
  filePath: string;
  onProgressUpdate?: (progress: number) => void;
  type?: 'image' | 'video';
  showModal?: boolean;
}) {
  let type: 'image' | 'video';
  const showModal = typeof options.showModal === 'boolean' ? options.showModal : true;
  if (options.type) {
    type = options.type;
  } else {
    type = /\.(mp4|m3u8|mov|m4a|3gp)/i.test(options.filePath) ? 'video' : 'image';
  }
  // #ifdef MP
  await authorize(
    'scope.writePhotosAlbum',
    true,
    '获取相册权限失败，\n请在设置页中允许相关权限使用',
  );
  // #endif
  if (type === 'image') {
    // 图片保存方法
    let filePath = options.filePath;
    if (options.filePath.startsWith('http')) {
      // @ts-expect-error
      filePath = (await uni.getImageInfo({ src: options.filePath }))?.path;
    }
    return new Promise<any>((resolve, reject) => {
      if (filePath) {
        uni.saveImageToPhotosAlbum({
          filePath,
          success(e) {
            resolve(e);
            showModal &&
              uni.showToast({
                title: '保存成功',
                duration: 2000,
              });
          },
          fail: async () => {
            reject();
            const status = await premissionCheck('EXTERNAL_STORAGE');
            if (status === 1) {
              showModal &&
                uni.showToast({
                  title: '保存失败',
                  duration: 2000,
                  icon: 'none',
                });
            }
          },
        });
      } else reject();
    });
  } else if (type === 'video') {
    // 视频保存方法
    let filePath = options.filePath;
    if (options.filePath.startsWith('http')) {
      filePath = await downloadFile(options.filePath, options.onProgressUpdate, showModal);
    }
    return new Promise<any>((resolve, reject) => {
      if (filePath) {
        uni.saveVideoToPhotosAlbum({
          filePath,
          success(e) {
            resolve(e);
            showModal &&
              uni.showToast({
                title: '保存成功',
                duration: 2000,
              });
          },
          fail() {
            reject();
            showModal &&
              uni.showToast({
                title: '保存失败',
                duration: 2000,
                icon: 'none',
              });
          },
        });
      } else reject();
    });
  }
}
