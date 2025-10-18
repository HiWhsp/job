<template>
  <div class="admin-order-page">
    <!-- 头部栏 -->
    <header class="header">
      <div class="header-content">
        <div class="logo-section">
          <div class="logo-text">
            <img src="@/assets/img/common/logo.png" alt="" />
          </div>
          <span class="page-title">翼非官网后台管理系统</span>
        </div>
        <div class="header-right">
          <div class="user-info">
            <i class="el-icon-s-custom"></i>
            <span class="user-name">Name</span>
          </div>
        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 搜索筛选区域 -->
      <div class="search-section">
        <el-form
          :model="searchForm"
          class="search-form"
          label-width="80px"
          :inline="false"
        >
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="配置单号">
                <el-input
                  v-model="searchForm.order_no"
                  placeholder="请输入"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="联系人">
                <el-input
                  v-model="searchForm.name"
                  placeholder="请输入"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="手机号">
                <el-input
                  v-model="searchForm.mobile"
                  placeholder="请输入"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="邮箱">
                <el-input
                  v-model="searchForm.email"
                  placeholder="请输入"
                  clearable
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="所属单位">
                <el-input
                  v-model="searchForm.company"
                  placeholder="请输入"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="设备类型">
                <el-select
                  v-model="searchForm.product_channel_id"
                  placeholder="请选择"
                  clearable
                >
                  <el-option
                    v-for="item in deviceTypeOptions"
                    :key="item.id"
                    :label="item.title"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="设备型号">
                <el-input
                  v-model="searchForm.product_title"
                  placeholder="请输入"
                  clearable
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="日期">
                <el-date-picker
                  v-model="searchForm.created_at"
                  type="date"
                  placeholder="请选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  clearable
                />
              </el-form-item>
            </el-col>
          </el-row>
          <div class="search-buttons">
            <el-button type="primary" @click="handleSearch">
              <!-- <i class="el-icon-search"></i> -->
              筛选
            </el-button>
            <el-button @click="handleReset">
              <!-- <i class="el-icon-refresh"></i> -->
              重置
            </el-button>
          </div>
        </el-form>
      </div>

      <!-- 数据表格区域 -->
      <div class="table-section">
        <el-table
          :data="tableData"
          v-loading="loading"
          style="width: 100%"
          :header-cell-style="{ background: '#ED6C00', color: '#fff' }"
        >
          <el-table-column prop="index" label="序号" width="80" align="center">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column
            prop="order_no"
            label="配置单号"
            width="120"
            show-overflow-tooltip
          />
          <el-table-column prop="name" label="联系人" width="80" />
          <el-table-column prop="mobile" label="手机号" width="140" />
          <el-table-column
            prop="email"
            label="邮箱"
            width="200"
            show-overflow-tooltip
          />
          <el-table-column
            prop="company"
            label="所属单位"
            width="180"
            show-overflow-tooltip
          />
          <el-table-column prop="product_channel_id" label="设备类型">
            <template slot-scope="scope">
              {{ getDeviceType(scope.row.product_channel_id) }}
            </template>
          </el-table-column>
          <el-table-column prop="product_title" label="设备型号" />
          <el-table-column prop="created_at" label="提交日期" />
          <el-table-column
            label="操作"
            width="120"
            align="center"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                @click="handleViewDetail(scope.row)"
              >
                详细配置
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-wrapper">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pagination.currentPage"
            :page-size="pagination.pageSize"
            layout="total, prev, pager, next"
            :total="pagination.total"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AdminOrder",
  data() {
    return {
      loading: false,
      searchForm: {
        order_no: "",
        name: "",
        mobile: "",
        email: "",
        company: "",
        product_channel_id: "",
        product_title: "",
        created_at: "",
      },
      deviceTypeOptions: [], // 设备类型选项
      tableData: [],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 100,
      },
    };
  },
  methods: {
    // 搜索功能
    handleSearch() {
      this.loading = true;
      this.loadData();
    },

    // 重置搜索
    handleReset() {
      this.searchForm = {
        order_no: "",
        name: "",
        mobile: "",
        email: "",
        company: "",
        product_channel_id: "",
        product_title: "",
        created_at: "",
      };
      this.loadData();
    },

    // 查看详情
    handleViewDetail(row) {
      // 这里可以跳转到详情页面或打开详情弹窗
      this.$router.push({
        path: "/myAdminOrderDetail",
        query: {
          order_no: row.id,
        },
      });
    },

    // 分页大小改变
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.pagination.currentPage = 1;
      this.loadData();
    },

    // 当前页改变
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.loadData();
    },

    // 加载数据
    loadData() {
      this.loading = true;
      this.$api({
        url: "logProductSetting",
        method: "post",
        data: this.searchForm,
      }).then((res) => {
        this.tableData = res.data.list;
        this.pagination.total = res.data.count;
        this.loading = false;
      });
    },
    getDeviceType(id) {
      return this.deviceTypeOptions.find((item) => item.id === id)?.title;
    },
  },

  mounted() {
    this.loadData();
    this.$api({
      url: "getProductType",
      method: "get",
    }).then((res) => {
      this.deviceTypeOptions = res.data;
    });
  },
};
</script>

<style lang="less" scoped>
@import "./adminOrder.less";
</style>
