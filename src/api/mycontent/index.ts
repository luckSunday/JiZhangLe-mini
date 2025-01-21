import request from '/@/utils/request';
import type { ProductDataRes } from './model';

// 发布作品内容
export function saveProductData(data: ProductDataRes) {
  return request.post<any, any>('/home/saveProductData', data);
}

// 编辑作品内容
export function editProductData(data: ProductDataRes) {
  return request.post<any, any>('/home/editProductData', data);
}

// 作品内容详情
export function productDetail(params: { product_id: string }) {
  return request.get<any, any>('/home/productDetail', params);
}

// 获取作品内容数据统计
export function getProductStatistics(params: { product_id: string }) {
  return request.get<any, any>('/api/user/getProductStatistics', params);
}

// 获取作品广告收益列表
export function getProductAdIncomeList(params: {
  product_id: string;
  page: number;
  page_size: number;
}) {
  return request.get<any, any>('/api/user/getProductAdIncomeList', params);
}

// 获取作品订单收益列表

export function getProductOrderIncomeList(params: {
  product_id: string;
  page: number;
  page_size: number;
}) {
  return request.get<any, any>('/api/user/getProductOrderIncomeList', params);
}

// 删除作品
export function delProduct(params: { product_id: string }) {
  return request.post<any, any>('/home/delProduct', params);
}
// 抖音视频id绑定内容作品
export function dyBindProductId(params: { product_id: string; video_id: string }) {
  return request.post<any, any>('/home/dyBindProductId', params);
}
