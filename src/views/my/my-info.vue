<template>
  <div class="page">
    <div class="main-title flex">
      <img src="@img/my/nav-5.png" alt="" />
      <span>个人资料</span>
    </div>

    <div class="page-ctx">
      <!-- Tab导航 -->
      <div class="tab-nav">
        <div 
          class="tab-item" 
          :class="{ active: activeTab === 'basic' }"
          @click="switchTab('basic')"
        >
          基本信息
        </div>
        <div 
          class="tab-item" 
          :class="{ active: activeTab === 'password' }"
          @click="switchTab('password')"
        >
          修改密码
        </div>
      </div>

      <!-- 基本信息tab内容 -->
      <div v-show="activeTab === 'basic'" class="tab-content">
        <div class="section">
          <div class="section-title">更换手机号</div>
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
            <span class="text">手机：</span>
            <span class="info">{{ my_info.phone }}</span>
            <span class="action" style="color: #FFC208;" @click="open_phone_update()">
              <span>更改手机号</span>
            </span>
          </div>

          <!-- <div class="item">
            <span class="text">真实姓名：</span>
            <span class="info">
              <el-input clearable type="text" v-model="form.realName" />
            </span>
            <span class="action"> </span>
          </div> -->
          <!-- <div class="item">
            <span class="text">所在地区：</span>
            <span class="info">
              <el-input clearable type="text" v-model="form.address" />
            </span>
            <span class="action"> </span>
          </div> -->

          <div class="item">
            <span class="text">昵称：</span>
            <span class="info">
                <el-input clearable type="text" v-model="form.nickname" /> 
            </span>
            <span class="action">

            </span>
          </div>

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
                >保存</el-button
              >
              <button
                class="btn-ripple fit-text btn-cancel"
                @click="do_reset()"
              >
                清空
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>

      <!-- 修改密码tab内容 -->
      <div v-show="activeTab === 'password'" class="tab-content">
        <div class="section">
          <div class="section-ctx">
            <div class="item">
              <span class="text">旧密码：</span>
              <span class="info">
                <el-input clearable type="password" v-model="passwordForm.oldPass" class="" />
              </span>
              <span class="action"> </span>
            </div>
            <div class="item">
              <span class="text">新密码：</span>
              <span class="info">
                <el-input clearable type="password" v-model="passwordForm.pass" class="" />
              </span>
              <span class="action"> </span>
            </div>
            <div class="item">
              <span class="text">确认密码：</span>
              <span class="info">
                <el-input clearable type="password" v-model="passwordForm.pass2" class="" />
              </span>
              <span class="action"> </span>
            </div>
            <div class="item btn-box">
              <span class="text" style="visibility: hidden">-</span>
              <div class="info">
                <el-button
                  class="btn-ripple fit-text btn-save"
                  @click="throttle_do_password_submit()"
                  :loading="passwordLoading"
                  >确认</el-button
                >
                <button
                  class="btn-ripple fit-text btn-cancel"
                  @click="do_password_clear()"
                >
                  清空
                </button>
              </div>
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
        nickname:"",
      },
      loading: false,
      
      // Tab相关
      activeTab: 'basic', // 当前激活的tab
      
      // 修改密码相关
      passwordForm: {
        editType: '1', // 修改类型：1-老密码验证 2-手机短信验证 3-邮箱验证码验证
        oldPass: "",
        pass: "", // 验证码 类型2/类型3-必传
        pass2: "",
      },
      passwordLoading: false,
    };
  },
  computed: {
    ...mapState([""]),
  },
  watch: {},
  created() {
    this.throttle_do_submit = this.mix_throttle(this.do_submit, 1000);
    this.throttle_do_password_submit = this.mix_throttle(this.do_password_submit, 1000);
    this.setView();
  },
  methods: {
    throttle_do_submit() {},
    throttle_do_password_submit() {},

    // Tab切换
    switchTab(tab) {
      this.activeTab = tab;
    },

    // 修改密码相关方法
    do_password_submit() {
      if (!this.passwordForm.oldPass) {
        alertErr("请输入旧密码");
        return;
      }
      if (!this.passwordForm.pass) {
        alertErr("请输入新密码");
        return;
      }
      if (!this.passwordForm.pass2) {
        alertErr("请输入确认密码");
        return;
      }
      if (this.passwordForm.pass != this.passwordForm.pass2) {
        alertErr("两次密码不一致");
        return;
      }

      this.passwordLoading = true;
      this.$api({
        url: '/service.php',
        method: 'get',
        data: {
          action: 'users_editPass',
          ...this.passwordForm,
        }
      }).then((res) => {
        alert(res).then(() => {
          this.passwordLoading = false;
        });
        if (res.code == 200) {
          this.do_password_clear();
        }
      });
    },

    do_password_clear() {
      this.passwordForm = {
        editType: '1',
        oldPass: "",
        pass: "",
        pass2: "",
      };
    },

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
    padding: 0 32px;
    text-align: left;
    height: 56px;
    line-height: 56px;
    background: #ffffff;
    font-size: 16px;
    font-family: Microsoft YaHei-Bold, Microsoft YaHei;
    font-weight: bold;
    color: #333333;
    img {
      width: 22px;
      margin-right: 10px;
    }

    button {
      min-width: 96px;
      height: 30px;
      line-height: 30px;
      background: #7853b2;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }
  }

  .page-ctx {
    margin-top: 24px;
    padding: 0;
    background: #fff;
  }

  // Tab导航样式
  .tab-nav {
    display: flex;
    border-bottom: 1px solid #e5e5e5;
    padding: 0 32px;

    .tab-item {
      padding: 16px 24px;
      font-size: 16px;
      color: #1F1F1F;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      transition: all 0.3s ease;

      &:hover {
        color: #7853b2;
      }

      &.active {
        color: #7853b2;
        border-bottom-color: #7853b2;
        font-weight: 500;
      }
    }
  }

  .tab-content {
    padding: 80px 100px;
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
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      font-weight: 400;
      color: #1F1F1F;
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
        color: #7853b2;

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
    height: 32px;
    background: #ffffff;
    border-radius: 50px 50px 50px 50px;
    border: 1px solid #7853b2;
    font-family: Arial, Arial;
    font-weight: 400;
    font-size: 14px;
    color: #7853b2;
  }

  .btn-cancel {
    margin-left: 20px;
    width: 120px;
    height: 32px;
    background: #7853b2;
    border-radius: 50px 50px 50px 50px;
    font-family: Arial, Arial;
    font-weight: 400;
    font-size: 14px;
    color: #ffffff;
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/user/my-info.less"></style>

<style scoped lang="less" src="@/assets/h5css/page/shipei3.less"></style>
