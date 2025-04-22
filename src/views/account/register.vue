<template>
  <div class="page">
    <div class="mask"></div>
    <div class="center">
      <div class="inner">
        <div class="input-wrap">
          <div class="tab-box">
            <div class="tab-item active">
              用户注册
            </div>
          </div>
          <el-form ref="form" :model="form" :rules="rules" class="demo-ruleForm" label-width="0px">
            <el-form-item prop="mobile">
              <el-input v-model="form.mobile" placeholder="请输入账号"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="form.password" placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item prop="type">
              <el-select v-model="form.type" placeholder="请选择注册角色">
                <el-option label="采购用户" value="1"></el-option>
                <el-option label="供应商" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="form.type == 1">
              <el-select v-model="form.materialTypeNames" multiple placeholder="请选择产品类别">
                <el-option v-for="(item, index) in typeSelect.caigou_type_list" :key="index" :label="item"
                           :value="item"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="form.type == 2">
              <el-select v-model="form.materialTypeIds" multiple placeholder="请选择商品类目">
                <el-option v-for="(item, index) in typeSelect.material_type_list" :key="index" :label="item.name"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="farenName">
              <el-input v-model="form.farenName" placeholder="请输入法人姓名"></el-input>
            </el-form-item>
            <el-form-item prop="code">
              <el-input v-model="form.code" placeholder="请输入统一识别代码"></el-input>
            </el-form-item>
            <el-form-item prop="username">
              <el-input v-model="form.username" placeholder="请输入联系人"></el-input>
            </el-form-item>
            <el-form-item prop="contact">
              <el-input v-model="form.contact" placeholder="请输入联系方式"></el-input>
            </el-form-item>
            <el-form-item>
              <area_select ref="area_select" @change="changeSelectAddress"/>
            </el-form-item>
            <el-form-item prop="licenseUrl">
              <el-upload
                  :limit="1"
                  :on-success="handleSuccess"
                  action="https://shalunxiehui.dx.hdapp.com.cn/api/uploadFile"
                  class="upload-demo"
                  drag
                  name="file"
              >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              </el-upload>
            </el-form-item>
          </el-form>

          <div class="btn-box">
            <button class="btn-ripple" @click="retrieve_submit">确定</button>
          </div>

          <div class="register-box">
            <span> <router-link to="/login">已有账号，直接登录</router-link> </span>
          </div>

          <div class="terms-box">
            <el-checkbox v-model="agreed"></el-checkbox>
            我已阅读并同意<span @click="terms_open">《隐私政策》</span>
          </div>
        </div>
      </div>
    </div>

    <img alt="" class="tit-logo" src="@/static/account/logo.png">
  </div>
</template>

<script>


import {mapState} from "vuex";
import area_select from "@/components/address/area_select.vue";

export default {
  name: "login",
  components: {area_select},
  data() {
    return {
      typeSelect: {},
      agreed: false,
      rules: {
        mobile: [
          {required: true, message: "请输入手机号", trigger: "blur"},
        ],
        password: [
          {required: true, message: "请输入密码", trigger: "blur"},
        ],
        farenName: [
          {required: true, message: "请输入法人姓名", trigger: "blur"},
        ],
        code: [
          {required: true, message: "请输入统一识别代码", trigger: "blur"},
        ],
        username: [
          {required: true, message: "请输入联系人", trigger: "blur"},
        ],
        contact: [
          {required: true, message: "请输入联系方式", trigger: "blur"},
        ]
      }, //rules
      form: {},
    };
  },
  computed: {
    ...mapState(["logo"]),
  },
  mounted() {
    this.$api({
      url: 'typeSelect',
      method: 'get',
    }).then((res) => {
      //console.log("注册", res);
      let {code, data, msg} = res;
      if (code == 200) {
        this.typeSelect = data;
      }
    })
  },

  methods: {
    retrieve_submit() {
      let reg_phone = /^1[3-9]\d{9}$/;
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (!reg_phone.test(this.form.mobile)) {
            alertErr("请输入正确的注册手机号");
            return;
          }
          if (!reg_phone.test(this.form.contact)) {
            alertErr("请输入正确的联系方式");
            return;
          }
          if (this.form.type == 1 && this.form.materialTypeNames.length == 0) {
            alertErr("请选择产品类别");
            return;
          }
          if (this.form.type == 2 && this.form.materialTypeIds.length == 0) {
            alertErr("请选择商品类目");
            return;
          }
          if (!this.form.licenseUrl) {
            alertErr("请上传营业执照");
            return;
          }
          if (!this.agreed) {
            alertErr("请勾选同意协议");
            return;
          }
          this.form.materialTypeNames = this.form.materialTypeNames ? this.form.materialTypeNames.join(",") : '';
          this.form.materialTypeIds = this.form.materialTypeIds ? this.form.materialTypeIds.join(",") : "";

          this.$api({
            url: 'register',
            method: 'post',
            data: this.form
          }).then((res) => {
            //console.log("注册", res);
            let {code, data, msg} = res;
            if (code == 200) {
              alertSucc(msg);
              this.$router.push("/login");
            } else {
              alertErr(msg);
            }
          });
        }
      })

      // if (!reg_phone.test(this.form.phone)) {
      //   alertErr("请输入正确的手机号");
      //   return;
      // }
    },
    handleSuccess(response, file, fileList) {
      fileList.forEach(item => {
        console.log(item)
        this.form.licenseUrl = item.response.data.save_url;
      })
    },
    //更新当前父组件数据
    changeSelectAddress(data) {
      this.$log("更新省市区数据", data);
      let {sheng, shi, qu} = data;
      this.form.province = sheng.label;
      this.form.city = shi.label;
      this.form.area = qu.label;

      this.form.province_id = sheng.value;
      this.form.city_id = shi.value;
      this.form.area_id = qu.value;
      // debugger
    },
    terms_open() {
      this.$router.push('/policy');
    },
  },
};
</script>

