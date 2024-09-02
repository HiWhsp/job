<template>
  <div class="page">
    <div class="main-title">
      <div class="left">我的兑换</div>
      <div class="right" @click="$router.push('/jifen')">
        <img src="@img/jifen/jifen-mingxi.png" alt="" />
        <span>积分商城</span>
      </div>
    </div>

    <div class="wrap">
      <div class="inner">
        <div class="tab-box">
          <div class="list">
            <div
              class="item"
              v-for="(item, index) in list_tab"
              :key="index"
              @click="selectTab = item"
              :class="item.title == selectTab.title ? 'active' : ''"
            >
              {{ item.title }}
            </div>
          </div>
        </div>

        <div class="bottom-info">
          <div class="list-wrap">
            <div class="good-list">
              <div
                class="item"
                v-for="(order, index) in list_order"
                :key="index"
                @click="$router.push(`/order-detail?order_id=${order.id}`)"
              >
                <div class="img-box">
                  <img :src="order.goods.image" alt />
                </div>
                <div class="info">
                  <div class="title">{{ order.goods.title }}</div>

                  <div class="duihuan-info">
                    <div class="jifen">
                      <b>
                        {{ order.goods.jifen || 0 }}
                      </b>
                      <span>积分</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>


            <el-empty v-if="!list_order.length" description="暂无数据..."></el-empty>
          </div>
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
      cursor: pointer;
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

.tab-box {
  border-bottom: 1px solid #eee;
  .list {
    .flex();
    .item {
      cursor: pointer;
      padding-bottom: 5px;
      border-bottom: 3px solid transparent;
      margin-right: 50px;

      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #222222;

      &.active {
        border-bottom: 3px solid #ff9312;
      }
    }
  }
}

.bottom-info {
  margin-top: 20px;
  margin-bottom: 50px;
}
.good-list {
  .flex();
  text-align: center;
  .item {
    margin-bottom: 30px;
    cursor: pointer;

    margin-right: 20px;
    margin-top: 30px;

    &:nth-child(4n) {
      margin-right: 0;
    }
    &:nth-child(-n + 5) {
      margin-top: 0;
    }

    .img-box {
      img {
        width: 228px;
        height: 228px;
      }
    }
    .info {
      text-align: center;
      .title {
        margin-top: 10px;
        font-size: 13px;
        color: #222;
        line-height: 26px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .duihuan-info {
        margin-top: 10px;
        .flex-center();

        .jifen {
          font-size: 14px;
          font-family: PingFang SC;
          font-weight: 400;
          line-height: 24px;
          color: #222222;

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
        width: 45px;
        height: 20px;
        background: #ff9312;
        opacity: 1;
        border-radius: 2px;
      }
    }
  }
}
</style>
