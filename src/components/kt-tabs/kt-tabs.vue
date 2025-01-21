<script lang="ts">
  import { defineComponent, reactive, toRefs } from 'vue';
  import { useAppStoreWithOut } from '/@/store';
  import { addUnit, getPx, queryAllRect, queryRect } from '/@/utils';
  import { TabsEmits, TabsProps } from './props';
  /**
   * Tabs 标签
   * @description tabs标签组件，在标签多的时候，可以配置为左右滑动，标签少的时候，可以禁止滑动。 该组件的一个特点是配置为滚动模式时，激活的tab会自动移动到组件的中间位置。
   * @tutorial https://www.uviewui.com/components/tabs.html
   * @property {String | Number}	duration			滑块移动一次所需的时间，单位秒（默认 200 ）
   * @property {String | Number}	swierWidth			swiper的宽度（默认 '750rpx' ）
   * @property {String}	keyName	 从`list`元素对象中读取的键名（默认 'name' ）
   * @event {Function(index)} change 标签改变时触发 index: 点击了第几个tab，索引从0开始
   * @event {Function(index)} click 点击标签时触发 index: 点击了第几个tab，索引从0开始
   * @example <u-tabs :list="list" :is-scroll="false" :current="current" @change="change"></u-tabs>
   */

  export default defineComponent({
    name: 'KtTabs',
    props: TabsProps,
    emits: TabsEmits,
    setup() {
      const pageData = reactive<{
        firstTime: boolean;
        scrollLeft: number;
        scrollViewWidth: number;
        lineOffsetLeft: number;
        tabsRect: Partial<UniApp.NodeInfo>;
        innerCurrent: number;
        moving: boolean;
      }>({
        firstTime: true,
        scrollLeft: 0,
        scrollViewWidth: 0,
        lineOffsetLeft: 0,
        tabsRect: {
          left: 0,
        },
        innerCurrent: 0,
        moving: false,
      });

      const AppStore = useAppStoreWithOut();
      return { addUnit, AppStore, ...toRefs(pageData) };
    },
    computed: {
      textStyle() {
        return (index) => {
          // 取当期是否激活的样式
          const style = index === this.innerCurrent ? this.activeStyle : this.inactiveStyle;
          return style;
        };
      },
    },
    watch: {
      current: {
        immediate: true,
        handler(newValue) {
          // 内外部值不相等时，才尝试移动滑块
          if (newValue !== this.innerCurrent) {
            this.innerCurrent = newValue;
            this.$nextTick(() => {
              this.resize();
            });
          }
        },
      },
      // list变化时，重新渲染list各项信息
      list() {
        this.$nextTick(() => {
          this.resize();
        });
      },
    },
    async mounted() {
      this.init();
    },
    methods: {
      setLineLeft() {
        const tabItem = this.list[this.innerCurrent];
        if (!tabItem) {
          return;
        }
        // 获取滑块该移动的位置
        const lineOffsetLeft = this.list
          .slice(0, this.innerCurrent)
          .reduce((total, curr) => total + Number(curr.rect?.width), 0);
        // 获取下划线的数值px表示法
        const lineWidth = getPx(this.lineWidth);
        this.lineOffsetLeft = lineOffsetLeft + (Number(tabItem.rect?.width) - lineWidth) / 2;
        // 如果是第一次执行此方法，让滑块在初始化时，瞬间滑动到第一个tab item的中间
        // 这里需要一个定时器，因为在非nvue下，是直接通过style绑定过渡时间，需要等其过渡完成后，再设置为false(非第一次移动滑块)
        if (this.firstTime) {
          setTimeout(() => {
            this.firstTime = false;
          }, 10);
        }
      },
      // 点击某一个标签
      clickHandler(item, index) {
        // 因为标签可能为disabled状态，所以click是一定会发出的，但是change事件是需要可用的状态才发出
        this.$emit('click', {
          ...item,
          index,
        });
        // 如果disabled状态，返回
        if (item.disabled) {
          return;
        }
        if (this.innerCurrent !== index) {
          this.innerCurrent = index;
          this.resize();
          this.$emit('change', {
            ...item,
            index,
          });
        }
      },
      init() {
        setTimeout(() => {
          this.resize();
        }, 150);
      },
      setScrollLeft() {
        // 当前活动tab的布局信息，有tab菜单的width和left(为元素左边界到父元素左边界的距离)等信息
        const tabRect = this.list[this.innerCurrent];
        // 累加得到当前item到左边的距离
        const offsetLeft = this.list.slice(0, this.innerCurrent).reduce((total, curr) => {
          return total + Number(curr.rect?.width);
        }, 0);

        // 此处为屏幕宽度
        const windowWidth = this.AppStore.getSystemInfo.windowWidth;
        // 将活动的tabs-item移动到屏幕正中间，实际上是对scroll-view的移动
        let scrollLeft =
          offsetLeft -
          (Number(this.tabsRect?.width) - Number(tabRect.rect?.width)) / 2 -
          (windowWidth! - Number(this.tabsRect?.right)) / 2 +
          Number(this.tabsRect?.left) / 2;
        // 这里做一个限制，限制scrollLeft的最大值为整个scroll-view宽度减去tabs组件的宽度
        scrollLeft = Math.min(scrollLeft, this.scrollViewWidth - Number(this.tabsRect.width));
        this.scrollLeft = Math.max(0, scrollLeft);
      },
      // 获取所有标签的尺寸
      resize() {
        // 如果不存在list，则不处理
        if (this.list.length === 0) {
          return;
        }
        Promise.all([this.getTabsRect(), this.getAllItemRect()]).then(
          ([tabsRect, itemRect = []]) => {
            this.tabsRect = tabsRect;
            this.scrollViewWidth = 0;
            itemRect.forEach((item, index) => {
              item = Object.prototype.toString.call(item) === '[object Object]' ? item : item[0];
              // 计算scroll-view的宽度，这里
              this.scrollViewWidth += item.width!;
              // 另外计算每一个item的中心点X轴坐标
              this.list[index].rect = item;
            });
            // 获取了tabs的尺寸之后，设置滑块的位置
            this.setLineLeft();
            this.setScrollLeft();
          },
        );
      },
      // 获取导航菜单的尺寸
      getTabsRect(): Promise<UniApp.NodeInfo> {
        return new Promise((resolve) => {
          queryRect('.u-tabs__wrapper__scroll-view', this).then((size) =>
            resolve(size as UniApp.NodeInfo),
          );
        });
      },
      // 获取所有标签的尺寸
      getAllItemRect(): Promise<UniApp.NodeInfo[]> {
        return new Promise((resolve) => {
          const promiseAllArr = this.list.map((_item, index) =>
            queryAllRect(`.u-tabs__wrapper__nav__item-${index}`, this),
          );
          Promise.all(promiseAllArr).then((sizes) => resolve(sizes as UniApp.NodeInfo[]));
        });
      },
    },
  });
