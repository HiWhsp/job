<template>
  <div class="page">
    <div class="main-title">
      <div class="left">我的余额</div>
    </div>

    <div class="wrap">
      <div class="inner">
        <div class="top-info">
          <div class="yue-box">
            <div class="text-box">
              <div class="text-1">余额</div>
              <div class="text-2">{{vuex_huobi}}{{ baseInfo.yue }}</div>
              <div class="text-3">
                <button @click="$router.push('/chongzhijilu')">充值记录</button>
              </div>
            </div>
          </div>
        </div>

        <div class="bottom-info">
          <div class="list-wrap">
            <div class="list">
              <div
                class="item"
                v-for="(item, index) in list_chongzhi"
                :key="index"
                :class="select_chongzhi == item ? 'active' : ''"
                @click="on_select(item)"
              >
                <span class="currency">{{vuex_huobi}}</span>
                <span class="money">{{ item.man }} </span>
              </div>
            </div>
          </div>
        </div>

        <div class="action-box">
          <button @click="yue_chongzhi">立即充值</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import order from "@/shop-actions/order";

import { mapState } from "vuex";
export default {
  name: "User",
  components: {},
  data() {
    return {
      selectTab: { title: "全部", status: "0" },
      list_tab: [
        { title: "全部", status: "0" },
        { title: "待发货", status: "2" },
        { title: "待收货", status: "3" },
        { title: "待评价", status: "4" },
        { title: "已评价", status: "5" },
      ],
      list_order: [],
      listGoods: [],
      pagination: {
        page: 1, //当前页
        pageNum: 20, //每页数量
      }, //分页器

      select_chongzhi: {},
    };
  },
  computed: {
    ...mapState(["baseInfo", "webConfig"]),

    list_chongzhi() {
      return this.webConfig.rules;
    },
  },
  watch: {
    selectTab() {
      this.setView();
    },
  },
  created() {
    this.setView();
  },

  methods: {
    setView() {
      let scene = this.selectTab.status;
      order.orders_lists({
        params: {
          ...this.pagination,
          if_jifen: 1,
          scene: scene, //0全部 1待支付  2待发货  3待收货  4待评价  5已评价 -1无效
        },
        success: (data, count) => {
          //console.log("orders_lists success", data);

          data.forEach((v) => {
            v.goods = v.products[0];
          });
          this.list_order = data;
        },
      });
    },

    set_select_chongzhi() {
      if (this.list_chongzhi && this.list_chongzhi.length) {
        this.select_chongzhi = this.list_chongzhi[0];
      }
    },

    setView() {
      this.$store.dispatch("query_user");
    },

    on_select(item) {
      // debugger
      this.select_chongzhi = item;
    },

    yue_chongzhi() {
      if (!this.select_chongzhi.man) {
        alertErr("请选择充值金额");
        return;
      }
      //余额充值
      this.$api("money_createChongzhi", {
        money: this.select_chongzhi.man,
      }).then((res) => {
        let { code, data, msg} = res;

        if (code == 200) {
          sessionStorage.setItem("yue_money", this.select_chongzhi.man);
          this.$router.push(`/payment-methods?order_id=${data.order_id}&mode=yue`);
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
.page {
  .main-title {
    .flex-between();
    margin-bottom: 20px;
    text-align: left;
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    line-height: 20px;
    color: #333333;

    .left {
    }
    .right {
      .flex();
      img {
        margin-right: 15px;
        width: 16px;
      }
      span {
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 24px;
        color: #222222;
      }
    }
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

.action-box {
  text-align: left;
  button {
    min-width: 170px;
    height: 40px;
    background: linear-gradient(90deg, #ff9312 0%, #eb5d53 100%);
    opacity: 1;
    border-radius: 45px;

    font-size: 16px;
    font-family: PingFang SC;
    font-weight: 400;
    line-height: 36px;
    color: #ffffff;
  }
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
</style>

<style scoped lang="less" src="@/assets/h5css/user/yue.less"></style>
