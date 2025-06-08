<template>
  <div class="page">
    <div class="main-title">
      <span>会员中心</span>
    </div>
    <div class="page-ctx">
      <!-- 用户信息区域 -->
      <div class="user-info-section">
        <div class="user-avatar-info">
          <div class="avatar-wrapper">
            <img
              src="@/assets/img/my/avatar.png"
              alt="用户头像"
              class="user-avatar"
            />
          </div>
          <div class="user-details">
            <div class="phone-number">{{ my_info.phone || "15810593012" }}</div>
            <div class="vip-status">
              <span class="vip-badge">
                <img src="@/assets/img/my/no-vip.png" alt="VIP会员" />
                VIP会员
              </span>
              <span class="password-tip">您还没有开通付费VIP会员哦～</span>
            </div>
          </div>
        </div>
        <button class="open-vip-btn" @click="openVipNow">立即开通</button>
      </div>

      <!-- VIP会员卡片 -->
      <div class="vip-card">
        <div class="vip-card-content">
          <div class="vip-info">
            <h3>VIP会员</h3>
            <div class="price">¥365.00</div>
            <div class="promotion">今日立即享受3个月</div>
          </div>
        </div>
      </div>

      <!-- 会员权益 -->
      <div class="member-benefits">
        <h3>会员权益</h3>
        <p class="benefits-text">
          会员权益详细信息文介绍内容会员权益详细信息文介绍内容会员权益详细信息文介绍内容会员权益详细
          图文介绍内容会员权益详细信息文介绍内容会员权益详细信息文介绍内容会员权益详细信息文介绍内容
        </p>
      </div>

      <!-- 支付区域 -->
      <div class="payment-section">
        <div class="payment-methods">
          <div
            class="payment-method"
            :class="{ active: selectedPaymentMethod === 'wechat' }"
            @click="selectPaymentMethod('wechat')"
          >
            <div class="method-icon">
              <img src="@/assets/img/my/wechat.png" alt="" />
            </div>
            <span>微信支付</span>
            <img class="select-icon" src="@/assets/img/my/select.png" alt="" />
          </div>
          <div
            class="payment-method"
            :class="{ active: selectedPaymentMethod === 'alipay' }"
            @click="selectPaymentMethod('alipay')"
          >
            <div class="method-icon">
              <img src="@/assets/img/my/alipay.png" alt="" />
            </div>
            <span>支付宝支付</span>
            <img class="select-icon" src="@/assets/img/my/select.png" alt="" />
          </div>
        </div>

        <div class="payment-qr">
          <div class="qr-code">
            <div class="qr-placeholder">
              <!-- 这里应该是实际的二维码 -->
              <div class="qr-grid"></div>
            </div>
          </div>
          <div class="payment-info">
            <div class="duration">1年3个月 金额总计：</div>
            <div class="total-price">¥365</div>
            <div class="payment-tip">支付即表示您同意《网站服务协议》</div>
          </div>
        </div>
      </div>

      <!-- 我的会员订单 -->
      <div class="member-orders">
        <h3>我的会员订单</h3>
        <div class="orders-table">
          <div class="table-header">
            <span>会员信息</span>
            <span>售价</span>
            <span>数量</span>
            <span>实付款</span>
            <span>订单状态</span>
          </div>
          <div class="table-row">
            <div class="order-info">
              <div class="order-number">订单号：2545122542</div>
              <div class="order-time">下单时间：2024-05-03 09:45:54</div>
            </div>
          </div>
          <div class="table-row order-details">
            <span class="product-name">VIP会员</span>
            <span class="price">¥365.00</span>
            <span class="quantity">1</span>
            <span class="paid-amount">¥365.00</span>
            <span class="status completed">交易完成</span>
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
  name: "member-center",
  data() {
    return {
      UPLOAD_ACTION,
      UPLOAD_NAME,

      my_info: {},
      form: {
        image: "",
        realName: "",
        address: "",
      },
      loading: false,
      selectedPaymentMethod: "wechat", // 默认选择微信支付
    };
  },
  computed: {
    ...mapState([""]),
  },
  watch: {},
  created() {
    this.throttle_do_submit = this.mix_throttle(this.do_submit, 1000);
    this.setView();
  },
  methods: {
    throttle_do_submit() {},

    // 选择支付方式
    selectPaymentMethod(method) {
      this.selectedPaymentMethod = method;
    },

    // 立即开通VIP
    openVipNow() {
      // 这里可以添加开通VIP的逻辑
      console.log("开通VIP");
    },

    open_phone_update() {
      this.$refs.phone_bind_old_check_modal.init();
    },
    confirm_old_pass() {
      this.$refs.phone_bind_new_set_modal.init();
    },
    confirm_new() {
      this.query_user();
    },

    setView() {
      this.query_user();
    },
    query_user() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "users_userInfo",
        },
      }).then((res) => {
        if (res.code == 200) {
          let data = res.data;
          this.my_info = data;

          this.form = {
            image: data.image || "",
            realName: data.realName || "",
            address: data.address || "",
          };

          this.$store.commit("set_vuex_user", res.data);
        }
      });
    },

    do_submit() {
      this.loading = true;
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "users_editInfo",
          ...this.form,
        },
      }).then((res) => {
        let { code, msg, data } = res;
        alert(res).then(() => {
          this.loading = false;
        });
        if (code == 200) {
          this.setView();
        }
      });
    },

    do_reset() {
      this.form = {
        image: this.my_info.image,
        realName: "",
        address: "",
      };
    },

    //上传相关
    upload_on_success(res, file) {
      //console.log("上传结果", res);
      let { code, data, msg } = res;
      alert(res);
      if (code == 200) {
        this.form.image = res.data;
      }
    },
    upload_before_upload(file) {
      const isLt2M = file.size / 1024 / 1024 < 20; //文件大小
      return isLt2M;
    },
  },
};
</script>

