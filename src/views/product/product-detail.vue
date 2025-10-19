<template>
  <div class="product-detail">
    <div class="inner">
      <pageBreadcrumb :option="nav_option" />
      <div class="page-ctx w-1400">
        <div class="product-detail-container">
          <!-- 选项卡 -->
          <div class="product-tabs">
            <div
              class="tab-item"
              :class="{ active: activeTab === 'series' }"
              @click="activeTab = 'series'"
            >
              系列说明
            </div>
            <div
              class="tab-item"
              :class="{ active: activeTab === 'coating' }"
              @click="activeTab = 'coating'"
            >
              镀膜曲线
            </div>
            <div
              class="tab-item"
              :class="{ active: activeTab === 'lens' }"
              @click="activeTab = 'lens'"
            >
              光学透镜
            </div>
            <div
              class="tab-item"
              :class="{ active: activeTab === 'feedback' }"
              @click="activeTab = 'feedback'"
            >
              产品反馈
            </div>
          </div>

          <!-- 选项卡内容 -->
          <div class="tab-content">
            <div v-if="activeTab === 'series'" class="content-item">
              <div class="series-content">
                <div class="series-content-top">
                  <div class="series-content-top-item">
                    <h3>产品说明</h3>
                    <div class="series-content-top-item-content">
                      <p>
                        K9平凸透镜（K9 Plano Convex (PCX)
                        Lenses）是以K9光学玻璃材质为基底的平凸透镜。
                        K9光学玻璃是一种宽光谱透过优异的光学材料，其对350nm-2000nm波长的光具有高透过率，同时具有较高的硬度，能承受多种物
                        理和化学刺激，气泡和杂质含量较低，所以常作为各种光学元件的基底。K9平凸透镜会将光线聚焦成一个点。其特点是焦距为正，一
                        面为平面，另一面为凸面。常用于单色光源的瞄准和聚焦。使用时，将凸面面向入射光。K9平凸透镜组合其他透镜可用于光束整形、
                        光束的准直、扩束、缩束等不同应用
                      </p>
                    </div>
                  </div>
                  <div class="series-content-top-item">
                    <h3>示意图</h3>
                    <div class="series-content-top-item-content">
                      <img src="#" alt="示意图" />
                    </div>
                  </div>
                </div>
                <div class="series-content-bottom">
                  <h3>通用参数</h3>
                  <div class="parameter-table">
                    <div class="parameter-row">
                      <div class="parameter-item">
                        <span class="parameter-label">材料</span>
                        <span class="parameter-value">精退火H-K9L光学玻璃</span>
                      </div>
                      <div class="parameter-item">
                        <span class="parameter-label">直径误差</span>
                        <span class="parameter-value">+0.0/-0.1mm</span>
                      </div>
                    </div>
                    <div class="parameter-row">
                      <div class="parameter-item">
                        <span class="parameter-label">面型不规则</span>
                        <span class="parameter-value">入/4@632.8nm</span>
                      </div>
                      <div class="parameter-item">
                        <span class="parameter-label">透镜定心误差</span>
                        <span class="parameter-value">3弧分</span>
                      </div>
                    </div>
                    <div class="parameter-row">
                      <div class="parameter-item">
                        <span class="parameter-label">倒边</span>
                        <span class="parameter-value">0.2mmX45°</span>
                      </div>
                      <div class="parameter-item">
                        <span class="parameter-label">设计波长</span>
                        <span class="parameter-value">587.6nm</span>
                      </div>
                    </div>
                    <div class="parameter-row">
                      <div class="parameter-item">
                        <span class="parameter-label">中心厚度误差</span>
                        <span class="parameter-value">+0.2mm</span>
                      </div>
                      <div class="parameter-item">
                        <span class="parameter-label">有效焦距误差</span>
                        <span class="parameter-value">+2%</span>
                      </div>
                    </div>
                    <div class="parameter-row">
                      <div class="parameter-item">
                        <span class="parameter-label">表面光洁度</span>
                        <span class="parameter-value">40/20~60/40</span>
                      </div>
                      <div class="parameter-item">
                        <span class="parameter-label">镀膜</span>
                        <span class="parameter-value">见列表</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="activeTab === 'coating'" class="content-item">
              <h3>镀膜曲线</h3>
              <p>这里是镀膜曲线的内容...</p>
            </div>
            <div v-if="activeTab === 'lens'" class="content-item">
              <h3>光学透镜</h3>
              <p>这里是光学透镜的内容...</p>
            </div>
            <div v-if="activeTab === 'feedback'" class="content-item">
              <h3>产品反馈</h3>
              <p>这里是产品反馈的内容...</p>
            </div>
          </div>

          <!-- 产品选择区 -->
          <div class="product-selection">
            <h3>产品选择</h3>
            <div class="product-list">
              <div class="product-list-header-item">
                <span>产品编号</span>
                <span>直径Φ</span>
                <span>焦距f’</span>
                <span>曲率半径R</span>
                <span>库存</span>
                <span>对比</span>
                <span>价格</span>
                <span>数量</span>
                <span>购物车</span>
              </div>
              <el-collapse v-model="activeProducts" class="product-collapse">
                <el-collapse-item
                  v-for="(product, index) in productList"
                  :key="product.id"
                  :name="product.id"
                  class="product-item"
                >
                  <template slot="title">
                    <div class="product-header">
                      <div class="product-info">
                        <span class="product-code">{{ product.code }}</span>
                        <span class="product-diameter"
                          >直径: {{ product.diameter }}mm</span
                        >
                        <span class="product-focal"
                          >焦距: {{ product.focalLength }}mm</span
                        >
                        <span class="product-radius"
                          >曲率半径: {{ product.radius }}mm</span
                        >
                        <span class="product-stock"
                          >库存: {{ product.stock }}</span
                        >
                        <div class="product-compare">
                          <el-checkbox
                            v-model="product.checked"
                            @change="toggleCompare(product)"
                          ></el-checkbox>
                        </div>
                        <span class="product-price">¥{{ product.price }}</span>
                        <div class="product-quantity">
                          <el-button
                            @click.stop="decreaseQuantity(index)"
                            icon="el-icon-minus"
                            size="mini"
                          ></el-button>
                          <el-input
                            v-model="product.quantity"
                            size="mini"
                            style="width: 60px; margin: 0 5px"
                            @change="updateQuantity(index, $event)"
                          ></el-input>
                          <el-button
                            @click.stop="increaseQuantity(index)"
                            icon="el-icon-plus"
                            size="mini"
                          ></el-button>
                        </div>
                        <el-button
                          type="danger"
                          @click.stop="addToCart(product)"
                          size="small"
                          class="add-cart-btn"
                        >
                          加入购物车
                        </el-button>
                      </div>
                    </div>
                  </template>

                  <!-- 展开内容 -->
                  <div class="product-details">
                    <!-- 下载按钮区域 -->
                    <div class="download-buttons">
                      <el-button
                        type="primary"
                        icon="el-icon-download"
                        size="small"
                        >CAD PDF</el-button
                      >
                      <el-button
                        type="primary"
                        icon="el-icon-download"
                        size="small"
                        >Auto CAD DXF</el-button
                      >
                      <el-button
                        type="primary"
                        icon="el-icon-download"
                        size="small"
                        >SOLLIDWORKS</el-button
                      >
                      <el-button
                        type="primary"
                        icon="el-icon-download"
                        size="small"
                        >规格书</el-button
                      >
                    </div>

                    <!-- 详细参数表格 -->
                    <div class="parameter-table">
                      <div class="parameter-row">
                        <div class="parameter-item">
                          <span class="parameter-label">直径</span>
                          <span class="parameter-value"
                            >{{ product.parameters.diameter }}mm</span
                          >
                        </div>
                        <div class="parameter-item">
                          <span class="parameter-label">有效焦距</span>
                          <span class="parameter-value"
                            >{{ product.parameters.focalLength }}mm</span
                          >
                        </div>
                      </div>
                      <div class="parameter-row">
                        <div class="parameter-item">
                          <span class="parameter-label">镀膜</span>
                          <span class="parameter-value">{{
                            product.parameters.coating
                          }}</span>
                        </div>
                        <div class="parameter-item">
                          <span class="parameter-label">材料</span>
                          <span class="parameter-value">{{
                            product.parameters.material
                          }}</span>
                        </div>
                      </div>
                      <div class="parameter-row">
                        <div class="parameter-item">
                          <span class="parameter-label">后焦距</span>
                          <span class="parameter-value"
                            >{{ product.parameters.backFocalLength }}mm</span
                          >
                        </div>
                        <div class="parameter-item">
                          <span class="parameter-label">半径 R1</span>
                          <span class="parameter-value"
                            >{{ product.parameters.radius1 }}mm</span
                          >
                        </div>
                      </div>
                      <div class="parameter-row">
                        <div class="parameter-item">
                          <span class="parameter-label">中心厚度 CT</span>
                          <span class="parameter-value"
                            >{{ product.parameters.centerThickness }}mm</span
                          >
                        </div>
                        <div class="parameter-item">
                          <span class="parameter-label">边缘厚度 ET</span>
                          <span class="parameter-value"
                            >{{ product.parameters.edgeThickness }}mm</span
                          >
                        </div>
                      </div>
                      <div class="parameter-row">
                        <div class="parameter-item">
                          <span class="parameter-label">适用的透镜安装环</span>
                          <span class="parameter-value">{{
                            product.parameters.mountRing
                          }}</span>
                        </div>
                        <div class="parameter-item">
                          <span class="parameter-label">设计波长</span>
                          <span class="parameter-value"
                            >{{ product.parameters.designWavelength }}nm</span
                          >
                        </div>
                      </div>
                      <div class="parameter-row">
                        <div class="parameter-item">
                          <span class="parameter-label">直径容差</span>
                          <span class="parameter-value">{{
                            product.parameters.diameterTolerance
                          }}</span>
                        </div>
                        <div class="parameter-item">
                          <span class="parameter-label">中心厚度容差</span>
                          <span class="parameter-value">{{
                            product.parameters.thicknessTolerance
                          }}</span>
                        </div>
                      </div>
                      <div class="parameter-row">
                        <div class="parameter-item">
                          <span class="parameter-label">面型不规则</span>
                          <span class="parameter-value">{{
                            product.parameters.surfaceIrregularity
                          }}</span>
                        </div>
                        <div class="parameter-item">
                          <span class="parameter-label">焦距容差</span>
                          <span class="parameter-value">{{
                            product.parameters.focalTolerance
                          }}</span>
                        </div>
                      </div>
                      <div class="parameter-row">
                        <div class="parameter-item">
                          <span class="parameter-label">透镜定心误差</span>
                          <span class="parameter-value">{{
                            product.parameters.centeringError
                          }}</span>
                        </div>
                        <div class="parameter-item">
                          <span class="parameter-label">表面光洁度</span>
                          <span class="parameter-value">{{
                            product.parameters.surfaceQuality
                          }}</span>
                        </div>
                      </div>
                      <div class="parameter-row">
                        <div class="parameter-item">
                          <span class="parameter-label">倒边</span>
                          <span class="parameter-value">{{
                            product.parameters.chamfer
                          }}</span>
                        </div>
                        <div class="parameter-item">
                          <span class="parameter-label"></span>
                          <span class="parameter-value"></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </div>

          <!-- 产品推荐 -->
          <div class="product-recommend">
            <div class="product-recommend-title">产品推荐</div>
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
                    查看{{ product.kucun }}款同类型产品
                  </el-button>
                </div>
              </div>
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
  name: "ProductDetail",
  components: {
    pageBreadcrumb,
  },
  data() {
    return {
      nav_option: [],
      product: {},
      activeTab: "series", // 默认选中系列说明
      activeProducts: [], // 展开的产品ID数组
      productList: [
        {
          id: "GT00001",
          code: "GT00001",
          diameter: 3.0,
          focalLength: 4.5,
          radius: 2.33,
          stock: 100,
          price: 25.0,
          quantity: 1,
          checked: false,
          parameters: {
            diameter: "3.00",
            focalLength: "4.50",
            coating: "未镀膜",
            material: "精退火H-K9L光学玻璃",
            backFocalLength: "3.39",
            radius1: "2.33",
            centerThickness: "1.70",
            edgeThickness: "1.15",
            mountRing: "N/A",
            designWavelength: "587.6",
            diameterTolerance: "+0.0/-0.1mm",
            thicknessTolerance: "+0.2mm",
            surfaceIrregularity: "入4@632.8nm",
            focalTolerance: "+2%",
            centeringError: "3弧分",
            surfaceQuality: "40/20-60/40",
            chamfer: "0.2X45°",
          },
        },
        {
          id: "GT00002",
          code: "GT00002",
          diameter: 5.0,
          focalLength: 8.0,
          radius: 4.0,
          stock: 50,
          price: 35.0,
          quantity: 1,
          checked: false,
          parameters: {
            diameter: "5.00",
            focalLength: "8.00",
            coating: "AR镀膜",
            material: "精退火H-K9L光学玻璃",
            backFocalLength: "7.39",
            radius1: "4.00",
            centerThickness: "2.50",
            edgeThickness: "1.80",
            mountRing: "SM05",
            designWavelength: "587.6",
            diameterTolerance: "+0.0/-0.1mm",
            thicknessTolerance: "+0.2mm",
            surfaceIrregularity: "入4@632.8nm",
            focalTolerance: "+2%",
            centeringError: "3弧分",
            surfaceQuality: "40/20-60/40",
            chamfer: "0.2X45°",
          },
        },
        {
          id: "GT00003",
          code: "GT00003",
          diameter: 10.0,
          focalLength: 15.0,
          radius: 7.5,
          stock: 30,
          price: 45.0,
          quantity: 1,
          checked: false,
          parameters: {
            diameter: "10.00",
            focalLength: "15.00",
            coating: "AR镀膜",
            material: "精退火H-K9L光学玻璃",
            backFocalLength: "14.39",
            radius1: "7.50",
            centerThickness: "3.00",
            edgeThickness: "2.20",
            mountRing: "SM1",
            designWavelength: "587.6",
            diameterTolerance: "+0.0/-0.1mm",
            thicknessTolerance: "+0.2mm",
            surfaceIrregularity: "入4@632.8nm",
            focalTolerance: "+2%",
            centeringError: "3弧分",
            surfaceQuality: "40/20-60/40",
            chamfer: "0.2X45°",
          },
        },
      ],
      products: [{}, {}, {}, {}, {}],
    };
  },
  mounted() {
    this.nav_option =
      JSON.parse(localStorage.getItem("product_nav_option")) || [];
    if (this.nav_option.length > 0) {
      this.nav_option[this.nav_option.length - 1].route = "/product-detail";
    }
    this.getProductDetail();
  },
  methods: {
    getProductDetail() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "product_detail",
          id: this.$route.query.id,
        },
      }).then((res) => {
        if (res.code == 200 && res.data) {
          this.product = res.data;
        }
      });
    },
    // 增加数量
    increaseQuantity(index) {
      if (this.productList[index].quantity < this.productList[index].stock) {
        this.productList[index].quantity++;
      }
    },
    // 减少数量
    decreaseQuantity(index) {
      if (this.productList[index].quantity > 1) {
        this.productList[index].quantity--;
      }
    },
    // 更新数量
    updateQuantity(index, value) {
      const quantity = parseInt(value);
      if (quantity > 0 && quantity <= this.productList[index].stock) {
        this.productList[index].quantity = quantity;
      } else if (quantity > this.productList[index].stock) {
        this.productList[index].quantity = this.productList[index].stock;
        this.$message.warning("数量不能超过库存");
      } else {
        this.productList[index].quantity = 1;
      }
    },
    // 加入购物车
    addToCart(product) {
      this.$message.success(
        `已将 ${product.code} 加入购物车，数量：${product.quantity}`
      );
      // 这里可以添加实际的购物车逻辑
    },
    // 切换对比状态
    toggleCompare(product) {
      if (product.checked) {
        this.$message.success(`已将 ${product.code} 加入对比`);
      } else {
        this.$message.info(`已从对比中移除 ${product.code}`);
      }
      // 这里可以添加实际的对比逻辑
    },
    handleProductClick(product) {
      this.$router.push({
        path: "/product-detail",
        query: { id: product.id },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.product-detail {
  background: #f5f5f5;
  min-height: 100vh;

  .inner {
    padding-top: 0px;
    padding-bottom: 100px;
  }

  .page-ctx {
    padding-top: 45px;
  }
}
.bread-box {
  height: 60px;
  line-height: 60px;
  border-bottom: 1px solid #e4e4e4;
  background: #fff;
}

// 选项卡样式
.product-tabs {
  display: flex;
  background: #fff;
  border: 1px solid #ebeef5;

  .tab-item {
    width: 200px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    cursor: pointer;
    font-size: 14px;
    color: #666;
    background: #f8f8f8;
    border-right: 1px solid #e4e4e4;
    position: relative;
    transition: all 0.3s ease;

    &:last-child {
      border-right: none;
    }

    &:hover {
      background: #f0f0f0;
    }

    &.active {
      background: #1e3a8a; // 深蓝色背景
      color: #fff; // 白色文字

      // 向下三角指示器
      &::after {
        content: "";
        position: absolute;
        bottom: -8px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-top: 8px solid #1e3a8a;
      }
    }
  }
}

// 选项卡内容样式
.tab-content {
  background: #fff;
  padding: 30px;
  min-height: 300px;

  .content-item {
    h3 {
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: 600;
      font-size: 22px;
      color: #000000;
      padding-left: 20px;
      position: relative;
      &::before {
        content: "";
        position: absolute;
        left: 0px;
        top: 50%;
        transform: translateY(-50%);
        width: 6px;
        height: 20px;
        background: #2e4c87;
        border-radius: 6px 6px 6px 6px;
      }
    }
    .series-content-top {
      display: flex;
      gap: 115px;

      .series-content-top-item:first-child {
        width: 938px;
        .series-content-top-item-content {
          font-family: PingFang SC, PingFang SC;
          font-weight: 400;
          font-size: 16px;
          color: #333333;
          line-height: 36px;
        }
      }
      .series-content-top-item-content {
        margin-top: 20px;
        img {
          display: block;
          width: 400px;
          height: 310px;
        }
      }
    }
    .series-content-bottom {
      margin-top: 40px;

      .parameter-table {
        margin-top: 20px;
        background: #fafbfc;
        border: 1px solid #ebeef5;

        .parameter-row {
          display: flex;
          gap: 60px;
          height: 40px;
          line-height: 40px;
          border-bottom: 1px dashed #d9d9d9;
          margin: 0 23px;

          &:last-child {
            border-bottom: none;
          }

          .parameter-item {
            flex: 1;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .parameter-label {
              font-family: PingFang SC, PingFang SC;
              font-weight: 600;
              font-size: 14px;
              color: #333333;
              min-width: 100px;
            }

            .parameter-value {
              font-family: PingFang SC, PingFang SC;
              font-weight: 400;
              font-size: 14px;
              color: #333333;
              text-align: left;
              flex: 1;
              margin-left: 20px;
            }
          }
        }
      }
    }
  }
}

// 产品选择区样式
.product-selection {
  margin-top: 30px;
  background: #fff;
  padding: 30px;

  h3 {
    font-family: Microsoft YaHei, Microsoft YaHei;
    font-weight: 600;
    font-size: 22px;
    color: #000000;
    padding-left: 20px;
    position: relative;
    margin-bottom: 20px;

    &::before {
      content: "";
      position: absolute;
      left: 0px;
      top: 50%;
      transform: translateY(-50%);
      width: 6px;
      height: 20px;
      background: #2e4c87;
      border-radius: 6px 6px 6px 6px;
    }
  }
  .product-list-header-item {
    height: 56px;
    line-height: 56px;
    padding-left: 20px;
    background: #ffffff;
    border-radius: 0px 0px 0px 0px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    span {
      flex: 1;
      font-size: 16px;
      color: #333333;
      text-align: center;
    }
  }

  .product-collapse {
    .product-item {
      /deep/ .el-collapse-item__header {
        background: #f9f9f9;
        border-bottom: 1px solid #ebeef5;
        padding: 0 20px;
        height: 56px;
        line-height: 56px;

        .product-header {
          display: flex;
          align-items: center;
          width: 100%;

          .product-info {
            display: flex;
            align-items: center;
            gap: 20px;
            width: 100%;
            div,
            span {
              flex: 1;
              text-align: center;
            }

            .product-code {
              font-weight: 600;
              font-size: 16px;
              color: #333;
              min-width: 80px;
            }

            .product-diameter,
            .product-focal,
            .product-radius {
              font-size: 14px;
              color: #666;
              min-width: 100px;
            }

            .product-stock {
              font-size: 14px;
              color: #666;
              min-width: 80px;
            }

            .product-compare {
              .el-checkbox {
                .el-checkbox__label {
                  font-size: 14px;
                  color: #666;
                }
              }
            }

            .product-price {
              font-size: 18px;
              font-weight: 600;
              color: #e74c3c;
              min-width: 80px;
            }

            .product-quantity {
              display: flex;
              align-items: center;

              .el-button {
                width: 24px;
                height: 24px;
                padding: 0;
                border-radius: 3px;
              }

              .el-input {
                margin: 0 !important;
                width: 52px !important;
                flex: none;
                .el-input__inner {
                  text-align: center;
                  border-radius: 3px;
                  height: 24px;
                  line-height: 24px;
                }
              }
            }

            .add-cart-btn {
              background: #e74c3c;
              border-color: #e74c3c;
              margin-left: auto;

              &:hover {
                background: #c0392b;
                border-color: #c0392b;
              }
            }
          }
        }
        .el-collapse-item__arrow {
          display: none;
        }
      }

      .el-collapse-item__content {
        padding: 0;

        .product-details {
          padding: 20px;
          background: #fff;

          .download-buttons {
            margin-bottom: 20px;
            display: flex;
            gap: 10px;

            .el-button {
              background: #2e4c87;
              border-color: #2e4c87;

              &:hover {
                background: #2e4c87;
                border-color: #2e4c87;
              }
            }
          }

          .parameter-table {
            background: #fafbfc;
            border: 1px solid #ebeef5;
            margin-bottom: 20px;

            .parameter-row {
              display: flex;
              gap: 60px;
              height: 40px;
              line-height: 40px;
              border-bottom: 1px dashed #d9d9d9;
              margin: 0 23px;

              &:last-child {
                border-bottom: none;
              }

              .parameter-item {
                flex: 1;
                display: flex;
                justify-content: space-between;
                align-items: center;

                .parameter-label {
                  font-family: PingFang SC, PingFang SC;
                  font-weight: 600;
                  font-size: 14px;
                  color: #333333;
                  min-width: 100px;
                }

                .parameter-value {
                  font-family: PingFang SC, PingFang SC;
                  font-weight: 400;
                  font-size: 14px;
                  color: #333333;
                  text-align: left;
                  flex: 1;
                  margin-left: 20px;
                }
              }
            }
          }
        }
      }
    }
  }
}
.product-recommend {
  .product-recommend-title {
    font-weight: bold;
    font-size: 40px;
    color: #242728;
    margin-top: 60px;
    margin-bottom: 32px;
  }
  .product-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
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
      width: 300px;
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
}
</style>
