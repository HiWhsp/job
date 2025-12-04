<template>
  <el-dialog
    :visible.sync="visible"
    width="375px"
    custom-class="download-modal"
    @close="handleClose"
  >
    <div class="download-modal-content" v-if="isPaySuccess">
      <!-- 产品选择区域 -->
      <div class="product-section">
        <div class="product-list" ref="productList">
          <div
            v-for="(product, index) in products"
            :key="index"
            class="product-item"
            :class="{
              selected: selectedProductIndex === index,
              recommended: product.recommended,
            }"
            @click="selectProduct(index)"
          >
            <!-- 推荐标签 -->
            <div v-if="product.recommended" class="recommend-badge">
              <img src="@/assets/img/common/hotPay.png" alt="推荐" />
            </div>

            <!-- 选择图标 -->
            <div class="select-icon">
              <img
                v-if="selectedProductIndex === index"
                class="el-icon-check"
                src="@/assets/img/common/pay-yes.png"
                alt="选择"
              />
              <img v-else src="@/assets/img/common/pay-no.png" alt="选择" />
            </div>

            <!-- 产品信息 -->
            <div class="product-info">
              <h3 class="product-title">
                <img src="@/assets/img/common/word.png" alt="标题" />
                {{ product.title }}
              </h3>
              <p class="product-description">
                <el-tooltip :content="product.description" placement="top" v-if="!vuex_h5">
                  <span class="ellipsis-3">{{ product.description }}</span>
                </el-tooltip>
                 <span class="ellipsis-3" v-else>{{ product.description }}</span>
              </p>

              <div class="flex-between">
                <div class="product-meta">
                  <span class="format">{{ product.format }}</span>
                  <span class="size">{{ product.size }}</span>
                  <span class="pages">{{ product.pages }}</span>
                </div>
                <div class="product-price">
                  <span class="price-label">支付金额：</span>
                  <span class="price-value">¥{{ product.price }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 支付区域 -->
      <div class="payment-section">
        <div class="payment-left">
          <!-- 二维码区域 -->
          <div class="qr-codes">
            <div class="qr-item">
              <div class="qr-code wechat-qr">
                <img :src="wechatQR" alt="微信支付二维码" />
              </div>
              <div class="qr-label">
                <img src="@/assets/img/common/wechat.png" alt="微信" />
                <span>微信扫码支付</span>
              </div>
            </div>
            <div class="qr-item">
              <div class="qr-code alipay-qr">
                <img :src="alipayQR" alt="支付宝支付二维码" />
              </div>
              <div class="qr-label">
                <img src="@/assets/img/common/alipay.png" alt="支付宝" />
                <span>支付宝扫码支付</span>
              </div>
            </div>
          </div>

          <!-- 金额显示 -->
          <div class="amount-display">
            <div class="amount-display-top">
              <div class="amount-label">应付金额</div>
              <div class="amount-value">¥ {{ selectedProduct.price }}</div>
              <div class="amount-tip">付费成功即可下载本文档</div>
            </div>
            <div class="amount-display-bottom">
              <div class="title">
                <img src="@/assets/img/common/miaoze.png" alt="" />
                免责声明：
              </div>
              <div class="content">
                本合同模板的提供方及为模板使用提供合同审核、签约指导或法律咨询服务的人员，不对合同双方的订约行为、履约行为及由此产生的任何争议、损失承担任何法律责任；本声明适用于本合同模板的所有使用方，您通过使用本合同模板即表示同意并接受以上免责条款。
              </div>
            </div>
          </div>
        </div>

        <!-- 备案信息 -->
        <!-- <div class="payment-right">
          <div class="security-badges">
            <div class="badge-item">
              <img src="@/assets/img/common/pay-icon3.png" alt="安全联盟" />
            </div>
            <div class="badge-item">
              <img src="@/assets/img/common/pay-icon2.png" alt="安全联盟" />
            </div>
            <div class="badge-item">
              <img src="@/assets/img/common/pay-icon1.png" alt="安全联盟" />
            </div>
          </div>
          <div class="security-tip">
            支付系统已经经过安全联盟认证请放心使用
            <span>支付成功后会自动跳转到文书合同下载页面</span>
          </div>
        </div> -->
      </div>
    </div>
    <div class="download-modal-content" v-else>
      <div class="pay-success">
        <img src="@/assets/img/common/pay-success.png" alt="支付成功" />
        <span>支付成功！立即下载</span>
        <button class="download-btn" @click="handleDownload">
          <img src="@/assets/img/common/down.png" alt="" />
          <span>下载Word版本</span>
        </button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "DownloadModal",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    detail: {
      type: Object,
      default: () => {},
    },
    id: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      isPaySuccess: true,
      selectedProductIndex: 0,
      products: [{}],
      wechatQR: "",
      alipayQR: "",
      basic_price_id: "",
      service_price_id: "",
      timer: null, // 用于存储setTimeout的ID
      currentPollingOrderId: null, // 当前正在轮询的订单ID
    };
  },
  computed: {
    selectedProduct() {
      return this.products[this.selectedProductIndex];
    },
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        // 获取二维码
        this.getQRCode();
      }
    },
  },
  mounted() {
    console.log(this.detail.contract_type);
    
    // 服务
    this.$set(this.products, 0, {
      title: this.detail.title + "(服务版)",
      description: this.detail.contract_type == 1 ? this.vuex_config.service_buy_notice_2 : this.vuex_config.service_buy_notice,
      format: "word格式",
      size: this.detail.size + "MB",
      pages: "共" + this.detail.total_page + "页",
      price: this.detail.service_price,
      recommended: true,
    });
    // 基础
    this.$set(this.products, 1, {
      title: this.detail.title + "(基础版)",
      description: this.detail.contract_type == 1 ? this.vuex_config.basic_buy_notice_2 : this.vuex_config.basic_buy_notice,
      format: "word格式",
      size: this.detail.size + "MB",
      pages: "共" + this.detail.total_page + "页",
      price: this.detail.basic_price,
      recommended: false,
    });
    this.selectProduct(0);
  },
  beforeDestroy() {
    // 组件销毁前清理定时器和轮询状态
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.currentPollingOrderId = null;
  },
  methods: {
    selectProduct(index) {
      // 清理定时器和轮询状态
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.currentPollingOrderId = null; // 重置轮询状态
      this.selectedProductIndex = index;
      this.getQRCode();
    },
    handleClose() {
      // 清理定时器和轮询状态
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.currentPollingOrderId = null;
      this.$emit("update:visible", false);
      this.selectedProductIndex = 0;
    },
    handleDownload() {
      this.$api({
        url: "contractReal",
        method: "post",
        data: {
          articleId: this.id,
        },
      }).then((res) => {
        if (res.code == 200) {
          this.$api({
            url: "cofirmDownload",
            method: "post",
            data: {
              articleId: this.id,
            },
          });
          fetch(res.data.doc_url)
            .then((res) => res.blob())
            .then((blob) => {
              const link = document.createElement("a");
              const objectUrl = URL.createObjectURL(blob);
              link.href = objectUrl;
              link.download = res.data.doc_name; // 指定保存的文件名
              link.click();
              URL.revokeObjectURL(objectUrl);
            })
            .catch((err) => console.error("下载失败:", err));
        }
      });
    },
    getQRCode() {
      // 清理之前的定时器
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }

      if (this.selectedProductIndex === 0 && this.service_price_id) {
        this.getWchatQR(this.service_price_id);
        // this.getAlipayQR(this.service_price_id);
      } else if (this.selectedProductIndex === 1 && this.basic_price_id) {
        this.getWchatQR(this.basic_price_id);
        // this.getAlipayQR(this.basic_price_id);
      } else {
        // 先获取订单
        this.$api({
          url: "createOrder",
          method: "POST",
          data: {
            articleId: this.detail.id,
            priceType:
              this.selectedProductIndex === 1 ? "basic_price" : "service_price",
          },
        }).then((res) => {
          if (res.code === 200) {
            if (this.selectedProductIndex === 0) {
              this.service_price_id = res.data.id;
            } else {
              this.basic_price_id = res.data.id;
            }
            this.getWchatQR(res.data.id);
            // this.getAlipayQR(res.data.id);
          }
        });
      }
    },
    getWchatQR(orderId) {
      // 清理之前的定时器和轮询状态
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.currentPollingOrderId = null;

      this.$api({
        url: "wx_scan_qr",
        method: "POST",
        data: {
          orderId: orderId,
        },
      }).then((res) => {
        this.wechatQR = res.qrcode;
        // 设置当前轮询的订单ID
        this.currentPollingOrderId = orderId;
        // 轮询检测订单状态
        this.checkOrderStatus(orderId);
      });
    },
    getAlipayQR(orderId) {
      this.$api({
        url: "alipay_web_qr",
        method: "POST",
        data: {
          orderId: orderId,
        },
      });
    },
    checkOrderStatus(orderId) {
      // 检查是否是当前正在轮询的订单
      if (this.currentPollingOrderId !== orderId) {
        return; // 如果不是当前订单，直接返回，不进行轮询
      }

      this.$api({
        url: "getOrderPayStatus",
        method: "POST",
        data: {
          orderId: orderId,
        },
      }).then((res) => {
        // 再次检查订单ID，防止异步请求返回时订单已切换
        if (this.currentPollingOrderId !== orderId) {
          return;
        }

        if (res.code == 200) {
          if (res.code == 200 && res.data.payResult == true) {
            // 支付成功，清理定时器和轮询状态
            if (this.timer) {
              clearTimeout(this.timer);
              this.timer = null;
            }
            this.currentPollingOrderId = null;
            this.isPaySuccess = false;
          } else {
            // 继续轮询，存储定时器ID
            this.timer = setTimeout(() => {
              this.checkOrderStatus(orderId);
            }, 1000);
          }
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.download-modal-content {
  .product-section {
    margin-bottom: 20px;

    .product-list {
      max-height: 300px;
      overflow: auto;
      display: flex;
      gap: 20px;

      .product-item {
        background: #ffffff;
        position: relative;
        border: 4px solid #f4f5f8;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        padding: 60px 40px 20px 40px;

        &.selected {
          border: 4px solid #e0291f;
        }

        &.recommended {
          .recommend-badge {
            position: absolute;
            top: -4px;
            right: -4px;

            img {
              width: 122px;
              height: 36px;
            }
          }
        }

        .select-icon {
          position: absolute;
          top: 15px;
          left: 15px;
          width: 27px;
          height: 27px;
          img {
            width: 100%;
            height: 100%;
          }
        }

        .product-info {
          .product-title {
            font-weight: bold;
            font-size: 20px;
            color: #363130;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
            img {
              width: 21px;
              height: 21px;
            }
          }

          .product-description {
            background: #f4f5f8;
            border-radius: 6px;
            padding: 16px 20px;
            font-weight: bold;
            font-size: 16px;
            color: #e0291f;
            margin-bottom: 20px;
            height: 100px;
          }

          .product-meta {
            font-weight: 400;
            font-size: 14px;
            color: #9f9f9f;
            span {
              margin-right: 10px;
            }
          }

          .product-price {
            .price-label {
              font-weight: 400;
              font-size: 14px;
              color: #9f9f9f;
              margin-right: 20px;
            }

            .price-value {
              font-weight: bold;
              font-size: 32px;
              color: #4e57d9;
            }
          }
        }
      }
    }
  }

  .payment-section {
    display: flex;
    align-items: flex-end;

    .payment-left {
      flex: 1;
      display: flex;

      .qr-codes {
        display: flex;
        gap: 20px;

        .qr-item {
          text-align: center;

          .qr-code {
            width: 176px;
            height: 176px;
            border: 1px solid #ddd;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 10px;

            img {
              width: 160px;
              height: 160px;
            }
          }

          .qr-label {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            color: #363130;
            img {
              width: 27px;
              height: 27px;
              margin-right: 10px;
            }
          }
        }
      }

      .amount-display {
        flex: 1;
        margin-top: 8px;
        margin-left: 30px;
        text-align: left;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .amount-display-bottom {
          img {
            width: 12px;
            height: 12px;
            margin-right: 5px;
          }
          .title {
            font-family: Microsoft YaHei, Microsoft YaHei;
            font-weight: bold;
            font-size: 12px;
            color: #363130;
            display: flex;
            align-items: center;
          }
          .content {
            font-family: Microsoft YaHei, Microsoft YaHei;
            font-weight: bold;
            font-size: 12px;
            color: #363130;
            margin-top: 10px;
          }
        }

        .amount-label {
          font-size: 16px;
          color: #363130;
          margin-bottom: 5px;
        }

        .amount-value {
          font-size: 32px;
          font-weight: bold;
          color: #e0291f;
          margin-bottom: 5px;
        }

        .amount-tip {
          font-size: 16px;
          color: #363130;
        }
      }
    }

    .payment-right {
      margin-left: 20px;
      display: flex;
      flex-direction: column;
      align-items: flex-end;

      .security-badges {
        margin-bottom: 10px;
        display: flex;
        gap: 6px;

        .badge-item {
          display: flex;
          align-items: center;
          font-size: 12px;
          color: #52c41a;
          width: 117px;
          height: 43px;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }

      .security-tip {
        font-size: 14px;
        color: #363130;
        span {
          color: #e0291f;
        }
      }
    }
  }

  .pay-success {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 30px;
    font-size: 22px;
    font-weight: bold;
    color: #000000;
    img {
      width: 100px;
      height: 100px;
    }
    .download-btn {
      width: 400px;
      height: 70px;
      background: linear-gradient(90deg, #4e57d9 0%, #519dff 100%);
      color: #fff;
      border: none;
      border-radius: 8px;
      font-size: 20px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 15px;
      transition: background-color 0.3s;
      font-weight: bold;
      img {
        width: 25px;
        height: 25px;
      }
    }
  }
}

// 自定义滚动条样式
.product-list::-webkit-scrollbar {
  width: 6px;
}

.product-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.product-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.product-list::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>

<style lang="less">
.download-modal {
  width: 1300px !important;
  min-width: 1300px !important;
  max-width: 1300px !important;

  .el-dialog__header {
    height: 60px;
    padding: 10px;
  }

  .el-dialog__body {
    padding: 0 30px 30px 30px;
  }

  .el-dialog__close {
    font-size: 28px;
    color: #999;
  }
}
</style>
<style lang="less" scoped src="@/assets/h5css/modals/DownloadModal.less"></style>

<style lang="less">
@media screen and (max-width:750px) {
  .download-modal {
        width: 96vw !important;
        min-width: 96vw !important;
        max-width: 96vw !important;
    }
}
</style>