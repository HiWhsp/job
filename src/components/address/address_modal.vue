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
          <el-input clearable v-model="form.name" placeholder="Please enter first name"></el-input>
        </div>
        <div class="item">
          <span class="text required">Location</span>
          <area_select ref="area_select" @change="changeSelectAddress" />
        </div>
        <div class="item">
          <span class="text required">Detailed Address</span>
          <el-input clearable v-model="form.address" placeholder="Please enter"></el-input>
        </div>
        <div class="item">
          <span class="text required">Phone Number</span>
          <el-input clearable v-model="form.phone" placeholder="Please enter Phone Number"></el-input>
        </div>
        <!-- <div class="item">
          <span class="text required">固定电话</span>
          <el-input
            clearable
            v-model="form.phone"
            placeholder="固定电话"
          ></el-input>
        </div>-->
        <!-- <div class="item">
          <span class="text required">邮政编码</span>
          <el-input
            clearable
            v-model="form.areaCode"
            placeholder="邮政编码"
          ></el-input>
        </div>-->

        <div class="item">
          <span class="text"></span>
          <div class="switch-row">
            <el-switch
              v-model="form.moren"
              :inactive-value="0"
              :active-value="1"
              active-color="#ec6a2b"
              inactive-color="#eeeeee"
            ></el-switch>
            <span class="switch-text">Set as default address</span>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <button
          class="btn-ripple fit-text btn-submit"
          @click="throttle_do_submit()"
          :disabled="loading"
        >SUBMIT</button>
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
    area_select
  },
  props: [],
  data() {
    return {
      show_modal: false,

      form: {
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
        addressType: 1
      },

      loading: false
    };
  },
  computed: {
    ...mapState([""])
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
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "userAddress_detail",
          id: this.form.id
        }
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
            addressType: data.addressType
          };

          this.$nextTick(() => {
            this.$refs.area_select.init(data);
          });
        }
      });
    },

    onclosed() {
      this.$refs.area_select.clear();
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
        addressType: 1
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
      if (!this.form.name) {
        alertErr("请输入收货人姓名");
        return;
      }
      // if (!is_true_phone) {
      //   alertErr("请输入正确的收货人电话");
      //   return;
      // }
      if (!is_true_phone) {
        alertErr("请输入正确的收货人电话");
        return;
      }
      if (!this.form.area) {
        alertErr("请选择所在地区");
        return;
      }
      if (!this.form.address) {
        alertErr("请输入收货人详细地址");
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
  // margin-top: 5vh !important;

  .modal-inner {
    padding: 0;

    .item {
      margin-bottom: 20px;
      display: flex;
      align-items: center;

      .text {
        min-width: 220px;
        text-align: left;
        text-align: right;
        padding-right: 10px;
        font-size: 20px;
        &.required {
          &::before {
            margin-right: 3px;
            content: "*";
            font-family: OPPOSans, OPPOSans;
            font-weight: 400;
            font-size: 20px;
            color: #ff0000;
          }
        }

        &::after {
          margin-left: 3px;
          content: "";
          font-family: OPPOSans, OPPOSans;
          font-weight: 400;
          font-size: 14px;
          color: #505050;
        }
      }

      .switch-row {
        display: flex;
        align-items: center;
        .el-switch {
          margin-right: 10px;
        }
        .switch-text {
          font-size: 20px;
          color: #1e262e;
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
  border-bottom: 1px solid #eee;
  background: #f7f7f7;

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
    height: 56px;
    background: #fbfbfb;
    border: 1px solid #dbdbdb;
    font-size: 20px;
    &:disabled {
      // background-color: #eee;
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

  .btn-submit {
    width: 192px;
    height: 52px;
    background: #ec6a2b;
    border-radius: 6px 6px 6px 6px;

    font-family: Poppins, Poppins;
    font-weight: 600;
    font-size: 20px;
    color: #ffffff;
    line-height: 22px;
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/user/addressAdd.less"></style>
