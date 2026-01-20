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
            >
              {{ item.title }}
            </div>
          </div>

          <div class="lingquan" @click="$router.push('/coupon-center')">
            <img src="@img/other/mycoupon-to-center.png" alt="" class="coupon" />
            <span>Enter the coupon center</span>
          </div>
        </div>

        <div class="ctx-box">
          <!-- <div class="yhq-list" v-if="list_yhq.length">
            <div class="yhq-item-box" v-for="(item, index) in list_yhq" :key="index">
              <img v-if="item.status == 1" src="@img/coupon/yishiyong.png" alt="" class="used-img" />
              <img v-if="item.status == 2" src="@img/coupon/yiguoqi.png" alt="" class="used-img" />

              <div class="yhq-item" :class="{ used: item.status == 1 || item.status == 2 }">
                <div class="yhq-left">
                  <img :src="item.originalPic" alt="" />
                </div>
                <div class="yhq-right">
                  <div class="money">
                    <div class="currency">{{ vuex_huobi }}</div>
                    <div class="num">{{ item.jian }}</div>
                  </div>
                  <div class="tiaojian">使用条件： 满{{ item.man }}可用</div>
                  <div class="shijian">有效时间： {{ item.startTime }} - {{ item.endTime }}</div>
                  <div class="action">
                    <button v-if="status == 1" class="btn-ripple btn-pick btn-lingqu"
                      @click="coupon_use(item)">立即使用</button>
                  </div>
                </div>
              </div>
            </div>
          </div> -->

          <div class="coupon-grid">
            <div
              class="coupon-card"
              :class="'state-' + item.status"
              v-for="(item, index) in list_yhq"
              :key="index"
            >
              <!-- 上方：优惠券价值区域 -->
              <div class="coupon-top">
                <div class="coupon-label">COUPON</div>
                <div class="coupon-main">
                  <div class="coupon-value">
                    <div class="currency">{{ vuex_huobi }}</div>
                    <div class="amount">{{ item.jian }}</div>
                  </div>
                  <div class="coupon-condition">Orders Over {{ vuex_huobi }}{{ item.man }}</div>
                  <div class="validity-period">Expires {{ item.endTime }}</div>
                </div>
              </div>

              <!-- 状态标识 -->
              <div class="status-overlay" v-if="item.status != 0">
                <img
                  v-if="item.status == 1"
                  src="@img/coupon/yishiyong.png"
                  alt="已使用"
                />
                <img
                  v-if="item.status == 2"
                  src="@img/coupon/yiguoqi.png"
                  alt="已过期"
                />
              </div>

            </div>
          </div>

          <el-empty
            v-if="!list_yhq.length"
            description="暂无数据..."
          ></el-empty>
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
        value: 0,
      },
      // 0全部 1未使用 2已使用 3已过期
      tabList: [
        { title: "All Coupon", value: 0 },
        { title: "Not used", value: 1 },
        { title: "Used", value: 2 },
        { title: "Expired", value: 3 },
      ],

      list_yhq: [],
    };
  },
  computed: {
    ...mapState([""]),
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
          scene: this.tabSelect.value, //0全部 1未使用 2已使用 3已过期
        },
      }).then((res) => {
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
    },
  },
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
  background: #ffffff;border: 1px solid #D6D6D6;
border-radius: 4px 4px 4px 4px;
  overflow: hidden; 
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  // 上方：优惠券价值区域
  .coupon-top {
    position: relative;
    height: 124px;
    padding: 16px 16px 14px 16px;
    background: #2f7de1;
    color: #fff;
    display: flex;
    gap: 14px;

    // 右侧锯齿/打孔效果
    &::after {
      content: "";
      position: absolute;
      top: 0;
      right: -10px;
      width: 20px;
      height: 100%;
      background:
        radial-gradient(circle at 10px 10px, transparent 9px, #ffffff 10px) 0 0/20px 20px repeat-y;
      pointer-events: none;
    }

    .coupon-label {
      width: 34px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      letter-spacing: 1px;
      opacity: 0.65;
      writing-mode: vertical-rl;
      transform: rotate(180deg);
      user-select: none;
    }

    .coupon-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 8px;
    }

    .coupon-value {
      display: flex;
      align-items: baseline;
      gap: 6px;

      .currency {
        font-size: 18px;
        font-weight: 600;
      }

      .amount {
        font-size: 36px;
        font-weight: 800;
        line-height: 1;
      }
    }

    .coupon-condition {
      font-size: 14px;
      font-weight: 600;
      opacity: 0.95;
    }

    .validity-period {
      font-size: 12px;
      opacity: 0.85;
    }
  }

  // 状态覆盖层
  .status-overlay {
    position: absolute; 
    right: 5px;
    bottom: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.8);
    z-index: 10;

    img {
      width: 80px;
      height: 80px;
      object-fit: contain;
    }
  }

   // 不同状态的样式
   &.state-1 {
     opacity: 0.6;
     filter: grayscale(0.3);
     .coupon-top{
      background: #bdbdbd;
      color: #fff;
     }
   }

   &.state-2 {
     opacity: 0.6;
     filter: grayscale(0.3);
     
     .coupon-top {
       background: #f0f0f0;
       color: #ffffff;
     }
   }

   &.state-3 {
     opacity: 0.6;
     filter: grayscale(0.3);
     
     .coupon-top {
       background: #f0f0f0;
       color: #ffffff;
     }
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
