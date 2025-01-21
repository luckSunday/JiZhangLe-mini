import request from '/@/utils/request';
/**
 * @description 获取举报类型数据
 */
export function getReportTypeList(params: { type: string }) {
  return request.get<any, any>('/home/reportTypeList', params);
}
/**
 * @description 提交举报信息
 */
export function saveReportData(params: {
  type_title: string;
  type_content: string;
  brief: string;
  phone: string;
}) {
  return request.post<any, any>('/home/saveReportData', params);
}
