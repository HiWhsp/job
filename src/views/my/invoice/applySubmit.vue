<script>
export default {
  name: "invoice",
  data() {
    return {
      isShow: true,
      // 发票信息
      invoice_info: {
        invoiceStatus: 0, //是否开票 0-不需要 1-需要发票
        invoiceType: '', //发票类型：1-普通发票 2-专用发票
        titleType: '1', //抬头：1-个人 2-单位
        title: '', // 公司名称
        shibiema: '', // 识别码
        companyAddress: '', // 注册地址
        companyPhone: '', // 注册电话
        bankName: '', // 开户银行
        bankNo: '', // 银行账号
        email: '', // 电子邮箱
        orderId: '', // 关联订单
      },

      // 发票类型
      invoiceTypeOption: [
        {value: '', title: '不开票', icon: ''},
        {value: '1', title: '普通发票', icon: ''},
        {value: '2', title: '专用发票', icon: ''},
      ],
    }
  },
  methods: {
    // 发票信息选择
    do_toggle_invoice(item) {
      if (item.value != 0) {
        this.invoice_info.invoiceStatus = 1;
      } else {
        this.invoice_info.invoiceStatus = 0
      }
      this.invoice_info.invoiceType = item.value;
    },

    goUrl () {
      this.$router.push({
        path: '/appointment-pay'
      })
    }
  }
}
</script>

<template>
  <div class="container">
    <div class="content">
      <div class="section-title">发票信息</div>
      <div class="section-ctx section-ctx-type">
        <div class="invoice-info">
          <div class="info-item">
            <div class="info-label">是否开票</div>
            <div class="info-val">
              <el-radio-group v-model="invoice_info.invoiceType" fill="#A66600">
                <el-radio :label="item.value" v-for="(item, index) in invoiceTypeOption" :key="index">{{ item.title }}</el-radio>
              </el-radio-group>
            </div>
          </div>
        </div>
        <div class="invoice-info" v-if="invoice_info.invoiceType === '1'">
          <div class="info-item">
            <div class="info-label">发票抬头类型</div>
            <div class="info-val">
              <el-radio-group v-model="invoice_info.titleType" fill="#A66600">
                <el-radio label="1">个人</el-radio>
                <el-radio label="2">企业</el-radio>
              </el-radio-group>
            </div>
          </div>
          <div class="info-item">
            <div class="info-label"><span>*</span> 发票抬头</div>
            <div class="info-val">
              <el-input v-model="invoice_info.title"
                        placeholder="请填写准确的抬头名称 必填"></el-input>
            </div>
          </div>
          <div class="info-item" v-if="invoice_info.titleType === '2'">
            <div class="info-label"><span>*</span> 纳税人识别号</div>
            <div class="info-val">
              <el-input v-model="invoice_info.shibiema"
                        placeholder="请填写准确的纳税人识别号 必填"></el-input>
            </div>
          </div>
        </div>

        <div class="invoice-info" v-if="invoice_info.invoiceType === '2'">
          <div class="info-item">
            <div class="info-label"><span>*</span> 发票抬头</div>
            <div class="info-val">
              <el-input v-model="invoice_info.title"
                        placeholder="请填写准确的抬头名称 必填"></el-input>
            </div>
          </div>
          <div class="info-item">
            <div class="info-label"><span>*</span> 纳税人识别号</div>
            <div class="info-val">
              <el-input v-model="invoice_info.shibiema"
                        placeholder="请填写准确的纳税人识别号 必填"></el-input>
            </div>
          </div>
          <div class="info-item">
            <div class="info-label"><span>*</span> 注册地址</div>
            <div class="info-val">
              <el-input v-model="invoice_info.companyAddress"
                        placeholder="输入单位注册地址 必填"></el-input>
            </div>
          </div>
          <div class="info-item">
            <div class="info-label"><span>*</span> 注册电话</div>
            <div class="info-val">
              <el-input v-model="invoice_info.companyPhone"
                        placeholder="输入单位注册电话 必填"></el-input>
            </div>
          </div>
          <div class="info-item">
            <div class="info-label"><span>*</span> 开户银行</div>
            <div class="info-val">
              <el-input v-model="invoice_info.bankName" placeholder="输入开户银行 必填"></el-input>
            </div>
          </div>
          <div class="info-item">
            <div class="info-label"><span>*</span> 账户银行</div>
            <div class="info-val">
              <el-input v-model="invoice_info.bankNo" placeholder="输入银行账户 必填"></el-input>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.container {
  padding: 0 0 70px;

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
    background-color: #fff;
    padding-bottom: 60px;

    .section-title {
      padding: 18px 18px 18px 50px;
      border-bottom: 1px solid #d5d8de;
      font-weight: 400;
      font-size: 18px;
      color: #00479D;
    }

    .section-ctx {
      .invoice-info {
        padding-left: 120px;
        margin-top: 31px;

        .info-item {
          .flex();
          margin-top: 26px;

          .info-label {
            font-weight: 400;
            font-size: 16px;
            color: #333333;
            width: 120px;
            text-align: right;

            span {
              color: #FF5F00;
            }
          }
          .info-val {
            margin-left: 100px;
            .el-input {
              width: 400px;
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

    .money-info {
      .flex();
      font-weight: 400;
      font-size: 16px;
      color: #333333;

      span {
        color: #00479D;
      }

      i {
        margin-left: 10px;
        font-size: 18px;
        font-weight: bold;
        color: #818181;
        transition: all 0.5s ease-in-out;

        &.hide {
          transform: rotate(180deg);
          transition: all 0.5s ease-in-out;
        }
      }
    }

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

    .popup {
      width: 100%;
      padding: 40px;
      background-color: #fff;
      box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.11);
      position: absolute;
      left: 0;
      bottom: 95px;
      transition: all 0.5s ease-in-out;

      .item {
        margin-bottom: 28px;
        display: flex;

        span {
          font-weight: 400;
          font-size: 16px;
          color: #333333;
          margin-right: 30px;
        }

        .num {
          width: 200px;
        }

        .money {
          font-weight: 400;
          font-size: 18px;
          color: #00479D;
        }

        &:last-child {
          margin-bottom: 0;
        }
      }

      &.hide {
        // 慢慢收起
        height: 0;
        overflow: hidden;
        transition: all 0.5s ease-in-out;
        padding: 0 45px;
      }
    }
  }
}
</style>
