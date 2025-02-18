<template>
  <el-drawer title="购物车" :visible.sync="drawer" direction="rtl" :wrapperClosable="false">
    <div class="cart">
      <div v-for="item in list_shopcart" :key="item.id" class="cart-item">
        <el-image :src="item.image" class="cart-image"></el-image>
        <div class="cart-info">
          <p class="cart-title">{{ item.title }}</p>
          <p class="cart-price">{{ item.num }} x CN ￥{{ item.priceSale }}</p>
        </div>
        <el-button type="text" class="remove-btn" @click="do_cart_delete_row(item.inventoryId)">×</el-button>
      </div>
      <el-empty v-if="!list_shopcart.length" description="购物车是空的..."></el-empty>
    </div>

    <div class="cart-footer">
      <p class="subtotal">小计： <span class="total-price">CN ￥{{ shopcart_money }}</span></p>
      <el-button class="view-cart-btn" @click="$router.push('/cart')">查看购物车</el-button>
      <el-button class="checkout-btn" @click="to_pay">结账</el-button>
    </div>
  </el-drawer>
</template>

<script>
export default {
  data() {
    return {
      drawer: false,
      list_shopcart: [],
    };
  },
  computed: {
    //购物车商品总金额
    shopcart_money() {
      let money = 0;
      this.list_shopcart
          .filter((v) => v.checked)
          .forEach((v) => {
            money += v.num * v.priceSale;
          });
      return money.toFixed(2);
    },
    //购物车被选择的商品
    list_shopcart_checked() {
      return this.list_shopcart
    },
  },
  methods: {
    init() {
      this.drawer = true;
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "gouwuche_lists",
        }
      }).then((res) => {
        let {code, data} = res;
        if (code == 200) {
          data.forEach((v) => {
            v.checked = true;
          });
          this.list_shopcart = data;
        }
      });
    },
    removeItem(id) {
      this.cartItems = this.cartItems.filter((item) => item.id !== id);
    },
    //购车车 删除商品
    do_cart_delete_row(inventoryId) {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "gouwuche_del",
          inventoryId: inventoryId,
        }
      }).then(res => {
        if (res.code == 200) {
          let list = this.list_shopcart;
          let ids = (inventoryId + "").split(",");
          //可能删除多项商品
          ids.forEach((inventoryId) => {
            let index = list.findIndex((v) => v.inventoryId == inventoryId);
            list.splice(index, 1);
          });

          this.do_update_vuex_cart_number()
        }
      })
    },
    //去结算
    to_pay() {
      if (!this.list_shopcart.length) {
        alertErr("您的购物车是空的，快去选购商品吧！");
        return;
      }

      if (!this.list_shopcart_checked.length) {
        alertErr("请选择要结算的商品");
        return;
      }

      let data_format = this.list_shopcart_checked.map(v => ({
        title: v.title,
        image: v.image,
        inventoryId: v.inventoryId,
        productId: v.productId,
        keyVals: v.keyVals,
        num: v.num,
        priceSale: v.priceSale,
        priceMarket: v.priceMarket,
      }));


      this.$store.commit('set_cache_payment_products', JSON.stringify(data_format))

      this.$router.push({
        path: "/order-submit",
        query: {
          from: "cart",
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
@black: #000;
@red: #D41C17;
@gray: #888;
@font-size-title: 14px;
@font-size-price: 12px;

.cart {
  padding: 20px 0;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  flex: 1;
  overflow: auto;

  .cart-item {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;

    .cart-image {
      width: 60px;
      height: 60px;
      margin-right: 10px;
      border-radius: 5px;
    }

    .cart-info {
      flex: 1;

      .cart-title {
        font-size: @font-size-title;
        font-weight: bold;
      }

      .cart-price {
        font-size: @font-size-price;
        color: @gray;
      }
    }

    .remove-btn {
      font-size: 18px;
      color: @gray;
      cursor: pointer;
    }
  }
}

.cart-footer {
  margin-top: 20px;
  margin-bottom: 50px;
  text-align: center;

  .subtotal {
    font-size: 20px;
    font-weight: 400;
    display: flex;
    justify-content: space-between;
    margin-bottom: 40px;
  }

  .total-price {
    color: #000000;
    font-size: 18px;
  }

  .view-cart-btn {
    width: 100%;
    background-color: @black;
    color: white;
    margin-bottom: 10px;
  }

  .checkout-btn {
    width: 100%;
    background-color: @red;
    color: white;
    margin-left: 0;
  }
}

/deep/ .el-drawer {
  width: 356px !important;
}

/deep/ .el-drawer__header {
  span {
    font-family: Microsoft YaHei, Microsoft YaHei;
    font-weight: 400;
    font-size: 20px;
    color: #000000;
  }
}

/deep/ .el-drawer__body {
  padding: 0 20px;
  display: flex;
  flex-direction: column;
}
</style>
