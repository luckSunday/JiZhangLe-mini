<script setup lang="ts">
  import { ref } from 'vue';
  import { useRoute } from '/@/hooks/core/useRoute';
  import { debounce } from 'lodash';
  import { getBrowsingHistory } from '/@/api/user';
  import { onPageInit } from '/@/hooks/event/onPageInit';
  import dayjs from 'dayjs';

  const headerHeight = ref(0);
  const page = ref(1);
  const last_page = ref(1);
  const historyList = ref([]);
  const total = ref(-1);
  const today = ref(dayjs().format('YYYY-MM-DD'));
  const yesterday = ref(dayjs(today.value).subtract(1, 'day').format('YYYY-MM-DD'));

  onPageInit(() => {
    getData();
  });

  // 请求数据
  const getData = debounce(() => {
    console.log('请求数据');
    if (page.value > last_page.value) return;
    getBrowsingHistory({ page: `${page.value}`, page_size: '10' })
      .then((res) => {
        historyList.value = page.value === 1 ? res.data : historyList.value.concat(res.data);
        console.log('getBrowsingHistory', historyList.value, res);
        page.value++;
        last_page.value = res.last_page;
        total.value = res.total;
      })
      .catch(() => {
        total.value === -1 && (total.value = 0);
      });
  }, 200);
  function goInfo(product_id) {
    // 菜单跳转
    useRoute({
      url: '/pages/shareDetails/shareDetails',
      params: {
        product_id,
      },
    });
  }
</script>

<template>
  <kt-layout
    v-model:headerHeight="headerHeight"
    height-mode="fixed"
    background="#F6F6F6"
    :header="{ title: '浏览历史' }"
  >
    <scroll-view
      scroll-y
      class="w-screen"
      @scrolltolower="getData"
      lower-threshold="100"
      :style="{ height: 'calc(100vh - var(--status-bar-height) - 140rpx)' }"
    >
      <template v-if="total > 0">
        <view v-for="(i, index) in historyList" :key="index" class="w-full px-8 overflow-hidden">
          <view class="w-full text-center mt-18 text-xs font-medium text-[#8D939F]">
            ——{{ i.date === today ? ' 今日 ' : i.date === yesterday ? ' 昨日 ' : i.date }}——
          </view>
          <view
            class="flex justify-between w-full px-12 py-16 mt-16 overflow-hidden bg-white rounded"
            @click="goInfo(i.product_id)"
          >
            <view class="flex flex-shrink-0 h-25 text-[#FE2C55] w-75 mr-15 text-mini font-semibold">
              <view
                class="px-10 rounded-full h-25 leading-25 text-ellipsis"
                style="
                  background: linear-gradient(
                    149deg,
                    rgba(255, 57, 157, 0.1) 18.67%,
                    rgba(255, 5, 94, 0.1) 92.98%
                  );
                "
              >
                {{ i?.product?.seconds_category?.title || '' }}
              </view>
            </view>
            <view class="flex-1 w-0 pr-26 text-ellipsis">
              {{ i?.product?.title || '' }}
            </view>
            <image
              src="https://ttmini.yizhiwechat.com/ugc/mine/right-icon.png"
              mode="scaleToFill"
              class="flex-shrink-0 w-18 h-18"
            />
          </view>
        </view>
        <view v-if="page > last_page" class="h-100" />
      </template>
      <template v-else-if="total !== -1">
        <view class="w-full pt-111">
          <image
            src="https://ttmini.yizhiwechat.com/ugc/mine/browsing-history-bg.png"
            mode="scaleToFill"
            class="mx-auto w-180 h-180"
          />
          <view class="mt-4 w-full text-center text-base text-[#8D939F] font-semibold"
            >暂无数据</view
          >
        </view>
        <view class="fixed left-0 w-full bottom-88">
          <view
            class="w-259 h-54 mx-auto rounded-[200rpx] flex items-center justify-center text-[#151620] text-base font-semibold bg-[#FFF] mt-16"
            @click="useRoute({ type: 'navigateBack' })"
          >
            返回
          </view>
        </view>
      </template>
    </scroll-view>
  </kt-layout>
</template>

<style scoped lang="scss"></style>
