<template>
  <div class="page">
    <div class="main-title">
      <span>个人资料</span>
    </div>

    <div class="page-ctx">
      <div class="section">
        <div class="section-ctx">
          <div class="item upload-box">
            <span class="text">头像：</span>
            <span class="info">
              <div class="upload-box">
                <el-upload
                  class="upload-demo"
                  accept="image/*"
                  :show-file-list="false"
                  :name="UPLOAD_NAME"
                  :action="UPLOAD_ACTION"
                  :data="mix_upload_data"
                  :on-success="upload_on_success"
                  :before-upload="upload_before_upload"
                >
                  <img
                    v-if="form.image"
                    :src="form.image"
                    class="user-avatar"
                  />
                  <img v-else src="@img/my/avatar.png" class="user-avatar" />
                </el-upload>
              </div>
            </span>
          </div>

          <div class="item">
            <span class="text">姓名：</span>
            <span class="info">
              <el-input clearable type="text" v-model="form.realName" />
            </span>
            <span class="action"> </span>
          </div>
          <div class="item">
            <span class="text">性别：</span>
            <span class="info">
              <el-radio-group v-model="form.sex">
                <el-radio :label="1">男</el-radio>
                <el-radio :label="2">女</el-radio>
              </el-radio-group>
            </span>
            <span class="action"> </span>
          </div>
          <div class="item">
            <span class="text">手机：</span>
            <span class="info">{{ my_info.phone }}</span>
            <span class="action" @click="open_phone_update()">
              <span>修改</span>
            </span>
          </div>
          <div class="item">
            <span class="text">联系地址：</span>
            <span class="info">
              <el-input clearable type="text" v-model="form.address" />
            </span>
            <span class="action"> </span>
          </div>
          <div class="item">
            <span class="text">详细地址：</span>
            <span class="info">
              <el-input clearable type="text" v-model="form.company" />
            </span>
            <span class="action"> </span>
          </div>
          <div class="item">
            <span class="text">邮箱：</span>
            <span class="info">
              <el-input clearable type="text" v-model="form.company" />
            </span>
            <span class="action"> </span>
          </div>
          <div class="item">
            <span class="text">公司名称：</span>
            <span class="info">
              <el-input clearable type="text" v-model="form.department" />
            </span>
            <span class="action"> </span>
          </div>
          <div class="item">
            <span class="text">职位：</span>
            <span class="info">
              <el-input clearable type="text" v-model="form.position" />
            </span>
            <span class="action"> </span>
          </div>
          <!-- <div class="item">
            <span class="text">账号：</span>
            <span class="info" style="visibility: hidden">******</span>
            <span class="action">
              <span @click="mix_logout">退出登录</span>
            </span>
          </div> -->
        </div>
      </div>

      <div class="other">
        <!-- <div class="section-title">个人信息</div> -->
        <div class="section-ctx">
          <div class="item btn-box">
            <span class="text" style="visibility: hidden">-</span>
            <div class="info">
              <button class="btn-ripple fit-text btn-save" @click="do_reset()">
                取消
              </button>
              <el-button
                class="btn-ripple fit-text btn-cancel"
                @click="throttle_do_submit()"
                :loading="loading"
                >保存</el-button
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <phone_bind_old_check_modal
      ref="phone_bind_old_check_modal"
      data-title="校验"
      @confirm="confirm_old_pass"
    />
    <phone_bind_new_set_modal
      ref="phone_bind_new_set_modal"
      data-title="绑定"
      @confirm="confirm_new"
    />
  </div>
</template>

<script>
import { UPLOAD_ACTION, UPLOAD_NAME } from "@/config/env.js";

import phone_bind_old_check_modal from "@/components/account/phone_bind_old_check_modal.vue";
import phone_bind_new_set_modal from "@/components/account/phone_bind_new_set_modal.vue";

import { mapState } from "vuex";

