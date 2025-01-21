import { ref, watch } from 'vue';
import { onLoad, onShow } from '@dcloudio/uni-app';
import { useUserStoreWithOut } from '../../store/modules/user';

/**
 * @description 生命周期方法，监听了获取openid的回调
 * @param {function} func 回调方法，包含了页面启动参数
 * @param {boolean} loadOrShow = [false] onShow是否也触发回调
 */
export function onPageInit(func: (option: Record<string, any>) => void, loadOrShow = false) {
  console.log('执行了');

  const userStore = useUserStoreWithOut();
  const pageIsLoad = ref(false);
  const pageShowCount = ref(0);
  const options = ref<AnyObject>({});
  onLoad((query) => {
    options.value = query || {};
    pageIsLoad.value = true;
  });
  if (loadOrShow) {
    onShow(() => {
      pageShowCount.value += 1;
    });
  }

  watch(
    () =>
      loadOrShow
        ? [userStore.getOpenid, pageIsLoad.value, pageShowCount.value]
        : [userStore.getOpenid, pageIsLoad.value],
    (obj) => {
      if (obj.every(Boolean)) {
        func(options.value);
      }
    },
    { immediate: true },
  );

  return { options };
}
