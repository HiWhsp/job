<template>
  <div class="page">
    <div class="main-title">
      <span>营业信息</span>
    </div>
    <div class="page-ctx">
      <div class="section">
        <div class="section-ctx">
          <div class="item upload-box">
            <span class="text">营业执照</span>
            <span class="info">
              <div class="upload-box">
                <el-upload class="upload-demo" accept="image/*" :show-file-list="false" name="file"
                           action="https://jxjsjc.dx.hdapp.com.cn/api/store/upload"
                           :data="mix_upload_data" :on-success="upload_on_success"
                           :before-upload="upload_before_upload">
                  <img v-if="form.bus_pic" :src="form.bus_pic" class="user-avatar"/>
                  <img v-else src="@/assets/img/supplier/avatar.png" class="user-avatar"/>
                </el-upload>
              </div>
            </span>
          </div>
          <div class="item">
            <span class="text">公司名称</span>
            <span class="info">
              <el-input clearable type="text" v-model="form.company_name" placeholder="请输入公司名称"/>
            </span>
          </div>

          <div class="item">
            <span class="text">注册资金</span>
            <span class="info"><el-input clearable type="text" v-model="form.bus_capital" placeholder="请输入注册资金"/></span>
          </div>
          <div class="item">
            <span class="text">法人</span>
            <span class="info"><el-input clearable type="text" v-model="form.bus_legal"
                                         placeholder="请输入法人"/></span>
          </div>
          <div class="item">
            <span class="text">纳税人识别号</span>
            <span class="info"><el-input clearable type="text" v-model="form.bus_no" placeholder="请输入纳税人识别号"/></span>
          </div>
        </div>
      </div>

      <div class="other">
        <!-- <div class="section-title">个人信息</div> -->
        <div class="section-ctx">
          <div class="item btn-box">
            <span class="text" style="visibility: hidden">-</span>
            <div class="info">
              <button class="btn-ripple fit-text btn-save" @click="do_reset()">清空</button>
              <el-button type="primary" class="btn-ripple fit-text back" @click="throttle_do_submit()"
                         :loading="loading">保存
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {UPLOAD_ACTION, UPLOAD_NAME} from '@/config/env.js'

export default {
  name: "businessInfo",
  data() {
    return {
      UPLOAD_ACTION,
      UPLOAD_NAME,

      my_info: {},
      form: {
        bus_pic: '',
        company_name: '',
        bus_capital: '',
        bus_legal: '',
        bus_no: ''
      },
      loading: false,
    };
  },
  mounted() {
    this.throttle_do_submit = this.mix_throttle(this.do_submit, 1000)
    this.setView();
  },
  methods: {
    throttle_do_submit() {

    },

    setView() {
      this.query_user();
    },
    query_user() {
      this.$api({
        url: 'store/info',
        method: 'post',
      }).then(res => {
        if (res.code == 200) {
          let data = res.data;
          this.form = {
            bus_pic: data.bus_pic,
            company_name: data.company_name,
            bus_capital: data.bus_capital,
            bus_legal: data.bus_legal,
            bus_no: data.bus_no
          }
          this.$store.commit("set_baseInfo", res.data);
        }
      })
    },

    do_submit() {

      if (!this.form.bus_pic) {
        alertErr("请上传营业执照");
        return;
      }
      if (!this.form.company_name) {
        alertErr("请输入公司名称");
        return;
      }
      if (!this.form.bus_capital) {
        alertErr("请输入注册资金");
        return;
      }
      if (!this.form.bus_legal) {
        alertErr("请输入法人");
        return;
      }
      if (!this.form.bus_no) {
        alertErr("请输入纳税人识别号");
        return;
      }


      this.loading = true;
      this.$api({
        url: 'store/edit',
        method: 'post',
        data: {
          action: '2',
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
        nickName: "",
        email: "",
        province: '',
        city: '',
        areaId: '',
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
        this.form.bus_pic = res.data.url;
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
  width: 100%;
  text-align: left;
  padding-bottom: 80px;
  padding-top: 0;
  margin: 0;

  .main-title {
    .flex-between();
    padding: 0 32px;
    text-align: left;
    height: 56px;
    line-height: 56px;
    background: #ffffff;
    font-size: 16px;
    font-weight: bold;
    color: #333333;
    border-bottom: 1px solid #E8E8E8;

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
    padding-bottom: 80px;

    .section {
      // padding-bottom: 27px;
      // margin-bottom: 40px;
      // border-bottom: 1px solid #dbdbdb;
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

    .upload-box {
      align-items: start !important;

      img {
        width: 100px;
        height: 150px;
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

  .back {
    margin-left: 10px;
    background-color: @theme;
    border: none;
    width: 120px;
    height: 32px;
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

