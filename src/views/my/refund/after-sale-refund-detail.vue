<template>
  <div class="page">
    <div class="main-title">售后订单</div>

    <div class="page-ctx">
      <div class="wait-review-wrap" v-if="status === 'refund-waiting'">
        <div class="title">等待审核</div>
        <div class="sub-title">等待平台确认退款</div>
      </div>

      <div class="wait-review-wrap" v-else-if="status === 'refund-success'">
        <div class="title">退款成功</div>
        <div class="sub-title">退款成功￥1899元</div>
      </div>

      <div
        class="wait-review-wrap"
        v-else-if="status === 'return-refund-waiting'"
      >
        <div class="title">等待审核</div>
        <div class="sub-title">等待平台确认退款</div>
      </div>

      <div
        class="wait-review-wrap"
        v-else-if="status === 'return-refund-success'"
      >
        <div class="title">申请成功</div>
        <div class="sub-title">请按商家地址将产品寄回</div>
      </div>

      <div
        class="wait-review-wrap"
        v-else-if="status === 'return-refund-handling'"
      >
        <div class="title">处理中</div>
        <div class="sub-title">待卖家确认收货 7天后自动收货</div>
      </div>

      <div
        class="wait-review-wrap"
        v-else-if="status === 'refund-finish'"
      >
        <div class="title">退款完成</div>
        <div class="sub-title">退款成功￥1899元</div>
      </div>

      <div class="refund-message-wrap">
        <div class="refund-message">退款信息</div>
        <div class="form-wrap">
          <div class="form-item">
            <div class="label">退款商品：</div>
            <div class="item">
              <div class="img-wrap">
                <img src="" alt="" />
              </div>
              <div class="desc-wrap">
                <div class="title">激光平面窗口 Φ5.0mm 厚度=2.0mm</div>
                <div class="sub-title">GCL-010158</div>
                <div class="num">X1</div>
              </div>
            </div>
          </div>
          <div class="form-item two-row">
            <div class="label">退款原因：</div>
            <div class="item">拍错/多拍/不想要</div>
          </div>
          <div class="form-item">
            <div class="label">退款金额：</div>
            <div class="item">￥2199.00</div>
          </div>
          <div class="form-item">
            <div class="label">申请时间：</div>
            <div class="item">2021-3-23 15：23：24</div>
          </div>
          <div class="form-item">
            <div class="label">退款单号：</div>
            <div class="item">6767862490656515</div>
          </div>
          <div class="form-item">
            <div class="label">退款说明：</div>
            <div class="item">
              描述和凭证描述和凭证描述和凭证描述和凭证描述和凭
              证描描述和凭证描述和凭证描述和凭证描述和凭证描述
              和凭证描述和凭证描述和凭证描述和凭证描述和凭证描
              述和凭证描述和凭证描述和凭证描述和凭证描述和凭证
              描述和凭证描述和凭证描述和凭证描述和凭证描述和凭
              证描述和凭证描述和凭证描述和凭证描述和凭证描述和 凭证述和凭证
            </div>
          </div>
          <div class="last-row">
            <div class="label">退款凭证：</div>
            <div class="item">
              <div class="voucher-img-wrap" v-for="i in 3" :key="i"></div>
            </div>
          </div>
        </div>
        <div class="address-wrap" v-if="status === 'return-refund-success'">
          <div class="label">退还地址：</div>
          <div class="item">
            <div class="info-wrap">
              <div class="name">张三 1810000000</div>
              <div class="address">
                详细地址：中关村东路XXX号 XXXXXXX
                <img src="@/assets/img/refund/copy.png" alt="" />
              </div>
              <div class="btn-wrap" @click="mailBack">邮寄回平台</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="596px"
      class="email-form-wrap"
      :show-close="false"
    >
      <div class="form-wrap">
        <div class="form-item">
          <div class="label">快递公司：</div>
          <div class="item">
            <el-input
              class="input"
              v-model="expressCompany"
              placeholder="请输入您邮寄商品的快递公司"
            />
          </div>
        </div>
        <div class="form-item">
          <div class="label">快递单号：</div>
          <div class="item">
            <el-input
              class="input"
              v-model="trackingNumber"
              placeholder="请输入您邮寄商品的快递单号"
            />
          </div>
        </div>
      </div>
      <div slot="title" class="title-wrap">
        <div class="title">输入邮寄信息</div>
        <div class="close-btn" @click="dialogVisible = false">
          <img src="@/assets/img/refund/close-icon.png" alt="" />
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <div class="btn" @click="confirm">确定</div>
        <div class="btn cancel-btn" @click="dialogVisible = false">取消</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "servicePage",
  components: {},
  data() {
    return {
      // status: 'waiting'
      status: "success",
      expressCompany: "",
      trackingNumber: "",
      dialogVisible: false,
    };
  },

  computed: {},

  created() {
    this.status = this.$route.query.status;
  },

  methods: {
    mailBack() {
      this.dialogVisible = true;
    },
    confirm() {
      this.dialogVisible = false;
      this.status = "return-refund-handling";
    },
  },
};
</script>


