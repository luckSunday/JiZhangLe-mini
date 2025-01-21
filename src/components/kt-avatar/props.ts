import { defaultRolePhoto } from '/@/enums/details';

export const Props = {
  size: {
    type: Number,
    default: 64,
  },
  // #ifdef MP-TOUTIAO
  url: {
    default: defaultRolePhoto.user,
    type: String,
  },
  // #endif
  // #ifdef H5
  url: {
    default: defaultRolePhoto.customer,
    type: String,
  },
  // #endif
  border: {
    type: Number,
    default: 0,
  },
  borderColor: {
    type: String,
    default: '',
  },
};
