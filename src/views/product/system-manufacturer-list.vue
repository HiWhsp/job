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
              placeholder="请输入关键字"
              @keyup.enter="handleSearch"
            />
            <button class="search-btn" @click="handleSearch">
              <i class="el-icon-search"></i>
              搜索
            </button>
          </div>
        </div>
      </div>

      <!-- 筛选条件区域 -->
      <div class="filter-section">
        <div class="filter-container w-1400">
          <!-- 一级分类 -->
          <div class="filter-row">
            <span class="filter-label">一级分类：</span>
            <div class="filter-options">
              <span
                class="filter-item"
                :class="{ active: firstCategory === 'all' }"
                @click="selectFirstCategory('all')"
                >全部</span
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
          <div class="filter-row" v-if="firstCategory != 'all'">
            <span class="filter-label">二级分类：</span>
            <div class="filter-options">
              <span
                class="filter-item"
                :class="{ active: secondCategory === 'all' }"
                @click="selectSecondCategory('all')"
                >全部</span
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
          <div class="filter-row" v-if="secondCategory != 'all'">
            <span class="filter-label">三级分类：</span>
            <div class="filter-options">
              <span
                class="filter-item"
                :class="{ active: thirdCategory === 'all' }"
                @click="selectThirdCategory('all')"
                >全部</span
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
            <span class="filter-label">选择地区：</span>
            <div class="filter-options">
              <span
                class="filter-item"
                :class="{ active: selectedRegion === 'all' }"
                @click="selectRegion('all')"
                >全部</span
              >
              <span
                v-for="item in regions"
                :key="item.id"
                class="filter-item"
                :class="{ active: selectedRegion === item.id }"
                @click="selectRegion(item.id)"
                >{{ item.name }}</span
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
              v-for="company in companyList"
              :key="company.id"
              class="company-item"
              @click="viewCompany(company)"
            >
              <div class="company-header">
                <h3 class="company-title">{{ company.companyName }}</h3>
              </div>
              <div class="company-body">
                <img :src="company.backImage" alt="" />
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
              <span>广告推荐</span>
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
          title: "系统制造商列表",
        },
      ];
      return option;
    },
  },
  data() {
    return {
      // 搜索关键词
      searchKeyword: "",

      // 筛选条件
      firstCategory: "all",
      secondCategory: "all",
      thirdCategory: "all",
      selectedRegion: "all",

      // 筛选选项数据
      firstCategories: [],
      secondCategories: [],
      thirdCategories: [],
      regions: [
        { id: "1", name: "北京" },
        { id: "2", name: "天津" },
        { id: "3", name: "河北" },
        { id: "4", name: "山西" },
        { id: "5", name: "内蒙古" },
        { id: "6", name: "上海" },
        { id: "7", name: "江苏" },
        { id: "8", name: "浙江" },
      ],

      // 推荐列表
      recommendList: [],

      // 公司列表
      companyList: [
        {
          id: 1,
          name: "恒顺新能源科技有限公司",
          introduction:
            "本公司致力于新能源技术开发，在光伏产业工艺技术和新能源领域，坚持创新，突破传统，工艺技术精湛，生产制造规模大，效能高创新能力强，产品品质优良，管理制度完善，技术服务支持，实现客户价值",
          registerTime: "2023-04",
        },
        {
          id: 2,
          name: "恒顺新能源科技有限公司",
          introduction:
            "本公司致力于新能源技术开发，在光伏产业工艺技术和新能源领域，坚持创新，突破传统，工艺技术精湛，生产制造规模大，效能高创新能力强，产品品质优良，管理制度完善，技术服务支持，实现客户价值",
          registerTime: "2021-04",
        },
      ],

      pageSize: 20,
      total: 0,
    };
  },

  mounted() {
    this.loadData();
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
        this.regions = data.provinceList || [];
      }
    });
  },

  methods: {
    // 搜索
    handleSearch() {
      this.currentPage = 1;
      this.loadData();
    },

    // 选择一级分类
    selectFirstCategory(id) {
      if (id == "all") {
        this.firstCategory = "all";
        this.secondCategory = "all";
        this.thirdCategory = "all";
        this.currentPage = 1;
        this.loadData();
        return;
      }
      this.firstCategory = id;
      this.secondCategory = "all";
      this.thirdCategory = "all";
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
      if (id == "all") {
        this.secondCategory = "all";
        this.thirdCategory = "all";
        this.currentPage = 1;
        this.loadData();
        return;
      }
      this.secondCategory = id;
      this.thirdCategory = "all";
      this.currentPage = 1;
      this.thirdCategories = this.secondCategories.find((item) => item.id == id)
        ? this.secondCategories.find((item) => item.id == id).children
        : [];
      this.loadData();
    },

    // 选择三级分类
    selectThirdCategory(id) {
      if (id == "all") {
        this.thirdCategory = "all";
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
      console.log("查看推荐:", item);
      // 跳转到公司详情页
      this.toNav({ route: "/manufacturer-detail", query: { id: item.id } });
    },

    // 查看公司
    viewCompany(company) {
      console.log("查看公司:", company);
      // 跳转到公司详情页
      this.toNav({ route: "/manufacturer-detail", query: { id: company.id } });
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
        params: {
          keyWord: this.searchKeyword,
          workType: [
            this.firstCategory,
            this.secondCategory,
            this.thirdCategory,
          ].join(","),
          provinceId: this.selectedRegion,
          page: this.currentPage,
          pageSize: this.pageSize,
          companyType: 1,
        },
      }).then((res) => {
        let { code, data, msg } = res;
        if (code == 200) {
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
