<template>
  <div class="container">

    <div class="center">
      <div class="login-type">
        <div class="type active" @click="loginTypeClick('PASS')">供应商登录</div>
      </div>

      <div class="login-wrap">
        <div class="input-wrap">
          <div class="item">
            <img src="@/assets/img/login/phone.png" alt="">
            <el-input clearable v-model="form.phone" placeholder="手机号"></el-input>
          </div>
          <div class="item">
            <img src="@/assets/img/login/pass.png" alt="">
            <el-input clearable v-model="form.password" type="password" placeholder="密码"></el-input>
          </div>
          <div class="item">
            <el-button type="primary" @click="login_submit">登录</el-button>
          </div>
        </div>
      </div>

      <div class="register-box">
        <p class="pointer">还没账号？<span @click="dialogVisible = true">立即成为供应商</span></p>
        <router-link to="/retrieve?type=supplier">忘记密码</router-link>
      </div>
    </div>

    <el-dialog title="供应商入驻" :visible.sync="dialogVisible" width="900px" center>
      <div class="dialog-box">
        <p class="title">立即申请成为嘉析检测的合作伙伴</p>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="公司名称：" prop="name">
            <el-input v-model="ruleForm.name" placeholder="请输入公司名称"></el-input>
          </el-form-item>
          <el-form-item label="联系人：" prop="name">
            <el-input v-model="ruleForm.name" placeholder="请输入联系人姓名"></el-input>
          </el-form-item>
          <el-form-item label="联系电话：" prop="name">
            <el-input v-model="ruleForm.name" placeholder="请输入联系电话"></el-input>
          </el-form-item>
          <el-form-item label="服务方向：" prop="region">
            <el-select v-model="ruleForm.region" placeholder="请选择服务方向">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择地区：" prop="region">
            <el-select v-model="ruleForm.region" placeholder="请选择地区">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="详细地址：" prop="name">
            <el-input v-model="ruleForm.name" placeholder="请输入详细地址"></el-input>
          </el-form-item>
          <el-form-item label="备注：" prop="desc">
            <el-input type="textarea" v-model="ruleForm.desc" placeholder="请输入"></el-input>
          </el-form-item>
        </el-form>
        <div class="agreement">
          <el-checkbox v-model="ruleForm.checked">已阅读并同意《平台注册协议》、《某某协议》、《某某协议》</el-checkbox>
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import QRCode from "qrcodejs2";
import CryptoJS from "crypto-js";
import {mapState} from "vuex";

