<template>
  <el-drawer title="购物车" :visible.sync="drawer" direction="rtl">
    <div class="cart">
      <div v-for="item in cartItems" :key="item.id" class="cart-item">
        <el-image :src="item.image" class="cart-image"></el-image>
        <div class="cart-info">
          <p class="cart-title">{{ item.title }}</p>
          <p class="cart-price">1x CN ￥{{ item.price }}</p>
        </div>
        <el-button type="text" class="remove-btn" @click="removeItem(item.id)">×</el-button>
      </div>
    </div>

    <div class="cart-footer">
      <p class="subtotal">小计： <span class="total-price">CN ￥{{ totalPrice }}</span></p>
      <el-button class="view-cart-btn">查看购物车</el-button>
      <el-button class="checkout-btn">结账</el-button>
    </div>
  </el-drawer>
</template>

<script>
export default {
  data() {
    return {
      drawer: true,
      cartItems: [
        {
          id: 1,
          title: "CALSONIC SKYLINE GT-R Gr.A JTC 1990年冠军",
          price: 348.0,
          image: "https://via.placeholder.com/100",
        },
        {
          id: 2,
          title: "FuelMe 1/64 RWB 993 皇家海洋 版本2 “破空士”",
          price: 348.0,
          image: "https://via.placeholder.com/100",
        },
      ],
    };
  },
  computed: {
    totalPrice() {
      return this.cartItems.reduce((sum, item) => sum + item.price, 0);
    },
  },
  methods: {
    removeItem(id) {
      this.cartItems = this.cartItems.filter((item) => item.id !== id);
    },
  },
};
</script>

<style lang="less" scoped>
@black: #000;
@red: #d50000;
@gray: #888;
@font-size-title: 14px;
@font-size-price: 12px;

.cart {
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
  text-align: center;

  .subtotal {
    font-size: 16px;
    font-weight: bold;
  }

  .total-price {
    color: @red;
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
  }
}

/deep/ .el-drawer__body {
  padding: 0 20px;
}
</style>