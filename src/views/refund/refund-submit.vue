<template>
  <div class="page">
    <div class="page-title">售后服务</div>
    <div class="page-ctx">
      <div class="refund-product-detail">
        <div class="refund-item">
          <div class="base-box flex">商品信息</div>
          <div class="product-box">
            <div class="product-list">
              <div class="product-item flex">
                <div class="box-pic">
                  <div class="img-box">
                    <img :src="product_info.image" alt />
                  </div>
                </div>
                <div class="box-title">
                  <div class="title">{{ product_info.title }}</div>
                  <div class="sku">{{ product_info.keyVals }}</div>
                </div>
                <div class="box-price">
                  <div class="price">
                    {{ order.is_jifen ? "积分" : "￥" }}
                    {{
                      order.is_jifen
                        ? product_info.jifen
                        : product_info.priceSale
                    }}
                  </div>
                </div>
                <div class="box-num">
                  <div class="num">x {{ product_info.num }}</div>
                </div>
                <div class="box-xiaoji">
                  <div class="price">
                    {{ vuex_huobi }}
                    {{ product_info.priceSale * product_info.num }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="refund-info">
        <div class="form-wrap">
          <div class="form-box">
            <!-- <div class="input-box">
              <div class="label">服务类型：</div>
              <div class="action">{{ type_title }}</div>
            </div> -->

            <div class="input-box">
              <div class="label">
                {{
                  type == 2
                    ? "退货原因："
                    : type == 3
                    ? "换货原因："
                    : "维修原因："
                }}
              </div>
              <div class="action">
                <el-select v-model="refund_reason" placeholder="请选择">
                  <el-option
                    v-for="item in refund_reasons"
                    :key="item.tilte"
                    :label="item.tilte"
                    :value="item.title"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>

            <div class="huanhuo-wrap" v-if="type == 3">
              <div class="input-box" style="align-items: flex-start">
                <div class="label">换新商品：</div>
                <div class="action">
                  <div class="huanhuo-tip">价格相同的商品才可以换货哦</div>
                  <div class="huanhuo-sku-info">
                    <refund_sku_choose
                      data-title="售后商品的sku选择"
                      ref="refund_sku_choose"
                      @confirm="do_confirm_product"
                    />
                  </div>
                </div>
              </div>
              <div class="input-box shouhuo-box">
                <div class="label">换货地址：</div>
                <div class="action" style="width: fit-content">
                  <div class="huanhuo-receive">
                    <div
                      class="btn btn-ripple fit-text"
                      @click="do_choose_addr()"
                    >
                      选择收货地址
                    </div>
                  </div>
                  <div class="huanhuo-receive" v-if="address_select.id">
                    <div class="rec">
                      <span class="text">收货人: </span>
                      <span class="val"> {{ address_select.name }}</span>
                    </div>
                    <div class="rec">
                      <span class="text">收货地址:</span>
                      <span class="val">{{ address_select.phone }} </span>
                    </div>
                    <div class="rec">
                      <span class="text">手机号码: </span>
                      <span class="val">
                        {{ address_select.province }}{{ address_select.city
                        }}{{ shouhuoInfo.area }} {{ shouhuoInfo.address }}</span
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="input-box"
              v-if="type_title == '退款' || type_title == '退货退款'"
            >
              <div class="label">
                {{ type_title == "退款" ? "退款金额：" : "退款金额" }}：
              </div>
              <div class="action">
                <el-input placeholder="请输入退款金额" v-model="refund_money" />
                <span style="color: #999; font-size: 12px"
                  >最多￥{{ product_info.priceSale }}, 含运费￥{{
                    product_info.yunfei || 0
                  }}</span
                >
              </div>
            </div>

            <div class="input-box remark-box">
              <div class="label">
                {{
                  type == 2
                    ? "退货说明："
                    : type == 3
                    ? "换货说明："
                    : "维修说明："
                }}
              </div>
              <div class="action">
                <el-input
                  type="textarea"
                  :placeholder="
                    type == 2
                      ? '请输入退货说明：'
                      : type == 3
                      ? '请输入换货说明：'
                      : '请输入维修说明：'
                  "
                  v-model="refund_remark"
                  :autosize="{ minRows: 6 }"
                />
              </div>
            </div>
            <div class="input-box upload-box">
              <div class="label">上传凭证：</div>
              <div class="action">
                <el-upload
                  class="upload-demo"
                  list-type="picture-card"
                  multiple
                  accept="image/*"
                  :file-list="upload_pic_list_url"
                  :name="mix_upload_name"
                  :action="mix_upload_action"
                  :on-success="on_success_upload"
                  :before-upload="on_before_upload"
                  :data="mix_upload_data"
                >
                  <img src="@img/refund/upload.png" alt="" />
                </el-upload>
              </div>
            </div>
            <div class="input-box" v-if="type == 2">
              <div class="label">退货方式：</div>
              <div class="action">自行寄回</div>
            </div>
            <div class="input-box upload-box" v-if="type == 2 || type == 4">
              <div class="label">我的地址：</div>
              <div class="action">
                <p style="margin-bottom: 10px; color: #7d7d7d; font-size: 14px">
                  张三 1810000000
                </p>
                <p style="color: #7d7d7d; font-size: 14px">
                  详细地址：中关村东路XXX号 XXXXXXX
                </p>
              </div>
            </div>

            <div class="submit-box">
              <button class="btn btn-ripple" @click="submit_refund">
                提交申请
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <refund_address_list_modal
      data-title="售后选择地址"
      ref="refund_address_list_modal"
      @confirm="do_confirm_address"
    />
  </div>
</template>

<script>
import refund_sku_choose from "@/components/refund/refund_sku_choose.vue";
import refund_address_list_modal from "@/components/refund/refund_address_list_modal.vue";

import { mapState } from "vuex";

export default {
  name: "page-refund-submit",
  components: {
    refund_sku_choose,
    refund_address_list_modal,
  },
  data() {
    return {
      //
      type_title: "",
      type_map: {
        1: "退款",
        2: "退货退款",
        3: "换货",
      },
      //
      order: {}, //
      orderObj: {}, //
      currency: "",
      product_info: {},
      product: {},
      max_refund_money: 0, //可申请的最大退款金额
      shouhuoInfo: {},
      address_select: {},
      product_select: {},
      //
      refund_reason: "",
      refund_money: "",
      refund_remark: "",

      //
      upload_pic_list: [],
      upload_pic_list_url: [],
      //图片预览
      dialogVisible: false,
      dialogImageUrl: "",
    };
  },
  computed: {
    ...mapState([""]),

    refund_reasons() {
      let str = "";
      if (this.type == 3 || this.type == 2) {
        str = this.vuex_config.tuihuanReason;
      } else {
        str = this.vuex_config.weixiuReason;
      }
      let arr = [];
      try {
        arr = JSON.parse(str) || [];
      } catch (e) {
        //TODO handle the exception
      }
      return arr;
    },

    upload_data() {
      let data = {
        action: "index_upload",
        userId: localStorage.getItem("userId") || "",
        token: localStorage.getItem("token") || "",
      };
      return data;
    },
  },
  created() {
    this.initParams();
    this.setView();
  },
  methods: {
    initParams() {
      this.orderId = this.$route.query.orderId;
      this.inventoryId = this.$route.query.inventoryId;
      this.type = this.$route.query.type;
      this.type_title = this.type_map[this.type];
      if (this.type == 3 || this.type_title == "换货") {
        this.query_address();
      }
    },
    setView() {
      this.query_order();
    },
    //订单产品
    query_order() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "orders_detail",
          id: this.orderId,
        },
      }).then((res) => {
        if (res.code == 200) {
          let data = res.data;
          this.order = data;
          this.orderObj = data;
          this.product_info =
            data.products.find((v) => v.productId == this.inventoryId) || {};
          this.product = this.product_info;
          this.max_refund_money = parseFloat(data.price);
          this.shouhuoInfo = data.shouhuoInfo;

          if (data && data.if_jifen) {
            this.currency = "积分";
          }

          if (this.type == 3) {
            this.query_exchange_products();
          }
        }
      });
    },

    //可换货产品
    query_exchange_products() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "refund_showChangeProduct",
          inventoryId: this.inventoryId,
          productId: this.product.productId,
          num: this.product.num,
          priceSale: this.product.priceSale,
        },
      }).then((res) => {
        if (res.code == 200) {
          res.data.forEach((v) => {
            v.inventoryId = v.id;
          });
          this.exchange_products = res.data;
          this.$nextTick(() => {
            this.$refs.refund_sku_choose.init({
              inventorys: res.data,
            });
          });
        }
      });
    },

    query_address() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "userAddress_lists",
          page: 1,
          pageNum: 100,
        },
      }).then((res) => {
        if (res.code == 200) {
          let list = res.data;
          list.forEach((v) => {
            v.full_addr = [v.country, v.province, v.city, v.area]
              .filter((v) => !!v)
              .join("-");
            // v.xing = v.name[0] || ''
          });
          let cache_refund_address_id = localStorage.getItem(
            "cache_refund_address_id"
          );
          if (cache_refund_address_id) {
            this.address_select = list.find(
              (v) => v.id == cache_refund_address_id
            );
          }
        }
        // this.hideLoading()
      });
    },

    //提交评价
    submit_refund() {
      //退换货类型(1-退款   2-退货退款  3-换货)
      let params = {
        action: "refund_add",
        orderId: this.orderId,
        inventoryId: this.inventoryId,
        type: this.type, //退换货类型(1-退款 2-退货退款 3-换货 4-维修)
        num: this.product_info.num,
        reason: this.refund_reason,
        remark: this.refund_remark,
        money: this.refund_money,
        images: this.upload_pic_list.join(","),
        // addressId: this.address_select.id,//type=3 换货传用户地址id
        // new_product: ''//type=3换货 传换货的商品
      };
      if (this.type == 3) {
        params.addressId = this.address_select.id;
        params.new_product = JSON.stringify([
          {
            inventoryId: this.product_select.inventoryId,
            productId: this.product_select.productId,
            num: this.product_info.num,
          },
        ]);
      }
      console.log("要提交的信息", params);
      // return;

      if (!this.refund_reason) {
        alertErr("请选择售后原因");
        return;
      }

      if (this.type == 2) {
        //退货退款
        if (!this.refund_money) {
          return alertErr("请输入退款金额");
        }
        if (this.refund_money > Number(this.product_info.priceSale)) {
          return alertErr("退款金额应小于等于商品金额");
        }
      } else if (this.type == 3) {
        //换货
        if (!this.product_select.id) {
          return alertErr("请选择换货商品");
        }
        if (!this.address_select.id) {
          return alertErr("请选择换货收货地址");
        }
      }
      // if (!this.refund_remark) {
      //   alertErr("请填写详细说明");
      //   return;
      // }

      // debugger;
      this.$api({
        url: "/service.php",
        method: "get",
        data: params,
      }).then((res) => {
        alert(res);
        if (res.code == 200) {
          this.mix_toRoute({
            path: "/refund-list",
            query: {},
          });
        }
      });
    },

    //上传相关
    on_success_upload(res, file) {
      console.log("上传结果 res", res);
      if (res.code == 200) {
        let url = res.data;
        // 将图片地址设置到 file 对象中，el-upload 需要 url 属性才能显示
        file.url = url;
        this.upload_pic_list_url.push({
          name: file.name,
          url: url,
          uid: file.uid,
        });
        this.upload_pic_list.push(url);
      }
    },
    on_before_upload(file) {
      const isLt2M = file.size / 1024 / 1024 < 20; //文件大小
      return isLt2M;
    },

    do_choose_addr() {
      this.$refs.refund_address_list_modal.init(this.order);
    },
    do_confirm_address(info) {
      this.address_select = info;
    },
    do_confirm_product(info) {
      this.product_select = info;
    },
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
      background: #f5f5f5;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      line-height: 20px;
      color: #333333;

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
        color: #999999;
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
              font-size: 16px;
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
              color: #999;
            }
          }

          .box-price {
            min-width: 100px;

            .price {
              font-size: 16px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              line-height: 20px;
              color: #666;
            }
          }

          .box-num {
            width: 100px;

            .num {
              font-size: 16px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              line-height: 20px;
              color: #666;
            }
          }

          .box-xiaoji {
            min-width: 100px;

            .price {
              font-size: 16px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              line-height: 20px;
              color: #666;
            }
          }
        }
      }
    }
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
        color: #999999;
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
              color: #999999;
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

    .label {
      min-width: 90px;
      font-size: 14px;
    }

    .action {
      width: 455px;

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

          .val {
          }
        }
      }
    }
  }

  .submit-box {
    margin-top: 40px;
    padding-left: 90px;

    .btn {
      width: 240px;
      height: 40px;
      background: linear-gradient(90deg, #ff9312 0%, #eb5d53 100%);
      background: #2e4c87;
      border-radius: 30px;
      border-radius: 0;

      font-size: 16px;
      font-family: PingFang SC;
      font-weight: 400;
      line-height: 36px;
      color: #ffffff;
    }
  }
}

.huanhuo-receive {
  margin-bottom: 15px;

  .btn {
    width: 111px;
    height: 37px;
    background: #f9f9f9;
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

.upload-demo {
  :deep(.el-upload--picture-card) {
    width: 90px;
    height: 90px;
    border: none;
    line-height: 90px;
    img {
      width: 90px;
      height: 90px;
    }
  }
  :deep(.el-upload-list--picture-card) {
    .el-upload-list__item {
      width: 90px;
      height: 90px;
      img {
        width: 90px;
        height: 90px;
      }
    }
  }
}
</style>
