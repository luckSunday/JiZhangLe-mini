<script lang="ts">
  import { defineComponent, ref, watch } from 'vue';
  import { useUserStoreWithOut } from '/@/store';
  import { authorize } from '/@/utils/auth';
  import { userinfoEmits, userinfoProps } from './props';
  import { showToast } from '/@/utils';
  export default defineComponent({
    name: 'GetUserInfo',
    props: userinfoProps,
    emits: userinfoEmits,
    setup(props, { emit }) {
      const UserStore = useUserStoreWithOut();
      // 是否使用兼容性的getUserInfo api
      const isCompatibility = ref(false);
      function compatibilityUserInfo() {
        // #ifdef MP
        authorize('scope.userInfo', props.required)
          .then(() => {
            uni.getUserInfo({
              success(res) {
                UserStore.setUserInfo(res.userInfo);
                emit('update:value', res.userInfo);
                emit('updateUserInfo', res.userInfo);
              },
              fail(err) {
                console.log(8, err);
                emit('update:value', UserStore.getUserInfo);
                emit('userReject', err);
              },
            });
          })
          .catch((err) => {
            console.log(9, err);
            emit('update:value', UserStore.getUserInfo);
            emit('userReject', err);
          });
        // #endif
      }

      function getUserProfile() {
        if (UserStore.userInfo?.nickName && UserStore.userInfo.avatarUrl) {
          emit('update:value', UserStore.userInfo);
          emit('updateUserInfo', UserStore.userInfo);
          return;
        }

        console.log(1);
        // #ifdef MP
        console.log(2);

        if (uni.canIUse('getUserProfile') && props.compat) {
          console.log(3);
          uni.getUserProfile({
            success(res) {
              console.log(4, res);
              UserStore.setUserInfo(res.userInfo);
              emit('update:value', res.userInfo);
              emit('updateUserInfo', res.userInfo);
            },
            fail(err) {
              console.log(5, err);
              if (err.errNo === 21500) {
                isCompatibility.value = true;
                compatibilityUserInfo();
              }
            },
          });
        } else {
          console.log(6);
          isCompatibility.value = true;
          compatibilityUserInfo();
        }
        // #endif
        console.log(7);
      }

      // 父页面在onShow时递增此参数，用于判断openSetting后是否启用对应权限
      watch(
        () => props.count,
        () => {
          if (isCompatibility.value) {
            compatibilityUserInfo();
          }
        },
      );
      if (props.autoAuth) {
        getUserProfile();
      }
      return { getUserProfile };
    },
  });
</script>

<template>
  <button
    v-if="compat"
    :style="{ width, height }"
    class="flex"
    :class="wrapClass"
    @click="getUserProfile"
  >
    <slot>
      <text
        class="pointer-events-none flex h-full min-h-[78rpx] w-full items-center justify-center rounded-sm bg-danger text-md text-white"
      >
        授权您的用户信息
      </text>
    </slot>
  </button>
</template>
