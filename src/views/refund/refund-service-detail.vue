<template>
  <div class="page">
    <div class="page-title flex-between">
      <span>申请售后</span>
      <button @click="$router.back()">返回</button>
    </div>

    <div class="page-ctx">
      <div class="jindu-info ">
        <div class="jindu-inner">
          <div class="jindu-title">{{ status_info.title }}</div>
          <div class="jindu-desc">{{ status_info.desc }}</div>
        </div>
      </div>

   

      <div class="refund-sec ">
        <div class="sec-title">售后服务信息</div>
        <div class="sec-ctx">
          <div class="text-info">
            <div class="item">
              <div class="text">售后商品：</div>
              <div class="val">
                <div class="product-box flex">
                  <div class="img-box">
                    <img :src="productInfo.image" alt />
                  </div>
                  <div class="product-info">
                    <div class="title">{{ productInfo.title }}</div>
                    <div class="sku"> {{ productInfo.keyVals }}</div>
                    <div class="num">x {{ productInfo.num }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="item" v-if="type == 3">
              <div class="text">换货规格：</div>
              <div class="val">{{ info.reason }}</div>
            </div>
            <div class="item">
              <div class="text">售后原因：</div>
              <div class="val">{{ info.reason }}</div>
            </div>
            <div class="item">
              <div class="text">售后金额：</div>
              <div class="val">￥{{ info.refundPrice }}</div>
            </div>
            <div class="item">
              <div class="text">申请时间：</div>
              <div class="val">{{ info.createdTime }}</div>
            </div>
            <div class="item">
              <div class="text">售后编号：</div>
              <div class="val">{{ info.sn }}</div>
            </div>
            <div class="item">
              <div class="text">售后说明：</div>
              <div class="val">{{ info.remark }}</div>
            </div>
            <div class="item">
              <div class="text">售后凭证：</div>
              <div class="val ">
                <div class="pic-list flex" v-if="info.images">
                  <div class="pic-item" v-for="(pic, index) in info.images" :key="index" alt>
                    <el-image style="width: 120px;height: 120px;" :src="pic" :preview-src-list="info.images">
                    </el-image>
                  </div>
                </div>
              </div>
            </div>

            <!-- <div class="item">
              <span class="text">商家备注：</span>
              <span class="val" v-if="refundObj.dealCont">
                {{ refundObj.dealCont }}
              </span>
              <span class="val" v-else>
                <span v-for="(beizhu, index) in beizhuArr" :key="index">{{ beizhu.content }}</span>
              </span>
            </div> -->
          </div>
        </div>


        <div class="tuihuo-ctx" v-if="is_allow_buyer_submit_wuliu || is_finish_buyer_wuliu">
          <div class="text-info">
            <div class="item">
              <div class="text">退货方式：</div>
              <div class="val">自行寄回</div>
            </div>
            <div class="item">
              <div class="text">商品寄回地址：</div>
              <div class="val">
                <div class="name-info">
                  {{ shop_info.comTitle }}
                  {{ shop_info.comPhone }}
                </div>
                <div class="addr-info">
                  {{ shop_info.comAddress }}
                </div>
              </div>
            </div>

            <div class="buyer-wuliu-info" v-if="is_finish_buyer_wuliu">
              <div class="item">
                <div class="text">快递公司：</div>
                <div class="val">{{ kuaidiJson.company }}</div>
              </div>
              <div class="item">
                <div class="text">快递单号：</div>
                <div class="val">{{ kuaidiJson.orderId }}</div>
              </div>
              <div class="item">
                <div class="text">邮寄时间：</div>
                <div class="val">{{ kuaidiJson.express_time }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="act-sec">
        <div class="btns flex">
          <div v-if="info.ifCancel == 1" class="btn btn-ripple" @click="do_cancel_refund()">取消售后</div>
          <div v-if="is_allow_buyer_submit_wuliu" class="btn btn-ripple btn-bg" @click="do_open_express()">邮寄回平台</div>
          <div v-if="info.ifReceive" class="btn btn-ripple" @click="do_open_receive()">确认收货</div>
        </div>
      </div>
    </div>




    <!-- 填写物流 -->
    <refund_add_express_modal data-title="买家邮寄商品物流" ref="refund_add_express_modal" @confirm="do_confirm_add_express" />
    <!-- 取消售后 -->
    <refund_cancel_modal ref="refund_cancel_modal" @confirm="setView" />
    <!-- 售后 确认收货 -->
    <refund_receive_modal  data-title="换货-买家确认收货"  ref="refund_receive_modal" @confirm="setView" />

  </div>
</template>

<script>
// refund_type  退换货类型(1-退款   2-退货退款  3-换货)
// 退货退款： 1 商家后台审核通过后  2 用户填写退货物流  3 商家后台收货  4商家后台退款
import orderInfo from "@/components/order/orderInfo.vue"; //
import refund_add_express_modal from "@/components/refund/refund_add_express_modal.vue"; //填写快递信息
import refund_cancel_modal from "@/components/refund/refund_cancel_modal.vue"; //取消售后
import refund_receive_modal from "@/components/refund/refund_receive_modal.vue"; //换货 售后确认收货

import { mapState } from "vuex";

export default {
  name: "page-refund-service-detail",
  components: {
    refund_add_express_modal,

    orderInfo,
    refund_cancel_modal,
    refund_receive_modal,
  },
  data() {
    return {
      refund_id: this.$route.query.id,
      //
      type: '',
      info: {},//售后信息
      productInfo: {},//产品信息
      type_1_status_list: [
        { value: 1, title: '等待审核', desc: '等待平台确认退款' },
        { value: 3, title: '审核通过', desc: '处理中，等待平台退款' },
        { value: 6, title: '退款成功', desc: '' },
        { value: -1, title: '已驳回', desc: '售后申请已经被驳回' },
      ],
      type_2_status_list: [
        { value: 1, title: '等待审核', desc: '等待平台确认提货退款' },
        { value: 2, ifExpress: 1, title: '待买家发货', desc: '请按照商家地址将产品寄回' },
        { value: 2, ifExpress: 0, title: '退货待收货', desc: '待卖家确认收货 7天后自动收货' },
        { value: 3, title: '审核通过', desc: '处理中，等待平台退款' },
        { value: 6, title: '退货退款完成', desc: '' },
        { value: -1, title: '已驳回', desc: '售后申请已经被驳回' },
      ],
      type_3_status_list: [
        { value: 1, title: '等待审核', desc: '等待平台确认提货退款' },
        { value: 2, ifExpress: 1, title: '待买家发货', desc: '请按照商家地址将产品寄回' },
        { value: 2, ifExpress: 0, title: '退货待收货', desc: '待卖家确认收货 7天后自动收货' },
        // { value: 3, title: '审核通过', desc: '处理中，等待平台退款' },
        { value: 4, title: '换货待发货', desc: '处理中，等待平台发货' },
        { value: 5, title: '换货待买家收货', desc: '待买家确认收货' },
        { value: 6, title: '换货完成', desc: '' },
        { value: -1, title: '已驳回', desc: '售后申请已经被驳回' },
      ],
      status_info: {},
      shop_info: {},
      is_allow_buyer_submit_wuliu: false,//是否允许买家填写物流信息
      is_allow_buyer_receive: false,//是否可确认收货
      is_finish_buyer_wuliu: false,//是否已提交买家物流信息
      kuaidiJson: {},

      // isRefundDone: false, //售后已完成
      // isRefundCancel: false, //售后已取消
      // isRefundCanCancel: false, //售后是否可以取消
      // needUserFaHuo: false, //是否需要用户发货

      // refund_id: this.$route.query.refund_id,
      // refundObj: {}, //
      // beizhuArr: [], //备注

      typeText: "", //售后类型

      statusText: "", //退回状态 操作步骤
      show_jihui_wuliu_fill: false,

      progress_index: 1,

      isRefundDone: false, //售后已完成
      isRefundCancel: false, //售后已取消
      isRefundCanCancel: false, //售后是否可以取消
      needUserFaHuo: false, //是否需要用户发货

      refundObj: {}, //
      beizhuArr: [], //备注

 

      show_tuihuoxinxi: false, //是否显示退货信息
      currency: "￥",

      show_kuaidi_modal: false, //填写快递信息
      company: "",
      code: "",

      list_goods: [],
      tuihuo_kuaidi: {},
    };
  },
  computed: {
    ...mapState([""]),



    //换货 物流
    mendian_send() {
      return this.refundObj.mendian_send || {};
    },

    service_step_list() {
      // refund_type  退换货类型(1-退款   2-退货退款  3-换货)
      //2 退货退款： 1 商家后台审核通过后  2 用户填写退货物流  3 商家后台收货  4商家后台退款

      // "-1": "已驳回",
      // 1: "待审核",
      // 2: "待买家发货", //2: "退货待收货"
      // 3: "待退款",
      // 6: "退款完成",

      //3 换货： 1 --  2 用户填写退货物流  3 商家后台收货  4商家后台退款
      let status = this.refundObj.status;
      let status_info = this.refundObj.status_info;
      let refund_type = this.refundObj.type;
      let refund_type_map = {
        2: "退货退款",
        3: "换货",
      };
      let refund_type_text = refund_type_map[refund_type];

      let arr = [];
      let active_1 = 1;
      let active_2 = 0;
      let active_3 = 0;
      let active_4 = 0;
      let active_5 = 0;

      let step_1_status = [1];
      let step_2_status = [2];
      let step_3_status = [2];
      let step_4_status = [];

      if (refund_type_text == "换货") {
        let refund_status_text = {
          已驳回: "-1",
          已取消: "-1",
          待审核: "1",
          待买家发货: "2",
          退货待收货: "2",
          换货待发货: "4",
          待客户收货: "5",
          已完成: "6",
        };

        if (status_info == "已取消") {
          active_2 = 1;
          active_3 = 1;
          active_4 = 1;
        } else if (status_info == "已驳回") {
        } else if (status_info == "待审核") {
        } else if (status_info == "待买家发货") {
          active_2 = 1;
        } else if (status_info == "退货待收货") {
          active_2 = 1;
          active_3 = 1;
        } else if (status_info == "换货待发货") {
          active_2 = 1;
          active_3 = 1;
        } else if (status_info == "待客户收货") {
          active_2 = 1;
          active_3 = 1;
          active_4 = 1;
        } else if (status_info == "已完成") {
          active_2 = 1;
          active_3 = 1;
          active_4 = 1;
          active_5 = 1;
        }

        if (status_info == "已取消") {
          arr = [
            { title: `① 等待卖家审核${refund_type_text}申请`, active: active_1 },
            { title: "② 申请通过", active: active_2 },
            { title: "③ 处理中", active: active_3 },
            { title: "③ 已取消", active: active_4 },
          ];
        } else if (status_info == "已驳回") {
          //有bug
          arr = [
            { title: `① 等待卖家审核${refund_type_text}申请`, active: 1 },
            { title: "② 已驳回", active: 1 },
          ];
        } else {
          arr = [
            { title: `① 等待卖家审核${refund_type_text}申请`, active: active_1 },
            { title: "② 申请通过", active: active_2 },
            { title: "③ 处理中", active: active_3 },
            { title: "③ 已换货", active: active_4 },
            { title: "④ 换货成功", active: active_5 },
          ];
        }
      } else if (refund_type_text == "退货退款") {
        let refund_status_text = {
          已驳回: "-1",
          已取消: "-1",
          待审核: "1",
          待买家发货: "2",
          退货待收货: "2",
          待退款: "3",
          已完成: "6",
        };

        if (status_info == "已取消") {
          active_2 = 1;
          active_3 = 1;
          active_4 = 1;
        } else if (status_info == "已驳回") {
        } else if (status_info == "待审核") {
        } else if (status_info == "待买家发货") {
          active_2 = 1;
        } else if (status_info == "退货待收货") {
          active_2 = 1;
          active_3 = 1;
        } else if (status_info == "待退款") {
          active_2 = 1;
          active_3 = 1;
        } else if (status_info == "已完成") {
          active_2 = 1;
          active_3 = 1;
          active_4 = 1;
        }

        if (status_info == "已取消") {
          arr = [
            { title: `① 等待卖家审核${refund_type_text}申请`, active: active_1 },
            { title: "② 申请通过", active: active_2 },
            { title: "③ 处理中", active: active_3 },
            { title: "③ 已取消", active: active_4 },
          ];
        } else if (status_info == "已驳回") {
          //有bug
          arr = [
            { title: `① 等待卖家审核${refund_type_text}申请`, active: 1 },
            { title: "② 已驳回", active: 1 },
          ];
        } else {
          arr = [
            { title: `① 等待卖家审核${refund_type_text}申请`, active: active_1 },
            { title: "② 申请通过", active: active_2 },
            { title: "③ 处理中", active: active_3 },
            { title: "③ 已退款", active: active_4 },
          ];
        }
      }

      return arr;
    },

    refund_goods() {
      return this.refundObj.productInfo || {};
    },

    //是否填写了快递信息
    has_kuaidi() {
      return !!this.refundObj.user_send;
    },
    shopMsg() {
      return this.refundObj.shopMsg;
    },

    orderMoney() {
      let total = 0;
      if (this.currency == "积分") {
        total = this.refundObj.productInfo.jifen;
      } else {
        if (this.refundObj && this.refundObj.productInfo) {
          let list = [this.refundObj.productInfo];
          list.forEach((v) => {
            total += v.priceSale * v.num;
          });

          // if (this.orderObj.pay_info && this.orderObj.pay_info.yue) {
          //   total -= this.orderObj.pay_info.yhq;
          // }
        }
      }

      return total;
    },
  },
  watch: {
    refundObj(data) {
      let { type, status, status_info, productInfo, user_send } = data;

      if (productInfo && productInfo.jifen) {
        this.currency = "积分";
      }

      //退换货类型(2退款  3退货退款)
      // refund_type  退换货类型(1-退款   2-退货退款  3-换货)
      if (type == 1) {
        this.typeText = "退款";

        let statusMap = {
          "-1": "已驳回",
          1: "待审核",
          3: "待退款",
          6: "退款完成",
        };

        this.statusText = statusMap[status];
      } else if (type == 2) {
        this.typeText = "退货退款";
        //状态控制
        let statusMap = {
          "-1": "已驳回",
          1: "待审核",
          2: "待买家发货", //2: "退货待收货"
          3: "待退款",
          6: "退款完成",
        };
        if (status_info == "退货待收货") {
          statusMap["2"] = "退货待收货";
        }

        //顶部进度控制
        let statusMapForStep = {
          "-1": 0,
          1: 0,
          2: 1,
          3: 2,
          6: 3,
        };

        if (status_info == "退货待收货") {
          statusMapForStep["2"] = 1;
        }

        this.statusText = statusMap[status];
        this.progress_index = statusMapForStep[status];
      } else if (type == 3) {
        this.typeText = "换货";
        let statusMap = {
          已驳回: "-1",
          待审核: "1",
          待买家发货: "2",
          退货待收货: "2",
          换货待发货: "4",
          待客户收货: "5",
          已完成: "6",
        };

        this.statusText = status_info;
      }

      // debugger;

      //商品清单
      if (productInfo) {
        this.list_goods = [productInfo];
      }

      //退货快递信息
      if (user_send) {
        this.tuihuo_kuaidi = user_send;
      }

      //备注
      if (data.beizhu_json) {
        this.beizhuArr = JSON.parse(data.beizhu_json);
      }

      //售后完成
      if (data.status == 6) {
        this.isRefundDone = true;
      }
      //售后完成
      if (data.status == -1) {
        this.isRefundCancel = true;
      }

      //是否可取消售后申请
      if (data.status == -1 || data.status == 6 || data.status == 5 || data.status == 4) {
        this.isRefundCanCancel = false;
      } else {
        this.isRefundCanCancel = true;
      }

      //是否需要用户发货
      if (data.status_info == "待买家发货") {
        this.needUserFaHuo = true;
      }
    },
  },

  created() {
    this.query_mendian_address()
    this.setView();
  },
  methods: {
    query_mendian_address() {
      //查询退货门店地址
      this.$api({
        url: '/service.php',
        method: 'get',
        data: {
          action: 'index_config',
        },
      }).then(res => {
        if (res.code == 200) {
          this.shop_info = res.data;
        }
      })
    },
    setView() {
      this.$api({
        url: '/service.php',
        method: 'get',
        data: {
          action: 'refund_detail',
          id: this.refund_id
        },
      }).then(res => {
        if (res.code == 200) {
          let data = res.data;
          let status = data.status;
          //
          this.info = data;
          this.type = data.type;
          this.refund_info = data;
          this.productInfo = data.productInfo || {};
          this.kuaidiJson = data.kuaidiJson || {};


          if (status >= 3) {
            if (data.fahuo_info) {
              this.express_getInfo(data.fahuo_info.fahuo_id)
            }
          }

          if (this.type == 1) {//仅退款
            this.status_info = this.type_1_status_list.find(v => v.value == status) || {}
          } else if (this.type == 2) {
            if (data.kuaidiJson) {
              this.is_finish_buyer_wuliu = true
              this.kuaidiJson = data.kuaidiJson
            }
            if (data.ifExpress == 1) {//待买家发货
              this.is_allow_buyer_submit_wuliu = true
            } else {//已发货
            }
            if (status == 2) {
              this.status_info = this.type_2_status_list.find(v => v.value == status && v.ifExpress == data.ifExpress) || {}
            } else {
              this.status_info = this.type_2_status_list.find(v => v.value == status) || {}
            }
            // if(data.ifExpress) {
            //   this.is_finish_buyer_wuliu = true
            //   this.kuaidiJson = data.kuaidiJson
            // }
          }else if (this.type == 3) {
            if (data.kuaidiJson) {
              this.is_finish_buyer_wuliu = true
              this.kuaidiJson = data.kuaidiJson
            }
            if (data.ifExpress == 1) {//待买家发货
              this.is_allow_buyer_submit_wuliu = true
            } else {//已发货
            }
            if (status == 2) {
              this.status_info = this.type_3_status_list.find(v => v.value == status && v.ifExpress == data.ifExpress) || {}
            } else {
              this.status_info = this.type_3_status_list.find(v => v.value == status) || {}
            }
            // if(data.ifExpress) {
            //   this.is_finish_buyer_wuliu = true
            //   this.kuaidiJson = data.kuaidiJson
            // }
          }

          if (status == 6) {//退款完成
            this.status_info.desc = `退款成功￥${this.info.refundPrice}`
          }


          //
          data.products = data.productInfo;
          this.refundObj = data;
        }
      })
    },

    //提交快递信息
    do_open_express() {
      this.$refs.refund_add_express_modal.init(this.info);
    },
    //取消售后申请
    do_cancel_refund() {
      this.$refs.refund_cancel_modal.init(this.info)
    },
    do_confirm_add_express() {
      this.is_allow_buyer_submit_wuliu = false;
      this.setView()
    },
    do_open_receive() {
      this.$refs.refund_receive_modal.init(this.info)
    }
  },
};
</script>


<style scoped lang="less">

.page {
  padding-bottom: 50px;

  .page-title {
    margin-bottom: 20px;
    padding: 0 32px;
    text-align: left;
    height: 56px;
    line-height: 56px;
    background: #ffffff;
    font-size: 16px;
    font-family: Microsoft YaHei-Bold, Microsoft YaHei;
    font-weight: bold;
    color: #333333;

    button {
      min-width: 96px;
      height: 30px;
      line-height: 30px;
      background: #009F39;
      color: #fff;
      font-size: 14px;
    }
  }

  .page-ctx {
    padding: 24px 32px;
    background: #fff;
  }
}


.refund-sec {
  min-height: 210px;
  background: #ffffff;
  border: 1px solid #cccccc;
  // border-top: none;

  .sec-title {
    text-align: left;
    height: 48px;
    line-height: 48px;
    padding: 0 20px;
    background: #f9f9f9;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #333333;
  }

  .sec-ctx {
    padding: 20px;
  }

  .tuihuo-ctx {
    border-top: 1px solid #eee;
    padding: 20px;

    .name-info {
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: 400;
      font-size: 14px;
      color: #7D7D7D;
      line-height: 30px;
    }

    .addr-info {
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: 400;
      font-size: 14px;
      color: #7D7D7D;
      line-height: 30px;
    }
  }

  .pic-list {
    flex-wrap: wrap;

    .pic-item {
      margin-right: 20px;
    }
  }
}


.product-box {
  .img-box {
    width: 104px;
    height: 104px;

    img {
      width: 104px;
      height: 104px;
    }
  }

  .product-info {
    flex: 1;
    padding-left: 24px;

    .title {
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: 400;
      font-size: 16px;
      color: #333333;
      line-height: 1.5;
    }

    .sku {
      margin: 12px 0;
      height: 16px;
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: 400;
      font-size: 14px;
      color: #999999;
    }

    .num {
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: 400;
      font-size: 14px;
      color: #999999;
    }
  }
}


.text-info {
  text-align: left;

  .item {
    margin-bottom: 20px;
    line-height: 20px;
    display: flex;

    .text {
      display: inline-block;
      min-width: 70px;
    }

    .val {
      padding-left: 20px;
    }

    .img-list {
      img {
        width: 60px;
        height: 60px;
        margin-right: 10px;
      }
    }
  }
}



.act-sec {
  margin-top: 24px;

  .btns {
    .btn {
      margin-right: 24px;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      padding: 0 6px;
      min-width: 104px;
      height: 32px;
      background: #FFFFFF;
      border-radius: 4px 4px 4px 4px;
      border: 1px solid #009F39;

      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: 400;
      font-size: 14px;
      color: #009F39;

      &.btn-bg {
        background: rgba(247, 71, 71, 1);
        color: #FFF;
      }
    }
  }
}


.jindu-info {
  margin-bottom: 24px;
  padding: 30px;
  min-height: 115px;
  background: #009F39;
  border-radius: 0px 0px 0px 0px;

  .jindu-title {
    font-family: Microsoft YaHei, Microsoft YaHei;
    font-weight: 400;
    font-size: 19px;
    color: #FFFFFF;
  }

  .jindu-desc {
    margin-top: 10px;
    font-family: Microsoft YaHei, Microsoft YaHei;
    font-weight: 400;
    font-size: 13px;
    color: #FFFFFF;
  }
}

</style>
