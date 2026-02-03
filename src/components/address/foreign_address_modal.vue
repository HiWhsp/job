<template>
  <div class="modal-container">
    <el-dialog
      class="modal-address"
      title="ADD NEW ADDRESS"
      width="920px"
      :visible.sync="show_modal"
      :before-close="onModal_close"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      custom-class="modal-custom"
      @closed="onclosed"
    >
      <div class="modal-inner">
        <div class="item">
          <span class="text required">First Name</span>
          <el-input clearable v-model="form.firstName" placeholder="Please enter first name"></el-input>
        </div>
        <div class="item">
          <span class="text required">Last Name</span>
          <el-input clearable v-model="form.lastName" placeholder="Please enter last name"></el-input>
        </div>
        <div class="item required">
          <span class="text required">Phone Number</span>
          <el-input clearable v-model="form.phone" placeholder="Please enter phone number"></el-input>
        </div>
        <div class="item">
          <span class="text required">Email</span>
          <el-input clearable v-model="form.company" placeholder="Please enter an email address"></el-input>
        </div>
        <div class="item">
          <span class="text required">Detailed Address</span>
          <el-input clearable v-model="form.address" placeholder="Please enter"></el-input>
        </div>
        <div class="item">
          <span class="text required">City</span>
          <el-input clearable v-model="form.city" placeholder="Please enter"></el-input>
        </div>
        <div class="item">
          <span class="text required">State</span>
          <template v-if="!provinceList.length">
            <el-input clearable v-model="form.province" placeholder="Please enter"></el-input>
          </template>
          <template v-else>
            <el-select
              filterable
              v-model="form.province"
              placeholder="Please enter"
              @change="changeProv"
            >
              <el-option
                v-for="item in provinceList"
                :key="item.value"
                :label="item.label"
                :value="item.label"
              ></el-option>
            </el-select>
          </template>
        </div>
        <div class="item">
          <span class="text required">Country</span>
          <el-select
            filterable
            v-model="form.country"
            placeholder="Please select"
            @change="changeCountry"
          >
            <el-option
              v-for="item in countryList"
              :key="item.value"
              :label="item.label"
              :value="item.label"
            ></el-option>
          </el-select>
        </div>
        <div class="item">
          <span class="text required">Zip Code</span>
          <el-input clearable v-model="form.zipCode" placeholder="Please enter"></el-input>
        </div>
        <div class="item">
          <span class="text" style="visibility: hidden;"></span>
          <el-switch
            v-model="form.moren"
            :inactive-value="0"
            :active-value="1"
            active-color="#EC6A2B"
            inactive-color="#eeeeee"
          ></el-switch>
          <span class="default-text">
            <!-- 设为默认地址 -->
            Set as default address
          </span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="btn-2" @click="throttle_do_submit()" :loading="loading">Submit</el-button>
        <!-- <button class="btn-ripple fit-text btn-2" @click="show_modal = false">取 消</button> -->
      </span>
    </el-dialog>
  </div>
</template>

<script>
import countryData from "@/constant/countryData.js";

