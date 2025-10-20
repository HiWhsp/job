<template>
  <div class="product-list-page">
    <div class="inner">
      <pageBreadcrumb :option="nav_option" />
      <div class="page-ctx w-1400">
        <div class="product-list-container">
          <!-- 左侧筛选条件 -->
          <div class="filter-sidebar">
            <div class="filter-header">
              <h3>筛选条件</h3>
              <el-button type="text" @click="resetFilters" class="reset-btn"
                >重置</el-button
              >
            </div>

            <!-- 焦距筛选 -->
            <el-collapse v-model="activeFilters" class="filter-collapse">
              <el-collapse-item
                :title="item.title"
                :name="item.fieldTitle"
                v-for="item in filterOptions"
                :key="item.fieldTitle"
              >
                <el-checkbox-group
                  v-model="filters[item.fieldTitle]"
                  @change="handleFilterChange"
                >
                  <el-checkbox
                    :label="option"
                    v-for="(option, index) in item.options"
                    :key="index"
                    >{{ option }}</el-checkbox
                  >
                </el-checkbox-group>
              </el-collapse-item>
            </el-collapse>
          </div>

          <!-- 右侧商品展示区域 -->
          <div class="product-content">
            <div class="product-header">
              <h2 class="product-title">
                {{ nav_option[nav_option.length - 1].title }}
              </h2>
              <div class="sort-section">
                <el-select
                  v-model="sortBy"
                  placeholder="请选择排序方式"
                  @change="handleSortChange"
                >
                  <el-option label="默认排序" value="0"></el-option>
                  <el-option label="人气排序" value="1"></el-option>
                  <el-option label="价格升序" value="2"></el-option>
                  <el-option label="价格降序" value="3"></el-option>
                  <el-option label="销量升序" value="4"></el-option>
                  <el-option label="销量降序" value="5"></el-option>
                  <el-option
                    label="价格从高到低"
                    value="price-desc"
                  ></el-option>
                  <el-option label="销量排序" value="sales"></el-option>
                </el-select>
              </div>
            </div>

            <!-- 商品网格 -->
            <div class="product-grid">
              <div
                class="product-card"
                v-for="product in products"
                :key="product.id"
                @click="handleProductClick(product)"
              >
                <div class="product-image">
                  <img :src="product.thumb" :alt="product.title" />
                  <div class="product-actions">
                    <img
                      src="@img/product/icon-fav1.png"
                      alt=""
                      v-if="product.favorite"
                    />
                    <img src="@img/product/icon-fav0.png" alt="" v-else />
                  </div>
                </div>
                <div class="product-info">
                  <h3 class="product-name">{{ product.title }}</h3>
                  <div class="product-price">¥{{ product.priceSale }}</div>
                  <el-button
                    type="primary"
                    size="small"
                    class="view-products-btn"
                  >
                    查看{{ product.brandNum }}款同类型产品
                  </el-button>
                </div>
              </div>
            </div>

            <!-- 分页 -->
            <div class="pagination-section">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[12, 24, 48, 96]"
                :page-size="pageSize"
                layout="total, prev, pager, next"
                :total="totalProducts"
              >
              </el-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import pageBreadcrumb from "@/components/page/page-breadcrumb.vue";

export default {
  name: "ProductList",
  components: {
    pageBreadcrumb,
  },
  data() {
    return {
      // 面包屑导航
      nav_option: [],

      // 筛选条件
      activeFilters: [],
      filters: {},

      // 排序
      sortBy: "0",

      // 分页
      currentPage: 1,
      pageSize: 12,
      totalProducts: 0,

      // 商品数据
      products: [],

      // 筛选条件
      filterOptions: [],
    };
  },
  methods: {
    getProductList() {
      let attrs = [];
      if (this.filters) {
        Object.keys(this.filters).forEach((key) => {
          if (this.filters[key].length > 0) {
            attrs.push({ key, value: this.filters[key].join(",") });
          }
        });
      }
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "product_plist",
          orderType: this.sortBy,
          keyword: this.$route.query.keyword || "",
          channelId: this.nav_option[this.nav_option.length - 1].id,
          page: this.currentPage,
          pageNum: this.pageSize,
          attrs: attrs.length > 0 ? JSON.stringify(attrs) : "",
        },
      }).then((res) => {
        let { list, count } = res.data;
        if (res.code == 200 && list) {
          this.products = list;
          this.totalProducts = count;
        }
      });
    },
    // 重置筛选条件
    resetFilters() {
      this.filters = this.filterOptions.reduce((acc, item) => {
        acc[item.fieldTitle] = [];
        return acc;
      }, {});
      this.currentPage = 1;
      this.getProductList();
    },

    // 筛选条件变化
    handleFilterChange() {
      this.currentPage = 1;
      this.getProductList();
    },

    // 排序变化
    handleSortChange() {
      this.currentPage = 1;
      this.getProductList();
    },

    // 商品点击
    handleProductClick(item) {
      this.$router.push(`/product-detail?id=${item.id}`);
    },

    // 切换收藏
    toggleFavorite(product) {
      product.favorite = !product.favorite;
      this.$message.success(product.favorite ? "已添加到收藏" : "已取消收藏");
    },

    // 选择商品
    selectProduct(product) {
      product.selected = !product.selected;
      this.$message.success(product.selected ? "已选择商品" : "已取消选择");
    },

    // 获取筛选条件
    getFilterOptions() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "product_zdyAttr",
        },
      }).then((res) => {
        if (res.code == 200 && res.data) {
          this.filterOptions = res.data;
          this.filters = this.filterOptions.reduce((acc, item) => {
            acc[item.fieldTitle] = [];
            return acc;
          }, {});
        }
      });
    },
    // 分页大小变化
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
    },

    // 当前页变化
    handleCurrentChange(val) {
      this.currentPage = val;
    },
  },

  created() {
    // 初始化数据
    this.nav_option =
      JSON.parse(localStorage.getItem("product_nav_option")) || [];
    if (this.nav_option.length > 0) {
      this.nav_option[this.nav_option.length - 1].route = "/product-list";
    }
    // 获取筛选条件
    this.getFilterOptions();
    this.getProductList();
  },
};
</script>

