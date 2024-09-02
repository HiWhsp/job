<template>
  <div class="page">
    <div class="main-title">
      <div class="left">往期团队分红</div>

      <button @click="$router.back()">返回</button>
    </div>
    <div class="wrap">
      <div class="inner">
        <div class="poster-box">
          <img src="@img/my/bg-fenrun.png" alt="" />
          <div class="info-box">
            <div class="total-number">
              <span>{{vuex_huobi}}</span>
              <b>{{ yeji }}</b>
            </div>
            <div class="total-text">{{ year }}年{{ month }}月团队新增业绩</div>
            <div class="fenhong-info">
              <div class="fenhong-item">
                <span class="text">分红比例</span>
                <span class="number"> {{ bili }}%</span>
              </div>
              <div class="line"></div>
              <div class="fenhong-item">
                <span class="text">分红所得</span>
                <span class="number"> {{vuex_huobi}}{{ suode }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="tab-box">
          <div class="tab-item" v-for="(item, index) in list_tab" :key="index" :class="{ active: item.id == select_tab.id }" @click="toggleTab(item)">{{ item.title }}</div>
        </div>

        <!-- 团队业绩 达标团队 -->
        <div class="list-team-yeji">
          <div class="item" v-for="(item, index) in list_yeji" :key="index">
            <div class="left">
              <img :src="item.image" alt="" />
            </div>
            <div class="center">
              <div class="name-box">
                <span class="name"> {{ item.nickname }} </span>
                <span class="phone"> {{ item.username }} </span>
              </div>
              <div class="date">{{ item.time }}</div>
            </div>
            <div class="right">
              <div class="text">团队业绩</div>
              <div class="number">{{ item.price }}</div>
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
      year: "",
      month: "",
      date: this.$route.query.date || "",
      yeji: this.$route.query.yeji || "",
      bili: this.$route.query.bili || "",
      suode: this.$route.query.suode || "",

      type: this.$route.query.type || "",
      page_title: this.$route.query.type == 1 ? "收入" : "支出",
      list_tab: [
        { title: "团队业绩", id: "1" },
        { title: "达标团队", id: "2" },
      ],
      select_tab: { title: "团队业绩", id: "1" },
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
    this.init();
    this.setView();
  },

  methods: {
    init() {
      let arr = this.date.split("-");
      let [year, month] = arr;
      this.year = year;
      this.month = month;

      //console.log("解析时间", arr);
    },

    setView() {
      let start_time = this.date; //本月第一天
      let end_time = moment([this.year, +this.month, 1])
        .subtract(1, "day")
        .format("YYYY-MM-DD");

      //console.log("本月日期", start_time);
      //console.log("下月日期", end_time);

      this.$api("users_myFenHongDetail", {
        type: this.select_tab.id, //1 团队分红  2 达标
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
      position: relative;
      img {
        width: 100%;
        height: 120px;
        height: 175px;
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

        .total-number {
          span {
            font-size: 16px;
          }
          b {
            font-size: 36px;
          }
        }
        .total-text {
          font-size: 16px;
          font-weight: bold;
        }
      }

      .fenhong-info {
        margin-top: 30px;
        .flex-center();

        font-size: 16px;
        color: #ffffff;

        .line {
          margin: 0 70px;
          width: 1px;
          height: 20px;
          background: #fff;
        }
        .fenhong-item {
          min-width: 160px;
          .flex();

          &:first-child {
            text-align: right;
            justify-content: flex-end;
          }
          .text {
          }
          .number {
            margin-left: 15px;
          }
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
      .html-box {
        min-height: 123px;
        background: #f9f9f9;
        border: 1px solid #f3f3f3;
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
</style>
