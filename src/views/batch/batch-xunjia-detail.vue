<template>
  <div class="page">
    <!-- 图片预览 -->
    <!-- <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog> -->
    <div class="page-title flex-between">
      <span>询价单详情</span>
    </div>

    <div class="page-ctx">
      <!-- <div class="step-box">
        <div class="step-info active">
          <div class="step-number">
            <div class="step-line step-line-1"></div>
            <div class="step-num">1</div>
            <div class="step-line step-line-2"></div>
          </div>
          <div class="step-title">提交报价</div>
          <div class="step-date">{{ info.dtTime }}</div>
        </div>
        <div
          class="step-info"
          :class="{ active: info.status >= 2 || info.status < 0 }"
        >
          <div class="step-number">
            <div class="step-line step-line-3"></div>
            <div class="step-num">2</div>
            <div class="step-line step-line-4"></div>
          </div>
          <div class="step-title">操作审核</div>
          <div class="step-date" style="visibility: hidden">-</div>
        </div>
        <div
          class="step-info"
          :class="{ active: info.status >= 3 || info.status < 0 }"
        >
          <div class="step-number">
            <div class="step-line step-line-5"></div>
            <div class="step-num">3</div>
            <div class="step-line step-line-6"></div>
          </div>
          <div class="step-title">
            {{
              info.status >= 0
                ? "订单完成"
                : info.status == -1
                ? "后台取消"
                : "用户取消"
            }}
          </div>
          <div class="step-date" style="visibility: hidden">-</div>
        </div>
      </div> -->

      <div class="base-ctx">
        <div class="base-title">
          <div class="data">
            {{ info.order ? info.order.createTime : "--" }}
          </div>
          <div class="data">
            询价单号：{{ info.order ? info.order.orderNo : "--" }}
          </div>
        </div>
        <div class="page-ctx">
          <div class="result-wrap">
            <div class="result-top">
              <div class="result-left">
                <div class="left-title">原始文件列</div>
                <div class="data-list">
                  <div
                    class="data-item"
                    :class="{ folded: !item.fold }"
                    v-for="(item, index) in origin"
                    :key="index"
                  >
                    <div class="info-box">
                      <div class="xuhao">{{ item.id }}</div>
                      <div class="item_box">
                        <div>
                          <img :src="item.image" alt="" />
                        </div>
                        <div class="info-box-right">
                          <div class="num ellipsis-1">
                            名称：{{ item.productName || "空" }}
                          </div>
                          <div class="num ellipsis-1">
                            品牌：{{ item.brandName || "空" }}
                          </div>
                          <div class="num ellipsis-1">
                            制造商型号：{{ item.sn || "--" }}
                          </div>
                          <div class="num ellipsis-1">
                            数量：{{ item.requireNum || "--" }}
                          </div>
                        </div>
                      </div>
                      <div class="fold-box-container" v-show="item.fold">
                        <div class="fold-box-item ellipsis-1">
                          需求日期：{{ item.requireDate || "--" }}
                        </div>
                        <div class="fold-box-item ellipsis-1">
                          需求描述：{{ item.description || "--" }}
                        </div>
                        <div class="fold-box-item ellipsis-1">
                          备注：{{ item.note || "--" }}
                        </div>
                      </div>
                      <div class="fold-box" @click="toggleFold(item, index)">
                        <div class="fold-box-text">
                          {{ item.fold ? "收起" : "展开" }}
                        </div>
                        <img
                          :src="
                            item.fold
                              ? require('@/assets/img/batch/fold.png')
                              : require('@/assets/img/batch/unfold.png')
                          "
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="result-right">
                <div class="right-title">
                  <div class="title">匹配结果列：商品信息</div>
                  <div class="title2">单价</div>
                  <div class="title2">状态</div>
                  <div class="title2">数量/操作</div>
                </div>
                <div class="match-list">
                  <div
                    class="match-item-loop"
                    v-for="(item, index) in products"
                    :key="index"
                  >
                    <div class="match-item">
                      <div class="check-box">
                        <el-checkbox
                          v-model="item.selected"
                          @change="handleChange(item, index)"
                        ></el-checkbox>
                      </div>
                      <div class="poster-box">
                        <img :src="item.product.thumb" alt="" />
                      </div>
                      <div class="title-box">
                        <div class="title">
                          {{ item.product.title || "空" }}
                        </div>
                        <div class="brand-box">
                          <div class="brand">
                            品牌名称：{{ item.product.brandName || "--" }}
                          </div>
                          <div class="sku">
                            订货编码：{{ item.product.inventory.sn || "--" }}
                          </div>
                        </div>
                      </div>
                      <div class="price-box">
                        <span class="price"
                          >{{ vuex_huobi }}{{ item.product.price }}</span
                        >
                      </div>
                      <div
                        class="order-state"
                        :class="'state-' + item.product.status"
                      >
                        {{ item.product.status == 0 ? "待报价" : "" }}
                        {{ item.product.status == 1 ? "已报价" : "" }}
                      </div>

                      <div class="num-box">
                        <el-input-number
                          v-model="item.productNum"
                          :min="1"
                          label="描述文字"
                        ></el-input-number>
                        <div class="btn-box">
                          <button
                            class="btn-ripple btn-sc"
                            @click="addCart(item)"
                          >
                            加入购物车
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="result-bottom">
              <div class="bottom-action-box">
                <div class="left-acts flex">
                  <div class="all-select">
                    <el-checkbox
                      v-model="checked_all"
                      @change="on_change_checked_all"
                      >{{ checked_all ? "反选" : "全选" }}</el-checkbox
                    >
                  </div>
                </div>
                <div class="right-acts flex">
                  <div class="total-price">
                    <span>总金额：</span>
                    <span class="price">{{ vuex_huobi }}{{ total_price.toFixed(2) }}</span>
                  </div>
                  <button
                    :disabled="jiesuanDisabled"
                    class="btn-ripple btn-cart"
                    @click="toOrder()"
                  >
                    立即下单
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "order-detail",
  data() {
    return {
      id: this.$route.query.id,
      order_id: this.$route.query.id,
      info: {},
      payInfo: {},
      shouhuoInfo: {}, //收货人信息
      fahuoInfo: {}, //发货信息
      total_product_number: 0,
      products: [],
      origin: [],
      full_receive_address: "",
      //
      is_finish_pay: false, //
      //
      is_jifen_goods: false,
      //
      detail: {}, //订单信息
      total_price: 0,

      pay_info: {}, //支付信息
      fahuo_info: {}, //发货信息
      invioceJson: {}, //发票
      peisong_info: {}, //门店配送信息
      peisong_type_text: "",
      peisong_type: "",

      is_payed: false, //是否已支付
      is_fahuo: false, //是否已发货
      is_mendian_peisong: false, //是否门店配送

      shequ: {},

      xianxia_imgs: [], //线下凭证信息
      is_xianxia: false, //是否线下转款
      pay_type: "", //支付方式

      checkedItem: [],
      checkedAttr: [],
      checked_all: false,
      jiesuanDisabled: false,
    };
  },
  computed: {
    ...mapState([""]),
  },
  mounted() {
    this.setView();
  },
  methods: {
    toggleFold(item, index) {
      this.$set(item, "fold", !item.fold);
    },
    handleChange(item, index) {
      this.total_price = this.products.reduce((total, item) => {
        if (item.selected) {
          return total + item.product.inventory.priceSale * item.productNum;
        }
        return total;
      }, 0);
    },
    setView() {
      this.query_order();
    },
    query_order() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "inquiry_getInquiryOrderDetail",
          orderId: this.id,
        },
      }).then((res) => {
        let { code, data, msg } = res;
        if (code == 200) {
          this.info = data;
          this.origin = data.origin;
          this.origin.forEach((item, index) => {
            if (item.fold === undefined) {
              this.$set(item, "fold", false);
            }
          });
          this.products = data.product || [];
          // this.total_price = 
          this.products.forEach((item, index) => {
            this.$set(item, "selected", false);
          });

          this.detail = data;
        }
      });
    },

    toOrder() {
      let data = this.products.filter((item) => item.selected).map((item) => ({
        title: item.product.title,
        image: item.product.thumb,
        inventoryId: item.product.inventoryId,
        productId: item.product.inventory.productId,
        keyVals: item.product.inventory.keyVals,
        num: item.productNum,
        priceSale: item.product.inventory.priceSale,
        priceMarket: item.product.inventory.priceMarket,
      }));

      if (!data.length) {
        this.$message.error("请选择要下单的商品");
        return;
      }

      this.$store.commit(
        "set_cache_payment_products",
        JSON.stringify(data)
      );

      this.$router.push({
        path: "/order-submit",
        query: {
          from: "batch-xunjia-detail",
        },
      });
    },

    addCart(item) {
      this.$api({
        url: "/service.php",
        method: "post",
        data: {
          action: "gouwuche_add",
          inventoryId: item.product.inventory.id,
          num: item.productNum,
        },
      }).then((res) => {
        if (res.code == 200) {
          this.$message.success("加入购物车成功");
        }
      });
    },

    on_change_checked_all() {
      if (this.checked_all) {
        this.products.forEach((item, index) => {
          this.$set(item, "selected", true);
        });
        this.total_price = this.products.reduce((total, item) => {
          if (item.selected) {
            return total + item.product.inventory.priceSale * item.productNum;
          }
          return total;
        }, 0);
      } else {
        this.products.forEach((item, index) => {
          this.$set(item, "selected", false);
        });
        this.total_price = 0
      }
    },
  },
};
</script>

