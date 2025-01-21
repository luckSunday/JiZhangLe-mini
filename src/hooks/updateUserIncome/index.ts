import { useUserStoreWithOut } from '/@/store';
import { getUserIncome } from '/@/api/user';
import { onPushErrorForLogge } from '../event/reportErrorLogs';

/**
 * 更新用户收益
 * */
export const updateUserIncome = () => {
  const userStore = useUserStoreWithOut();
  getUserIncome().then((res) => {
    userStore.setMoney(res.money || 0);
    userStore.setWeekIncome(res.week_income);
    userStore.setTotalIncome(res.total_income);
  }).catch(e=>{
    onPushErrorForLogge({
      api_url: '/api/user/getUserIncome',
      code: e.code,
      msg: e.msg,
      query: '',
      route_path: 'updateUserIncome',
    });
  });
};
