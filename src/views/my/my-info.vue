<template>
  <div class="page">
    <div class="main-title">
      <span>个人资料</span>
    </div>

    <div class="page-ctx">
      <div class="section">
        <div class="section-ctx">
          <div class="item upload-box">
            <span class="text">头像</span>
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
                  <img v-if="my_info.image" :src="my_info.image" class="user-avatar" />
                  <img v-else src="@img/my/avatar.png" class="user-avatar" />
                </el-upload>
              </div>
            </span>
          </div>
          <div class="item">
            <span class="text">昵称</span>
            <span class="info">
              <el-input clearable type="text" v-model="my_info.name" />
            </span>
          </div>
          <div class="item">
            <span class="text">简介</span>
            <span class="info">
              <el-input clearable type="textarea" rows="5" v-model="my_info.info" />
            </span>
            <span class="action"> </span>
          </div>
          <div class="item">
            <span class="text">姓名</span>
            <span class="info">
              <el-input clearable type="text" v-model="my_info.real_name" />
            </span>
            <span class="action"> </span>
          </div>
          <div class="item">
            <span class="text">邮箱</span>
            <span class="info">
              <el-input clearable type="text" v-model="my_info.email" />
            </span>
            <span class="action"> </span>
          </div>
          <div class="item">
            <span class="text">公司</span>
            <span class="info">
              <el-input clearable type="text" v-model="my_info.company_title" />
            </span>
            <span class="action"> </span>
          </div>
          <div class="item">
            <span class="text">职位</span>
            <span class="info">
              <el-input clearable type="text" v-model="my_info.position" />
            </span>
            <span class="action"> </span>
          </div>
        </div>
      </div>

      <div class="other">
        <!-- <div class="section-title">个人信息</div> -->
        <div class="section-ctx">
          <div class="item btn-box">
            <span class="text" style="visibility: hidden">-</span>
            <div class="info">
              <el-button
                class="btn-ripple fit-text btn-save"
                @click="throttle_do_submit()"
                :loading="loading"
                >确认修改</el-button
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
      this.$api({
        url: "getUserInfo",
        method: "get",
      }).then((res) => {
        if (res.code == 200) {
          let data = res.data;
          this.my_info = data;

          this.$store.commit("set_vuex_user", res.data);
        }
      });
    },

    do_submit() {
      this.loading = true;
      this.$api({
        url: "updateUser",
        method: "post",
        data: this.my_info,
      }).then((res) => {
        let { code, msg, data } = res;
        this.loading = false;
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
    font-family: OPPPSans;
    font-weight: bold;
    color: #333333;

    button {
      min-width: 96px;
      height: 30px;
      line-height: 30px;
      background: #009f39;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }
  }

  .page-ctx {
    margin-top: 14px;
    padding: 60px;
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
      font-family: OPPPSans;
      font-weight: 400;
      color: #666666;
    }

    .section-ctx {
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
      align-items: start;

      .text {
        display: inline-block;
        min-width: 60px;
        text-align: right;
        font-size: 14px;
        color: #666;
        margin-top: 10px;
      }

      .info {
        padding-left: 20px;
        font-size: 14px;
        font-family: OPPPSans;
        font-weight: 400;
        color: #333333;
        display: inline-block;
        min-width: 120px;

        .el-textarea {
          width: 600px;
        }

        .el-input {
          width: 600px;
        }
      }

      .action {
        margin-left: 20px;
        font-size: 14px;
        font-family: OPPPSans;
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
  button {
    width: 76px;
    height: 40px;
  }

  .btn-save {
    width: 468px;
    height: 50px;
    background: #1958b0;
    font-size: 16px;
    color: #fff;
  }
}
</style>