export default {
  name: "servicePage",
  components: {
    phone_bind_old_check_modal,
    phone_bind_new_set_modal,
  },
  data() {
    return {
      UPLOAD_ACTION,
      UPLOAD_NAME,

      my_info: {},
      form: {
        image: "",
        realName: "",
        address: "",
        company: "",
        department: "",
        nickname: "",
        blocName: "",
        companyName: "",
        departmentName: "",
      },
      loading: false,
    };
  },
  computed: {
    ...mapState([""]),
  },
  watch: {},
  created() {
    this.throttle_do_submit = this.mix_throttle(this.do_submit, 1000);
    this.setView();
  },
  methods: {
    throttle_do_submit() {},

    open_phone_update() {
      this.$refs.phone_bind_old_check_modal.init();
    },
    confirm_old_pass() {
      this.$refs.phone_bind_new_set_modal.init();
    },
    confirm_new() {
      this.query_user();
    },

    setView() {
      this.query_user();
    },
    query_user() {
      // this.$store.dispatch("query_user");
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "users_userInfo",
        },
      }).then((res) => {
        if (res.code == 200) {
          let data = res.data;
          this.my_info = data;

          this.form = {
            image: data.image || "",
            realName: data.realName || "",
            address: data.address || "",
            nickname: data.nickname || "",
            blocName: data.blocName || "",
            companyName: data.companyName || "",
            departmentName: data.departmentName || "",
          };

          this.$store.commit("set_vuex_user", res.data);
        }
      });
    },

    do_submit() {
      this.loading = true;
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "users_editInfo",
          ...this.form,
        },
      }).then((res) => {
        let { code, msg, data } = res;
        alert(res).then(() => {
          this.loading = false;
        });
        if (code == 200) {
          this.setView();
        }
      });
    },

    do_reset() {
      this.form = {
        image: this.my_info.image,
        realName: "",
        address: "",
      };
    },

    //上传相关
    upload_on_success(res, file) {
      //console.log("上传结果", res);
      let { code, data, msg } = res;
      alert(res);
      if (code == 200) {
        this.form.image = res.data;
      }
    },
    upload_before_upload(file) {
      const isLt2M = file.size / 1024 / 1024 < 20; //文件大小
      return isLt2M;
    },
  },
};
</script>

<style scoped lang="less">
.user-avatar {
  object-fit: cover;
}

.page {
  text-align: left;
  padding-bottom: 80px;

  .main-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 32px;
    text-align: left;
    height: 56px;
    line-height: 56px;
    background: #ffffff;
    font-size: 16px;
    font-family: Microsoft YaHei-Bold, Microsoft YaHei;
    font-weight: bold;
    color: #333333;

    button {
      min-width: 96px;
      height: 30px;
      line-height: 30px;
      background: #2E4C87;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }
  }

  .page-ctx {
    margin-top: 24px;
    padding: 80px 100px;
    background: #fff;
  }
}

.page {
  .page-ctx {
    padding-bottom: 80px;

    .section {
      // padding-bottom: 27px;
      // margin-bottom: 40px;
      // border-bottom: 1px solid #dbdbdb;
    }

    .section-title {
      margin-bottom: 50px;
      font-size: 16px;
      font-family: sans-serif;
      font-weight: 400;
      color: #666666;
    }

    .section-ctx {
      // padding-top: 32px;
    }

    .upload-box {
      img {
        width: 100px;
        height: 100px;
        border-radius: 50%;
      }
    }

    .item {
      margin-bottom: 32px;
      display: flex;
      align-items: center;

      .text {
        display: inline-block;
        min-width: 134px;
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
        color: #2E4C87;

        span {
          margin-right: 20px;
          cursor: pointer;
        }
      }
    }
  }
}

.btn-box {
  button {
    width: 76px;
    height: 40px;
  }

  .btn-save {
    width: 120px;
    height: 40px;
    background: #F5F5F5;
    border-radius: 4px;
    border: 1px solid #D7D7D7;
    font-family: Arial, Arial;
    font-weight: 400;
    font-size: 14px;
    color: #666;
  }

  .btn-cancel {
    margin-left: 20px;
    width: 120px;
    height: 40px;
    background: #2E4C87;
    border-radius: 4px;
    font-family: Arial, Arial;
    font-weight: 400;
    font-size: 14px;
    color: #ffffff;
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/user/my-info.less"></style>
