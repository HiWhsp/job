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
                <el-upload class="upload-demo" accept="image/*" :show-file-list="false" name="img"
                           action="https://zsxhxxpx.dx.hdapp.com.cn/api?action=index_ossUpload"
                           :data="mix_upload_data" :on-success="upload_on_success"
                           :before-upload="upload_before_upload">
                  <img v-if="form.image" :src="form.image" class="user-avatar"/>
                  <img v-else src="@/static/prod/avatar.png" class="user-avatar"/>
                </el-upload>
              </div>
            </span>
          </div>

          <div class="item">
            <span class="text">姓名：</span>
            <span class="info">
              <el-input clearable type="text" v-model="form.real_name"/>
            </span>
          </div>

          <div class="item">
            <span class="text">手机：</span>
            <span class="info">
              <el-input clearable type="text" v-model="form.real_name"/>
            </span>
            <span class="action"> </span>
          </div>
          <div class="item">
            <span class="text">角色：</span>
            <span class="info">
              <el-input clearable type="text" v-model="form.email"/>
            </span>
            <span class="action">
            </span>
          </div>
        </div>
      </div>

      <div class="other">
        <div class="section-ctx">
          <div class="item btn-box">
            <span class="text" style="visibility: hidden">-</span>
            <div class="info">
              <el-button class="btn-ripple fit-text btn-cancel " @click="throttle_do_submit()"
                         :loading="loading">保存
              </el-button>
              <button class="btn-ripple fit-text btn-save" @click="do_reset()">清空</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "my-info",
  data() {
    return {
      my_info: {},
      form: {
      },
      loading: false,
    };
  },
  watch: {},
  created() {
    this.throttle_do_submit = this.mix_throttle(this.do_submit, 1000)
    this.setView();
  },
  methods: {
    throttle_do_submit() {},

    setView() {
      this.query_user();
    },
    query_user() {
      this.$api({
        url: 'getUserInfo',
        method: 'get',
      }).then(res => {
        if (res.code == 200) {
          let data = res.data.user_info;
          this.my_info = data;

          this.form = {
            image: data.image,
            real_name: data.real_name,
            name: data.name,
            email: data.email,
            province: data.province,
            city: data.city,
            area: data.area,
            provinceCode: data.provinceCode,
            cityCode: data.cityCode,
            areaCode: data.areaCode,
            mobile: data.mobile,
            sex: data.sex
          }
          this.$refs.area_select.init({province: data.provinceCode, city: data.cityCode, area: data.areaCode});
          this.$store.commit("set_baseInfo", res.data.user_info);
        }
      })
    },

    do_submit() {

      if (!this.form.real_name) {
        alertErr("请填写真实姓名");
        return;
      }
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
        real_name: "",
        name: "",
        email: "",
        province: '',
        city: '',
        area: '',
        provinceCode: '',
        cityCode: '',
        areaCode: '',
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
    }
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
  padding-top: 0;

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
    margin-top: 14px;
    padding: 20px 30px;
    background: #fff;
  }
}

.page {
  .page-ctx {
    padding-bottom: 80px;

    .section-title {
      margin-bottom: 30px;
      font-size: 16px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      font-weight: 400;
      color: #666666;
    }

    .upload-box {
      img {
        width: 88px;
        height: 88px;
        border-radius: 50%;
      }
    }

    .item {
      margin-bottom: 20px;
      display: flex;
      align-items: center;

      .text {
        display: inline-block;
        min-width: 134px;
        text-align: right;
        font-size: 14px;
        color: #666;

        span {
          color: #ff0000;
        }
      }

      .info {
        padding-left: 10px;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #333333;
        display: inline-block;
        min-width: 120px;

        .el-input {
          width: 400px;
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

  .btn-save {
    width: 120px;
    height: 32px;
    background: #FFFFFF;
    border-radius: 4px;
    border: 1px solid @theme;
    font-family: Arial, Arial;
    font-weight: 400;
    font-size: 14px;
    color: @theme;

  }

  .btn-cancel {
    margin-right: 20px;
    width: 120px;
    height: 32px;
    background: @theme;
    border-radius: 4px;
    font-family: Arial, Arial;
    font-weight: 400;
    font-size: 14px;
    color: #FFFFFF;
  }
}
</style>

