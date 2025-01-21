/** 段落文本的绘制方法 - 长文本判断长度 */
export const findBreakPoint = (text, width, context) => {
  let min = 0;
  let max = text.length - 1;

  while (min <= max) {
    const middle = Math.floor((min + max) / 2);
    const middleWidth = context.measureText(text.substr(0, middle)).width;
    const oneCharWiderThanMiddleWidth = context.measureText(text.substr(0, middle + 1)).width;
    if (middleWidth <= width && oneCharWiderThanMiddleWidth > width) {
      return middle;
    }
    if (middleWidth < width) {
      min = middle + 1;
    } else {
      max = middle - 1;
    }
  }
  return -1;
};

/** 段落文本的绘制方法 - 长文本拆分成数组 */
export const breakLinesForCanvas = (text: string, width: number, ctx) => {
  const _result: string[] = [];
  let breakPoint = 0;
  // eslint-disable-next-line no-cond-assign
  while ((breakPoint = findBreakPoint(text, width, ctx)) !== -1) {
    _result.push(text.substr(0, breakPoint));
    text = text.substr(breakPoint);
  }
  if (text) {
    _result.push(text);
  }
  return _result;
};

/** 封装一层getImageInfo，指定它的返回值类型 */
export const getImageInfo = (src: string) =>
  uni.getImageInfo({
    src,
  }) as unknown as Promise<UniNamespace.GetImageInfoSuccessData>;

/** path字符串转换为对象 */
export const urlToObject = (url: string) => {
  const params: Record<string, string> = {};
  // eslint-disable-next-line prefer-const
  let [domain, hash] = url.split('?');
  const hash_array = hash.split('&');
  for (let i = 0; i < hash_array.length; i++) {
    const [key, value] = hash_array[i].split('=');
    params[key] = value;
  }
  return { url: domain, params };
};

/**
 * @description base64图片转临时路径
 * @param {type} FN_PARAMS
 * @return {type}
 */
export function base64ToImage(base64: string): Promise<string> {
  if (!/^data\:image/.test(base64)) {
    return Promise.resolve(base64);
  }

  return new Promise(function (resolve, reject) {
    let platform = uni;
    // #ifdef MP-TOUTIAO
    // @ts-expect-error
    platform = tt;
    // #endif
    // #ifdef MP-KUAISHOU
    // @ts-expect-error
    platform = ks;
    // #endif
    // #ifdef MP-WEIXIN
    // @ts-expect-error
    platform = wx;
    // #endif
    // @ts-expect-error
    const filePath = `${platform.env.USER_DATA_PATH}/${Date.now()}.png`;
    uni.getFileSystemManager().writeFile({
      filePath,
      data: base64.replace(/^data\:image\/(jpg|png|jpeg|gif)\;base64\,/, ''),
      encoding: 'base64',
      success() {
        resolve(filePath);
      },
      fail(e) {
        reject(e);
      },
    });
  });
}
