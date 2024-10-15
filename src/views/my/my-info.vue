<template>
  <div class="page">
    <div class="main-title">
      <span>个人资料</span>
    </div>
    <div class="page-ctx">
      <div class="section">
        <div class="section-title">基本信息</div>
        <div class="section-ctx">
          <div class="item upload-box">
            <span class="text">头像：</span>
            <span class="info">
              <div class="upload-box">
                <el-upload
                  class="avatar-uploader"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                >
                  <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </div>
            </span>
          </div>

          <div class="item">
            <span class="text">手机：</span>
            <span class="info">{{ my_info.phone || "15931263145" }}</span>
          </div>

          <!-- <div class="item">
            <span class="text">昵称：</span>
            <span class="info">
              <input type="text" v-model="nickname" class="" />
            </span>
            <span class="action">

            </span>
          </div> -->

          <!-- <div class="item">
            <span class="text">密码：</span>
            <span class="info">******</span>
            <span class="action">
              <span @click="$router.push('/retrieve')">修改</span>
            </span>
          </div>
          <div class="item">
            <span class="text">账号：</span>
            <span class="info" style="visibility: hidden">******</span>
            <span class="action">
              <span @click="mix_logout">退出登录</span>
            </span>
          </div> -->
        </div>
      </div>

      <div class="section other">
        <div class="section-title">个人信息</div>
        <div class="section-ctx">
          <div class="item">
            <span class="text"
              ><span style="color: red">*</span> 真实姓名：</span
            >
            <span class="info">
              <el-input clearable type="text" v-model="form.realName" />
            </span>
            <span class="action"> </span>
          </div>
          <div class="item">
            <span class="text"
              ><span style="color: red">*</span> 所在地区：</span
            >
            <span class="info">
              <el-input clearable type="text" v-model="form.address" />
            </span>
            <span class="action"> </span>
          </div>
          <div class="item">
            <span class="text"
              ><span style="color: red">*</span> 公司名称：</span
            >
            <span class="info">
              <el-input clearable type="text" v-model="form.address" />
            </span>
            <span class="action"> </span>
          </div>
          <div class="item">
            <span class="text"><span style="color: red">*</span> 邮箱：</span>
            <span class="info">
              <el-input clearable type="text" v-model="form.address" />
            </span>
            <span class="action"> </span>
          </div>
          <div class="item btn-box">
            <span class="text" style="visibility: hidden">-</span>
            <div class="info">
              <button
                class="btn-ripple fit-text btn-confirm"
                @click="do_reset()"
              >
                确 定
              </button>
              <el-button
                class="btn-ripple fit-text btn-cancel"
                @click="throttle_do_submit()"
                :loading="loading"
              >
                取 消
              </el-button>
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
      },
      loading: false,
      imageUrl: "",
    };
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
          };

          this.$store.commit("set_baseInfo", res.data);
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
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
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
    .flex-between();
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
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }
  }

  .page-ctx {
    margin-top: 24px;
    padding: 20px 30px;
    background: #fff;
  }
}

.page {
  .page-ctx {
    padding-bottom: 69px;

    .section {
      // padding-bottom: 27px;
      // margin-bottom: 40px;
      border-bottom: 1px solid #dbdbdb;
    }

    .section-title {
      margin-bottom: 30px;
      font-size: 16px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      font-weight: 400;
      color: #666666;
    }

    .section-ctx {
      // padding-top: 32px;
    }

    .other {
      margin-top: 40px;
      border: none;
    }

    .upload-box {
      img {
        width: 88px;
        height: 88px;
        border-radius: 50%;
      }
    }

    .item {
      margin-bottom: 32px;
      display: flex;
      align-items: center;

      .text {
        display: inline-block;
        min-width: 157px;
        text-align: right;
        font-size: 14px;
        color: #666;
      }

      .info {
        padding-left: 26px;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #333333;
        display: inline-block;
        min-width: 120px;

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
        color: @theme;

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

  .btn-confirm {
    width: 104px;
    height: 40px;
    margin-right: 20px;
    background: #27417c;
    border-radius: 4px 4px 4px 4px;
    background: @theme;
    border-radius: 4px;
    border: 1px solid @theme;
    font-family: Arial, Arial;
    font-weight: 400;
    font-size: 14px;
    color: #fff;
  }

  .btn-cancel {
    width: 104px;
    height: 40px;
    border-radius: 4px 4px 4px 4px;
    border: 1px solid #27417c;
  }
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 88px;
  height: 88px;
  line-height: 88px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

