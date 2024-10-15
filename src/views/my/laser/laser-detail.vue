<template>
  <div class="page">
    <div class="main-title">
      <span style="margin-right: 26px">订单号：122522545265110200</span>
      <span>下单时间：2020-12-28 12:24:30</span>
    </div>

    <div class="bottom-wrap">
      <div class="order-info-wrap">
        <div class="order-info-title">订单信息</div>
        <div class="order-info-content">
          <div class="header">收货人信息</div>
          <div class="content">
            <div class="content-item">
              <div class="content-item-title">收货人：</div>
              <div class="content-item-value">张三</div>
            </div>
            <div class="content-item">
              <div class="content-item-title">收货电话：</div>
              <div class="content-item-value">13800138000</div>
            </div>
            <div class="content-item">
              <div class="content-item-title">收货地址：</div>
              <div class="content-item-value">
                收货地址：收货地址：收货地址：收货地址：收货地址：
                收货地址：收货地址：收货地址：收货地址：收货地址：
                收货地址：收货地址：收货地址：收货地址：收货地址：
              </div>
            </div>
          </div>
          <div class="header">支付及支付方式</div>
          <div class="content">
            <div class="content-item">
              <div class="content-item-title">支付方式：</div>
              <div class="content-item-value">微信支付</div>
            </div>
            <div class="content-item">
              <div class="content-item-title">下单时间：</div>
              <div class="content-item-value">2020-12-28 12:24:30</div>
            </div>
            <div class="content-item">
              <div class="content-item-title">支付凭证：</div>
              <div class="content-item-value">
                <div class="img-wrap">
                  <img src="" alt="" />
                </div>
              </div>
            </div>
          </div>
          <div class="header">发票信息</div>
          <div class="content">
            <div class="content-item">
              <div class="content-item-title">发票类型：</div>
              <div class="content-item-value">电子发票</div>
            </div>
            <div class="content-item">
              <div class="content-item-title">抬头类型：</div>
              <div class="content-item-value">张三</div>
            </div>
            <div class="content-item">
              <div class="content-item-title">发票抬头：</div>
              <div class="content-item-value">张三</div>
            </div>
          </div>
        </div>
      </div>

      <div class="order-info-wrap">
        <div class="order-info-title">加工信息</div>
        <div class="process-info-content">
          <div class="process-info-item">
            <div class="left">加工材料：不锈钢</div>
            <div class="right">加工类型：标记</div>
          </div>
          <div class="process-info-item">
            <div class="left">尺寸：长：20CM 宽：20CM 高：20CM</div>
            <div class="right">加工数量：200</div>
          </div>
          <div class="remark">
            <div class="remark-left">备注：</div>
            <div class="remark-right">
              备注信息备注信息备注信息备注信息备注信息备注信
              息备注信息备注信息备注信息备注信息备注信息备注
              信息备注信息备注信息备注信息备注信息备注信息备
              注信息备注信息备注信息备注信息备注信息备注信息
              备注信息备注信息备注信息备注信息
            </div>
          </div>
        </div>
      </div>

      <div class="footer-wrap">
        <div class="row">
          <div class="left">优惠：</div>
          <div class="right">- ¥20.00</div>
        </div>
        <div class="row">
          <div class="left">折扣：</div>
          <div class="right">- ¥0.00</div>
        </div>
        <div class="row">
          <div class="left">合计：</div>
          <span class="total-price">¥100.00</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LaserDetail",
  data() {
    return {
      laser: {},
    };
  },
  methods: {
    onRouteTo(path) {
      this.$router.push(path);
    },
  },
};
</script>

<style scoped lang="less">
.page {
  height: 100%;
  background: #f5f5f5;
}

.main-title {
  height: 56px;
  padding-left: 23px;
  line-height: 56px;
  font-size: 16px;
  color: #333333;
  background: #ffffff;
  border-radius: 4px 4px 4px 4px;
}

.bottom-wrap {
  margin-top: 13px;
  padding: 27px 32px 39px 26px;
  background: #ffffff;
}

.order-info-wrap {
  margin-bottom: 28px;
  border: 1px solid #e5e5e5;
  .order-info-title {
    height: 44px;
    padding-left: 29px;
    background: #f5f5f5;
    line-height: 44px;
    font-size: 14px;
    color: #333333;
    font-weight: bold;
  }
  .order-info-content {
    padding: 24px 0 0 30px;
    .header {
      margin-bottom: 24px;
      font-size: 14px;
      color: #999999;
      line-height: 21px;
    }
    .content {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 33px;
      .content-item {
        display: flex;
        gap: 28px;
        font-size: 14px;
        color: #666666;
        .content-item-title {
          width: 70px;
          flex-shrink: 0;
        }
        .content-item-value {
          width: 336px;
          .img-wrap {
            width: 81px;
            height: 81px;
            img {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }
  }
  .process-info-content {
    padding: 24px 0 25px 27px;
    .process-info-item {
      display: flex;
      gap: 28px;
      font-size: 14px;
      color: #333333;
      line-height: 24px;
      .left {
        width: 444px;
        flex-shrink: 0;
      }
      .right {
        flex: 1;
      }
    }
    .remark {
      display: flex;
      gap: 6px;
      font-size: 14px;
      color: #333333;
      line-height: 24px;
      .remark-left {
        width: 42px;
        flex-shrink: 0;
      }
      .remark-right {
        flex: 1;
      }
    }
  }
}

.footer-wrap {
  height: 144px;
  padding: 33px 39px 0 0;
  display: flex;
  flex-direction: column;
  gap: 15px;
  background: #fafafa;
  text-align: right;
  font-size: 14px;
  color: #666666;
  line-height: 18px;
  .row {
    height: 24px;
    line-height: 24px;
    display: flex;
    justify-content: flex-end;
    .left {
    }
    .right {
      min-width: 54px;
      flex-shrink: 0;
    }
    .total-price {
      font-weight: bold;
      font-size: 20px;
      color: #EA3200;
    }
  }
}
</style>




