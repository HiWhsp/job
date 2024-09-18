<template>
  <div class="page">

    <div class="main-title">
      <div class="left">我的积分</div>
    </div>

    <div class="page-ctx">
      <div class="yue-box">
        <div class="text-box">
          <div class="text-1">我的积分</div>
          <div class="text-2">
            {{ baseInfo.jifen || 0 }}
            <!-- <span class="currency">元</span> -->
          </div>
        </div>
      </div>

      <div class="wrap">
        <div class="inner">
          <div class="tab-box">
            <div
              class="tab-item"
              v-for="(item, index) in list_tab"
              :key="index"
              @click="selectTab = item"
              :class="item.title == selectTab.title ? 'active' : ''"
            >
              {{ item.title }}
            </div>
          </div>

          <div class="bottom-info">
            <div class="list-wrap">
              <div class="jilu-list">
                <div class="item item-title">
                  <div class="item-1">来源/用途</div>
                  <div class="item-2">积分变化</div>
                  <div class="item-3">日期</div>
                  <!-- <div class="item-4">备注</div> -->
                </div>

                <div
                  class="item-box"
                  v-for="(item, index) in list_jilu"
                  :key="index"
                  @click="$router.push(`/order-detail?order_id=${order.id}`)"
                >
                  <template v-if="item.product_info && item.product_info.length">
                    <div class="item item_cahnpin">
                      <div class="item-1">
                        <div
                          class="goods-info"
                          v-for="(goods, goods_index) in item.product_info"
                          :key="goods_index"
                        >
                          <div class="img-box">
                            <img :src="goods.image" alt="" />
                          </div>
                          <div class="info-box">
                            <div class="title">{{ goods.title }}</div>
                            <!-- <div class="info">订单号：546465454565</div> -->
                          </div>
                        </div>
                      </div>
                      <div
                        class="item-2 val"
                        :class="{ plus: item.type == 1, minus: item.type == 2 }"
                      >
                        {{ item.jifen }}
                      </div>
                      <div class="item-3">{{ item.dtTime }}</div>
                      <!-- <div class="item-4">{{ item.remark }}</div> -->
                    </div>
                  </template>
                  <template v-else>
                    <div class="item item_other">
                      <div class="item-1">
                        <div class="text-1">{{ item.remark }}</div>
                        <!-- <div class="text-2">{{ item.jifen }}</div> -->
                      </div>
                      <div
                        class="item-2 val"
                        :class="{ plus: item.type == 1, minus: item.type == 2 }"
                      >
                        {{ item.jifen }}
                      </div>
                      <div class="item-3">{{ item.dtTime }}</div>
                      <!-- <div class="item-4">
                        {{ item.remark }}
                      </div> -->
                    </div>
                  </template>
                </div>
              </div>

              <div class="pagination-box" v-if="count">
                <el-pagination
                  background
                  layout="total, prev, pager, next"
                  :total="count"
                  :current-page="pagination.page"
                  :page-size="pagination.pageNum"
                  @current-change="changePage"
                >
                </el-pagination>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import { mapState } from "vuex";
export default {
  name: "jifen-jilu",
  data() {
    return {
      selectTab: { title: "全部", status: "0" },

      //type   1-收入  2-支出
      list_tab: [
        { title: "全部", status: "0" },
        { title: "收入", status: "1" },
        { title: "支出", status: "2" },
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
      this.$api("users_jifenRecord", {
        ...this.pagination,
        type: this.selectTab.status, //类型：0-全部   1-收入  2-支出
      }).then((res) => {
        let { code, data, count } = res;
        if (code == 200) {
          this.list_jilu = data;
          this.count = count;
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
.plus {
  color: @theme;
  font-weight: bold;
}
.minus {
  color: #52c41a;
  font-weight: bold;
}

.goods-info {
  .flex();

  .img-box {
    img {
      width: 100px;
      height: 100px;
      object-fit: cover;
    }
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
      background: @theme;
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
      border-bottom: 3px solid @theme;
      font-weight: bold;
      color: @theme;
    }
  }
}

.bottom-info {
  margin-top: 20px;
  margin-bottom: 50px;
}
.jilu-list {
  margin-bottom: 30px;
  border: 1px solid #e5e5e5;

  .item {
    text-align: center;
    .flex-between();
    padding: 20px;
    border-bottom: 1px solid #eee;
    font-size: 14px;
    font-family: Microsoft YaHei-Regular, Microsoft YaHei;
    font-weight: 400;
    color: #666666;

    &:last-child {
    }
    &.item-title {
      background: #f5f5f5;
      border-bottom: 1px solid #e5e5e5;
      font-size: 14px;
      font-family: Microsoft YaHei-Bold, Microsoft YaHei;
      font-weight: bold;
      color: #666666;
    }

    .item-1 {
      text-align: left;
      flex: 1;
      .flex();

      .img-box {
        img {
          // width: 88px;
        }
      }

      .info-box {
        padding-left: 15px;
        .title {
          .ellipsis-2();
          font-size: 14px;
          font-family: Microsoft YaHei-Regular, Microsoft YaHei;
          font-weight: 400;
          color: #333333;
          line-height: 24px;
        }
        .info {
          font-size: 14px;
          font-family: Microsoft YaHei-Regular, Microsoft YaHei;
          font-weight: 400;
          color: #999999;
        }
      }
    }
    .item-2 {
      width: 150px;
      &.val {
        font-size: 18px;
        font-family: Microsoft YaHei-Bold, Microsoft YaHei;
        font-weight: bold;
        // color: #fc5a00;
      }
    }

    .item-3 {
      width: 200px;
    }
    .item-4 {
      width: 150px;
    }
  }
}
</style>