<style scoped lang="less">
.page {
  width: 100%;
  .page-title {
    padding: 0 32px;
    text-align: left;
    height: 56px;
    line-height: 56px;
    background: #ffffff;
    font-size: 16px;
    font-family: Microsoft YaHei-Bold, Microsoft YaHei;
    font-weight: bold;
    color: #333333;
    width: 100%;
    button {
      min-width: 96px;
      height: 30px;
      line-height: 30px;
      background: #f74747;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }
  }
}

.page-ctx {
  .result-wrap {
    position: relative;
    z-index: 2;
    background: #ffffff;
    border: 1px solid #e5e5e5;
  }
  .result-top {
    display: flex;
    align-items: flex-start;

    .result-left {
      .left-title {
        height: 48px;
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: 400;
        font-size: 16px;
        color: #333333;
        line-height: 48px;
        padding-left: 16px;
      }
      .data-list {
        .data-item {
          margin-bottom: 20px;
          background: #f7f7f7;
          width: 315px;
          padding: 10px 10px 17px 10px;
          padding-bottom: 0;
          display: flex;
          align-items: flex-start;
          height: 190px;
          border-top: 1px solid #f74747;
          transition: height 0.3s ease;
          overflow: hidden;
          &.folded {
            height: 125px;
          }
          .check-box {
            width: 35px;
            text-align: center;
            line-height: 22px;
          }
          .info-box {
            flex: 1;
            position: relative;
            .fold-box {
              cursor: pointer;
              position: absolute;
              right: 0;
              top: 80px;
              padding: 4px 8px;
              background: #fafafa;
              border-radius: 4px 4px 4px 4px;
              border: 1px solid #dee1e7;
              display: flex;
              align-items: center;
              justify-content: space-between;
              .fold-box-text {
                font-family: Microsoft YaHei, Microsoft YaHei;
              }
              img {
                margin-left: 8px;
                width: 8px;
                height: 8px;
              }
            }
            .item_box {
              display: flex;
              align-items: center;
              .info-box-right {
                margin-left: 10px;
                width: 168px;
              }
              img {
                width: 80px;
                height: 80px;
                img {
                  width: 80px;
                  height: 80px;
                }
              }
            }
            .xuhao {
              font-family: Microsoft YaHei, Microsoft YaHei;
              font-weight: 400;
              font-size: 12px;
              color: #f74747;
              margin-bottom: 5px;
            }
            .title {
              margin: 10px 0;
              font-family: Microsoft YaHei, Microsoft YaHei;
              font-weight: 400;
              font-size: 12px;
              color: #333333;
            }
            .num {
              font-family: Microsoft YaHei, Microsoft YaHei;
              font-weight: 400;
              font-size: 12px;
              color: #333333;
            }

            .fold-box-container {
              margin-top: 10px;
              .fold-box-item {
                font-family: Microsoft YaHei, Microsoft YaHei;
                font-weight: 400;
                font-size: 12px;
                color: #333333;
                margin-bottom: 5px;
              }
            }
          }
        }
      }
    }
    .result-right {
      margin-left: 47px;
      flex: 1;
      .right-title {
        height: 48px;
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: 400;
        font-size: 16px;
        color: #333333;
        line-height: 48px;
        display: flex;
        align-items: center;
        margin-right: 80px;
        .title {
          flex: 1;
        }
        .title2 {
          width: 100px;
          text-align: center;
        }
      }

      .match-item {
        margin-bottom: 0;
        background: #fff;
        width: 100%;
        padding: 20px 0;
        display: flex;
        align-items: flex-start;
        height: 133px;
        border-top: 1px solid #f74747;
        .check-box {
          width: 35px;
          text-align: center;
          line-height: 22px;
        }

        .poster-box {
          width: 80px;
          height: 80px;
          img {
            width: 80px;
            height: 80px;
          }
        }
        .title-box {
          margin-left: 18px;
          flex: 1;
          .title {
            font-family: Microsoft YaHei, Microsoft YaHei;
            font-weight: 400;
            font-size: 14px;
            color: #333333;
          }
          .brand-box {
            width: 300px;
            .brand {
              font-family: Microsoft YaHei, Microsoft YaHei;
              font-weight: 400;
              font-size: 14px;
              color: #999;
            }
            .sku {
              font-family: Microsoft YaHei, Microsoft YaHei;
              font-weight: 400;
              font-size: 14px;
              color: #999;
            }
          }
        }
        .price-box {
          text-align: center;
          width: 100px;
          margin-top: 10px;
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: 400;
          font-size: 16px;
          color: #333333;
        }
        .order-state {
          text-align: center;
          width: 100px;
          color: #333;
          font-size: 14px;
          margin-top: 10px;
        }
      }
      .num-box {
        .btn-sc {
          margin-top: 10px;
          cursor: pointer;
          width: 180px;
          height: 46px;
          background: #fff2f2;
          border: 1px solid #e5222b;

          font-size: 16px;
          font-family: Microsoft YaHei;
          font-weight: bold;
          color: #e5222b;
          transition: 0.3s;
          user-select: none;

          &:disabled {
            opacity: 0.3;
            cursor: not-allowed;
          }
        }
      }
    }
  }
  .bottom-action-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 40px;
    height: 86px;
    background: #fafbfc;
    // border: 1px solid #eeeeee;
    // box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.08);
    opacity: 1;
    margin-top: 40px;
    padding-left: 16px;

    .left-acts {
      margin-left: 312px;
    }
    .all-select {
      cursor: pointer;
      min-width: 120px;
      width: fit-content;
      font-family: OPPOSans, OPPOSans;
      font-weight: 400;
      font-size: 14px;
      color: #666666;
    }

    .total-price {
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #666666;
      .price {
        font-size: 20px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        color: #f74747;
      }
    }

    .btn-sc {
      margin-left: 20px;
      cursor: pointer;
      width: 191px;
      height: 46px;
      background: #ff9900;

      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: #ffffff;
      transition: 0.3s;
      user-select: none;

      &:disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }
    }
    .btn-cart {
      margin-left: 20px;
      cursor: pointer;
      width: 191px;
      height: 46px;
      background: #f74747;

      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: #ffffff;
      transition: 0.3s;
      user-select: none;

      &:disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }
    }
  }
}

