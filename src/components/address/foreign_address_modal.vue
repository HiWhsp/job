<template>
  <div class="modal-container">
    <el-dialog class="modal-address" title="新增地址" width="500px" :visible.sync="show_modal" :before-close="onModal_close"
      :close-on-press-escape="false" :close-on-click-modal="false" custom-class="modal-custom" @closed="onclosed">
      <div class="modal-inner">
        <div class="item">
          <span class="text required">名</span>
          <el-input clearable v-model="form.firstName" placeholder="名"></el-input>
        </div>
        <div class="item">
          <span class="text required">姓</span>
          <el-input clearable v-model="form.lastName" placeholder="姓"></el-input>
        </div>
        <div class="item">
          <span class="text">公司</span>
          <el-input clearable v-model="form.company" placeholder="公司"></el-input>
        </div>
        <div class="item required">
          <span class="text">联系电话</span>
          <el-input clearable v-model="form.phone" placeholder="联系电话"></el-input>
        </div>
        <div class="item">
          <span class="text required">国家</span>
          <el-select filterable v-model="form.country" placeholder="Country" @change="changeCountry">
            <el-option v-for="item in countryList" :key="item.value" :label="item.label" :value="item.label">
            </el-option>
          </el-select>
        </div>
        <div class="item">
          <span class="text required">州</span>
          <template v-if="!provinceList.length">
            <el-input clearable v-model="form.province" placeholder="State/province"></el-input>
          </template>
          <template v-else>
            <el-select filterable v-model="form.province" placeholder="State/province" @change="changeProv">
              <el-option v-for="item in provinceList" :key="item.value" :label="item.label" :value="item.label">
              </el-option>
            </el-select>
          </template>
        </div>
        <div class="item">
          <span class="text required">城市</span>
          <el-input clearable v-model="form.city" placeholder="City"></el-input>
        </div>
        <div class="item">
          <span class="text required">详细地址</span>
          <el-input clearable v-model="form.address" placeholder="详细地址"></el-input>
        </div>
        <div class="item">
          <span class="text required">邮编</span>
          <el-input clearable v-model="form.zipCode" placeholder="邮编"></el-input>
        </div>
        <div class="item">
          <span class="text" style="visibility: hidden;">默认地址</span>
          <el-switch v-model="form.moren" :inactive-value="0" :active-value="1" active-color="@theme"
            inactive-color="#eeeeee">
          </el-switch>
          <span class="default-text">
            <!-- 设为默认地址 -->
            Set as default address
          </span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="btn-ripple fit-text btn-1" @click="throttle_do_submit()" :loading="loading">保 存</el-button>
        <button class="btn-ripple fit-text btn-2" @click="show_modal = false">取 消</button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import countryData from '@/constant/countryData.js'

