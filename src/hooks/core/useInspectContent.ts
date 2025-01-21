import { getFaceData, imageAntiDirt, textAntidirt } from '../../api/public';
// @ts-expect-error
import { mid } from '/@/constants';

const createModal = (content: string) =>
  uni.showModal({
    content,
    showCancel: false,
  });

/**
 * @description 文字风险检测
 * @param {string[]} contents 待检测的字符数组
 * @return {boolean} 是否通过检测，false表示存在安全问题
 */
export async function useInspectText(contents: string[], showModal = true) {
  return textAntidirt({
    mid,
    contents,
  })
    .then(({ data }) => {
      let hit = false;
      try {
        if (/\d+/.test(data.hit)) {
          hit = data.hit;
        } else if (Array.isArray(data.data)) {
          hit = data.data.some((v) => v.predicts && v.predicts.some(({ hit }) => hit));
        }
      } catch (e) {
        console.log(e);
      }
      if (hit && showModal) {
        showModal && createModal('因相关法律和要求，输入的内容存在风险词汇，请重新输入！');
      }
      return !hit;
    })
    .catch((e) => {
      if (e.errMsg.startsWith('request:fail')) {
        showModal && createModal('因相关法律和要求，输入的内容存在风险词汇，请重新输入！');
      } else {
        showModal && createModal('风险词汇校验接口异常！请重试');
      }
      return false;
    });
}

/**
 * @description 图片风险检测
 * @param {string[]} images 待检测的图片url数组,如果是base64资源，则只支持单张检验
 * @return {boolean} 是否通过风险检测，false表示存在安全问题
 */
export async function useInspectImage(images: string[] | string, showModal = true) {
  images = Array.isArray(images) ? images : images;
  const isBase64 = /^data\:/.test(images[0]);
  const params: {
    mid: number;
    image_data?: string;
    images?: string[];
  } = {
    mid,
  };
  if (isBase64) {
    params.image_data = images[0].replace(/^data\:image\/(png|jpg|jpeg|gif)\;base64\,/, '');
  } else {
    params.images = images;
  }
  return imageAntiDirt(params)
    .then((res) => {
      try {
        if (res.predicts.some(({ hit }) => hit)) {
          showModal && createModal('因相关法律和要求，相关的内容存在风险,请重新上传');
          return false;
        } else {
          return true;
        }
      } catch (e) {
        console.log(e);
      }
      return true;
    })
    .catch((e) => {
      if (e.errMsg.startsWith('request:fail')) {
        showModal && createModal('因相关法律和要求，相关的内容存在风险,请重新上传');
      } else {
        showModal && createModal('因相关法律和要求，相关的内容存在风险,请重新上传');
      }
      return false;
    });
}

/**
 * @description 人脸检测
 * @param {string} image 图片url
 * @param {ObjectHTMLAttributes} image 图片url
 */
export async function useInspectFace(image: string, showModal = true) {
  const {
    face: { code },
  } = await getFaceData({ img_url: image });
  console.log(code);
  if (code !== 200) {
    showModal && createModal('图片未检测到人脸，请重新上传！');
    return false;
  }
  return true;
}
