<template>
  <div class="page">
    <div class="main-title">
      <div class="left">分润统计</div>
    </div>
    <div class="wrap">
      <div class="inner">
        <div class="poster-box" v-if="false">
          <img src="@img/my/bg-fenrun.png" alt="" />
          <div class="info-box">
            <div class="number">
              <span>{{vuex_huobi}}</span>
              <b>{{ baseInfo.order_price }}</b>
            </div>
            <div class="text">当月团队新增业绩</div>
          </div>
        </div>

        <div class="tab-box">
          <div class="tab-item" v-for="(item, index) in list_tab" :key="index" :class="{ active: item.id == select_tab.id }" @click="toggleTab(item)">{{ item.title }}</div>
        </div>

        <!-- 佣金明细 -->
        <div class="list-team-yongjin" v-if="select_tab.id == 0">
          <div class="item" v-for="(item, index) in list_tuandui" :key="index">
            <div class="item-top">
              <div class="left">
                <img :src="item.image" alt="" />
              </div>
              <div class="center">
                <div class="name-box">
                  <span class="name"> {{ item.nickname }} </span>
                  <span class="phone"> {{ item.username }} </span>
                </div>
                <div class="date">{{ item.startTime }} {{ item.endTime }}</div>
              </div>
            </div>
            <div class="item-bottom">
              <div class="number-box">
                <div class="number-item">
                  <div class="number-left">团队合作业绩: {{ item.team_total }}</div>
                  <div class="number-right">佣金: {{ item.team_fenhong }}</div>
                </div>
                <div class="number-item">
                  <div class="number-left">直推团队业绩: {{ item.direct_total }}</div>
                  <div class="number-right">佣金: {{ item.direct_fenhong }}</div>
                </div>
                <div class="number-item">
                  <div class="number-left">间推团队业绩: {{ item.indirect_total }}</div>
                  <div class="number-right">佣金: {{ item.indirect_fenhong }}</div>
                </div>
                <div class="number-item">
                  <div class="number-left">个人销售业绩: {{ item.self_total }}</div>
                  <div class="number-right">佣金: {{ item.self_fenhong }}</div>
                </div>
                <div class="number-item">
                  <div class="number-left">-</div>
                  <div class="number-right">本期佣金总计：{{ item.total_fenhong }}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="pagination-box" v-if="count > 10">
            <el-pagination background layout="prev, pager, next" :total="count" :current-page="pagination.page" :page-size="pagination.pageNum" @current-change="changePage"> </el-pagination>
          </div>
        </div>

        <!-- 分红规则 -->
        <div class="fenhong-rule" v-if="select_tab.id == 3">
          <!-- <div class="html-title">
            {{ detail_rule.title }}
          </div> -->
          <div class="html-box" v-html="detail_rule.content"></div>
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
    return {
      type: this.$route.query.type || "",
      page_title: this.$route.query.type == 1 ? "收入" : "支出",
      list_tab: [
        { title: "佣金明细", id: "0" },
        // { title: "团队业绩", id: "1" },
        // { title: "达标团队", id: "2" },
        { title: "分红规则", id: "3" },
        // { title: "往期分润", id: "4" },
      ],
      select_tab: { title: "佣金明细", id: "0" },
      list: [2, 2, 3],

      pagination: {
        page: 1,
        pageNum: 10,
      },
      pagination_dabiao: {
        page: 1,
        pageNum: 10,
      },
      count: 0,
      detail: {},
      detail_rule: {},

      // 分润
      list_wangqi: [],
      list_tuandui: [], //团队业绩
      list_dabiao: [], //达标团队
    };
  },
  computed: {
    ...mapState(["baseInfo"]),
  },
  created() {
    this.init();
    this.setView();
  },

  methods: {
    init() {
      //分红规则
      this.$api("index_newsDetail", {
        id: 31,
      }).then((res) => {
        //console.log("index_newsDetail", res);
        let { code, data } = res;
        if (code == 200) {
          this.detail_rule = data.info;
        }
      });

      //往期分润 列表
      // this.$api("users_myFenHongrList", {}).then((res) => {
      //   let { code, data, msg} = res;
      //   if (code == 200) {
      //     // this.detail = res;
      //     data.forEach((v) => {
      //       v.date = v.dtTime.substr(0, 10);
      //     });

      //     this.list_wangqi = data;
      //   }
      // });
    },

    changePage(page) {
      this.pagination.page = page;
      this.setView();
    },

    setView() {
      //type  0全部  1团队 2 达标
      this.list_tuandui = [];

      //团队业绩
      if (this.select_tab.title == "团队业绩") {
        this.$api("users_fansRecord", {
          ...this.pagination,
          type: 1,
        }).then((res) => {
          let { code, data, count } = res;
          if (code == 200) {
            this.count = count;

            this.list_tuandui = data;
          }
        });
      } else if (this.select_tab.title == "达标团队") {
        this.$api("users_fansRecord", {
          ...this.pagination_dabiao,
          type: 2,
        }).then((res) => {
          let { code, data, count } = res;
          if (code == 200) {
            this.count = count;
            this.list_tuandui = data;
          }
        });
      } else if (this.select_tab.title == "佣金明细") {
        this.$api("users_fenhongRecord", {
          ...this.pagination_dabiao,
          // userId: 16,
          // token: 'ed07b07b11',
        }).then((res) => {
          let { code, data, count } = res;
          if (code == 200) {
            this.count = count;
            this.list_tuandui = data.list;
          }
        });
      }
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
  }
}

