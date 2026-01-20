<template>
  <div class="modal-container">
    <el-dialog
      class="modal-address"
      title="ADD NEW ADDRESS"
      width="420px"
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
          <el-input
            clearable
            v-model="form.firstName"
            placeholder="Please enter first name"
          ></el-input>
        </div>
        <div class="item">
          <span class="text required">Last Name</span>
          <el-input
            clearable
            v-model="form.lastName"
            placeholder="Please enter Last name"
          ></el-input>
        </div>
        <div class="item">
          <span class="text required">Phone Number</span>
          <el-input
            clearable
            v-model="form.phone"
            placeholder="Please enter Phone Number"
          ></el-input>
        </div>
        <div class="item">
          <span class="text required">Email</span>
          <el-input
            clearable
            v-model="form.email"
            placeholder="Please enter an email address"
          ></el-input>
        </div>
        <div class="item">
          <span class="text required">Detailed Address</span>
          <el-input
            clearable
            v-model="form.address"
            placeholder="Please enter"
          ></el-input>
        </div>
        <div class="item">
          <span class="text required">City</span>
          <el-input
            clearable
            v-model="form.city"
            placeholder="Please enter"
          ></el-input>
        </div>
        <div class="item">
          <span class="text required">State</span>
          <el-input
            clearable
            v-model="form.province"
            placeholder="Please enter"
          ></el-input>
        </div>
        <div class="item">
          <span class="text required">Country</span>
          <el-input
            clearable
            v-model="form.country"
            placeholder="Please enter"
          ></el-input>
        </div>
        <div class="item">
          <span class="text required">Zip Code</span>
          <el-input
            clearable
            v-model="form.zipCode"
            placeholder="Please enter"
          ></el-input>
        </div>
        <div class="item">
          <span class="text required">固定电话</span>
          <el-input
            clearable
            v-model="form.phone"
            placeholder="固定电话"
          ></el-input>
        </div>
        <div class="item">
          <span class="text required">邮政编码</span>
          <el-input
            clearable
            v-model="form.areaCode"
            placeholder="邮政编码"
          ></el-input>
        </div>

        <div class="item">
          <span class="text"> </span>
          <div class="switch-row">
            <el-switch
              v-model="form.moren"
              :inactive-value="0"
              :active-value="1"
              active-color="#ec6a2b"
              inactive-color="#eeeeee"
            >
            </el-switch>
            <span class="switch-text">Set as default address</span>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <button
          class="btn-ripple fit-text btn-submit"
          @click="throttle_do_submit()"
          :disabled="loading"
        >
          SUBMIT
        </button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import area_select from "@/components/address/area_select.vue";

import { mapState } from "vuex";
export default {
  name: "address-add",
  components: {
    area_select,
  },
  props: [],
  data() {
    return {
      show_modal: false,

      form: {
        // UI fields
        firstName: "",
        lastName: "",
        email: "",
        zipCode: "",
        // backend fields
        name: "",
        phone: "",
        country: "",
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
      },

      loading: false,
    };
  },
  computed: {
    ...mapState([""]),
  },
  watch: {},

  created() {
    this.throttle_do_submit = this.mix_throttle(this.do_submit, 1000);
  },

  methods: {
    throttle_do_submit() {},

    init(row) {
      console.log(row);

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

      this.$api(
    {
        url: "/service.php",
        method: "get",
        data: {
          action: "userAddress_detail",
           id: this.form.id,
        },
      }).then((res) => {
        let { code, data, msg } = res;
        if (code == 200) {
          const nameStr = (data.name || "").trim();
          const parts = nameStr.split(/\s+/).filter(Boolean);
          const firstName = parts[0] || "";
          const lastName = parts.slice(1).join(" ");
          this.form = {
            firstName,
            lastName,
            email: data.email || "",
            zipCode: data.zipCode || data.areaCode || "",
            name: data.name,
            phone: data.phone,
            country: data.country || "",
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
          };

          // 兼容：旧地区选择器（如果还在页面上）
          if (this.$refs.area_select && typeof this.$refs.area_select.init === "function") {
            this.$nextTick(() => {
              this.$refs.area_select.init(data);
            });
          }
        }
      });
    },

    onclosed() {
      if (this.$refs.area_select && typeof this.$refs.area_select.clear === "function") {
        this.$refs.area_select.clear();
      }
      this.form = {
        firstName: "",
        lastName: "",
        email: "",
        zipCode: "",
        name: "",
        phone: "",
        country: "",
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
      // 允许国际手机号（至少 6 位数字）
      const digits = (this.form.phone || "").replace(/[^\d]/g, "");
      const is_true_phone = digits.length >= 6;

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
      if (!is_true_phone) {
        alertErr("Please enter a valid phone number");
        return;
      }
      if (!this.form.city || !this.form.province || !this.form.country) {
        alertErr("Please enter City/State/Country");
        return;
      }
      if (!this.form.address) {
        alertErr("Please enter detailed address");
        return;
      }
      if (!this.form.zipCode) {
        alertErr("Please enter Zip Code");
        return;
      }

      this.loading = true;
      // 后端仅有 name 字段时，合并 first/last
      const submitForm = {
        ...this.form,
        name: `${this.form.firstName} ${this.form.lastName}`.trim(),
        areaCode: this.form.areaCode || this.form.zipCode,
      };
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "userAddress_add",
          ...submitForm,
        },
      }).then((res) => {
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
      Object.keys(this.form).forEach((key) => {
        this.form[key] = "";
      });
    },
  },
};
</script>

<style scoped lang="less">
/deep/ .modal-custom {
  min-width: 420px;
  // margin-top: 5vh !important;

  .modal-inner {
    padding: 0;

    .item {
      margin-bottom: 14px;
      display: flex;
      align-items: center;

      .text {
        min-width: 120px;
        text-align: right;
        padding-right: 14px;
        font-size: 12px;
        color: #505050;

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
          font-size: 14px;
          color: #505050;
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
        color: #1F1F1F;
      }
    }

    .send {
      margin-top: 30px;
    }
  }
}

/deep/ .el-dialog__header {
  padding: 18px 22px 10px;
  border-bottom: none;
  background: #ffffff;

  font-family: Poppins, Poppins;
  font-weight: 600;
  font-size: 16px;
  color: #1e262e;

  .el-dialog__close {
    font-size: 20px;
  }
}

/deep/ .el-dialog__body {
  padding: 10px 22px 8px;
}

/* /deep/ .el-textarea { } */

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
  padding: 16px 22px 26px;

  .btn-submit {
    min-width: 140px;
    height: 36px;
    background: #ec6a2b;
    border-radius: 4px;
    border: none;
    font-family: Arial, Arial;
    font-weight: 700;
    font-size: 12px;
    color: #ffffff;

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
}

.switch-row {
  display: flex;
  align-items: center;
  gap: 10px;

  .switch-text {
    font-size: 12px;
    color: #505050;
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/user/addressAdd.less"></style>