<style lang="less" scoped>
.page {
  width: 100%;
  position: relative;

  .tit-logo {
    position: absolute;
    width: 640px;
    height: 84px;
    z-index: 999;
    top: 260px;
    left: 520px;
  }

  .mask {
    background: url(../../static/account/login-bg.png) 100% 100% no-repeat;
    background-size: cover;
    position: absolute;
    content: "";
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    // opacity: 0.1;
    pointer-events: none;
  }

  .center {
    height: 780px;
    width: @width;
    margin: 0 auto;
    display: flex;
    justify-content: flex-end;
    background: transparent;
    align-items: center;
    position: relative;

    .inner {
      position: relative;
      width: 480px;
      min-height: 520px;
      padding: 40px 40px 60px;
      background: #ffffff;
      opacity: 1;
      border-radius: 10px;
      overflow: hidden;
      // margin: 0 auto;

      .mode-toggle {
        position: absolute;
        right: 12px;
        top: 12px;

        img {
          width: 64px;
          cursor: pointer;
        }
      }

      .demo-ruleForm {
        padding-right: 20px;
        height: 250px;
        overflow: auto;

        .el-select {
          width: 100%;
        }
      }
    }

    .tab-box {
      margin-bottom: 40px;
      .flex-center();

      .tab-item {
        font-size: 24px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        font-weight: 400;
        color: @theme;

        &.active {
          color: @theme;
        }
      }
    }

    .input-wrap {
      width: 400px;
      margin: 0 auto;
    }

    .agree-box {
      text-align: left;
      margin-top: 20px;
      .flex-between();

      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      line-height: 24px;
      color: #999999;

      a {
        color: @theme;
      }
    }

    .btn-box {
      margin-top: 30px;

      button {
        width: 100%;
        height: 44px;
        background: linear-gradient(90deg, #ff7327 0%, #ea5959 100%);
        background: @theme;
        font-size: 18px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        font-weight: 400;
        color: #ffffff;
      }
    }

    .register-box {
      text-align: center;
      margin-top: 30px;
      font-size: 14px;

      a {
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 24px;
        color: @theme;
        border-bottom: 1px solid @theme;
      }
    }
  }
}

.terms-box {
  position: absolute;
  height: 40px;
  width: 100%;
  background: #f5f6f8;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  padding-left: 40px;

  .el-checkbox {
    margin-right: 5px;
  }

  span {
    cursor: pointer;

    &:hover {
      color: @theme;
    }
  }
}

.qrcode-cit {
  flex-direction: column;

  .qrcode-box {
    text-align: center;
    width: 180px;
    height: 180px;
    margin-top: 25px;

    img {
      width: 180px;
      height: 180px;
    }
  }

  .title {
    font-family: Roboto, Roboto;
    font-weight: 400;
    font-size: 14px;
    color: #333333;
    font-style: normal;
    text-transform: none;

    img {
      width: 16px;
      height: 16px;
      margin-right: 5px;
    }
  }

  .text-box {
    flex-direction: column;
    margin-top: 24px;
    .flex-center();

    img {
      width: 32px;
    }

    .text {
      font-size: 16px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      font-weight: 400;
      color: #333333;
    }

    .title {
      .col {
        width: 112px;
        height: 0px;
        border: 1px solid #707070;
        opacity: 0.2;
      }

      span {
        margin: 0 5px;
      }
    }

    .check {
      flex-direction: column;
      margin-top: 20px;

      img {
        width: 48px;
        height: 48px;
      }

      span {
        margin-top: 16px;
        font-family: Roboto, Roboto;
        font-weight: 400;
        font-size: 14px;
        color: #7D7D7D;
        font-style: normal;
        text-transform: none;
      }
    }
  }
}
</style>

<style lang="less" scoped src="@/assets/h5css/page/register.less"></style>
