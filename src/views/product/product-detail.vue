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
                        {{ product.brandInfo ? product.brandInfo.content : "" }}
                      </p>
                    </div>
                  </div>
                  <div class="series-content-top-item">
                    <h3>示意图</h3>
                    <div class="series-content-top-item-content">
                      <img
                        :src="product.brandInfo ? product.brandInfo.thumb : ''"
                        alt="示意图"
                      />
                    </div>
                  </div>
                </div>
                <div class="series-content-bottom">
                  <h3>通用参数</h3>
                  <div class="parameter-table">
                    <div
                      class="parameter-row"
                      v-for="(item, index) in product.brandInfo
                        ? product.brandInfo.addrows
                        : []"
                      :key="index"
                    >
                      <div
                        class="parameter-item"
                        v-for="(it, i) in item"
                        :key="i"
                      >
                        <span class="parameter-label">{{ it.key }}</span>
                        <span class="parameter-value">{{ it.value }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              v-if="activeTab === 'coating'"
              class="content-item"
              v-html="product.brandInfo.content2"
            ></div>
            <div
              v-if="activeTab === 'lens'"
              class="content-item"
              v-html="product.brandInfo.content3"
            ></div>
            <div
              v-if="activeTab === 'feedback'"
              class="content-item feedback-content"
            >
              <div class="feedback-form">
                <!-- 左列 -->
                <div class="feedback-left">
                  <!-- 反馈类型 -->
                  <div class="form-group">
                    <label class="form-label">反馈类型</label>
                    <div class="radio-group">
                      <label class="radio-item">
                        <input
                          type="radio"
                          name="feedbackType"
                          value="1"
                          v-model="feedbackForm.bType"
                        />
                        <span class="radio-label">新品需求</span>
                      </label>
                      <label class="radio-item">
                        <input
                          type="radio"
                          name="feedbackType"
                          value="2"
                          v-model="feedbackForm.bType"
                        />
                        <span class="radio-label">改进建议</span>
                      </label>
                      <label class="radio-item">
                        <input
                          type="radio"
                          name="feedbackType"
                          value="3"
                          v-model="feedbackForm.bType"
                        />
                        <span class="radio-label">产品咨询</span>
                      </label>
                    </div>
                  </div>

                  <!-- 您的联系方式 -->
                  <div class="form-group">
                    <label class="form-label required">
                      您的联系方式
                      <span class="asterisk">*</span>
                    </label>
                    <input
                      type="text"
                      class="form-input"
                      placeholder="请输入"
                      v-model="feedbackForm.phone"
                    />
                  </div>

                  <!-- 反馈内容 -->
                  <div class="form-group">
                    <label class="form-label required">
                      反馈内容
                      <span class="asterisk">*</span>
                    </label>
                    <textarea
                      class="form-textarea"
                      placeholder="请输入"
                      v-model="feedbackForm.content"
                    ></textarea>
                  </div>

                  <!-- 提交按钮 -->
                  <div class="form-group">
                    <button class="submit-btn" @click="submitFeedback">
                      提交
                    </button>
                  </div>
                </div>

                <!-- 右列 -->
                <div class="feedback-right">
                  <!-- 反馈产品 -->
                  <div class="form-group">
                    <label class="form-label">反馈产品</label>
                    <el-select
                      v-model="feedbackForm.proId"
                      placeholder="请选择"
                      class="form-select"
                    >
                      <el-option
                        v-for="item in productList"
                        :key="item.id"
                        :label="item.title"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </div>

                  <!-- 是否联系我 -->
                  <div class="form-group">
                    <label class="form-label">是否联系我</label>
                    <div class="checkbox-group">
                      <label class="checkbox-item">
                        <input type="checkbox" v-model="feedbackForm.tell" />
                        <span class="checkbox-label">是</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
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
                        <span class="product-code">{{ product.title }}</span>
                        <span class="product-diameter"
                          >直径: {{ product.diameter || "0.00" }}mm</span
                        >
                        <span class="product-focal"
                          >焦距: {{ product.focal || "0.00" }}mm</span
                        >
                        <span class="product-radius"
                          >曲率半径: {{ product.curvature || "0.00" }}mm</span
                        >
                        <span class="product-stock">{{
                          product.kucun || 0
                        }}</span>
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
                        <div class="flex-center">
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
                      <div
                        class="parameter-row"
                        v-for="(item, index) in product.fieldsInfo"
                        :key="index"
                      >
                        <div
                          class="parameter-item"
                          v-for="(it, i) in item"
                          :key="i"
                        >
                          <span class="parameter-label">{{ it.title }}</span>
                          <span class="parameter-value">{{
                            it.fieldValue
                          }}</span>
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
                    @click="viewProducts(product)"
                  >
                    查看{{ product.brandNum }}款同类型产品
                  </el-button>
                </div>
              </div>
            </div>
          </div>
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
  name: "ProductDetail",
  components: {
    pageBreadcrumb,
    product_add_cart_success_modal,
  },
  data() {
    return {
      nav_option: [], // 面包屑导航
      product: {}, // 产品详情
      activeTab: "series", // 默认选中系列说明
      activeProducts: [], // 展开的产品ID数组
      productList: [], // 产品列表
      products: [], // 产品推荐
      channelId: null, // 频道ID
      // 反馈表单数据
      feedbackForm: {
        bType: "1", // 默认选中"改进建议"
        phone: "", // 联系方式
        content: "", // 反馈内容
        proId: "", // 反馈产品
        tell: true, // 是否联系我，默认选中
      },
      // 产品选项（可以根据实际需求从接口获取）
      productOptions: [
        { label: "产品A", value: "productA" },
        { label: "产品B", value: "productB" },
        { label: "产品C", value: "productC" },
      ],
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
          this.product.quantity = 1;
          this.product.brandInfo.addrows = this.pairArray(
            this.product.brandInfo.addrows
          );
          this.product.fieldsInfo = this.pairArray(this.product.fieldsInfo);
          this.productList.push(res.data);
          this.getRecommendProduct();
          // 更新反馈表单的产品选项，将当前产品添加到选项中
          if (this.product.title) {
            this.productOptions = [
              {
                label: this.product.title,
                value: this.product.id || this.product.title,
              },
              ...this.productOptions.filter(
                (item) => item.value !== (this.product.id || this.product.title)
              ),
            ];
            // 默认选中当前产品
            this.feedbackForm.proId = this.product.id || this.product.title;
          }
        }
      });
    },
    getRecommendProduct() {
      const channelList = JSON.parse(this.product.channelIdArr || "{}");
      const channelId =
        channelList.length > 0 ? channelList[channelList.length - 1].id : null;
      this.channelId = channelId;
      // 获取推荐产品
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "product_plist",
          channelId: channelId,
          page: 1,
          pageNum: 5,
        },
      }).then((res) => {
        let { list, count } = res.data;
        if (res.code == 200 && list) {
          this.products = list;
          this.totalProducts = count;
        }
      });
    },
    viewProducts(product) {
      this.$router.push({
        path: "/product-list",
        query: { channelId: this.channelId },
      });
    },
    // 将数组分成两组
    pairArray(arr) {
      const result = [];
      for (let i = 0; i < arr.length; i += 2) {
        result.push(arr.slice(i, i + 2));
      }
      return result;
    },
    // 增加数量
    increaseQuantity(index) {
      if (this.productList[index].quantity < this.productList[index].kucun) {
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
    // 切换对比状态
    toggleCompare(product) {
      // if (product.checked) {
      //   this.$message.success(`已将 ${product.code} 加入对比`);
      // } else {
      //   this.$message.info(`已从对比中移除 ${product.code}`);
      // }
      // 这里可以添加实际的对比逻辑
    },
    handleProductClick(product) {
      this.$router.push({
        path: "/product-detail",
        query: { id: product.id },
      });
    },
    // 提交反馈
    submitFeedback() {
      // 验证必填项
      if (!this.feedbackForm.phone) {
        this.$message.warning("请输入您的联系方式");
        return;
      }
      if (!this.feedbackForm.content) {
        this.$message.warning("请输入反馈内容");
        return;
      }

      // 这里可以调用API提交反馈
      this.$api({
        url: "/service.php",
        method: "post",
        data: {
          action: "serve_proSeek",
          ...{
            phone: this.feedbackForm.phone,
            content: this.feedbackForm.content,
            proId: this.feedbackForm.proId,
            tell: this.feedbackForm.tell ? 1 : 0,
            bType: this.feedbackForm.bType,
          },
        },
      }).then((res) => {
        if (res.code == 200) {
          this.$message.success("反馈提交成功");
          // 重置表单
          this.feedbackForm = {
            bType: "1",
            phone: "",
            content: "",
            proId: "",
            tell: true,
          };
        } else {
          this.$message.error(res.message || "提交失败");
        }
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
        bottom: -7px;
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
    padding-right: 20px;
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
            // gap: 20px;
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
              justify-content: center;

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

// 反馈表单样式
.feedback-content {
  h3 {
    margin-bottom: 30px;
  }

  .feedback-form {
    display: flex;
    gap: 60px;
    max-width: 1200px;
    padding: 50px 50px;

    .feedback-left,
    .feedback-right {
      flex: 1;
    }

    .form-group {
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      gap: 10px;

      .form-label {
        display: block;
        font-size: 14px;
        color: #333;
        font-weight: 400;
        width: 120px;
        text-align: right;
        padding-right: 10px;

        &.required {
          position: relative;
        }

        .asterisk {
          color: #f56c6c;
          margin-left: 2px;
        }
      }

      .form-input {
        flex: 1;
        height: 40px;
        padding: 0 12px;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        font-size: 14px;
        color: #333;
        box-sizing: border-box;
        transition: border-color 0.3s;

        &:focus {
          outline: none;
          border-color: #409eff;
        }

        &::placeholder {
          color: #c0c4cc;
        }
      }

      .form-textarea {
        flex: 1;
        min-height: 120px;
        padding: 12px;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        font-size: 14px;
        color: #333;
        resize: vertical;
        box-sizing: border-box;
        font-family: inherit;
        transition: border-color 0.3s;

        &:focus {
          outline: none;
          border-color: #409eff;
        }

        &::placeholder {
          color: #c0c4cc;
        }
      }

      .form-select {
        flex: 1;
      }

      .radio-group {
        display: flex;
        gap: 30px;
        flex-wrap: wrap;

        .radio-item {
          display: flex;
          align-items: center;
          cursor: pointer;
          user-select: none;

          input[type="radio"] {
            width: 18px;
            height: 18px;
            margin-right: 8px;
            cursor: pointer;
          }

          .radio-label {
            font-size: 14px;
            color: #333;
          }
        }
      }

      .checkbox-group {
        .checkbox-item {
          display: flex;
          align-items: center;
          cursor: pointer;
          user-select: none;

          input[type="checkbox"] {
            width: 18px;
            height: 18px;
            margin-right: 8px;
            cursor: pointer;
          }

          .checkbox-label {
            font-size: 14px;
            color: #333;
          }
        }
      }

      .submit-btn {
        width: 100%;
        height: 44px;
        background: #1e3a8a;
        color: #fff;
        border: none;
        border-radius: 4px;
        font-size: 16px;
        font-weight: 400;
        cursor: pointer;
        transition: background-color 0.3s;

        &:hover {
          background: #1e4a9a;
        }

        &:active {
          background: #1e2a7a;
        }
      }
    }
  }
}
</style>
