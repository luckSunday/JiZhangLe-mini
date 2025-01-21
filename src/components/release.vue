<script lang="ts" setup>
  import useRoute from '/@/hooks/core/useRoute';
  import { useUserStoreWithOut } from '/@/store';

  const userStore = useUserStoreWithOut();
  function release() {
    if (Number(userStore.getIsAnchor) === 0) {
      useRoute('/pages/anchorRecruitment/anchorRecruitment');
      return;
    }
    useRoute('/pages/mycontent/createContent');
  }
</script>

<template>
  <!-- 内容发布按钮 -->
  <image
    @click="release"
    src="https://ttmini.yizhiwechat.com/ugc/mine/publishing-content.png"
    mode="scaleToFill"
    class="fixed bottom-20 right-10 w-46 h-46"
  />
</template>

<style lang="scss" scoped></style>
../oldstore../store copy
