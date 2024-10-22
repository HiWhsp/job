<script>
export default {
    data() {
        return {
            activeIndex: 1,
            // 发票类型
            invoiceTypeOption: [
                {value: '', title: '不开票', icon: ''},
                {value: '1', title: '普通发票', icon: ''},
                {value: '2', title: '专用发票', icon: ''},
            ],
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
    }
}
</script>

<template>
    <div class="page">
        <div class="left">
            <div class="item line1" :class="{ active: activeIndex >= 1 }">
                <i></i>
                <span>基本信息</span>
            </div>
            <div class="col"></div>
            <div class="item line2" :class="{ active: activeIndex >= 2 }">
                <i></i>
                <span>开票</span>
            </div>
            <div class="col"></div>
            <div class="item line3" :class="{ active: activeIndex >= 3 }">
                <i></i>
                <span>收货信息</span>
            </div>
            <div class="col"></div>
            <div class="item line4" :class="{ active: activeIndex >= 4 }">
                <i></i>
                <span>支付方式</span>
            </div>
        </div>
        <div class="content">
            <div class="title-top">
                <span>激光加工</span>
                <i class="el-icon-arrow-down"></i>
            </div>
            <div class="select">
                <div class="sel-item">
                    <div class="label">
                        <span>加工材料</span>
                        <img src="@/assets/img/productDetail/tip.png" alt="">
                    </div>
                    <div class="value">
                        <div class="v-item active">不锈钢</div>
                        <div class="v-item">铝</div>
                        <div class="v-item">紫铜</div>
                        <div class="v-item">铂金</div>
                        <div class="v-item">银</div>
                        <div class="v-item">其他贵金属</div>
                    </div>
                </div>
                <div class="sel-item">
                    <div class="label">
                        <span>加工类型</span>
                        <img src="@/assets/img/productDetail/tip.png" alt="">
                    </div>
                    <div class="value">
                        <div class="t-item active column-flex-center">
                            <img src="@/assets/img/productDetail/laser.png" alt="">
                            <span class="desc">标记</span>
                        </div>
                    </div>
                </div>
                <div class="sel-item">
                    <div class="label">
                        <span>尺寸</span>
                        <img src="@/assets/img/productDetail/tip.png" alt="">
                    </div>
                    <div class="value">
                        <el-input size="small" placeholder="长">
                            <template slot="append">CM</template>
                        </el-input>
                        <el-input size="small" placeholder="宽">
                            <template slot="append">CM</template>
                        </el-input>
                        <el-input size="small" placeholder="高">
                            <template slot="append">CM</template>
                        </el-input>
                    </div>
                </div>
                <div class="sel-item">
                    <div class="label">
                        <span>加工数量</span>
                        <img src="@/assets/img/productDetail/tip.png" alt="">
                    </div>
                    <div class="value">
                        <el-input size="small" placeholder="加工数量">
                        </el-input>
                    </div>
                </div>
                <div class="sel-item">
                    <div class="label">
                        <span>备注</span>
                        <img src="" alt="">
                    </div>
                    <div class="value">
                        <el-input type="textarea" :rows="5" placeholder="请输入备注说明"></el-input>
                    </div>
                </div>
            </div>
            <div class="title-top">
                <span>开票</span>
                <i class="el-icon-arrow-down"></i>
            </div>
            <div class="section-ctx-type">
                <div class="pay-group">
                    <div class="pay-items">
                        <div class="item" v-for="(item, index) in invoiceTypeOption"
                             @click="do_toggle_invoice(item)"
                             :class="{ checked: invoice_info.invoiceType == item.value }">
                            <div class="invoice">{{ item.title }}</div>
                        </div>
                    </div>
                </div>
                <!--  -->
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
            <div class="title-top">
                <span>收货信息</span>
                <i class="el-icon-arrow-down"></i>
            </div>
            <div class="title-top">
                <span>支付方式</span>
                <i class="el-icon-arrow-down"></i>
            </div>
            <div class="title-top">
                <span>优惠券</span>
                <i class="el-icon-arrow-down"></i>
            </div>
        </div>
        <div class="right"></div>
    </div>
</template>

<style scoped lang="less">
.page {
  width: 1400px;
  margin: 0 auto;
  padding: 30px 0 40px 0;
  display: flex;
}

.left {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 101px;
  height: 373px;
  background: #FFFFFF;
  padding: 15px 0;

  .item {
    display: flex;
    flex-direction: column;
    align-items: center;

    i {
      background: #C6C9CE;
      border: 1px solid #dcdfe6;
      border-radius: 100%;
      width: 18px;
      height: 18px;
      position: relative;
      cursor: pointer;
      display: inline-block;
      box-sizing: border-box;
    }

    i:after {
      width: 8px;
      height: 8px;
      border-radius: 100%;
      background-color: #fff;
      content: "";
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }

    span {
      margin-top: 5px;
    }

    &.active {
      i {
        background: #007BFF;
      }

      span {
        color: #007BFF;
      }
    }
  }

  .col {
    width: 0px;
    height: 36px;
    border: 1px dashed #C8CACF;
    margin: 10px 0;
  }
}

.content {
  padding: 25px;
  width: 886px;
  background: #FFFFFF;

  .title-top {
    .flex();
    justify-content: space-between;
    align-items: center;
    padding: 9px 15px;
    height: 36px;
    font-size: 14px;
    background: #F5F7F9;

    i {
      color: #C6C9CE;
      font-size: 18px;
    }
  }

  .select {
    padding: 25px 15px;

    .sel-item {
      margin-bottom: 20px;
      .flex();
      align-items: start;

      .label {
        margin-top: 7px;
        margin-right: 15px;
        display: flex;
        align-items: center;

        span {
          display: inline-block;
          width: 100px;
        }

        img {
          width: 15px;
          height: 15px;
        }
      }

      .value {
        cursor: pointer;
        .flex();

        .v-item {
          padding: 7px 25px;
          background: #F7FBFF;
          border: 1px solid #DBDBDB;
          font-weight: 400;
          font-size: 14px;
          color: #333333;
          margin-right: 14px;
          border-radius: 2px;

          &.active {
            border: 1px solid #27417C;
          }
        }

        .t-item {
          border: 1px solid #DBDBDB;
          padding: 12px 25px;
          border-radius: 2px;

          img {
            width: 100px;
            height: 100px;
          }

          .desc {
            margin-top: 14px;
          }

          &.active {
            border: 1px solid #27417C;
          }
        }


        /deep/ .el-input {
          width: 140px;
          margin-right: 14px;
        }

        /deep/ .el-textarea {
          width: 685px;
          height: 136px;
        }

        /deep/ .el-textarea__inner {
          height: 100% !important;
        }
      }
    }
  }

  .section-ctx-type {
    padding: 25px 15px;

    .invoice-info {
      margin-top: 31px;

      .info-item {
        .flex();
        margin-top: 26px;

        .info-label {
          width: 100px;
          text-align: right;
          margin-right: 18px;
          color: #666;

          span {
            color: #FF5F00;
          }
        }
      }
    }
  }

  .pay-group {
    .flex();

    .title {
      min-width: 120px;
      font-size: 14px;
      font-family: Roboto, Roboto;
      font-weight: 400;
      color: #666666;
    }

    .pay-items {
      flex: 1;
      .flex();

      .item {
        .flex();
        margin-right: 60px;
        cursor: pointer;

        .check-img {
          width: 21px;
        }

        .check-img-1 {
          display: none;
        }

        .marker-img {
          width: 39px;
          height: 39px;
          margin: 0 10px;
        }

        span {
          font-size: 16px;
          font-family: Roboto, Roboto;
          font-weight: 400;
          color: #000000;
        }

        .invoice {
          width: 105px;
          height: 33px;
          line-height: 33px;
          background: #FFFFFF;
          border-radius: 2px 2px 2px 2px;
          border: 1px solid #D6D6D6;
          font-family: Roboto, Roboto;
          font-weight: 400;
          font-size: 16px;
          text-align: center;
          color: #333333;
          font-style: normal;
          text-transform: none;
        }
      }

      .checked {
        .invoice {
          border: 1px solid @theme;
          color: @theme;
        }
      }
    }

    .peisong-items {
      .item {
        text-align: center;
        width: 144px;
        height: 40px;
        line-height: 40px;
        background: #ffffff;
        border-radius: 3px 3px 3px 3px;
        border: 1px solid @theme;
        font-size: 14px;
        font-family: Roboto, Roboto;;
        font-weight: bold;
        color: @theme;
      }
    }
  }
}
</style>