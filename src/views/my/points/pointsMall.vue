<template>
  <div class="page">
    <modalInviteUser ref="modalInviteUser" />
    <modalJIfenDuihuan ref="modalJIfenDuihuan" />

    <div class="main-title">
      <div class="left">积分商城</div>
      <!-- <div class="right" @click="$router.push('/pointsMall')">
        <img src="@img/jifen/jifen-mingxi.png" alt="" />
        <span>积分商城</span>
      </div> -->
    </div>

    <div class="page-ctx">
      <div class="yue-box">
        <div class="text-box">
          <div class="text-1">我的积分</div>
          <div class="text-2">
            {{ baseInfo.jifen || 0 }}
            <!-- <span class="currency">元</span> -->
          </div>
          <div class="text-3">
            <button @click="openInvite">邀请赚取积分</button>
          </div>
        </div>
      </div>

      <div class="wrap">
        <div class="inner">
          <!-- <div class="tab-box">
            <div class="tab-item" v-for="(item, index) in list_tab" :key="index" @click="selectTab = item" :class="item.title == selectTab.title ? 'active' : ''">
              {{ item.title }}
            </div>
          </div> -->

          <div class="bottom-info">
            <div class="list-wrap" v-if="list_goods.length">
              <div class="good-list">
                <!-- @click="mix_to_product(item)" -->
                <div class="item" v-for="(item, index) in list_goods" :key="index">
                  <div class="img-box cover">
                    <img :src="item.image" alt />
                  </div>
                  <div class="info">
                    <div class="title">{{ item.title }}</div>
                    <div class="duihuan-info">
                      <div class="jifen">
                        <b>
                          {{ item.jifen || 0 }}
                        </b>
                        <span>积分</span>
                      </div>

                      <!-- <span class="yidui">已兑 {{ item.order || 0 }}</span> -->
                      <button class="btn-enter" @click.stop="onClick_duihuan(item)">
                        兑换
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="pagination-box" style="margin-top: 40px">
                <el-pagination
                  background
                  layout="total, prev, pager, next"
                  @current-change="changePage"
                  :current-page.sync="pagination.page"
                  :page-size="pagination.pageNum"
                  :total="count"
                ></el-pagination>
              </div>
            </div>
            <div v-else>
              <div class="product-empty" v-if="!list_goods.length">
                <el-empty description="没有查询到积分商品信息..."></el-empty>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import modalInviteUser from "@/components/modals/modalInviteUser.vue";
import modalJIfenDuihuan from "@/components/jifen/modalJIfenDuihuan.vue";

import { mapState } from "vuex";
export default {
  name: "jifen-jilu",
  components: {
    modalInviteUser,
    modalJIfenDuihuan,
  },
  data() {
    return {
      selectTab: { title: "全部", status: "0" },

      count: 0,
      pagination: {
        page: 1,
        pageNum: 10,
      },
      list_goods: [],
    };
  },
  computed: {
    ...mapState(["baseInfo"]),

    list_tab() {
      return [
        { title: "全部", status: "0" },
        { title: "收入", status: "1" },
        { title: "支出", status: "2" },
      ];
    },
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

  mounted() {
    // this.$refs.modalJIfenDuihuan.init({});
  },

  methods: {
    // changePage(page) {
    //   this.pagination.page = page;
    //   this.setView();
    // },
    setView() {
      //积分商品
      this.$api("money_jifenPdts", {
        ...this.pagination,
      }).then((res) => {
        let { code, data, pages, message } = res;
        this.list_goods = data;
      });
    },

    //进入详情
    click_goods(item) {
      this.$router.push({
        path: "/jifenproduct-detail",
        query: {
          id: item.inventoryId,
          jifen: item.jifen,
          order: item.order,
        },
      });
    },

    openInvite() {
      this.$refs.modalInviteUser.init();
    },

    //积分兑换
    onClick_duihuan(item) {
      //console.log("积分兑换");

      this.$refs.modalJIfenDuihuan.init(item);
    },
  },
};
</script>

<style scoped lang="less">
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

.yue-box {
  position: relative;
  width: 100%;
  height: 142px;
  background: url(~@/static/order/jifen-bg.png) no-repeat center / cover;
  background-size: 100% 100%;
  padding-left: 40px;
  padding-left: 40px;
  flex-direction: column;
  .flex-center();
  align-items: flex-start;

  .text-box {
    text-align: left;
    .text-1 {
      font-size: 16px;
      font-family: PingFang SC;
      font-weight: bold;
      line-height: 40px;
      color: #ffffff;
    }
    .text-2 {
      margin-top: 10px;

      font-size: 40px;
      font-family: PingFang SC;
      font-weight: bold;
      line-height: 40px;
      color: #ffffff;

      .currency {
        font-size: 18px;
      }
    }
    .text-3 {
      position: absolute;
      right: 24px;
      bottom: 20px;
      button {
        border-radius: 20px;
        width: 128px;
        height: 34px;
        line-height: 34px;
        background: rgba(255, 255, 255, 0.78);
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 400;

        color: #666;
      }
    }
  }
}

.tab-box {
  margin-top: 24px;
  flex: 2;
  // border-bottom: 1px solid #eee;

  .flex();
  .tab-item {
    cursor: pointer;
    padding-bottom: 10px;
    border-bottom: 3px solid transparent;
    margin-right: 55px;
    font-size: 14px;
    font-family: Microsoft YaHei-Regular, Microsoft YaHei;
    font-weight: 400;
    color: #333333;

    &.active {
      border-bottom: 3px solid #4CA5E4;
      font-weight: bold;
      color: #4CA5E4;
    }
  }
}

.bottom-info {
  margin-top: 20px;
  margin-bottom: 50px;
}

.good-list {
  .flex();
  flex-wrap: wrap;
  margin-top: 20px;
  text-align: left;
  .item {
    margin-bottom: 30px;
    cursor: pointer;
    margin-right: 32px;
    margin-top: 30px;
    border: 1px solid #e5e5e5;
    overflow: hidden;
    width: 249px;

    &:nth-child(4n) {
      margin-right: 0;
    }
    &:nth-child(-n + 5) {
      margin-top: 0;
    }

    .img-box {
      img {
        width: 249px;
        height: 249px;
      }
    }
    .info {
      text-align: left;
      padding: 15px;
      .title {
        .ellipsis-1();
        margin-top: 0;
        font-size: 13px;
        color: #222;
        line-height: 26px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .duihuan-info {
        margin-top: 10px;
        .flex-between();

        .jifen {
          font-size: 14px;
          font-family: PingFang SC;
          font-weight: 400;
          line-height: 24px;
          color: #222222;
          color: #f13f17;

          b {
            color: #f13f17;
            font-weight: normal;
          }
        }
        .yidui {
          margin-left: 15px;
          min-width: 52px;
          height: 20px;
          line-height: 20px;
          background: #f4f4f4;
          opacity: 1;
          border-radius: 4px;
          font-size: 12px;
          font-family: PingFang SC;
          font-weight: 400;
          color: #7d7d7d;
        }
      }
      .price-prev {
        color: #aaa;
        text-decoration: line-through;
      }

      button {
        width: 51px;
        height: 22px;
        background: #4CA5E4;
        border-radius: 2px;
        color: #fff;
        font-size: 12px;
      }
    }
  }
}
</style>

