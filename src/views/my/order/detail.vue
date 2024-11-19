<script>
export default {
  name: "detail",
  data() {
    return {
      process: 2
    }
  }
}
</script>

<template>
  <div class="content">
    <div class="status-item">
      <div class="status">
        <span>氧氮氢分析仪</span>
        <span>等待支付</span>
      </div>
      <div class="info">
        <div class="left">
          <p class="order-id">订单号：5456412312312</p>
          <p class="time">下单时间：2023-04-14 15:37</p>
          <div class="btn-wrap">
            <div class="btn">取消订单</div>
            <div class="btn">取消订单</div>
            <div class="btn">取消订单</div>
          </div>
        </div>
        <div class="right">
          <div class="process active">
            <img src="@/assets/img/my/order/1.png" alt="">
            <span>提交订单</span>
          </div>
          <div class="process" :class="{'active': process >= 2}">
            <img src="@/assets/img/my/order/2-active.png" alt="" v-if="process >= 2">
            <img src="@/assets/img/my/order/2.png" alt="" v-else>
            <span>支付成功</span>
          </div>
          <div class="process" :class="{'active': process >= 3}">
            <img src="@/assets/img/my/order/3-active.png" alt="" v-if="process >= 3">
            <img src="@/assets/img/my/order/3.png" alt="" v-else>
            <span>实验中</span>
          </div>
          <div class="process" :class="{'active': process >= 4}">
            <img src="@/assets/img/my/order/4-active.png" alt="" v-if="process >= 4">
            <img src="@/assets/img/my/order/4.png" alt="" v-else>
            <span>实验完成</span>
          </div>
        </div>
      </div>
    </div>
    <div class="address-item">
      <div class="sample-delivery">
        <!-- 左侧内容 -->
        <div class="left-content">
          <p class="delivery-method">寄样方式: 自行寄样 (运费自付)</p>
          <p class="detail">
            <span>收货人：</span>徐老师
          </p>
          <p class="detail">
            <span>联系方式：</span>15931263165
          </p>
          <p class="detail">
            <span>寄送地址：</span>厦门市集美区杏林湾路465号1号楼2560单元
          </p>
        </div>

        <!-- 右侧内容 -->
        <div class="right-content">
          <p class="payment-status">
            支付方式：<span>待支付</span>
          </p>
          <p class="payment-amount">
            支付金额：<span class="amount">¥40.00</span>
          </p>
        </div>
      </div>
    </div>
    <div class="order-item"></div>
    <div class="orderInfo-item"></div>
  </div>
</template>

<style scoped lang="less">
.content {
  display: flex;
  flex-direction: column;

  .status-item {
    width: 100%;
    background-color: #fff;

    .status {
      display: flex;
      justify-content: space-between;
      padding: 0 55px 0;
      height: 89px;
      line-height: 89px;
      background: #DFEEFF;

      span {
        font-size: 20px;

        &:first-child {
          color: #333333;
          font-weight: 400;
        }

        &:last-child {
          color: #00479D;
        }
      }
    }

    .info {
      margin: 30px 0;
      padding: 0 40px;
      display: flex;

      .left {
        width: 300px;
        padding-right: 80px;
        border-right: 1px solid #D5D5D5;

        .order-id, .time {
          text-align: center;
          font-weight: 400;
          font-size: 14px;
          color: #333333;
          margin-top: 5px;
        }

        .btn-wrap {
          margin-top: 15px;
          display: flex;
          flex-direction: column;
          align-items: center;

          .btn {
            cursor: pointer;
            margin-top: 15px;
            width: 115px;
            height: 29px;
            line-height: 29px;
            text-align: center;
            background: #FFFFFF;
            border-radius: 4px 4px 4px 4px;
            border: 1px solid #00479D;
          }
        }
      }

      .right {
        padding-left: 80px;
        display: flex;
        align-items: center;

        .process {
          margin-right: 130px;
          text-align: center;

          img {
            width: 65px;
            height: 65px;
            margin-bottom: 10px;
          }

          span {
            font-weight: 400;
            font-size: 16px;
            color: #818181;
          }

          &.active {
            span {
              color: #333333;
            }
          }
        }
      }
    }
  }

  .address-item {
    margin-top: 20px;
    width: 100%;
    .sample-delivery {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      background: #fff;
      padding: 20px;

      .left-content {
        flex: 3;

        .delivery-method {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 10px;
          color: #333;
        }

        .detail {
          font-size: 14px;
          color: #666;
          line-height: 1.8;

          span {
            color: #333;
            font-weight: bold;
          }
        }
      }

      .right-content {
        flex: 1;
        text-align: right;

        .payment-status,
        .payment-amount {
          font-size: 14px;
          color: #666;
          margin-bottom: 10px;

          span {
            font-weight: bold;
            color: #333;
          }

          .amount {
            color: #007aff;
            font-size: 16px;
          }
        }
      }
    }
  }
}
</style>
