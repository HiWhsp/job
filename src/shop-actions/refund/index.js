import ajax from "@/plugin/request.js";//导入 axios 配置
const api = ajax.api;//请求方法

import store from "@/store";


// 售后
//调用方式
/*
    refund.action({
        params: {

        },
        success: () => {

        }
    })
 */

//1 退换货列表
//2 新增退换货
//3 退换货详情
//4 买家填写快递信息
//5 取消退换货


let opt = {
  params: {},
  success: function (data) {
    //console.log('默认的回调', data)
  }
}

export default {

  //1 退换货列表
  refund_lists({ params, success } = opt) {
    api("refund_lists", params).then((res) => {
      let { code, data,message,count } = res;
      // debugger
      if (code == 200) {
        if (success) {
          success(data, count)
        }
      }
    });
  },

  //2 新增退换货
  refund_add({ params, success } = opt) {
    api("refund_add", params).then((res) => {
      let { code, data, msg} = res;
      
      if (code == 200) {
        if (success) {
          success(data)
        }
      }
    });
  },

  //3 退换货详情
  refund_detail({ params, success } = opt) {
    api("refund_detail", params).then((res) => {
      let { code, data, msg} = res;
      if (code == 200) {
        if (success) {
          success(data)
        }
      }
    });
  },

  //4  买家填写快递信息
  refund_addKuaidi({ params, success } = opt) {
    api("refund_addKuaidi", params).then((res) => {
      let { code, data, msg} = res;
      if (code == 200) {
        if (success) {
          success(data)
        }
      }
    });
  },

  //5 取消退换货
  refund_qxRefund({ params, success } = opt) {
    api("refund_qxRefund", params).then((res) => {
      let { code, data, msg} = res;
  
      if (code == 200) {
        if (success) {
          success(data)
        }
      }
    });
  },

};
