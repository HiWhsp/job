<template>
  <div class="page flex-center">
    <div class="inner-content flex">
      <div class="left-view">
        <div class="logo-box">
          <img src="@/assets/img/logo.png" class="logo" />
        </div>
      </div>

      <div class="inner flex-center">
        <div class="title">物料管理&订单管理系统</div>
        <div class="input-box">
          <span>
            <img src="@/assets/img/login-user.png" class="icon" />
          </span>
          <input type="text" placeholder="请输入账号" v-model="form.username" @keyup.enter="do_submit()" />
        </div>
        <div class="input-box">
          <span>
            <img src="@/assets/img/login-pass.png" class="icon" />
          </span>
          <input type="password" placeholder="请输入密码" v-model="form.password" @keyup.enter="do_submit()" />
        </div>
        <!-- <div class="input-box">
                      <span>验证码</span>
                      <input type="text" placeholder v-model="form.code" @keyup.enter="do_submit()" />
                      <img class="code" :src="verify_pic" alt="" @click="query_code()" />
        </div>-->
        <div class="btn-box">
          <el-button class="btn-ripple btn-ripple" :loading="loading" @click="throttle_do_submit()">确认登录</el-button>
        </div>
      </div>
    </div>
    <!-- <div class="footer-box">
      <div class="html-box">
        <a href="https://beian.miit.gov.cn/" target="_blank">备案号</a>
      </div>
    </div>-->
  </div>
</template>

<script>
import { addRoleRoutes, getFirstRouteByRole, getFirstRouteObjectByRole } from "@/router/index.js";

export default {
  name: "servicePage",
  components: {},
  data() {
    return {
      is_test: false,

      form: {
        username: "", //admin
        password: "", //yjd@2025...
        code: "", //
        uuid: ""
      },

      // beian_info: '',
      verify_pic: "",

      loading: false
    };
  },
  computed: {},

  created() {
    this.throttle_do_submit = this.mix_throttle(this.do_submit, 1000);
    // this.query_config()
    // this.query_code();
  },
  methods: {
    query_code() {
      this.$api({
        url: "/captchaImage",
        method: "get",
        data: {}
      }).then(res => {
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
      // let { phone, password } = this.form;
      let usernameReg = /^[a-zA-Z0-9]{6,16}$/;
      if (!this.form.username && !usernameReg.test(this.form.username)) {
        alert("请输入6-16位字母或数字的账号");
        return;
      }
      if (!this.form.password) {
        alert("请输入密码");
        return;
      }

      this.loading = true;

      this.$api({
        url: "/loginSysUser",
        method: "post",
        data: {
          username: this.form.username,
          password: this.form.password
          // code: this.form.code,
          // uuid: this.form.uuid,
        }
      }).then(res => {
        this.$logjson("登录", res);
        this.loading = false;

        if (res.code == 200) {
          let token = res.data.token;
          this.$store.commit("set_vuex_token", token);
          this.$store.commit("set_vuex_user", res.data);

          // 设置 userId 到 localStorage（路由守卫需要）
          if (res.data.id || res.data.userId) {
            localStorage.setItem("userId", res.data.id || res.data.userId);
          }

          // 设置用户角色
          const userRole = res.data.roleId;
          this.$store.commit("set_vuex_role", userRole);

          // 跳转到角色对应的第一个路由
          this.to_success(userRole);
        } else {
          // this.query_code();
        }
      }).catch(err => {
        this.loading = false;
      });
    },
    to_success(role) {
      console.log("开始跳转，角色:", role);

      // 添加角色路由
      const routes = addRoleRoutes(role);
      console.log("添加的路由:", routes);

      // 获取第一个路由对象（包含 name 和 path）
      const firstRouteObj = getFirstRouteObjectByRole(role);
      console.log("第一个路由对象:", firstRouteObj);

      if (firstRouteObj && firstRouteObj.name) {
        // 等待路由添加完成后再跳转
        this.$nextTick(() => {
          // 优先使用路由名称跳转（更可靠）
          this.$router.replace({
            name: firstRouteObj.name
          }).catch(err => {
            console.error("通过名称跳转失败:", err);
            // 如果名称跳转失败，尝试使用路径
            if (firstRouteObj.path) {
              this.$router.replace(firstRouteObj.path).catch(err2 => {
                console.error("通过路径跳转也失败:", err2);
                this.$router.replace("/");
              });
            } else {
              this.$router.replace("/");
            }
          });
        });
      } else {
        console.warn("未找到角色对应的路由");
        // 如果没有找到路由，跳转到首页
        this.$router.replace("/");
      }
    }
  }
};
</script>

<style scoped lang="less">
.page {
  position: relative;
  width: 100vw;
  height: 100vh;

  background: #ffffff;

  .inner-content {
    width: 100vw;
    height: 100vh;

    background: #ffffff;

    .left-view {
      width: 50vw;
      height: 100vh;
      background: url("~@/assets/img/bg-left.png") no-repeat center / cover;
      padding: 40px 0;

      .logo-box {
        position: absolute;
        top: 27px;
        left: 40px;
        width: 155px;

        .logo {
          width: 100%;
          height: 100%;
        }
      }

      .title {
        text-align: center;
        margin-top: 35px;
        font-size: 24px;
        font-family: PingFang SC, PingFang SC;
        font-weight: 800;
        font-size: 40px;
        color: #ffffff;
      }

      .desc {
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 16px;
        color: #ffffff;
        text-align: center;
      }
    }

    .inner {
      background: url("~@/assets/img/bg-right.png") no-repeat center / cover;
      flex: 1;
      overflow: hidden;
      height: 100vh;
      flex-direction: column;
      padding: 100px 160px;

      .title {
        text-align: center;

        font-family: PingFang SC, PingFang SC;
        font-weight: 800;
        font-size: 36px;
        color: #333;
        line-height: 52px;
      }

      .input-box {
        position: relative;
        margin-top: 40px;
        width: 424px;
        height: 50px;
        background: #f8f8f8;
        border-radius: 4px;

        display: flex;
        align-items: center;
        justify-content: space-between;

        span {
          display: inline-flex;
          justify-content: center;
          align-items: center;
          width: 60px;

          .icon {
            width: 21px;
            height: 23px;
          }
        }

        input {
          flex: 2;
          height: 100%;
          padding-left: 0px;
          font-size: 14px;
          color: #686868;
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
          width: 424px;
          height: 50px;
          background: #2373c8;
          border-radius: 27px;
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
