<template>
  <div class="page">

    <div class="main-title">
      <div class="left">我的积分</div>
      <div class="money">
        <img src="@/assets/img/my/order/point.png" alt="">
        <span>1000.00</span>
      </div>
      <div class="flex">
        <div class="btn" style="margin-left: 20px;" @click="goUrl({url: '/repayment'})">下单得积分</div>
      </div>
    </div>

    <p class="title">积分商城</p>

    <div class="list">
      <div class="item" v-for="(item, index) in list_jilu" :key="index">
        <img src="@/assets/img/my/order/point-item.png" alt="">
        <div class="right">
          999积分
        </div>
        <div class="title">这里是礼品名称礼品名称</div>
        <div class="btn" @click="goUrl({url: '/orderPay'})">立即兑换</div>
      </div>
    </div>
  </div>
</template>
<script>

import {mapState} from "vuex";

export default {
  name: "index",
  data() {
    return {
      selectTab: {title: "全部明细", status: "0"},

      //type   1-收入  2-支出
      list_tab: [
        {title: "全部明细", status: "0"},
        {title: "获得记录", status: "1"},
        {title: "兑换记录", status: "2"},
      ],
      list_jilu: [],

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
  watch: {
    selectTab() {
      this.setView();
    },
  },
  created() {
    this.$store.dispatch("query_user");
    this.setView();
  },

  methods: {
    setView() {
      this.$api("jiFen_lists", {
        ...this.pagination,
        type: this.selectTab.status, //类型：0-全部   1-收入  2-支出
      }).then((res) => {
        let {code, data, count} = res;
        if (code == 200) {
          this.list_jilu = data;
          this.count = data.count;
        }
      });
    },
    goUrl(item) {
      this.$router.push(item.url);
    }
  },
};
</script>

<style scoped lang="less">
.page {
  text-align: left;
  width: 100%;
  padding: 0;

  .main-title {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 360px;
    background: url(~@/assets/img/my/order/preSave-bg.png) no-repeat 100% 100%;
    text-align: center;
    font-size: 24px;
    font-weight: bold;
    line-height: 40px;
    color: #fff;

    .left {
      font-weight: bold;
      font-size: 16px;
      color: #333333;
    }

    .money {
      .flex();

      span {
        font-weight: bold;
        font-size: 34px;
        color: #292929;
      }

      img {
        width: 24px;
        height: 24px;
        margin-right: 10px;
      }
    }

    .desc {
      font-weight: 400;
      font-size: 16px;
      color: #00479D;
    }

    .btn {
      margin-top: 25px;
      cursor: pointer;
      width: 112px;
      height: 43px;
      line-height: 43px;
      text-align: center;
      background: linear-gradient(180deg, #FFFFFF 0%, #E5E5E5 100%);
      border-radius: 3px 3px 3px 3px;
      border: 1px solid #CCCCCC;

      font-weight: 400;
      font-size: 16px;
      color: #282828;
    }
  }

  .title {
    font-weight: bold;
    font-size: 20px;
    color: #00479D;
    padding: 30px 0;
  }

  .list {
    display: flex;
    flex-wrap: wrap;
    width: 100%;

    .item {
      display: flex;
      flex-direction: column;
      align-items: center;
      background-color: #fff;
      margin-right: 38px;
      margin-bottom: 20px;
      padding: 20px;
      width: 261px;

      &:nth-child(4n) {
        margin-right: 0;
      }

      img {
        width: 185px;
        height: 185px;
      }

      .right {
        text-align: right;
        color: #00479D;
        font-size: 14px;
        font-weight: bold;
      }

      .title {
        font-weight: 400;
        font-size: 14px;
        color: #333333;
      }

      .btn {
        cursor: pointer;
        width: 114px;
        height: 34px;
        line-height: 34px;
        text-align: center;
        background: #00479D;
        font-weight: 400;
        font-size: 14px;
        color: #FFFFFF;
      }
    }
  }
}
</style>

