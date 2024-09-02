<template>
  <div class="page">
    <!-- 佣金提现 -->
    <modalCommissionWithdraw ref="modalCommissionWithdraw" />
    <div class="main-title">
      <div class="left">{{ page_title }}</div>
      <button @click="$router.back()">返回</button>
    </div>
    <div class="wrap">
      <div class="inner">
        <div class="tab-box">
          <div class="tab-item" v-for="(item, index) in list_tab" :key="index" :class="{ active: item.id == select_tab.id }" @click="toggleTab(item)">{{ item.title }}</div>
        </div>

        <div class="list">
          <div class="item" v-for="(item, index) in list" :key="index">
            <div class="item-title">{{ item.orderInfo }}</div>
            <div class="item-info">
              <div class="left">
                <img src="@img/my/coin.png" alt="" />
              </div>
              <div class="center">
                <div class="remark">{{ item.remark }}</div>
                <div class="time">{{ item.dtTime }}</div>
              </div>
              <div class="right">
                <div class="number">{{ item.money }}</div>
                <div class="last">剩余：{{ item.yue }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="pagination-box">
          <el-pagination background layout="prev, pager, next" :total="count"   :current-page="pagination.page"  :page-size="pagination.pageNum" @current-change="changePage"> </el-pagination>
        </div>

        <div class="link-group">
          <button class="btn" @click="open_modal_withdraw">立即提现</button>
          <router-link to="/myFenRun"> 分润统计 </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import modalCommissionWithdraw from "@/components/modals/modalCommissionWithdraw.vue"; //新增地址

import { mapState } from "vuex";

export default {
  name: "chongzhijilu",
  components: {
    modalCommissionWithdraw,
  },
  data() {
    let select_tab = { title: "佣金抵现", id: "1" };
    if (this.$route.query.type == 2) {
      select_tab = { title: "收入", id: "2" };
    }

    return {
      type: this.$route.query.type || "",
      page_title: this.$route.query.type == 2 ? "收入" : "支出",
      select_tab: select_tab,
      list: [],

      pagination: {
        page: 1,
        pageNum: 10,
      },
      count: 0,
    };
  },
  computed: {
    ...mapState(["baseInfo"]),

    list_tab() {
      let arr = [
        { title: "佣金抵现", id: "1" },
        { title: "提现", id: "3" },
      ];
      if (this.page_title == "收入") {
        arr = [];
      }
      return arr;
    },
  },
  created() {
    this.setView();
  },

  methods: {
    changePage(page) {
      this.pagination.page = page;
      this.setView();
    },

    setView() {
      this.$api("users_moneyRecord", {
        type: this.select_tab.id,
        ...this.pagination,
      }).then((res) => {
        let { code, data, count } = res;
        if (code == 200) {
          this.list = data;
          this.count = count;
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
  padding-bottom: 100px;
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

    .tab-box {
      .flex();
      border-bottom: 1px solid #eee;
      margin-bottom: 10px;
      .tab-item {
        font-size: 16px;
        color: #666666;
        padding: 12px 0;
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

    .list {
      .item {
        border: 1px solid #cccccc;
        text-align: left;
        margin-bottom: 20px;

        .item-title {
          background: #f9f9f9;
          height: 48px;
          line-height: 48px;
          border-bottom: 1px solid #ccc;
          padding-left: 20px;
        }

        .item-info {
          padding: 20px;
          .flex();
          .left {
            img {
              width: 50px;
            }
          }

          .center {
            flex: 2;
            padding-left: 15px;
            text-align: left;
            .remark {
              font-size: 16px;
              font-family: Microsoft YaHei;
              font-weight: bold;
              color: #333333;
            }

            .time {
              margin-top: 10px;
              font-size: 14px;
              color: #7d7d7d;
            }
          }

          .right {
            min-width: 120px;
            text-align: right;
            .number {
              font-size: 16px;
              color: #e6170b;
            }
            .last {
              margin-top: 10px;
              font-size: 14px;
              color: #7d7d7d;
            }
          }
        }
      }
    }

    .link-group {
      margin-top: 40px;
      text-align: left;
      button {
        display: inline-block;
        margin-right: 40px;
        width: 160px;
        height: 40px;
        line-height: 40px;
        background: #009a44;
        text-align: center;
        font-size: 16px;
        font-weight: bold;
        color: #ffffff;
      }
      a {
        display: inline-block;
        margin-right: 40px;
        width: 160px;
        height: 40px;
        line-height: 40px;
        background: #009a44;
        text-align: center;
        font-size: 16px;
        font-weight: bold;
        color: #ffffff;
      }
    }
  }
}
</style>
