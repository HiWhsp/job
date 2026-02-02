<template>
  <div class="page">
    <div class="page-title">
      <span>MY COUPONS</span>
    </div>

    <div class="page-ctx">
      <div class="inner">
        <div class="tab-wrap">
          <div class="tab-box">
            <div
              class="tab-item"
              v-for="(item, index) in tabList"
              :key="index"
              @click="do_tab_toggle(item)"
              :class="tabSelect.value == item.value ? 'active' : ''"
            >{{ item.title }}</div>
          </div>

          <div class="lingquan" @click="$router.push('/coupon-center')">
            <img src="@img/other/mycoupon-to-center.png" alt class="coupon" />
            <span>Enter the coupon center</span>
          </div>
        </div>

        <div class="ctx-box">
          <div class="coupon-grid">
            <div
              class="coupon-card"
              :class="'state-' + item.status"
              v-for="(item, index) in list_yhq"
              :key="index"
            >
              <!-- 上方：优惠券价值区域 -->
              <div class="coupon-top">
                <div class="currency">$</div>
                <div class="amount">{{ item.jian }}</div>
              </div>
              <div class="coupon-bottom">
                <div class="coupon-condition">Orders Over ${{ item.man }}</div>
                <div class="validity-period">Expires {{ item.endTime }}</div>
              </div>

              <!-- 状态标识 -->
              <!-- <div class="status-overlay" v-if="item.status != 0">
                <img v-if="item.status == 1" src="@img/coupon/yishiyong.png" alt="已使用" />
                <img v-if="item.status == 2" src="@img/coupon/yiguoqi.png" alt="已过期" />
              </div>-->
            </div>
          </div>

          <el-empty v-if="!list_yhq.length" description="暂无数据..."></el-empty>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "coupon-list",
  components: {},
  data() {
    return {
      tabSelect: {
        title: "All Coupon",
        value: 0
      },
      // 0全部 1未使用 2已使用 3已过期
      tabList: [
        { title: "All Coupon", value: 0 },
        { title: "Not used", value: 1 },
        { title: "Used", value: 2 },
        { title: "Expired", value: 3 }
      ],

      list_yhq: []
    };
  },
  computed: {
    ...mapState([""])
  },
  watch: {},
  created() {
    this.setView();
  },
  methods: {
    setView() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "yhq_myList",
          ...this.pagination,
          scene: this.tabSelect.value //0全部 1未使用 2已使用 3已过期
        }
      }).then(res => {
        if (res.code == 200) {
          let data = res.data;
          this.list_yhq = data.list;
          this.count = data.count;
        }
      });
    },
    do_tab_toggle(item) {
      if (this.tabSelect.value != item.value) {
        this.list_yhq = [];
        this.tabSelect = item;
        this.setView();
      }
    },
    do_coupon_use(item) {
      //console.log("使用优惠券", { ...item });
      // this.$router.push("/product-cates?id=853");
      this.$router.push("/?id=853");
    }
  }
};
</script>


<style scoped lang="less">
.page {
  text-align: left;
  padding-bottom: 80px;

  .page-title {
    display: flex;
    align-items: center;

    padding: 0 32px;
    text-align: left;
    height: 70px;
    line-height: 70px;
    background: #ffffff;
    font-size: 20px;
    font-family: Microsoft YaHei-Bold, Microsoft YaHei;
    font-weight: bold;
    color: #333333;
    img {
      width: 22px;
      margin-right: 10px;
    }

    button {
      min-width: 96px;
      height: 30px;
      line-height: 30px;
      background: #7853b2;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }
  }
}

.page-ctx {
  margin-top: 24px;
  padding: 24px 32px 40px 32px;
  background: #fff;
}

.inner {
  padding-bottom: 80px;
}

.tab-wrap {
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .tab-box {
    flex: 2;
    display: flex;
    align-items: center;

    .tab-item {
      cursor: pointer;
      padding: 12px 24px;
      margin-right: 0;
      font-size: 16px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      font-weight: 400;
      color: #1f1f1f;
      border-bottom: 2px solid transparent;
      transition: all 0.3s ease;

      &:hover {
        color: #ec6a2b;
      }

      &.active {
        color: #ec6a2b;
        font-weight: 600;
        border-bottom-color: #ec6a2b;
      }
    }
  }

  .lingquan {
    display: flex;
    align-items: center;
    cursor: pointer;
    width: fit-content;
    color: #ec6a2b;

    .coupon {
      width: 25px;
    }

    .arrow {
      width: 10px;
      margin-left: 8px;
    }

    span {
      margin-left: 10px;
      font-size: 16px;
      font-family: PingFang SC;
      font-weight: 400;
      line-height: 36px;
      color: #ec6a2b;
    }
  }
}

// 优惠券网格布局
.coupon-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(220px, 1fr));
  gap: 26px;
  padding: 16px 0;
  align-items: start;
}

// 优惠券卡片样式
.coupon-card {
  position: relative;
  display: block;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  overflow: hidden;
  transition: all 0.3s ease;
  width: 252px;
  height: 173px;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  // 上方：优惠券价值区域
  .coupon-top {
    height: 93px;
    display: flex;
    align-items: center;
    justify-content: center;
    .currency {
      font-size: 30px;
      font-family: Poppins, Poppins;
      font-weight: 600;
      color: #ffffff;
    }
    .amount {
      font-size: 40px;
      font-family: Poppins, Poppins;
      font-weight: 600;
      color: #ffffff;
    }
  }

  .coupon-bottom {
    height: 80px;
    padding: 10px 18px 15px 18px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .coupon-condition {
      font-size: 18px;
      font-family: Poppins, Poppins;
      font-weight: 400;
      color: #00306b;
    }
    .validity-period {
      font-size: 16px;
      font-family: Poppins, Poppins;
      font-weight: 400;
      color: #5e5e5e;
    }
  }

  // 不同状态的样式
  &.state-1 {
    background-image: url("~@img/coupon/yhq-bg2.png");
    .coupon-top {
      .currency {
        color: #bababa;
      }
      .amount {
        color: #bababa;
      }
    }
    .coupon-bottom {
      .coupon-condition {
        color: #5e5e5e;
      }
      .validity-period {
        color: #5e5e5e;
      }
    }
  }

  &.state-2 {
    background-image: url("~@img/coupon/yhq-bg2.png");
  }

  &.state-0 {
    background-image: url("~@img/coupon/yhq-bg.png");
  }
}

.yhq-list {
  .yhq-item-box {
    position: relative;
  }

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

.used {
  filter: grayscale(1);
  opacity: 0.3;
}

.used-img {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>




<style scoped lang="less" src="@/assets/h5css/user/myCoupon.less"></style>
