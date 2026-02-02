<template>
  <div class="page">
    <!-- 顶部 Banner -->
    <div class="banner-box">
      <div class="poster-box">
        <!-- <img :src="banner_poster" alt="" /> -->
        <el-carousel trigger="click" height="100%">
          <el-carousel-item v-for="(item, index) in banner_list" :key="index">
            <el-image :src="item.image"></el-image>
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>

    <div class="page-ctx">
      <div class="inner">
        <div class="coupon-grid">
          <div
            class="coupon-item"
            :class="{ disabled: item.if_ke_lingqu != 1 }"
            v-for="(item, index) in list_yhq"
            :key="index"
          >
            <div class="coupon-content">
              <div class="coupon-top">
                <div class="coupon-amount">
                  <span class="currency">$</span>
                  <span class="amount">{{ item.money }}</span>
                </div>
              </div>
              <div class="coupon-bottom">
                <div class="coupon-condition">
                  <span class="condition-tag">Orders over ${{ item.man }}</span>
                </div>

                <div class="coupon-validity">Expires {{ item.endTime }}</div>
                <button
                  class="claim-btn"
                  v-if="item.if_ke_lingqu == 1"
                  @click="do_coupon_pick(item)"
                >CLAIM NOW</button>
                <button class="claim-btn disabled" v-else>CLAIM ENDED</button>
              </div>
            </div>
          </div>
        </div>

        <el-empty v-if="!list_yhq.length" description="no coupons available"></el-empty>
        <div class="page-box" v-if="count">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="count"
            :current-page="pagination.page"
            :page-size="pagination.pageNum"
            @current-change="mix_current_change"
          ></el-pagination>
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
        pageNum: 15
      },
      count: 0,

      // Banner 相关数据
      banner_list: [],
      banner_poster: ""
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
          position: 0
        }
      }).then(res => {
        if (res.code == 200) {
          this.banner_list = res.data.filter(it => it.id == 180)[0].images;

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
        window.open(
          "/product-detail?id=" + (item.skuId || item.inventoryId),
          "__blank",
          "",
          false
        );
      }
    },
    setView() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "yhq_list",
          ...this.pagination,
          scene: 0 //0全部 1未使用 2已使用 3已过期
        }
      }).then(res => {
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
          id: item.id
        }
      }).then(res => {
        if (res.code == 200) {
          this.$message.success("Successfully received");
          this.setView();
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
.page-box {
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
        background: #fcb000;
        border-radius: 0px 0px 0px 0px;
      }
    }
    span {
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: bold;
      font-size: 30px;
      color: #1f1f1f;
    }

    img {
      margin: 0 10px;
      width: 22.46px;
    }
  }

  .page-ctx {
    min-height: 400px;
    margin-top: 68px;
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
    grid-template-columns: repeat(5, 1fr);
    gap: 53px;
    max-width: 1600px;
    margin: 0 auto;
    .coupon-item {
      position: relative;
      background-image: url(~@img/coupon/bg.png);
      background-size: 100% 100%;
      background-repeat: no-repeat;
      height: 245px;
      width: 252px;
      overflow: hidden;

      &.disabled {
        background-image: url(~@img/coupon/bg-yiguoqi.png);
        background-size: 100% 100%;
        background-repeat: no-repeat;
      }

      .coupon-content {
        display: flex;
        flex-direction: column;
        height: 100%;
        position: relative;
        .coupon-top {
          height: 93px;
          display: flex;
          align-items: center;
          justify-content: center;
          .coupon-amount {
            .currency {
              font-family: Poppins, Poppins;
              font-weight: 600;
              font-size: 30px;
              color: #ffffff;
              line-height: 18px;
            }
            .amount {
              font-family: Poppins, Poppins;
              font-weight: 600;
              font-size: 40px;
              color: #ffffff;
              line-height: 18px;
            }
          }
        }
        .coupon-bottom {
          padding: 10px 18px;
          display: flex;
          flex-direction: column;
          align-items: center;
          .coupon-condition {
            width: 100%;
            text-align: left;
            .condition-tag {
              font-size: 18px;
              color: #00306b;
              line-height: 30px;
            }
          }
          .coupon-validity {
            width: 100%;
            text-align: left;
            font-size: 16px;
            color: #5e5e5e;
            line-height: 30px;
          }
          .claim-btn {
            margin-top: 28px;
            width: 131px;
            height: 39px;
            line-height: 39px;
            text-align: center;
            background: linear-gradient(90deg, #7ab6ff 0%, #2170cf 100%);
            border-radius: 5px;

            font-family: Poppins, Poppins;
            font-weight: 600;
            font-size: 16px;
            color: #ffffff;

            &.disabled {
              background: #ddd;
              cursor: not-allowed;
            }
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
