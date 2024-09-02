<template>
  <div class="page">
    <!-- 填写物流 -->
    <modalWuliu ref="modalWuliu" />
    <!-- 取消售后 -->
    <modalRefundCancel ref="modalRefundCancel" @updateView="updateView" />
    <!-- 售后 确认收货 -->
    <modalRefundReceive ref="modalRefundReceive" @updateView="updateView" />

    <div class="main-title">
      <span>申请售后</span>
      <button @click="$router.back()">返回</button>
    </div>

    <!-- 进度条 -->

    <div class="step-clip-box">
      <div class="step-box">
        <div v-for="(item, index) in service_step_list" :key="index" class="step" :class="['step-' + (index + 1), { active: item.active }]">{{ item.title }}</div>
      </div>
    </div>

    <!-- <div class="step-trans-box">
      <div class="step-box" v-if="!isRefundCancel" :class="isRefundDone ? 'step-3' : 'step-2'">
        <div class="step-item">
          <div class="text-box">① 买家申请</div>
          <div class="right-arrow"></div>
        </div>
        <div class="step-item">
          <div class="text-box">② 卖家处理</div>
          <div class="right-arrow"></div>
        </div>
        <div class="step-item">
          <div class="text-box">③ 售后完成</div>
          <div class="right-arrow"></div>
        </div>
      </div>

      <div class="step-box step-3" v-else>
        <div class="step-item">
          <div class="text-box">① 买家申请</div>
          <div class="right-arrow"></div>
        </div>
        <div class="step-item">
          <div class="text-box">② 卖家处理</div>
          <div class="right-arrow"></div>
        </div>
        <div class="step-item">
          <div class="text-box">③ 售后取消</div>
          <div class="right-arrow"></div>
        </div>
      </div>
    </div> -->

    <!-- 售后进度信息 -->
    <div class="jindu-box ">
      <template v-if="statusText == '已驳回'">
        <!-- 售后被驳回 -->
        <div class="section section-status section-quxiao">
          <div class="quxiao">
            <div class="text-1">申请被驳回/取消</div>
            <div class="text-2">若您的问题未解决，可在有效期内再次申请售后</div>
          </div>
        </div>
      </template>

      <template v-if="statusText == '已取消'">
        <!-- 售后取消 -->
        <div class="section section-status section-quxiao">
          <div class="quxiao">
            <div class="text-1">申请已取消</div>
            <div class="text-2">若您的问题未解决，可在有效期内再次申请售后</div>
          </div>
        </div>
      </template>

      <template>
        <!-- 退货退款   待审核 -->
        <template v-if="statusText == '待审核'">
          <div class="section section-status section-jihui">
            <div class="jihui">
              <div class="text-1">待审核</div>
              <div class="text-2">请及时关注售后申请进度</div>
            </div>
          </div>
        </template>

        <!-- 退货退款   寄回待填地址 -->
        <template v-if="statusText == '待买家发货'">
          <!-- 寄回商品 -->
          <div class="section section-status section-jihui">
            <div class="jihui">
              <div class="text-1">请寄回商品</div>
              <div class="text-2">请及时填写快递单号</div>
            </div>
          </div>

          <!-- 寄回商品填写信息 -->
          <div class="section section-submit" v-if="show_jihui_wuliu_fill">
            <van-field v-model="beizhu" label="快递公司" placeholder="请输入" />
            <van-field v-model="beizhu" label="快递单号" placeholder="请输入" />

            <van-field v-model="message" rows="4" autosize label="留言" type="textarea" maxlength="500" placeholder="请输入留言" show-word-limit />
          </div>

          <!-- 寄回商品  商家信息-->
          <div class="section section-shangjia">
            <div class="shangjia-dizhi">
              <div class="text-1">退货地址：{{ shop_info.address }}</div>
              <div class="text-1">联系人：{{ shop_info.name }}</div>
              <div class="text-1">联系电话：{{ shop_info.phone }}</div>

              <div class="text-3">
                <!-- <button @click="show_kuaidi_modal = true">填写快递单号</button> -->
                <button @click="submit_kuaidi">填写快递单号</button>
              </div>
            </div>
          </div>
          <!-- 寄回商品  寄回须知-->
          <div class="section section-xuzhi">
            <div class="xuzhi">
              <div class="text-1">退换货须知</div>
              <div class="text-2">请确保商品不影响二次销售（质量问题除外）</div>
            </div>
          </div>
        </template>

        <!-- 退货退款 商家售后 -->
        <template v-if="statusText == '退货待收货'">
          <div class="section section-status section-shangjia-shouhuo">
            <div class="shangjia-shouhuo">
              <div class="text-1">等待商家收货</div>
              <div class="text-2"></div>
            </div>
          </div>
        </template>

        <!-- 退货退款 商家售后 -->
        <template v-if="statusText == '待退款'">
          <div class="section section-status section-shangjia-shouhuo">
            <div class="shangjia-shouhuo">
              <div class="text-1">待退款</div>
              <div class="text-2"></div>
            </div>
          </div>
        </template>
      </template>

      <!-- 售后：换货 -->
      <template>
        <template v-if="mendian_send.company">
          <div class="section section-status section-shangjia-shouhuo">
            <div class="shangjia-shouhuo">
              <div class="text-1">{{ statusText }}</div>
              <div class="text-2"></div>
            </div>
          </div>
          <div class="shangjia-tuihuo-wuliu">
            <div class="shangjia-tuihuo-wuliu-title">商家发货物流</div>
            <div class="tuihuan-item">
              <b class="tuihuan-title"> 快递公司： </b>
              <span class="tuihuan-val">
                {{ mendian_send.company }}
              </span>
            </div>
            <div class="tuihuan-item">
              <b class="tuihuan-title"> 物流单号：</b>
              <span class="tuihuan-val">
                {{ mendian_send.orderId }}
              </span>
            </div>

            <div class="tuihuan-receive" v-if="statusText == '待客户收货'">
              <button class="btn-tuihuan-receive" @click="refund_goods_receive">确认收货</button>
            </div>
          </div>
        </template>
      </template>

      <!-- 售后完成 -->
      <div class="section section-status section-done" v-if="statusText == '退款完成'">
        <div class="tuikuan-done">
          <div class="text-1">退款成功</div>
          <div class="text-2">{{ currency }}{{ orderMoney }}</div>
          <div class="text-3">已退回至您的­­­{{ currency == "积分" ? "积分账户" : "余额" }}</div>
        </div>
      </div>

      <template v-if="show_tuihuoxinxi">
        <div class="title">退换物流</div>
        <div class="order-info">
          <div class="shouhou-info shouhou-info-edit">
            <!-- <div class="main-title">提交退货信息</div> -->
            <van-field class="address-field" v-model="wuliu_company" name="wuliu_company" label="物流公司" placeholder="请输入物流公司" type="text"></van-field>
            <van-field class="address-field" v-model="wuliu_code" name="wuliu_code" label="快递单号" placeholder="请输入快递单号" type="text"></van-field>
          </div>

          <!-- 提交物流信息 -->
          <div class="btn-box btn-submit">
            <van-button block round type="warning" @click="onSubmitTuihuo">提交退货信息</van-button>
          </div>
        </div>
      </template>

      <div class="order-info user-tuihuo-wuliu" v-if="has_kuaidi">
        <div class="tuihuo-wuliu-title">买家退货物流</div>
        <div>
          <b>退货快递：</b>
          <span>{{ tuihuo_kuaidi.company }}</span>
        </div>
        <div>
          <b>退货单号：</b>
          <span>{{ tuihuo_kuaidi.orderId }}</span>
        </div>
      </div>
    </div>
    <!-- 售后进度信息 -->

    <div class="refund-info page-ctx">
      <div class="refund-info-title">售后服务信息</div>

      <div class="refund-info-content">
        <!-- 商品信息 -->
        <div class="goods-info">
          <div class="item-good">
            <div class="img-box">
              <img :src="refund_goods.image" alt />
            </div>
            <div class="title">{{ refund_goods.title }}</div>
            <div class="num">x {{ refund_goods.num }}</div>
            <div class="price">{{ currency }}{{ currency != "积分" ? refund_goods.priceSale : refund_goods.jifen }}</div>
          </div>
        </div>

        <div class="text-info">
          <div class="item">
            <span class="text">售后编号：</span>
            <span class="val">{{ refundObj.sn }}</span>
          </div>
          <div class="item">
            <span class="text">申请时间：</span>
            <span class="val">{{ refundObj.dtTime }}</span>
          </div>

          <div class="item">
            <span class="text">售后原因：</span>
            <span class="val">{{ refundObj.reason }}</span>
          </div>
          <div class="item">
            <span class="text">售后说明：</span>
            <span class="val">{{ refundObj.remark }}</span>
          </div>

          <div class="item">
            <span class="text">图片上传：</span>
            <span class="val img-list" v-if="refundObj.uploadedfile1">
              <img v-for="(item, index) in refundObj.uploadedfile1" :key="index" :src="item" alt />
            </span>
          </div>

          <div class="item">
            <span class="text">商家备注：</span>
            <span class="val" v-if="refundObj.dealCont">
              {{ refundObj.dealCont }}
            </span>
            <span class="val" v-else>
              <span v-for="(beizhu, index) in beizhuArr" :key="index">{{ beizhu.content }}</span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="refund-action">
      <!-- <div class="btn-box" v-if="needUserFaHuo">
        <button @click="submit_kuaidi">填写快递</button>
      </div> -->
      <!-- <div class="btn-box" v-if="isRefundCanCancel">
        <button @click="refund_qxRefund">取消售后</button>
      </div> -->
    </div>
  </div>