.wrap {
  .inner {
    padding: 0;

    .poster-box {
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

    // 团队业绩
    .list-team-yeji {
      .item {
        .flex();
        margin-bottom: 20px;
        height: 90px;
        background: #ffffff;
        border: 1px solid #cccccc;
        padding: 20px;
        .left {
          img {
            width: 50px;
            height: 50px;
            object-fit: cover;
            border-radius: 50%;
          }
        }

        .center {
          flex: 2;
          padding-left: 15px;
          text-align: left;
          .name-box {
            font-size: 16px;
            font-family: Microsoft YaHei;
            font-weight: bold;
            color: #333333;
            span.name {
            }

            span.phone {
            }
          }

          .date {
            margin-top: 10px;
            font-size: 14px;
            color: #7d7d7d;
          }
        }

        .right {
          min-width: 100px;
          font-size: 16px;
          font-family: Microsoft YaHei;
          font-weight: bold;
          color: #333333;
          .text {
          }

          .number {
            margin-top: 10px;
          }
        }
      }
    }

    // 分红规则
    .fenhong-rule {
      text-align: left;
      padding: 20px;
      min-height: 123px;
      border: 1px solid #f3f3f3;
      background: #f9f9f9;
      .html-box {
        margin-top: 20px;

        /deep/ img {
          max-width: 100%;
          display: block;
          margin: 0 auto;
        }
      }
    }

    //  往月
    .list-wangqi {
      .item {
        border: 1px solid #cccccc;
        text-align: left;
        margin-bottom: 20px;

        .item-title {
          .flex-between();
          background: #f9f9f9;
          height: 48px;
          line-height: 48px;
          border-bottom: 1px solid #ccc;
          padding-left: 20px;
          padding-right: 20px;
          font-size: 14px;

          .order-id {
            color: #333333;
            font-size: 14px;
            font-weight: bold;
          }

          .time {
            color: #7d7d7d;
          }
        }

        .item-info {
          padding: 20px;

          .text-item {
            .flex-between();
            & + .text-item {
              margin-top: 10px;
            }

            .text {
              font-size: 16px;
              font-family: Microsoft YaHei;
              font-weight: bold;
              color: #333333;
            }
            .number {
              font-size: 14px;
              color: #212529;
            }
          }

          .btn-box {
            margin-top: 20px;
            text-align: right;
            a {
              border: 1px solid #4CA5E4;
              padding: 3px 8px;
              color: #4CA5E4;
            }
          }
        }
      }
    }
  }
}

// 佣金明细
.list-team-yongjin {
  .item {
    background: #ffffff;
    border: 1px solid #cccccc;
    margin-bottom: 20px;
    .item-top {
      .flex();
      margin-bottom: 20px;
      min-height: 50px;

      padding: 20px;
      .left {
        img {
          width: 50px;
          height: 50px;
          object-fit: cover;
          border-radius: 50%;
        }
      }

      .center {
        flex: 2;
        padding-left: 15px;
        text-align: left;
        .name-box {
          font-size: 16px;
          font-family: Microsoft YaHei;
          font-weight: bold;
          color: #333333;
          span.name {
          }

          span.phone {
          }
        }

        .date {
          margin-top: 10px;
          font-size: 14px;
          color: #7d7d7d;
        }
      }

      .right {
        min-width: 100px;
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        color: #333333;
        .text {
        }

        .number {
          margin-top: 10px;
        }
      }
    }
    .item-bottom {
      padding: 15px;
      .number-box {
        .number-item {
          .flex-between();
          margin-bottom: 5px;
        }
      }
    }
  }
}
</style>
