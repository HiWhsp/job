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
              v-if="my_info.avatar"
              :src="vuex_config.file_url_pre + my_info.avatar"
              class="user-avatar"
            />
            <img v-else src="@img/my/avatar.png" class="user-avatar" />
          </div>
          <div class="user-details">
            <div class="phone-number">{{ my_info.mobile || "" }}</div>
            <div class="vip-status">
              <span
                class="vip-badge"
                :class="{ 'vip-badge-active': my_info.userLevel != 0 }"
              >
                <img
                  src="@/assets/img/my/no-vip.png"
                  alt="VIP会员"
                  v-if="my_info.userLevel == 0"
                />
                <img src="@/assets/img/my/vip-active.png" alt="VIP会员" v-else />
                {{ levelName }}
              </span>
              <span class="password-tip" v-if="my_info.userLevel == 0"
                >您还没有开通付费VIP会员</span
              >
              <span class="password-tip" v-else
                >{{ levelName }}会员已开通 | 会员到期时间：
                <span class="vip-time">{{ my_info.userLevelEndTime || "--" }}</span>
                | <span class="vip-renew" @click="openVipNow">续费</span>
              </span>
            </div>
          </div>
        </div>
        <button class="open-vip-btn" @click="openVipNow" v-if="my_info.userLevel == 0">
          立即开通
        </button>
        <div class="open-vip-btn-box" v-if="my_info.userLevel != 0">
          <button class="open-vip-home" @click="go_my_home">我的主页</button>
          <button class="open-vip-renew" @click="openVipNow">续费会员</button>
        </div>
      </div>

      <!-- VIP会员卡片 -->
      <div class="vip-card">
        <div class="vip-card-content">
          <div class="vip-info" v-if="my_info.userLevel == 0">
            <h3>VIP会员</h3>
            <div class="promotion">
              <button class="open-vip-btn" @click="openVipNow">立即开通</button>
            </div>
          </div>
          <div class="vip-info" v-else>
            <h4>{{ my_info.mobile || "--" }}</h4>
            <div class="vip-info-box">
              <img src="@/assets/img/my/vip-active.png" alt="VIP会员" />
              <span>VIP会员</span>
            </div>
            <p>{{ my_info.company_name || my_info.nickname }}</p>
          </div>
        </div>
      </div>

      <!-- 会员权益 -->
      <div class="member-benefits">
        <h3>会员权益</h3>
        <p class="benefits-text" v-html="vip_info.content"></p>
      </div>

      <!-- 支付区域 -->
      <div class="payment-section">
        <p>用户购买VIP会员后，获得主页权限，可自行上传介绍信息</p>
        <p>购买VIP会员后，可提交需求单</p>
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
          <div v-for="item in vip_order_list" :key="item.id" style="margin-bottom: 10px">
            <div class="table-row">
              <div class="order-info">
                <div class="order-number">订单号：{{ item.orderno }}</div>
                <div class="order-time">下单时间：{{ item.pay_time }}</div>
              </div>
            </div>
            <div class="table-row order-details">
              <span class="product-name">{{ item.title }}</span>
              <span class="price">¥{{ item.price }}</span>
              <span class="quantity">{{ item.month_num }}</span>
              <span class="paid-amount">¥{{ item.price }}</span>
              <span class="status completed">{{
                item.status == 2 ? "已完成" : "待支付"
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 开通会员弹框组件 -->
    <ModalVipPurchase
      :visible="showVipModal"
      @close="closeVipModal"
      @payment-success="onPaymentSuccess"
    />
  </div>
</template>

<script>
import ModalVipPurchase from "@/components/modals/modalVipPurchase.vue";

export default {
  name: "member-center",
  components: {
    ModalVipPurchase,
  },
  data() {
    return {
      my_info: {},
      vip_info: {},
      vip_order_list: [],
      loading: false,
      selectedPaymentMethod: "", // 默认选择微信支付
      showVipModal: false, // 控制弹框显示
    };
  },
  computed: {
    levelName() {
      switch (this.my_info.userLevel) {
        case 1:
          return "黄金会员";
        case 2:
          return "钻石会员";
        case 3:
          return "联合会员";
        default:
          return "个人会员";
      }
    },
  },
  watch: {},
  mounted() {
    this.setView();
  },

  methods: {
    // 选择支付方式
    selectPaymentMethod(method) {
      if (this.selectedPaymentMethod == method) {
        this.selectedPaymentMethod = "";
      } else {
        this.selectedPaymentMethod = method;
        this.do_submit();
      }
    },

    // 立即开通VIP
    openVipNow() {
      this.showVipModal = true;
    },

    // 关闭VIP弹框
    closeVipModal() {
      this.showVipModal = false;
    },

    // 支付成功回调
    onPaymentSuccess() {
      // 重新加载用户信息和页面数据
      this.setView();
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
      this.$api({
        url: "memberSetting",
        method: "get",
      }).then((res) => {
        if (res.code == 200) {
          this.vip_info = res.data;
        }
      });
      // 充值订单
      // this.$api({
      //   url: "vipOrderList",
      //   method: "get",
      // }).then((res) => {
      //   if (res.code == 200) {
      //     this.vip_order_list = res.data;
      //   }
      // });
    },
    query_user() {
      this.$api({
        url: "getUserInfo",
        method: "get",
      }).then((res) => {
        if (res.code == 200) {
          this.my_info = res.data;
        }
      });
    },

    go_my_home() {
      this.$router.push("/my-company-info");
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
  background-color: #fff;
  border-radius: 14px;

  .main-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 32px;
    text-align: left;
    height: 56px;
    line-height: 56px;
    font-size: 16px;
    font-family: Microsoft YaHei-Bold, Microsoft YaHei;
    font-weight: bold;
    color: #333333;
  }

  .page-ctx {
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
      background: #f4fbf7;
      border-radius: 14px;

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
              &.vip-badge-active {
                color: #d7ad70;
              }
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
              .vip-time {
                color: #fb9c01;
              }
              .vip-renew {
                color: #33ae60;
                cursor: pointer;
              }
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
      .open-vip-btn-box {
        display: flex;
        align-items: center;
        gap: 10px;
        .open-vip-home {
          background: #fff;
          color: #33ae60;
          border: 1px solid #33ae60;
          padding: 8px 20px;
          border-radius: 20px;
          font-size: 14px;
          cursor: pointer;
        }
        .open-vip-renew {
          background: #fde2b4;
          color: #7e5529;
          border: none;
          padding: 8px 20px;
          border-radius: 20px;
          font-size: 14px;
          cursor: pointer;
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

          .promotion {
            margin-top: 40px;
            font-size: 14px;
            color: #fff;

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

          h4 {
            margin: 0 0 10px 0;
            font-size: 16px;
            font-weight: bold;
            color: #fcefc7;
          }
          .vip-info-box {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 3px;
            color: #7e5529;
            width: 76px;
            height: 22px;
            border-radius: 20px;
            background: #fde2b4;
            img {
              width: 14px;
              height: 14px;
            }
          }
          p {
            margin-top: 60px;
            font-size: 12px;
            color: #7e5529;
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
      padding: 0 14px;
      margin-bottom: 50px;

      font-family: Microsoft YaHei;
      font-size: 16px;
      font-weight: normal;
      line-height: 24px;
      letter-spacing: normal;
      color: #7a7a7a;
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
          border-radius: 8px;
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
              color: #1e1e1e;

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
