<template>
  <div class="page">
    <div class="main-title flex-between">
      <span>修改密码</span>
    </div>

    <div class="page-ctx">
      <div class="other">
        <div class="section-ctx">
          <div class="item">
            <span class="text">旧密码：</span>
            <span class="info">
              <el-input clearable type="password" v-model="form.oldPass" placeholder="请输入旧密码" class="" />
            </span>
            <span class="action"> </span>
          </div>
          <div class="item">
            <span class="text">新密码：</span>
            <span class="info">
              <el-input clearable type="password" v-model="form.pass" placeholder="请输入新密码" class="" />
            </span>
            <span class="action"> </span>
          </div>
          <div class="item">
            <span class="text">确认密码：</span>
            <span class="info">
              <el-input clearable type="password" v-model="form.pass2" placeholder="请重复输入新密码" class="" />
            </span>
            <span class="action"> </span>
          </div>
          <div class="item btn-box">
            <span class="text" style="visibility: hidden">-</span>
            <div class="info">
              <button class="btn-ripple fit-text btn-cancel" @click="do_clear()">清空</button>
              <el-button class="btn-ripple fit-text btn-save" @click="throttle_do_submit()"
                :loading="loading">确认</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "change-password",
  components: {},
  data() {
    return {
      form: {
        editType: '1',//修改类型：1-老密码验证 2-手机短信验证 3-邮箱验证码验证
        oldPass: "",
        pass: "",//验证码 类型2/类型3-必传
        pass2: "",
      },
      loading: false,
    };
  },
  computed: {
    // ...mapState([""]),
  },
  watch: {},
  created() {
    this.throttle_do_submit = this.mix_throttle(this.do_submit, 1000)
  },
  methods: {
    throttle_do_submit() {

    },
    do_submit() {
      if (!this.form.oldPass) {
        alertErr("请输入旧密码");
        return;
      }
      if (!this.form.pass) {
        alertErr("请输入新密码");
        return;
      }
      if (!this.form.pass2) {
        alertErr("请输入确认密码");
        return;
      }
      if (this.form.pass != this.form.pass2) {
        alertErr("两次密码不一致");
        return;
      }

      this.loading = true;
      this.$api({
        url: '/service.php',
        method: 'get',
        data: {
          action: 'users_editPass',
          ...this.form,
        }
      }).then((res) => {
        alert(res).then(() => {
          this.loading = false;
        });
        if (res.code == 200) {
          this.do_clear()
        }
      });
    },

    do_clear() {
      this.form = {
        editType: '1',
        oldPass: "",
        pass: "",
        pass2: "",
      };
    }
  },
};
</script>

<style scoped lang="less">
.page {
  text-align: left;
  padding-bottom: 80px;

  .main-title {
    padding: 0 32px;
    text-align: left;
    height: 56px;
    line-height: 56px;
    background: #1D1D1D;
    font-size: 16px;
    font-family: Microsoft YaHei-Bold, Microsoft YaHei;
    font-weight: bold;
    color: #fff;
  }

  .page-ctx {
    min-height: 600px;
    margin-top: 10px;
    padding: 80px 0;
    background: #1D1D1D;
  }
}

.page {
  .page-ctx {
    padding-bottom: 80px;

    .section {}

    .item {
      margin-bottom: 20px;
      display: flex;
      align-items: center;

      .text {
        display: inline-block;
        min-width: 260px;
        text-align: right;
        font-size: 14px;
        color: #fff;
      }

      .info {
        padding-left: 10px;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #333333;
        display: inline-block;
        min-width: 120px;

        /deep/ .el-input__inner {
          width: 400px;
          height: 40px;
          background: transparent;
          border: 1px solid #7B7B7B;
          color: #fff;
        }


        .el-input {
          width: 400px;
          // height: 40px;
        }
      }

      .action {
        margin-left: 20px;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #F74747;

        span {
          margin-right: 20px;
          cursor: pointer;
        }
      }
    }
  }
}


.btn-box {
  margin-top: 46px;

  button {}

  .btn-save {
    width: 120px;
    height: 32px;
    border: 1px solid #DF1626;
    font-family: Arial, Arial;
    font-weight: 400;
    font-size: 14px;
    color: #fff;
    margin-left: 24px;

    background: #DF1626;
    border-radius: 4px 4px 4px 4px;
  }

  .btn-cancel {
    width: 120px;
    height: 32px;
    background: transparent;
    font-family: Arial, Arial;
    border-radius: 4px 4px 4px 4px;
    font-weight: 400;
    font-size: 14px;
    color: #fff;
    border: 1px solid #7B7B7B;
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/user/change-password.less"></style>