export default {
  name: "login",
  data() {
    return {
      dialogVisible: false,
      mode: "账号密码", //微信扫码
      tabType: "PASS", //登录方式
      agreed: false,
      savePass: true, //记住密码

      form: {
        type: "0", //类型：0-账号密码 登录     1-账号 验证码登录
        phone: "",
        password: "",
        code: ""
      },

      interval_wx_scan: null,

      ruleForm: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      rules: {
        name: [
          {required: true, message: '请输入活动名称', trigger: 'blur'},
          {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
        ],
        region: [
          {required: true, message: '请选择活动区域', trigger: 'change'}
        ],
        date1: [
          {type: 'date', required: true, message: '请选择日期', trigger: 'change'}
        ],
        date2: [
          {type: 'date', required: true, message: '请选择时间', trigger: 'change'}
        ],
        type: [
          {type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change'}
        ],
        resource: [
          {required: true, message: '请选择活动资源', trigger: 'change'}
        ],
        desc: [
          {required: true, message: '请填写活动形式', trigger: 'blur'}
        ]
      }
    }
  },
  computed: {
    ...mapState(["logo"]),
  },

  watch: {
    mode(val) {
      if (val == "微信扫码") {
        this.queryWxQrcode();
      } else {
        this.clearIntervalWx();
      }
    },
  },
  mounted() {
    this.setView();
  },
  beforeDestroy() {
    this.clearIntervalWx();
  },
  methods: {
    setView() {
      if (localStorage.getItem("save1")) {
        //console.log("回显密码");
        var save1 = localStorage.getItem("save1");
        var save2 = localStorage.getItem("save2");

        this.form.phone = this.decodeString(save1);
        this.form.password = this.decodeString(save2);
      }
    },
    //移除轮询
    clearIntervalWx() {
      clearInterval(this.interval_wx_scan);
      this.interval_wx_scan = null;
    },

    //获取微信二维码地址
    queryWxQrcode() {
      this.$api("jssdk_getCodeUrl", {}).then((res) => {
        this.wx_scaner_marker = res.marker;

        this.generateImage();
      });
    },

    //生成微信二维码
    generateImage() {
      this.$refs.qrCodeUrl.innerHTML = "";

      let qrcode = new QRCode(this.$refs.qrCodeUrl, {
        text: this.wx_scaner_marker, // 需要转换为二维码的内容
        width: 200,
        height: 200,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
      });
      //console.log(qrcode);

      this.interval_wx_scan = setInterval(function () {
        that.checkScanWxcode();
      }, 2000);
    },

    //查询微信二维码
    checkScanWxcode() {
      this.$api("users_codeLogin", {
        wx_scaner_marker: this.wx_scaner_marker, //扫码者标识
      })
          .then((res) => {
            if (res.code == 1) {
              // if (res.data.data.user != undefined && res.data.data.user.id) {
              //   clearInterval(this.interval_token);
              //   this.interval_token = null;
              //   let hasBindPhone = false; //是否绑定手机号
              //   if (hasBindPhone) {
              //     if (index == 0) {
              //       this.$store.dispatch("setToken_active", {
              //         admin_token: res.data.data.user.remember_token,
              //       });
              //       this.getUserInfoFn();
              //     }
              //   } else {
              //     if (index == 0) {
              //       this.scan_qrcode();
              //       this.$Notice.error({
              //         title: "提示",
              //         desc: "绑定手机号后请重新扫码登录",
              //       });
              //       this.$Message.error("绑定手机号后请重新扫码登录");
              //     } else {
              //       this.bd_mobile = true;
              //       this.$Message.error("请先绑定手机号后重新扫码登录");
              //     }
              //   }
              // }
            }
          })
          .catch((err) => {
            // reject(err)
            //console.log(err);
          });
    },


    //加密
    encodeString(code) {
      var secretKey = "com.beiyinlai.key";

      // //console.log("CryptoJS", CryptoJS);
      var secretKey = "com.beiyinlai.key";
      var afterEncrypt = CryptoJS.DES.encrypt(code, CryptoJS.enc.Utf8.parse(secretKey), {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      }).toString();
      //console.log("加密 afterEncrypt", afterEncrypt); //8/nZ2vZXxOzPhU7ZHBwz7w==

      return afterEncrypt;
    },

    //解密
    decodeString(code) {
      var secretKey = "com.beiyinlai.key";
      //console.log("CryptoJS", CryptoJS);

      var afterDecrypt = CryptoJS.DES.decrypt(code, CryptoJS.enc.Utf8.parse(secretKey), {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      }).toString(CryptoJS.enc.Utf8);

      //console.log("解密 afterDecrypt", afterDecrypt); //encryptCode

      return afterDecrypt;
    },

    // 登录
    login_submit() {
      // debugger;
      let {phone, password} = this.form;
      let reg_phone = /^1[3-9]\d{9}$/;
      let reg_email = /^([a-zA-Z\d])(\w|\-)+@[a-zA-Z\d]+\.[a-zA-Z]{2,4}$/;

      //手机号密码登录
      if (this.tabType == "PASS") {
        if (!reg_phone.test(this.form.phone)) {
          alertErr("请输入正确的手机号");
          return;
        }
        if (!this.form.password) {
          alertErr("请输入密码");
          return;
        }

        this.$api({
          url: "store/login",
          method: "post",
          data: {
            phone: phone,
            password: password,
          }
        }).then((res) => {
          //console.log("登录", res);
          let {code, data, message} = res;
          if (code == 0) {
          } else if (code == 200) {
            if (this.savePass) {
              localStorage.setItem("save1", this.encodeString(this.form.phone));
              localStorage.setItem("save2", this.encodeString(this.form.password));
            } else {
              localStorage.setItem("save1", "");
              localStorage.setItem("save2", "");
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("isSupplier", 'true');
            this.$store.dispatch("getSupplierInfo");

            // this.$router.push("/");
            this.$router.push("/supplier-home");
          }
        });
      } else {
        //手机号验证码登录
        if (!code) {
          alertErr("请输入短信验证码");
          return;
        }

        this.$api("users_codeLogin", {
          phone,
          code,
        }).then((res) => {
          //console.log("登录", res);
          let {code, data, message} = res;

          if (code == 1) {
            this.$store.commit("set_baseInfo", data);
            this.$store.dispatch("getUserloginedInfo");

            this.$router.push("/");
          }
        });
      }
    },

    loginTypeClick(type) {
      this.tabType = type;
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$api({
            url: 'store/register',
            method: 'post',
            data: {
              company_name: '海视频',
              name: '姓名1',
              phone: '15100000002',
              password: '123456',
              service_info: '服务信息',
              province: '北京',
              city: '北京',
              area: '朝阳区',
              address: '地址地址',
              notes: '123'
            }
          }).then(res => {
            alertSucc(res.msg);
            this.$router.push('/supplier-status')
          })
        } else {
          return false;
        }
      });
    },
  }
}
</script>

