import { useAppStoreWithOut } from '../../store/modules/app';
import { useUserStoreWithOut } from '../../store/modules/user';
import type { Ref } from 'vue';
import { unref } from 'vue';
import { recordUv } from '../../api/public';
// @ts-expect-error
import { mid } from '/@/constants';

const AppStore = useAppStoreWithOut();
const UserStore = useUserStoreWithOut();

export enum UvNodeKeys {
  show = 1,
  hide = 2,
  rewarded = 3,
  save = 4,
  again = 5,
  banner = 6,
  hot = 7,
  list = 8,
  share = 9,
  shoot = 10,
  'prompt' = 11,
  'prompt-list' = 12,
  'prompt-back' = 13,
  search = 14,
  pay = 15,
  login = 16,
  reward = 17,
  payed = 18,
  drawResult = 30,
  drawIcon = 31,
  drawInvite = 32,
  drawSuccess = 33,
  drawGo = 34,
  drawIndex = 35,
  drawFission = 36,
}

export type UvNodeKey = keyof typeof UvNodeKeys;
/**
 * @description 产品记录UV相关数据
 */
export function useRecordUv(form: UvNodeKey | number, curriculum_id: Ref<number> | number) {
  let type: number;
  const app_name = AppStore.getSystemInfo.hostName || AppStore.getSystemInfo.AppPlatform;
  /*
   * form 表示UV使用场景
   */

  if (/^\d+$/.test(form.toString())) {
    type = form as number;
  } else {
    switch (form) {
      case 'show':
        type = 1;
        break;
      case 'hide':
        type = 2;
        break;
      case 'rewarded':
        type = 3;
        break;
      case 'save':
        type = 4;
        break;
      case 'again':
        type = 5;
        break;
      case 'banner':
        type = 6;
        break;
      case 'hot':
        type = 7;
        break;
      case 'list':
        type = 8;
        break;
      case 'share':
        type = 9;
        break;
      case 'shoot':
        type = 10;
        break;
      case 'prompt':
        type = 11;
        break;
      case 'prompt-list':
        type = 12;
        break;
      case 'prompt-back':
        type = 13;
        break;
      case 'search':
        type = 14;
        break;
      case 'pay':
        type = 15;
        break;
      case 'login':
        type = 16;
        break;
      case 'reward':
        type = 17;
        break;
      case 'payed':
        type = 18;
        break;
      case 'drawResult':
        type = 30;
        break;
      case 'drawIcon':
        type = 31;
        break;
      case 'drawInvite':
        type = 32;
        break;
      case 'drawSuccess':
        type = 33;
        break;
      case 'drawGo':
        type = 34;
        break;
      case 'drawIndex':
        type = 35;
        break;
      case 'drawFission':
        type = 36;
        break;
      default:
        type = 1;
        break;
    }
  }
  return recordUv({
    node_id: type || 1,
    type: app_name === 'Toutiao' ? 2 : 1,
    mid,
    openid: UserStore.getOpenid,
    agent_id: UserStore.getAgentId,
    spread_id: UserStore.getSpreadId,
    curriculum_id: unref(curriculum_id),
  });
}

export default useRecordUv;
