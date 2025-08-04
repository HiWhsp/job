<template>
  <div class="page">
    <div class="page-title">
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

          <div class="list-box">
            <div
              class="item"
              :class="'state-' + item.status"
              v-for="(item, index) in list_yhq"
              :key="index"
            >
              <div class="info">
                <div class="title">
                  <span class="huobi">{{ vuex_huobi }} </span>
                  <span class="num">{{ item.jian }}</span>
                </div>
                <div class="tiaojian">
                  <!-- 使用条件： -->
                  满{{ item.man }}可用
                </div>
                <div class="shijian">
                  <!-- 有效时间： -->
                  {{ item.startTime }}-{{ item.endTime }}
                </div>
              </div>
              <div class="action">
                <button
                  :disabled="item.status != 0"
                  @click="do_coupon_use(item)"
                >
                  立即使用
                </button>
              </div>
              <div class="guoqi">
                <!-- <img v-if="item.status == 0" src="@img/coupon/jijiangguoqi.png" alt /> -->
                <img
                  v-if="item.status == 1"
                  src="@img/coupon/yiguoqi.png"
                  alt
                />
                <img
                  v-if="item.status == 2"
                  src="@img/coupon/yishiyong.png"
                  alt
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
        title: "未使用",
        value: 1,
      },
      // 0全部 1未使用 2已使用 3已过期
      tabList: [
        // { title: "全部", status: 0 },
        { title: "未使用", value: 1 },
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
    justify-content: space-between;
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
      background: #3b64fc;
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
    // border-bottom: 1px solid #eee;

    display: flex;
    align-items: center;

    .tab-item {
      cursor: pointer;
      padding-bottom: 10px;
      border-bottom: 3px solid transparent;
      margin-right: 60px;

      font-size: 14px;
      font-family: sans-serif;
      font-weight: 400;
      color: #333333;

      &.active {
        border-bottom: 3px solid #3b64fc;
        font-weight: bold;
        color: #3b64fc;
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

.list-box {
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  .item {
    position: relative;
    background: url(~@img/other/mycoupon-bg.png) center / cover no-repeat;
    width: 238px;
    height: 234px;
    padding: 15px;
    margin-right: 10px;
    margin-bottom: 20px;
    color: #fff;

    &.state-2 {
      background: url(~@img/coupon/bg-yishiyong.png) center / cover no-repeat;
    }

    &.state-3 {
      background: url(~@img/coupon/bg-yiguoqi.png) center / cover no-repeat;
    }

    &:nth-child(4n) {
      margin-right: 0;
    }

    .info {
      font-size: 12px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      line-height: 20px;
      color: #ffffff;

      .title {
        margin-top: 25px;

        .huobi {
          font-size: 24px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          line-height: 20px;
          color: #ffffff;
        }

        .num {
          font-size: 36px;
          font-family: Microsoft YaHei;
          font-weight: bold;
          line-height: 20px;
          color: #ffffff;
        }
      }

      .tiaojian {
        margin: 20px 0 10px;
      }

      .shijian {
      }
    }

    .action {
      margin-top: 43px;
      text-align: center;

      button {
        width: 122px;
        height: 34px;
        border: 1px solid #ff3d00;
        background: transparent;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 20px;
        color: #ff3d00;
        border-radius: 17px;

        // &:hover {
        //   background: #ff3d00;
        //   color: #fff;
        // }

        &:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
      }
    }

    .guoqi {
      position: absolute;
      bottom: 0;
      right: 0;

      img {
        width: 60px;
        vertical-align: bottom;
      }
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
          color: #3b64fc;
        }

        .num {
          font-size: 42px;
          font-family: Microsoft YaHei-Bold, Microsoft YaHei;
          font-weight: bold;
          color: #3b64fc;
        }
      }

      .tiaojian {
        margin-top: 10px;
        font-size: 12px;
        font-family: sans-serif;
        font-weight: 400;
        color: #999999;
        line-height: 28px;
      }

      .shijian {
        font-size: 12px;
        font-family: sans-serif;
        font-weight: 400;
        color: #999999;
        line-height: 28px;
      }

      .action {
        margin-top: 30px;

        button {
          width: 127px;
          height: 36px;
          background: #3b64fc;
          border-radius: 4px 4px 4px 4px;
          font-size: 14px;
          font-family: sans-serif;
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
