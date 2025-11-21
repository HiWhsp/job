<template>
  <div class="product-list-page">
    <div class="inner">
      <pageBreadcrumb :option="nav_option" />
      <div class="page-ctx w-1400">
        <!-- 顶部控制栏 -->
        <div class="compare-control-bar">
          <div class="control-left">
            <el-select
              v-model="inputProduct"
              placeholder="输入内容"
              clearable
              filterable
              remote
              reserve-keyword
              :remote-method="fetchProductOptions"
              :loading="productLoading"
              @visible-change="handleProductDropdown"
            >
              <el-option
                v-for="item in productOptions"
                :key="item.id"
                :label="
                  item.name || item.title || item.productName || '未命名产品'
                "
                :value="item.id"
              />
            </el-select>
            <el-button type="primary" @click="addProduct">添加产品</el-button>
          </div>
          <div class="control-right">
            <el-button type="primary" @click="clearCompare">清空对比</el-button>
            <el-button type="primary" @click="downloadTable"
              >下载对比表格</el-button
            >
          </div>
        </div>

        <!-- 产品对比区域 -->
        <div class="compare-container" v-if="compareProducts.length > 0">
          <div class="compare-content-wrapper">
            <!-- 左侧列：header-left 和 table-left -->
            <div class="compare-left-column">
              <!-- 显示选项 -->
              <div class="header-left">
                <span
                  class="display-option"
                  :class="{ active: displayMode === 'all' }"
                  @click="handleDisplayMode('all')"
                >
                  显示全部
                </span>
                <span
                  class="display-option"
                  :class="{ active: displayMode === 'selected' }"
                  @click="handleDisplayMode('selected')"
                >
                  显示所选
                </span>
              </div>
              <!-- 规格参数列表 -->
              <div class="table-left">
                <div
                  class="table-left-item"
                  v-for="(item, index) in visibleSpecs"
                  :key="index"
                  :style="{ display: item.visible ? 'block' : 'none' }"
                >
                  <div class="table-left-item-title">
                    <el-checkbox v-model="item.checked"></el-checkbox>
                    {{ item.title }}
                  </div>
                </div>
              </div>
            </div>

            <!-- 右侧列：product-cards 和 table-right -->
            <div class="compare-right-column">
              <!-- 产品头部区域 -->
              <div class="product-header-section">
                <div class="product-cards">
                  <div
                    class="product-card"
                    v-for="(product, index) in compareProducts"
                    :key="product.id || index"
                  >
                    <div class="product-image">
                      <img
                        :src="product.thumb || product.image"
                        :alt="product.title"
                      />
                    </div>
                    <div class="product-name ellipsis-2">
                      {{ product.title }}
                    </div>
                    <div class="product-id">
                      产品编号: {{ product.skuId || product.id }}
                    </div>
                    <div class="product-price">
                      ¥ {{ product.priceSale || product.price || 0 }}
                    </div>
                    <div class="quantity-selector">
                      <button @click="decreaseQuantity(index)"></button>
                      <input
                        type="text"
                        v-model="product.quantity"
                        @blur="validateQuantity(index)"
                        @input="
                          () =>
                            (product.quantity = product.quantity.replace(
                              /\D/g,
                              ''
                            ))
                        "
                      />
                      <button @click="increaseQuantity(index)"></button>
                    </div>
                    <div class="product-actions">
                      <el-button
                        type="danger"
                        size="small"
                        @click="addToCart(product)"
                        class="cart-btn"
                      >
                        <img
                          src="@/assets/img/head/icon3.png"
                          alt="加入购物车"
                        />
                        加入购物车
                      </el-button>
                      <el-button
                        type="danger"
                        size="small"
                        @click="removeProduct(product.id, index)"
                        class="delete-btn"
                      >
                        删除
                      </el-button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 详细规格对比表格 -->
              <div class="spec-table-section">
                <div
                  class="table-right"
                  v-for="(item, index) in compareProductsSpecs"
                  :key="index"
                >
                  <div
                    class="table-right-item"
                    v-for="(product, index) in visibleSpecs"
                    :key="index"
                    :style="{ display: product.visible ? 'block' : 'none' }"
                  >
                    <div class="table-right-item-title">
                      {{ item[product.fieldTitle] || "--" }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div class="empty-state" v-else>
          <div class="empty-text">暂无对比产品，请添加产品进行对比</div>
        </div>
      </div>
    </div>
    <product_add_cart_success_modal ref="product_add_cart_success_modal" />
  </div>
</template>

<script>
import pageBreadcrumb from "@/components/page/page-breadcrumb.vue";
import product_add_cart_success_modal from "@/components/product/product_add_cart_success_modal.vue";
export default {
  name: "product-compare",
  components: {
    pageBreadcrumb,
    product_add_cart_success_modal,
  },
  data() {
    return {
      nav_option: [
        {
          title: "产品对比",
          route: "/product-compare",
        },
      ],
      inputProduct: "", // 输入产品
      productOptions: [], // 产品选项列表
      productLoading: false, // 产品加载状态
      displayMode: "all", // 'all' | 'selected' 显示模式
      compareProducts: [], // 对比产品列表
      compareProductsSpecs: [], // 对比产品规格列表
      visibleSpecs: [], // 可见规格列表
      specs: [
        { key: "size", label: "尺寸", checked: true, visible: true },
        { key: "thickness", label: "厚度", checked: true, visible: true },
        { key: "coating", label: "镀膜", checked: true, visible: true },
        { key: "material", label: "材料", checked: true, visible: true },
        { key: "surfaceForm", label: "表面面型", checked: true, visible: true },
        { key: "parallelism", label: "平行差", checked: true, visible: true },
        {
          key: "surfaceFinish",
          label: "表面光洁度",
          checked: true,
          visible: true,
        },
        {
          key: "diameterTolerance",
          label: "直径误差",
          checked: true,
          visible: true,
        },
        {
          key: "thicknessTolerance",
          label: "厚度公差",
          checked: true,
          visible: true,
        },
        { key: "chamfer", label: "倒边", checked: true, visible: true },
      ],
    };
  },
  methods: {
    // 获取对比产品列表
    getCompareProducts() {
      // 从localStorage中获取对比产品ID列表
      const ids = JSON.parse(localStorage.getItem("compare_productsIds"));
      if (ids) {
        this.$api({
          url: "/service.php",
          method: "get",
          data: {
            action: "product_prosContrast",
            productIds: ids.join(","),
          },
        }).then((res) => {
          if (res.code === 200) {
            this.compareProducts = res.data.map((item) => {
              return {
                ...item,
                quantity: 1,
              };
            });
            this.setCompareProductsSpecs(this.compareProducts);
          } else {
            this.$message.error(res.msg);
          }
        });
      }
    },
    // 获取产品列表，支持关键字搜索
    getProductList(keyword = "") {
      this.productLoading = true;
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "product_plist",
          keyword,
          page: 1,
          pageNum: 10,
        },
      })
        .then((res) => {
          if (res.code === 200) {
            const list = (res.data && res.data.list) || [];
            this.productOptions = list;
          }
        })
        .catch((err) => {
          console.error("获取产品列表失败:", err);
        })
        .finally(() => {
          this.productLoading = false;
        });
    },
    // 远程搜索回调
    fetchProductOptions(keyword) {
      this.getProductList(keyword);
    },
    // 下拉展开时默认加载
    handleProductDropdown(visible) {
      if (visible && this.productOptions.length === 0 && !this.productLoading) {
        this.getProductList();
      }
    },
    // 添加产品到对比列表
    addProduct() {
      if (!this.inputProduct) {
        this.$message.warning("请选择要添加的产品");
        return;
      }

      // 检查最大对比数量（通常限制为6个）
      //   const MAX_COMPARE_COUNT = 6;
      //   if (this.compareProducts.length >= MAX_COMPARE_COUNT) {
      //     this.$message.warning(`最多只能对比${MAX_COMPARE_COUNT}个产品`);
      //     return;
      //   }

      // 检查产品是否已在对比列表中
      const existingProduct = this.compareProducts.find(
        (p) => p.id === this.inputProduct
      );
      if (existingProduct) {
        this.$message.warning("该产品已在对比列表中");
        return;
      }
      // 对比产品ID列表中添加输入产品ID
      localStorage.setItem(
        "compare_productsIds",
        JSON.stringify([
          ...this.compareProducts.map((item) => item.id),
          this.inputProduct,
        ])
      );

      // 获取对比产品列表
      this.getCompareProducts();
    },
    // 从选项添加产品（当无法获取详情时使用）
    addProductFromOption(selectedProduct) {
      const productToAdd = {
        id: selectedProduct.id,
        title: selectedProduct.title,
        thumb: selectedProduct.thumb,
        image: selectedProduct.image,
        skuId: selectedProduct.skuId || selectedProduct.id,
        priceSale: selectedProduct.priceSale,
        price: selectedProduct.price,
        quantity: 1,
      };
      this.compareProducts.push(productToAdd);
      this.$message.success("产品已添加到对比列表");
      this.inputProduct = "";
      this.productOptions = [];
    },
    // 从自定义属性中获取规格值
    getCustomAttr(productDetail, attrName) {
      if (
        !productDetail.fieldsInfo ||
        !Array.isArray(productDetail.fieldsInfo)
      ) {
        return "";
      }
      const field = productDetail.fieldsInfo.find(
        (f) => f.fieldTitle === attrName || f.name === attrName
      );
      return field ? field.fieldValue || field.value || "" : "";
    },
    // 清空对比
    clearCompare() {
      this.$confirm("确定要清空所有对比产品吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.compareProducts = [];
          this.visibleSpecs = [];
          this.$message.success("已清空对比");
        })
        .catch(() => {});
    },
    // 下载对比表格
    downloadTable() {
      // TODO: 实现下载对比表格功能
      this.$message.info("下载功能待实现");
    },
    // 减少数量
    decreaseQuantity(index) {
      if (this.compareProducts[index].quantity > 1) {
        this.compareProducts[index].quantity--;
      }
    },
    // 增加数量
    increaseQuantity(index) {
      this.compareProducts[index].quantity++;
    },
    // 验证数量
    validateQuantity(index) {
      if (
        !this.compareProducts[index].quantity ||
        this.compareProducts[index].quantity < 1
      ) {
        this.compareProducts[index].quantity = 1;
      }
    },
    // 加入购物车
    addToCart(product) {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "gouwuche_add",
          inventoryId: product.inventoryId,
          num: product.quantity,
        },
      }).then((res) => {
        let { code, data, message } = res;

        if (code == 200) {
          // 三秒后关闭弹窗

          this.$api({
            url: "/service.php",
            method: "get",
            data: {
              action: "gouwuche_lists",
            },
          }).then((res) => {
            let { code, data } = res;
            if (code == 200) {
              this.$store.commit("set_vuex_cart_number", data.length);
            }
            this.$refs.product_add_cart_success_modal.init({
              num: product.quantity,
              ...product,
            });
            setTimeout(() => {
              this.$refs.product_add_cart_success_modal.onBeforeClose();
            }, 3000);
          });
        } else {
          this.$message.error(message);
        }
      });
    },
    // 删除产品
    removeProduct(id, i) {
      this.compareProducts.splice(i, 1);
      this.compareProductsSpecs.splice(i, 1);
      // localStorage删除对比产品ID列表
      const compareProductsIds = JSON.parse(
        localStorage.getItem("compare_productsIds")
      );
      const index = compareProductsIds.indexOf(id);
      if (index !== -1) {
        compareProductsIds.splice(index, 1);
      }
      localStorage.setItem(
        "compare_productsIds",
        JSON.stringify(compareProductsIds)
      );
      this.$message.success("已删除产品");
    },
    // 设置对比产品规格列表
    setCompareProductsSpecs(products) {
      // 遍历products数组中fields数组的每一项, 找到对应的值, key为fieldTitle, value为fieldValue
      products.forEach((product) => {
        const specs = {};
        product.fields.forEach((field) => {
          specs[field.fieldTitle] = field.fieldValue;
        });
        this.compareProductsSpecs.push(specs);
      });
    },
    // 处理显示模式
    handleDisplayMode(mode) {
      if (mode == "selected") {
        // 判断可见规格列表中是否存在checked为true的项
        const checkedSpecs = this.visibleSpecs.filter((item) => item.checked);
        if (checkedSpecs.length > 0) {
          // 如果有checked为true的项, 则将可见规格列表显示的项设置为true
          this.visibleSpecs.forEach((item) => {
            item.visible = item.checked;
          });
          this.displayMode = mode;
        } else {
          this.$message.warning("请选择要显示的规格");
          return;
        }
      } else {
        this.visibleSpecs.forEach((item) => {
          item.visible = true;
          item.checked = false;
        });
        this.displayMode = mode;
      }
    },
  },
  mounted() {
    // 获取可见规格列表
    this.$api({
      url: "/service.php",
      method: "get",
      data: {
        action: "product_proContrastDir",
      },
    }).then((res) => {
      if (res.code === 200) {
        this.visibleSpecs = res.data.map((item) => ({
          ...item,
          checked: false, // 默认不选中
          visible: true, // 默认显示
        }));
        // 获取对比产品列表
        this.getCompareProducts();
      }
    });
  },
  watch: {
    compareProducts: {
      handler(newVal) {
        localStorage.setItem("compare_products", JSON.stringify(newVal));
      },
      deep: true,
    },
  },
};
</script>

