<template>
  <div class="modal-container">
    <el-dialog
      title=" "
      width="568px"
      custom-class="cus-modal-wrap"
      :close-on-click-modal="true"
      :visible.sync="show_modal"
      :before-close="onBeforeClose"
    >
      <div class="modal-inner">
        <div class="tip-box">
          <img src="@img/product/warning.png" style="width: 44px;" alt />
        </div>
        <div class="text-box-1">510K Medical Devices are only available to compliant corporate users</div>
        <div class="text-box-2">Please certify as a corporate user at the member center</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <div class="btns flex-center">
          <button class="btn btn-ripple btn-bg" @click="goToMemberCenter">SUBMIT</button>
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
      number: 1
    };
  },
  computed: {
    ...mapState([""])
  },
  watch: {},
  methods: {
    init() {
      this.show_modal = true;
    },
    goToMemberCenter() {
      this.show_modal = false;

      // this.$router.push('/my');
      this.$router.push("/enterprise-cert");
    },
    onBeforeClose() {
      this.show_modal = false;
    }
  }
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
      color: #1f1f1f;
    }

    .text-box-2 {
      margin-top: 18px;
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: 400;
      font-size: 16px;
      color: #333;

      .number {
        font-weight: bold;
        color: #00306B;
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
    border: 1px solid #00306B;
    font-family: Microsoft YaHei, Microsoft YaHei;
    font-weight: 400;
    font-size: 18px;
    color: #00306B;
  }

  .btn-bg {
    width: 150px;
    height: 46px;
    background: #00306B;
    border-radius: 4px 4px 4px 4px;
    font-family: Microsoft YaHei, Microsoft YaHei;
    font-weight: 400;
    font-size: 18px;
    color: #ffffff;
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/modals/product_add_cart_success_modal.less"></style>
