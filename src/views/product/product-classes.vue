<template>
  <div class="page">
    <div class="inner">
      <pageBreadcrumb :option="nav_option" />
      <div class="page-ctx w-1400">
        <!-- 产品分类 -->
        <div class="category-section">
          <div class="category-grid">
            <div
              class="category-card"
              v-for="(category, index) in categoryList"
              :key="index"
              @click="handleCategoryClick(category)"
            >
              <div class="category-image">
                <img :src="category.thumb" :alt="category.title" />
              </div>
              <div class="category-name">
                {{ category.title }}
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
  name: "category",
  components: {
    pageBreadcrumb,
  },
  data() {
    return {
      id: this.$route.query.id || 0,
      categoryList: [], // 分类列表
      nav_option: [{ title: "产品中心", route: "/product-cates" }],
    };
  },

  watch: {
    $route() {
      this.id = this.$route.query.id || 0;
      this.setView();
    },
  },

  created() {
    this.setView();
  },

  methods: {
    setView() {
      this.query_categories();
    },
    
    /**
     * 生成面包屑导航数据
     * @param {Array} allData - 所有分类数据
     * @param {Number|String} currentId - 当前分类ID
     * @returns {Array} 面包屑导航数组
     */
    generateBreadcrumb(allData, currentId) {
      try {
        if (!Array.isArray(allData) || allData.length === 0) {
          return [{ title: "产品中心", route: "/product-cates" }];
        }

        // 如果当前ID为0或空，只显示产品中心
        if (!currentId || currentId == 0) {
          return [{ title: "产品中心", route: "/product-cates" }];
        }

        // 查找当前分类及其所有父级
        const breadcrumbPath = this.findBreadcrumbPath(allData, currentId);
        
        // 构建面包屑数组
        const breadcrumb = [{ title: "产品中心", route: "/product-cates" }];
        
        breadcrumbPath.forEach((item, index) => {
          breadcrumb.push({
            title: item.title,
            route: `/product-classes?id=${item.id}`
          });
        });

        return breadcrumb;
        
      } catch (error) {
        console.error('生成面包屑导航失败:', error);
        return [{ title: "产品中心", route: "/product-cates" }];
      }
    },

    /**
     * 递归查找面包屑路径（从根到当前分类）
     * @param {Array} data - 分类数据
     * @param {Number|String} targetId - 目标分类ID
     * @param {Array} path - 当前路径
     * @returns {Array} 从根到目标分类的路径数组
     */
    findBreadcrumbPath(data, targetId, path = []) {
      try {
        for (const item of data) {
          if (item && item.id == targetId) {
            // 找到目标分类，返回包含该分类的路径
            return [...path, item];
          }
          
          // 如果有子分类，递归查找
          if (item && item.channels && Array.isArray(item.channels)) {
            const result = this.findBreadcrumbPath(item.channels, targetId, [...path, item]);
            if (result.length > 0) {
              return result;
            }
          }
        }
        
        return [];
        
      } catch (error) {
        console.error('查找面包屑路径失败:', error);
        return [];
      }
    },
    // 获取分类数据
    query_categories() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "product_channel",
        },
      }).then((res) => {
        let { code, data } = res;
        if (code == 200 && data) {
          // 根据id获取分类数据 可能有多层级
          const result = this.getCategoryList(data, this.id);
          this.categoryList = result || [];
          
          // 生成面包屑导航
          this.nav_option = this.generateBreadcrumb(data, this.id);
        } else {
          console.warn('获取分类数据失败:', res);
          this.categoryList = [];
          this.nav_option = [{ title: "产品中心" }];
        }
      }).catch((error) => {
        console.error('API请求失败:', error);
        this.categoryList = [];
        this.nav_option = [{ title: "产品中心" }];
      });
    },
    /**
     * 根据ID递归查找数据
     * @param {Array} data - 数据数组
     * @param {Number|String} targetId - 目标ID
     * @param {String} childrenKey - 子数据键名，默认为'channels'
     * @param {Number} maxDepth - 最大递归深度，防止无限循环
     * @returns {Array|null} 找到的数据或null
     */
    getCategoryList(data, targetId, childrenKey = 'channels', maxDepth = 10) {
      try {
        // 参数验证
        if (!Array.isArray(data) || data.length === 0) {
          console.warn('getCategoryList: 数据为空或不是数组');
          return null;
        }
        
        if (targetId === null || targetId === undefined) {
          console.warn('getCategoryList: 目标ID为空');
          return null;
        }

        // 递归查找函数
        const findById = (items, depth = 0) => {
          // 防止无限递归
          if (depth > maxDepth) {
            console.warn(`getCategoryList: 递归深度超过限制 (${maxDepth})`);
            return null;
          }

          // 遍历当前层级
          for (const item of items) {
            if (item && item.id == targetId) {
              return item[childrenKey] || null;
            }
            
            // 如果有子数据，递归查找
            if (item && item[childrenKey] && Array.isArray(item[childrenKey])) {
              const result = findById(item[childrenKey], depth + 1);
              if (result !== null) {
                return result;
              }
            }
          }
          
          return null;
        };

        const result = findById(data);
        return result || null;
        
      } catch (error) {
        console.error('getCategoryList 发生错误:', error);
        return null;
      }
    },
    
    /**
     * 通用递归查找方法 - 根据ID查找任意嵌套结构的数据
     * @param {Array} data - 数据数组
     * @param {Number|String} targetId - 目标ID
     * @param {String} childrenKey - 子数据键名，默认为'channels'
     * @param {Number} maxDepth - 最大递归深度，防止无限循环
     * @returns {Object|null} 找到的数据项或null
     */
    findByIdRecursive(data, targetId, childrenKey = 'channels', maxDepth = 10) {
      try {
        // 参数验证
        if (!Array.isArray(data) || data.length === 0) {
          console.warn('findByIdRecursive: 数据为空或不是数组');
          return null;
        }
        
        if (targetId === null || targetId === undefined) {
          console.warn('findByIdRecursive: 目标ID为空');
          return null;
        }

        // 递归查找函数
        const findById = (items, depth = 0) => {
          // 防止无限递归
          if (depth > maxDepth) {
            console.warn(`findByIdRecursive: 递归深度超过限制 (${maxDepth})`);
            return null;
          }

          // 遍历当前层级
          for (const item of items) {
            if (item && item.id == targetId) {
              return item;
            }
            
            // 如果有子数据，递归查找
            if (item && item[childrenKey] && Array.isArray(item[childrenKey])) {
              const result = findById(item[childrenKey], depth + 1);
              if (result !== null) {
                return result;
              }
            }
          }
          
          return null;
        };

        return findById(data);
        
      } catch (error) {
        console.error('findByIdRecursive 发生错误:', error);
        return null;
      }
    },
    
    // 处理分类点击事件
    handleCategoryClick(category) {
      this.$router.push(`/product-classes?id=${category.id}`);
    },
  },
};
</script>

