<template>
  <div class="page">
    <div class="main-title">
      <div class="left">业绩详情</div>

      <button @click="$router.back()">返回</button>
    </div>
    <div class="wrap">
      <div class="inner">
        <div class="poster-box">
          <img src="@img/my/bg-fenrun.png" alt="" />
          <div class="info-box">
            <div class="number">
              <span>{{vuex_huobi}}</span>
              <b>{{ money }}</b>
            </div>
            <div class="text">{{ year }}年{{ month }}月团队新增业绩</div>
          </div>
        </div>

        <!-- <div class="tab-box">
          <div class="tab-item" v-for="(item, index) in list_tab" :key="index" :class="{ active: item.id == select_tab.id }" @click="toggleTab(item)">{{ item.title }}</div>
        </div> -->

        <!-- 当月业绩 -->
        <div class="list">
          <div class="item" v-for="(item, index) in list_yeji" :key="index">
            <div class="item-title">
              <div class="time">{{ item.dtTime }}</div>
              <div class="order-id">订单号：{{ item.orderId }}</div>
            </div>
            <div class="item-info">
              <div class="goods-item" v-for="(goods, goods_index) in item.product_json" :key="goods_index">
                <div class="left">
                  <img :src="goods.image" alt="" />
                </div>
                <div class="center">
                  <div class="remark">{{ goods.title }}</div>
                  <!-- <div class="time">2022-05-03 14：26：20</div> -->
                </div>
                <div class="right">
                  <div class="number">x {{ goods.num }}</div>
                  <div class="money">{{vuex_huobi}}{{ goods.priceSale }}</div>
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
import moment from "moment";
import modalCommissionWithdraw from "@/components/modals/modalCommissionWithdraw.vue"; //新增地址

import { mapState } from "vuex";

export default {
  name: "chongzhijilu",
  components: {
    modalCommissionWithdraw,
  },
  data() {
    return {
      year: this.$route.query.year || "",
      month: this.$route.query.month || "",
      date: this.$route.query.date || "",
      money: this.$route.query.money || "",
      // page_title: this.$route.query.type == 1 ? "收入" : "支出",
      // list_tab: [
      //   { title: "当月业绩", id: "1" },
      //   { title: "往期业绩", id: "2" },
      // ],
      // select_tab: { title: "当月业绩", id: "1" },

      list_yeji: [],

      pagination: {
        page: 1,
        pageNum: 10,
      },
      count: 0,
    };
  },
  computed: {
    ...mapState(["baseInfo"]),
  },
  created() {
    this.setView();
  },

  methods: {
    setView() {
      let start_time = this.date; //本月第一天
      let end_time = moment([this.year, +this.month, 1])
        .subtract(1, "day")
        .format("YYYY-MM-DD");

      //console.log("本月日期", start_time);
      //console.log("下月日期", end_time);

      this.$api("users_myOrderDetail", {
        ...this.pagination,
        start_time: start_time,
        end_time: end_time,
      }).then((res) => {
        let { code, data, msg} = res;
        if (code == 200) {
          this.list_yeji = data;
        }
      });
    },
    onClickLeft() {
      this.$router.back();
    },

    toggleTab(item) {
      this.select_tab = item;
      this.setView();
    },

    open_modal_withdraw() {
      this.$refs.modalCommissionWithdraw.init();
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

    button {
      min-width: 96px;
      height: 30px;
      line-height: 30px;

      background: #4CA5E4;
      color: #fff;
      font-size: 14px;
    }
  }
}

.wrap {
  .inner {
    padding: 0;

    .poster-box {
      margin-bottom: 30px;
      position: relative;
      img {
        width: 100%;
        height: 120px;
      }

      .info-box {
        .flex-center();
        flex-direction: column;
        position: absolute;
        z-index: 100;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        color: #fff;

        .number {
          span {
            font-size: 16px;
          }
          b {
            font-size: 36px;
          }
        }
        .text {
          font-size: 16px;
          font-weight: bold;
        }
      }
    }

    .tab-box {
      .flex();
      margin-top: 30px;
      border-bottom: 1px solid #eee;
      margin-bottom: 30px;
      .tab-item {
        font-size: 16px;
        color: #666666;
        padding-bottom: 12px;
        margin-right: 50px;
        min-width: 70px;
        border-bottom: 3px solid transparent;
        cursor: pointer;

        &.active {
          color: #009a44;
          border-bottom: 3px solid #009a44;
        }
      }
    }

    // 当月业绩
    .list {
      .item {
        border: 1px solid #cccccc;
        text-align: left;
        margin-bottom: 20px;

        .item-title {
          .flex();
          background: #f9f9f9;
          height: 48px;
          line-height: 48px;
          border-bottom: 1px solid #ccc;
          padding-left: 20px;
          font-size: 14px;

          .time {
            color: #7d7d7d;
          }
          .order-id {
            margin-left: 20px;
            color: #333333;
          }
        }

        .item-info {
          .goods-item {
            padding: 20px;
            .flex();
            .left {
              img {
                width: 100px;
                height: 100px;
                object-fit: cover;
              }
            }

            .center {
              flex: 2;
              padding-left: 15px;
              text-align: left;
              .remark {
                font-size: 16px;
                color: #333333;
              }

              .time {
                margin-top: 10px;
                font-size: 14px;
                color: #7d7d7d;
              }
            }

            .right {
              .flex-between();
              min-width: 140px;
              text-align: right;
              .number {
                font-size: 16px;
                color: #999;
              }
              .money {
                font-size: 16px;
                color: #333;
              }
            }
          }
        }
      }
    }

    //  往月业绩
    .list-wangqi {
      .item {
        border: 1px solid #cccccc;
        text-align: left;
        margin-bottom: 20px;

        .item-title {
          .flex();
          background: #f9f9f9;
          height: 48px;
          line-height: 48px;
          border-bottom: 1px solid #ccc;
          padding-left: 20px;
          font-size: 14px;

          .time {
            color: #7d7d7d;
          }
          .order-id {
            margin-left: 20px;
            color: #333333;
          }
        }

        .item-info {
          padding: 20px;
          .flex-between();

          .remark {
            font-size: 16px;
            font-family: Microsoft YaHei;
            font-weight: bold;
            color: #333333;
          }
          .money {
            font-size: 16px;
            font-family: Microsoft YaHei;
            color: #212529;
          }
        }
      }
    }
  }
}
</style>
