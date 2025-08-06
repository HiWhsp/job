<template>
  <div class="page">
    <div class="main-title flex-between">
      <span>新增账号</span>
    </div>

    <div class="page-ctx">
      <div class="other">
        <div class="section-ctx">
          <div class="item">
            <span class="text">账号：</span>
            <span class="info">
              <el-input
                placeholder="请输入手机号"
                clearable
                type="text"
                v-model="form.mobile"
                class=""
              />
            </span>
            <span class="action"> </span>
          </div>
          <div class="item">
            <span class="text">昵称：</span>
            <span class="info">
              <el-input
                placeholder="请输入姓名"
                clearable
                type="tect"
                v-model="form.nickname"
                class=""
              />
            </span>
            <span class="action"> </span>
          </div>
          <div class="item">
            <span class="text">姓名：</span>
            <span class="info">
              <el-input
                placeholder="请输入姓名"
                clearable
                type="tect"
                v-model="form.realName"
                class=""
              />
            </span>
            <span class="action"> </span>
          </div>
          <div class="item">
            <span class="text">邮箱：</span>
            <span class="info">
              <el-input
                placeholder="请输入邮箱"
                clearable
                type="email"
                v-model="form.email"
                class=""
              />
            </span>
            <span class="action"> </span>
          </div>
          <div class="item" v-if="false" hidden>
            <span class="text">类型：</span>
            <span class="info">
              <el-select v-model="form.type" placeholder="请选择角色">
                <el-option
                  v-for="item in accType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </span>
            <span class="action"> </span>
          </div>
          <div class="item">
            <span class="text">角色：</span>
            <span class="info">
              <el-select v-model="form.staffType" placeholder="请选择角色">
                <el-option
                  v-for="item in characters"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </span>
            <span class="action"> </span>
          </div>
          <div class="item btn-box">
            <span class="text" style="visibility: hidden">-</span>
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
        nickname: "",
        realName: "",
        email: "",
        type: 2,
        staffType: "",
        mobile: "",
      },
      accType: [
        {
          value: "1",
          label: "个人用户",
        },
        {
          value: "2",
          label: "企业用户",
        },
      ],
      characters: [
        {
          value: "1",
          label: "采购员",
        },
        {
          value: "2",
          label: "采购经理",
        },
        {
          value: "3",
          label: "采购总监",
        },
      ],
      loading: false,
    };
  },
  computed: {
    // ...mapState([""]),
  },
  watch: {},
  created() {
    let blacklistT = [1];
    let blacklist = [0, 1, 2];
    if (
      blacklistT.indexOf(this.vuex_user.type) > 0 ||
      blacklist.indexOf(this.vuex_user.staffType) > 0
    ) {
      alert("权限不足");
      this.toRoute("/index");
    }
    this.throttle_do_submit = this.mix_throttle(this.do_submit, 1000);
  },
  methods: {
    throttle_do_submit() {
      this.do_submit();
    },
    do_submit() {
      console.log(this.form);
      let reg_phone = /^1[3-9]\d{9}$/;
      let reg_email = /^([a-zA-Z\d])(\w|\-)+@[a-zA-Z\d]+\.[a-zA-Z]{2,4}$/;
      if (this.form.nickname.length === 0) {
        alert("请输入账号");
        return;
      }
      if (this.form.realName.length === 0) {
        alert("请输入姓名");
        return;
      }
      if (this.form.mobile.length === 0) {
        alert("请输入电话");
        return;
      }
      if (!reg_phone.test(this.form.mobile)) {
        alert("请输入正确的手机号");
        return;
      }
      if (this.form.email.length === 0) {
        alert("请输入邮箱");
        return;
      }
      if (!reg_email.test(this.form.email)) {
        alert("请输入有效的邮箱");
        return;
      }
      if (this.form.type.length === 0) {
        alert("请选择用户类型");
        return;
      }
      if (this.form.staffType.length === 0) {
        alert("请选择角色");
        return;
      }
      this.loading = true;
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "userC_add",
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
        nickname: "",
        realName: "",
        email: "",
        staffType: "",
      };
    },
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
    background: #ffffff;
    font-size: 16px;
    font-family: Microsoft YaHei-Bold, Microsoft YaHei;
    font-weight: bold;
    color: #333333;
  }

  .page-ctx {
    min-height: 600px;
    margin-top: 14px;
    padding: 80px 0;
    background: #fff;
  }
}

.page {
  .page-ctx {
    padding-bottom: 80px;

    .section {
    }

    .item {
      margin-bottom: 20px;
      display: flex;
      align-items: center;

      .text {
        display: inline-block;
        min-width: 260px;
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
        width: 100%;
        margin-right: 260px;

        input {
          // width: 400px;
          // height: 40px;
          // background: #ffffff;
          // border-radius: 4px 4px 4px 4px;
          // border: 1px solid #d4d4d4;
        }

        .el-input {
          width: 100%;
          // height: 40px;
        }
        .el-select {
          width: 100%;
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

  button {
  }

  .btn-save {
    width: 120px;
    height: 32px;
    background: #ffffff;
    border-radius: 50px 50px 50px 50px;
    border: 1px solid #F74747;
    font-family: Arial, Arial;
    font-weight: 400;
    font-size: 14px;
    color: #F74747;
  }

  .btn-cancel {
    margin-left: 24px;
    width: 120px;
    height: 32px;
    background: #F74747;
    border-radius: 50px 50px 50px 50px;
    font-family: Arial, Arial;
    font-weight: 400;
    font-size: 14px;
    color: #ffffff;
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/user/change-password.less"></style>
