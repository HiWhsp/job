<template>
  <div class="page">
    <div class="main-title">
      <span>领券中心</span>
      <!-- <b @click="$router.push('/mycoupon')">我的优惠券</b> -->
    </div>


    <div class="coupon-container">
      <div class="coupon" v-for="(item, index) in list_yhq" :key="index" v-show="status == 1">
          <div class="coupon-left">
              <img src="@/static/order/coupon-used.png" alt="" class="coupon-img">
              <div class="coupon-left-price">
                <span style="font-size: 14px; display: inline-block; vertical-align: 20px; margin-right: -8px; ">¥</span>
                20
              </div> 
              <div class="coupon-left-text">无门槛优惠券</div>
          </div>
          <div class="coupon-right">
              <div class="coupon-right-title">自营200元无门槛券</div>
              <div class="coupon-right-time" >2020.12.21 11:18 - 2020.12.28 23:59</div>
              <button class="button">立即领取</button>
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
      list_tab: [
        // { title: "全部", status: 0 },
        { title: "未使用", status: 1 },
        { title: "已使用", status: 2 },
        { title: "已过期", status: 3 },
      ],

      list_yhq: Array.from({length: 10}, (_, i) => ({
                id: i+1,
                status: 1, 
                originalPic: "../../static/order/coupon-used.png", 
                vuex_huobi:20,
                jian: "无门槛优惠劵",
                man:"自营20元无门槛劵",
                startTime:"2020.12.21 11:18",
                endTime:"2020.12.28 23:59"
            })),


      pagination: {
        page: 1,
        pageNum: 1000,
      },
    };
  },
  computed: {
    ...mapState(["defaultAvatar"]),
  },
  watch: {
    status(status_curr) {
      this.setView();
    },
  },
  created() {
    this.setView();
  },
  methods: {
    setView() {
      this.$api("users_yhqList", {
        scene: 0,
        ...this.pagination,
      }).then((res) => {
        let { code, data, msg} = res;
        if (code == 200) {
          this.list_yhq = data;
        }
      });
    },

    coupon_pick(item) {
      this.$api("users_yhqLingqu", {
        id: item.id,
      }).then((res) => {
        let { code, data, msg} = res;

        if (code == 200) {
          this.setView();
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
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
      background: #4CA5E4;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }
  }

  .page-ctx {
    min-height: 400px;
    margin-top: 24px;
    padding: 24px 32px 40px 32px;
    background: #fff;
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
    .flex();
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

  .list-box {
    .flex();
    flex-wrap: wrap;

    .item {
      position: relative;
      background: url(~@img/coupon/mycoupon-bg.png) center / cover no-repeat;
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

          &.btn-yilingqu {
            filter: grayscale(1);
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
}

.lingquan {
  .flex();
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
    .flex();
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
          color: #4CA5E4;
        }
        .num {
          font-size: 42px;
          font-family: Microsoft YaHei-Bold, Microsoft YaHei;
          font-weight: bold;
          color: #4CA5E4;
        }
      }

      .tiaojian {
        margin-top: 10px;
        font-size: 12px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        font-weight: 400;
        color: #999999;
        line-height: 28px;
      }
      .shijian {
        font-size: 12px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        font-weight: 400;
        color: #999999;
        line-height: 28px;
      }
      .action {
        margin-top: 30px;
        button {
          width: 127px;
          height: 36px;
          background: #4CA5E4;
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

.coupon-container {
  display: flex;
  flex-wrap: wrap;
  background-color: #fff;
  margin-top: 13px;
  padding: 27px 26px;
  gap: 20px;

    .coupon {
      display: flex;
      width: 49%;
      background-color: #fff;
      justify-content: space-between;
      position: relative;
      //padding: 10px 0;
      box-sizing: border-box;
      border: 1px solid #E6E6E6;
      border-radius: 10px 10px 10px 10px;
    }
    .coupon-left {
        color: #fff;
        //background-color: #ff4400;
        width: 140px;
        height: 128px;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        position: relative;
        
        .coupon-img{
          position: relative;
          width: 100%;
          height: 100%;
        }

        .coupon-left-price {
            font-weight: 400;
            font-size: 30px;
            color: #FFFFFF;
            line-height: 43px;
            text-align: left;
            position: absolute;
            top: 40%;
            left: 50%;
            transform: translate(-50%, -50%);

        }

        .coupon-left-text {
            width: 100%;
            font-weight: 400;
            font-size: 14px;
            color: #FFFFFF;
            line-height: 43px;
            text-align: left;
            position: absolute;
            top: 70%;
            left: 50%;
            transform: translate(-30%, -50%);
        }

    }
        
        .coupon-right {
            flex-grow: 1;
            padding: 0 20px;
            display: flex;
            flex-direction: column;
            justify-content: center;

            .coupon-right-title {
              font-weight: 400;
              font-size: 16px;
              color: #000000;
              line-height: 20px;
              text-align: left;
              font-style: normal;
              text-transform: none;
              margin-bottom: 12px;
            }

            .coupon-right-time {
              font-weight: 400;
              font-size: 14px;
              color: #979797;
              line-height: 16px;
              text-align: left;
              font-style: normal;
              text-transform: none;
              
            }

            .button {
              color: white;
              background: #FF4000;
              border-radius: 4px 4px 4px 4px;
              cursor: pointer;
              width: 94px;
              height: 32px;
              font-weight: 400;
              font-size: 14px;
              color: #FFFFFF;
              line-height: 20px;
              text-align: center;
              font-style: normal;
              text-transform: none;
              margin-top: 16px;
          }

          .coupon-right-state{
            width: 64.72px;
            height: 53.67px;
            margin-left: 302px;

            img{
              width: 100%;
              height: 100%;
            }
          }
        }

        
    }
</style>

<style scoped lang="less" src="@/assets/h5css/user/couponCenter.less"></style>
