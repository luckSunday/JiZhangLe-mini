import { onHide, onLoad, onShow, onUnload } from '@dcloudio/uni-app';
import SnowflakeId from 'snowflake-id';
// import { createConnect, onClose, onMessage, onOpen, sendMessage, getReadyState } from 'yzSocket';
import { ref } from 'vue';
import { getCurrentInstance, inject, onBeforeMount, provide, reactive } from 'vue';
import { useAdviceRoomStoreWithOut, useUserStoreWithOut } from '../../store';

import { showToast } from '../../utils';
import sockeyApi from '../../api/sockeyApi';
import { useRoute } from '/@/hooks/core';
import { ApiUrl } from '/@/constants';
enum MessageCode {
  /** 正常 */
  Normal = 200,
  /** 已在别处登陆 */
  OtherLogin = 507,
}

export const baseUrl = ApiUrl[process.env.NODE_ENV === 'development' ? 'scDevApi' : 'scProdApi'];
const userStore = useUserStoreWithOut();
const adviceStore = useAdviceRoomStoreWithOut();
let timer;
const timerNum = 15000;
const messageCallbacks = new Map();

const guid = () => {
  const id = new SnowflakeId();
  return id.generate();
};
const socketTask = ref();
const is_reconnecting = ref(false); // 是否重连中
const hostUrl = ref(baseUrl);
const need_reconnect = ref(true); // 断开后是否需要重连

function initSocket() {
  need_reconnect.value = true;
  socketTask.value = uni.connectSocket({
    url: hostUrl.value,
    header: {
      'content-type': 'application/json',
    },
    complete: () => {},
    success: (e) => {
      console.log('successsuccess', e);
    },
  });
  addListens();
}
function addListens() {
  console.log('添加监听-------', checkSocket());
  if (checkSocket()) {
    socketTask.value.onOpen(onOpen);
    socketTask.value.onError(onError);
    socketTask.value.onClose(onClose);
    socketTask.value.onMessage(onMessage);
  }
}
const onError = (error) => {
  console.error('WebSocket 发生错误-------:', error);
  socketTask.value = null;
};
const onClose = (e) => {
  socketTask.value = null;
  console.log('需要重连-------', e);
  need_reconnect.value && reconnect();
};
// onUnload(() => {
//   console.log('onUnload');
//   const page = getCurrentPages();
//   const uid = page[page.length - 1].route;
//   messageCallbacks.delete(uid);
//   if (timer) {
//     clearTimeout(timer);
//   }
// });
// onHide(() => {
//   console.log('onHide');
// });

const sendMessage = (msg, callBack?) => {
  console.log('发送消息', msg);
  if (!msg) {
    throw new Error('send value dont empty');
  }
  if (checkSocket()) {
    socketTask.value?.send({
      data: msg,
    });
    callBack && callBack(msg);
  }
};
function onOpen() {
  console.log('cocket已经成功连上---------');
  loginSpcket();
}
function loginSpcket() {
  sendMsg(sockeyApi.LOGIN, { token: userStore.getToken });
}
function reconnect() {
  if (!is_reconnecting.value) {
    is_reconnecting.value = true;
    setTimeout(() => {
      closeSocket();
      socketTask.value = null;
      initSocket();
      is_reconnecting.value = false;
    }, 2000);
  }
}
/**
 * @description 发送消息的实际方法
 * @param {function} router 路由
 * @param {boolean} params = 发送的消息体
 * @param {boolean} isHeartBeat = 是否为心跳
 * @param {boolean} callBack = [false] callBack 发送之后不管成功不成功都触发
 */
function sendMsg(router, params = {}, isHeartBeat?, callBack?) {
  if (!socketTask.value) {
    return;
  }
  let data = JSON.stringify(buildSendParam(router, params));
  if (isHeartBeat) {
    data = router;
  }
  sendMessage(data, callBack);
}
function onMsg(callback) {
  const page = getCurrentPages();
  const uid = page[page.length - 1].route;

  if (!uid) {
    throw new Error('getCurrentInstance().uid is undefined');
  }
  onShow(() => {
    if (userStore.getToken && socketTask.value && socketTask.value.readyState !== 1) {
      socketTask.value = null;
      reconnect();
    }
  });
  onUnload(() => {
    const page = getCurrentPages();
    const uid = page[page.length - 1].route;
    messageCallbacks.delete(uid);
    if (timer) {
      clearTimeout(timer);
    }
  });
  let arr: Array<() => void> = [];
  if (messageCallbacks.has(uid)) {
    arr = messageCallbacks.get(uid);
  }
  arr.push(callback);
  messageCallbacks.set(uid, arr);
}

function checkSocket() {
  if (!socketTask.value || !socketTask.value) {
    throw new Error('place init firct or createConnect');
  }
  return true;
}

function onMessage(message) {
  if (timer) {
    clearTimeout(timer);
  }
  if (!socketTask.value) {
    return;
  }
  timer = setTimeout(function () {
    sendMsg(sockeyApi.HeartBeat, {}, true);
  }, timerNum);
  const { data } = message;
  const dataJson = JSON.parse(data);
  console.log('dataJson.code^^^^^^^', dataJson);
  if (dataJson.code === MessageCode.Normal) {
    if (dataJson.data !== 'HeartBeat') {
      console.log('dataJson.data 收到消息-------------------------->');
      // #ifdef MP
      if (
        dataJson.router === sockeyApi.newMessage &&
        dataJson.data.consulting_id !== adviceStore.consultingId
      ) {
        console.log('需要震动');
        uni.vibrateLong({
          success(res) {
            console.log(res);
          },
          fail(err) {
            console.log(`vibrateShort调用失败`, err);
          },
        });
      }
      // #endif

      messageCallbacks.forEach((item) => {
        if (item && item.length) {
          item.forEach((callback) => {
            callback(dataJson);
          });
        }
      });
    }
  } else if (dataJson.code === MessageCode.OtherLogin) {
    closeSocket();
    // #ifdef H5
    showToast(dataJson.msg);
    useRoute({
      type: 'reLaunch',
      url: '/pages/login/bind-phone',
    });
    uni.showTabBar();
    // #endif
    // #ifdef MP
    uni.showModal({
      title: '重要提示',
      content: dataJson.msg,
    });
    // #endif
  } else {
    showToast(dataJson.msg);
  }
}

function buildSendParam(router, params) {
  const message_id = guid();
  const obj = {
    router,
    params,
    message_id,
  };
  return obj;
}

function closeSocket() {
  need_reconnect.value = false;
  socketTask.value?.close({
    success: () => {
      console.log('关闭成功');
    },
  });
}

export { onMsg, sendMsg, initSocket, closeSocket };