import { mapState } from "vuex";
export default {
  name: "address-add",
  components: {},
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
        longitude: "",
        latitude: "",
        shequId: "",
        addressType: 1,

        firstName: "",
        lastName: "",
        company: "",
        country: "",
        addressType: 2, //版本：1-国内 2-国外
        zipCode: ""
      },

      countryList: [],
      allProvinceList: [],
      provinceList: [],

      loading: false
    };
  },
  computed: {
    ...mapState([""])
  },
  watch: {},

  created() {
    this.countryList = countryData.countryList;
    this.allProvinceList = countryData.provinceList;

    this.throttle_do_submit = this.mix_throttle(this.do_submit, 1000);
  },

  methods: {
    throttle_do_submit() {},

    changeCountry(val) {
      this.form.province = "";

      console.log("国家", val);
      let country_info = this.countryList.find(v => v.label == val);
      let country_id = country_info.value;
      this.provinceList = this.allProvinceList.filter(
        v => v.country_id == country_id
      );

      console.log("省份列表 provinceList", this.allProvinceList);
      console.log("省份列表 provinceList", this.provinceList);
    },
    changeProv(val) {
      console.log("省份", val);
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
      }).then(res => {
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
            zipCode: data.zipCode
          };
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
        longitude: "",
        latitude: "",
        shequId: "",
        addressType: 1,

        firstName: "",
        lastName: "",
        company: "",
        country: "",
        addressType: 2, //版本：1-国内 2-国外
        zipCode: ""
      };
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
        alertErr("Please enter first name");
        return;
      }
      if (!this.form.lastName) {
        alertErr("Please enter last name");
        return;
      }
      // if (!is_true_phone) {
      //   alertErr("请输入正确的收货人电话");
      //   return;
      // }
      if (!this.form.phone) {
        alertErr("Please enter phone number");
        return;
      }

      if (!this.form.country) {
        alertErr("Please select country");
        return;
      }
      if (!this.form.province) {
        alertErr("Please enter state");
        return;
      }
      if (!this.form.city) {
        alertErr("Please enter city");
        return;
      }
      if (!this.form.address) {
        alertErr("Please enter detailed address");
        return;
      }
      if (!this.form.zipCode) {
        alertErr("Please enter zip code");
        return;
      }
      this.loading = true;
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "userAddress_add",
          ...this.form
        }
      }).then(res => {
        alert(res).then(() => {
          this.loading = false;
        });
        if (res.code == 200) {
          this.$emit("confirm");
          this.show_modal = false;
        }
      });
    },

    onModal_close() {
      this.show_modal = false;
      //console.log("关闭前的回调");
      Object.keys(this.form).forEach(key => {
        this.form[key] = "";
      });
    }
  }
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
      display: flex;
      align-items: center;

      .text {
        min-width: 200px;
        text-align: right;
        padding-right: 10px;
        color: #1e262e;
        font-size: 20px;

        &.required {
          &::before {
            margin-right: 3px;
            content: "*";
            font-family: OPPOSans, OPPOSans;
            font-weight: 400;
            font-size: 14px;
            color: #ff0000;
          }
        }

        &::after {
          margin-left: 3px;
          content: ":";
          font-family: OPPOSans, OPPOSans;
          font-weight: 400;
          font-size: 20px;
          color: #505050;
        }
      }

      .default-text {
        margin-left: 20px;
        font-size: 20px;
        color: #1e262e;
        font-weight: 400;
        font-family: OPPOSans, OPPOSans;
      }

      .el-select {
        width: 100%;
        font-family: OPPOSans, OPPOSans;
        font-weight: 400;
        font-size: 14px;
        color: #1f1f1f;
      }
    }

    .send {
      margin-top: 30px;
    }
  }
}

/deep/ .el-dialog__header {
  padding: 16px 24px;
  background: #fff;

  font-family: Poppins, Poppins;
  font-weight: 600;
  font-size: 24px;
  color: #1E262E;

  .el-dialog__close {
    font-size: 20px;
  }
}

/deep/ .el-dialog__body {
  padding: 50px;
}

/deep/ .el-textarea {
  .el-textarea__inner {
    // background-color: #f5f5f5;
  }
}

/deep/ .el-input {
  .el-input__inner {
    height: 56px;
    font-size: 20px;
    color: #1e262e;
    border: 1px solid #dbdbdb;
    border-radius: 6px;
    background: #fbfbfb;
    &:disabled {
      color: #999;
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
    background: #ffffff;
    border-radius: 50px 50px 50px 50px;
    border: 1px solid #7853b2;
    font-family: Arial, Arial;
    font-weight: 400;
    font-size: 14px;
    color: #7853b2;
  }

  .btn-2 {
    width: 192px;
    height: 52px;
    background: #ec6a2b;
    border-radius: 6px 6px 6px 6px;

    font-family: Poppins, Poppins;
    font-weight: 600;
    font-size: 20px;
    color: #ffffff;
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/user/addressAdd.less"></style>
