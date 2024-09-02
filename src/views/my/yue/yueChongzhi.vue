<template>
  <div class="page">
    <modalYueChongzhi ref="modalYueChongzhi" />

    <div class="main-title">
      <div class="left">在线充值</div>
    </div>

    <div class="page-ctx">
      <div class="wrap">
        <div class="inner">
          <div class="top-info">
            <div class="yue-rich html-frag" v-html="detail.content"></div>

            <div class="chongzhi-title">请选择余额充值金额</div>

            <!-- <div class="yue-box">
              <div class="text-box">
                <div class="text-1">余额</div>
                <div class="text-2">{{vuex_huobi}}{{ baseInfo.yue }}</div>
                <div class="text-3">
                  <button @click="$router.push('/chongzhijilu')">充值记录</button>
                </div>
              </div>
            </div> -->
          </div>

          <div class="chongzhi-list">
            <div
              class="chongzhi-item"
              v-for="(item, index) in list_chongzhi"
              :key="index"
              :class="{ selected: index == select_chongzhi_index }"
              @click="on_select(item, index)"
            >
              <div class="song-marker">送{{ item.zeng }}元</div>
              <div class="money">{{vuex_huobi}}{{ item.man }}</div>
              <!-- <div class="tip">20元现金+30元代金券</div> -->
            </div>
          </div>

          <div class="chongzhi-type">请选择充值方式</div>
          <div class="type-box">
            <div
              class="type-item"
              :class="{ checked: type == '微信' }"
              @click="type = '微信'"
            >
              <img src="@/static/common/check0.png" alt="" class="img-check check-0" />
              <img src="@/static/common/check1.png" alt="" class="img-check check-1" />
              <img src="@img/chongzhi-wx.png" alt="" class="img-marker" />
              <span>微信支付</span>
            </div>
            <!-- <div class="type-item" :class="{ checked: type == '支付宝' }" @click="type = '支付宝'">
              <img src="@/static/common/check0.png" alt="" class="img-check check-0" />
              <img src="@/static/common/check1.png" alt="" class="img-check check-1" />
              <img src="@img/chongzhi-zfb.png" alt="" class="img-marker" />
              <span>支付宝支付</span>
            </div> -->
          </div>

          <div class="action-box">
            <button class="btn-ripple" @click="yue_chongzhi">立即充值</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import modalYueChongzhi from "@/components/order/modalYueChongzhi.vue";

import { mapState } from "vuex";
export default {
  name: "User",
  components: {
    modalYueChongzhi,
  },
  data() {
    return {
      pagination: {
        page: 1, //当前页
        pageNum: 20, //每页数量
      }, //分页器

      detail: {},
      list_chongzhi: [],
      // select_chongzhi: {},
      select_chongzhi_index: 0,
      type: "微信",
      resData: {},
    };
  },
  computed: {
    ...mapState(["baseInfo"]),
    select_chongzhi() {
      return this.list_chongzhi[this.select_chongzhi_index] || {};
    },
  },
  watch: {},
  created() {
    this.setView();
  },

  methods: {
    setView() {
      this.$store.dispatch("query_user");
      //说明
      this.$api("index_newsDetail", {
        id: 86,
      }).then((res) => {
        //console.log("充值协议规则", res);
        this.detail = res.data.info;
      });

      //充值赠送
      this.$api("money_investActivity", {}).then((res) => {
        //console.log("充值赠送", res);
        if (res.code == 200) {
          this.list_chongzhi = res.data.rules || [];
        }
      });
    },

    // set_select_chongzhi() {
    //   if (this.list_chongzhi && this.list_chongzhi.length) {
    //     this.select_chongzhi = this.list_chongzhi[0];
    //   }
    // },

    on_select(item, index) {
      // debugger
      // this.select_chongzhi = item;
      this.select_chongzhi_index = index;
    },

    yue_chongzhi() {
      //console.log("选择的充值项目", { ...this.select_chongzhi });
      if (!this.select_chongzhi.man) {
        alertErr("请选择充值金额");
        return;
      }

      //
      if (this.resData.qrcode) {
        if (this.resData.index == this.select_chongzhi_index) {
          //console.log("两次充值选项一致");
          this.$refs.modalYueChongzhi.init({
            ...this.resData,
          });

          return;
        }
      }

      if (this.type == "微信") {
        //console.log("微信支付");
        //余额充值
        this.$api("money_scanChongzhi", {
          money: this.select_chongzhi.man,
          type: 1,
        }).then((res) => {
          //console.log("微信充值", res);
          let { code, data, msg} = res;
          if (code == 200) {
            this.resData = {
              ...res.data,
              money: this.select_chongzhi.man,
              index: this.select_chongzhi_index,
            };
            this.$refs.modalYueChongzhi.init({ ...this.resData });

            // sessionStorage.setItem("yue_money", this.select_chongzhi.man);
            // this.$router.push(`/payment-methods?order_id=${data.order_id}&mode=yue`);
          }
        });
      } else if (this.type == "支付宝") {
        //console.log("支付宝支付");
      }
    },

    //完成余额支付
    yuePayDone() {
      this.resData = {};
    },
  },
};
</script>

