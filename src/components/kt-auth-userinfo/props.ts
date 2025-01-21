enum Gender {
  unknow,
  man,
  woman,
}
export interface UserInfo {
  avatarUrl: string;
  nickName: string;
  gender: Gender;
  city: string;
  province: string;
  country: string;
  language: string;
}

export const userinfoProps = {
  value: {
    type: Object,
  },
  /**
   * @description 按钮的宽度
   */
  width: {
    type: String,
    default: 'auto',
  },
  /**
   * @description 按钮的高度
   */
  height: {
    type: String,
    default: 'auto',
  },
  wrapClass: {
    type: [String, Object, Array],
    default: '',
  },
  /**
   * @description 页面onShow的次数，设置required后由于拒绝授权会打开setting页面，后无法判断是否启用相关权限，需要通过监听此参数判断是否触发onShow
   */
  count: {
    type: Number,
    default: 0,
  },
  /**
   * @description 是否使用新的的getUserProfile接口,不使用的场景下不渲染template插槽,因为getUserProfile必须通过点击事件触发
   * @default false
   */
  compat: {
    type: Boolean,
    default: false,
  },
  /**
   * @description 设置required后会在拒绝授权后弹框提示去设置页打开权限
   */
  required: {
    type: Boolean,
    default: false,
  },
  /**
   * @description 使用getUserInfo场景时,是否加载后立即授权
   * @default false
   */
  autoAuth: {
    type: Boolean,
    default: true,
  },
};

export const userinfoEmits = {
  /**
   * @description v-model:value双向绑定用户信息，未授权或者拒绝时是默认的用户信息
   */
  'update:value': function (userInfo: Partial<UniApp.GetUserInfoRes['userInfo']>) {
    return userInfo;
  },
  /**
   * @description 调用获取用户信息成功回调
   */
  updateUserInfo(userInfo: Partial<UniApp.GetUserInfoRes['userInfo']>) {
    return userInfo;
  },
  /**
   * @description 用户拒绝授权或者调用APi失败的回调
   */
  userReject(err) {
    return err;
  },
};
