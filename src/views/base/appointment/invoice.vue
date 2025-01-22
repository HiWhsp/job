<script>
export default {
  name: "invoice",
  data() {
    return {
      isShow: true,
      // 发票信息
      invoice_info: {
        invoiceStatus: 0, //是否开票 0-不需要 1-需要发票
        f_type: '', //发票类型：1-普通发票 2-专用发票
        title_type: '1', //抬头：1-个人 2-单位
        name: '', // 公司名称
        company_no: '', // 识别码
        reg_address: '', // 注册地址
        reg_tel: '', // 注册电话
        bank_name: '', // 开户银行
        bank_no: '', // 银行账号
        email: '', // 电子邮箱
        orderId: '', // 关联订单
      },
      priceList: [],

      // 发票类型
      invoiceTypeOption: [
        {value: '', title: '不开票', icon: ''},
        {value: '1', title: '普通发票', icon: ''},
        {value: '2', title: '专用发票', icon: ''},
      ],
      preOrderDetail: {}
    }
  },
  mounted() {
    this.setView();
  },
  methods: {
    setView() {
      this.preOrderDetail = JSON.parse(localStorage.getItem('preOrderDetail')) || {};
      this.invoice_info.f_type = this.preOrderDetail.f_type || '';
      this.invoice_info.title_type = this.preOrderDetail.title_type || '';
      this.invoice_info.name = this.preOrderDetail.name || '';
      this.invoice_info.company_no = this.preOrderDetail.company_no || '';
      this.invoice_info.reg_address = this.preOrderDetail.reg_address || '';
      this.invoice_info.reg_tel = this.preOrderDetail.reg_tel || '';
      this.invoice_info.bank_name = this.preOrderDetail.bank_name || '';
      this.invoice_info.bank_no = this.preOrderDetail.bank_no || '';
      this.invoice_info.email = this.preOrderDetail.email || '';
      if (this.preOrderDetail.form.length) {
        this.getPriceList(this.preOrderDetail.form);
      }
    },
    getPriceList(form) {
      this.$api({
        url: 'order_pay_info',
        method: 'post',
        data: {
          yf_type: this.preOrderDetail.yf_type || '0',
          tongshebei: this.preOrderDetail.tongshebei || '',
          if_urgent: this.preOrderDetail.if_urgent || '',
          sample_type: this.preOrderDetail.sample_type || '',
          product_id: this.preOrderDetail.product_id || '',
          form: this.filterForm(form)
        }
      }).then(res => {
        if (res.code === 200) {
          this.priceList = res.data;
        }
      })
    },

    // 发票信息选择
    do_toggle_invoice(item) {
      if (item.value != 0) {
        this.invoice_info.invoiceStatus = 1;
      } else {
        this.invoice_info.invoiceStatus = 0
      }
      this.invoice_info.f_type = item.value;
    },

    goUrl() {
      localStorage.setItem('preOrderDetail', JSON.stringify({...this.preOrderDetail, ...this.invoice_info}));
      this.$router.push({
        path: '/appointment-pay'
      })
    }
  }
}
</script>

<template>
  <div class="container main">
    <div class="title">下单：{{ preOrderDetail.title }}</div>
    <div class="content">
      <div class="section-title">发票信息</div>
      <div class="section-ctx section-ctx-type">
        <div class="invoice-info">
          <div class="info-item">
            <div class="info-label">是否开票</div>
            <div class="info-val">
              <el-radio-group v-model="invoice_info.f_type" fill="#A66600">
                <el-radio :label="item.value" v-for="(item, index) in invoiceTypeOption" :key="index"
                          @change="do_toggle_invoice(item)">{{
                    item.title
                  }}
                </el-radio>
              </el-radio-group>
            </div>
          </div>
        </div>
        <div class="invoice-info" v-if="invoice_info.f_type === '1'">
          <div class="info-item">
            <div class="info-label">发票抬头类型</div>
            <div class="info-val">
              <el-radio-group v-model="invoice_info.title_type" fill="#A66600">
                <el-radio label="1">个人</el-radio>
                <el-radio label="2">企业</el-radio>
              </el-radio-group>
            </div>
          </div>
          <div class="info-item">
            <div class="info-label"><span>*</span> 发票抬头</div>
            <div class="info-val">
              <el-input v-model="invoice_info.name"
                        placeholder="请填写准确的抬头名称 必填"></el-input>
            </div>
          </div>
          <div class="info-item" v-if="invoice_info.title_type === '2'">
            <div class="info-label"><span>*</span> 纳税人识别号</div>
            <div class="info-val">
              <el-input v-model="invoice_info.company_no"
                        placeholder="请填写准确的纳税人识别号 必填"></el-input>
            </div>
          </div>
        </div>

        <div class="invoice-info" v-if="invoice_info.f_type === '2'">
          <div class="info-item">
            <div class="info-label"><span>*</span> 发票抬头</div>
            <div class="info-val">
              <el-input v-model="invoice_info.name"
                        placeholder="请填写准确的抬头名称 必填"></el-input>
            </div>
          </div>
          <div class="info-item">
            <div class="info-label"><span>*</span> 纳税人识别号</div>
            <div class="info-val">
              <el-input v-model="invoice_info.company_no"
                        placeholder="请填写准确的纳税人识别号 必填"></el-input>
            </div>
          </div>
          <div class="info-item">
            <div class="info-label"><span>*</span> 注册地址</div>
            <div class="info-val">
              <el-input v-model="invoice_info.reg_address"
                        placeholder="输入单位注册地址 必填"></el-input>
            </div>
          </div>
          <div class="info-item">
            <div class="info-label"><span>*</span> 注册电话</div>
            <div class="info-val">
              <el-input v-model="invoice_info.reg_tel"
                        placeholder="输入单位注册电话 必填"></el-input>
            </div>
          </div>
          <div class="info-item">
            <div class="info-label"><span>*</span> 开户银行</div>
            <div class="info-val">
              <el-input v-model="invoice_info.bank_name" placeholder="输入开户银行 必填"></el-input>
            </div>
          </div>
          <div class="info-item">
            <div class="info-label"><span>*</span> 账户银行</div>
            <div class="info-val">
              <el-input v-model="invoice_info.bank_no" placeholder="输入银行账户 必填"></el-input>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="all-money">
      <div class="money-info">
        <p>合计费用: <span>{{ vuex_huobi }}{{ priceList.total || 0 }}</span></p>
        <i class="el-icon-arrow-down" :class="{'hide': isShow}" @click="isShow = !isShow"></i>
      </div>
      <div class="next-btn" @click="goUrl()">下一步</div>

      <div class="popup" :class="{'hide': isShow}">
        <div class="item" v-for="(item, index) in priceList.data" :key="index">
          <span>{{ item.sample_title || '暂无' }}</span>
          <span class="num">样品数量：{{ item.num || 0 }}</span>
          <span class="money">¥{{ item.unit_price || 0 }} * {{  item.num || 0 }}</span>
        </div>
        <div class="item">
          <span>运费</span>
          <span class="num"> </span>
          <span class="money">¥{{ priceList.yunfei || 0 }}</span>
        </div>
      </div>
    </div>
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
          min-width: 50px;
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
