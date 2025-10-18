<template>
  <div class="parameter-detail-page">
    <!-- 产品头部区域 -->
    <div class="product-header">
      <div class="header-left">
        <div class="back-button" @click="goBack">
          <i class="el-icon-arrow-left"></i>
        </div>
        <div class="product-info">
          <h1 class="product-title">{{ productInfo.info.title }}</h1>
        </div>
      </div>
      <div class="header-right">
        <img :src="productInfo.info.thumb + '/uploads/' + ImgList[0]" alt="" />
      </div>
    </div>

    <!-- 参数配置表区域 -->
    <div class="parameter-content">
      <div class="parameter-container">
        <h2 class="parameter-title">参数配置表</h2>

        <!-- 图例说明 -->
        <div class="legend-section">
          <div class="legend-item">
            注：
            <span class="legend-dot standard">●</span>
            <span class="legend-text">表示标配</span>
          </div>
          <div class="legend-item">
            <span class="legend-dot optional">○</span>
            <span class="legend-text">表示选配</span>
          </div>
          <div class="legend-item">
            <span class="legend-dot none">-</span>
            <span class="legend-text">表示无此配置</span>
          </div>
        </div>

        <!-- 参数表格 -->
        <div class="parameter-table" v-loading="loading">
          <!-- 按分类显示产品信息 -->
          <div 
            v-for="(category, categoryIndex) in groupedParameterData" 
            :key="'category-' + categoryIndex"
            class="table-section"
          >
            <h3 class="section-title">{{ category.categoryTitle }}</h3>
            
            <!-- 按子分类显示 -->
            <div 
              v-for="(subCategory, subIndex) in category.subCategories" 
              :key="'sub-' + subIndex"
              class="sub-category-section"
            >
              <h4 class="sub-category-title">{{ subCategory.subCategoryTitle }}</h4>
              
              <!-- 显示产品信息 -->
              <div 
                v-for="(product, productIndex) in subCategory.products" 
                :key="'product-' + productIndex"
                class="parameter-row"
              >
                <div class="param-name">
                  {{ product.title }}
                  <span v-if="product.description" class="product-description">
                    ({{ product.description }})
                  </span>
                </div>
                <div class="param-value">
                  <span v-if="product.spec" class="product-spec">{{ product.spec }}</span>
                  <span v-else class="no-spec">-</span>
                </div>
                <!-- <div class="param-status">
                  <span 
                    class="status-dot"
                    :class="{
                      'standard': product.priceStatus === 1,
                      'optional': product.priceStatus === 2,
                      'none': product.priceStatus === 3
                    }"
                  >
                    {{ product.priceStatus === 1 ? '●' : product.priceStatus === 2 ? '○' : '-' }}
                  </span>
                </div> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ParameterDetail",
  data() {
    return {
      productId: "",
      productInfo: {},
      parameterData: [],
      ImgList: [],
      loading: false,
    };
  },
  computed: {
    // 将parameterData按分类组织
    groupedParameterData() {
      const grouped = {};
      
      this.parameterData.forEach(item => {
        const categoryKey = item.categoryId;
        const subCategoryKey = item.subCategoryId;
        
        if (!grouped[categoryKey]) {
          grouped[categoryKey] = {
            categoryId: item.categoryId,
            categoryTitle: item.categoryTitle,
            subCategories: {}
          };
        }
        
        if (!grouped[categoryKey].subCategories[subCategoryKey]) {
          grouped[categoryKey].subCategories[subCategoryKey] = {
            subCategoryId: item.subCategoryId,
            subCategoryTitle: item.subCategoryTitle,
            products: []
          };
        }
        
        grouped[categoryKey].subCategories[subCategoryKey].products.push(item);
      });
      
      // 转换为数组格式
      return Object.values(grouped).map(category => ({
        ...category,
        subCategories: Object.values(category.subCategories)
      }));
    }
  },
  mounted() {
    this.productId = this.$route.query.id || "2";
    this.loadProductData();
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },

    // 加载产品数据
    loadProductData() {
      this.loading = true;
      this.$api({
        url: "getProductSetting",
        method: "get",
        data: {
          id: this.productId,
        },
      }).then((res) => {
        if (res.code == 200) {
          this.productInfo = res.data;
          this.ImgList = res.data.info.images.split(",");
          // 提取所有producntInfos数据到parameterData
          this.extractProductInfos(res.data.lists);
          this.loading = false;
        }
      });
    },

    // 提取所有producntInfos数据
    extractProductInfos(lists) {
      this.parameterData = [];
      
      if (!Array.isArray(lists)) {
        console.warn('lists is not an array:', lists);
        return;
      }

      lists.forEach((category, categoryIndex) => {
        if (category.child && Array.isArray(category.child)) {
          category.child.forEach((subCategory, subIndex) => {
            if (subCategory.producntInfos && Array.isArray(subCategory.producntInfos)) {
              subCategory.producntInfos.forEach((product, productIndex) => {
                this.parameterData.push({
                  categoryId: category.id,
                  categoryTitle: category.title,
                  subCategoryId: subCategory.id,
                  subCategoryTitle: subCategory.title,
                  productId: product.id,
                  title: product.title,
                  description: product.description,
                  priceStatus: product.price_status,
                  deliveryTime: product.delivery_time,
                  spec: product.spec || '',
                  thumb: product.thumb || '',
                  // 添加更多可能需要的字段
                  ...product
                });
              });
            }

            // 处理第三层嵌套
            if (subCategory.child && Array.isArray(subCategory.child)) {
              subCategory.child.forEach((thirdCategory, thirdIndex) => {
                if (thirdCategory.producntInfos && Array.isArray(thirdCategory.producntInfos)) {
                  thirdCategory.producntInfos.forEach((product, productIndex) => {
                    this.parameterData.push({
                      categoryId: category.id,
                      categoryTitle: category.title,
                      subCategoryId: subCategory.id,
                      subCategoryTitle: subCategory.title,
                      thirdCategoryId: thirdCategory.id,
                      thirdCategoryTitle: thirdCategory.title,
                      productId: product.id,
                      title: product.title,
                      description: product.description,
                      priceStatus: product.price_status,
                      deliveryTime: product.delivery_time,
                      spec: product.spec || '',
                      thumb: product.thumb || '',
                      // 添加更多可能需要的字段
                      ...product
                    });
                  });
                }
              });
            }
          });
        }
      });

      console.log('提取的parameterData:', this.parameterData);
    },

    // 打印参数表
    printParameters() {
      window.print();
    },

    // 下载参数表
    downloadParameters() {
      // 这里可以实现下载功能
      this.$message.success("参数表下载功能开发中...");
    },
  },
};
</script>

<style lang="less" scoped>
@import "./parameter.less";
</style>
