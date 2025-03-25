<script>
export default {
  name: "pay",
  data() {
    return {
      paymentType: '', // 支付方式 1个人预存 2团体预存 3个人信用支付 4团体信用支付 5微信支付 6支付宝
      integral: '', //
      loading: '',
      isShow: true,
      alipay_web: '',
      preOrderDetail: {}, // 订单信息
      priceList: []
    }
  },
  computed: {
    maxHeaderSize() {
      return Math.round(+this.baseInfo.points / +this.vuex_config.point_rate) > 50 ? 50 : Math.round(+this.baseInfo.points / +this.vuex_config.point_rate);
    },
    // 加急服务
    ifUrgent() {
      return (value) => {
        switch (value) {
          case 0 || '0':
            return '不加急'
          case 1 || '1':
            return '三个工作日'
          case 2 || '2':
            return '24小时'
        }
      }
    }
  },
  mounted() {
    this.preOrderDetail = JSON.parse(localStorage.getItem('preOrderDetail')) || {};
    this.setView();
  },
  methods: {
    setView() {
      this.$api({
        url: 'order_pay_info',
        method: 'post',
        data: {
          yf_type: this.preOrderDetail.yf_type || '0',
          tongshebei: this.preOrderDetail.tongshebei || '',
          if_urgent: this.preOrderDetail.if_urgent || '',
          sample_type: this.preOrderDetail.sample_type || '',
          product_id: this.preOrderDetail.product_id || '',
          form: this.filterForm(this.preOrderDetail.form)
        }
      }).then(res => {
        if (res.code === 200) {
          this.priceList = res.data;
        }
      })
    },
    // 支付提交
    submit() {
      if (!this.paymentType) {
        this.$message.error('请选择支付方式');
        return;
      }
      // if (['wx_scan', 'alipay_web'].includes(this.paymentType)) {
      this.loading = this.$loading({
        lock: true,
        text: '订单正在生成中，请稍等！',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      // }
      // 创建订单
      this.$api({
        url: 'order_create',
        method: 'post',
        data: {
          ...this.preOrderDetail,
          form: this.filterForm(this.preOrderDetail.form)
        }
      }).then(res => {
        if (res.code === 200) {
          this.pay(res.data);
        } else {
          this.loading.close();
        }
      }).catch(err => {
        this.loading.close();
      })
    },
    // 支付
    pay(item) {
      this.$api({
        url: 'pay',
        method: 'post',
        data: {
          order_type: 'check_order',
          pay_type: this.paymentType,
          orderno: item.orderno
        }
      }).then(res => {
        if (res.code === 200) {
          this.loading.close();
          this.preOrderDetail.orderno = item.orderno;
          this.preOrderDetail.priceList = this.priceList;
          this.preOrderDetail.payInfo = res.data;
          localStorage.setItem('preOrderDetail', JSON.stringify(this.preOrderDetail));
          this.alipay_web = res.data.qrcode;
          this.goUrl();
        }
      }).catch(err => {
        this.loading.close();
      })
    },
    goUrl() {
      if (this.paymentType == 'wx_scan') {
        this.$router.push({
          path: `/appointment-payment?paymentType=${this.paymentType}`
        })
      } else if (this.paymentType == 'alipay_web') {
        document.forms[0].submit()
      } else {
        this.$router.push({
          path: `/appointment-status?paymentType=${this.paymentType}&status=1`
        })
      }
    },
    toURL(item) {
      this.$router.push(item.url);
    }
  }
}
</script>

<template>
  <div class="container main">
    <div class="title">下单：{{ preOrderDetail.title }}</div>

    <div class="content">
      <div class="section">
        <div class="section-title">费用明细</div>
        <div class="section-ctx">
          <div class="item">
            <div class="item-title">预计金额 <span>¥{{ priceList.total }}</span></div>
            <div class="item-val" v-for="(item, index) in priceList.data" :key="index">
              <p><span>{{ item.sample_title }}</span><span>样品数量：{{ item.num }}</span></p>
              <p>¥{{ item.unit_price }} * {{ item.num }}</p>
            </div>
            <div class="item-val">
              <p>加急服务</p>
              <p>{{ priceList.urgent_txt || '不加急' }}</p>
            </div>
            <div class="item-val">
              <p>运费</p>
              <p>¥{{ priceList.yunfei || '0.00' }}</p>
            </div>
            <div class="item-val">
              <p>积分抵现</p>
              <p>¥{{ integral ? maxHeaderSize : '0.00' }}</p>
            </div>
            <div class="item-val">
              <p>优惠</p>
              <p>¥{{ priceList.discount || '0.00' }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="section">
        <div class="section-title">积分抵现</div>
        <div class="section-ctx">
          <div class="item">
            <el-checkbox v-model="integral" class="el-radio">
              <span>我的积分</span>
              <span class="num">{{ baseInfo.points }}</span>
              <span>本次可抵现金</span>
              <span class="num">¥{{ maxHeaderSize }}元</span>
              <span class="tip">（单次最多可抵现{{ vuex_config.max_point_pay }}元）</span>
            </el-checkbox>
          </div>
        </div>
      </div>
      <div class="section">
        <div class="section-title">请选择支付方式</div>
        <div class="section-ctx">
          <div class="item">
            <div class="item-title">预存支付</div>
            <el-radio-group v-model="paymentType">
              <el-radio label="yue">
                <img src="@/assets/img/base/appointment/pay-1.png" alt="">
                <span>个人预存</span>
                <span class="num">¥{{ baseInfo.money }}元</span>
                <span class="tip pointer" @click="toURL({url: '/preSave-pay'})">我要预存</span>
              </el-radio>
              <el-radio label="team_yue">
                <img src="@/assets/img/base/appointment/pay-2.png" alt="">
                <span>团体预存</span>
                <span class="num">¥{{ baseInfo.team_money }}元</span>
                <span class="tip" v-if="baseInfo.if_leader == 0" @click="toURL({url: '/joinGroup'})">申请加入团体</span>
                <span class="tip" v-if="baseInfo.if_leader == 1" @click="toURL({url: '/preSave-pay'})">立即充值</span>
              </el-radio>
            </el-radio-group>
          </div>
          <div class="item">
            <div class="item-title">信用支付</div>
            <el-radio-group v-model="paymentType">
              <el-radio label="credit_pay">
                <img src="@/assets/img/base/appointment/pay-3.png" alt="">
                <span>个人信用支付</span>
                <span class="tip" v-if="baseInfo.real_auth != 2" @click="toURL({url: '/my-home'})">立即实名认证</span>
                <span style="color: #00A527;" v-else>已实名</span>
              </el-radio>
              <el-radio label="team_credit_pay">
                <img src="@/assets/img/base/appointment/pay-4.png" alt="">
                <span>团体信用支付</span>
                <span class="tip" v-if="baseInfo.if_leader == 0" @click="toURL({url: '/joinGroup'})">申请加入团体</span>
              </el-radio>
            </el-radio-group>
          </div>
          <div class="item">
            <div class="item-title">其他支付方式</div>
            <el-radio-group v-model="paymentType">
              <el-radio label="wx_scan">
                <img src="@/assets/img/base/appointment/pay-wx.png" alt="">
                <span>微信支付</span>
              </el-radio>
              <el-radio label="alipay_web">
                <img src="@/assets/img/base/appointment/pay-zfb.png" alt="">
                <span>支付宝支付</span>
              </el-radio>
            </el-radio-group>
          </div>
        </div>
      </div>
    </div>

    <div class="all-money">
      <div class="money-info">
      </div>
      <div class="next-btn" @click="submit()">确认并支付</div>
    </div>
    <div v-html="alipay_web"></div>
  </div>
</template>

<style scoped lang="less">
.container {
  padding: 25px 0 70px;

  .title {
    height: 89px;
    line-height: 89px;
    background: #00479D;
    border-radius: 4px;
    font-weight: bold;
    font-size: 24px;
    color: #FFFFFF;
    padding-left: 35px;
  }

  .content {
    margin-top: 20px;
    background-color: #fff;
    padding: 30px 35px;

    .section {
      margin-bottom: 50px;

      .section-title {
        font-weight: 400;
        font-size: 18px;
        color: #333333;
        margin-bottom: 40px;
      }

      .section-ctx {
        margin-left: 40px;

        .item {
          .item-title {
            font-weight: bold;
            font-size: 18px;
            color: #000000;
            padding-bottom: 15px;
            border-bottom: 1px solid #E8E8E8;
            margin-bottom: 30px;
            display: flex;
            justify-content: space-between;

            span {
              font-weight: 400;
              font-size: 24px;
              color: #FF8000;
            }
          }

          .item-val {
            display: flex;
            justify-content: space-between;
            margin-bottom: 26px;

            p {
              font-weight: 400;
              font-size: 16px;
              color: #333333;

              span {
                display: inline-block;
                width: 100px;
              }

              &:last-child {
                font-weight: 400;
                font-size: 18px;
                color: #888888;
              }
            }
          }

          .el-radio {
            display: flex;
            align-items: center;
            margin-left: 100px;
            margin-bottom: 30px;

            span {
              font-weight: 400;
              font-size: 20px;
              color: #333333;
              margin-left: 10px;

              &.num {
                font-size: 24px;
                color: #FF8000;
              }

              &.tip {
                font-size: 16px;
                color: #00479D;
              }
            }

            img {
              width: 34px;
              height: 34px;
            }

            /deep/ .is-checked {
              .el-radio__inner {
                background-color: #fff !important;

                &:after {
                  width: 11px;
                  height: 10px;
                  background: #6093D2;
                }
              }
            }

            /deep/ .el-radio__inner {
              width: 25px;
              height: 25px;
            }

            /deep/ .el-radio__label {
              display: flex;
              align-items: center;
            }
          }
        }
      }
    }
  }

  .all-money {
    position: relative;
    margin-top: 20px;
    padding: 0 30px;
    height: 95px;
    background: #FFFFFF;
    box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.11);
    display: flex;
    justify-content: space-between;
    align-items: center;

    .next-btn {
      cursor: pointer;
      width: 140px;
      height: 49px;
      background: #00479D;
      border-radius: 8px;
      font-weight: 400;
      font-size: 18px;
      color: #FFFFFF;
      text-align: center;
      line-height: 49px;
    }
  }
}
</style>
