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
      categoryList: [], // 分类列表
    };
  },
  computed: {
    nav_option() {
      return [{ title: "产品中心" }];
    },
  },
  watch: {
    $route() {
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
          // 更新分类列表数据
          this.categoryList = data;
        }
      });
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
      color: #2E4C87;
    }
  }
}
</style>
