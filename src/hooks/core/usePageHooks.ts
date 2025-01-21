import {
  onHide,
  onLoad,
  onPageScroll,
  onPullDownRefresh,
  onReachBottom,
  onReady,
  onResize,
  onShow,
  onUnload,
} from '@dcloudio/uni-app';
import type { ComponentInternalInstance } from 'vue';
import { getCurrentInstance, inject, onBeforeMount, provide, reactive } from 'vue';
import { useAppStoreWithOut } from '../../store';
import { onPageInit } from '../event/onPageInit';
const appStore = useAppStoreWithOut();
const event = {
  onLoad,
  onShow,
  onReady,
  onPullDownRefresh,
  onPageInit,
  onHide,
  onUnload,
  onReachBottom,
  onPageScroll,
  onResize,
};

type FnEvent = (params: any) => void;

type eventArr = keyof typeof event;
interface DataHooks {
  [uid: number]: {
    /** 收集已触发事件参数，例如onLoad,onshow页面比组件更快执行 */
    triggered?: Record<eventArr, any>;
  } & {
    [k in eventArr]?: FnEvent[];
  };
}

interface InitPageHooks {
  hooks: (
    | 'onPageInit'
    | 'onLoad'
    | 'onShow'
    | 'onReady'
    | 'onHide'
    | 'onPullDownRefresh'
    | 'onUnload'
    | 'onReachBottom'
    | 'onPageScroll'
    | 'onResize'
  )[];
  loadOrShow?: boolean;
}

const data = reactive<DataHooks>({});

/** 设置生命周期事件 */
export function setEvent({ uid, key, fn }: { uid: number; key: eventArr; fn?: any }) {
  if (!data[uid]) {
    return;
  }
  const fns = data[uid][key];
  fns ? fns.push(fn) : (data[uid][key] = [fn]);
}

/** 触发生命周期事件 */
export function handleEvent({ uid, key, params }: { uid: number; key: string; params?: any }) {
  data[uid]?.[key]?.forEach((handler) => {
    handler(params || {});
  });
  if (['onLoad', 'onShow', 'onPageInit'].includes(key)) {
    !data[uid]?.triggered && (data[uid].triggered = {} as Record<eventArr, any>);
    data[uid].triggered![key] = params || {};
  }
}

/**
 * 页面级调用
 */
export function initPageHooks(opt?: InitPageHooks) {
  // #ifdef MP
  onResize((res) => {
    if (
      res &&
      res.screenRatio &&
      (Number(res.screenRatio) === 1 || String(res.screenRatio) === '1')
    ) {
      appStore.setIsFullScreen(true);
    } else {
      appStore.setIsFullScreen(false);
    }
  });
  // #endif

  const { hooks = ['onPageInit'], loadOrShow = false } = opt || {};
  const instance = getCurrentInstance();
  // #ifdef APP-PLUS-NVUE
  const uid = instance?.attrs.__pageId;
  // #endif
  // #ifndef APP-PLUS-NVUE
  const uid = instance?.uid;
  // #endif

  if (!uid) {
    throw new Error('getCurrentInstance().uid is undefined');
  }

  provide('PAGEUID', uid);
  data[uid] = {};

  hooks.forEach((key) => {
    if (key === 'onPageInit') {
      event[key]((params?: AnyObject) => {
        handleEvent({ uid, key, params });
      }, loadOrShow);
    } else {
      event[key]((params?: AnyObject) => {
        handleEvent({ uid, key, params });
      });
    }
  });

  onUnload(() => {
    delete data[uid];
  });
}

/**
 * 组件级调用
 */
export function usePageHooks() {
  const instance = getCurrentInstance() as ComponentInternalInstance & { provides: any };

  const hooks = {} as Record<keyof typeof event, (fn: FnEvent) => void>;

  function initEvent({ uid, key, fn }) {
    if (!uid) {
      throw new Error('页面initPageHooks()异常');
    }
    // 有已触发事件参数时默认回调一次
    data[uid]?.triggered?.[key] && fn(data[uid].triggered![key]);

    setEvent({ uid, key, fn });
  }

  for (const key of Object.keys(event) as (keyof typeof event)[]) {
    hooks[key] = (fn: FnEvent) => {
      let uid: number;

      // #ifdef MP
      onBeforeMount(() => {
        uid = instance?.provides?.PAGEUID;
        initEvent({ uid, key, fn });
      });
      // #endif

      // #ifndef MP
      uid = inject('PAGEUID') as number;
      initEvent({ uid, key, fn });
      // #endif
    };
  }

  return hooks;
}
