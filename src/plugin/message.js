import Vue from "vue";
import { Message } from "element-ui";

let has_ins = false; //是否存在提示实例

let time_lock = 0; //锁定时间
let alert_ins = null; //提示实例

function onClose() {
  has_ins = false;
}

function close_msg() {
  has_ins = false;
  if (alert_ins) {
    alert_ins.close();
    alert_ins = null;
  }
}

// 提示
let duration = 1500; //提示时长
window.alert = function (res = {}) {
  close_msg();
  if (has_ins) {
    return;
  }
  has_ins = true;
  //

  if (typeof res == "object") {
    let { msg, code } = res;
    let message = msg;

    if (code == 200) {
      alert_ins = Message.success({
        message: message,
        offset: 300,
        duration: duration,
        onClose: (ins) => {
          onClose();
        },
      });
    } else {
      alert_ins = Message.error({
        message: message,
        offset: 300,
        duration: duration,
        onClose: (ins) => {
          onClose();
        },
      });
    }
  } else if (typeof res == "string") {
    let message = res;
    alert_ins = Message.info({
      message: message,
      offset: 300,
      duration: duration,
      onClose: (ins) => {
        onClose();
      },
    });
  }

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
};

window.alertSucc = function (message) {
  if (has_ins) {
    return;
  }
  has_ins = true;
  //
  alert_ins = Message.success({
    message: message,
    offset: 300,
    duration: duration,
    onClose: (ins) => {
      onClose();
    },
  });
};
window.alertErr = function (message) {
  if (has_ins) {
    return;
  }
  has_ins = true;
  //
  alert_ins = Message.error({
    message: message,
    offset: 300,
    duration: duration,
    onClose: (ins) => {
      onClose();
    },
  });
};
window.alertInfo = function (message) {
  if (has_ins) {
    return;
  }
  has_ins = true;
  //
  alert_ins = Message.info({
    message: message,
    offset: 300,
    duration: duration,
    onClose: (ins) => {
      onClose();
    },
  });
};

Vue.prototype.$message = Message;