<style scoped lang="less">
.product-list-page {
  background: #f5f5f5;
  min-height: 100vh;

  .inner {
    padding-top: 0px;
    padding-bottom: 100px;

    .page-ctx {
      padding-top: 45px;
    }
  }
}

.bread-box {
  height: 60px;
  line-height: 60px;
  border-bottom: 1px solid #e4e4e4;
  background: #fff;
}

.product-list-container {
  display: flex;
  gap: 30px;
  min-height: 600px;
}

// 左侧筛选条件
.filter-sidebar {
  width: 320px;
  background: #ffffff;
  border-radius: 8px;
  height: fit-content;
  border: 1px solid #e0e3e6;
  .filter-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 70px;
    padding: 0 20px 0 30px;
    background: #2e4c87;

    h3 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      color: #fff;
    }

    .reset-btn {
      color: #fff;
      font-size: 16px;
      font-weight: 400;
      padding: 0;
    }
  }

  .filter-collapse {
    border: none;

    ::v-deep .el-collapse-item__header {
      background: transparent;
      border-bottom: 1px solid #e0e3e6;
      background: #f8f8f8;
      padding: 0 20px 0 30px;
      height: 70px;
      line-height: 70px;
      font-weight: 500;
      color: #333;
      font-size: 16px;
    }

    ::v-deep .el-collapse-item__content {
      padding: 20px 20px 20px 30px;
    }

    ::v-deep .el-checkbox-group {
      .el-checkbox {
        display: block;
        margin-bottom: 8px;
        margin-right: 0;

        .el-checkbox__label {
          font-size: 14px;
          color: #666;
        }
      }
    }
  }
}

// 右侧商品展示区域
.product-content {
  flex: 1;

  .product-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    line-height: 60px;
    margin-bottom: 24px;
    padding: 0 20px;
    border: 1px solid #e0e3e6;
    background: #ffffff;

    .product-title {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      color: #272536;
    }

    .sort-section {
      height: 40px;
      line-height: 40px;
      .el-select {
        width: 168px;
        height: 40px;
        /deep/ .el-input__inner {
          border-radius: 30px 30px 30px 30px;
        }
      }
    }
  }

  .product-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
    margin-bottom: 40px;

    .product-card {
      background: #fff;
      border: 1px solid #e4e4e4;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      padding: 12px;
      width: 292px;
      height: 454px;
      display: flex;
      flex-direction: column;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        border-color: #2e4c87;
        .product-info {
          .view-products-btn {
            background: #2e4c87;
            color: #fff;
          }
        }
        .product-image {
          .product-actions {
            display: flex;
          }
        }
      }

      .product-image {
        height: 268px;
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f8f9fa;

        img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .product-actions {
          position: absolute;
          top: 10px;
          right: 10px;
          display: none;
          img {
            width: 40px;
            height: 40px;
            cursor: pointer;
          }
        }
      }

      .product-info {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 20px 36px 0;
        flex: 1;

        .product-name {
          font-size: 16px;
          font-weight: 500;
          color: #000;
          text-align: center;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          line-clamp: 1;
          -webkit-box-orient: vertical;
        }

        .product-price {
          font-size: 16px;
          font-weight: 600;
          color: #333;
          text-align: center;
        }

        .view-products-btn {
          width: 100%;
          height: 40px;
          font-size: 16px;
          font-weight: 400;
          color: #666;
          background: #fff;
          border-radius: 28px;
          border: 1px solid #c4c4c4;
          cursor: pointer;
        }
      }
    }
  }

  .pagination-section {
    display: flex;
    justify-content: center;
    margin-top: 40px;
  }
}
</style>
