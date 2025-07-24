<template>
  <div class="manufacturer-list-container">
    <div class="topContent">
      <page_breadcrumb :option="nav_option" />
    </div>
    <div class="to-warp">
      <!-- 顶部搜索区域 -->
      <div class="top-search-section">
        <div class="search-container">
          <div class="search-box">
            <input
              type="text"
              v-model="searchKeyword"
              placeholder="Please enter keywords"
              @keyup.enter="handleSearch"
            />
            <button class="search-btn" @click="handleSearch">
              <i class="el-icon-search"></i>
              Search
            </button>
          </div>
        </div>
      </div>

      <!-- 筛选条件区域 -->
      <div class="filter-section">
        <div class="filter-container w-1400">
          <!-- 一级分类 -->
          <div class="filter-row">
            <span class="filter-label">Primary Category:</span>
            <div class="filter-options">
              <span
                class="filter-item"
                :class="{ active: firstCategory === '' }"
                @click="selectFirstCategory('')"
                >All</span
              >
              <span
                v-for="item in firstCategories"
                :key="item.id"
                class="filter-item"
                :class="{ active: firstCategory === item.id }"
                @click="selectFirstCategory(item.id)"
                >{{ item.name_zh }}</span
              >
            </div>
          </div>

          <!-- 二级分类 -->
          <div class="filter-row" v-if="firstCategory != ''">
            <span class="filter-label">Secondary Category:</span>
            <div class="filter-options">
              <span
                class="filter-item"
                :class="{ active: secondCategory === '' }"
                @click="selectSecondCategory('')"
                >All</span
              >
              <span
                v-for="item in secondCategories"
                :key="item.id"
                class="filter-item"
                :class="{ active: secondCategory === item.id }"
                @click="selectSecondCategory(item.id)"
                >{{ item.name_zh }}</span
              >
            </div>
          </div>

          <!-- 三级分类 -->
          <div class="filter-row" v-if="secondCategory != ''">
            <span class="filter-label">Tertiary Category:</span>
            <div class="filter-options">
              <span
                class="filter-item"
                :class="{ active: thirdCategory === '' }"
                @click="selectThirdCategory('')"
                >All</span
              >
              <span
                v-for="item in thirdCategories"
                :key="item.id"
                class="filter-item"
                :class="{ active: thirdCategory === item.id }"
                @click="selectThirdCategory(item.id)"
                >{{ item.name_zh }}</span
              >
            </div>
          </div>

          <!-- 选择地区 -->
          <div class="filter-row">
            <span class="filter-label">Select Region:</span>
            <div class="filter-options">
              <span
                class="filter-item"
                :class="{ active: selectedRegion === '' }"
                @click="selectRegion('')"
                >All</span
              >
              <span
                v-for="item in regions"
                :key="item.id"
                class="filter-item"
                :class="{ active: selectedRegion === item.id }"
                @click="selectRegion(item.id)"
                >{{ item.nameEn }}</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 内容区域 - 左右布局 -->
    <div class="content-section">
      <div class="content-container w-1400">
        <!-- 右侧公司列表区域 -->
        <div class="right-content">
          <div class="company-list">
            <div
              v-for="company in companyList.slice(0, 2)"
              :key="company.id"
              class="company-item"
              @click="viewCompany(company)"
            >
              <div class="company-header">
                <h3 class="company-title">{{ company.companyName }}</h3>
              </div>
              <div class="company-body">
                <img :src="company.logo_full" alt="" />
                <div class="company-content">
                  <p class="company-intro">{{ company.describption }}</p>
                  <div class="company-info">
                    <span class="info-item">
                      {{ company.companyName }} {{ company.created_at }}</span
                    >
                  </div>
                </div>
              </div>
            </div>
            <!-- 广告 -->
            <div class="company-item" v-for="item in adBanners" :key="item.id">
              <div class="company-header">
                <h3 class="company-title">{{ item.describe || "广告" }}</h3>
              </div>
              <div class="company-body">
                <div class="company-logo">
                  <img
                    :src="it"
                    v-for="(it, i) in item.image.split(',')"
                    :key="i"
                    alt=""
                  />
                </div>
                <div class="company-info">
                  <p class="company-name">{{ item.title }}</p>
                  <p class="company-time">{{ item.created_at || "--" }}</p>
                  <p class="company-type">广告</p>
                </div>
              </div>
            </div>
            <div
              v-for="company in companyList.slice(2)"
              :key="company.id"
              class="company-item"
              @click="viewCompany(company)"
            >
              <div class="company-header">
                <h3 class="company-title">{{ company.companyName }}</h3>
              </div>
              <div class="company-body">
                <img :src="company.adLogo_full" alt="" />
                <div class="company-content">
                  <p class="company-intro">{{ company.describption }}</p>
                  <div class="company-info">
                    <span class="info-item">
                      {{ company.companyName }} {{ company.created_at }}</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 分页 -->
          <div class="pagination-wrapper" v-if="total > 0">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="pageSize"
              layout="prev, pager, next"
              :total="total"
            >
            </el-pagination>
          </div>
        </div>
        <!-- 左侧推荐区域 -->
        <div class="left-sidebar">
          <div class="recommend-section">
            <div class="recommend-header">
              <img src="@/assets/image/icon/good.png" alt="" />
              <span>recommend</span>
            </div>
            <div class="recommend-list">
              <div
                v-for="item in recommendList"
                :key="item.id"
                class="recommend-item"
                @click="viewRecommend(item)"
              >
                <div class="company-name">{{ item.companyName }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import page_breadcrumb from "@/components/page/page-breadcrumb.vue";
export default {
  name: "SystemManufacturerList",
  components: {
    page_breadcrumb,
  },
  computed: {
    nav_option() {
      let option = [
        {
          route: "/system-manufacturer-list",
          title: "Manufacturer List",
        },
      ];
      return option;
    },
  },
  data() {
    return {
      companyType: 1,
      // 搜索关键词
      searchKeyword: "",

      // 筛选条件
      firstCategory: "",
      secondCategory: "",
      thirdCategory: "",
      selectedRegion: "",

      // 筛选选项数据
      firstCategories: [],
      secondCategories: [],
      thirdCategories: [],
      regions: [],

      // 推荐列表
      recommendList: [],

      // 公司列表
      companyList: [],

      // 广告
      adBanners: [],

      pageSize: 20,
      total: 0,
    };
  },

  mounted() {
    this.companyType = this.$route.query.companyType;
    // 获取筛选条件
    this.$api({
      url: "getFinishSelect",
      method: "get",
    }).then((res) => {
      let { code, data, msg } = res;
      if (code == 200) {
        this.firstCategories = data.typeListTree || [];
        this.secondCategories = data.typeListTree[0].children || [];
        this.thirdCategories = data.typeListTree[0].children[0].children || [];
      }
    });
    // 获取省
    this.$api({
      url: "provinceList",
      method: "get",
    }).then((res) => {
      let { code, data, msg } = res;
      if (code == 200) {
        this.regions = data.state_list || [];
      }
    });
    this.loadData();
  },

  methods: {
    // 搜索
    handleSearch() {
      this.currentPage = 1;
      this.loadData();
    },

    // 选择一级分类
    selectFirstCategory(id) {
      if (id == "") {
        this.firstCategory = "";
        this.secondCategory = "";
        this.thirdCategory = "";
        this.currentPage = 1;
        this.loadData();
        return;
      }
      this.firstCategory = id;
      this.secondCategory = "";
      this.thirdCategory = "";
      this.currentPage = 1;
      // 获取选择的一级分类的二级分类
      this.secondCategories = this.firstCategories.find((item) => item.id == id)
        ? this.firstCategories.find((item) => item.id == id).children
        : [];
      this.thirdCategories = this.secondCategories.find((item) => item.id == id)
        ? this.secondCategories.find((item) => item.id == id).children
        : [];
      this.loadData();
    },

    // 选择二级分类
    selectSecondCategory(id) {
      if (id == "") {
        this.secondCategory = "";
        this.thirdCategory = "";
        this.currentPage = 1;
        this.loadData();
        return;
      }
      this.secondCategory = id;
      this.thirdCategory = "";
      this.currentPage = 1;
      this.thirdCategories = this.secondCategories.find((item) => item.id == id)
        ? this.secondCategories.find((item) => item.id == id).children
        : [];
      this.loadData();
    },

    // 选择三级分类
    selectThirdCategory(id) {
      if (id == "") {
        this.thirdCategory = "";
        this.currentPage = 1;
        this.loadData();
        return;
      }
      this.thirdCategory = id;
      this.currentPage = 1;
      this.loadData();
    },

    // 选择地区
    selectRegion(id) {
      this.selectedRegion = id;
      this.currentPage = 1;
      this.loadData();
    },

    // 查看推荐
    viewRecommend(item) {
      if (item && !item.can_show_detail) {
        return;
      } else {
        // 跳转到公司详情页
        this.toNav({
          route: "/manufacturer-detail",
          query: { id: item.id },
        });
      }
    },

    // 查看公司
    viewCompany(company) {
      if (company && !company.can_show_detail) {
        return;
      } else {
        // 跳转到公司详情页
        this.toNav({
          route: "/manufacturer-detail",
          query: { id: company.id },
        });
      }
    },

    // 跳转
    toNav(option) {
      this.$router.push({
        path: option.route,
        query: option.query,
      });
    },

    // 分页相关
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.loadData();
    },

    handleCurrentChange(val) {
      this.currentPage = val;
      this.loadData();
    },

    // 加载数据
    loadData() {
      this.$api({
        url: "companyList",
        method: "get",
        data: {
          keyWord: this.searchKeyword,
          workType: [this.firstCategory, this.secondCategory, this.thirdCategory]
            .filter((item) => item != "")
            .join(","),
          provinceId: this.selectedRegion,
          // stateId: this.selectedRegion,
          page: this.currentPage,
          pageSize: this.pageSize,
        },
      }).then((res) => {
        let { code, data, msg } = res;
        if (code == 200) {
          this.adBanners = data.adBanners || [];
          this.companyList = data.list || [];
          this.recommendList = data.suggestCompany || [];
          this.total = data.totalCount || 0;
        }
      });
    },
  },
};
</script>

<style scoped lang="less" src="./system-manufacturer-list.less"></style>
