export function getImagePath(path: string, width = 360) {
  if (!path) {
    return false;
  }
  const isCos = /^https:\/\/cos-admin.yizhiwechat.com/;
  const isOss = /^https:\/\/curriculum-image.yizhiweixin.com/;

  if (isCos.test(path)) {
    return `${path}${path.includes('?') ? '&' : '?'}imageMogr2/rquality/80/thumbnail/${width}x`;
  }
  if (isOss.test(path)) {
    return `${path}${
      path.includes('?') ? '&' : '?'
    }x-oss-process=image/auto-orient,1/resize,m_lfit,w_${width}/quality,q_80`;
  }
}