.step-box {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 55px 0;

  .step-info {
    text-align: center;

    &.active {
      .step-number {
        .step-num {
          background: #f74747;
          color: #fff;
        }

        .step-line {
          background: #f74747;
        }
      }
    }

    .step-number {
      margin: 0 auto;
      display: flex;
      align-items: center;

      .step-line {
        width: 147px;
        height: 2px;
        background: #f5f5f5;

        &.step-line-1 {
          visibility: hidden;
        }

        &.step-line-6 {
          visibility: hidden;
        }
      }

      .step-num {
        width: 44px;
        height: 44px;
        line-height: 44px;
        background: #edf6fd;
        border-radius: 50%;

        font-size: 20px;
        font-family: sans-serif;
        font-weight: 400;
        color: #999999;
      }
    }

    .step-title {
      margin-top: 14px;
      margin-bottom: 10px;
      font-family: OPPOSans, OPPOSans;
      font-weight: 400;
      font-size: 14px;
      color: #000000;
    }

    .step-date {
      font-family: OPPOSans, OPPOSans;
      font-weight: 400;
      font-size: 12px;
      color: #808080;
    }
  }
}

.base-ctx {
  margin-top: 10px;
  background: #ffffff;
  padding: 20px 34px;

  .base-title {
    display: flex;
    align-items: center;
    gap: 10px;
    padding-left: 24px;
    height: 48px;
    line-height: 48px;
    background: #f9f9f9;
    color: #333;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: bold;

    color: #333333;
  }

  .base-infos {
    //   display: flex;
    align-items: flex-start;
    justify-content: space-between;
    display: flex;
    flex-wrap: wrap;
    padding: 20px 25px;

    .base-info {
      width: calc(100% / 3);
      margin-bottom: 30px;
      text-align: left;
      padding-right: 40px;

      // flex: 1;
      .info-title {
        font-size: 14px;
        font-family: sans-serif;
        font-weight: 400;
        color: #999999;
        color: #333;
        margin-bottom: 10px;
      }

      .info-content {
        min-height: 20px;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 20px;
        color: #666;

        > div {
          margin-bottom: 5px;

          span {
            display: inline-block;
            // min-width: 80px;
          }
        }
        .info-group {
          margin-top: 16px;
        }

        .info-info {
          display: flex;
          margin-bottom: 5px;
          .label {
            margin-right: 10px;
            width: fit-content;
          }

          .val {
            flex: 1;
          }
        }
      }
    }
  }
}

