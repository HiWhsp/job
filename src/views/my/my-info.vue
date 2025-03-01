<template>
  <div class="page">
    <div class="main-title">
      <span>基本信息</span>
    </div>

    <div class="page-ctx">
      <div class="title-wrap">
        <div class="info flex">
          <el-upload :action="UPLOAD_ACTION" :before-upload="upload_before_upload" :data="mix_upload_data"
                     :name="UPLOAD_NAME"
                     :on-success="upload_on_success" :show-file-list="false" accept="image/*"
                     class="upload-demo">
            <img v-if="form.image" :src="form.image" class="user-avatar"/>
            <img v-else class="user-avatar" src="@/static/my/avatar.png"/>
          </el-upload>
          <span class="name">{{ my_info.realName || "未设置" }}</span>
          <div class="vip">
            <img alt="" src="@/assets/image/product/vip.png"/>
            <span>{{ baseInfo.is_member ? "已开通" : '未开通' }}</span>
          </div>
        </div>
        <div class="card">会员卡号：{{  baseInfo.sn || '无' }}</div>
        <div class="status">状态：正常</div>
        <div class="date flex">期限：
          <p v-if="baseInfo.expire_time">剩余 <span>50</span> 天 2023-06-12 到期</p>
          <p v-else>暂未开通</p>
        </div>
      </div>
      <div class="section">
        <el-form ref="form" :model="form" label-position="top" label-width="100px">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="名字">
                <el-input v-model="form.firstName"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="姓氏">
                <el-input v-model="form.lastName"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="电话">
                <div class="flex">
                  <el-input v-model="form.phone" disabled/>
                  <p style="width: 50px; text-align: center" @click="open_phone_update()">
                    <span>修改</span>
                  </p>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="邮箱">
                <el-input v-model="form.email"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="国家/地区">
            <el-select v-model="form.countryId" placeholder="选择国家">
              <el-option v-for="item in countryList" :key="item.id" :label="item.name"
                         :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="详细地址">
            <area_select ref="area_select" @change="changeSelectAddress"/>
          </el-form-item>
          <el-form-item label="详细地址">
            <el-input v-model="form.address"/>
          </el-form-item>
          <el-form-item label="邮政编码">
            <el-input v-model="form.postCode"/>
          </el-form-item>
        </el-form>
      </div>

      <div class="other">
        <div class="section-ctx">
          <div class="item btn-box">
            <div class="info">
              <el-button :loading="loading" class="btn-ripple fit-text btn-save"
                         @click="throttle_do_submit()">保存
              </el-button>
              <!--              <button class="btn-ripple fit-text btn-cancel" @click="do_reset()">清空</button>-->
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
import area_select from "@/components/address/area_select.vue"; //协议弹窗
import phone_bind_old_check_modal from "@/components/account/phone_bind_old_check_modal.vue";
import phone_bind_new_set_modal from "@/components/account/phone_bind_new_set_modal.vue";


import {mapState} from "vuex";

export default {
  name: "servicePage",
  components: {
    phone_bind_old_check_modal,
    phone_bind_new_set_modal,
    area_select
  },
  data() {
    return {
      UPLOAD_ACTION,
      UPLOAD_NAME,
      countryList: [],
      my_info: {},
      form: {},
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
      this.$api({
        url: '/service.php',
        method: 'get',
        data: {
          action: 'index_getArea',
          country: 1
        },
      }).then(res => {
        if (res.code == 200) {
          this.countryList = res.data
        }
      })
      this.query_user();
    },

    //更新当前父组件数据
    changeSelectAddress(data) {
      this.$log("更新省市区数据", data);
      let {sheng, shi, qu} = data;
      this.form.province = sheng.id;
      this.form.city = shi.id;
      this.form.areaId = qu.id;
      // debugger
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
          this.form = data
          const addrData = {
            provinceCode: data.province,
            province: data.province,
            cityCode: data.city,
            city: data.city,
            areaCode: data.area,
            area: data.area,
          }
          this.$refs.area_select.init(addrData);

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
          ...{
            firstName: this.form.firstName,
            lastName: this.form.lastName,
            phone: this.form.phone,
            email: this.form.email,
            countryId: this.form.countryId,
            address: this.form.address,
            postCode: this.form.postCode
          }
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
    font-family: Microsoft YaHei, Microsoft YaHei;
    font-weight: 400;
    font-size: 16px;
    color: #000000;
    margin-bottom: 15px;
  }
}

.page {
  .page-ctx {
    padding-bottom: 80px;
    border: 1px solid #E5E5E5;

    .title-wrap {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 98px;
      background: #F8F8F8;
      border-bottom: 1px solid rgba(29, 32, 136, 0.2);
      padding: 0 28px;

      .info {
        .upload-demo {
          width: 42px;
          height: 42px;
          border-radius: 7px;
          border: 1px solid #FFFFFF;
          margin-right: 10px;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }

        .name {
          font-weight: 400;
          font-size: 16px;
          color: #000000;
          margin-right: 15px;
        }

        .vip {
          width: 71px;
          height: 26px;
          background: rgba(255, 255, 255, 0.88);
          text-align: center;
          line-height: 26px;

          font-weight: 400;
          font-size: 12px;
          color: #3D3D3D;

          img {
            width: 16px;
            height: 14px;
            margin-right: 5px;
          }
        }
      }

      .card, .status, .date {
        color: #777777;
        font-size: 15px;

        span {
          color: #D41C17;
        }
      }
    }

    .section {
      width: 782px;
      margin-left: 28px;
      margin-top: 28px;
    }

    .section-title {
      margin-bottom: 50px;
      font-size: 16px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      font-weight: 400;
      color: #666666;
    }

    .section-ctx {
      margin-left: 28px;
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
    width: 264px;
    height: 48px;
    line-height: 48px;
    background: #000000;
    text-align: center;
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
