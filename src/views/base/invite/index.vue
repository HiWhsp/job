<template>
    <div class="container">
        <div class="top-box">
            <img src="@/assets/img/base/invite/top-box.png" alt="">
        </div>
        <div class="main content">
            <div class="btn-box">
                <div class="pointer btn" :class="{'active': index === 1}" @click="index = 1">我的收益</div>
                <div class="pointer btn" :class="{'active': index === 2}" @click="index = 2">我的好友</div>
            </div>
            <div class="info-box" v-if="index === 1">
                <div class="info">
                    <div class="item">
                        <div class="text">
                            <div class="title">好友注册奖励</div>
                            <div class="subtitle">邀请好友注册并加入会员（注册30天内），双方均可获得<span>5 元优惠券</span>奖励
                            </div>
                        </div>
                        <img src="@/assets/img/base/01/banner6.png" alt="">
                    </div>
                    <div class="item">
                        <div class="text">
                            <div class="title">好友下单奖励</div>
                            <div class="subtitle">好友注册30天内下单（不限量），邀请人可获得订单金额的<span>10%</span>现金奖励
                            </div>
                        </div>
                        <img src="@/assets/img/base/01/banner4.png" alt="">
                    </div>
                </div>
                <div class="process">
                    <p class="title">获得奖励流程</p>
                    <div class="step">
                        <div class="item" v-for="(item, index) in step" :key="index">
                            <img :src="item.img" alt="">
                            <div class="text">
                                <div class="title">{{ item.title }}</div>
                                <div class="subtitle" v-html="item.subtitle"></div>
                            </div>
                        </div>
                    </div>
                    <div class="desc">
                        <div class="item">
                            <div class="title">活动时间</div>
                            <div class="subtitle">长期有效</div>
                        </div>
                        <div class="item">
                            <div class="title">活动人群</div>
                            <div class="subtitle">
                                <p>1. 邀请人需为科学指南针平台注册用户。</p>
                                <p>2.
                                    被邀请人需为科学指南针平台未注册用户，且为科研相关的高校/科研院所/企业/医院人员。</p>
                            </div>
                        </div>
                        <div class="item">
                            <div class="title">活动详情</div>
                            <div class="subtitle">
                                <p>1.
                                    被邀请人通过邀请人所分享的邀请链接注册成功，并在注册后30天内成功开通会员，邀请人和被邀请人均可获得5元现金奖励，可直接提现；</p>
                                <p>2.
                                    被邀请人通过邀请人所分享的邀请链接注册成功，并在注册后30天内下单（不限量），邀请人即可获得订单金额的10%现金奖励（冻结状态）；待被邀请人的订单完成（若使用先享后付服务进行支付还需进行还款），邀请人的订单现金奖励将自动解冻，可直接提现；</p>
                                <p>3. 邀请人可邀请多个人参与活动，每邀请成功1个好友均可获得对应的奖励，奖励上不封顶；</p>
                                <p>4. 邀请人和被邀请人不得为同一人，如发现作</p>
                            </div>
                        </div>
                    </div>

                    <div class="open flex flex-center">立即邀请</div>

                </div>

            </div>
            <div class="info-list" v-if="index === 2"></div>
        </div>
    </div>
</template>

<script>
export default {
    name: "index",

    data() {
        return {
            index: 1,
            step: [
                {
                    title: "邀请好友完成注册",
                    subtitle: '<p>好友需通过您的邀请链接注册，否则邀请奖励无法下发</p>',
                    img: require('@/assets/img/base/invite/1.png')
                }, {
                    title: "好友开通会员（注册后30天内）",
                    subtitle: '<p>双方均可获得<span style="color: #3399FF;">5元优惠券</span>奖励</p>',
                    img: require('@/assets/img/base/invite/2.png')
                }, {
                    title: "邀请好友完成注册",
                    subtitle: '<p>您可获得订单金额的<span style="color: #3399FF;">10%</span>现金奖励（冻结状态）</p>',
                    img: require('@/assets/img/base/invite/3.png')
                }, {
                    title: "邀请好友完成注册",
                    subtitle: '<p>10%现金奖励解冻 <span style="color: #3399FF;">（可提现）</span></p>',
                    img: require('@/assets/img/base/invite/4.png')
                }
            ]
        }
    },

    methods: {},
}
</script>

<style scoped lang="less">
.container {
  background: #F2F6FA;
  padding-bottom: 70px;
}

.top-box {
  height: 350px;

  img {
    height: 100%;
  }
}

.content {
  margin-top: 90px;

  .btn-box {
    display: flex;
    justify-content: end;

    .btn {
      width: 114px;
      height: 34px;
      line-height: 34px;
      background: #fff;
      font-weight: 400;
      font-size: 14px;
      color: @theme;
      text-align: center;
      margin-left: 15px;

      &.active {
        background: @theme;
        color: #fff;
      }
    }
  }

  .info-box {
    .info {
      display: flex;
      justify-content: space-between;
      margin-top: 50px;
      margin-bottom: 70px;

      .item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 680px;
        height: 130px;
        background: #FFFFFF;
        box-shadow: 0px 3px 10px 1px rgba(0, 71, 157, 0.2);
        border-radius: 13px 13px 13px 13px;
        padding: 15px 23px;

        .text {
          .title {
            font-weight: bold;
            font-size: 20px;
            color: #3399FF;
          }

          .subtitle {
            font-weight: 400;
            font-size: 14px;
            color: #333333;
            margin-top: 10px;

            span {
              color: #3399FF;
            }
          }
        }

        img {
          width: 100px;
          height: 100px;
        }
      }
    }

    .process {
      width: 100%;
      height: 1100px;
      padding: 64px 170px;
      background-color: #fff;

      display: flex;
      flex-direction: column;
      align-items: center;

      .title {
        text-align: center;
        font-weight: bold;
        font-size: 22px;
        color: #333333;
      }

      .step {
        margin-top: 60px;
        display: flex;
        flex-wrap: wrap;

        .item {
          width: 530px;
          display: flex;
          align-items: center;

          img {
            width: 80px;
            height: 80px;
            margin-right: 15px;
          }

          .text {
            .title {
              text-align: left;
              font-weight: bold;
              font-size: 20px;
              color: #333333;
            }

            .subtitle {
              margin-top: 10px;
              font-weight: 400;
              font-size: 14px;
              color: #333333;
            }
          }
        }
      }

      .desc {
        margin-top: 60px;

        .item {
          margin-bottom: 50px;

          .title {
            display: flex;
            align-items: center;
            font-weight: bold;
            font-size: 20px;
            color: #333333;

            &:before {
              content: '';
              display: inline-block;
              width: 4px;
              height: 20px;
              background: linear-gradient(153deg, #00479D 0%, #3095FA 100%, #3399FF 100%);
              border-radius: 2px;
              margin-right: 10px;
            }
          }
        }

        .subtitle {
          margin-top: 30px;

          p {
            font-weight: 400;
            font-size: 14px;
            color: #333333;
            line-height: 28px;
          }
        }
      }

      .open {
        cursor: pointer;
        width: 170px;
        height: 45px;
        line-height: 45px;
        background: linear-gradient(90deg, #00479D 0%, #3399FF 100%);
        border-radius: 3px 3px 3px 3px;
        text-align: center;
        color: #fff;
      }
    }
  }
}
</style>