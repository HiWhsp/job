<template>
  <div class="page">
    <div class="register-container">
      <!-- 会员注册标题 -->
      <div class="card-title">
        <span class="title-text">需要注册购买会员，才能购买爆款产品哦~</span>
      </div>

      <!-- 步骤条 -->
      <div class="step-bar">
        <div class="bar-item">01 填写注册信息</div>
        <div class="bar-item">02 提交并支付</div>
        <div class="bar-item">03 会员开通完成</div>
      </div>

      <!-- 注册表单 -->
      <el-form ref="registerForm" :model="registerForm" :rules="registerRules" class="register-form"
               label-width="100px">
        <el-form-item label="姓名" prop="firstName" required>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-input v-model="registerForm.firstName" placeholder="请输入姓"></el-input>
            </el-col>
            <el-col :span="12">
              <el-input v-model="registerForm.lastName" placeholder="请输入名字"></el-input>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="公司名称" prop="company" required>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-input v-model="registerForm.company" placeholder="请输入公司名称"></el-input>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="地址" required>
          <el-row :gutter="24" style="margin-bottom: 12px;">
            <el-col :span="12">
              <el-input v-model="registerForm.zipCode" placeholder="邮政编码"></el-input>
            </el-col>
          </el-row>
          <el-row :gutter="24" style="margin-bottom: 12px;">
            <el-col :span="12">
              <el-select v-model="registerForm.countryId" placeholder="请选择国家">
                <el-option v-for="item in countryList" :key="item.id" :label="item.name"
                           :value="item.id"></el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row :gutter="24" style="margin-bottom: 12px;">
            <el-col :span="12">
              <!--              <el-input v-model="registerForm.local" placeholder="省/市/区、县"></el-input>-->
              <area_select ref="area_select" @change="changeSelectAddress"/>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="24">
              <el-input v-model="registerForm.address" placeholder="详细地址"></el-input>
            </el-col>
          </el-row>
        </el-form-item>

        <el-row :gutter="24">
          <el-col :span="13">
            <el-form-item label="电话号码" prop="phone" required>
              <el-input v-model="registerForm.phone" placeholder="请输入电话号码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="Instagram" prop="instagram" required>
              <el-input v-model="registerForm.instagram" placeholder="请输入账号"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="13">
            <el-form-item label="电子邮件" prop="email" required>
              <el-input v-model="registerForm.email" placeholder="请输入电子邮件"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="Facebook" prop="facebook" required>
              <el-input v-model="registerForm.facebook" placeholder="请输入账号"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="密码" prop="pass" required>
          <el-row :gutter="24" style="margin-bottom: 12px;">
            <el-col :span="12">
              <el-input v-model="registerForm.pass" placeholder="请输入密码" type="password"></el-input>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-input v-model="registerForm.newPassword" placeholder="请再次输入密码" type="password"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>

      <!-- 会员费用信息 -->
      <!--      <div class="membership-card">-->
      <!--        <div class="wrap">-->
      <!--          <div class="top flex">-->
      <!--            <div class="price-section">-->
      <!--              <h3>会员制度 📝</h3>-->
      <!--              <div class="column-flex-center price-info">-->
      <!--                <p class="price">￥365</p>-->
      <!--                <p class="date">会员期限：12个月</p>-->
      <!--              </div>-->
      <!--            </div>-->
      <!--            <div class="terms">-->
      <!--              <h3>会员权益说明</h3>-->
      <!--              <p>这里可以填写会员权益的具体描述信息……</p>-->
      <!--            </div>-->
      <!--          </div>-->
      <!--          <div class="pay-group">-->
      <!--            <div class="title">支付方式：</div>-->
      <!--            <div class="pay-items">-->
      <!--              <div v-for="(item, index) in pay_method_list" :class="{ checked: pay_type_value == item.value }"-->
      <!--                   class="item"-->
      <!--                   @click="do_toggle_paytype(item)">-->
      <!--                <img alt="" class="img-check check-0 check-img check-img-0" src="@/assets/image/common/check0.png"/>-->
      <!--                <img alt="" class="img-check check-1 check-img check-img-1" src="@/assets/image/common/check1.png"/>-->
      <!--                <span>{{ item.title }}</span>-->
      <!--                <img :src="item.icon" alt="" class="marker-img"/>-->
      <!--              </div>-->
      <!--            </div>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </div>-->

      <!-- 同意条款 & 按钮 -->
      <div class="agreement-box">
        <div class="wrap">
          <el-checkbox v-model="registerForm.agree" class="agreement">
            我已阅读并同意 <a href="#" @click="terms_open(92)">《隐私政策》</a>
          </el-checkbox>

          <el-button :disabled="!registerForm.agree" class="submit-btn" type="primary" @click="do_confirm_submit">
            支付并注册
          </el-button>

          <!-- 已有账号提示 -->
          <div class="login-link">
            我有账号？ <a href="/login">去登录</a>
          </div>
        </div>
      </div>
    </div>
    <terms_modal ref="terms_modal"/>
  </div>