<style scoped lang="less">
.user-avatar {
  object-fit: cover;
}

.page {
  text-align: left;
  padding-bottom: 80px;

  .main-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
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
    margin-top: 14px;
    padding: 20px 30px;
    background: #fff;
    padding-bottom: 80px;

    // 用户信息区域
    .user-info-section {
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 17px 28px;
      margin-bottom: 20px;
      background: #f3f8ff;

      .user-avatar-info {
        display: flex;
        align-items: center;

        .avatar-wrapper {
          margin-right: 15px;
          width: 68px;
          height: 68px;
          .user-avatar {
            width: 68px;
            height: 68px;
            border-radius: 50%;
            object-fit: cover;
          }
        }

        .user-details {
          .phone-number {
            font-size: 16px;
            font-weight: bold;
            color: #000;
            margin-bottom: 20px;
          }

          .vip-status {
            display: flex;
            align-items: center;
            gap: 10px;

            .vip-badge {
              color: #6c6d6d;
              padding: 2px 8px;
              border-radius: 12px;
              font-size: 12px;
              img {
                width: 14px;
                height: 14px;
                margin-right: 4px;
              }
            }

            .password-tip {
              font-size: 12px;
              color: #999;
            }
          }
        }
      }

      .open-vip-btn {
        background: #fde2b4;
        color: #7e5529;
        border: none;
        padding: 8px 20px;
        border-radius: 20px;
        font-size: 14px;
        cursor: pointer;

        &:hover {
          opacity: 0.9;
        }
      }
    }

    // VIP会员卡片
    .vip-card {
      margin-bottom: 36px;

      .vip-card-content {
        background-image: url("../../assets/img/my/vip-card.png");
        background-size: 100% 100%;
        background-repeat: no-repeat;
        border-radius: 5px;
        padding: 15px 25px;
        width: 307px;
        height: 176px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: #fcefc7;

        .vip-info {
          h3 {
            margin: 0 0 10px 0;
            font-size: 20px;
            font-weight: bold;
            color: #fcefc7;
          }

          .price {
            font-size: 20px;
            margin-bottom: 10px;
          }

          .promotion {
            margin-top: 40px;
            font-size: 14px;
            color: #fff;
          }
        }

        .diamond-icon {
          opacity: 0.8;
        }
      }
    }

    // 会员权益
    .member-benefits {
      margin-bottom: 30px;

      h3 {
        font-size: 18px;
        font-weight: bold;
        color: #333;
        margin-bottom: 15px;
        padding-left: 10px;
        position: relative;
        &::before {
          position: absolute;
          left: 0;
          top: 5px;
          content: "";
          display: inline-block;
          width: 2px;
          height: 18px;
          border-radius: 15px;
          background: #33ae60;
        }
      }

      .benefits-text {
        font-size: 14px;
        line-height: 1.6;
        color: #7a7a7a;
        margin: 0;
      }
    }

    // 支付区域
    .payment-section {
      margin-bottom: 40px;
      background: #f3f8ff;
      padding: 24px;
      margin-bottom: 50px;
      display: flex;
      align-items: center;

      .payment-methods {
        display: flex;
        gap: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-right: 20px;

        .payment-method {
          display: flex;
          align-items: center;
          width: 186px;
          height: 64px;
          padding: 12px 20px;
          cursor: pointer;
          transition: all 0.3s;
          background: #fff;
          border: 1px solid #fff;
          position: relative;

          &.active {
            border-color: #005aac;
          }

          img {
            width: 24px;
            height: 24px;
          }

          .method-icon {
            margin-right: 8px;
            display: flex;
            align-items: center;
          }

          span {
            font-size: 14px;
            color: #333;
          }

          .select-icon {
            position: absolute;
            right: 0;
            bottom: 0;
          }
        }
      }

      .payment-qr {
        display: flex;
        gap: 30px;
        align-items: center;

        .qr-code {
          .qr-placeholder {
            width: 150px;
            height: 150px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #fff;
            .qr-grid {
              width: 110px;
              height: 110px;
              background: #000;
            }
          }
        }

        .payment-info {
          .duration {
            font-size: 14px;
            color: #232d35;
            margin-bottom: 10px;
          }

          .total-price {
            font-size: 22px;
            color: #fb6262;
          }

          .payment-tip {
            cursor: pointer;
            margin-top: 50px;
            font-size: 12px;
            color: #485056;
          }
        }
      }
    }

    // 我的会员订单
    .member-orders {
      h3 {
        font-size: 18px;
        font-weight: bold;
        color: #333;
        margin-bottom: 15px;
        padding-left: 10px;
        position: relative;
        &::before {
          position: absolute;
          left: 0;
          top: 5px;
          content: "";
          display: inline-block;
          width: 2px;
          height: 18px;
          border-radius: 15px;
          background: #33ae60;
        }
      }

      .orders-table {
        overflow: hidden;

        .table-header {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
          padding: 15px;
          background: #f7f9fa;
          color: #9f9fa1;
          font-size: 14px;
          border: 1px solid rgba(0, 0, 0, 0.1);
          margin-bottom: 10px;

          span {
            text-align: center;

            &:first-child {
              text-align: left;
            }
          }
        }

        .table-row {
          padding: 10px 15px;
          background: #f7f9fa;
          border: 1px solid rgba(0, 0, 0, 0.07);

          &:last-child {
            border-bottom: none;
          }

          .order-info {
            display: flex;
            align-items: center;
            gap: 25px;
            .order-number,
            .order-time {
              font-size: 14px;
              color: #4e5969;
            }
          }

          &.order-details {
            height: 100px;
            display: grid;
            grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
            align-items: center;
            background: #fff;
            border: 1px solid rgba(0, 0, 0, 0.07);
            border-top: none;
            padding: 10px 15px;

            span {
              font-family: Microsoft YaHei;
              text-align: center;
              font-size: 16px;
              color: #1E1E1E;

              &:first-child {
                text-align: left;
              }
            }
          }
        }
      }
    }
  }
}
</style>