.pingzheng-box {
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  .pingzheng-info {
    border: 1px solid #eee;
    margin-bottom: 10px;
    margin-right: 10px;
  }
}

.order-info {
  .money-yh {
    span {
      color: #04be02;
      font-weight: bold;
    }
  }

  .money-heji {
    span {
      color: #f74747;
      font-weight: bold;
    }
  }

  .zhifufangshi-wrap {
    margin-bottom: 0 !important;
    padding: 10px 0;
    width: 100%;
    border-top: 1px dashed #e5e5e5;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .zhifufangshi {
      display: flex;
      align-items: center;

      .pay-info {
        display: flex;
        align-items: center;
        margin-left: 10px;

        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        line-height: 24px;
        color: #f74747;

        .pay-title {
          margin-right: 5px;
        }

        .pay-money {
        }
      }
    }
  }

  .order-list-wrap {
    .info-wrapper {
      position: relative;
      width: 100%;
      height: 480px;
      overflow: auto;
    }
    .info-info {
      position: absolute;
      top: 0;
      bottom: 0;
      border: 1px solid #f5f5f5;
      margin-bottom: 30px;
      // overflow-x: auto;
      // max-width: 70vw;
    }

    .info-title {
      display: flex;
      align-items: center;
      // justify-content: space-between;
      height: 48px;
      padding: 0 24px;
      background: #f9f9f9;
      border-bottom: 1px solid #f5f5f5;
      // width: 150%;
      font-size: 14px;
      font-family: Microsoft YaHei-Bold, Microsoft YaHei;
      font-weight: bold;
      color: #333333;

      .date {
      }

      .order-code {
        flex: 2;
        text-align: left;
        padding-left: 20px;

        span {
        }
      }
      .box-title {
        // flex: 1;
        text-align: left;
        width: 700px;
      }

      .box-sku {
        text-align: center;
        width: 100px;
      }
      .box-remark {
        width: 256px;
        text-align: center;
      }
      .box-num {
        text-align: center;
        width: 100px;
      }
      .box-date {
        text-align: center;
        width: 256px;
      }
      .box-price,
      .box-subtotal {
        text-align: center;
        width: 200px;
      }
    }

    .info-good {
      // width: 120%;
      box-sizing: border-box;
      .list-good {
        box-sizing: border-box;
        .info {
          border-bottom: 1px solid #f5f5f5;

          &:last-child {
            border-bottom: none;
          }
        }

        .info-good {
          padding: 20px;
          border-bottom: 1px dashed #f5f5f5;

          &:last-child {
            border: none;
          }

          .box-image {
            width: 100px;
            height: 100px;
            cursor: pointer;
            border: 1px solid #f5f5f5;

            /deep/ img {
              width: 100px;
              height: 100px;
              object-fit: contain;
              object-fit: cover;
            }

            img {
              width: 100px;
              height: 100px;
              object-fit: contain;
              object-fit: cover;
            }
          }

          .box-title {
            // flex: 1;
            text-align: left;
            padding-left: 40px;
            width: 600px;
            .title {
              width: fit-content;
              cursor: pointer;

              &:hover {
                color: #f74747;
              }
            }
          }

          .box-sku {
            text-align: center;
            width: 100px;
          }
          .box-remark {
            width: 256px;
            text-align: center;
          }
          .box-num {
            text-align: center;
            width: 100px;
          }
          .box-date {
            text-align: center;
            width: 256px;
          }
          .box-price,
          .box-subtotal {
            text-align: center;
            width: 200px;

            font-family: OPPOSans, OPPOSans;
            font-weight: 400;
            font-size: 14px;
            color: #ff0000;
          }
        }

        .goods-action {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding: 10px;

          button {
          }

          .btn-goods-action {
            padding-left: 10px;
            padding-right: 10px;
            margin-left: 10px;
            min-width: 96px;
            height: 30px;
            background: #f74747;
            font-size: 14px;
            font-family: Microsoft YaHei;
            color: #ffffff;
            // border-radius: 14px;
            transition: 0.3s;
            border-radius: 4px;

            &:hover {
              opacity: 0.8;
            }

            &.disabled {
              background: #e5e5e5;
            }
          }
        }
      }
    }
  }

  // 商品信息汇总和订单操作

  .info-heji {
    background: #fafafa;
    padding: 24px 40px;
    border-top: 1px solid #f5f5f5;
    //   display: flex;
    align-items: center;
    justify-content: space-between;
    align-items: flex-start;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: 20px;
    color: #666;

    .money-box {
      text-align: right;

      .count {
        font-weight: bold;
        color: #f74747;
      }

      .money-info {
        margin-bottom: 16px;
        display: flex;
        justify-content: flex-end;

        &:last-child {
          margin-bottom: 0;
        }

        .label {
          font-family: Arial, Arial;
          font-weight: 400;
          font-size: 14px;
          color: #666666;
        }

        .value {
          min-width: 180px;
          font-family: Arial, Arial;
          font-weight: 400;
          font-size: 14px;
          color: #666666;
        }

        .money-num {
          &.money-total {
            font-family: Arial, Arial;
            font-weight: bold;
            font-size: 20px;
            color: #ff0000;
          }
        }
      }
    }
  }

  .order-action-box {
    display: flex;
    justify-content: flex-end;

    .btn-box {
      // margin-top: 10px;

      button {
        transition: 0.3s;
        min-width: 120px;
        height: 32px;
        background: #ffffff;
        border-radius: 50px 50px 50px 50px;
        border: 1px solid #f74747;
        font-family: Arial, Arial;
        font-weight: 400;
        font-size: 14px;
        color: #f74747;

        & + button {
          margin-left: 20px;
        }

        &.btn-bg {
          background: #f74747;
          color: #fff;
        }

        &:hover {
          opacity: 0.7;
        }
      }
    }
  }
}
</style>
