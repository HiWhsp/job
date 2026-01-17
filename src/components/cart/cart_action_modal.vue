<template>
  <div class="modal-container">
    <el-dialog
      width="580px"
      custom-class="cus-modal-wrap"
      :close-on-click-modal="true"
      :visible.sync="show_modal"
      :before-close="onBeforeClose"
    >
      <div class="modal-inner">
        <div class="tip-box">
          <img src="@img/product/tip.png" alt />
        </div>
        <div class="text-box-1">{{ tip }}</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <button class="btn btn-ripple btn-bg" @click="do_confirm()">
          Confirm
        </button>
        <button class="btn btn-ripple" @click="show_modal = false">Cancel</button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "add-success",
  components: {},
  // props: ["curr"],
  data() {
    return {
      show_modal: false,
      tip: "",
      tip_option: {},
    };
  },
  computed: {
    ...mapState([""]),
  },
  watch: {},
  methods: {
    init(option) {
      this.tip_option = option;
      this.tip = option.tip;
      this.show_modal = true;
    },
    onBeforeClose() {
      this.show_modal = false;
    },

    do_confirm() {
      this.$emit("confirm", this.tip_option);
      this.show_modal = false;
    },
  },
};
</script>

<style scoped lang="less">
/deep/ .el-dialog__header {
  padding: 16px 24px;
  background: #fff;

  font-family: Poppins, Poppins;
  font-weight: 600;
  font-size: 18px;
  color: #333333;
  text-align: left;

  .el-dialog__close {
    font-size: 20px;
  }
}

/deep/ .el-dialog__body {
  padding: 34px 60px 53px;
}

/deep/ .el-dialog__footer {
  text-align: center;
  padding-bottom: 60px;

  button {
    margin: 0 8px;
    width: 150px;
    font-size: 18px;
    height: 46px;
    background: #00306B;
    border-radius: 4px 4px 4px 4px;

    color: #fff;
  }

  .btn-bg {
    width: 150px;
    height: 46px;
    background: #EC6A2B;
    border-radius: 4px 4px 4px 4px;
    font-family: Microsoft YaHei, Microsoft YaHei;
    font-weight: 400;
    font-size: 18px;
    color: #ffffff;
  }
}

.cus-modal-wrap {
  .modal-inner {
    padding: 0;
    text-align: center;

    img {
      width: 50px;
      height: 50px;
      object-fit: contain;
    }

    .text-box-1 {
      margin-top: 18px;
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: 400;
      font-size: 16px;
      color: #333333;
    }

    .text-box-2 {
      margin-top: 18px;
      font-family: Arial, Arial;
      font-weight: 400;
      font-size: 14px;
      color: #505050;
    }
  }
}
</style>

<style
  scoped
  lang="less"
  src="@/assets/h5css/modals/product_add_cart_success_modal.less"
></style>
