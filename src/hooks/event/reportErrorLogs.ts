import { useUserStoreWithOut } from '../../store';
import { pushErrorForLogge } from '../../api/public';
import dayjs from 'dayjs';
const userStore = useUserStoreWithOut();
/**
 * @description 上报错误日志
 * @param {number} userId 用户id
 * @param {number} code 
 * @param {any} msg 错误信息
 * @param {string} api_url 调用的api
 * @param {any} query 参数
 * @param {string} route_path 页面路径
 */
export function onPushErrorForLogge(params:{code?,msg,query?,api_url?:String,route_path?:String}){
  pushErrorForLogge({
    api_url: params.api_url || '',
    query: JSON.stringify(params.query),
    code: params.code||'',
    msg: `userId:${userStore.getUserId}，date:${dayjs().format('YYYY-MM-DD hh:mm:ss')}，msg:${JSON.stringify(params.msg)}`,
    route_path: params.route_path || '',
  });
}

