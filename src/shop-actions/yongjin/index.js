import ajax from "@/plugin/request.js";//导入 axios 配置
const api = ajax.api;//请求方法

import store from "@/store";


// 佣金  yongjin
//调用方式
/*
    yongjin.action({
        params: {

        },
        success: () => {

        }
    })
 */

//1 佣金记录
//2 佣金提现
//3 订单列表
//4 订单详情
//5 确认收货
//6 订单评价
//7 订单微信支付
//8 取消订单
//9 删除订单
//10 订单余额支付
//11 分享订单的详情
//12 分享回调(可在客户点击分享的时候调用)
//13 订单积分抵现
//14 提货码
//15 贝海--评价商品列表




let opt = {
  params: {},
  success: function (data) {
    //console.log('默认的回调', data)
  }
}

export default {

  //1 
  // orders_getPayInfo({ params, success } = opt) {
  //   api("orders_getPayInfo", params).then((res) => {
  //     let { code, data } = res;
  //     // debugger
  //     if (code == 200) {
  //       if (success) {
  //         success(data)
  //       }
  //     }
  //   });
  // },
  //2 提现
  money_tixian({ params, success } = opt) {
    api("money_tixian", params).then((res) => {
      let { code, data, msg} = res;
      
      if (code == 200) {
        if (success) {
          success(data)
        }
      }
    });
  },
 

};
