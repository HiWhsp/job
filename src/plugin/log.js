import Vue from "vue";

/**
 * 控制台打印输出封装
 * @param {Object} text
 * @param {Object} data
 */

let log = function (text, data) {
  if (typeof data == "object") {
    try {
      data = JSON.parse(JSON.stringify(data));
    } catch (e) {
      console.error("log 异常e：", e);
    }
  }
  console.warn("log  描述：", text, "  值：", data);
};

Vue.prototype.$log = log;

export default {
  log,
};
