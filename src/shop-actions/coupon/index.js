import ajax from "@/plugin/request.js";//导入 axios 配置
const api = ajax.api;//请求方法



const pagination = {
    page: 1,
    pageNum: 100,
};

// 优惠券  coupon
/*
    coupon.action({
        params: {

        },
        success: () => {

        }
    })
 */

export default {
    // 优惠券列表
    /*
       coupon.getList({
        params: {},
        success: (data) => {
          this.list_yhq = data;
        },
      });
    */
    getList({ params, success } = opt) {
        api("users_yhqList", {
            ...pagination,
            ...params
        }).then((res) => {
            let { code, data } = res;
            if (code == 200) {
                success(data);
            }
        });
    },



    //我的优惠券
    /*
     coupon.getMyList({
        params: {
          scene: this.status,
        },
        success: (data) => {
          this.list_yhq = data;
        },
      });

      
    */
    getMyList({ params, success } = opt) {
        api("users_myYhqList", params).then((res) => {
            let { code, data } = res;
            if (code == 200) {
                success(data);
            }
        });
    },


    // 领取
    /*

coupon_pick(id) {
    coupon.pick({
       params: {
        id: id,
      },
      success: (data) => {
        // this.list_yhq = data;
      },
    });
  },

    
  */
    pick({ params, success } = opt) {
        let id = params.id;
        api("users_yhqLingqu", params)
            .then((res) => {
                let { code, data, msg} = res;
           
                // debugger
                if (code == 200) {
                    success(data);
                    // let item = list.find((v) => v.id == id);
                    // item.if_lingqu = 1;
                    // let index = list.findIndex((v) => v.id == id);
                    // list.splice(index, 1);
                }
            });
    },


    // 地址 删除
    // address.delete(item, this.list);
    delete(item, list) {
        let id = item.id;
        api("userAddress_delete", {
            id,
        })
            .then((res) => {
                let { code, message } = res;
                //console.log("删除地址", res);
              
                if (code == 200) {
                    let index = list.findIndex((v) => v.id == item.id);
                    list.splice(index, 1);
                }
            });
    },
};
