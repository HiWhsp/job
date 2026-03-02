<template>
  <div class="modal-container">
    <el-dialog title="发票" width="580px" custom-class="cus-modal-wrap" :close-on-click-modal="true"
      :visible.sync="show_modal" :before-close="onbeforeclose" @closed="onclosed">
      <div class="modal-inner">
        <div class="sec-fapiao">
          <div class="sec-title">发票信息</div>
          <div class="fapiao-info">
            <div class="type-list">
              <!-- <div
                class="type-item"
                :class="{ active: fapiao_info.invoiceType == '' }"
                @click="do_fapiao_type('')"
              >
                不开票
              </div> -->
              <div
                class="type-item"
                :class="{ active: fapiao_info.invoiceType == 1 }"
                @click="do_fapiao_type(1)"
              >
                普通发票
              </div>
              <!-- <div
                class="type-item"
                :class="{ active: fapiao_info.invoiceType == 2 }"
                @click="do_fapiao_type(2)"
              >
                专用发票
              </div> -->
            </div>
          </div>

          <div
            class="fapiao-box"
            data-title="普通发票"
            v-if="fapiao_info.invoiceType == 1"
          >
            <div class="input-box">
              <div class="label">发票抬头类型:</div>
              <div class="val-box">
                <el-radio-group v-model="fapiao_info.titleType">
                  <el-radio :label="1">个人</el-radio>
                  <el-radio :label="2">企业</el-radio>
                </el-radio-group>
              </div>
            </div>
            <div class="input-box">
              <div class="label">发票抬头:</div>
              <div class="val-box">
                <el-input
                  clearable
                  v-model="fapiao_info.title"
                  placeholder="请填写准确的抬头名称"
                ></el-input>
              </div>
            </div>
            <div class="input-box" v-if="fapiao_info.titleType == 2">
              <div class="label">纳税人识别号:</div>
              <div class="val-box">
                <el-input
                  clearable
                  v-model="fapiao_info.shibiema"
                  placeholder="请填写纳税人识别号"
                ></el-input>
              </div>
            </div>
            <div class="input-box">
              <div class="label">电子邮箱:</div>
              <div class="val-box">
                <el-input
                  clearable
                  v-model="fapiao_info.email"
                  placeholder="请填写电子邮箱,用于接收电子发票"
                ></el-input>
              </div>
            </div>
          </div>

          <div
            class="fapiao-box"
            data-title="专用发票"
            v-if="fapiao_info.invoiceType == 2"
          >
            <div class="input-box">
              <div class="label">发票抬头:</div>
              <div class="val-box">
                <el-input
                  clearable
                  v-model="fapiao_info.title"
                  placeholder="请填写准确的抬头名称"
                ></el-input>
              </div>
            </div>
            <div class="input-box">
              <div class="label">纳税人识别号:</div>
              <div class="val-box">
                <el-input
                  clearable
                  v-model="fapiao_info.shibiema"
                  placeholder="请填写准确的纳税人识别号"
                ></el-input>
              </div>
            </div>
            <div class="input-box">
              <div class="label">注册地址:</div>
              <div class="val-box">
                <el-input
                  clearable
                  v-model="fapiao_info.companyAddress"
                  placeholder="请输入单位注册地址"
                ></el-input>
              </div>
            </div>
            <div class="input-box">
              <div class="label">注册电话:</div>
              <div class="val-box">
                <el-input
                  clearable
                  v-model="fapiao_info.companyPhone"
                  placeholder="请输入单位注册电话"
                ></el-input>
              </div>
            </div>
            <div class="input-box">
              <div class="label">开户银行:</div>
              <div class="val-box">
                <el-input
                  clearable
                  v-model="fapiao_info.bankName"
                  placeholder="请输入开户银行"
                ></el-input>
              </div>
            </div>
            <div class="input-box">
              <div class="label">银行账户:</div>
              <div class="val-box">
                <el-input
                  clearable
                  v-model="fapiao_info.bankNo"
                  placeholder="请输入银行账户"
                ></el-input>
              </div>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <button class="btn btn-ripple fit-text btn-1" @click="show_modal = false">取消</button>
        <el-button class="btn btn-ripple fit-text btn-2 btn-bg" @click="do_cancel()" :loading="loading">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "order-refund-modal",
  components: {},
  // props: [""],
  data() {
    return {
      show_modal: false,
      info: {},
      loading: false,
      fapiao_info: {
        invoiceStatus: 1, //是否开票 0-不需要 1-需要发票
        invoiceType: "1", //发票类型：1-普通发票 2-专用发票
        titleType: 1, //抬头：1-个人 2-单位
        title: "", //
        shibiema: "", //
        companyAddress: "", //
        companyPhone: "", //
        bankName: "", //
        bankNo: "", //
      },
    };
  },
  computed: {
    ...mapState([""]),
    // imgs() {
    //   let imgs = [];
    //   if (this.info && this.info.products) {
    //     imgs = this.info.products.map(v => v.image);
    //   }
    //   return imgs;
    // }
  },
  watch: {},
  created() {
    // this.throttle_do_cancel = this.mix_throttle(this.do_cancel, 1500)
  },
  methods: {
    init(info) {
      console.log(info);
      
      this.info = info;
      this.show_modal = true;
    },
    onbeforeclose() {
      this.show_modal = false;
    },
    onclosed() {
      // this.show_modal = false;
    },
        // 发票切换
    do_fapiao_type(val) {
      this.fapiao_info.invoiceType = val;

      if (val === "") {
        this.fapiao_info.invoiceStatus = 0;
      } else if (val === 1) {
        //普通
        this.fapiao_info.invoiceStatus = 1;
        this.fapiao_info.titleType = 1; //个人
      } else if (val === 2) {
        //专用发票
        this.fapiao_info.invoiceStatus = 1;
        this.fapiao_info.titleType = 2; //企业
      }
    },
    do_cancel() {
      if (this.fapiao_info.invoiceType == 1) {
        //普通发票
        if (!this.fapiao_info.titleType) {
          return alertErr("请选择发票抬头类型");
        }
        if (!this.fapiao_info.title) {
          return alertErr("请填写发票抬头");
        }
        if (!this.fapiao_info.email) {
          return alertErr("请填写电子邮箱");
        }
        if (this.fapiao_info.titleType == 2) {
          if (!this.fapiao_info.shibiema) {
            return alertErr("请填写纳税人识别号");
          }
        }
      } else if (this.fapiao_info.invoiceType == 2) {
        //增值税发票
        if (!this.fapiao_info.title) {
          return alertErr("请填写准确的抬头名称");
        }
        if (!this.fapiao_info.shibiema) {
          return alertErr("请填写准确的纳税人识别号");
        }
        if (!this.fapiao_info.companyAddress) {
          return alertErr("请输入单位注册地址");
        }
        if (!this.fapiao_info.companyPhone) {
          return alertErr("请输入单位注册电话");
        }
        if (!this.fapiao_info.bankName) {
          return alertErr("请输入开户银行");
        }
        if (!this.fapiao_info.bankNo) {
          return alertErr("请输入银行账户");
        }
      }
      this.loading = true;
      this.$api({
        url: '/service.php',
        method: 'get',
        data: {
          action: 'invoices_add',
          orderId: this.info.type==1?this.info.id:'',
          cardId: this.info.type!=1?this.info.id:'',
          type:this.info.type,
          ...this.fapiao_info
        },
      }).then((res) => {
        alert(res).then(() => {
          this.loading = false;
        });
        if (res.code == 200) {
          this.show_modal = false;
          this.$emit('confirm')
        }
      });
    }
  }
};
</script>


