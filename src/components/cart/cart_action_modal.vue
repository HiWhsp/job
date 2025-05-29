<template>
  <div class="modal-container">
    <el-dialog
      title="提示"
      width="580px"
      custom-class="cus-modal-wrap"
      :close-on-click-modal="true"
      :visible.sync="show_modal"
      :before-close="onBeforeClose"
    >
      <div class="modal-inner">
        <!-- <div class="tip-box">
            <img src="@img/product/product-add-success.png" alt />
          </div> -->
        <div class="text-box-1">{{ tip }}</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <button class="btn btn-ripple btn-bg" @click="do_confirm()">
          确认
        </button>
        <button class="btn btn-ripple" @click="show_modal = false">取消</button>
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
  border-bottom: 1px solid #eee;
  background: #f7f7f7;

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
    width: 133px;
    height: 40px;
    background: linear-gradient(180deg, #fffefe 0%, #e8e8e8 100%);
    border-radius: 0px 0px 0px 0px;
    border: 1px solid #e5e5e5;
  }

  .btn-bg {
    width: 133px;
    height: 40px;
    background: #009f39;
    border-radius: 0px 0px 0px 0px;
    font-family: Microsoft YaHei, Microsoft YaHei;
    font-weight: 400;
    font-size: 14px;
    color: #ffffff;
  }
}

.cus-modal-wrap {
  .modal-inner {
    padding: 0;
    text-align: center;

    .img-box {
      img {
        width: 150px;
        height: 150px;
        object-fit: contain;
      }
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
      color: #999999;
    }
  }
}
</style>
  
  <style scoped lang="less" src="@/assets/h5css/modals/product_add_cart_success_modal.less"></style>
  