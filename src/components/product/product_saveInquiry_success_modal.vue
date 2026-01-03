<template>
  <div class="modal-container">
    <el-dialog
      title="  "
      width="568px"
      custom-class="cus-modal-wrap"
      :close-on-click-modal="true"
      :visible.sync="show_modal"
      :before-close="onBeforeClose"
    >
      <div class="modal-inner">
        <div class="tip-box">
          <img src="@img/product/product-add-success.png" alt />
        </div>
        <div class="text-box-1">您的采购需求提交成功</div>
        <div class="text-box-2">客服会电话联系您</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <div class="btns flex-center">
          <button class="btn btn-ripple btn-bg" @click="confirmClose">
            确定
          </button>
        </div>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "product-add-cart-success",
  components: {},
  data() {
    return {
      show_modal: false,
      select_sku: {},
      number: 1,
    };
  },
  computed: {
    ...mapState([""]),
  },
  watch: {},
  methods: {
    init() {
      this.show_modal = true;
    },
    confirmClose() {
      this.show_modal = false;
    },
    onBeforeClose() {
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

  .el-dialog__close {
    font-size: 20px;
  }
}

/deep/ .el-dialog__body {
  padding: 34px 60px 30px;
}

/deep/ .el-dialog__footer {
  text-align: center;
  padding-bottom: 60px;
  border-top: none;
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
      font-weight: bold;
      font-size: 20px;
      color: #1F1F1F;
    }

    .text-box-2 {
      margin-top: 18px;
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: 400;
      font-size: 16px;
      color: #333;

      .number {
        font-weight: bold;
        color: #7853b2;
      }
    }
  }
}

.btns {
  button {
    margin: 0 8px;

    width: 150px;
    height: 46px;
    background: #fffefe;
    border-radius: 4px 4px 4px 4px;
    border: 1px solid #7853b2;
    font-family: Microsoft YaHei, Microsoft YaHei;
    font-weight: 400;
    font-size: 18px;
    color: #7853b2;
  }

  .btn-bg {
    width: 150px;
    height: 46px;
    background: #7853b2;
    border-radius: 4px 4px 4px 4px;
    font-family: Microsoft YaHei, Microsoft YaHei;
    font-weight: 400;
    font-size: 18px;
    color: #ffffff;
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/modals/product_add_cart_success_modal.less"></style>
