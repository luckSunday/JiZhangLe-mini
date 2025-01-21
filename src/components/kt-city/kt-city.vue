<!--
* @description  省市县选择器
* @fileName  kt-city
* @author chengwei
* @date 2022-11-15 17:12:01
-->
<script lang="ts">
  import type { PropType } from 'vue';
  import { defineComponent, ref, unref, watch } from 'vue';
  import CityData from '/@/utils/city.data';
  import { debounce } from 'lodash';

  export default defineComponent({
    name: 'KtCity',
    inheritAttrs: false,
    props: {
      value: {
        type: Array as unknown as PropType<[string, string, string]>,
        default: () => [],
      },
    },
    emits: {
      change: (_e: { detail: { value: [string, string, string] } }) => true,
    },
    setup(props, { emit }) {
      const modelValue = ref([0, 0, 0]);

      /** 初始化省市县列表 */
      const initRange = (value: number[]) => {
        const city = CityData[value[0]].children;
        return [CityData, city, city[value[1]].children];
      };
      const range = ref<{ text: string; children?: { text: string }[] }[][]>(initRange([0, 0, 0]));

      // 记录列的滑动变化，动态设置二三级列表
      const columnChangeState = [0, 0, 0];
      const onColumnChange = debounce(function ({ detail: { column, value } }) {
        columnChangeState[column] = value;
        switch (column) {
          case 0:
            range.value[1] = CityData[value].children;
            range.value[2] = CityData[value].children[0].children || [];
            break;
          case 1:
            range.value[2] = range.value[1][columnChangeState[1]].children || [];
            break;
        }
      }, 20);

      function onChange({ detail: { value } }) {
        modelValue.value = value;
        // range.value = initRange(value);
        emit('change', {
          detail: {
            value: value.map((v, i) => unref(range)[i][v].text),
          },
        });
      }

      /** value回显 */
      watch(
        () => props.value,
        (values) => {
          const value: number[] = [];
          value[0] = CityData.findIndex((v) => v.text === values?.[0]);
          if (value[0] !== -1) {
            value[1] = CityData[value[0]]?.children.findIndex((v) => v.text === values?.[1]);
            if (value[1] !== -1) {
              value[2] = CityData[value[0]]?.children?.[value[1]].children?.findIndex(
                (v) => v.text === values?.[2],
              );
            }
          }
          if (value.every((v) => v !== -1)) {
            modelValue.value = value;
            range.value = initRange(value);
          }
        },
        { immediate: true },
      );

      return {
        modelValue,
        range,
        onChange,
        onColumnChange,
      };
    },
  });
</script>

<template>
  <picker
    style="z-index=9999999"
    :class="$attrs.class"
    mode="multiSelector"
    :value="modelValue"
    :range="range"
    range-key="text"
    @change="onChange"
    @columnchange="onColumnChange"
  >
    <slot></slot>
  </picker>
</template>

<style lang="scss"></style>