</template>

<script>
// refund_type  退换货类型(1-退款   2-退货退款  3-换货)
// 退货退款： 1 商家后台审核通过后  2 用户填写退货物流  3 商家后台收货  4商家后台退款

import refund from "@/shop-actions/refund";

import orderInfo from "@/components/order/orderInfo.vue"; //
import modalWuliu from "@/components/refund/modalWuliu.vue"; //填写快递信息
import modalRefundCancel from "@/components/refund/modalRefundCancel.vue"; //取消售后
import modalRefundReceive from "@/components/refund/modalRefundReceive.vue"; //换货 售后确认收货

import { mapState } from "vuex";

export default {
  name: "servicePage",
  components: {
    orderInfo,
    modalWuliu,
    modalRefundCancel,
    modalRefundReceive,
  },
  data() {
    return {
      refund_id: this.$route.query.refund_id,

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

      //需要提交的数据
      wuliu_company: "",
      wuliu_code: "",

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

    shop_info() {
      let info = {
        name: this.webConfig.com_remark,
        phone: this.webConfig.com_kefu,
        address: this.webConfig.com_address,
      };
      return info;
    },

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
      return this.refundObj.product_info || {};
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
        total = this.refundObj.product_info.jifen;
      } else {
        if (this.refundObj && this.refundObj.product_info) {
          let list = [this.refundObj.product_info];
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
      let { type, status, status_info, product_info, user_send } = data;

      if (product_info && product_info.jifen) {
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
      if (product_info) {
        this.list_goods = [product_info];
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
    this.setView();
  },
  methods: {
    setView() {
      this.refund_detail(); //获取详情
    },

    updateView() {
      this.setView();
    },

    //获取订单详情
    refund_detail() {
      this.$api("refund_detail", {
        id: this.refund_id,
      }).then((res) => {
        let { code, data, msg} = res;
        if (code == 200) {
          data.products = data.product_info;
          this.refundObj = data;
        }
      });
    },

    //取消申请
    refund_qxRefund() {
      this.$refs.modalRefundCancel.showModal = true;
    },

    //提交快递信息
    submit_kuaidi() {
      this.$refs.modalWuliu.showModal = true;
    },

    //取消售后申请
    refund_qxRefund() {
      this.$refs.modalRefundCancel.showModal = true;
      return;

      Dialog.confirm({
        title: "取消售后？",
        message: "取消售后之后，可以重新发起售后申请！",
      })
        .then(() => {
          refund.refund_qxRefund({
            params: {
              id: this.refund_id,
            },
            success: (data) => {
              this.setView();
            },
          });
        })
        .catch(() => {});
    },

    //提交退货信息
    onSubmitTuihuo() {
      let { wuliu_company, wuliu_code } = this;
      if (!wuliu_company) {
        alertErr("请填写物流公司");
        return;
      } else if (!wuliu_code) {
        alertErr("请填写物流单号");
        return;
      }

      this.$api("refund_addKuaidi", {
        id: this.$route.query.id,
        kuaidi_company: wuliu_company,
        kuaidi_orderId: wuliu_code,
      }).then((res) => {
        //console.log("退货信息提交", res);
        let { code } = res;
        if (code == 200) {
          this.setView();
        }
      });
    },

    //处理退还信息
    handle_tuihuan(data) {
      let { status, status_info } = data;

      if (status == 2) {
      }
      if (status == 2 || status == 6) {
        this.show_tuihuoxinxi = true;
      }

      // debugger
      if (data.kuaidi_json) {
        this.wuliu_company = data.kuaidi_json.company;
        this.wuliu_code = data.kuaidi_json.orderId;
        this.show_tuihuoxinxi = true;
      }
    },

    //提交物流
    submit_wuliu() {
      let { company, code } = this;
      if (!company) {
        alertErr("请输入物流公司");
        return;
      }
      if (!code) {
        alertErr("请输入快递单号");
        return;
      }

      this.$api("refund_addKuaidi", {
        id: this.refund_id,
        kuaidi_company: company,
        kuaidi_orderId: code,
      }).then((res) => {
        let { code, data, msg} = res;
        if (code == 200) {
          this.show_kuaidi_modal = false;
          this.setView();
        }
      });
    },

    //换货 —— 买家确认收货
    refund_goods_receive() {
      this.$refs.modalRefundReceive.init(this.refund_id);
    },
  },
};
</script>


<style scoped lang="less">
/deep/ .order-list-wrap {
  margin-top: 30px;
}
/deep/ .info-heji {
  display: none !important;
}

/deep/.order-code {
  display: none;
}




.page {
  padding-bottom: 50px;

  .main-title {
    .flex-between();

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

      background: #4CA5E4;
      color: #fff;
      font-size: 14px;
    }

  }

  .page-ctx {
    padding: 24px 32px;
    background: #fff;
  }

}


.step-clip-box {
  // margin-bottom: 10px;
  .step-box {
    width: 100%;
    margin: 0 auto;
    font-size: 14px;
    .flex();
    .step {
      flex: 1;
      height: 48px;
      line-height: 48px;
      text-align: center;
      background: #eee;
      cursor: pointer;
      transition: 0.3s;
      clip-path: polygon(0% 0%, 97% 0%, 100% 50%, 97% 100%, 0% 100%, 3% 50%);
      &:hover {
        opacity: 0.75;
      }

      &:first-child {
        clip-path: polygon(0% 0%, 97% 0%, 100% 50%, 97% 100%, 0% 100%);
      }
      &:last-child {
        clip-path: polygon(0% 0%, 100% 0%, 100% 50%, 100% 100%, 0% 100%, 3% 50%);
      }

      &.active {
        background: #4CA5E4;
        color: #fff;
      }
    }
  }
}

.step-trans-box {
  .step-box {
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: 20px;
    color: #9f9f9f;

    .flex();

    .step-item {
      flex: 1;
      height: 48px;
      line-height: 48px;
      position: relative;
      background: #eee;

      .right-arrow {
        position: absolute;
        z-index: 100;
        right: -48px;
        top: 0;
        width: 30px;
        height: 100%;

        border: 24px solid transparent;
        border-left-color: #e5e5e5;
      }

      &:nth-child(3) {
        .right-arrow {
          display: none;
        }
      }
    }

    &.step-1 {
      .step-item {
        &:nth-child(1) {
          background: #4CA5E4;
          color: #fff;

          .right-arrow {
            border-left-color: #4CA5E4;
          }
        }
      }
    }
    &.step-2 {
      .step-item {
        &:nth-child(2) {
          background: #4CA5E4;
          color: #fff;

          .right-arrow {
            border-left-color: #4CA5E4;
          }
        }
      }
    }
    &.step-3 {
      .step-item {
        &:nth-child(3) {
          background: #4CA5E4;
          color: #fff;

          .right-arrow {
            border-left-color: #4CA5E4;
          }
        }
      }
    }
  }
}

.refund-info {
  min-height: 210px;
  background: #ffffff;
  border: 1px solid #cccccc;
  // border-top: none;

  .refund-info-title {
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
  .refund-info-content {
    padding: 20px;
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

.item-good {
  padding: 20px;
  border-bottom: 1px dashed #ccc;
  .flex();

  &:last-child {
    border: none;
  }

  .img-box {
    width: 100px;
    img {
      width: 100px;
      height: 100px;
    }
  }
  .title {
    text-align: left;
    padding-left: 20px;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: 20px;
    color: #333333;

    flex: 2;
  }
  .num {
    width: 100px;
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: 20px;
    color: #999999;
  }
  .price {
    text-align: right;
    width: 150px;
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: 20px;
    color: #333333;
  }
}

// 售后进度
.jindu-box {
  padding: 20px;
  text-align: left;
  background: #ffffff;
  border: 1px solid #cccccc;
  border-top: none;
  margin-bottom: 40px;

  .section {
    background: #fff;
    padding: 0 12px;
    margin-bottom: 12px;
    padding-top: 12px;
    padding-bottom: 12px;
  }

  .section.section-status {
    background: #4CA5E4;
    color: #ffffff;
    padding: 30px;

    div {
      .text-1 {
        color: #fff;
      }
      .text-2 {
        color: #fff;
      }
      .text-3 {
        color: #fff;
      }
    }
  }

  // 寄回
  .section-jihui {
    .jihui {
      .text-1 {
        font-size: 21px;
        font-family: PingFang SC;
        font-weight: 500;
        line-height: 30px;
        color: #222222;
        color: #fff;
      }

      .text-2 {
        margin-top: 8px;
        font-size: 12px;
        font-family: PingFang SC;
        font-weight: 400;
        line-height: 17px;
        color: #a5a5a5;
        color: #fff;

        b {
          color: #000;
        }
      }
    }
  }

  //寄回 商家地址
  .section-shangjia {
    .shangjia-dizhi {
      font-size: 13px;
      font-family: PingFang SC;
      font-weight: 400;
      line-height: 25px;
      color: #222222;
      .text-1 {
      }
      .text-2 {
      }
      .text-3 {
        margin-top: 15px;
        button {
          width: 345px;
          height: 44px;
          border: 1px solid #ff9312;
          border-radius: 24px;
          background: #fff;

          font-size: 14px;
          font-family: PingFang SC;
          font-weight: 400;
          line-height: 18px;
          color: #ff9312;
        }
      }
    }
  }
  //须知
  .section-xuzhi {
    .xuzhi {
      .text-1 {
        font-size: 13px;
        font-family: PingFang SC;
        font-weight: 400;
        line-height: 19px;
        color: #222222;
      }
      .text-2 {
        margin-top: 8px;
        font-size: 12px;
        font-family: PingFang SC;
        font-weight: 400;
        line-height: 17px;
        color: #a5a5a5;
      }
    }
  }

  // 商家售后

  .shangjia-shouhuo {
    .text-1 {
      font-size: 21px;
      font-family: PingFang SC;
      font-weight: 500;
      line-height: 30px;
      color: #222222;
    }
  }

  // 退还完成
  .section-done {
    .tuikuan-done {
      .text-1 {
        font-size: 21px;
        font-family: PingFang SC;
        font-weight: 500;
        line-height: 30px;
        color: #222222;
      }
      .text-2 {
        margin-top: 12px;
        margin-bottom: 10px;
        font-size: 21px;
        font-family: PingFang SC;
        font-weight: 800;
        line-height: 18px;
        color: #f13f17;
      }
      .text-3 {
        font-size: 13px;
        font-family: PingFang SC;
        font-weight: 400;
        line-height: 16px;
        color: #656565;
      }
    }
  }
  .section-quxiao {
    .quxiao {
      .text-1 {
        font-size: 21px;
        font-family: PingFang SC;
        font-weight: 500;
        line-height: 30px;
        color: #222222;
      }
      .text-2 {
        margin-top: 8px;
        font-size: 12px;
        font-family: PingFang SC;
        font-weight: 400;
        line-height: 17px;
        color: #a5a5a5;
      }
    }
  }

  .action-box {
    button {
      margin-bottom: 15px;
      background: #ff9312;
      border-color: #ff9312;
    }
  }
}

.refund-action {
  margin-top: 30px;

  .btn-box {
    button {
      width: 200px;
      height: 40px;
      background: linear-gradient(90deg, #ff9312 0%, #eb5d53 100%);
      line-height: 40px;
      color: #fff;
    }
  }
}

.shangjia-tuihuo-wuliu {
  line-height: 40px;
  margin-bottom: 15px;

  b {
    font-weight: normal;
  }

  .shangjia-tuihuo-wuliu-title {
    font-weight: bold;
  }

  .btn-tuihuan-receive {
    margin-top: 10px;
    width: 200px;
    height: 40px;
    background: linear-gradient(90deg, #ff9312 0%, #eb5d53 100%);
    line-height: 40px;
    color: #fff;
  }
}

.user-tuihuo-wuliu {
  line-height: 40px;
}
</style>
