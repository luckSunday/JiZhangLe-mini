import request from '/@/utils/request';
/**
 * @description 保存观看广告记录
 */
export function saveWatchAdvertRecord(params: { product_id: string; platform: string }) {
  return request.post<any, any>('/api/advert/saveWatchAdvertRecord', params);
}

/**
 * @description 获取当前用户作品解锁状态
 */
export function getCheckProductLock(params: { product_id: string }) {
  return request.get<any, any>('/home/checkProductLock', params);
}
/**
 * @description 列表详情
 */
export function getProductDetail(params: { product_id: string }) {
  return request.get<any, any>('/home/productDetail', params);
}
/**
 * @description 详情页相同二级分类作品数据
 */
export function getSecondCategoryProductList(params: {
  seconds_category_id: string;
  page: string;
  page_size: string;
}) {
  return request.get<any, any>('/home/secondCategoryProductList', params);
}
