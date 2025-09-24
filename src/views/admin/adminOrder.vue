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
          label-width="100px"
          :inline="false"
        >
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="配置单号">
                <el-input
                  v-model="searchForm.orderNumber"
                  placeholder="请输入"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="联系人">
                <el-input
                  v-model="searchForm.contact"
                  placeholder="请输入"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="手机号">
                <el-input
                  v-model="searchForm.phone"
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
                  v-model="searchForm.unit"
                  placeholder="请输入"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="设备类型">
                <el-select
                  v-model="searchForm.deviceType"
                  placeholder="请选择"
                  clearable
                >
                  <el-option
                    v-for="item in deviceTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="设备型号">
                <el-input
                  v-model="searchForm.deviceModel"
                  placeholder="请输入"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="控制器">
                <el-input
                  v-model="searchForm.controller"
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
                  v-model="searchForm.date"
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
              <i class="el-icon-search"></i>
              筛选
            </el-button>
            <el-button @click="handleReset">
              <i class="el-icon-refresh"></i>
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
          stripe
          border
          style="width: 100%"
          :header-cell-style="{ background: '#ff6b35', color: '#fff' }"
        >
          <el-table-column
            prop="index"
            label="序号"
            width="80"
            align="center"
          />
          <el-table-column
            prop="orderNumber"
            label="配置单号"
            width="150"
            show-overflow-tooltip
          />
          <el-table-column prop="contact" label="联系人" width="120" />
          <el-table-column prop="phone" label="手机号" width="140" />
          <el-table-column
            prop="email"
            label="邮箱"
            width="200"
            show-overflow-tooltip
          />
          <el-table-column
            prop="unit"
            label="所属单位"
            width="180"
            show-overflow-tooltip
          />
          <el-table-column prop="deviceType" label="设备类型" width="140" />
          <el-table-column prop="deviceModel" label="设备型号" width="120" />
          <el-table-column prop="controller" label="控制器" width="120" />
          <el-table-column
            prop="controllerModel"
            label="控制器型号"
            width="140"
          />
          <el-table-column prop="submitDate" label="提交日期" width="160" />
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
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pagination.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
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
        orderNumber: "",
        contact: "",
        phone: "",
        email: "",
        unit: "",
        deviceType: "",
        deviceModel: "",
        controller: "",
        date: "",
      },
      deviceTypeOptions: [
        { label: "潜伏式机器人", value: "潜伏式机器人" },
        { label: "叉车式机器人", value: "叉车式机器人" },
        { label: "顶升式机器人", value: "顶升式机器人" },
        { label: "牵引式机器人", value: "牵引式机器人" },
      ],
      tableData: [
        {
          index: 1,
          orderNumber: "250909-12345",
          contact: "张三",
          phone: "12345678912",
          email: "1743962256@qq.com",
          unit: "单位名称单位名称",
          deviceType: "潜伏式机器人",
          deviceModel: "Camel-600",
          controller: "仙工",
          controllerModel: "SRC-880",
          submitDate: "2025/09/09 14:39",
        },
        {
          index: 2,
          orderNumber: "250909-12346",
          contact: "李四",
          phone: "12345678913",
          email: "1743962257@qq.com",
          unit: "单位名称单位名称",
          deviceType: "潜伏式机器人",
          deviceModel: "Camel-600",
          controller: "仙工",
          controllerModel: "SRC-880",
          submitDate: "2025/09/09 14:40",
        },
        {
          index: 3,
          orderNumber: "250909-12347",
          contact: "王五",
          phone: "12345678914",
          email: "1743962258@qq.com",
          unit: "单位名称单位名称",
          deviceType: "潜伏式机器人",
          deviceModel: "Camel-600",
          controller: "仙工",
          controllerModel: "SRC-880",
          submitDate: "2025/09/09 14:41",
        },
        {
          index: 4,
          orderNumber: "250909-12348",
          contact: "赵六",
          phone: "12345678915",
          email: "1743962259@qq.com",
          unit: "单位名称单位名称",
          deviceType: "潜伏式机器人",
          deviceModel: "Camel-600",
          controller: "仙工",
          controllerModel: "SRC-880",
          submitDate: "2025/09/09 14:42",
        },
        {
          index: 5,
          orderNumber: "250909-12349",
          contact: "钱七",
          phone: "12345678916",
          email: "1743962260@qq.com",
          unit: "单位名称单位名称",
          deviceType: "潜伏式机器人",
          deviceModel: "Camel-600",
          controller: "仙工",
          controllerModel: "SRC-880",
          submitDate: "2025/09/09 14:43",
        },
      ],
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
      // 模拟API调用
      setTimeout(() => {
        this.loading = false;
        this.$message.success("搜索完成");
      }, 1000);
    },

    // 重置搜索
    handleReset() {
      this.searchForm = {
        orderNumber: "",
        contact: "",
        phone: "",
        email: "",
        unit: "",
        deviceType: "",
        deviceModel: "",
        controller: "",
        date: "",
      };
      this.$message.info("已重置搜索条件");
    },

    // 查看详情
    handleViewDetail(row) {
      this.$message.info(`查看订单 ${row.orderNumber} 的详细配置`);
      // 这里可以跳转到详情页面或打开详情弹窗
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
      // 模拟API调用
      setTimeout(() => {
        this.loading = false;
      }, 500);
    },
  },

  mounted() {
    this.loadData();
  },
};
</script>

<style lang="less" scoped>
@import "./adminOrder.less";
</style>
