import { ref, unref, watch } from 'vue';
import { onReachBottom } from '@dcloudio/uni-app';
import { debounce } from 'lodash';
import { useUserStoreWithOut } from '../../store/modules/user';
/**
 * @description 分页功能使用
 */
export interface PagingOption {
  /** 接口方法 */
  api: (...agrs) => Promise<any>;
  /** 接口参数，需要请求前修改参数或者动态获取参数使用函数类型 */
  params: AnyObject | (() => AnyObject);
  pageKey?: string;
  /** 是否通过onReachBottom自动加载下一页 */
  isPage?: boolean;
  /** 自动加载首页 */
  autoLoadFirst?: boolean;
  /** 是否在取得token后才开始加载 */
  needLogined?: boolean;
  /** 每次请求结束后的回调 */
  fetchAfter?: () => void;
  /** 在分包中使用 */
  onReachBottom?: (fn: any) => void;
}

export function useListPaging<T = any>(option: PagingOption) {
  const UserStore = useUserStoreWithOut();
  const isPage = typeof option.isPage === 'boolean' ? option.isPage : true;
  const autoLoadFirst = typeof option.autoLoadFirst === 'boolean' ? option.autoLoadFirst : true;
  const pageKey = typeof option.pageKey === 'string' ? option.pageKey : 'page';

  const params = {
    [pageKey]: 1,
    page_size: 10,
  };

  const isLoading = ref(false);
  const isEnd = ref(false);
  const isError = ref(false);
  const data = ref<T[][]>([]);
  const fetch = debounce(
    () => {
      const apiParams = {
        ...params,
        ...(typeof option.params === 'function' ? option.params() : unref(option.params)),
      };
      isLoading.value = true;
      console.log('apiParams', apiParams);

      return option
        .api(apiParams)
        .then((res) => {
          if (res.data?.length) {
            data.value[Number(apiParams[pageKey]) ? Number(apiParams[pageKey]) - 1 : 0] = res.data;
          }
          if (apiParams[pageKey] >= res.last_page) {
            isEnd.value = true;
          }
        })
        .catch((err) => {
          console.log('分页数据加载失败1：', err);
          isError.value = true;
        })
        .finally(() => {
          isLoading.value = false;
          option.fetchAfter?.();
        });
    },
    100,
    { leading: true, trailing: false },
  );
  const next = () => {
    if (!isLoading.value && !isEnd.value) {
      typeof params[pageKey] === 'number' && (params[pageKey] += 1);
      fetch();
    }
  };
  const retry = () => fetch();
  const refresh = () => {
    isEnd.value = false;
    isLoading.value = false;
    isError.value = false;
    data.value = [];
    params[pageKey] = 1;
    retry();
  };
  if (autoLoadFirst) {
    if (option.needLogined) {
      watch(
        () => UserStore.getToken,
        (token) => {
          if (token && !isLoading.value) {
            fetch();
          }
        },
        { immediate: true },
      );
    } else {
      fetch();
    }
  }

  if (isPage) {
    const fn = option.onReachBottom || onReachBottom;
    fn(() => {
      next();
    });
  }
  return {
    data,
    isLoading,
    isEnd,
    isError,
    next,
    retry,
    refresh,
  };
}