</template>

<script>
import terms_modal from "@/components/account/terms_modal.vue";
import area_select from "@/components/address/area_select.vue"; //协议弹窗
export default {
  data() {
    return {
      pay_type_value: '',
      registerForm: {},
      registerRules: {
        name: [
          {required: true, message: "请输入姓名", trigger: "blur"},
          {min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur"},
        ],
        company: [
          {required: true, message: "请输入公司名称", trigger: "blur"},
          {min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur"},
        ],
        zipCode: [
          {required: true, message: "请输入邮政编码", trigger: "blur"},
          {min: 6, max: 6, message: "长度为 6 位", trigger: "blur"},
        ],
        phone: [
          {required: true, message: "请输入电话号码", trigger: "blur"},
          {min: 11, max: 11, message: "长度为 11 位", trigger: "blur"},
        ],
        email: [
          {required: true, message: "请输入邮箱", trigger: "blur"},
          {type: "email", message: "请输入正确的邮箱地址", trigger: ["blur", "change"]},
        ],
        password: [{required: true, message: "请输入密码", trigger: "blur"}],
        newPassword: [{required: true, message: "请再次输入密码", trigger: "blur"}],
        agree: [{required: true, message: "请同意隐私政策", trigger: "change"}],
        instagram: [{required: true, message: "请输入Instagram账号", trigger: "blur"}],
        facebook: [{required: true, message: "请输入Facebook账号", trigger: "blur"}]
      },
      countryList: [],
      pay_method_list: [
        {value: 'weixin', title: '微信支付', icon: require('@img/pay-method/type-weixin.png')},
        {value: 'zhifubao', title: '支付宝支付', icon: require('@img/pay-method/type-zfb.png')},
        // { value: 'xianxia', title: '线下转款', icon: require('@img/pay-method/type-xianxia.png') },
        {value: 'paypal', title: 'PayPal', icon: require('@img/pay-method/type-paypal.png')},
        // {value: 'yue', title: '余额支付', icon: require('@img/pay-method/type-yue.png')},
      ],
    };
  },
  components: {
    area_select,
    terms_modal
  },
  mounted() {
    this.$api({
      url: '/service.php',
      method: 'get',
      data: {
        action: 'index_getArea',
        country: 1
      },
    }).then(res => {
      if (res.code == 200) {
        this.countryList = res.data
      }
    })
  },
  methods: {
    do_toggle_paytype(item) {
      this.pay_type_value = item.value
      this.payType = item.title
      let value = item.title
      if (value == "余额支付") {
        if (this.baseInfo.is_pay_pass == 0) {
          //未设置支付密码
          this.$refs.balance_password_set_modal.init(this.baseInfo);
        } else if (this.total_balance < this.real_payment_money) {
          //余额不足提示
          this.$refs.balance_pay_disable_modal.init({
            money: this.real_payment_money,
          });
        }
      }
    },

    do_confirm_submit() {
      this.$refs.registerForm.validate((valid) => {
        if (valid) {
          this.login();
          // if (this.pay_type_value) {
          //   this.login();
          // } else {
          //   alertErr("请选择支付方式");
          // }
        }
      })
    },

    login() {
      this.$api({
        url: '/service.php',
        method: 'get',
        data: {
          action: 'login_emailAndPhoneReg',
          ...this.registerForm
        },
      }).then(res => {
        if (res.code == 200) {
          this.$message.success(res.msg);
          setTimeout(() => {
            this.$router.push('/login');
          }, 2000)
          // this.do_submit();
        }
      })
    },

    do_submit() {
      this.$api({
        url: '/service.php',
        method: 'get',
        data: {
          action: 'orders_create',
          ...this.registerForm,
          billInfo: JSON.stringify(this.form)
        },
      }).then((res) => {
        if (res.code == 200) {
          let {id, orderNo} = res.data;
          this.order_id = orderNo;
          this.do_order_pay();
        }
      });
    },

    terms_open(id) {
      this.$refs.terms_modal.init(id);
    },
    //更新当前父组件数据
    changeSelectAddress(data) {
      this.$log("更新省市区数据", data);
      let {sheng, shi, qu} = data;
      // this.registerForm.province = sheng.title;
      // this.registerForm.city = shi.title;
      // this.registerForm.area = qu.title;

      this.registerForm.province = sheng.id;
      this.registerForm.city = shi.id;
      this.registerForm.areaId = qu.id;
      // debugger
    },
  }
};
</script>

<style scoped>
.page {
  padding: 30px 0;
}

.register-container {
  width: 1400px;
  margin: auto;
  border-radius: 8px;
}

.card-title {
  height: 108px;
  background: #e9e9e9;
  color: #959595;
  font-size: 14px;
  padding: 10px;
  display: flex;
  align-items: center;

  .title-text {
    margin-left: 180px;
  }
}

.step-bar {
  padding: 30px;
  display: flex;
  justify-content: center;
  background-color: #fff;

  .bar-item {
    text-align: center;
    line-height: 54px;
    width: 258px;
    height: 54px;
    font-size: 16px;
    background-image: url("~@/assets/image/home/step.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }

  .bar-item:first-child {
    background-image: url("~@/assets/image/home/step-1.png");
  }
}

.register-form {
  background: white;
  padding: 20px 196px;

  .el-row {
    margin-left: 0 !important;
  }
}

.membership-card {
  padding: 20px;
  background: white;

  .wrap {
    padding: 50px;
    background-color: #F5F7FA;

    .top {
      align-items: start;

      .price-section {
        width: 444px;
        height: 263px;
        background: #FFFFFF;
        border: 2px solid #000000;

        h3 {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 65px;
          background: rgba(29, 32, 136, 0.051);
          font-size: 22px;
        }

        .price-info {
          height: 196px;
          justify-content: center;

          .price {
            color: #000;
            font-weight: bold;
            font-size: 40px;
            margin-bottom: 10px;
          }

          .date {
            font-weight: 400;
            font-size: 20px;
            color: #888888;
          }
        }
      }

      .terms {
        flex: 1;
        margin-left: 32px;

        h3 {
          font-weight: 700;
          font-size: 18px;
          color: #000000;
          margin-bottom: 16px;
        }

        p {
          font-size: 14px;
          color: #3D3D3D;
        }
      }
    }

    .pay-group {
      display: flex;
      flex-direction: column;
      margin-top: 80px;

      .title {
        font-size: 16px;
        min-width: 120px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        font-weight: 400;
        color: #000;
        margin-bottom: 20px;
      }

      .pay-items {
        flex: 1;
        display: flex;
        align-items: center;

        .item {
          display: flex;
          align-items: center;
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
            margin: 0 10px;
          }

          span {
            margin-left: 10px;
            font-size: 16px;
            font-family: Microsoft YaHei-Regular, Microsoft YaHei;
            font-weight: 400;
            color: #000;
          }
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
      }
    }
  }
}

.agreement-box {
  padding-bottom: 50px;

  .wrap {
    width: 478px;
    margin: 0 auto;
  }

  background-color: #fff;

  .agreement {
    margin-top: 20px;

    a {
      color: #000;
    }
  }

  .submit-btn {
    width: 100%;
    height: 63px;
    background: #000000;
    margin-top: 20px;
    border: none;
    font-weight: 700;
    font-size: 20px;
    color: #FFFFFF;
  }

  .login-link {
    font-size: 18px;
    text-align: center;
    margin-top: 60px;

    a {
      color: red;
      border-bottom: 1px solid #A9151C;
    }
  }


}
</style>
