<template>
  <div class="page">
    <div class="main-title">发票信息</div>

    <div class="page-ctx">
      <div class="product-info">
        <div class="product-title">商品信息</div>
        <div class="product-form-wrap">
          <div class="product-item">
            <div class="produce-img-wrap">
              <img src="" alt="" />
            </div>
            <div class="product-info-wrap">
              <div class="product-name">激光平面窗口 Φ5.0mm 厚度=2.0mm</div>
              <div class="product-code">GCL-010158</div>
            </div>
            <div class="product-num">1</div>
            <div class="product-price">￥5000.00</div>
          </div>
          <div class="product-form-item total-price">
            <div class="product-label">商品总价：</div>
            <div class="product-item">￥399.00</div>
          </div>
          <div class="product-form-item mt-17">
            <div class="product-label">配送费：</div>
            <div class="product-item">+￥10.00</div>
          </div>
          <div class="product-form-item mt-17">
            <div class="product-label">优惠券：</div>
            <div class="product-item">-￥10.00</div>
          </div>
          <div class="product-form-item mt-17">
            <div class="product-label">合计应付：</div>
            <div class="product-item">￥399.00</div>
          </div>
        </div>
      </div>

      <div class="invoice-info">
        <div class="invoice-title">开票信息</div>
        <div class="invoice-form-wrap">
          <div class="invoice-form-item">
            <div class="invoice-label">发票类型：</div>
            <div class="invoice-item">普通发票</div>
          </div>
          <div class="invoice-form-item">
            <div class="invoice-label">发票抬头：</div>
            <div class="invoice-item">公司</div>
          </div>
          <div class="invoice-form-item">
            <div class="invoice-label">单位名称：</div>
            <div class="invoice-item">单位名称</div>
          </div>
          <div class="invoice-form-item">
            <div class="invoice-label">纳税人识别码：</div>
            <div class="invoice-item">纳税人识别号</div>
          </div>
          <div class="invoice-form-item">
            <div class="invoice-label">注册地址：</div>
            <div class="invoice-item">注册地址</div>
          </div>
          <div class="invoice-form-item">
            <div class="invoice-label">注册电话：</div>
            <div class="invoice-item">注册电话</div>
          </div>
          <div class="invoice-form-item">
            <div class="invoice-label">开户银行：</div>
            <div class="invoice-item">开户银行</div>
          </div>
          <div class="invoice-form-item">
            <div class="invoice-label">银行账号：</div>
            <div class="invoice-item">银行账号</div>
          </div>
          <div class="invoice-form-item">
            <div class="invoice-label">接收邮箱：</div>
            <div class="invoice-item">接收邮箱</div>
          </div>
        </div>
      </div>

      <div class="btn-wrap">
        <div class="btn">下载发票</div>
      </div>
    </div>
  </div>
</template>
    
<script>
export default {
  name: "invoiceDetails",
  components: {},
  data() {
    return {};
  },
  mounted() {
    this.getInvoiceDetails();
  },
  methods: {
    getInvoiceDetails() {
      // 获取发票详情
    },
  },
};
</script>
    
    
<style scoped lang="less">
.page {
  padding: 0;

  .main-title {
    margin-bottom: 13px;
    padding: 0 32px;
    text-align: left;
    height: 56px;
    font-weight: bold;
    line-height: 56px;
    background: #ffffff;
    font-size: 16px;
    font-family: Microsoft YaHei-Bold, Microsoft YaHei;
    color: #333333;
  }

  .page-ctx {
    padding: 23px 24px 53px;
    background: #fff;
    .product-info {
      height: 352px;
      border: 1px solid #cccccc;
      .product-title {
        padding: 13px 0 0 20px;
        background: #f9f9f9;
        height: 48px;
        border-bottom: 1px solid #cccccc;
        font-size: 16px;
        color: #333333;
        line-height: 20px;
      }
      .product-form-wrap {
        padding: 32px 0 0 29px;
        font-size: 14px;
        color: #333333;
        .product-item {
          display: flex;
          align-items: center;
          .produce-img-wrap {
            width: 81px;
            height: 81px;
            border-radius: 8px 8px 8px 8px;
            border: 1px solid #f1f1f1;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .product-info-wrap {
            height: 81px;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            margin-left: 41px;
            .product-name {
              font-size: 16px;
              color: #333333;
              line-height: 18px;
            }
            .product-code {
              font-size: 14px;
              color: #999999;
              line-height: 16px;
            }
          }
          .product-num {
            font-size: 13px;
            color: #333333;
            margin-left: 251px;
          }
          .product-price {
            font-weight: bold;
            font-size: 13px;
            color: #333333;
            margin-left: 274px;
          }
        }
      }
      .product-form-item {
        display: flex;
        gap: 10px;
        font-size: 14px;
        color: #333333;
        .product-label {
          width: 70px;
        }
      }
      .total-price {
        margin-top: 39px;
      }
      .mt-17 {
        margin-top: 17px;
      }
    }
    .invoice-info {
      height: 396px;
      margin-top: 24px;
      border: 1px solid #cccccc;
      .invoice-title {
        padding: 13px 0 0 20px;
        background: #f9f9f9;
        height: 48px;
        border-bottom: 1px solid #cccccc;
        font-size: 16px;
        color: #333333;
        line-height: 20px;
      }
      .invoice-form-wrap {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 24px 0 0 26px;
        font-size: 14px;
        color: #333333;

        .invoice-form-item {
          display: flex;
          gap: 10px;
          font-size: 14px;
          color: #333333;
          .invoice-label {
            width: 98px;
          }
        }
      }
    }
    .btn-wrap {
      margin-top: 39px;
      display: flex;
      justify-content: center;
      .btn {
        width: 240px;
        height: 34px;
        background: #27417C;
        text-align: center;
        line-height: 34px;
        border-radius: 4px;
        font-size: 16px;
        color: #ffffff;
        cursor: pointer;
      }
    }
  }
}
</style>
    