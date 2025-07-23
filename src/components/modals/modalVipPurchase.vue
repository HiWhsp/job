<template>
  <!-- 开通会员弹框 -->
  <div class="vip-modal-overlay" v-if="visible" @click="closeModal">
    <div class="vip-modal" @click.stop>
      <div class="modal-header">
        <h3>开通会员</h3>
        <button class="close-btn" @click="closeModal">✕</button>
      </div>

      <div class="modal-content">
        <div class="left-section">
          <!-- 会员套餐介绍 -->
          <div class="vip-intro">
            <div class="vip-icon">
              <img src="@/assets/img/my/pay-vip.png" alt="" />
              <p>开通会员</p>
            </div>
            <div class="vip-intro-text" v-html="memberSetting.member_xieyi"></div>
            <div class="vip-benefits">
              <div class="benefit-list">
                <div
                  class="benefit-item"
                  v-for="item in memberSetting[`member_${selectedVipType}_benifit`]"
                  :key="item"
                >
                  {{ item }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="center-section">
          <!-- 选择版本 -->
          <div class="version-section">
            <h4>选择版本</h4>
            <div class="version-options">
              <div
                v-for="option in vipOptions"
                :key="option.type"
                class="version-option"
                :class="{ active: selectedVipType === option.type }"
                @click="selectVipType(option.type)"
              >
                <span class="version-name">{{ option.name }}</span>
                <span class="version-price">{{ option.price }}元/年</span>
              </div>
            </div>
          </div>

          <!-- 选择购买时长 -->
          <div class="duration-section">
            <h4>选择购买时长</h4>
            <div class="duration-options">
              <div
                v-for="duration in durationOptions[selectedVipType - 1]"
                :key="duration.year"
                class="duration-option"
                :class="{ active: selectedDuration === duration.year }"
                @click="selectDuration(duration.year)"
              >
                <span class="duration-text">{{ duration.year }}年</span>
                <span class="duration-tag" v-if="duration.discount"
                  >{{ duration.discount / 10 }}折</span
                >
              </div>
            </div>
          </div>
        </div>

        <div class="right-section">
          <!-- 价格显示 -->
          <div class="price-display">¥{{ originPrice }}</div>

          <!-- 支付二维码 -->
          <div class="qr-section" v-if="pay_qrcode">
            <div class="qr-code">
              <img :src="pay_qrcode" alt="支付二维码" />
            </div>
            <div class="pay-tips">
              <p>使用 微信/支付宝 扫码支付</p>
              <p>支付即同意 <span class="terms-link">服务条款</span> 条款</p>
            </div>
          </div>

          <!-- 生成支付二维码按钮 -->
          <div class="pay-action" v-if="!pay_qrcode">
            <button class="generate-qr-btn" @click="generatePayQR" :disabled="loading">
              {{ loading ? "生成中..." : "生成支付二维码" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ModalVipPurchase",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      timer: null,
      pay_qrcode: "",
      loading: false,
      selectedVipType: 1,
      selectedDuration: 1,
      vipOptions: [
        // { type: "1", name: "黄金会员", price: 1899 },
        // { type: "2", name: "钻石会员", price: 58800 },
        // { type: "3", name: "联合会员", price: 518000 },
      ],
      durationOptions: [
        // { value: 1, label: "1年" },
        // { value: 2, label: "2年", tag: "8折" },
        // { value: 3, label: "3年", tag: "7折" },
      ],
      memberSetting: {},
      originPrice: 0,
    };
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        // 弹框打开时重置状态
        this.resetModal();
        // 获取信息
        this.$api({
          url: "memberSetting",
          method: "get",
        }).then((res) => {
          if (res.code == 200) {
            this.memberSetting = res.data;
            for (let index = 1; index <= 3; index++) {
              this.vipOptions.push({
                type: index,
                name: index == 1 ? "黄金会员" : index == 2 ? "钻石会员" : "联合会员",
                price: res.data[`member_${index}_sale_price`],
              });
              this.durationOptions.push(res.data[`member_${index}_discount`]);
              this.selectDuration(1);
            }
          }
        });
      } else {
        // 弹框关闭时清理定时器
        this.clearPaymentTimer();
        this.vipOptions = [];
        this.durationOptions = [];
        this.memberSetting = {};
      }
    },
  },
  beforeDestroy() {
    this.clearPaymentTimer();
  },
  methods: {
    // 关闭弹框
    closeModal() {
      this.clearPaymentTimer();
      this.$emit("close");
    },

    // 重置弹框状态
    resetModal() {
      this.pay_qrcode = "";
      this.loading = false;
      this.selectedVipType = 1;
      this.selectedDuration = 1;
    },

    // 清理支付轮询定时器
    clearPaymentTimer() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },

    // 选择会员类型
    selectVipType(type) {
      this.selectedVipType = type;
      this.pay_qrcode = ""; // 重置二维码
    },

    // 选择时长
    selectDuration(duration) {
      this.selectedDuration = duration;
      this.$api({
        url: "getMemberPayPrice",
        method: "post",
        data: {
          level: this.selectedVipType,
          year: duration,
        },
      }).then((res) => {
        if (res.code == 200) {
          this.originPrice = res.data.originPrice;
        }
      });
      this.pay_qrcode = ""; // 重置二维码
    },
    // 生成支付二维码
    generatePayQR() {
      this.loading = true;

      // 准备订单数据
      const orderData = {
        vip_type: this.selectedVipType,
        duration: this.selectedDuration,
        total_price: this.totalPrice,
      };

      this.$api({
        url: "vipOrder",
        method: "post",
        data: orderData,
      })
        .then((res) => {
          this.loading = false;
          if (res.code == 200) {
            // 生成支付二维码
            this.$api({
              url: "pay",
              method: "post",
              data: {
                order_no: res.data.orderno,
                type: 2,
              },
            }).then((payRes) => {
              if (payRes.code == 200) {
                this.pay_qrcode = payRes.data.pay_qrcode;
                // 开始轮询支付状态
                this.timer = setInterval(() => {
                  this.getPayStatus(res.data.orderno);
                }, 5000);
              }
            });
          } else {
            this.$message.error(res.msg || "订单创建失败");
          }
        })
        .catch(() => {
          this.loading = false;
          this.$message.error("网络错误，请重试");
        });
    },

    // 检查支付状态
    getPayStatus(order_no) {
      this.$api({
        url: "checkVipPay",
        method: "get",
        data: {
          orderno: order_no,
        },
      }).then((res) => {
        if (res.code == 200) {
          if (res.data.is_pay) {
            this.clearPaymentTimer();
            this.$message.success("支付成功");
            this.$emit("payment-success");
            this.closeModal();
          }
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
// 弹框样式
.vip-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.vip-modal {
  background: white;
  border-radius: 12px;
  width: 1400px;
  max-height: 640px;
  overflow: hidden;
  position: relative;

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    background: linear-gradient(94deg, #eddbc9 0%, #c49a83 100%);

    h3 {
      margin: 0;
      font-size: 20px;
      font-weight: bold;
      color: #543317;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 20px;
      color: #543317;
      cursor: pointer;
      padding: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        color: #666;
      }
    }
  }

  .modal-content {
    display: flex;
    height: 500px;
    padding: 24px;
    gap: 30px;

    .left-section {
      padding: 22px;
      background: #f9fafb;
      width: 200px;
      border-radius: 15px;

      .vip-intro {
        display: flex;
        flex-direction: column;
        align-items: flex-start;

        .vip-icon {
          width: 100%;
          display: flex;
          align-items: center;
          img {
            width: 22px;
            height: 21px;
            z-index: 2;
          }
          p {
            text-align: center;
            font-size: 10px;
            color: #fff;
            width: 60px;
            height: 16px;
            line-height: 16px;
            margin-left: -10px;
            background: linear-gradient(108deg, #7688bb 0%, #cccef0 0%, #5374aa 100%);
          }
        }

        .vip-intro-text {
          font-size: 14px;
          color: #696a6e;
          padding: 20px 0;
          margin-bottom: 20px;
          border-bottom: 1px solid #e5e5e5;
        }

        .vip-benefits {
          p {
            margin: 0 0 12px 0;
            font-size: 16px;
            font-weight: bold;
            color: #333;
          }

          .benefit-list {
            .benefit-item {
              font-size: 14px;
              color: #666;
              margin-bottom: 4px;
              position: relative;
              padding-left: 16px;

              &::before {
                content: "•";
                position: absolute;
                left: 0;
                color: #696a6e;
              }
            }
          }
        }
      }
    }

    .center-section {
      flex: 1;
      .version-section,
      .duration-section {
        margin-bottom: 24px;

        h4 {
          margin: 0 0 12px 0;
          font-size: 14px;
          font-weight: bold;
          color: #333;
        }

        .version-options,
        .duration-options {
          display: flex;
          gap: 10px;
        }

        .version-option,
        .duration-option {
          width: 168px;
          height: 76px;
          padding: 14px 0;
          border: 1px solid #e4e4e5;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s;
          background: white;

          &:hover {
            border-color: #33ae60;
            color: #33ae60;
          }

          &.active {
            border-color: #33ae60;
            .version-name {
              color: #33ae60;
            }
            .version-price {
              color: #33ae60;
            }
            .duration-text {
              color: #33ae60;
            }
          }
        }

        .version-option {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;

          .version-name {
            font-size: 14px;
            color: #333;
          }

          .version-price {
            font-size: 12px;
            color: #666;
          }
        }

        .duration-option {
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;

          .duration-text {
            font-size: 14px;
            color: #333;
          }

          .duration-tag {
            background-image: url("../../assets/image/icon/tag-vip.png");
            background-size: 100% 100%;
            background-repeat: no-repeat;
            color: white;
            font-size: 12px;
            width: 44px;
            height: 24px;
            position: absolute;
            top: 0;
            right: 0;
            text-align: center;
            line-height: 24px;
            padding-left: 10px;
          }
        }
      }
    }

    .right-section {
      width: 380px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      border-left: 1px solid #e4e4e5;

      .price-display {
        font-size: 32px;
        font-weight: bold;
        color: #ff4d4f;
        margin-bottom: 24px;
        text-align: center;
      }

      .qr-section {
        text-align: center;

        .qr-code {
          width: 160px;
          height: 160px;
          border: 1px solid #eee;
          border-radius: 8px;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          justify-content: center;

          img {
            width: 140px;
            height: 140px;
          }
        }

        .pay-tips {
          p {
            margin: 8px 0;
            font-size: 12px;
            color: #666;

            .terms-link {
              color: #33ae60;
              cursor: pointer;
              text-decoration: underline;
            }
          }
        }
      }

      .pay-action {
        .generate-qr-btn {
          background: #33ae60;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
          transition: background 0.3s;

          &:hover:not(:disabled) {
            background: #2d8a4d;
          }

          &:disabled {
            background: #ccc;
            cursor: not-allowed;
          }
        }
      }
    }
  }
}
</style>