<style scoped lang="less">
.img-check {
  cursor: pointer;
  &.check-0 {
    display: block;
  }
  &.check-1 {
    display: none;
  }
}

.checked {
  cursor: pointer;
  .check-0 {
    display: none !important;
  }
  .check-1 {
    display: block !important;
  }
}

.page {
  text-align: left;
  padding-bottom: 80px;
  .main-title {
    .flex-between();
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
      font-weight: bold;
    }
  }

  .page-ctx {
    margin-top: 24px;
    padding: 32px 32px 55px 32px;
    background: #fff;
  }
}

.wrap {
  .inner {
    padding: 0;
  }
}

.top-info {
  .yue-box {
    width: 458px;
    height: 240px;
    background: url(~@img/yue/yue-bg.png) no-repeat center / cover;
    padding-left: 40px;
    .flex-center();
    flex-direction: column;
    align-items: flex-start;

    .text-box {
      text-align: left;
      .text-1 {
        font-size: 26px;
        font-family: PingFang SC;
        font-weight: bold;
        line-height: 40px;
        color: #ffffff;
      }
      .text-2 {
        margin-top: 10px;
        margin-bottom: 30px;
        font-size: 48px;
        font-family: PingFang SC;
        font-weight: bold;
        line-height: 40px;
        color: #ffffff;
      }
      .text-3 {
        button {
          border-radius: 20px;
          width: 106px;
          height: 34px;
          background: rgba(0, 0, 0, 0.45);
          font-size: 14px;
          font-family: PingFang SC;
          font-weight: 400;
          line-height: 34px;
          color: #ffffff;
        }
      }
    }
  }
}

.bottom-info {
  margin-top: 50px;
  margin-bottom: 50px;
}

.list {
  .flex();
  flex-wrap: wrap;
  .item {
    .flex-center();
    cursor: pointer;
    justify-content: flex-start;
    margin-top: 20px;
    margin-right: 60px;
    width: 185px;
    height: 85px;
    padding-left: 15px;
    background: url(~@img/yue/yue-chongzhi-inactive.png) no-repeat center / cover;

    &:nth-child(4n) {
      margin-right: 0;
    }
    &:nth-child(-n + 4) {
      margin-top: 0;
    }

    .currency {
      font-size: 15px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      line-height: 15px;
      color: #333;
    }
    .money {
      font-size: 30px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      line-height: 40px;
      color: #333;
    }

    &.active {
      background: url(~@img/yue/yue-chongzhi-active.png) no-repeat center / cover;

      .currency {
        color: #fff;
      }
      .money {
        color: #fff;
      }
    }
  }
}

.yue-rich {
  margin-bottom: 32px;
  background: #f5f5f5;
  padding: 24px;
  font-size: 14px;
  font-family: Microsoft YaHei-Regular, Microsoft YaHei;
  font-weight: 400;
  color: #666666;
  line-height: 28px;
}

.chongzhi-title {
  margin-bottom: 45px;
  font-size: 18px;
  font-family: Microsoft YaHei-Regular, Microsoft YaHei;
  font-weight: 400;
  color: #333333;
}

.chongzhi-list {
  margin-top: 50px;
  display: flex;
  flex-wrap: wrap;

  .chongzhi-item {
    cursor: pointer;
    position: relative;
    .flex-center();
    flex-direction: column;
    margin-right: 31px;
    margin-bottom: 50px;
    width: 343px;
    height: 180px;
    border-radius: 12px;

    border: 2px solid #4CA5E4;
    border: 2px solid transparent;
    background: #f6f6f6;
    &:nth-child(3n) {
      margin-right: 0;
    }

    &.selected {
      border: 2px solid #4CA5E4;
    }
    .song-marker {
      position: absolute;
      left: 0;
      top: -20px;
      width: 154px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      background: linear-gradient(61deg, #4CA5E4 0%, #fe6927 100%);
      border-radius: 20px 0px 20px 0px;
      font-size: 18px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      font-weight: 400;
      color: #ffffff;
    }

    .money {
      font-size: 42px;
      font-family: Microsoft YaHei-Bold, Microsoft YaHei;
      font-weight: bold;
      color: #4CA5E4;
    }
    .tip {
      margin-top: 10px;
      font-size: 14px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      font-weight: 400;
      color: #666666;
    }
  }
}

.chongzhi-type {
  margin-bottom: 45px;
  font-size: 18px;
  font-family: Microsoft YaHei-Regular, Microsoft YaHei;
  font-weight: 400;
  color: #333333;
}

.type-box {
  .flex();

  .type-item {
    .flex();
    cursor: pointer;

    & + .type-item {
      margin-left: 100px;
    }

    .img-check {
      width: 21px;
    }
    .img-marker {
      width: 40px;
      margin: 0 10px 0 16px;
    }
    span {
      font-size: 16px;
      color: #000000;
    }
  }
}

.action-box {
  margin-top: 50px;
  text-align: left;
  button {
    width: 320px;
    height: 48px;
    line-height: 48px;
    background: linear-gradient(90deg, #ff9312 0%, #eb5d53 100%);
    background: #4CA5E4;
    border-radius: 4px;
    font-size: 16px;
    font-family: PingFang SC;
    font-weight: 400;
    color: #ffffff;
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/user/yueChongzhi.less"></style>