<style lang="less" scoped>
.product-list-page {
  background: #f5f5f5;
  min-height: 100vh;

  .inner {
    padding-top: 0px;
    padding-bottom: 100px;

    .page-ctx {
      margin-top: 35px;
      padding-bottom: 40px;
      background: #fff;
    }
  }
}

.bread-box {
  height: 60px;
  line-height: 60px;
  border-bottom: 1px solid #e4e4e4;
  background: #fff;
}

// 顶部控制栏
.compare-control-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32px 40px;

  .control-left {
    display: flex;
    align-items: center;
    gap: 12px;

    .product-input {
      width: 300px;
    }
  }

  .control-right {
    display: flex;
    gap: 12px;
  }
}

// 产品对比容器
.compare-container {
  margin: 0px 40px;
  border: 1px solid #c6ceda;
}

// 内容包装器：两列布局
.compare-content-wrapper {
  display: flex;
}

// 左侧列：header-left 和 table-left
.compare-left-column {
  width: 200px;
  flex-shrink: 0;
  border-right: 1px solid #e4e4e4;
  background: #f8f9fa;

  .header-left {
    height: 320px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    // border-bottom: 1px solid #e4e4e4;

    .display-option {
      padding: 8px 16px;
      cursor: pointer;
      border-radius: 4px;
      text-align: center;
      color: #666;
      transition: all 0.3s;

      &:hover {
        background: #e9ecef;
      }

      &.active {
        background: #2e4c87;
        color: #fff;
      }
    }
  }

  .table-left {
    display: flex;
    flex-direction: column;

    .table-left-item {
      width: 100%;
      height: 48px;
      line-height: 48px;
      border-top: 1px solid #d8d8d8;

      &:last-child {
        border-bottom: none;
      }

      &:nth-child(even) {
        background: #fff;
      }
    }

    .table-left-item-title {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      padding-left: 17px;
    }
  }
}

