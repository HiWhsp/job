<template>
  <div class="page">
    <div class="page-title">
      <img src="@img/my/nav-2.png" alt="" />
      <span>我的优惠券</span>
      <!-- <b @click="$router.push('/coupon')">领券中心</b> -->
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
            <!-- <img src="@img/other/mycoupon-to-center.png" alt="" class="coupon" /> -->
            <span>进入领券中心 </span>
            <img src="@img/common/right.png" alt="" class="arrow" />
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
                <div class="flex">
                  <div class="coupon-value">
                    <div class="currency">{{ vuex_huobi }}</div>
                    <div class="amount">{{ item.jian }}</div>
                  </div>
                  <div class="coupon-condition">满{{ item.man }}元可用</div>
                </div>
                <div class="validity-period">
                  有效期{{ item.startTime }}至{{ item.endTime }}
                </div>
              </div>

              <!-- 下方：使用规则和按钮区域 -->
              <div class="coupon-bottom">
                <div class="usage-rules">
                  <div class="rules-title">使用规则</div>
                  <div class="rules-list">
                    <div class="rule-item">1. 买部分品类活动商品</div>
                    <div class="rule-item">2. 全平台可用</div>
                    <div class="rule-item">3. 不可叠加</div>
                  </div>
                </div>
                <div class="coupon-action">
                  <button
                  v-if="item.status == 0"
                    class="use-btn"
                    :disabled="item.status != 0"
                    @click="do_coupon_use(item)"
                  >
                    立即使用
                  </button>
                </div>
              </div>

              <!-- 状态标识 -->
              <div class="status-overlay" v-if="item.status != 0">
                <img
                  v-if="item.status == 1"
                  src="@img/coupon/yiguoqi.png"
                  alt="已过期"
                />
                <img
                  v-if="item.status == 2"
                  src="@img/coupon/yishiyong.png"
                  alt="已使用"
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
        title: "待使用",
        value: 1,
      },
      // 0全部 1未使用 2已使用 3已过期
      tabList: [
        // { title: "全部", status: 0 },
        { title: "待使用", value: 1 },
        { title: "已使用", value: 2 },
        { title: "已过期", value: 3 },
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
    height: 56px;
    line-height: 56px;
    background: #ffffff;
    font-size: 16px;
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
  position: relative;
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
      color: #1F1F1F;
      border-bottom: 2px solid transparent;
      transition: all 0.3s ease;

      &:hover {
        color: #7853b2;
      }

      &.active {
        color: #7853b2;
        font-weight: 500;
        border-bottom-color: #7853b2;
      }
    }
  }

  .lingquan {
    position: absolute;
    right: 0;
    display: flex;
    align-items: center;
    cursor: pointer;
    width: fit-content;

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
      color: #333;
    }
  }
}

// 优惠券网格布局
.coupon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px 0;
}

// 优惠券卡片样式
.coupon-card {
  position: relative;
  display: flex;
  flex-direction: column;
  background: #ffffff;border: 1px solid #D6D6D6;
border-radius: 4px 4px 4px 4px;
  overflow: hidden; 
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  // 上方：优惠券价值区域
  .coupon-top {
    background: #f7efff;
    padding: 20px;
    color: #7853b2; 
    border-radius: 3px 3px 0px 0px;

    .coupon-value {
      display: flex;
      align-items: baseline;
      justify-content: center;
      margin-bottom: 8px;

      .currency {
        font-size: 24px;
        font-weight: 500;
        margin-right: 4px;
      }

      .amount {
        font-size: 48px;
        font-weight: bold;
        line-height: 1;
      }
    }

    .coupon-condition {
      font-size: 14px;
      margin-bottom: 8px;
      opacity: 0.9;
      line-height: 1.3;
      margin-left: 25px;
    }

    .validity-period {
      font-size: 12px;
      opacity: 0.8;
      line-height: 1.3;
    }
  }

  // 下方：使用规则和按钮区域
  .coupon-bottom {
    padding: 20px;
    display: flex;
    flex-direction: column;
    flex: 1;

    .usage-rules {
      flex: 1;
      margin-bottom: 20px;

      .rules-title {
        font-size: 14px;
        font-weight: 500;
        color: #505050;
        margin-bottom: 12px;
      }

      .rules-list {
        .rule-item {
          font-size: 12px;
          color: #505050;
          line-height: 1.6;
          margin-bottom: 4px;
        }
      }
    }

    .coupon-action {
      .use-btn {
        width: 104px;
        height: 32px;
        background: #7853b2;
        color: #ffffff;
        border: none;
        border-radius: 4px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover:not(:disabled) {
          background: #6b46a3;
        }

        &:disabled {
          background: #cccccc;
          cursor: not-allowed;
          opacity: 0.6;
        }
      }
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
      background: #C2C2C2;
      color: #fff;
     }
   }

   &.state-2 {
     opacity: 0.6;
     filter: grayscale(0.3);
     
     .coupon-top {
       background: #f5f5f5; /* 已使用状态：浅灰色背景 */
       color: #505050; /* 已使用状态：灰色文字 */
     }
   }

   &.state-3 {
     opacity: 0.6;
     filter: grayscale(0.3);
     
     .coupon-top {
       background: #f5f5f5; /* 已过期状态：浅灰色背景 */
       color: #505050; /* 已过期状态：灰色文字 */
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
