<template>
  <div class="page">
    <div class="page-ctx">
      <div class="other">
        <div class="section-ctx">
          <div class="item">
            <span class="text">旧密码：</span>
            <span class="info">
              <el-input
                clearable
                type="password"
                v-model="form.oldPassWord"
                class=""
                placeholder="请输入旧密码"
              />
            </span>
            <span class="action"> </span>
          </div>
          <div class="item">
            <span class="text">新密码：</span>
            <span class="info">
              <el-input
                clearable
                type="password"
                v-model="form.password"
                class=""
                placeholder="请输入新密码"
              />
            </span>
            <span class="action"> </span>
          </div>
          <div class="item">
            <span class="text">确认密码：</span>
            <span class="info">
              <el-input
                clearable
                type="password"
                v-model="form.rePassword"
                class=""
                placeholder="请重复输入新密码"
              />
            </span>
            <span class="action"> </span>
          </div>
          <div class="item btn-box">
            <div class="info">
              <el-button
                class="btn-ripple fit-text btn-save"
                @click="throttle_do_submit()"
                :loading="loading"
                >确认</el-button
              >
              <button
                class="btn-ripple fit-text btn-cancel"
                @click="do_clear()"
              >
                清空
              </button>
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
        oldPassWord: "",
        password: "",
        rePassword: "",
      },
      loading: false,
    };
  },
  computed: {
    // ...mapState([""]),
  },
  watch: {},
  created() {
    this.throttle_do_submit = this.mix_throttle(this.do_submit, 1000);
  },
  methods: {
    throttle_do_submit() {},
    do_submit() {
      if (!this.form.password) {
        alertErr("请输入旧密码");
        return;
      }
      if (!this.form.password) {
        alertErr("请输入新密码");
        return;
      }
      if (!this.form.password) {
        alertErr("请输入确认密码");
        return;
      }
      if (this.form.rePassword != this.form.password) {
        alertErr("两次密码不一致");
        return;
      }

      this.loading = true;
      this.$api({
        url: "updatePassword",
        method: "get",
        data: {
          ...this.form,
        },
      }).then((res) => {
        alert(res).then(() => {
          this.loading = false;
        });
        if (res.code == 200) {
          this.do_clear();
        }
      });
    },

    do_clear() {
      this.form = {
        editType: "1",
        oldPass: "",
        pass: "",
        pass2: "",
      };
    },
  },
};
</script>

<style scoped lang="less">
.page {
  text-align: left;
  padding-bottom: 80px;

  .page-ctx {
    min-height: 600px;
    padding: 80px 0;
    background: #fff;
  }
}

.page {
  .page-ctx {
    padding-bottom: 80px;

    .section-ctx {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .item {
      margin-bottom: 20px;
      display: flex;
      align-items: center;

      .text {
        display: inline-block;
        min-width: 100px;
        text-align: right;
        font-size: 14px;
        color: #666;
      }

      .info {
        padding-left: 10px;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #333333;
        display: inline-block;
        min-width: 120px;

        input {
          // width: 400px;
          // height: 40px;
          // background: #ffffff;
          // border-radius: 4px 4px 4px 4px;
          // border: 1px solid #d4d4d4;
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
        color: #009f39;

        span {
          margin-right: 20px;
          cursor: pointer;
        }
      }
    }
  }
}

.btn-box {
  margin-top: 10px;

  .btn-save {
    width: 179px;
    height: 48px;
    background: linear-gradient(
      90deg,
      #452f86 0%,
      #a92b83 31%,
      #d14f8d 67%,
      #e38179 100%
    );
    border-radius: 5px;
    font-family: Arial, Arial;
    font-weight: 400;
    font-size: 16px;
    color: #fff;
  }

  .btn-cancel {
    margin-left: 24px;
    width: 179px;
    height: 48px;
    background: #fff;
    border-radius: 5px;
    font-family: Arial, Arial;
    font-weight: 400;
    font-size: 16px;
    color: #9d9d9d;
    border: 1px solid #9d9d9d;
  }
}
</style>
