import ajax from "@/plugin/request.js";//导入 axios 配置
const api = ajax.api;//请求方法

import store from "@/store";


// 购物车  shopcart
//调用方式
/*
    coupon.action({
        params: {

        },
        success: () => {

        }
    })
 */

let opt = {
  params: {},
  success: function (data) {
    //console.log('默认的回调', data)
  }
}

export default {
  // 购物车列表
  /* 
  shopcart_getList() {
    shopcart.getList({
      params: {},
      success: (data) => {
        data.forEach((v) => {
          v.checked = false;
        });
        this.list_shopcart = data;
      },
    });
  },

  //获取购物车数量
  shopcart.getList({
    success: (data) => {
      let count = 0;
      data.forEach(v => {
          count += v.num * 1
      })
      commit('set_vuex_cart_number', count)
     }
  })
  
  */
  getList({ params, success } = opt) {
    api("gouwuche_lists", params).then((res) => {
      let { code, data } = res;
      // debugger
      if (code == 200) {
        let count = 0;
        data.forEach(v => {
            count += v.num * 1
        })
        store.commit("set_vuex_cart_number", count)

        success(data);
      }
    });
  },



  //添加购物车   
  //注意事项： 添加完成后需要更新购物车商品数量  接口返回了最新数量
  /*

  shopcart_add() {
    shopcart.add({
      params: {
        inventoryId: inventoryId,
        num: 1,
      },
      // success: (data) => {
      //   this.list_yhq = data;
      // },
    });
  }
    
  */
  add({ params, success } = opt) {
    api("gouwuche_add", params).then((res) => {
      let { code, data, count, message } = res;
    
      if (code == 200) {
        store.commit("set_vuex_cart_number", count)
        if (success) {
          success(data)
        }
      }
    });
  },



  //注意事项： 操作成功后  接口返回了购物车商品数量
  /* 
  //产品规格id(多个用,分开)

  //购物车 删除选中
  shopcart_delete_checked() {
    if (!this.list_shopcart_checked.length) {
      alert("请先选择要删除的商品");
      return;
    }
    let ids = this.list_shopcart_checked.map((v) => v.inventoryId);
    //console.log("要删除的商品id", ids);
    let id = ids.join();
    this.shopcart_delete(id);
  },

  //购车车 删除商品
  shopcart_delete(id) {
    shopcart.delete({
      params: {
        inventoryId: id,
      },
      success: () => {
        let list = this.list_shopcart;
        let ids = id.split(",");
        //可能删除多项商品
        ids.forEach((inventoryId) => {
          let index = list.findIndex((v) => v.inventoryId == inventoryId);
          list.splice(index, 1);
        });
      },
    });
  },

  
*/
  delete({ params, success } = opt) {
    api("gouwuche_del", params)
      .then((res) => {
        let { code, data, message, count } = res;
     
        if (code == 200) {
          store.commit("set_vuex_cart_number", count);
          if (success) {
            success(data)
          }
        }
      });
  },




  // 修改购物车商品数量
  //注意事项： 操作成功后  接口返回了购物车商品数量
  /*

shopcart_updateNum(id) {
  shopcart.updateNum({
     params: {
      inventoryId: inventoryId,
      num: num,
    },
    success: (data) => {
      // let item = list.find((v) => v.id == id);
      // item.if_lingqu = 1;
      // let index = list.findIndex((v) => v.id == id);
      // list.splice(index, 1);
    },
  });
},

  
*/
  updateNum({ params, success } = opt) {
    // let id = params.id;
    api("gouwuche_updateNum", params)
      .then((res) => {
        let { code, data, message, count } = res;
      
        // debugger
        if (code == 200) {
          store.commit("set_vuex_cart_number", count)

          if (success) {
            success(data)
          }

          // let item = list.find((v) => v.id == id);
          // item.if_lingqu = 1;
          // let index = list.findIndex((v) => v.id == id);
          // list.splice(index, 1);
        }
      });
  },



  // 清空购物车  
  /*

  shopcart_clear() {
    shopcart.clear({
      params: {
          inventoryId: inventoryId,
          num: num,
      },
      success: (data) => {
      
      },
     });
  },

*/
  clear({ params, success } = opt) {
    // let id = params.id;
    api("gouwuche_delAll", params)
      .then((res) => {
        let { code, data, message, count } = res;
        
        // debugger
        if (code == 200) {
          message = '操作成功';
          store.commit("set_vuex_cart_number", count)
          if (success) {
            success(data)
          }
          // let item = list.find((v) => v.id == id);
          // item.if_lingqu = 1;
          // let index = list.findIndex((v) => v.id == id);
          // list.splice(index, 1);
        } else {
          message = '操作失败';
        }


      });
  },

};
