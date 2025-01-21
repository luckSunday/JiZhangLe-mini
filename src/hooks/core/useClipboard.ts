/**
 * @description 调用剪贴板功能，复制文字内容
 */
export function useClipboard(context: string, showToast = true): Promise<void> {
  return new Promise(function (resolve, reject) {
    uni.setClipboardData({
      data: context,
      showToast: false,
      success() {
        if (showToast) {
          uni.showToast({
            title: '复制成功',
            icon: 'none',
          });
        }
        resolve();
      },
      fail() {
        if (showToast) {
          uni.showToast({
            title: '复制失败',
            icon: 'none',
          });
        }
        reject();
      },
    });
  });
}
