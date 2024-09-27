import ajax from "@/plugin/request.js";//导入 axios 配置
const api = ajax.api;//请求方法

import store from "@/store";


// 订单  order
//调用方式
/*
    order.action({
        params: {

        },
        success: () => {

        }
    })
 */

//1 根据下单商品获得确认订单信息(运费、促销活动、优惠券等)
//2 下单
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

  //1 根据下单商品获得确认订单信息(运费、促销活动、优惠券等)
  orders_getPayInfo({ params, success } = opt) {
    api("orders_getPayInfo", params).then((res) => {
      let { code, data } = res;
      // debugger
      if (code == 200) {
       
      }

      if (success) {
        success(data, res)
      }
    });
  },
  //2 下单
  orders_create({ params, success } = opt) {
    api("orders_create", params).then((res) => {
      let { code, orderId, message } = res;
      
      if (code == 200) {
        if (success) {
          success(orderId)
        }
      } else  {
     
      }
    });
  },
  //3 订单列表
  // scene 0全部 1待支付  2待发货  3待收货  4待评价  5已评价 -1无效
  // keyword 搜索商品或收货信息包含关键字的信息
  // page
  // pagenum
  orders_lists({ params, success } = opt) {
    api("orders_lists", params).then((res) => {
      let { code, data, message, count } = res;
      if (code == 200) {
        if (success) {
          data.forEach(order => {
            order.isPay = order.status > 1;
            order.actions = this.getOrderActionsByStatus({
              ...order
            })
          })
          success(data, count)
        }
      }
    });
  },

  //4 订单详情
  orders_detail({ params, success } = opt) {
    api("orders_detail", params).then((res) => {
      let { code, data, msg} = res;
      if (code == 200) {
        if (success) {
          //对订单可执行的操作
          data.actions = this.getOrderActionsByStatus({
            ...data
          })

          //订单商品总数
          let total_num = 0;
          data.products.forEach(v => {
            total_num += (+v.num)
          })
          data.total_num = total_num;


          success(data)
        }
      }
    });
  },

  //5 确认收货
  orders_qrshouhuo({ params, success } = opt) {
    api("orders_qrshouhuo", params).then((res) => {
      let { code, data, msg} = res;
      if (code == 200) {
        if (success) {
          success(data)
        }
      }
    });
  },
  //6 订单评价
  orders_comment({ params, success } = opt) {
    api("orders_comment", params).then((res) => {
      let { code, data, msg} = res;
     
      if (code == 200) {
        if (success) {
          success(data)
        }
      }
    });
  },
  //7 订单微信支付
  orders_wxPay({ params, success, fail } = opt) {
    //console.log('调用支付')
    api("orders_wxPay", params).then((res) => {
      // debugger
      let { code, data, msg} = res;
      if (code == 200) {
        if (success) {
          success(data)
        }
      } else {
       
      }
    }).catch(err => {
      fail(err)
    })
  },
  //8 取消订单
  orders_qxOrder({ params, success } = opt) {
    api("orders_qxOrder", params).then((res) => {
      let { code, data, msg} = res;

      if (code == 200) {
        if (success) {
          success(data)
        }
      }
    });
  },
  //9 删除订单
  orders_del({ params, success } = opt) {
    api("orders_del", params).then((res) => {
      let { code, data, msg} = res;

      if (code == 200) {
        if (success) {
          success(data)
        }
      }
    });
  },
  //10 订单余额支付
  orders_yuePay({ params, success } = opt) {
    api("orders_yuePay", params).then((res) => {
      let { code, data, msg} = res;
      if (code == 200) {
        if (success) {
          success(data)
        }
      }
    });
  },
  //11 分享订单的详情
  orders_shareOrder({ params, success } = opt) {
    api("orders_shareOrder", params).then((res) => {
      let { code, data, msg} = res;
      if (code == 200) {
        if (success) {
          success(data)
        }
      }
    });
  },
  //12 分享回调(可在客户点击分享的时候调用)
  orders_shareReturn({ params, success } = opt) {
    api("orders_shareReturn", params).then((res) => {
      let { code, data, msg} = res;
      if (code == 200) {
        if (success) {
          success(data)
        }
      }
    });
  },
  //13 订单积分抵现
  orders_jifenPay({ params, success } = opt) {
    api("orders_jifenPay", params).then((res) => {
      let { code, data, msg} = res;
      if (code == 200) {
        if (success) {
          success(data)
        }
      }
    });
  },
  //14 提货码
  orders_tihuoma({ params, success } = opt) {
    api("orders_tihuoma", params).then((res) => {
      let { code, data, msg} = res;
      if (code == 200) {
        if (success) {
          success(data)
        }
      }
    });
  },
  //15 贝海--评价商品列表
  orders_pingjiaList({ params, success } = opt) {
    api("orders_pingjiaList", params).then((res) => {
      let { code, data, msg} = res;
      if (code == 200) {
        if (success) {
          success(data)
        }
      }
    });
  },

  //16 订单微信扫码支付
  orders_wxScanCodePay({ params, success, fail } = opt) {
    api("orders_wxScanCodePay", params).then((res) => {
      let { code, data, msg} = res;
      if (code == 200) {
        if (success) {
          success(data)
        }
      } else {
        fail(res)
      }
    });
  },


  //商品评价列表
  product_comments({ params, success } = opt) {
    api("product_comments", params).then((res) => {
      let { code, data, msg} = res;
      if (code == 200) {
        if (success) {
          success(res)
        }
      }
    });
  },




  //根据订单状态获取订单操作结果
  getOrderActionsByStatus(order) {
    let { status, statusInfo, ifpingjia,pay_type } = order
    //pay_type  1-余额支付 2-支付宝 3-微信支付 4-paypal支付 5-货到付款 6-线下转款 7-银行卡支付 

    let actions = [];
    // let actions = [
    //   { name: "取消订单",type: 'quxiao' },
    //   { name: "立即支付",type: 'zhifu' },
    //   { name: "确认收货",type: 'shouhuo' },
    //   { name: "评价订单",type: 'pingjia' },
    //   { name: "申请售后",type: 'shouhou' },
    //   { name: "删除订单",type: 'shanchu' },
    //   { name: "再次购买",type: 'goumai' },
    // ];


    if (status == -5) {
      //待支付
      if (statusInfo == "无效") {
        actions = [{ name: "取消订单", type: 'quxiao' }];
      } else if (statusInfo == "待支付") {
        if(pay_type != '6') {
          actions = [{ name: "立即支付", type: 'zhifu' }, { name: "取消订单", type: 'quxiao' }];
        } else {
          actions = [ { name: "取消订单", type: 'quxiao' }];
        }
      }
    } else if (status == -3) {
      //-3售后处理中
      // actions = [{ name: "删除订单", type: 'shanchu' }];
    } else if (status == -1) {
      //无效
      actions = [{ name: "删除订单", type: 'shanchu' }];
    } else if (status == 0) {
      //0待成团
      actions = [];
    } else if (status == 2) {
      //2待发货
      // actions = [{ name: "取消订单", type: 'quxiao' }];
    } else if (status == 3) {
      //3待收货
      actions = [
        { name: "确认收货", type: 'shouhuo' },
        // { name: "申请售后", type: 'shouhou' }
      ];
    } else if (status == 4) {
      //4已收货
      if (ifpingjia) {
        actions = [{ name: "删除订单", type: 'shanchu' }];
      } else {
        actions = [{ name: "删除订单", type: 'shanchu' }, 
        // { name: "评价订单", type: 'pingjia' }
      ];
      }
    }
    return actions
  }

};