</script>

<template>
  <view class="u-tabs">
    <view class="u-tabs__wrapper">
      <slot name="left"></slot>
      <view class="u-tabs__wrapper__scroll-view-wrapper">
        <scroll-view
          ref="u-tabs__wrapper__scroll-view"
          :scroll-x="scrollable"
          :scroll-left="scrollLeft"
          scroll-with-animation
          class="u-tabs__wrapper__scroll-view scrollbar-none"
          :show-scrollbar="false"
        >
          <view ref="u-tabs__wrapper__nav" class="u-tabs__wrapper__nav" :style="wrapperStyle">
            <view
              v-for="(item, index) in list"
              :key="index"
              :ref="`u-tabs__wrapper__nav__item-${index}`"
              class="u-tabs__wrapper__nav__item"
              :style="{ ...itemStyle, flex: scrollable ? '' : 1 }"
              :class="[`u-tabs__wrapper__nav__item-${index}`]"
              @tap="clickHandler(item, index)"
            >
              <text class="u-tabs__wrapper__nav__item__text" :style="textStyle(index)">
                {{ item[keyName] }}
              </text>
            </view>

            <view
              v-if="showLine"
              ref="u-tabs__wrapper__nav__line"
              class="u-tabs__wrapper__nav__line"
              :style="{
                width: addUnit(lineWidth),
                transform: `translate(${lineOffsetLeft}px)`,
                transitionDuration: `${firstTime ? 0 : duration}ms`,
                height: addUnit(lineHeight),
                background: lineColor,
                backgroundSize: lineBgSize,
              }"
            />
          </view>
        </scroll-view>
      </view>
      <slot name="right"></slot>
    </view>
  </view>
</template>

<style lang="scss">
  @mixin flex($direction: row) {
    display: flex;
    flex-direction: $direction !important;
  }

  .u-tabs {
    display: flex;
    flex-direction: column;
    flex: 0 0 auto;
    align-items: stretch;
    align-content: flex-start;

    view,
    scroll-view,
    swiper-item {
      @extend .u-tabs;
    }

    &__wrapper {
      @include flex;

      align-items: center !important;

      &__scroll-view-wrapper {
        flex: 1 !important;

        /* #ifndef APP-NVUE */
        overflow: auto hidden;

        /* #endif */
      }

      &__scroll-view {
        @include flex;

        flex: 1 !important;
      }

      &__nav {
        @include flex;

        position: relative;
        min-width: 750rpx;

        &__item {
          @include flex;

          padding: 0 11px;
          font-weight: normal;
          flex: 1 0 auto !important;
          align-items: center !important;
          justify-content: center !important;

          &__text {
            font-size: 15px;
            color: #c3c6cc;
          }
        }

        &__line {
          height: 3px;
          background: white;
          width: 30px;
          position: absolute;
          bottom: 2px;
          border-radius: 100px;
          transition-property: transform;
          transition-duration: 300ms;
        }
      }
    }
  }
</style>
