// 发布作品内容/编辑内容

export interface ProductDataRes {
  product_id?: number;
  // 一级类目id
  primary_category_id: number | undefined;
  // 二级类目id
  seconds_category_id: number | undefined;
  // 标题
  title: string;
  // 解锁方式 1付费查看 2广告查看 3免费查看
  pay_unlock_type: number;
  // 价格 单位：元
  price: number;
  // 类型 1图片 2地点
  type: number;
  // 省
  province?: string;
  // 市
  city?: string;
  // 区
  area?: string;
  // 经度
  lat?: number;
  // 纬度
  lon?: number;
  // 地址
  address?: string;
  // 图片
  image_url?: string;
}
