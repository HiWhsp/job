<template>
  <div class="page">
    <div class="main-title">
      <span>个人资料</span>
    </div>

    <div class="page-ctx">
      <div class="section">
        <div class="section-ctx">
          <!-- 头像区域 -->
          <div class="avatar-section">
            <div class="avatar-wrapper">
              <el-upload
                class="avatar-uploader"
                accept="image/*"
                :show-file-list="false"
                :name="UPLOAD_NAME"
                :action="UPLOAD_ACTION"
                :data="mix_upload_data"
                :on-success="upload_on_success"
                :before-upload="upload_before_upload"
              >
                <div class="avatar-container">
                  <img
                    :src="form.image || vuex_avatar_default"
                    class="user-avatar"
                  />
                </div>
              </el-upload>
            </div>
          </div>

          <!-- 邮箱区域 -->
          <div class="email-section">
            <span class="email-label">Email:</span>
            <span class="email-value">{{ form.email || my_info.email || '--' }}</span>
            <span class="email-modify" @click="open_email_update()">Modify</span>
          </div>

          <!-- 表单字段 -->
          <div class="form-section">
            <div class="form-item">
              <label class="form-label">
                <span class="label-text">姓名</span>
                <span class="required-star">*</span>
              </label>
              <div class="form-input-wrapper">
                <el-input 
                  clearable 
                  type="text" 
                  v-model="form.realName" 
                  placeholder="请输入姓名"
                  class="form-input"
                />
              </div>
            </div>

            <div class="form-item">
              <label class="form-label">
                <span class="label-text">性别</span>
              </label>
              <div class="form-input-wrapper">
                <el-radio-group v-model="form.sex" class="gender-radio-group">
                  <el-radio :label="1" class="gender-radio">男</el-radio>
                  <el-radio :label="2" class="gender-radio">女</el-radio>
                </el-radio-group>
              </div>
            </div>

            <div class="form-item">
              <label class="form-label">
                <span class="label-text">手机号</span>
              </label>
              <div class="form-input-wrapper">
                <el-input 
                  clearable 
                  type="text" 
                  v-model="form.phone" 
                  placeholder="请输入手机号"
                  class="form-input"
                />
              </div>
            </div>

            <div class="form-item">
              <label class="form-label">
                <span class="label-text">城市</span>
              </label>
              <div class="form-input-wrapper">
                <el-input 
                  clearable 
                  type="text" 
                  v-model="form.address" 
                  placeholder="请选择城市"
                  class="form-input"
                />
                <span class="input-icon location-icon">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 0C6.13 0 3 3.13 3 7C3 12.25 10 20 10 20C10 20 17 12.25 17 7C17 3.13 13.87 0 10 0ZM10 9.5C8.62 9.5 7.5 8.38 7.5 7C7.5 5.62 8.62 4.5 10 4.5C11.38 4.5 12.5 5.62 12.5 7C12.5 8.38 11.38 9.5 10 9.5Z" fill="#999"/>
                  </svg>
                </span>
              </div>
            </div>

            <div class="form-item">
              <label class="form-label">
                <span class="label-text">出生日期</span>
              </label>
              <div class="form-input-wrapper">
                <el-date-picker
                  v-model="form.birthday"
                  type="date"
                  placeholder="请选择出生日期"
                  value-format="yyyy-MM-dd"
                  class="form-input date-picker"
                />
                <span class="input-icon calendar-icon">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <rect x="3" y="4" width="14" height="13" rx="1" stroke="#999" stroke-width="1.5" fill="none"/>
                    <path d="M3 7H17" stroke="#999" stroke-width="1.5"/>
                    <path d="M7 3V7" stroke="#999" stroke-width="1.5"/>
                    <path d="M13 3V7" stroke="#999" stroke-width="1.5"/>
                  </svg>
                </span>
              </div>
            </div>
          </div>

          <!-- 按钮区域 -->
          <div class="button-section">
            <button class="btn-cancel" @click="do_reset()">取消</button>
            <el-button
              class="btn-save"
              @click="throttle_do_submit()"
              :loading="loading"
            >保存</el-button>
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
        sex: 2,
        phone: "",
        city: "",
        birthday: "",
        email: "",
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
    open_email_update() {
      // 邮箱修改逻辑，可以打开一个弹窗或跳转到邮箱修改页面
      // 这里先简单处理
      const newEmail = prompt('请输入新邮箱：', this.form.email || this.my_info.email);
      if (newEmail) {
        this.form.email = newEmail;
      }
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
            sex: data.sex || 2,
            phone: data.phone || "",
            city: data.city || "",
            birthday: data.birthday || "",
            email: data.email || "",
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
        image: this.my_info.image || "",
        realName: this.my_info.realName || "",
        sex: this.my_info.sex || 2,
        phone: this.my_info.phone || "",
        city: this.my_info.city || "",
        birthday: this.my_info.birthday || "",
        email: this.my_info.email || "",
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
.page {
  text-align: left;
  padding-bottom: 80px;
  background: #fff;

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
  }

  .page-ctx {
    margin-top: 24px;
    padding: 40px 100px;
    background: #fff;
    min-height: calc(100vh - 100px);
  }

  .section {
    .section-ctx {
      max-width: 600px;
      margin: 0 auto;
    }
  }

  // 头像区域
  .avatar-section {
    display: flex;
    justify-content: center;
    margin-bottom: 30px;

    .avatar-wrapper {
      position: relative;

      .avatar-uploader {
        display: inline-block;
      }

      .avatar-container {
        position: relative;
        display: inline-block;
        border-radius: 4px;
        padding: 4px;
        cursor: pointer;

        .user-avatar {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          object-fit: cover;
          display: block;
          background: #f0f0f0;
        }

        .avatar-placeholder {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: #f0f0f0;
          display: block;
        }
      }
    }
  }

  // 邮箱区域
  .email-section {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 40px;
    gap: 10px;

    .email-label {
      font-size: 14px;
      color: #333;
    }

    .email-value {
      font-size: 14px;
      color: #333;
    }

    .email-modify {
      font-size: 14px;
      color: #ff0000;
      cursor: pointer;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  // 表单区域
  .form-section {
    .form-item {
      margin-bottom: 24px;
      display: flex;
      align-items: center;

      .form-label {
        display: flex;
        align-items: center;
        min-width: 100px;
        font-size: 14px;
        color: #333;
        margin-right: 16px;
        text-align: left;

        .label-text {
          margin-right: 4px;
        }

        .required-star {
          color: #ff0000;
          font-size: 14px;
          margin-left: 2px;
        }
      }

      .form-input-wrapper {
        flex: 1;
        position: relative;
        max-width: 400px;

        .form-input {
          width: 100%;

          ::v-deep .el-input__inner {
            height: 40px;
            border-radius: 4px;
            border: 1px solid #d4d4d4;
            background: #f5f5f5;
            color: #333;
            font-size: 14px;
            padding-right: 40px;
            padding-left: 12px;
          }

          ::v-deep .el-input__inner:focus {
            border-color: #2E4C87;
            background: #fff;
          }

          ::v-deep .el-input__inner::placeholder {
            color: #999;
          }
          ::v-deep .el-input__prefix {
            display: none;
          }
        }

        .date-picker {
          width: 100%;

          ::v-deep .el-input__inner {
            height: 40px;
            border-radius: 4px;
            border: 1px solid #d4d4d4;
            background: #f5f5f5;
            color: #333;
            font-size: 14px;
            padding-right: 40px;
            padding-left: 12px;
          }

          ::v-deep .el-input__inner:focus {
            border-color: #2E4C87;
            background: #fff;
          }

          ::v-deep .el-input__suffix {
            display: none;
          }
        }

        .input-icon {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          z-index: 1;
        }
      }

      .gender-radio-group {
        ::v-deep .el-radio {
          margin-right: 24px;

          .el-radio__label {
            font-size: 14px;
            color: #333;
            padding-left: 8px;
          }

          .el-radio__input.is-checked .el-radio__inner {
            background-color: #2E4C87;
            border-color: #2E4C87;
          }

          .el-radio__inner {
            width: 18px;
            height: 18px;
          }
        }
      }
    }
  }

  // 按钮区域
  .button-section {
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-top: 40px;
    padding-top: 40px;

    .btn-cancel {
      width: 120px;
      height: 40px;
      background: #F5F5F5;
      border-radius: 4px;
      border: 1px solid #D7D7D7;
      font-size: 14px;
      color: #666;
      cursor: pointer;
      font-family: Arial, sans-serif;

      &:hover {
        background: #e8e8e8;
      }
    }

    .btn-save {
      width: 120px;
      height: 40px;
      background: #2E4C87;
      border-radius: 4px;
      border: none;
      font-size: 14px;
      color: #ffffff;
      cursor: pointer;
      font-family: Arial, sans-serif;

      &:hover {
        background: #1e3a6b;
      }

      ::v-deep .el-button {
        width: 100%;
        height: 100%;
        background: #2E4C87;
        border: none;
        color: #fff;
      }
    }
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/user/my-info.less"></style>
