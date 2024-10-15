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
            {{ baseInfo.jifen || 50000 }}
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
                  <div class="item-4">备注</div>
                  <div class="item-4">备注</div>
                </div>

                <div
                  class="item-box"
                  v-for="(item, index) in currentList"
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
                            <img src="../../../static/home/featuredRecommendations/product3.png" alt="" />
                          </div>
                          <div class="info-box">
                            <div class="info">订单号：546465454565</div>
                            <div class="info">订单号：546465454565</div>
                            <div class="title">{{ goods.title }}</div>
                          </div>
                        </div>
                      </div>
                      <div
                        class="item-2 val"
                        :class="{ plus: item.type == 1, minus: item.type == 2 }"
                      >
                          {{ item.type == 1 ? "+" : "-" }}{{ item.jifen }}
                      </div>
                      <div class="item-3">{{ item.dtTime }}</div>
                      <div class="item-4">{{ item.remark }}</div>
                      <div class="item-4">{{ item.remark }}</div>
                    </div>

                  </template>


                  <!-- <template v-else>
                    <div class="item item_other">
                      <div class="item-1">
                        <div class="text-1">{{ item.remark }}</div>
                        <div class="text-2">{{ item.jifen }}</div>
                      </div>
                      <div
                        class="item-2 val"
                        :class="{ plus: item.type == 1, minus: item.type == 2 }"
                      >
                        {{ item.jifen }}
                      </div>
                      <div class="item-3">{{ item.dtTime }}</div>
                      <div class="item-4">
                        {{ item.remark }}
                      </div>
                    </div>
                  </template> -->
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
      selectTab: { title: "积分明细", status: "0" },

      //type   1-收入  2-支出
      list_tab: [
        { title: "积分明细", status: "0" },
        { title: "积分收入", status: "1" },
        { title: "积分支出", status: "2" },
      ],
      list_jilu: [
        {
        product_info: [
            {
              image: require("@/static/home/featuredRecommendations/product3.png"),
              title: "激光平面窗口 中5.0mm 厚度=2.0mm"
            }
          ],
        type:1,
        jifen:2400,
        dtTime:"2022-10-10 10:12:30",
        remark:"积分来源"
        },
        {
        product_info: [
            {
              image: require("@/static/home/featuredRecommendations/product3.png"),
              title: "激光平面窗口 中5.0mm 厚度=2.0mm"
            }
          ],
        type:2,
        jifen:2400,
        dtTime:"2022-10-10 10:12:30",
        remark:"积分兑换"
        },
      ],
      list_zengjiajilu: [
        {
        product_info: [
            {
              image: require("@/static/home/featuredRecommendations/product3.png"),
              title: "激光平面窗口 中5.0mm 厚度=2.0mm"
            }
          ],
        type:1,
        jifen:2400,
        dtTime:"2022-10-10 10:12:30",
        remark:"积分来源"
        },
      ],
      list_jianshaojilu: [
        {
        product_info: [
            {
              image: require("@/static/home/featuredRecommendations/product3.png"),
              title: "激光平面窗口 中5.0mm 厚度=2.0mm"
            }
          ],
        type:2,
        jifen:2400,
        dtTime:"2022-10-10 10:12:30",
        remark:"积分兑换"
        },
      ],

      pagination: {
        page: 1,
        pageNum: 10,
      },
      count: 0,
    };
  },

  computed: {
    ...mapState(["baseInfo"]),

    currentList() {
    switch (this.selectTab.status) {
      case '0':
        return this.list_jilu;
      case '1':
        return this.list_zengjiajilu;
      default:
        return this.list_jianshaojilu; 
    }
  }
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
  color: #FC5A00;
  color: #FC5A00;
  font-weight: bold;
}
.minus {
  color: #52C41A;
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
      background: #4ca5e4;
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
  height: 142px;
  //background: url(~@/static/order/jifen-bg.png) no-repeat center / cover;
  background: linear-gradient( 229deg, #4B73CE 0%, #27417C 100%);
  border-radius: 12px 12px 12px 12px;
  background-size: 100% 100%;
  padding-left: 40px;
  padding-left: 40px;
  flex-direction: column;
  .flex-center();
  align-items: flex-start;
 
  .text-box {
    width: 100%;

    .text-1 {
      padding-top: 26px;
      text-align: center;
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: bold;
      font-size: 16px;
      color: #ffffff;
      text-align: center;

    }
    .text-2 {
      text-align: center;
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: bold;
      font-size: 42px;
      color: #ffffff;
      text-align: center;


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
      border-bottom: 3px solid #27417c;
      font-weight: bold;
      color: #27417c;
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
        height: 81px;
        padding-left: 15px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        .info {
          font-size: 14px;
          font-family: Microsoft YaHei-Regular, Microsoft YaHei;
          font-weight: 400;
          line-height: 16px;
          color: #999999;
        }
        .title {
          .ellipsis-2();
          font-size: 16px;
          font-family: Microsoft YaHei-Regular, Microsoft YaHei;
          font-weight: 400;
          color: #999999;
          margin-bottom: 14px;
        }
      }
    }
    .item-2 {
      width: 254px;
      &.val {
        font-size: 18px;
        font-family: Microsoft YaHei-Bold, Microsoft YaHei;
        font-weight: bold;
        // color: #fc5a00;
      }
    }

    .item-3 {
      width: 138px;
    }
    .item-4 {
      width: 298px;
    }
  }
}
</style>

