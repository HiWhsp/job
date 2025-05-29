<template>
  <div class="modal-container">
    <el-dialog
      :title="number + '件商品加入购物车'"
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
        <div class="text-box-1">该商品已成功加入购物车</div>
        <div class="text-box-2">
          购物车共 <span class="number">{{ vuex_cart_number }}</span> 件商品
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <div class="btns flex-center">
          <button class="btn btn-ripple btn-bg" @click="$router.push('/cart')">
            查看购物车
          </button>
          <button class="btn btn-ripple" @click="show_modal = false">
            继续购物
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
      color: #f74747;
    }

    .text-box-2 {
      margin-top: 18px;
      font-family: Arial, Arial;
      font-weight: 400;
      font-size: 14px;
      color: #999999;

      .number {
        color: #f74747;
      }
    }
  }
}

.btns {
  button {
    margin: 0 8px;

    width: 133px;
    height: 40px;
    background: linear-gradient(180deg, #fffefe 0%, #e8e8e8 100%);
    border-radius: 0px 0px 0px 0px;
    border: 1px solid #e5e5e5;
    font-family: Microsoft YaHei, Microsoft YaHei;
    font-weight: 400;
    font-size: 14px;
    color: #333333;
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
</style>

<style scoped lang="less" src="@/assets/h5css/modals/product_add_cart_success_modal.less"></style>