import { mapState } from "vuex";
export default {
  name: "address-add",
  components: {

  },
  props: [],
  data() {
    return {
      show_modal: false,

      form: {
        // name: "",
        phone: "",
        provinceCode: "",
        province: "",
        cityCode: "",
        city: "",
        areaCode: "",
        area: "",
        address: "",
        moren: 0,
        id: 0,
        longitude: '',
        latitude: '',
        shequId: '',
        addressType: 1,


        firstName: '',
        lastName: '',
        company: '',
        country: '',
        addressType: 2,//版本：1-国内 2-国外
        zipCode: '',
      },



      countryList: [],
      allProvinceList: [],
      provinceList: [],


      loading: false,
    };
  },
  computed: {
    ...mapState(["baseInfo"]),
  },
  watch: {

  },

  created() {
    this.countryList = countryData.countryList
    this.allProvinceList = countryData.provinceList

    this.throttle_do_submit = this.mix_throttle(this.do_submit, 1000)
  },

  methods: {
    throttle_do_submit() {

    },

    changeCountry(val) {
      this.form.province = ''

      console.log('国家', val)
      let country_info = this.countryList.find(v => v.label == val)
      let country_id = country_info.value;
      this.provinceList = this.allProvinceList.filter(v => v.country_id == country_id)

      console.log('省份列表 provinceList', this.allProvinceList)
      console.log('省份列表 provinceList', this.provinceList)
    },
    changeProv(val) {
      console.log('省份', val)

    },

    //
    //
    //

    init(row) {
      if (!row) {
        this.show_modal = true;
      } else {
        this.show_modal = true;
        this.form.id = row.id;
        this.query_address_detail();
      }
    },
    //获取地址详情
    query_address_detail() {
      this.$api("userAddress_detail", {
        id: this.form.id
      }).then((res) => {
        let { code, data, msg } = res;
        if (code == 200) {

          this.form = {
            name: data.name,
            phone: data.phone,
            provinceCode: data.provinceCode,
            province: data.province,
            cityCode: data.cityCode,
            city: data.city,
            areaCode: data.areaCode,
            area: data.area,
            address: data.address,
            moren: data.moren,
            id: data.id,
            longitude: data.longitude,
            latitude: data.latitude,
            shequId: data.shequId,
            addressType: data.addressType,

            firstName: data.firstName,
            lastName: data.lastName,
            company: data.company,
            country: data.country,
            addressType: data.addressType,
            zipCode: data.zipCode,
          }

        }
      });
    },

    onclosed() {

      this.form = {
        name: "",
        phone: "",
        provinceCode: "",
        province: "",
        cityCode: "",
        city: "",
        areaCode: "",
        area: "",
        address: "",
        moren: 0,
        id: 0,
        longitude: '',
        latitude: '',
        shequId: '',
        addressType: 1,

        firstName: '',
        lastName: '',
        company: '',
        country: '',
        addressType: 2,//版本：1-国内 2-国外
        zipCode: ''
      }


    },


    //更新当前父组件数据
    changeSelectAddress(data) {
      this.$log("更新省市区数据", data);
      let { sheng, shi, qu } = data;
      this.form.province = sheng.title;
      this.form.city = shi.title;
      this.form.area = qu.title;

      this.form.provinceCode = sheng.id;
      this.form.cityCode = shi.id;
      this.form.areaCode = qu.id;
      // debugger
    },



    // 新建地址 / 编辑地址
    do_submit() {
      let reg_phone = /^1[3-9]\d{9}$/;
      let is_true_phone = reg_phone.test(this.form.phone);

      //console.log("要保存的信息", form_data);
      if (!this.form.firstName) {
        alertErr("请输入名");
        return;
      }
      if (!this.form.lastName) {
        alertErr("请输入姓");
        return;
      }
      // if (!is_true_phone) {
      //   alertErr("请输入正确的收货人电话");
      //   return;
      // }
      if (!this.form.phone) {
        alertErr("请输入收货人电话");
        return;
      }

      if (!this.form.country) {
        alertErr("请选择所在国家");
        return;
      }
      if (!this.form.province) {
        alertErr("请选择所在州或省");
        return;
      }
      if (!this.form.city) {
        alertErr("请选择所在城市");
        return;
      }
      if (!this.form.address) {
        alertErr("请输入收货人详细地址");
        return;
      }
      if (!this.form.zipCode) {
        alertErr("请输入邮编");
        return;
      }
      this.loading = true;
      this.$api({
        url: '/service.php',
        method: 'get',
        data: {
          action: 'userAddress_add',
          ...this.form
        },
      }).then((res) => {
        alert(res).then(() => {
          this.loading = false;
        });
        if (res.code == 200) {
          this.$emit('confirm')
          this.show_modal = false;
        }
      });
    },

    onModal_close() {
      this.show_modal = false;
      //console.log("关闭前的回调");
      Object.keys(this.form).forEach((key) => {
        this.form[key] = "";
      });
    },
  },
};
</script>

<style scoped lang="less">
/deep/ .modal-custom {
  min-width: 40vw;
  margin-top: 5vh !important;

  .modal-inner {
    padding: 0;


    .item {
      margin-bottom: 20px;
      .flex();

      .text {
        min-width: 190px;
        text-align: left;
        text-align: right;
        padding-right: 10px;

        &.required {
          &::before {
            margin-right: 3px;
            content: '*';
            font-family: OPPOSans, OPPOSans;
            font-weight: 400;
            font-size: 14px;
            color: #FF0000;
          }
        }

        &::after {
          margin-left: 3px;
          content: ':';
          font-family: OPPOSans, OPPOSans;
          font-weight: 400;
          font-size: 14px;
          color: #999999;
        }
      }

      .default-text {
        margin-left: 20px;
      }

      .el-select {
        width: 100%;
        font-family: OPPOSans, OPPOSans;
        font-weight: 400;
        font-size: 14px;
        color: #666666;
      }
    }

    .send {
      margin-top: 30px;
    }
  }
}

/deep/ .el-dialog__header {
  padding: 16px 24px;
  border-bottom: 1px solid #eee;
  background: #F7F7F7;

  font-family: Poppins, Poppins;
  font-weight: 600;
  font-size: 18px;
  color: #333333;

  .el-dialog__close {
    font-size: 20px;
  }
}

/deep/ .el-dialog__body {
  padding: 36px 60px 36px 0;
}


/deep/ .el-textarea {
  .el-textarea__inner {
    // background-color: #f5f5f5;
  }
}

/deep/ .el-input {
  .el-input__inner {

    // background: #f9f9f9;
    &:disabled {
      // background-color: #eee;
      color: #666;
    }
  }
}

/deep/ .el-dialog__footer {
  text-align: center;
  padding-bottom: 50px;

  button {
    margin: 0 12px;
  }

  .btn-1 {
    min-width: 120px;
    height: 32px;
    background: #FFFFFF;
    border-radius: 50px 50px 50px 50px;
    border: 1px solid @theme;
    font-family: Arial, Arial;
    font-weight: 400;
    font-size: 14px;
    color: @theme;
  }

  .btn-2 {
    min-width: 120px;
    height: 32px;
    background: @theme;
    border-radius: 50px 50px 50px 50px;
    font-family: Arial, Arial;
    font-weight: 400;
    font-size: 14px;
    color: #FFFFFF;
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/user/addressAdd.less"></style>
