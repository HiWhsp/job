<script>
export default {
  name: "index",
  data() {
    return {
      list_yhq: [],
    }
  },
  mounted() {
    this.setView()
  },
  methods: {
    setView() {
      this.$api({
        url: 'coupon_list',
        method: 'post',
      }).then(res => {
        if (res.code === 200) {
          this.list_yhq = res.data
        }
      })
    },
    coupon_pick(item) {
      this.$api({
        url: 'collect_coupon',
        method: 'post',
        data: {
          couponId: item.id
        },
        success: res => {
          if (res.code === 200) {
            this.$message.success('领取成功')
            this.setView()
          }
        }
      })
    },
    goUrl(item) {
      this.$router.push(item.url)
    }
  }
}
</script>

<template>
  <div class="container">
    <div class="top-box">
      <img src="@/assets/img/base/coupon/bg.png" alt="">
    </div>
    <div class="content main">
      <div class="to-box pointer" @click="goUrl({url: '/myCoupon'})">我的优惠券</div>
      <div class="yhq-list" v-if="list_yhq.length">
        <div class="yhq-item" v-for="(item, index) in list_yhq" :key="index">
          <div class="yhq-left">
            <div class="money">
              <div class="currency">{{ vuex_huobi }}</div>
              <div class="num">{{ item.money }}</div>
            </div>
            <div class="tiaojian" v-if="item.dis_type == 1">满{{ item.min_money }}可用</div>
            <div class="tiaojian" v-if="item.dis_type == 2">优惠金额 {{ item.money }}</div>
          </div>
          <div class="yhq-right">
            <div class="tiaojian">{{ item.title }}</div>
            <div class="shijian">
              {{ item.start_time }} - {{ item.end_time }}
            </div>
            <div class="action">
              <button
                  class="btn-ripple btn-pick btn-lingqu"
                  v-if="item.is_get == 0"
                  @click="coupon_pick(item)"
              >
                立即领取
              </button>
              <button class="btn-ripple btn-pick btn-yilingqu" disabled v-else>
                已领取
              </button>
            </div>
          </div>
        </div>
      </div>

      <el-empty v-if="!list_yhq.length" description="暂无优惠券信息..."></el-empty>
    </div>
  </div>
</template>

<style scoped lang="less">
.container {
  background: #F2F6FA;
  padding-bottom: 60px;

  .top-box {
    height: 350px;

    img {
      width: 100%;
      height: 100%;
    }
  }
}

.content {
  display: flex;
  flex-direction: column;
  align-items: end;

  .to-box {
    width: 114px;
    height: 34px;
    line-height: 34px;
    background: #00479D;
    font-weight: 400;
    font-size: 14px;
    color: #FFFFFF;
    text-align: center;
    margin: 90px 0 20px;
  }

  .yhq-list {
    .flex();
    position: relative;
    flex-wrap: wrap;
    width: 100%;

    .yhq-item {
      .flex();
      width: 420px;
      height: 128px;
      background: #FFFFFF;
      border-radius: 10px;
      border: 1px solid #E6E6E6;
      margin-bottom: 20px;
      margin-right: 69px;

      &:nth-child(3n) {
        margin-right: 0;
      }

      .yhq-left {
        width: 140px;
        height: 128px;
        background-image: url("~@/assets/img/base/coupon/coupon-used.png");
        background-size: 100% 100%;
        background-repeat: no-repeat;
        .flex();
        flex-direction: column;
        justify-content: center;

        img {
          width: 140px;
          height: 128px;
          position: absolute;
          bottom: 0;
        }

        .money {
          .flex();
          justify-content: center;

          .currency {
            font-size: 30px;
            font-weight: bold;
            color: #fff;
          }

          .num {
            font-size: 30px;
            font-weight: bold;
            color: #fff;
          }
        }

        .tiaojian {
          color: #fff;
        }
      }

      .yhq-right {
        flex: 1;
        width: 280px;
        height: 128px;
        padding: 10px;

        .tiaojian {
          font-size: 12px;
          font-family: Microsoft YaHei-Regular, Microsoft YaHei;
          font-weight: 400;
          color: #000;
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
          margin-top: 15px;
          text-align: right;

          button {
            width: 94px;
            height: 32px;
            background: #FF4000;
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

  .el-empty {
    width: 100%;
  }
}

</style>
