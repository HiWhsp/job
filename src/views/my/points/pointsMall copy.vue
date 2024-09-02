<template>
  <div class="page">
    <div class="main-title">积分商城</div>
    <div class="wrap">
      <div class="inner">
        <div class="top-info">
          <div class="left-box">
            <div class="img-box">
              <img src="@img/my/jifen-marker.png" alt />
            </div>
            <div class="title">
              <div class="text-1">我的积分</div>
              <div class="text-2">{{ +baseInfo.jifen || 0 }}</div>
            </div>
          </div>
          <div class="right-box">
            <div class="section-group">
              <!-- <div class="section-item" @click="$router.push('/pointsRedemption')">
                <img src="@img/jifen/jifen-2.png" alt />
                <div class="text">我的兑换</div>
              </div> -->

              <div class="section-item" @click="$router.push('/pointsDetail')">
                <img src="@img/jifen/jifen-3.png" alt />
                <div class="text">积分明细</div>
              </div>
            </div>
          </div>
        </div>

        <div class="bottom-info">
          <div class="list-title">可用商品</div>

          <div class="list-wrap">
            <div class="good-list">
              <div class="item" v-for="(item, index) in list_goods" :key="index" @click="mix_to_product(item)">
                <div class="img-box cover">
                  <img :src="item.img" alt />
                </div>
                <div class="info">
                  <div class="title">{{ item.title }}</div>
                  <div class="duihuan-info">
                    <div class="jifen">
                      {{vuex_huobi}}
                      <b>
                        {{ item.priceSale || 0 }}
                      </b>
                      <!-- <span>积分</span> -->
                    </div>

                    <!-- <span class="yidui">已兑 {{ item.order || 0 }}</span> -->

                    <!-- <van-button
                      color="#FF9312"
                      size="small"
                      type="warning"
                      class="btn-enter"
                      @click.stop="onClick_duihuan(item)"
                      >兑换</van-button
                    > -->
                  </div>
                </div>
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
  name: "User",
  components: {},
  data() {
    return {
      qiandao_jifen: 0, //签到积分
      showQiandao: false, //签到弹窗

      list_goods: [],
      pagination: {
        page: 1, //当前页
        pageNum: 20, //每页数量
      }, //分页器
    };
  },
  computed: {
    ...mapState(["baseInfo"]),
  },
  created() {
    this.setView();
  },

  methods: {
    setView() {
      this.$store.dispatch("query_user");

    
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
  },
};
</script>


<style scoped lang="less">
.page {
  .main-title {
    margin-bottom: 20px;
    text-align: left;

    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    line-height: 20px;
    color: #333333;
  }
}
.wrap {
  .inner {
    padding: 0;
    .top-info {
      height: 120px;
      background: url(~@img/my/bg-jifen.png) no-repeat center / cover;
      padding: 0 50px;
      .flex-between();

      .left-box {
        .flex();
        .img-box {
          img {
            width: 61px;
          }
        }
        .title {
          padding-left: 27px;
          .text-1 {
            font-size: 14px;
            font-family: PingFang SC;
            font-weight: 800;
            line-height: 20px;
            color: #ffffff;
          }
          .text-2 {
            font-size: 30px;
            font-family: PingFang SC;
            font-weight: 800;
            line-height: 42px;
            color: #ffffff;
          }
        }
      }
      .right-box {
        .section-group {
          .flex();

          .section-item {
            margin-left: 50px;
            .flex();
            img {
              width: 16px;
              margin-right: 10px;
            }
            .text {
              font-size: 16px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              line-height: 24px;
              color: #ffffff;
              cursor: pointer;
            }
          }
        }
      }
    }
    .bottom-info {
      margin-top: 30px;
      margin-bottom: 50px;
    }
  }
}

.list-title {
  font-size: 14px;
  text-align: left;
}

.good-list {
  .flex();
  flex-wrap:wrap;
  margin-top: 20px;
  text-align: left;
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
      text-align: left;
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
        .flex();

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
