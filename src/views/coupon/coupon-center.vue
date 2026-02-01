<template>
  <div class="page">
    <!-- 顶部 Banner -->
    <div class="banner-box">
      <div class="poster-box">
        <!-- <img :src="banner_poster" alt="" /> -->
        <el-carousel trigger="click" height="100%">
          <el-carousel-item v-for="(item, index) in banner_list" :key="index">
            <el-image :src="item.image"> </el-image>
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>

    <div class="page-ctx">
      <div class="inner">
        <!-- <div class="yhq-list" v-if="list_yhq.length">
          <div class="yhq-item" v-for="(item, index) in list_yhq" :key="index">
            <div class="yhq-left">
              <img :src="item.originalPic" alt="" />
            </div>
            <div class="yhq-right">
              <div class="money">
                <div class="currency">{{ vuex_huobi }}</div>
                <div class="num">{{ item.money }}</div>
              </div>
              <div class="tiaojian">使用条件： 满{{ item.man }}可用</div>
              <div class="shijian">
                有效时间： {{ item.startTime }} - {{ item.endTime }}
              </div>
              <div class="action">
                <button class="btn-ripple btn-pick btn-lingqu" v-if="item.if_ke_lingqu == 1" @click="coupon_pick(item)">
                  立即领取
                </button>
                <button class="btn-ripple btn-pick btn-yilingqu" disabled v-else>
                  已领取
                </button>
              </div>
            </div>
          </div>
        </div> -->

        <div class="coupon-grid">
          <div
            class="coupon-item"
            :class="{ disabled: item.if_ke_lingqu != 1 }"
            v-for="(item, index) in list_yhq"
            :key="index"
          >
            <div class="coupon-content">
              <div class="coupon-left">
                <div class="flex" style="align-items: flex-end">
                  <div class="coupon-amount">
                    <span class="currency">{{ vuex_huobi }}</span>
                    <span class="amount">{{ item.money }}</span>
                  </div>
                  <div class="coupon-condition">
                    <span class="condition-tag">满{{ item.man }}元可用</span>
                  </div>
                </div>

                <div class="coupon-validity">
                  有效期{{ item.startTime }}至{{ item.endTime }}
                </div>
                <div class="coupon-scope">全平台可用</div>
              </div>
              <div class="coupon-right">
                <button
                  class="claim-btn"
                  v-if="item.if_ke_lingqu == 1"
                  @click="do_coupon_pick(item)"
                >
                  立即领取
                </button>
                <button class="claim-btn disabled" v-else>已经抢完</button>
              </div>
            </div>
          </div>
        </div>

        <el-empty
          v-if="!list_yhq.length"
          description="no coupons available"
        ></el-empty>

        <!-- <div class="bg-box">
          <img src="@img/my/bg-coupon.png" alt="" />
        </div> -->

        <!-- <div class="tab-box">
        <div
          class="tab-item"
          v-for="(item, index) in list_tab"
          :key="index"
          @click="status = item.status"
          :class="status == item.status ? 'active' : ''"
        >
          {{ item.title }}
        </div>
      </div> -->

        <!-- <el-empty v-if="!list_yhq.length" description="暂无优惠券信息..."></el-empty> -->

        <!-- <div class="lingquan" @click="$router.push('/mycoupon')">
        <img src="@img/other/mycoupon-to-center.png" alt="" />
        <span>我的优惠券 ></span>
      </div> -->
      <div class="page-box" v-if="count">
          <el-pagination
          background
          layout="prev, pager, next"
          :total="count"
          :current-page="pagination.page"
          :page-size="pagination.pageNum"
          @current-change="mix_current_change"
        >
        </el-pagination>
      </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "servicePage",
  components: {},
  data() {
    return {
      status: 1,
      //0全部 1未使用 2已使用 3已过期
      list_tab: [
        // { title: "全部", status: 0 },
        // { title: "未使用", status: 1 },
        // { title: "已使用", status: 2 },
        // { title: "已过期", status: 3 },
      ],

      list_yhq: [],

      pagination: {
        page: 1,
        pageNum: 15,
      },
      count: 0,

      // Banner 相关数据
      banner_list: [],
      banner_poster: "",
    };
  },
  computed: {
    // ...mapState([""]),
  },
  created() {
    this.query_banner();
    this.setView();
  },
  methods: {
    query_banner() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "banner_index",
          position: 0,
        },
      }).then((res) => {
        if (res.code == 200) {
          this.banner_list = res.data.filter((it) => it.id == 180)[0].images;

          this.banner_poster = this.banner_list[0].image;
        }
      });
    },
    do_banner_click(item) {
      if (item.url) {
        window.open(item.url, "_blank");
      } else if (item.inventoryId) {
        this.$router.push(
          "/product-detail/" + (item.skuId || item.inventoryId)
        );
      window.open('/product-detail?id='+(item.skuId || item.inventoryId),'__blank','',false)


      }
    },
    setView() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "yhq_list",
          ...this.pagination,
          scene: 0, //0全部 1未使用 2已使用 3已过期
        },
      }).then((res) => {
        if (res.code == 200) {
          let data = res.data;
          this.list_yhq = data.list;
          this.count = data.count;
        }
      });
    },
    do_coupon_pick(item) {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "yhq_lingQu",
          id: item.id,
        },
      }).then((res) => {
        alert(res);
        if (res.code == 200) {
          this.setView();
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
.page-box{
  text-align: center;
  margin-top: 90px;
}
.page {
  text-align: left;
  padding-bottom: 80px;
}

.banner-box {
  position: relative;
  height: 600px;
}

.poster-box {
  /deep/.el-carousel {
    height: 600px;
  }
  img {
    width: 100%;
  }
}

.page {
  .suggest-title {
    padding: 40px 0 43px;
    .block {
      position: relative;
      z-index: 1;
      &::after {
        z-index: -1;
        position: absolute;
        left: -4px;
        bottom: 0;
        content: "";
        width: 128px;
        height: 10px;
        background: #FCB000;
        border-radius: 0px 0px 0px 0px;
      }
    }
    span {
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: bold;
      font-size: 30px;
      color: #1F1F1F;
    }

    img {
      margin: 0 10px;
      width: 22.46px;
    }
  }

  .page-ctx {
    min-height: 400px;
    margin-top: 24px;
    padding: 24px 32px 40px 32px;
  }
}

.inner {
  padding-bottom: 80px;

  .bg-box {
    margin-bottom: 30px;

    img {
      max-width: 100%;
    }
  }

  .tab-box {
    margin-bottom: 30px;
    display: flex;
    align-items: center;

    .tab-item {
      cursor: pointer;
      padding-bottom: 5px;
      border-bottom: 3px solid transparent;
      margin-right: 50px;

      &.active {
        border-bottom: 3px solid #ff9312;
      }
    }
  }

  .coupon-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 53px;
    max-width: 1600px;
    margin: 0 auto;

    @media (max-width: 1600px) {
      grid-template-columns: repeat(3, 1fr);
      gap: 30px;
      justify-items: center;
    }

    @media (max-width: 1100px) {
      grid-template-columns: 1fr;
      gap: 20px;
      justify-items: center;
    }

    .coupon-item {
      position: relative;
      background: url(~@img/coupon/bg.png) center / cover no-repeat;
      width: 494px;
      height: 219px;
      border-radius: 8px;
      // border: 1px solid #7853B2;
      overflow: hidden;

      &.disabled {
        background: url(~@img/coupon/bg-yiguoqi.png) center / cover no-repeat;
      }

      .coupon-content {
        display: flex;
        height: 100%;
        position: relative;

        .coupon-left {
          flex: 1;
          padding: 35px;
          display: flex;
          flex-direction: column;
          justify-content: center;

          .coupon-amount {
            display: flex;
            align-items: baseline;
            margin-bottom: 15px;

            .currency {
              font-size: 32px;
              font-weight: bold;
              color: #7853b2;
              margin-right: 4px;
            }

            .amount {
              font-size: 66px;
              font-weight: bold;
              color: #7853b2;
            }
          }

          .coupon-condition {
            margin-bottom: 32px;

            .condition-tag {
              margin-left: 16px;
              display: inline-block;
              background: #FCB000;
              color: #fff;
              font-size: 14px;
              padding: 2px 5px;
              border-radius: 4px;
            }
          }

          .coupon-validity {
            font-size: 16px;
            color: #1F1F1F;
            margin-bottom: 10px;
          }

          .coupon-scope {
            font-size: 16px;
            color: #1F1F1F;
          }
        }

        .coupon-right {
          width: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
          // background: #7853b2;
          position: relative;

          // &::before {
          //   content: '';
          //   position: absolute;
          //   left: -8px;
          //   top: 50%;
          //   transform: translateY(-50%);
          //   width: 0;
          //   height: 0;
          //   border-top: 8px solid transparent;
          //   border-bottom: 8px solid transparent;
          //   border-right: 8px solid #7853b2;
          // }

          .claim-btn {
            background: transparent;
            border: none;
            color: #fff;
            font-size: 26px;
            font-weight: 500;
            padding: 12px 16px;
            border-radius: 4px;
            cursor: pointer;
            text-align: center;
            line-height: 1.2;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            writing-mode: vertical-rl;
            text-orientation: upright;
            letter-spacing: 3px;

            &.disabled {
              // color: #ccc;
              cursor: not-allowed;
            }
          }
        }
      }

      &.disabled {
        .coupon-left {
          .coupon-amount {
            .currency,
            .amount {
              color: #ccc;
            }
          }

          .coupon-condition {
            .condition-tag {
              background: #ddd;
              color: #999;
            }
          }

          .coupon-validity,
          .coupon-scope {
            color: #ccc;
          }
        }

        .coupon-right {
          background: #ddd;

          &::before {
            border-right-color: #ddd;
          }

          .claim-btn {
            color: #999;
            writing-mode: vertical-rl;
            text-orientation: upright;
            letter-spacing: 3px;
          }
        }
      }
    }
  }
}

.lingquan {
  display: flex;
  align-items: center;
  cursor: pointer;
  width: fit-content;
  cursor: pointer;

  img {
    width: 25px;
  }

  span {
    margin-left: 10px;
    font-size: 16px;
    font-family: PingFang SC;
    font-weight: 400;
    line-height: 36px;
    color: #eb5d53;
  }
}

.yhq-list {
  .yhq-item {
    display: flex;
    align-items: center;
    margin-bottom: 30px;

    .yhq-left {
      width: 786px;
      height: 252px;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .yhq-right {
      flex: 1;
      height: 252px;
      padding: 20px;
      background: #f9f9f9;

      .money {
        display: flex;
        align-items: flex-start;

        .currency {
          font-size: 42px;
          font-family: Microsoft YaHei-Bold, Microsoft YaHei;
          font-weight: bold;
          color: #7853b2;
        }

        .num {
          font-size: 42px;
          font-family: Microsoft YaHei-Bold, Microsoft YaHei;
          font-weight: bold;
          color: #7853b2;
        }
      }

      .tiaojian {
        margin-top: 10px;
        font-size: 12px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        font-weight: 400;
        color: #505050;
        line-height: 28px;
      }

      .shijian {
        font-size: 12px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        font-weight: 400;
        color: #505050;
        line-height: 28px;
      }

      .action {
        margin-top: 30px;

        button {
          width: 127px;
          height: 36px;
          background: #7853b2;
          border-radius: 4px 4px 4px 4px;
          font-size: 14px;
          font-family: Microsoft YaHei-Regular, Microsoft YaHei;
          font-weight: 400;
          color: #ffffff;

          &:disabled {
            background: #aaa;
            cursor: not-allowed;
          }
        }
      }
    }
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/user/couponCenter.less"></style>
