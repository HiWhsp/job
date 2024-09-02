<template>
  <div class="page">
    <div class="main-title">
      <div class="left">我的团队</div>
    </div>
    <div class="wrap">
      <div class="inner">
        <div class="top-box">
          <div class="fenhong-info">
            <div class="fenhong-item">
              <span class="text">我的直属团队总业绩</span>
              <span class="number"> {{ child_total }}</span>
            </div>
            <div class="line"></div>
            <div class="fenhong-item">
              <span class="text">我的下级团队总业绩</span>
              <span class="number">{{ team_total }}</span>
            </div>
          </div>

          <!-- 我的上级 -->
          <div class="shangji-info" v-if="has_shangji">
            <div class="img-box">
              <img :src="shangji_info.image" alt="" />
            </div>
            <div class="name-box">
              <div class="name">
                <span>{{ shangji_info.nickname }} </span>
                <span>{{ shangji_info.username }}</span>
              </div>
              <div class="date">{{ shangji_info.dtTime }}</div>
            </div>
            <div class="right-box">我的上级</div>
          </div>
        </div>

        <!-- <div class="tab-box">
          <div class="tab-item" v-for="(item, index) in list_tab" :key="index" :class="{ active: item.id == select_tab.id }" @click="toggleTab(item)">{{ item.title }}</div>
        </div> -->

        <!-- 团队业绩 达标团队 -->
        <div class="list-team-yeji">
          <div class="team-title">直属下级</div>
          <div class="item" v-for="(item, index) in list_team" :key="index">
            <div class="left">
              <img :src="item.image" alt="" />
            </div>
            <div class="center">
              <div class="name-box">
                <span class="name"> {{ item.nickname }} </span>
                <span class="phone"> {{ item.username }} </span>
              </div>
              <div class="date">{{ item.dtTime }}</div>
            </div>
            <div class="right">
              <div class="text">个人业绩 {{ item.self_total }}</div>
              <div class="number">团队业绩{{ item.child_total }}</div>
            </div>
          </div>
        </div>

        <div class="pagination-box" v-if="count > 10">
          <el-pagination background layout="prev, pager, next" :total="count" :current-page="pagination.page" :page-size="pagination.pageNum" @current-change="changePage"> </el-pagination>
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
      // type: this.$route.query.type || "",
      // page_title: this.$route.query.type == 1 ? "收入" : "支出",
      // list_tab: [
      //   { title: "团队业绩", id: "1" },
      //   { title: "达标团队", id: "2" },
      // ],
      select_tab: { title: "团队业绩", id: "1" },
      list: [],
      list_team: [],

      pagination: {
        page: 1,
        pageNum: 10,
      },
      count: 0,
      detail: {},

      number_zhishu: 0,
      number_tuandui: 0,

      child_total: "", //我的直属团队总业绩
      team_total: "", //我的下级团队总业绩

      has_shangji: false,
    };
  },
  computed: {
    ...mapState(["baseInfo"]),

    // has_shangji() {
    //   // return this.detail.shangji;
    //   return false;
    // },

    shangji_info() {
      return this.detail.shangji || {};
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
      // this.$api("users_fansRecord", {
      //   ...this.pagination,
      //   type: 0, //	0全部1团队 2 达标
      // }).then((res) => {
      //   let { code, data, msg} = res;
      //   if (code == 200) {
      //     this.detail = res;
      //     this.list_team = data;

      //     this.number_zhishu = res.count || 0;
      //     this.number_tuandui = res.tuan_num;
      //   }
      // });

      this.$api("users_fansRecordNew", {
        ...this.pagination,
        type: 0, //	0全部1团队 2 达标
      }).then((res) => {
        let { code, shangji, data, message } = res;
        if (code == 200) {
          if (shangji && shangji.dtTime) {
            this.shangji = shangji;
            this.has_shangji = true;
          }

          this.detail = res;
          this.list_team = data;

          this.number_zhishu = res.count || 0;
          this.number_tuandui = res.tuan_num;

          this.child_total = res.child_total;
          this.team_total = res.team_total;
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
  }
}

.wrap {
  .inner {
    padding: 0;

    .top-box {
      padding: 30px;
      background: #4CA5E4;
      color: #fff;
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
          .flex-center();
          flex-direction: column;

          &:first-child {
            text-align: right;
            justify-content: flex-end;
          }
          .text {
            font-weight: bold;
          }
          .number {
            margin-top: 10px;
            font-size: 36px;
          }
        }
      }

      .shangji-info {
        .flex();
        margin: 0 auto;
        margin-top: 20px;
        width: 770px;
        height: 92px;
        padding: 20px;
        background: #ffffff;
        border: 1px solid #707070;
        opacity: 1;
        border-radius: 10px;
        color: #333;
        font-size: 14px;

        .img-box {
          img {
            width: 50px;
            height: 50px;
            border-radius: 50%;
          }
        }
        .name-box {
          flex: 2;
          text-align: left;
          padding-left: 15px;
          font-weight: bold;
          span {
            margin-right: 15px;
          }

          .date {
            margin-top: 10px;
          }
        }
        .right-box {
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
      .team-title {
        margin: 30px 0;
        text-align: left;
        font-size: 16px;
      }

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
