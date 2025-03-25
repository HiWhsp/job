import ajax from "@/plugin/request.js";//导入 axios 配置
const api = ajax.api;//请求方法



// 商品列表  goods
/*
    coupon.action({
        params: {

        },
        success: () => {

        }
    })
 */

export default {
    // 商品列表
    /*
    goods.getList({
        params: {
          
        },
        success: (data) => {
          this.list_goods = data;
        },
      });
    */
    getList({ params, success } = opt) {
        api("product_plist", params).then((res) => {
            let { code, data } = res;
            if (code == 200) {
                success(data);
            }
        });
    },



    // 商品评论列表
    /*
       coupon.getList({
        params: {},
        success: (data) => {
          this.list_yhq = data;
        },
      });
    */
    getComments({ params, success } = opt) {
        api("product_comments", params).then((res) => {
            let { code, data } = res;
            if (code == 200) {
                success(res);
            }
        });
    },

};
