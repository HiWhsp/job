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
          <el-input clearable v-model="form.email" placeholder="Please enter an email address"></el-input>
        </div>
        <div class="item">
          <span class="text required">Detailed Address</span>
          <el-input clearable v-model="form.address" placeholder="Please enter"></el-input>
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
              :key="item.id"
              :label="item.title"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
        <div class="item">
          <span class="text required">State</span>
          <template v-if="!stateList.length">
            <el-input clearable v-model="form.state" placeholder="Please enter"></el-input>
          </template>
          <template v-else>
            <el-select
              filterable
              v-model="form.state"
              placeholder="Please select"
              @change="changeProv"
            >
              <el-option
                v-for="item in stateList"
                :key="item.id"
                :label="item.title"
                :value="item.id"
              ></el-option>
            </el-select>
          </template>
        </div>
        <div class="item">
          <span class="text required">City</span>
          <template v-if="!cityList.length">
            <el-input clearable v-model="form.city" placeholder="Please enter"></el-input>
          </template>
          <template v-else>
            <el-select
              filterable
              v-model="form.city"
              placeholder="Please select"
              @change="changeCity"
            >
              <el-option
                v-for="item in cityList"
                :key="item.id"
                :label="item.title"
                :value="item.id"
              ></el-option>
            </el-select>
          </template>
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
        <el-button class="btn-2" @click="throttle_do_submit()" :loading="loading">SUMMIT</el-button>
        <!-- <button class="btn-ripple fit-text btn-2" @click="show_modal = false">取 消</button> -->
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "address-add",
  components: {},
  props: [],
  data() {
    return {
      show_modal: false,

      form: {
        id: null,
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        address: "",
        country: "",
        state: "",
        city: "",
        zipCode: "",
        moren: 0,
        addressType: 2 //版本：1-国内 2-国外
      },

      countryList: [],
      stateList: [],
      cityList: [],

      loading: false
    };
  },
  computed: {
    ...mapState([""])
  },
  watch: {},

  created() {
    this.queryCountryData();
    this.throttle_do_submit = this.mix_throttle(this.do_submit, 1000);
  },

  methods: {
    throttle_do_submit() {},

    // 查询国家列表（第一级）
    queryCountryData() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "users_getAreaList"
        }
      }).then(res => {
        if (res.code == 200) {
          this.countryList = res.data || [];
        }
      });
    },

    // 选择国家
    changeCountry(id) {
      // 清空下级数据
      this.form.state = "";
      this.form.city = "";
      this.stateList = [];
      this.cityList = [];

      // 更新国家名称
      let countryInfo = this.countryList.find(v => v.id == id);
      if (countryInfo) {
        this.form.country = countryInfo.title;
      }

      // 查询州/省列表（第二级）
      if (id) {
        this.$api({
          url: "/service.php",
          method: "get",
          data: {
            action: "users_getAreaList",
            parent_id: id
          }
        }).then(res => {
          if (res.code == 200) {
            this.stateList = res.data || [];
          }
        });
      }
    },

    // 选择州/省
    changeProv(id) {
      // 清空下级数据
      this.form.city = "";
      this.cityList = [];

      // 更新州/省名称
      let stateInfo = this.stateList.find(v => v.id == id);
      if (stateInfo) {
        this.form.state = stateInfo.title;
      }

      // 查询城市列表（第三级）
      if (id) {
        this.$api({
          url: "/service.php",
          method: "get",
          data: {
            action: "users_getAreaList",
            parent_id: id
          }
        }).then(res => {
          if (res.code == 200) {
            this.cityList = res.data || [];
          }
        });
      }
    },

    // 选择城市
    changeCity(id) {
      // 更新城市名称
      let cityInfo = this.cityList.find(v => v.id == id);
      if (cityInfo) {
        this.form.city = cityInfo.title;
      }
    },

    init(row) {
      console.log("row", row);
      if (!row) {
        // 新建地址，清空相关数据
        this.stateList = [];
        this.cityList = [];
        this.show_modal = true;
      } else {
        // 编辑地址
        this.form.id = row.id;
        this.show_modal = true;
        this.query_address_detail();
      }
    },
    //获取地址详情
    async query_address_detail() {
      const res = await this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "userAddress_detail",
          id: this.form.id
        }
      });
      let { code, data, msg } = res;
      if (code == 200) {
        this.form = {
          id: data.id,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          email: data.email,
          address: data.address,
          country: data.country || data.province,
          state: data.state || data.area,
          city: data.city || data.city,
          zipCode: data.zipCode,
          moren: data.moren,
          addressType: data.addressType
        };

        // 回显地址数据
        await this.initAddressData(data);
      }
    },

    // 初始化地址数据（回显）
    async initAddressData(data) {
      let country = data.country;
      let state = data.state;
      let city = data.city;

      // 先设置当前值以便回显
      if (country) {
        this.countryList = [{ id: country, title: data.country }];
        this.form.country = country;
      }
      if (state) {
        this.stateList = [{ id: state, title: data.state }];
        this.form.state = state;
      }
      if (city) {
        this.cityList = [{ id: city, title: data.city }];
        this.form.city = city;
      }

      // 并行加载完整数据
      const promises = [
        this.$api({
          url: "/service.php",
          method: "get",
          data: {
            action: "users_getAreaList"
          }
        })
      ];

      if (country) {
        promises.push(
          this.$api({
            url: "/service.php",
            method: "get",
            data: {
              action: "users_getAreaList",
              parent_id: country
            }
          })
        );
      } else {
        promises.push(Promise.resolve({ code: 200, data: [] }));
      }

      if (state) {
        promises.push(
          this.$api({
            url: "/service.php",
            method: "get",
            data: {
              action: "users_getAreaList",
              parent_id: state
            }
          })
        );
      } else {
        promises.push(Promise.resolve({ code: 200, data: [] }));
      }

      const [resCountry, resState, resCity] = await Promise.all(promises);

      if (resCountry.code == 200) {
        this.countryList = resCountry.data || [];
      }
      if (resState.code == 200) {
        this.stateList = resState.data || [];
      }
      if (resCity.code == 200) {
        this.cityList = resCity.data || [];
      }
    },

    onclosed() {
      this.form = {
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        address: "",
        country: "",
        state: "",
        city: "",
        zipCode: "",
        moren: 0,
        addressType: 2 //版本：1-国内 2-国外
      };
      // 清空列表数据
      this.stateList = [];
      this.cityList = [];
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
      // State: 如果有列表数据，需要选择；如果没有列表数据，需要手动输入
      if (this.stateList.length > 0) {
        if (!this.form.state) {
          alertErr("Please select state");
          return;
        }
      } else {
        if (!this.form.state) {
          alertErr("Please enter state");
          return;
        }
      }
      // City: 如果有列表数据，需要选择；如果没有列表数据，需要手动输入
      if (this.cityList.length > 0) {
        if (!this.form.city) {
          alertErr("Please select city");
          return;
        }
      } else {
        if (!this.form.city) {
          alertErr("Please enter city");
          return;
        }
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
          province: this.form.country,
          area: this.form.state,
          city: this.form.city,
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
      // 清空列表数据
      this.stateList = [];
      this.cityList = [];
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
        color: #000;
        font-size: 20px;
        font-weight: 400;

        &.required {
          &::before {
            margin-right: 3px;
            content: "*";
            font-family: Poppins, Poppins;
            font-weight: 400;
            font-size: 14px;
            color: #ff0000;
          }
        }

        &::after {
          margin-left: 3px;
          content: ":";
          font-family: Poppins, Poppins;
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
        font-family: Poppins, Poppins;
      }

      .el-select {
        width: 100%;
        font-family: Poppins, Poppins;
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
  color: #1e262e;

  .el-dialog__title {
    font-family: Poppins, Poppins;
    font-weight: 600;
    font-size: 24px;
    color: #1e262e;
    line-height: 34px;
  }

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
      font-weight: 400;
      font-size: 20px;
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
    border: 1px solid #00306b;
    font-family: Poppins, Poppins;
    font-weight: 400;
    font-size: 14px;
    color: #00306b;
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
