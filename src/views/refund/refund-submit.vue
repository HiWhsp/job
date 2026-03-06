<template>
  <div class="page">
    <div class="refund-info">

      <div class="form-wrap">
        <div class="form-box">

          <div class="input-box">
            <div class="label"><span>*</span>Product status :</div>
            <div class="action">
              <el-radio-group v-model="product_status">
                <el-radio :label="1">Received</el-radio>
                <el-radio :label="2" v-if="type == 1">Not reveived</el-radio>
              </el-radio-group>
            </div>
          </div>

          <div class="input-box">
            <div class="label"><span>*</span>Reason for refund :</div>
            <div class="action">
              <el-select v-model="refund_reason" placeholder="please select">
                <el-option v-for="item in refund_reasons" :key="item.tilte" :label="item.tilte" :value="item.title">
                </el-option>
              </el-select>
            </div>
          </div>

          <div class="input-box" v-if="type == 1 || type == 2" style="align-items: flex-start;">
            <div class="label">
              Refund amount :
            </div>
            <div class="action">
              <el-input placeholder="Please enter the refund amount" v-model="refund_money" />
              <span class="desc">Up to US${{ actualRefundAmount }}, including shipping fee of US${{ order.payInfo.yunfei || 0 }}</span>
            </div>
          </div>

          <div class="input-box remark-box">
            <div class="label"><span>*</span>Refund Details :</div>
            <div class="action">
              <el-input type="textarea" placeholder="Please describe the problem…" v-model="refund_remark"
                :autosize="{ minRows: 6 }" />
            </div>
          </div>
          <div class="input-box upload-box">
            <div class="label">Upload image :</div>
            <div class="action">
              <el-upload class="upload-demo" list-type="picture-card" multiple accept="image/*" :name="UPLOAD_NAME"
                :action="UPLOAD_ACTION" :on-success="on_success_upload" :before-upload="on_before_upload"
                :data="mix_upload_data">
                <img src="@img/refund/upload.png" alt="">
              </el-upload>
              <div class="upload-tip">Upload up to 6 photos</div>
            </div>
          </div>

          <!-- 退货地址（仅退货退款 type=2 显示） -->
          <div class="return-address-box" v-if="type == 2">
            <div class="input-box return-address-item">
              <div class="label">Return Method :</div>
              <div class="action">{{ returnAddress.method || 'Return by Express' }}</div>
            </div>
            <div class="input-box return-address-item">
              <div class="label">Return Address :</div>
              <div class="action">
                <div class="return-address-text" v-if="returnAddress.address">{{ returnAddress.address }}</div>
                <div class="return-address-empty" v-else>-</div>
                <div class="return-address-extra" v-if="returnAddress.consignee || returnAddress.phone">
                  <div class="extra-row" v-if="returnAddress.consignee">
                    <span class="extra-label">Consignee:</span>
                    <span class="extra-val">{{ returnAddress.consignee }}</span>
                  </div>
                  <div class="extra-row" v-if="returnAddress.phone">
                    <span class="extra-label">Contact Information:</span>
                    <span class="extra-val">{{ returnAddress.phone }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="submit-box">
            <button class="btn btn-ripple" @click="submit_refund">SUBMIT</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { UPLOAD_ACTION, UPLOAD_NAME } from "@/config/env.js";

import { mapState } from "vuex";

export default {
  name: "page-refund-submit",
  components: {
  },
  data() {
    return {
      // orderId: this.$route.query.orderId,
      // inventoryId: this.$route.query.inventoryId,
      // type: this.$route.query.type,
      //
      UPLOAD_ACTION,
      UPLOAD_NAME,
      type_title: '',
      type_map: {
        1: "I want a refund (no return required)",
        2: "I want a return and refund",
      },
      //
      order: {}, //
      orderObj: {}, //
      currency: "",
      product_info: {},
      product: {},
      product_status: 1,
      max_refund_money: 0,//可申请的最大退款金额
      shouhuoInfo: {},
      address_select: {},
      product_select: {},
      // 退货地址（type=2 退货退款时展示，可从订单详情或配置获取）
      returnAddress: {
        method: "Return by Express",
        address: "",
        consignee: "",
        phone: ""
      },
      //
      refund_reason: "",
      refund_money: "",
      refund_remark: "",

      //
      upload_pic_list: [],
      //图片预览
      dialogVisible: false,
      dialogImageUrl: "",
    };
  },
  props: {
    orderId: {
      type: String,
      default: ""
    },
    inventoryId: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      default: ""
    },
    actualRefundAmount: {
      type: String,
      default: ""
    }
  },
  computed: {
    ...mapState([""]),

    refund_reasons() {
      let str = this.vuex_config.tuihuanReason
      let arr = []
      try {
        arr = JSON.parse(str) || []
      } catch (e) {
        //TODO handle the exception
      }
      return arr
    },

    upload_data() {
      let data = {
        action: "index_upload",
        userId: localStorage.getItem("userId") || "",
        token: localStorage.getItem("token") || "",
      };
      return data;
    }
  },
  created() {
    this.initParams()
    this.setView();
  },
  methods: {
    initParams() {
      this.type_title = this.type_map[this.type]
      if (this.type == 2) {
        this.query_address();
      }
    },
    setView() {
      this.query_order();
    },
    //订单产品
    query_order() {
      this.$api({
        url: '/service.php',
        method: 'get',
        data: {
          action: 'orders_detail',
          id: this.orderId
        },
      }).then((res) => {
        if (res.code == 200) {
          let data = res.data;
          this.order = data;
          this.orderObj = data;
          this.product_info = data.products.find(v => v.id == this.inventoryId) || {};
          this.max_refund_money = parseFloat(this.product_info.priceSale * this.product_info.num);
          this.shouhuoInfo = data.shouhuoInfo

          if (data && data.if_jifen) {
            this.currency = "积分";
          }
        }
      });
    },

    query_address() {
      this.$api({
        url: '/service.php',
        method: 'get',
        data: {
          action: 'userAddress_lists',
          page: 1,
          pageNum: 100
        },
      }).then(res => {
        if (res.code == 200) {
          let list = res.data;
          this.returnAddress = list[0];
        }
      })
    },


    //提交
    submit_refund() {
      //退换货类型(1-退款   2-退货退款)
      let params = {
        action: 'refund_add',
        orderId: this.orderId,
        inventoryId: this.inventoryId,
        type: this.type, //退换货类型(1-退款 2-退货退款)
        num: this.product_info.num,
        reason: this.refund_reason,
        remark: this.refund_remark,
        money: this.refund_money,
        images: this.upload_pic_list.join(","),
      };
      console.log("要提交的信息", params);
      // return;

      if (!this.refund_reason) {
        alertErr("please select the reason for refund");
        return;
      }

      if (!this.refund_money) {
        return alertErr("please enter the refund amount");
      }
      if (Number(this.refund_money) > Number(this.actualRefundAmount)) {
        return alertErr("the refund amount should be less than or equal to the product amount");
      }
      // if (!this.refund_remark) {
      //   alertErr("请填写详细说明");
      //   return;
      // }

      this.$api({
        url: '/service.php',
        method: 'get',
        data: params,
      }).then(res => {
        alert(res)
        if (res.code == 200) {
          this.mix_toRoute({
            path: '/refund-list',
            query: {

            }
          })
        }
      })
    },
    //上传相关
    on_success_upload(res, file) {
      console.log("上传结果 res", res);
      if (res.code == 200) {
        let url = res.data;
        this.upload_pic_list.push(url);
      }
    },
    on_before_upload(file) {
      const isLt2M = file.size / 1024 / 1024 < 20; //文件大小
      return isLt2M;
    },

    do_choose_addr() {
      this.$refs.refund_address_list_modal.init(this.order)
    },
    do_confirm_address(info) {
      this.address_select = info;
    },
    do_confirm_product(info) {
      this.product_select = info;
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
  }

  .page-ctx {
    padding: 30px 36px;
    background: #fff;
  }
}



.refund-product-detail {
  .refund-item {
    border: 1px solid #eee;

    .base-box {
      height: 48px;
      padding: 0 15px;
      background: #f9f9f9;

      .date {
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 20px;
        color: #7d7d7d;
      }

      .order-code {
        flex: 2;
        text-align: left;
        padding-left: 20px;

        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 20px;
        color: #7d7d7d;

        span {
          color: #333333;
        }
      }

      .order-state {
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 20px;
        color: #505050;
      }
    }

    .product-box {
      .product-list {

        .product-item {
          padding: 20px;
          border-bottom: 1px dashed #ccc;

          &:last-child {
            border-bottom: none;
          }



          .box-pic {
            width: 100px;

            .img-box {
              width: 100px;

              img {
                width: 100px;
                height: 100px;
              }
            }
          }

          .box-title {
            flex: 1;
            padding-left: 20px;

            .title {
              text-align: left;
              font-size: 14px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              line-height: 20px;
              color: #333333;
            }

            .sku {
              margin-top: 20px;
              text-align: left;
              font-size: 14px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              line-height: 20px;
              color: #333333;
            }
          }

          .box-price {
            min-width: 100px;

            .price {
              font-size: 16px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              line-height: 20px;
              color: #333333;
            }
          }


          .box-num {
            width: 100px;

            .num {

              font-size: 16px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              line-height: 20px;
              color: #505050;
            }
          }

          .box-xiaoji {
            min-width: 100px;

            .price {
              font-size: 16px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              line-height: 20px;
              color: #333333;
            }
          }


        }

      }
    }
  }
}


.form-wrap {
  margin-top: 30px;
  text-align: left;

  .return-address-box {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #eee;

    .return-address-text {
      font-size: 14px;
      color: #1E262E;
      line-height: 22px;
      white-space: pre-wrap;
      word-break: break-word;
    }

    .return-address-empty {
      color: #999;
    }

    .return-address-extra {
      margin-top: 12px;
      font-size: 14px;
      color: #505050;

      .extra-row {
        margin-bottom: 6px;

        &:last-child {
          margin-bottom: 0;
        }
      }

      .extra-label {
        margin-right: 8px;
        color: #1E262E;
      }

      .extra-val {
        color: #1E262E;
      }
    }
  }

  .input-box {
    display: flex;
    align-items: center;
    margin-bottom: 25px;

    &.shouhuo-box {
      align-items: flex-start;
    }

    &.remark-box {
      align-items: flex-start;
    }

    &.upload-box {
      align-items: flex-start;
    }

    &.return-address-item .action {
      flex: 1;
      font-family: Poppins, Poppins;
      font-weight: 400;
      font-size: 20px;
      color: #1E262E;
      ;
      line-height: 30px;
    }

    .label {
      min-width: 210px;
      height: 28px;
      font-family: Poppins, Poppins;
      font-weight: 400;
      font-size: 20px;
      color: #1E262E;
      line-height: 30px;
      text-align: right;
      margin-right: 26px;

      span {
        color: #FF0000;
      }
    }

    .action {
      width: 455px;
      font-size: 20px;

      .el-input {
        width: 100%;
      }

      .el-select {
        width: 100%;
      }

      .shouhuo {
        .rec {
          display: flex;
          align-items: center;

          .text {
            min-width: 75px;
          }

          .val {}
        }
      }

      .desc {
        display: inline-block;
        margin-top: 10px;
        font-family: Poppins, Poppins;
        font-weight: 400;
        font-size: 20px;
        color: #999999;
        line-height: 24px;
      }

      :deep(.el-upload--picture-card) {
        width: 113px;
        height: 113px;
        border: none;
        line-height: 113px;

        img {
          width: 100%;
          height: 100%;
        }
      }

      :deep(.el-upload-list__item) {
        width: 113px;
        height: 113px;
        border: none;
        line-height: 113px;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .upload-tip {
        font-family: Poppins, Poppins;
        font-weight: 400;
        font-size: 20px;
        color: #999999;
        line-height: 28px;
      }
    }
  }

  .submit-box {
    margin-top: 40px;
    padding-left: 120px;

    .btn {
      width: 300px;
      height: 80px;
      background: #EC6A2B;
      border-radius: 10px 10px 10px 10px;

      font-family: Poppins, Poppins;
      font-weight: 600;
      font-size: 24px;
      color: #FFFFFF;
    }
  }
}


.huanhuo-receive {
  margin-bottom: 15px;

  .btn {
    width: 111px;
    height: 37px;
    background: #F9F9F9;
    border-radius: 0px 0px 0px 0px;
    border: 2px solid #ddd;
    font-family: Microsoft YaHei, Microsoft YaHei;
    font-weight: 400;
    font-size: 12px;
    color: #333333;
  }

  .rec {
    margin-bottom: 10px;
    font-size: 14px;
    color: #333;
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/page/shipei3.less"></style>
<style scoped lang="less" src="@/assets/h5css/page/shipei3.less"></style>
<style scoped lang="less" src="@/assets/h5css/modals/refundList.less"></style>