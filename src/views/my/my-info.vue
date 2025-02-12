<template>
  <div class="page">


    <div class="main-title">
      <span>个人资料</span>
    </div>

    <div class="page-ctx">
      <div class="section">
        <!--        <div class="section-title">基本信息</div>-->
        <div class="section-ctx">
          <div class="item upload-box">
            <span class="text">头像：</span>
            <span class="info">
              <div class="upload-box">
                <el-upload :action="UPLOAD_ACTION" :before-upload="upload_before_upload" :data="mix_upload_data"
                           :name="UPLOAD_NAME"
                           :on-success="upload_on_success" :show-file-list="false" accept="image/*"
                           class="upload-demo">
                  <img v-if="form.image" :src="form.image" class="user-avatar"/>
                  <img v-else class="user-avatar" src="@/static/my/avatar.png"/>
                </el-upload>
              </div>
            </span>
          </div>
          <div class="item">
            <span class="text">姓名：</span>
            <span class="info">
              <el-input v-model="form.realName" clearable type="text"/>
            </span>
            <span class="action"> </span>
          </div>
          <div class="item">
            <span class="text">性别：</span>
            <span class="info">
                <el-radio-group v-model="form.realName">
                  <el-radio :label="0">男</el-radio>
                  <el-radio :label="1">女</el-radio>
                </el-radio-group>
            </span>
            <span class="action"> </span>
          </div>
          <div class="item">
            <span class="text">手机号：</span>
            <span class="info">
              <el-input v-model="my_info.phone" disabled/></span>
            <span class="action" @click="open_phone_update()">
              <span>修改</span>
            </span>
          </div>
          <div class="item">
            <span class="text">城市：</span>
            <span class="info">
              <el-input v-model="form.address" clearable type="text"/>
            </span>
            <span class="action"> </span>
          </div>
          <div class="item">
            <span class="text">邮箱：</span>
            <span class="info">
              <el-input v-model="form.address" clearable type="text"/>
            </span>
            <span class="action"> </span>
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

      <div class="other">
        <!-- <div class="section-title">个人信息</div> -->
        <div class="section-ctx">
          <div class="item btn-box">
            <span class="text" style="visibility: hidden">-</span>
            <div class="info">
              <el-button :loading="loading" class="btn-ripple fit-text btn-save"
                         @click="throttle_do_submit()">保存
              </el-button>
              <button class="btn-ripple fit-text btn-cancel" @click="do_reset()">清空</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <phone_bind_old_check_modal ref="phone_bind_old_check_modal" data-title="校验" @confirm="confirm_old_pass"/>
    <phone_bind_new_set_modal ref="phone_bind_new_set_modal" data-title="绑定" @confirm="confirm_new"/>


  </div>
</template>

<script>
import {UPLOAD_ACTION, UPLOAD_NAME} from '@/config/env.js'

import phone_bind_old_check_modal from "@/components/account/phone_bind_old_check_modal.vue";
import phone_bind_new_set_modal from "@/components/account/phone_bind_new_set_modal.vue";


import {mapState} from "vuex";

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
    };
  },
  computed: {
    ...mapState(["baseInfo"]),
  },
  watch: {},
  created() {
    this.throttle_do_submit = this.mix_throttle(this.do_submit, 1000)
    this.setView();
  },
  methods: {
    throttle_do_submit() {

    },

    open_phone_update() {
      this.$refs.phone_bind_old_check_modal.init();
    },
    confirm_old_pass() {
      this.$refs.phone_bind_new_set_modal.init();
    },
    confirm_new() {
      this.query_user()
    },

    setView() {
      this.query_user();
    },
    query_user() {
      // this.$store.dispatch("query_user");
      this.$api({
        url: '/service.php',
        method: 'get',
        data: {
          action: 'users_userInfo',
        },
      }).then(res => {
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
      })
    },

    do_submit() {
      this.loading = true;
      this.$api({
        url: '/service.php',
        method: 'get',
        data: {
          action: 'users_editInfo',
          ...this.form
        },
      }).then((res) => {
        let {code, msg, data} = res;
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
      let {code, data, msg} = res;
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

<style lang="less" scoped>
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
    background: #1D1D1D;
    font-size: 16px;
    font-family: Microsoft YaHei-Bold, Microsoft YaHei;
    font-weight: bold;
    color: #fff;

    button {
      min-width: 96px;
      height: 30px;
      line-height: 30px;
      background: #F74747;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }
  }

  .page-ctx {
    margin-top: 10px;
    padding: 80px 100px;
    background: #1D1D1D;
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
        color: #fff;
      }

      .info {
        padding-left: 10px;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #fff;
        display: inline-block;
        min-width: 120px;


        /deep/ .el-input__inner {
           width: 400px;
           height: 40px;
           background: transparent;
           border: 1px solid #7B7B7B;
          color: #fff;
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
  button {
    width: 76px;
    height: 40px;
  }

  .btn-save {
    width: 130px;
    height: 40px;
    background-color: transparent;
    border: 1px solid #7B7B7B;
    font-family: Arial, Arial;
    font-weight: 400;
    font-size: 14px;
    color: #fff;
  }

  .btn-cancel {
    margin-left: 20px;
    width: 130px;
    height: 40px;
    background: #DF1626;
    font-family: Arial, Arial;
    font-weight: 400;
    font-size: 14px;
    color: #FFFFFF;
  }
}
</style>

<style lang="less" scoped src="@/assets/h5css/user/my-info.less"></style>
