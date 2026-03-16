<template>
  <div class="modal-container">
    <el-dialog
      :title="number + ' items added to cart'"
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
        <div class="text-box-1">Successfully added to cart!</div>
        <div class="text-box-2">
          There are <span class="number">{{ vuex_cart_number }}</span> items in
          the cart
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <div class="btns flex-center">
          <button class="btn btn-ripple btn-bg" @click="$router.push('/cart')">
            VIEW MY CART
          </button>
          <button class="btn btn-ripple" @click="handle_xjgw">
            Continue shopping
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
    init(select_sku) {
      this.number = select_sku.num;
      this.select_sku = select_sku;
      this.show_modal = true;

      // 3秒后显示提示信息
      // setTimeout(() => {
      //   console.log("3秒后执行此代码");
      //   this.show_modal = false;
      // }, 3000);
    },
    onBeforeClose() {
      this.show_modal = false;
    },
    handle_xjgw() {
      this.show_modal = false;

      window.open("/product-cates", "__blank", "", false);
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
      font-family: Poppins, Poppins;
      font-weight: bold;
      font-size: 20px;
      color: #1f1f1f;
    }

    .text-box-2 {
      margin-top: 18px;
      font-family: Poppins, Poppins;
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

    padding: 0 25px;
    height: 52px;
    background: #00306B;
    border-radius: 4px 4px 4px 4px;
    font-family: Poppins, Poppins;
    font-weight: bold;
    font-size: 20px;
    color: #fff;
  }

  .btn-bg {
    padding: 0 25px;
    height: 52px;
    background: #EC6A2B;
    border-radius: 4px 4px 4px 4px;
    font-family: Poppins, Poppins;
    font-weight: bold;
    font-size: 18px;
    color: #ffffff;
  }
}
</style>

<style
  scoped
  lang="less"
  src="@/assets/h5css/modals/product_add_cart_success_modal.less"
></style>
