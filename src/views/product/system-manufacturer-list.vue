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
                >{{ item.name }}</span
              >
            </div>
          </div>

          <!-- 二级分类 -->
          <div class="filter-row">
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
                >{{ item.name }}</span
              >
            </div>
          </div>

          <!-- 三级分类 -->
          <div class="filter-row">
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
                >{{ item.name }}</span
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
                <h3 class="company-title">{{ company.name }}</h3>
              </div>
              <div class="company-body">
                <img src="" alt="" />
                <div class="company-content">
                  <p class="company-intro">{{ company.introduction }}</p>
                  <div class="company-info">
                    <span class="info-item">
                      北京XXXX科技有限公司 {{ company.registerTime }}</span
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
                <div class="company-name">{{ item.name }}</div>
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
      firstCategories: [
        { id: "1", name: "太阳能" },
        { id: "2", name: "稀土" },
        { id: "3", name: "风能" },
        { id: "4", name: "金属" },
        { id: "5", name: "节能设备" },
      ],
      secondCategories: [
        { id: "1", name: "光伏应用产品" },
        { id: "2", name: "光伏生产设备及原材料" },
        { id: "3", name: "光伏原材料" },
        { id: "4", name: "太阳能灯、照明系统" },
      ],
      thirdCategories: [
        { id: "1", name: "太阳能电池组件" },
        { id: "2", name: "太阳能电池片" },
        { id: "3", name: "光伏逆变器" },
        { id: "4", name: "太阳能光伏发电系统" },
      ],
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
      recommendList: [
        {
          id: 1,
          name: "恒顺新能源科技有限公司",
          description: "专业从事新能源技术研发，产品质量优良，服务完善",
        },
        {
          id: 2,
          name: "恒顺新能源科技有限公司",
          description: "专业从事新能源技术研发，产品质量优良，服务完善",
        },
        {
          id: 3,
          name: "恒顺新能源科技有限公司",
          description: "专业从事新能源技术研发，产品质量优良，服务完善",
        },
      ],

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

      // 分页
      currentPage: 1,
      pageSize: 20,
      total: 0,
    };
  },

  created() {
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
      this.firstCategory = id;
      this.secondCategory = "all";
      this.thirdCategory = "all";
      this.currentPage = 1;
      this.loadData();
    },

    // 选择二级分类
    selectSecondCategory(id) {
      this.secondCategory = id;
      this.thirdCategory = "all";
      this.currentPage = 1;
      this.loadData();
    },

    // 选择三级分类
    selectThirdCategory(id) {
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
    },

    // 查看公司
    viewCompany(company) {
      console.log("查看公司:", company);
      // 跳转到公司详情页
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
      // 模拟数据加载
      this.total = 50;
      console.log("加载数据:", {
        keyword: this.searchKeyword,
        firstCategory: this.firstCategory,
        secondCategory: this.secondCategory,
        thirdCategory: this.thirdCategory,
        region: this.selectedRegion,
        page: this.currentPage,
        size: this.pageSize,
      });
    },
  },
};
</script>

<style scoped lang="less" src="./system-manufacturer-list.less"></style>
