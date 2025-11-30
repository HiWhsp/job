<template>
  <div class="contract-list">
    <div class="w-1600">
      <!-- 面包屑导航 -->
      <div class="breadcrumb">
        <router-link to="/" class="breadcrumb-item">首页</router-link>
        <i class="el-icon-arrow-right breadcrumb-separator"></i>
        <span class="breadcrumb-item current">文档中心</span>
      </div>

      <!-- 筛选区域 -->
      <div class="filter-section">
        <!-- 文档分类 -->
        <div class="filter-row">
          <span class="filter-label">文档分类</span>
          <div class="filter-options" ref="filterOptions">
            <div
              class="filter-option"
              v-for="(category, index) in categories"
              :key="category.id"
              :class="{ active: selectedCategory === category.id }"
              @click="toggleCategoryDropdown(category.id, index, $event)"
              :ref="`categoryOption-${index}`"
            >
              {{ category.title }}
            </div>
          </div>
        </div>

        <!-- 费用 -->
        <div class="filter-row">
          <span class="filter-label">费用</span>
          <div class="filter-options">
            <div
              class="filter-option"
              :class="{ active: selectedPrice === 'free' }"
              @click="selectPrice('free')"
            >
              免费
            </div>
            <div
              class="filter-option"
              :class="{ active: selectedPrice === 'paid' }"
              @click="selectPrice('paid')"
            >
              收费
            </div>
          </div>
        </div>

        <!-- 当前筛选 -->
        <div class="filter-row">
          <span class="filter-label">当前筛选</span>
          <div class="active-filters">
            <span
              class="filter-tag"
              v-for="(filter, index) in activeFilters"
              :key="index"
            >
              {{ filter.label }}
              <i class="el-icon-close" @click="removeFilter(index)"></i>
            </span>
            <span
              class="clear-all"
              v-if="activeFilters.length > 0"
              @click="clearAllFilters"
            >
              <i class="el-icon-delete"></i>
              清除所选
            </span>
          </div>
        </div>
      </div>

      <!-- 文档列表 -->
      <div class="contract-list-section">
        <ContractCard
          :contract="item"
          v-for="item in currentContracts"
          :key="item.id"
        />

        <el-empty
          v-if="currentContracts.length === 0"
          style="width: 100%"
          description="暂无文档数据"
        />
      </div>
      <!-- 分页 -->
      <div class="pagination-section" v-if="currentContracts.length > 0">
        <el-pagination
          :total="totalContracts"
          :page-size="pageSize"
          :current-page="currentPage"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ContractCard from "@/components/ContractCard.vue";
