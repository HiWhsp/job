<script>
export default {
  name: "preSave-pay",
  data() {
    return {
      alipay_web: '',
      dialogWxPay: false,
      isWxPay: false,
      timer: null,
      prepaidAmount: '',
      info: {
        payType: '', // 支付方式
        prepaidAccount: 1, // 预付账户
        prepaidBenefits: '', // 预付福利
        prepaidAmount: '', // 预付金额
        prepaidGift: '', // 预付赠送金
        prepaidRemark: '', // 预付备注
        file: '', // 凭证
        message: '' // 凭证备注
      },
      // 发票信息
      invoice_info: {
        invoiceStatus: 1, //是否开票 0-不需要 1-需要发票
        invoiceType: '1', //发票类型：1-普通发票 2-专用发票
        titleType: '1', //抬头：1-个人 2-单位
        title: '', // 公司名称
        shibiema: '', // 识别码
        companyAddress: '', // 注册地址
        companyPhone: '', // 注册电话
        bankName: '', // 开户银行
        bankNo: '', // 银行账号
        email: '', // 电子邮箱
        orderId: '', // 关联订单
        fnum: '1',
        wsh: false
      },
      // 发票类型
      invoiceTypeOption: [
        {value: '0', title: '不开票', icon: ''},
        {value: '1', title: '普通发票', icon: ''},
        {value: '2', title: '专用发票', icon: ''},
      ],
      // 发票类型
      prepaidTypeOption: [
        {value: '0', title: '个人账户', icon: ''},
        {value: '1', title: '团体账户', icon: ''},
      ],
      payTypeOption: [
        {value: 'wx_scan', title: '微信支付', icon: require("@img/base/invite/wxPay.png")},
        {value: 'alipay_web', title: '支付宝支付', icon: require("@img/base/invite/zfbPay.png")},
        {value: 'offline', title: '对公转账', icon: require("@img/base/invite/duigong.png")},
      ],
      // 充值福利
      rechargeList: []
    }
  },
  // 页面卸载后清除定时器
  beforeDestroy() {
    this.clearInterval(this.timer);
  },
  mounted() {
    this.$api({
      url: 'recharge_list',
      method: 'post'
    }).then(res => {
      if (res.code === 200) {
        this.rechargeList = res.data;
      }
    })
  },
  methods: {
    do_toggle_paytype(item) {
      this.info.payType = item.value
    },
    do_toggle_prepaid(item) {
      this.info.prepaidAccount = item.value
    },
    do_toggle_prepaidAmount(item) {
      if(item != '其他') {
        this.info.prepaidAmount = item.price
        this.info.id = item.id;
        this.prepaidAmount = item.gift_amount
      }else {
        this.info.id = null;
        this.info.prepaidAmount = this.prepaidAmount
      }
    },
    // 发票信息选择
    do_toggle_invoice(item) {
      if (item != 0) {
        this.invoice_info.invoiceStatus = 1;
      } else {
        this.invoice_info.invoiceStatus = 0
      }
      this.invoice_info.invoiceType = item;
    },
    // 提交
    submit() {
      if(!this.info.payType) {
        this.$message({
          message: '请选择支付方式',
          type: 'warning'
        });
        return
      }
      if(!this.info.prepaidAmount) {
        this.$message({
          message: '请选择预付金额',
          type: 'warning'
        });
        return
      }
      const params = {
        f_type: this.invoice_info.invoiceStatus != 0 ? this.invoice_info.invoiceType : 0,
        title_type: this.invoice_info.titleType,
        reg_address: this.invoice_info.companyAddress,
        reg_tel: this.invoice_info.companyPhone,
        name: this.invoice_info.title,
        company_no: this.invoice_info.shibiema,
        bank_name: this.invoice_info.bankName,
        bank_no: this.invoice_info.bankNo,
        email: this.invoice_info.email,
        money: this.info.prepaidAmount,
        notes: this.info.prepaidRemark,
        utype: this.info.prepaidAccount,
        fnum: this.invoice_info.fnum,
        wsh: this.invoice_info.wsh ? 1 : '',
        id: this.info.id
      }
      this.$api({
        url: 'do_recharge',
        method: 'post',
        data: params
      }).then(res => {
        if (res.code === 200) {
          this.pay(res.data);
        }
      })
    },
    pay(data) {
      if (['wx_scan', 'alipay_web'].includes(this.info.payType)) {
        this.loading = this.$loading({
          lock: true,
          text: '订单正在生成中，请稍等！',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
      }
      this.$api({
        url: 'pay',
        method: 'post',
        data: {
          order_type: 'recharge_order',
          pay_type: this.info.payType,
          orderno: data.orderno,
          pay_pic: this.info.payType === 'offline' ? this.info.file : '',
          message: this.info.payType === 'offline' ? this.info.message : '',
        }
      }).then(res => {
        this.alipay_web = res.data.qrcode;
        if (this.info.payType == 'wx_scan') {
          this.loading.close();
          this.dialogWxPay = true;
          // 启动轮询
          this.polling(data.orderno);
        } else if (this.info.payType == 'alipay_web') {
          setTimeout(() => {
            this.loading.close();
            document.forms['alipaysubmit'].submit();
          }, 1000)
        }
      }).catch(() => {
        this.loading.close();
      })
    },
    // 轮询
    polling(orderno) {
      let that = this;
      this.timer = setInterval(function () {
        that.$api({
          url: 'order_pay_check',
          method: 'post',
          data: {
            orderno: orderno,
          } // 参数
        }).then(res => {
          if (res.code === 200) {
            clearInterval(that.timer);
            that.isWxPay = true;
            setTimeout(() => {
              that.$router.push('/preSave')
            }, 2000)
          }
        })
      }, 3000);
    },
    //上传相关
    upload_on_success(res, file) {
      //console.log("上传结果", res);
      let {code, data, msg} = res;
      if (code == 200) {
        this.info.file = res.data.url;
      }
    },
    wxPayClose() {
      clearInterval(this.timer);
    }
  }
}
</script>

<template>
  <div class="content">
    <div class="info-box">
      <div class="main-title">
        <span>立即充值</span>
      </div>
      <div class="pay-info">
        <div class="section-title">预付及支付</div>
        <div class="section-ctx">
          <div class="pay-group">
            <div class="title"><span>*</span>支付方式：</div>
            <div class="pay-items">
              <div class="item" v-for="(item, index) in payTypeOption" @click="do_toggle_paytype(item)"
                   :class="{ checked: info.payType == item.value }">
                <img class="img-check check-0 check-img check-img-0"
                     src="@/assets/img/base/invite/check0.png" alt=""/>
                <img class="img-check check-1 check-img check-img-1"
                     src="@/assets/img/base/invite/check1.png" alt=""/>
                <img class="marker-img" :src="item.icon" alt=""/>
                <span>{{ item.title }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="account" v-if="info.payType === 'offline'">
          <p>请转账至以下账户：</p>
          <div class="it">
            <p><span>户名：</span>{{ webConfig.company_name }}</p>
            <p><span>账号：</span>{{ webConfig.bank_no }}</p>
            <p><span>开户行：</span>{{ webConfig.bank_name }}</p>
          </div>
        </div>
        <div class="section-ctx" v-if="info.payType === 'offline'">
          <div class="pay-group">
            <div class="title">上传凭证 :</div>
            <div class="upload-ctx">
              <el-upload class="upload-wrap" accept="image/*" :show-file-list="false" name="file"
                         :on-success="upload_on_success"
                         action="https://jxjsjc.dx.hdapp.com.cn/api/upload"
                         :data="mix_upload_data">
                <img v-if="info.file" :src="info.file" class="avatar">
                <div class="box" v-else>
                  <i class="el-icon-plus avatar-uploader-icon"></i>
                </div>
              </el-upload>
            </div>
          </div>
        </div>
        <div class="section-ctx" v-if="info.payType === 'offline'">
          <div class="pay-group">
            <div class="title">备注：</div>
            <div class="pay-items">
              <el-input type="textarea"
                        placeholder="您可以填写欠款、回款的相关说明，以便平台和财务核对"
                        v-model="info.prepaidRemark" :rows="4" maxlength="200" show-word-limit>
              </el-input>
            </div>
          </div>
        </div>
        <div class="section-ctx">
          <div class="pay-group">
            <div class="title"><span>*</span>预付账户：</div>
            <div class="pay-items">
              <div class="item" v-for="(item, index) in prepaidTypeOption"
                   @click="do_toggle_prepaid(item)"
                   :class="{ checked: info.prepaidAccount == item.value }">
                <div class="invoice" style="width: 100%;padding: 0 10px;" v-if="item.title === '团体账户'">{{ item.title }}: {{ baseInfo.team_title }}</div>
                <div class="invoice" style="width: 100%;padding: 0 10px;" v-if="item.title === '个人账户'">{{ item.title }}</div>
              </div>
            </div>
          </div>
        </div>
<!--        <div class="section-ctx">-->
<!--          <div class="pay-group">-->
<!--            <div class="title"><span>*</span>预付福利：</div>-->
<!--            <div class="pay-items">-->
<!--              <el-input type="text" placeholder="请输入预付福利"-->
<!--                        v-model="info.prepaidBenefits"></el-input>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
        <div class="section-ctx">
          <div class="pay-group">
            <div class="title"><span>*</span>预付金额：</div>
            <div class="pay-items">
              <div class="item" v-for="(item, index) in rechargeList"
                   @click="do_toggle_prepaidAmount(item)"
                   :class="{ checked: info.prepaidAmount == item.price }">
                <div class="invoice">{{ item.price }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="section-ctx">
          <div class="pay-group">
            <div class="title"><span>*</span>预付赠送金：</div>
            <div class="pay-items">
              <el-input type="text" placeholder="预付赠送金" disabled
                        v-model="prepaidAmount"></el-input>
              <span style="margin-left: 5px">元</span>
            </div>
          </div>
        </div>
        <div class="section-ctx">
          <div class="pay-group">
            <div class="title"><span>*</span>预付备注：</div>
            <div class="pay-items">
              <el-input type="textarea"
                        placeholder="1、若以下没有您需要的发票类型，请备注所需发票类型；2、若需要加急开票，请填写【加急】字样；3、其他需求请留言"
                        v-model="info.prepaidRemark" :rows="4" maxlength="200" show-word-limit>
              </el-input>
            </div>
          </div>
        </div>
      </div>
      <div class="invoice-box">
        <div class="section-title">发票信息</div>
        <div class="section-ctx section-ctx-type">
          <div class="pay-group">
            <div class="title">是否开票 ：</div>
            <div class="pay-items">
              <el-radio-group v-model="invoice_info.invoiceType" @input="do_toggle_invoice">
                <el-radio :label="item.value" v-for="(item, index) in invoiceTypeOption">{{
                    item.title
                  }}
                </el-radio>
              </el-radio-group>
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
                <el-checkbox v-model="invoice_info.wsh" style="margin-left: 10px">无税号单位</el-checkbox>
              </div>
            </div>
            <div class="info-item">
              <div class="info-label"><span>*</span> 电子邮箱：</div>
              <div class="info-val">
                <el-input v-model="invoice_info.email"
                          placeholder="请填写电子邮箱"></el-input>
              </div>
            </div>
            <div class="info-item">
              <div class="info-label"><span>*</span> 发票张数</div>
              <div class="info-val">
                <el-radio-group v-model="invoice_info.fnum" fill="#A66600">
                  <el-radio label="1">一张发票</el-radio>
                  <el-radio label="2">多张发票</el-radio>
                </el-radio-group>
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
                <el-checkbox v-model="checked" style="margin-left: 10px">无税号单位</el-checkbox>
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
            <div class="info-item">
              <div class="info-label"><span>*</span> 电子邮箱：</div>
              <div class="info-val">
                <el-input v-model="invoice_info.email"
                          placeholder="请填写电子邮箱"></el-input>
              </div>
            </div>
            <div class="info-item">
              <div class="info-label"><span>*</span> 发票张数</div>
              <div class="info-val">
                <el-radio-group v-model="invoice_info.titleType" fill="#A66600">
                  <el-radio label="1">一张发票</el-radio>
                  <el-radio label="2">多张发票</el-radio>
                </el-radio-group>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="invoice-box">
        <el-button type="primary" @click="submit">提交</el-button>
      </div>
    </div>

    <div v-html="alipay_web" style="opacity: 0; width: 100px;"></div>

    <el-dialog title="微信支付" :visible.sync="dialogWxPay" width="30%" center :close-on-click-modal="false"
               @close="wxPayClose">
      <div class="wxPay-box">
        <img :src="alipay_web" alt="">
        <span>{{ isWxPay ? '已支付，正在跳转' : '请使用微信扫码支付' }}</span>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped lang="less">
.content {
  .main-title {
    .flex-between();
    padding: 0 32px;
    text-align: left;
    height: 56px;
    line-height: 56px;
    background: #ffffff;
    font-size: 16px;
    font-weight: bold;
    color: #333333;
    border-bottom: 1px solid #dbdbdb;
  }

  .info-box {
    width: 100%;

    .section-title {
      font-weight: bold;
      font-size: 22px;
      color: #333333;
    }

    .pay-info {
      background-color: #fff;
      padding: 14px 45px;

      .section-ctx {
        margin-top: 24px;

        .pay-group {
          .flex();

          .title {
            min-width: 120px;
            font-size: 14px;
            font-family: Roboto, Roboto;
            font-weight: 400;
            color: #666666;

            span {
              color: #E80000;
              margin-right: 3px;
            }
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
                font-weight: 400;
                color: #000000;
              }

              .invoice {
                width: 95px;
                height: 35px;
                border: 1px solid #D9D9D9;
                text-align: center;
                line-height: 35px;
                color: #818181;
              }
            }

            .checked {
              cursor: pointer;

              .check-0 {
                display: none !important;
              }

              .check-1 {
                display: block !important;
              }

              .invoice {
                background: #00479D;
                color: #fff;
              }
            }

            .el-input {
              width: 220px;
            }
          }
        }
      }

      .account {
        margin-top: 20px;
        display: flex;
        flex-direction: column;

        .title {
          width: 144px;
          height: 21px;
          font-weight: 400;
          font-size: 16px;
          color: #333333;
        }

        .it {
          margin-top: 10px;
          display: flex;

          p {
            min-width: 250px;

            font-weight: 400;
            font-size: 14px;
            color: #818181;

            span {
              font-weight: 400;
              font-size: 16px;
              color: #333333;
            }
          }
        }
      }

      .upload-ctx {
        .box {
          width: 100px;
          height: 100px;
          background: #FFFFFF;
          border-radius: 2px 2px 2px 2px;
          border: 1px solid #DEDEDE;
          text-align: center;
          line-height: 100px;
          font-size: 24px;
        }
      }
    }

    .invoice-box {
      background-color: #fff;
      padding: 34px 45px;


      .section-ctx {
        margin-top: 24px;

        .pay-group {
          .flex();

          .title {
            min-width: 120px;
            font-size: 14px;
            font-family: Roboto, Roboto;
            font-weight: 400;
            color: #666666;

            span {
              color: #E80000;
              margin-right: 3px;
            }
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
                font-weight: 400;
                color: #000000;
              }

              .invoice {
                width: 95px;
                height: 35px;
                border: 1px solid #D9D9D9;
                text-align: center;
                line-height: 35px;
                color: #818181;
              }
            }

            .checked {
              cursor: pointer;

              .check-0 {
                display: none !important;
              }

              .check-1 {
                display: block !important;
              }

              .invoice {
                background: #00479D;
                color: #fff;
              }
            }

            .el-input {
              width: 220px;
            }
          }
        }
      }

      .invoice-info {
        margin-top: 31px;

        .info-item {
          .flex();
          margin-top: 26px;

          .info-label {
            width: 100px;
            text-align: left;
            margin-right: 18px;
            color: #666;

            span {
              color: #FF5F00;
            }
          }

          .info-val {
            .el-input {
              width: 400px;
            }
          }
        }
      }

      /deep/ .el-button--primary {
        background-color: @theme;
        border-color: @theme;
        margin-left: 120px;
      }
    }
  }
}

.wxPay-box {
  display: flex;
  flex-direction: column;
  align-items: center;

  img {
    width: 200px;
    height: 200px;
  }

  span {
    margin-top: 10px;
  }
}
</style>
