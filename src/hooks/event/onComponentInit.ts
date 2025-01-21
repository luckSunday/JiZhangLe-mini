import { onMounted, ref, watch } from 'vue';
import { useUserStoreWithOut } from '../../store/modules/user';

/**
 * @description 组件生命周期方法，监听了获取openid的回调和onMounted
 * @param {function} func 回调方法
 */
export function onComponentInit(func: () => void) {
  const userStore = useUserStoreWithOut();
  const componentIsLoad = ref(false);

  onMounted(() => {
    componentIsLoad.value = true;
  });

  watch(
    () => [userStore.getOpenid, componentIsLoad.value],
    (obj) => {
      if (obj.every(Boolean)) {
        func();
      }
    },
    { immediate: true },
  );
}
