<template>
  <div class="page">
    <div class="main-title">
      <div class="left">我的积分</div>
      <!-- <div class="right" @click="$router.push('/pointsMall')">
        <img src="@img/jifen/jifen-mingxi.png" alt="" />
        <span>积分商城</span>
      </div> -->
    </div>

    <div class="page-ctx">
      <div class="yue-box">
        <div class="text-box flex-center">
          <div class="text-1">可用积分：</div>
          <div class="text-2">
            {{ info.jifen || 0 }}
            <!-- <span class="currency">元</span> -->
          </div>
          <img src="@/assets/image/record.png" alt="">

          <!-- <div class="text-3">
            <button @click="openInvite()">邀请赚取积分</button>
          </div> -->
        </div>
      </div>

      <div class="wrap">
        <div class="inner">
          <div class="tab-box">
            <div
                v-for="(item, index) in list_tab"
                :key="index"
                :class="item.title == selectTab.title ? 'active' : ''"
                class="tab-item"
                @click="selectTab = item"
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
                    v-for="(item, index) in list_jilu"
                    :key="index"
                    class="item-box"
                    @click="$router.push(`/order-detail?order_id=${order.id}`)"
                >
                  <template v-if="item.product_info && item.product_info.length">
                    <div class="item item_cahnpin">
                      <div class="item-1">
                        <div
                            v-for="(goods, goods_index) in item.product_info"
                            :key="goods_index"
                            class="goods-info"
                        >
                          <div class="img-box">
                            <img :src="goods.image" alt=""/>
                          </div>
                          <div class="info-box">
                            <div class="title">{{ goods.title }}</div>
                            <!-- <div class="info">订单号：546465454565</div> -->
                          </div>
                        </div>
                      </div>
                      <div
                          :class="{ plus: item.type == 1, minus: item.type == 2 }"
                          class="item-2 val"
                      >
                        {{ item.jifen }}
                      </div>
                      <div class="item-3">{{ item.createdTime }}</div>
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
                          :class="{ plus: item.type == 1, minus: item.type == 2 }"
                          class="item-2 val"
                      >
                        {{ item.jifen }}
                      </div>
                      <div class="item-3">{{ item.createdTime }}</div>
                      <!-- <div class="item-4">
                        {{ item.remark }}
                      </div> -->
                    </div>
                  </template>
                </div>
              </div>

              <div v-if="count" class="pagination-box">
                <el-pagination
                    :current-page="pagination.page"
                    :page-size="pagination.pageNum"
                    :total="count"
                    background
                    layout="total, prev, pager, next"
                    @current-change="mix_current_change"
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

import {mapState} from "vuex";

export default {
  name: "jifen-jilu",
  components: {},
  data() {
    return {
      selectTab: {title: "积分明细", status: "0"},
      //type   1-收入  2-支出
      list_tab: [
        {title: "积分明细", status: "0"},
        {title: "积分收入", status: "1"},
        {title: "积分支出", status: "2"},
      ],
      list_jilu: [],

      pagination: {
        page: 1,
        pageNum: 10,
      },
      count: 0,
      info: {}
    };
  },
  computed: {
    // ...mapState([""]),
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
      this.$api({
        url: '/service.php',
        method: 'get',
        data: {
          action: 'jiFen_lists',
          ...this.pagination,
          type: this.selectTab.status, //类型：0全部 1收入 2 支出
        },
      }).then((res) => {
        if (res.code == 200) {
          let data = res.data
          this.info = data;
          this.list_jilu = data.list;
          this.count = data.count;
        }
      });
    },


  },
};
</script>

<style lang="less" scoped>
.plus {
  color: #F74747;
  font-weight: bold;
}

.minus {
  color: #52c41a;
  font-weight: bold;
}

.goods-info {
  display: flex;
  align-items: center;

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
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 32px;
    text-align: left;
    height: 56px;
    line-height: 56px;
    background: #1D1D1D;
    font-size: 16px;
    font-family: Microsoft YaHei-Bold, Microsoft YaHei;
    font-weight: bold;
    color: #fff;

    button {
      min-width: 96px;
      height: 30px;
      line-height: 30px;
      background: #F74747;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }
  }

  .page-ctx {
    margin-top: 10px;
    padding: 32px 32px 55px 32px;
    background: #1D1D1D;
  }
}

.yue-box {
  position: relative;
  width: 100%;
  height: 112px;
  //background: url(~@/assets/image/record.png) no-repeat center / cover;
  background-color: #DF1626;
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
      margin-left: 10px;
      font-size: 32px;
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

    img {
      height: 100%;
      width: 500px;
    }
  }
}

.tab-box {
  margin-top: 24px;
  flex: 2;
  // border-bottom: 1px solid #eee;

  display: flex;
  align-items: center;

  .tab-item {
    cursor: pointer;
    padding-bottom: 10px;
    border-bottom: 3px solid transparent;
    margin-right: 55px;
    font-size: 14px;
    font-family: Microsoft YaHei-Regular, Microsoft YaHei;
    font-weight: 400;
    color: #fff;

    &.active {
      border-bottom: 3px solid #fff;
      font-weight: bold;
      color: #fff;
    }
  }
}

.bottom-info {
  margin-top: 20px;
  margin-bottom: 50px;
}

.jilu-list {
  margin-bottom: 30px;

  .item {
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    font-size: 14px;
    font-family: Microsoft YaHei-Regular, Microsoft YaHei;
    font-weight: 400;

    &:last-child {
    }

    &.item-title {
      background: #5A5A5A;
      font-size: 14px;
      font-family: Microsoft YaHei-Bold, Microsoft YaHei;
      font-weight: bold;
      color: #fff;
    }

    .item-1 {
      text-align: left;
      flex: 1;
      display: flex;
      align-items: center;

      .img-box {
        img {
          // width: 88px;
        }
      }

      .info-box {
        padding-left: 15px;

        .title {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          text-overflow: ellipsis;
          overflow: hidden;
          -webkit-line-clamp: 2;
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

<style lang="less" scoped src="@/assets/h5css/huodong/pointsDetail.less"></style>
