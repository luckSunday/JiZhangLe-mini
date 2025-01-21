import { getCustomerUrl as getCustomerUrlApi } from '../../api/user';
import { usePublicStoreWithOut } from '../modules/public';

const PublicStore = usePublicStoreWithOut();

export const setCustomerUrl = (curriculum_id?: number) => {
  // #ifndef MP-TOUTIAO
  const pages = getCurrentPages();
  const prevInit = pages[pages.length - 1];
  getCustomerUrlApi({
    path: prevInit.route || '',
    curriculum_id,
  }).then((url) => {
    PublicStore.setCustomerUrl(url);
  });
  // #endif
};