<style lang="less" scoped>
.container {
  position: relative;
  width: 100%;
  height: 700px;
  background-image: url("~@/assets/img/login/login-bg.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.center {
  position: absolute;
  right: 262px;
  top: 50%;
  margin-top: -192px;
  width: 447px;
  height: 384px;
  background: #FFFFFF;
  box-shadow: 0px 0px 6px 1px rgba(0, 0, 0, 0.16);
  border-radius: 12px 12px 12px 12px;
  padding: 30px 60px;

  .login-type {
    margin: 0 20px 45px;
    display: flex;
    align-items: center;
    justify-content: center;

    .type {
      font-size: 18px;
      font-weight: 400;
      color: #818181;
      cursor: pointer;
      margin-bottom: 10px;

      &:after {
        content: "";
        display: block;
        width: 100%;
        height: 2px;
        background: #fff;
        margin-top: 10px;
      }

      &.active {
        color: #00479D;
        font-weight: bold;
      }
    }
  }

  .login-wrap {
    .input-wrap {
      .item {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 20px;

        img {
          position: absolute;
          width: 22px;
          height: 24px;
          z-index: 2;
          left: 16px;
        }

        .wx-wrap {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 158px;
          height: 158px;
          background-image: url("~@/assets/img/login/wx-card.png");
          background-repeat: no-repeat;
          background-size: 100% 100%;

          .wx-code {
            position: absolute;
            width: 132px;
            height: 132px;
          }
        }

        /deep/ .el-input__inner {
          padding-left: 50px;
        }

        .el-button {
          width: 100%;
        }

        .el-button--primary {
          background: #00479D;
          border-color: #00479D;
        }
      }
    }
  }

  .register-box {
    .flex();
    justify-content: space-between;
    margin-top: 30px;

    span {
      color: #00479D;
    }

    a {
      font-weight: 400;
      font-size: 14px;
      color: #333333;

      span {
        color: #00479D;
      }
    }
  }

  .wx-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-weight: 400;
    font-size: 14px;
    color: #333333;

    p {
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 118px;
      margin-top: 15px;
      font-weight: 400;
      font-size: 12px;
      color: #00479D;
    }
  }
}

.dialog-box {
  padding: 0 100px;

  .title {
    font-weight: bold;
    font-size: 23px;
    color: #00479D;
    text-align: center;
    margin-bottom: 40px;
  }
}
</style>
