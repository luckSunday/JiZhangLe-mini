export interface GetWithdrawRecordModule {
  date: string;
  money: string;
  record_id: number;
  status: number;
  user_id: number;
  fail_info: string;
}

export interface WithdrawInfoModule {
  alipay_account: string;
  alipay_name: string;
}