<style scoped lang="less">
.page {
  background: #ffffff;
  text-align: left;

  .inner {
    padding-top: 0px;
    padding-bottom: 100px;

    .page-ctx {
      padding-top: 45px;
    }
  }
}

// 产品分类样式
.category-section {
  .section-title {
    font-size: 24px;
    font-weight: bold;
    color: #333333;
    margin-bottom: 30px;
    text-align: center;
  }

  .category-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 25px;
    margin: 0 auto;

    .category-card {
      background: #fdfdfd;
      border: 1px solid #e4e4e4;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s ease;
      width: 300px;

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        border-color: #2e4c87;
        .category-name {
          color: #2e4c87;
        }
      }

      .category-image {
        height: 178px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
      }

      .category-name {
        text-align: center;
        font-size: 16px;
        font-weight: 500;
        color: #333333;
        height: 68px;
        min-height: 68px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}

.bread-box {
  padding: 16px 0;
  border-bottom: 1px solid#E4E4E4;

  .bread-inner {
    margin: 0 auto;
    a {
      display: inline-flex;
      align-items: center;

      font-family: OPPOSans, OPPOSans;
      font-size: 15px;
      color: #999999;

      img {
        margin-right: 10px;
      }
    }

    .link {
      font-family: OPPOSans, OPPOSans;
      font-size: 15px;
      color: #999999;
    }

    .route-link {
      font-family: OPPOSans, OPPOSans;
      font-size: 15px;
      color: #999999;
    }

    .arrow {
      margin: 0 6px;
      color: #aeaeae;
    }

    > *:last-child {
      font-family: OPPOSans, OPPOSans;
      font-size: 15px;
      color: #000000;
    }

    .search-item {
      color: #aeaeae;
    }
    .search-keyword {
      color: #f74747;
    }
  }
}
</style>