<style scoped lang="less">
/deep/ .el-dialog__header {
  padding: 16px 24px;
  border-bottom: 1px solid #eee;
  background: #F7F7F7;

  font-family: Poppins, Poppins;
  // font-weight: 600;
  font-size: 18px;
  color: #333333;

  .el-dialog__close {
    font-size: 20px;
  }
}

/deep/ .el-dialog__body {
  padding: 34px 60px 53px;
}

/deep/ .el-dialog__footer {
  text-align: center;
  padding-bottom: 60px;

  button {
    width: 120px;
    height: 32px;
    background: #FFFFFF;
    border-radius: 50px 50px 50px 50px;
    border: 1px solid #00306B;

    font-family: Arial, Arial;
    font-weight: 400;
    font-size: 14px;
    color: #00306B;

    &+button {
      margin-left: 16px;
    }
  }

  .btn-1 {}

  .btn-2 {}

  .btn-bg {
    background: #00306B;
    color: #ffffff;
  }
}

.cus-modal-wrap {
  .modal-inner {
    padding: 0;
    text-align: center;

    .sec-fapiao {
  padding-bottom: 55px;
  text-align: left;

  .sec-title {
    margin-bottom: 32px;
    padding-bottom: 16px;
    border-bottom: 1px solid #d5d8de;
    font-family: Microsoft YaHei, Microsoft YaHei;
    font-weight: 400;
    font-size: 24px;
    color: #333333;
  }

  .sec-ctx {
  }

  .fapiao-info {
    padding-left: 32px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 30px;
    .main-title {
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: 400;
      font-size: 16px;
      color: #1F1F1F;
    }

    .type-list {
      margin-left: 16px;
      display: flex;
      align-items: center;
      justify-content: center;

      .type-item {
        width: 105px;
        height: 33px;
        background: #ffffff;
        border: 1px solid #eeeeee;

        line-height: 33px;
        text-align: center;
        margin-right: 20px;
        cursor: pointer;

        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: 400;
        font-size: 16px;
        color: #333333;

        &.active {
          // color: #FFA58D;
          border: 1px solid #ffa58d;
        }

        &:hover {
        }
      }
    }
  }

  .fapiao-box {

    .input-box {
      display: flex;
      align-items: center;
      height: 40px;
      margin-bottom: 16px;
      .label {
        width: 100px;
        text-align: right;
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: 400;
        font-size: 14px;
        color: #1F1F1F;

        &::before {
          content: "*";
          color: #f00;
          margin-right: 4px;
        }
      }
      .val-box {
        flex: 1;
        margin-left: 16px;
      }
    }
  }
}
    .success-box {
      width: 71px;
      height: 71px;
      margin: 0 auto;
      img {
        width: 71px;
        height: 71px;
      }
    }

    .text-1 {
      margin-top: 20px;
      font-family: Arial, Arial;
      font-weight: 400;
      font-size: 22px;
      color: #000000;
    }

    .text-2 {
      margin-top: 15px;
      font-family: Arial, Arial;
      font-weight: 400;
      font-size: 14px;
      color: #505050;
    }
  }
}
</style>
