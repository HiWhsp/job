<template>
  <div class="refund-sku-choose">
    <!-- 商品选择 -->
    <div class="product-row">
      <div class="label">商品</div>
      <div class="product-list">
        <div 
          class="product-item" 
          v-for="(item, index) in productList" 
          :key="index"
          @click="selectProduct(item)"
          :class="{
            'selected': selectedProduct && selectedProduct.id === item.id,
            'nokucun': !item.kucun || item.kucun <= 0
          }">
          {{ item.title }}
        </div>
      </div>
    </div>

    <!-- 数量和库存 -->
    <div class="quantity-row">
      <div class="label">数量</div>
      <div class="quantity-control">
        <div class="quantity-btn" @click="decreaseQuantity">▼</div>
        <input 
          type="number" 
          class="quantity-input" 
          v-model.number="quantity" 
          :min="1" 
          :max="selectedProduct ? selectedProduct.kucun : 0"
          @input="handleQuantityInput"
        />
        <div class="quantity-btn" @click="increaseQuantity">▲</div>
      </div>
      <div class="inventory-info" v-if="selectedProduct">
        库存 {{ selectedProduct.kucun }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "refund-sku-choose",
  data() {
    return {
      productList: [], // 商品列表
      selectedProduct: null, // 选中的商品
      quantity: 1, // 数量
    };
  },
  methods: {
    // 初始化，接收商品数组
    init(productArray) {
      this.productList = productArray || [];
      // 默认选择第一个有库存的商品
      const firstAvailable = this.productList.find(item => item.kucun > 0);
      if (firstAvailable) {
        this.selectedProduct = firstAvailable;
        this.quantity = 1;
      } else {
        this.selectedProduct = null;
        this.quantity = 1;
      }
    },

    // 选择商品
    selectProduct(item) {
      // 无库存的商品不能选择
      if (!item.kucun || item.kucun <= 0) {
        return;
      }
      this.selectedProduct = item;
      // 如果当前数量超过新选中商品的库存，重置为1
      if (this.quantity > item.kucun) {
        this.quantity = 1;
      }
      this.emitConfirm();
    },

    // 减少数量
    decreaseQuantity() {
      if (this.quantity > 1) {
        this.quantity--;
        this.emitConfirm();
      }
    },

    // 增加数量
    increaseQuantity() {
      if (this.selectedProduct && this.quantity < this.selectedProduct.kucun) {
        this.quantity++;
        this.emitConfirm();
      }
    },

    // 处理数量输入
    handleQuantityInput() {
      if (!this.selectedProduct) {
        this.quantity = 1;
        return;
      }
      // 限制数量范围
      if (this.quantity < 1) {
        this.quantity = 1;
      } else if (this.quantity > this.selectedProduct.kucun) {
        this.quantity = this.selectedProduct.kucun;
      }
      this.emitConfirm();
    },

    // 触发确认事件
    emitConfirm() {
      if (this.selectedProduct) {
        this.$emit('confirm', {
          product: this.selectedProduct,
          quantity: this.quantity
        });
      }
    }
  }
};
</script>

<style scoped lang="less">
.refund-sku-choose {
  margin-top: 20px;
}

.product-row,
.quantity-row {
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  .label {
    min-width: 60px;
    font-size: 14px;
    color: #333;
  }
}

.product-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  .product-item {
    cursor: pointer;
    background: #F9F9F9;
    padding: 0 10px;
    min-width: 111px;
    height: 37px;
    line-height: 37px;
    text-align: center;
    border-radius: 0px;
    border: 1px solid #CCCCCC;
    font-family: Microsoft YaHei, Microsoft YaHei;
    font-weight: 400;
    font-size: 12px;
    color: #333333;

    &.selected {
      border: 1px solid #2E4C87;
      color: #2E4C87;
    }

    &.nokucun {
      background: #eeeeee;
      border: 1px solid transparent;
      color: #AAAAAA;
      cursor: not-allowed;
    }
  }
}

.quantity-row {
  align-items: center;

  .quantity-control {
    display: flex;
    align-items: center;
    margin-right: 20px;

    .quantity-btn {
      cursor: pointer;
      width: 30px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      background: #F9F9F9;
      border: 1px solid #CCCCCC;
      font-size: 12px;
      color: #333;
      user-select: none;

      &:hover {
        background: #e9e9e9;
      }

      &:active {
        background: #d9d9d9;
      }
    }

    .quantity-input {
      width: 60px;
      height: 30px;
      text-align: center;
      border: 1px solid #CCCCCC;
      border-left: none;
      border-right: none;
      font-size: 14px;
      color: #333;
      outline: none;

      &::-webkit-inner-spin-button,
      &::-webkit-outer-spin-button {
        -webkit-appearance: none;
        appearance: none;
        margin: 0;
      }

      &[type=number] {
        -moz-appearance: textfield;
        appearance: textfield;
      }
    }
  }

  .inventory-info {
    font-size: 14px;
    color: #666;
  }
}
</style>