export default {
  name: "contractList",
  components: {
    ContractCard,
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      totalContracts: 0,
      currentContracts: [],
      selectedCategory: "",
      selectedPrice: "",
      selectedFormat: "",
      activeFilters: [],
      showDropdown: false,
      dropdownStyle: {},
      categories: [
        {
          title: "全部",
          id: "",
        },
        {
          title: "生产经营合同",
        },
        {
          title: "知识产权合同",
          id: "2",
        },
        {
          title: "劳动人事合同",
          id: "3",
        },
      ],
    };
  },
  computed: {},
  watch: {
    selectedCategory() {
      this.updateActiveFilters();
    },
    selectedPrice() {
      this.updateActiveFilters();
    },
    selectedFormat() {
      this.updateActiveFilters();
    },
  },
  mounted() {
    this.initFilters();
  },

  methods: {
    initFilters() {
      // 从路由参数初始化筛选
      const category = this.$route.query.category;
      if (category) {
        this.selectedCategory = category;
      }
      this.updateActiveFilters();
      this.getContractList();
    },
    getContractList() {
      this.currentContracts = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
    },
    toggleCategoryDropdown(categoryId, index, event) {
      if (this.selectedCategory === categoryId && this.showDropdown) {
        // 如果已选中且下拉菜单已打开，则关闭
        this.showDropdown = false;
        this.selectedCategory = "";
      } else {
        // 选中分类并显示下拉菜单
        this.selectedCategory = categoryId;
        this.showDropdown = true;
        // 计算下拉菜单位置
        this.$nextTick(() => {
          const optionElement = this.$refs[`categoryOption-${index}`]?.[0];
          if (optionElement) {
            const rect = optionElement.getBoundingClientRect();
            const containerRect =
              this.$refs.filterOptions.getBoundingClientRect();
            this.dropdownStyle = {
              left: `${rect.left - containerRect.left}px`,
              top: `${rect.bottom - containerRect.top + 8}px`,
            };
          }
        });
      }
    },
    selectPrice(priceType) {
      if (this.selectedPrice === priceType) {
        this.selectedPrice = "";
      } else {
        this.selectedPrice = priceType;
      }
    },
    updateActiveFilters() {
      this.activeFilters = [];

      if (this.selectedCategory) {
        const category = {
          title: "全部",
          id: "",
        };
        if (category) {
          this.activeFilters.push({
            type: "category",
            label: category.title,
            value: this.selectedCategory,
          });
        }
      }

      if (this.selectedPrice === "free") {
        this.activeFilters.push({
          type: "price",
          label: "免费",
          value: "free",
        });
      } else if (this.selectedPrice === "paid") {
        this.activeFilters.push({
          type: "price",
          label: "收费",
          value: "paid",
        });
      }

      if (this.selectedFormat === "pdf") {
        this.activeFilters.push({
          type: "format",
          label: "PDF",
          value: "pdf",
        });
      }
    },
    removeFilter(index) {
      const filter = this.activeFilters[index];
      if (filter.type === "category") {
        this.selectedCategory = "";
      } else if (filter.type === "price") {
        this.selectedPrice = "";
      } else if (filter.type === "format") {
        this.selectedFormat = "";
      }
      this.activeFilters.splice(index, 1);
    },
    clearAllFilters() {
      this.selectedCategory = "";
      this.selectedPrice = "";
      this.selectedFormat = "";
      this.activeFilters = [];
      this.showDropdown = false;
    },
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getContractList();
    },
  },
};
</script>

<style lang="less" scoped>
.contract-list {
  margin-top: 114px;
  padding: 24px 0;
  background: #f4f4f6;
  min-height: calc(100vh - 114px);
}

// 面包屑导航
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
  font-size: 14px;

  .breadcrumb-item {
    color: #666;
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: #0081ff;
    }

    &.current {
      color: #333;
      cursor: default;
    }
  }

  .breadcrumb-separator {
    font-size: 12px;
    color: #999;
  }
}

// 筛选区域
.filter-section {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
}

.filter-row {
  display: flex;
  align-items: center;
  height: 70px;
  border-bottom: 1px solid #e8e8e8;
  &:last-child {
    border-bottom: none;
  }

  .filter-label {
    width: 100px;
    font-size: 16px;
    color: #333;
    text-align: right;
  }

  .filter-options {
    margin-left: 50px;
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;

    .filter-option {
      padding: 8px 20px;
      font-size: 16px;
      color: #666;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 6px;

      &:hover {
        color: #0081ff;
      }

      &.active {
        color: #0081ff;
        i {
          font-size: 12px;
        }
      }
    }
  }

  .active-filters {
    margin-left: 50px;
    display: flex;
    align-items: center;
    gap: 12px;

    .filter-tag {
      display: inline-flex;
      align-items: center;
      gap: 13px;
      padding: 6px 12px;
      background: #f1f8ff;
      color: #333;
      border-radius: 20px;
      font-size: 14px;
      border: 1px solid #0081ff;

      i {
        font-size: 12px;
        cursor: pointer;
        transition: transform 0.2s ease;

        &:hover {
          transform: scale(1.2);
        }
      }
    }

    .clear-all {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      color: #666;
      font-size: 14px;
      cursor: pointer;
      transition: color 0.3s ease;

      &:hover {
        color: #0081ff;
      }

      i {
        font-size: 16px;
      }
    }
  }
}

// 下拉菜单样式
.category-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 8px;
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
  min-width: 200px;
  max-height: 300px;
  overflow-y: auto;

  .dropdown-item {
    padding: 12px 20px;
    font-size: 14px;
    color: #666;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background: #f5f5f5;
      color: #0081ff;
    }

    &.active {
      background: #e6f3ff;
      color: #0081ff;
      font-weight: 500;
    }
  }
}

.filter-options {
  position: relative;
}

.contract-list-section {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 40px;
}

.pagination-section {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}
</style>
