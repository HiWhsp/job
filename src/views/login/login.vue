<template>
    <div class="page flex-center">
      <div class="inner-content flex">
        <div class="left-view">
          <div class="logo-box">
            <img src="@/assets/img/logo.png" class="logo" />
          </div>
          <div class="title">欢迎回来</div>
        </div>
  
        <div class="inner flex-center">
          <div class="title">奕诚教育答疑系统</div>
          <div class="title">管理后台</div>
          <div class="input-box">
            <span>
              <img src="@/assets/img/login-user.png" class="icon" />
            </span>
            <input
              type="text"
              placeholder="请输入账号"
              v-model="form.username"
              @keyup.enter="do_submit()"
            />
          </div>
          <div class="input-box">
            <span>
              <img src="@/assets/img/login-pass.png" class="icon" />
            </span>
            <input
              type="password"
              placeholder="请输入密码"
              v-model="form.password"
              @keyup.enter="do_submit()"
            />
          </div>
          <!-- <div class="input-box">
                      <span>验证码</span>
                      <input type="text" placeholder v-model="form.code" @keyup.enter="do_submit()" />
                      <img class="code" :src="verify_pic" alt="" @click="query_code()" />
                  </div> -->
          <div class="btn-box">
            <el-button
              class="btn-ripple btn-ripple"
              :loading="loading"
              @click="throttle_do_submit()"
              >登录</el-button
            >
          </div>
        </div>
      </div>
      <div class="footer-box">
        <div class="html-box">
          <a href="https://beian.miit.gov.cn/" target="_blank">备案号</a>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "servicePage",
    components: {},
    data() {
      return {
        is_test: true,
  
        form: {
          username: "", //admin
          password: "", //yjd@2025...
          code: "", //
          uuid: "",
        },
  
        // beian_info: '',
        verify_pic: "",
  
        loading: false,
      };
    },
    computed: {},
  
    created() {
      this.throttle_do_submit = this.mix_throttle(this.do_submit, 1000);
      // this.query_config()
      this.query_code();
    },
    methods: {
      query_code() {
        this.$api({
          url: "/captchaImage",
          method: "get",
          data: {},
        }).then((res) => {
          this.$log("登录-获取验证码", res);
          if (res.code == 200) {
            this.verify_pic = "data:image/png;base64," + res.img;
            this.form.uuid = res.uuid;
          } else {
            // alert(res)
          }
        });
      },
  
      // query_config() {
      // 	this.$api({
      // 		url: '/',
      // 		method: 'get',
      // 		data: {
      // 			action: "setting_getConfig",
      // 		}
      // 	}).then((res) => {
      // 		if (res.code == 200) {
      // 			if (res.data.comBeian) {
      // 				this.beian_info = res.data.comBeian
      // 			}
      // 		}
      // 	});
      // },
  
      do_submit() {
        if (this.is_test) {
          this.to_test_success();
        }
  
        // let { phone, password } = this.form;
        // let phoneReg = /^1[3-9]\d{9}$/;
        if (!this.form.username) {
          alert("请输入账号");
          return;
        }
        if (!this.form.password) {
          alert("请输入密码");
          return;
        }
  
        this.loading = true;
  
        this.$api({
          url: "/login",
          method: "post",
          data: {
            username: this.form.username,
            password: this.form.password,
            code: this.form.code,
            uuid: this.form.uuid,
          },
        }).then((res) => {
          this.$logjson("登录", res);
          alert(res).then(() => {
            this.loading = false;
          });
  
          if (res.code == 200) {
            let token = res.token;
            this.$store.commit("set_vuex_token", token);
            //
            this.$api({
              url: "/getInfo",
              method: "get",
              data: {},
            }).then((res) => {
              console.log("动态获取用户信息", res);
              if (res.code == 200) {
                this.$store.commit("set_vuex_user", res);
                this.to_success();
  
                //   this.$router.push("/company-list");
  
                //
  
                // this.$store.commit("setAdminUserInfo", res.data);
  
                // localStorage.setItem("is_permission_refresh", 0)
                // if (res.data.isSup) {
                // 	//超级管理员
                // 	this.$router.push("/banner-list");
                // } else {
                // 	this.$router.push("/banner-list");
                // }
              } else {
                alert(res);
              }
            });
          } else {
            this.query_code();
          }
        });
      },
  
      to_test_success() {
          this.$confirm("测试场景-确认跳转页面？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
              this.$router.push("/company-list");
          })
          .catch(() => {
            alertInfo("已取消跳转");
          });
      },
      to_success() {
        this.$router.push("/company-list");
      },
    },
  };
  </script>
  
  <style scoped lang="less">
  .page {
    position: relative;
    width: 100vw;
    height: 100vh;
  
    background: #ffffff;
  
    .inner-content {
      width: 1200px;
      height: 706px;
      background: #ffffff;
      box-shadow: 0px 0px 4px 1px #f0f4f5;
      border-radius: 16px 16px 16px 16px;
      border: 1px solid #f4f5f9;
  
      .left-view {
        width: 419px;
        height: 706px;
        background: url("~@/assets/img/bg.png") no-repeat center / cover;
        padding: 40px 0;
        .logo-box {
          margin: 0 auto;
          width: 200px;
          height: 68px;
          display: flex;
          align-items: center;
          justify-content: center;
          .logo {
            width: 100%;
            height: 100%;
          }
        }
        .title {
          text-align: center;
          margin-top: 152px;
          font-size: 24px;
          font-family: PingFang SC, PingFang SC;
          font-weight: 800;
          font-size: 40px;
          color: #ffffff;
        }
      }
  
      .inner {
        flex: 1;
        overflow: hidden;
        height: 706px;
        flex-direction: column;
        padding: 100px 160px;
  
        .title {
          text-align: center;
  
          font-family: PingFang SC, PingFang SC;
          font-weight: 800;
          font-size: 40px;
          color: #008a32;
          line-height: 52px;
        }
  
        .input-box {
          position: relative;
          margin-top: 40px;
          width: 100%;
          height: 64px;
          background: #f8f8f8;
          border-radius: 8px 8px 8px 8px;
  
          display: flex;
          align-items: center;
          justify-content: space-between;
  
          span {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            width: 60px;
  
            .icon {
              width: 24px;
            }
          }
  
          input {
            flex: 2;
            height: 100%;
            padding-left: 0px;
            font-size: 16px;
            color: #000;
            border: none;
            background: #f8f8f8;
          }
  
          .code {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translate(0, -50%);
            width: 120px;
            height: 40px;
            border: none;
            cursor: pointer;
          }
        }
  
        .agree-box {
          text-align: left;
          margin: 40px 0;
          display: flex;
  
          align-items: center;
  
          justify-content: space-between;
  
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          line-height: 24px;
          color: #999999;
  
          a {
            color: #000;
          }
        }
  
        .btn-box {
          margin-top: 80px;
  
          button {
            width: 320px;
            height: 56px;
            background: linear-gradient(180deg, #00b441 0%, #008a32 100%);
            border-radius: 33px 33px 33px 33px;
            font-family: PingFang SC, PingFang SC;
            font-weight: 500;
            font-size: 16px;
            color: #ffffff;
          }
        }
      }
    }
  }
  
  .footer-box {
    position: fixed;
    text-align: center;
    left: 0;
    right: 0;
    bottom: 0;
    height: 35px;
    line-height: 35px;
    background: #fff;
  
    a {
      font-size: 14px;
      color: #000000;
  
      &:hover {
        color: #f00;
      }
    }
  
    /deep/ a {
      font-size: 14px;
      color: #000000;
  
      &:hover {
        color: #f00;
      }
    }
  }
  </style>