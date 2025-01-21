import { store } from '../index';
import { useStorage } from '../storage';
import { defineStore } from 'pinia';
import type { CouponModal } from '../../api/mine/model';

// @ts-expect-error
import { PlatformName } from '/@/constants';

export interface PublicState {
  /** 客服页链接 */
  customer_url: string;
  /** 打卡作业的奖励详情(优惠券) */
  punchInAwards: CouponModal[];
}

const storage = useStorage<keyof PublicState>({ key: 'PUBLIC_STORE_' });

export const usePublicStore = defineStore({
  id: 'public',
  state: (): PublicState => ({
    // #ifdef H5
    customer_url: 'https://work.weixin.qq.com/kfid/kfce8f92ccdf308cfb0',
    // #endif
    // #ifndef H5
    // @ts-expect-error
    customer_url:
      PlatformName === 'mp-toutiao'
        ? 'https://chatlink.duokefu.vip/widget/chat.html?eid=4fbc17db8fd4929a6646ae5ec9e7e811'
        : 'https://2gidcym.cschat-ccs.aliyun.com/index.htm?tntInstId=_2giDcym&scene=SCE00012085&cinfo=9WOKrz1tiI4RG8Gvg7QrNGx8ebgsgaSA7jpu1LRfNnwcN9VzfbXoH46F5NjPJaH6n9AV2dxcXSQh550Aji0F3GgsVZqlNPoPOBzuNk0I2MCT4vnkaxUum%2BDBEVj7dPzJMeH2v36uH3yUMpmidnOd817fFEsJ2Ognh%2BK2fI2oine3UvEZ9bpiLRPDwYRau%2FYseYPkbzI7uJw%2FLqMR1QnzLSKemLSgik84sYAvqWUX%2BNcwjMC0Dy4%2Fq6mV5M49hnzXXNzbdLg0JL6NIGezGZIPu2QKOYNlRyopCVhX%2FeXARnIJ%2FqeABGmDCrlDJNnky840rx6pCpmR3jZRUgO3Ng52IkogViKKeGGd1UY3jQm%2F1tahXtVD6aZPGSPqrCMeVTEepbMiz%2BuUDWLXmfDifTa4rA%3D%3D&key=alND3Lf2jQ7oXFZzxLr%2BuvjOJg67uw56lxTg3bOijAMnYhjgUuBwZgkvzSQyHqAgvPqWdfb7kPiX0%2F0s1VDtPx7g52sJRfY6UjS0RLFIrwNWKQdF5%2B7fSqsgYyyi1K9qWibNVHJtROANpAmFt53%2F5Cb3H%2Bi9NYoetR2QLqL4MR1NA6ankgbFJViv8XBpxJLYPe3cE9h1aFbWJeKXiZvwzwtlbLJFYFKt79KRgmAgxpHapxg%2FTw%2FDx%2BmsRBYCYcsH7PzbqJRkAlWnvKm8X9lIPHp%2FzYQegLv44BdaT3QEIKj8byfwZx14QDZBJHvPRY7adID00xjldmg3DA%2BiNy6WkA%3D%3D%22#/',
    // #endif
    punchInAwards: [],
  }),
  getters: {
    getCustomerUrl(): string {
      return this.customer_url || storage.getItem('customer_url');
    },
  },
  actions: {
    setCustomerUrl(url: string) {
      this.customer_url = url;
      storage.setItem('customer_url', url);
    },
    setPunchInAwards(info: CouponModal[]) {
      this.punchInAwards = info;
    },
  },
});

export function usePublicStoreWithOut() {
  return usePublicStore(store);
}
