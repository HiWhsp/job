<template>
  <div class="modal-container">
    <el-dialog :title="number + '件商品加入购物车'" width="580px" custom-class="cus-modal-wrap"
               :close-on-click-modal="true"
               :visible.sync="show_modal" :before-close="onBeforeClose">
      <div class="modal-inner">
        <div class="tip-box">
          <img src="../../static/prod/product-add-success.png" alt/>
        </div>
        <div class="text-box-1">该商品已成功加入购物车</div>
        <div class="text-box-2">购物车共 <span>{{ shopcart_count }}</span> 件商品</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <button class="btn btn-ripple btn-1" @click="$router.push('/cart')">查看购物车</button>
        <button class="btn btn-ripple btn-2" @click="show_modal = false">继续购物</button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: "add-success",
  components: {},
  data() {
    return {
      show_modal: false,
      number: 1,
      shopcart_count: 0
    };
  },
  watch: {},
  methods: {
    init(select_sku) {
      this.number = select_sku.num;
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "gouwuche_lists",
        }
      }).then(res => {
        if (res.code == 200) {
          res.data.forEach((v) => {
            this.shopcart_count += +v.num;
          });
          // this.shopcart_count = res.data.length;
        }
      })
      // this.shopcart_count = select_sku.shopcart_count;
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
  background: #F7F7F7;

  font-family: Poppins, Poppins;
  font-weight: 600;
  font-size: 18px;
  color: #333333;

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
  }

  .btn-1 {
    width: 133px;
    height: 40px;
    background: @theme;
    border-radius: 4px 4px 4px 4px;
    font-family: Roboto, Roboto;
    font-weight: 400;
    font-size: 14px;
    color: #FFFFFF;
    font-style: normal;
    text-transform: none;
  }

  .btn-2 {
    width: 133px;
    height: 40px;
    background: linear-gradient(180deg, #FFFEFE 0%, #E8E8E8 100%);
    border-radius: 4px 4px 4px 4px;
    border: 1px solid #E5E5E5;
    font-family: Roboto, Roboto;
    font-weight: 400;
    font-size: 14px;
    color: #333333;
    font-style: normal;
    text-transform: none;
  }
}

.cus-modal-wrap {
  .modal-inner {
    padding: 0;
    text-align: center;

    .tip-box {
      img {
        width: 44px;
        height: 44px;
        object-fit: contain;
      }
    }

    .text-box-1 {
      margin-top: 18px;
      font-family: Roboto, Roboto;
      font-weight: bold;
      font-size: 20px;
      color: @theme;
      font-style: normal;
      text-transform: none;
    }

    .text-box-2 {
      margin-top: 18px;
      font-family: Roboto, Roboto;
      font-weight: 400;
      font-size: 14px;
      color: #333333;
      font-style: normal;
      text-transform: none;

      span {
        color: #E6170B;
      }
    }
  }
}

</style>

<style scoped lang="less" src="@/assets/h5css/modals/product_add_cart_success_modal.less"></style>
