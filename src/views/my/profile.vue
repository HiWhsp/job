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
            <div class="info">
              <el-upload class="upload-demo" accept="image/*" :show-file-list="false" name="img"
                         action="https://fjjx.dx.hdapp.com.cn/service.php?action=index_ossUpload"
                         :data="mix_upload_data" :on-success="upload_on_success"
                         :before-upload="upload_before_upload">
                <img v-if="form.image" :src="form.image" class="user-avatar"/>
                <img v-else src="@/assets/img/my/avatar.png" class="user-avatar"/>
              </el-upload>
            </div>
          </div>
          <div class="item">
            <div class="info">
              <span class="text">真实姓名：</span>
              <el-input clearable type="text" v-model="form.realName"/>
            </div>
            <span class="action"> </span>
          </div>

          <div class="item">
            <div class="info">
              <span class="text">手机：</span>
              <el-input disabled type="text" v-model="my_info.phone"/>
            </div>
            <span class="action" @click="open_phone_update()">
              <span>修改</span>
            </span>
          </div>
          <div class="item">
            <div class="info">
              <span class="text">邮箱：</span>
              <el-input clearable type="text" v-model="form.email"/>
            </div>
            <span class="action">
            </span>
          </div>
          <div class="item">
            <div class="info">
              <span class="text">身份：</span>
              <el-select v-model="form.sheng" placeholder="请选择" clearable>
                <el-option v-for="item in list_sheng" :key="item.id" :label="item.title" :value="item.id"></el-option>
              </el-select>
              <span class="tip">！身份请如实填写，若系统检测您的身份不相符，将禁用账户。请慎重选择</span>
            </div>
            <span class="action"> </span>
          </div>

          <div class="item">
            <span class="info">
              <span class="text">所在省市：</span>
              <area_select ref="area_select" @change="changeSelectAddress"/>
            </span>
            <span class="action"> </span>
          </div>
          <div class="item" v-if="form.sheng === 1">
            <div class="info">
              <span class="text">所在高校：</span>
              <div class="flex">
                <el-input clearable v-model="form.nickName" placeholder="请填写学校"
                          style="margin-right: 15px;"></el-input>
                <el-input clearable v-model="form.nickName" placeholder="请填写院系"></el-input>
              </div>
            </div>
            <span class="action">
            </span>
          </div>
          <div class="item" v-if="form.sheng === 2">
            <div class="info">
              <span class="text">医院：</span>
              <div class="flex">
                <el-input clearable v-model="form.nickName" placeholder="请填写医院"></el-input>
              </div>
            </div>
            <span class="action">
            </span>
          </div>
          <div class="item" v-if="form.sheng === 3">
            <div class="info">
              <span class="text">企业：</span>
              <div class="flex">
                <el-input clearable v-model="form.nickName" placeholder="请填写企业"></el-input>
              </div>
            </div>
            <span class="action">
            </span>
          </div>
          <div class="item">
            <div class="info">
              <span class="text">详细地址：</span>
              <div class="flex">
                <el-input clearable v-model="form.nickName" placeholder="请输入详细地址"
                          style="margin-right: 15px;"></el-input>
              </div>
            </div>
            <span class="action">
            </span>
          </div>
        </div>
      </div>

      <div class="other">
        <!-- <div class="section-title">个人信息</div> -->
        <div class="section-ctx">
          <div class="item btn-box">
            <!--            <span class="text" style="visibility: hidden">-</span>-->
            <div class="flex">
              <el-button class="btn-ripple fit-text btn-cancel " @click="throttle_do_submit()"
                         :loading="loading">保存
              </el-button>
              <button class="btn-ripple fit-text btn-save" @click="do_reset()">清空</button>
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
import area_select from "@/components/address/area_select.vue";

export default {
  name: "servicePage",
  components: {
    area_select,
    phone_bind_old_check_modal,
    phone_bind_new_set_modal,
  },
  data() {
    return {
      UPLOAD_ACTION,
      UPLOAD_NAME,

      list_sheng: [
        {id: 1, title: "教职工"},
        {id: 2, title: "医院"},
        {id: 3, title: "企业"},
      ],

      my_info: {},
      form: {
        image: '',
        realName: "",
        nickname: "",
        email: "",
        province: '',
        city: '',
        area: '',
        provinceCode: '',
        cityCode: '',
        areaCode: '',
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
            image: data.image,
            realName: data.realName,
            nickname: data.nickname,
            email: data.email,
            province: data.province,
            city: data.city,
            area: data.areaId,
            provinceCode: data.provinceCode,
            cityCode: data.cityCode,
            areaCode: data.areaCode,
          }
          this.$refs.area_select.init({province: data.province, city: data.city, area: data.areaId});
          this.$store.commit("set_baseInfo", res.data);
        }
      })
    },

    do_submit() {

      if (!this.form.realName) {
        alertErr("请填写真实姓名");
        return;
      }

      if (!this.form.area) {
        alertErr("请填写所在地区");
        return;
      }

      if (!this.form.email) {
        alertErr("请填写邮箱");
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
        realName: "",
        nickName: "",
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
    },

    changeSelectAddress(data) {
      this.$log("更新省市区数据", data);
      let {sheng, shi, qu} = data;
      this.form.province = sheng.title;
      this.form.city = shi.title;
      this.form.area = qu.title;

      this.form.provinceCode = sheng.id;
      this.form.cityCode = shi.id;
      this.form.areaCode = qu.id;
      // debugger
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
  padding-top: 0;

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
    border-bottom: 1px solid #dbdbdb;
  }

  .page-ctx {
    padding: 20px 30px;
    background: #fff;
  }
}

.page {
  .page-ctx {
    padding-bottom: 80px;

    .section-ctx {
      padding-left: 100px;
      position: relative;
    }

    .upload-box {
      width: 226px;
      height: 226px;
      background: #FFFFFF;
      box-shadow: 0px 0px 6px 1px rgba(0, 0, 0, 0.16);
      border-radius: 12px;
      position: absolute;
      top: 80px;
      right: 100px;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        width: 137px;
        height: 137px;
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
        text-align: left;
        font-size: 14px;
        color: #666;
        margin-bottom: 5px;

        span {
          color: #ff0000;
        }
      }

      .info {
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #333333;
        min-width: 120px;
        display: flex;
        flex-direction: column;

        .el-input {
          width: 400px;
          // height: 40px;
        }

        .tip {
          margin-top: 10px;
          font-weight: 400;
          font-size: 14px;
          color: #FF0000;
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