<style scoped lang="less">
.page {
  padding: 0;

  .main-title {
    margin-bottom: 20px;
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
    padding: 22px 16px 38px 32px;
    background: #fff;
  }
}

.wait-review-wrap {
  width: 1112px;
  height: 115px;
  background: #27417c;
  padding: 33px 0 0 35px;
  .title {
    font-size: 19px;
    color: #ffffff;
    line-height: 19px;
    text-align: left;
    font-style: normal;
    text-transform: none;
  }
  .sub-title {
    margin-top: 11px;
    font-size: 13px;
    color: #ffffff;
    line-height: 19px;
    text-align: left;
    font-style: normal;
    text-transform: none;
  }
}

.refund-message-wrap {
  margin-top: 25px;
  padding-bottom: 51px;
  background: #ffffff;
  border: 1px solid #cccccc;
  .refund-message {
    height: 48px;
    padding: 13px 0 0 25px;
    background: #f9f9f9;
    border-bottom: 1px solid #cccccc;
    font-size: 16px;
    color: #333333;
    line-height: 20px;
  }
  .form-wrap {
    padding: 31px 0 0 35px;
    .form-item {
      display: flex;
      gap: 10px;
      .label {
        width: 70px;
        flex-shrink: 0;
        font-weight: 400;
        font-size: 14px;
        color: #333333;
        line-height: 30px;
      }
      .item {
        width: 759px;
        display: flex;
        line-height: 30px;
        font-size: 14px;
        .img-wrap {
          margin: 0 40px 0 4px;
          width: 81px;
          height: 81px;
          border-radius: 8px 8px 8px 8px;
          border: 1px solid #f1f1f1;
          img {
            width: 100%;
            height: 100%;
            border-radius: 8px 8px 8px 8px;
          }
        }
        .desc-wrap {
          display: flex;
          flex-direction: column;
          gap: 13px;
          .title {
            font-size: 16px;
            color: #333333;
            line-height: 18px;
          }
          .sub-title {
            font-size: 14px;
            color: #999999;
            line-height: 16px;
          }
          .num {
            font-size: 12px;
            color: #77797b;
            line-height: 21px;
          }
        }
      }
    }
    .two-row {
      margin-top: 37px;
    }
    .last-row {
      display: flex;
      gap: 10px;
      margin-top: 18px;
      .label {
        width: 70px;
        flex-shrink: 0;
        font-size: 14px;
        color: #333333;
      }
      .item {
        display: flex;
      }
      .voucher-img-wrap {
        width: 101px;
        height: 101px;
        margin-right: 19px;
        background: #8a8a8a;
      }
    }
  }
  .address-wrap {
    height: 204px;
    display: flex;
    gap: 20px;
    margin-top: 32px;
    padding: 40px 0 0 39px;
    border-top: 1px solid #ebebeb;
    .label {
      width: 70px;
      flex-shrink: 0;
      font-weight: 400;
      font-size: 14px;
      color: #333333;
      line-height: 30px;
    }
    .item {
      width: 759px;
      display: flex;
      font-size: 14px;
      .info-wrap {
        display: flex;
        flex-direction: column;
        font-size: 14px;
        color: #7d7d7d;
        line-height: 30px;
        .address {
          display: flex;
          gap: 17px;
          align-items: center;
        }
        .btn-wrap {
          width: 240px;
          height: 34px;
          margin-top: 46px;
          line-height: 34px;
          text-align: center;
          background: #27417c;
          border-radius: 4px 4px 4px 4px;
          font-size: 16px;
          color: #ffffff;
          cursor: pointer;
        }
      }
    }
  }
}

.form-wrap {
  display: flex;
  flex-direction: column;
  gap: 24px;
  .form-item {
    display: flex;
    align-items: center;
    gap: 10px;
    .label {
      width: 138px;
      text-align: right;
      font-weight: 400;
      font-size: 14px;
      color: #333333;
      line-height: 24px;
    }
    .item {
      .input {
        width: 400px;
        background: #ffffff;
        border-radius: 4px 4px 4px 4px;
        border: 1px solid #eeeeee;
      }
    }
  }
}
.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 20px;
  .btn {
    width: 104px;
    height: 40px;
    background: #27417c;
    border-radius: 4px 4px 4px 4px;
    color: #ffffff;
    cursor: pointer;
    line-height: 40px;
    text-align: center;
  }
  .cancel-btn {
    background: #ffffff;
    color: #27417c;
    border: 1px solid #27417c;
  }
}

.title-wrap {
  display: flex;
  justify-content: space-between;
  .title {
    font-size: 18px;
    color: #333333;
    line-height: 26px;
  }
  .close-btn {
    width: 26px;
    height: 26px;
    cursor: pointer;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>

<style lang="less">
.email-form-wrap {
  box-shadow: 0px 3px 10px 1px rgba(0, 0, 0, 0.16);
  border-radius: 4px 4px 4px 4px;
}
</style>
