<template>
  <el-dialog
    :visible.sync="visible"
    width="500px"
    custom-class="wechat-pay-modal"
    :show-close="false"
    @close="handleClose"
  >
    <!-- 弹框头部 -->
    <div class="pay-modal-header">
      <div class="header-left">
        <div class="wechat-icon">
          <img src="@img/common/wechat.png" alt="" />
        </div>
        <span class="wechat-pay-text">微信支付</span>
      </div>
      <i class="el-icon-close close-btn" @click="handleClose"></i>
    </div>

    <!-- 简洁支付弹框（当有二维码时显示） -->
    <div class="pay-modal-body" v-if="wechatQR && isPaySuccess">
      <!-- 支付金额 -->
      <div class="payment-amount">
        <div class="amount-label">支付金额</div>
        <div class="amount-value">¥{{ selectedProduct.price || "79.11" }}</div>
      </div>

      <!-- 二维码 -->
      <div class="qr-code-container">
        <div class="qr-code-wrapper">
          <img :src="wechatQR" alt="微信支付二维码" />
        </div>
      </div>

      <!-- 提示信息 -->
      <div class="payment-tip">
        <img src="@img/common/payment-tip.png" alt="" />
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
      description:
        this.detail.contract_type == 1
          ? this.vuex_config.service_buy_notice_2
          : this.vuex_config.service_buy_notice,
      format: "word格式",
      size: this.detail.size + "MB",
      pages: "共" + this.detail.total_page + "页",
      price: this.detail.service_price,
      recommended: true,
    });
    // 基础
    this.$set(this.products, 1, {
      title: this.detail.title + "(基础版)",
      description:
        this.detail.contract_type == 1
          ? this.vuex_config.basic_buy_notice_2
          : this.vuex_config.basic_buy_notice,
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
              this.selectedProductIndex === 0 ? "basic_price" : "service_price",
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

// 微信支付弹框样式
.wechat-pay-modal {
  width: 500px !important;
  min-width: 500px !important;
  max-width: 500px !important;
  border-radius: 8px;
  overflow: hidden;

  .el-dialog__header {
    display: none;
  }

  .el-dialog__body {
    padding: 0;
  }

  // 弹框头部
  .pay-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    background: #fff;

    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;

      .wechat-icon {
        width: 38px;
        height: 34px;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          width: 100%;
          height: 100%;
        }
      }

      .wechat-pay-text {
        font-size: 18px;
        font-weight: 500;
        color: #333;
      }
    }

    .close-btn {
      font-size: 20px;
      color: #999;
      cursor: pointer;
      transition: color 0.3s ease;

      &:hover {
        color: #333;
      }
    }
  }

  // 弹框内容
  .pay-modal-body {
    padding: 0px 24px 30px;
    background: #fff;
    text-align: center;

    // 支付金额
    .payment-amount {
      margin-bottom: 30px;

      .amount-label {
        font-size: 16px;
        color: #333;
        margin-bottom: 12px;
      }

      .amount-value {
        font-size: 36px;
        font-weight: bold;
        color: #ff6600;
      }
    }

    // 二维码容器
    .qr-code-container {
      margin-bottom: 10px;
      display: flex;
      justify-content: center;

      .qr-code-wrapper {
        width: 240px;
        height: 240px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #fff;

        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .qr-placeholder {
          color: #999;
          font-size: 14px;
        }
      }
    }

    // 提示信息
    .payment-tip {
      img {
        width: 226px;
      }
    }
  }
}
</style>