// 右侧列：product-cards 和 table-right
.compare-right-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-x: auto;
  padding-bottom: 1px;
}

// 产品头部区域
.product-header-section {
  //   border-bottom: 1px solid #e4e4e4;

  .product-cards {
    display: flex;

    .product-card {
      width: 220px;
      min-width: 220px;
      height: 320px;
      padding: 15px;
      border-right: 1px solid #e4e4e4;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;

      &:last-child {
        // border-right: none;
      }

      .product-image {
        width: 90px;
        height: 90px;
        display: flex;
        align-items: center;
        justify-content: center;

        img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }
      }

      .product-name {
        width: 180px;
        height: 44px;
        font-family: PingFang SC, PingFang SC;
        font-weight: 500;
        font-size: 15px;
        color: #333333;
        text-align: left;
      }

      .product-id {
        width: 180px;
        font-family: Arial, Arial;
        font-weight: 400;
        font-size: 14px;
        color: #999999;
        text-align: left;
      }

      .product-price {
        width: 180px;
        font-family: Arial, Arial;
        font-weight: bold;
        font-size: 16px;
        color: #ff0000;
        line-height: 18px;
        text-align: left;
      }

      .quantity-selector {
        width: 180px;
        height: 32px;
        display: flex;
        align-items: center;

        button {
          width: 28px;
          height: 28px;
          cursor: pointer;

          &:first-child {
            background: url("~@/assets/img/product/num-minus.png") no-repeat
              center center / 100% 100%;
          }

          &:last-child {
            background: url("~@/assets/img/product/num-plus.png") no-repeat
              center center / 100% 100%;
          }
        }

        input {
          width: 50px;
          height: 28px;
          border: 1px solid #ddd;
          border-left: none;
          border-right: none;
          text-align: center;
          font-size: 14px;
          background: #fff;
        }
      }

      .product-actions {
        display: flex;
        gap: 8px;
        width: 100%;

        .el-button {
          width: 100%;
          padding: 0;
          font-size: 14px;
          padding: 5px 8px;
        }

        .cart-btn {
          img {
            width: 18px;
            height: 18px;
            margin-right: 8px;
          }
          background: #e50000;
          border-color: #e50000;
        }

        .delete-btn {
          color: #e50000;
          background: #fff;
          border-color: #e50000;
        }
      }
    }
  }
}

// 规格对比表格
.spec-table-section {
  display: flex;

  .table-right {
    width: 220px;
    min-width: 220px;
    border-right: 1px solid #e4e4e4;
    display: flex;
    flex-direction: column;
    background: #f8f9fa;

    &:last-child {
      //   border-right: none;
    }

    .table-right-item {
      width: 100%;
      height: 48px;
      line-height: 48px;
      border-top: 1px solid #d8d8d8;

      &:last-child {
        border-bottom: none;
      }

      &:nth-child(even) {
        background: #fff;
      }
    }

    .table-right-item-title {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      padding-left: 17px;
    }
  }
}

// 空状态
.empty-state {
  padding: 100px 40px;
  text-align: center;

  .empty-text {
    font-size: 16px;
    color: #999;
  }
}
.el-button--primary {
  background: #2e4c87;
  border-color: #2e4c87;
}
</style>
