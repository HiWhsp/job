<template>
  <div class="page">
    <div class="page-header">
      <!-- 搜索项 -->
      <div class="search-form">
        <el-form :model="searchForm" ref="searchForm" :inline="true" size="small">
          <el-form-item label="工单编号" prop="workorder_no">
            <el-input
              v-model="searchForm.workorder_no"
              placeholder="请输入工单编号"
              clearable
              style="width: 200px"
              @change="handleSearch"
            />
          </el-form-item>
          <el-form-item label="工单类型" prop="workOrderType">
            <el-select
              v-model="searchForm.workOrderType"
              placeholder="请选择工单类型"
              clearable
              style="width: 200px"
              @change="handleSearch"
            >
              <!-- 不传或传空获取全部;1售后运维需求表 2项目产品需求表 3项目融资表 4项目转让表 5产品回收利用表 -->
              <el-option label="全部" value="" />
              <el-option label="售后运维需求表" value="1" />
              <el-option label="项目产品需求表" value="2" />
              <el-option label="项目融资表" value="3" />
              <el-option label="项目转让表" value="4" />
              <el-option label="产品回收利用表" value="5" />
            </el-select>
          </el-form-item>
          <el-form-item label="设备类型" prop="deviceType">
            <el-select
              v-model="searchForm.deviceType"
              placeholder="请选择设备类型"
              clearable
              style="width: 200px"
              @change="handleSearch"
            >
              <el-option label="全部" value="" />
              <el-option label="光伏" value="1" />
              <el-option label="储能" value="2" />
              <el-option label="柴冲" value="3" />
              <el-option label="其他" value="4" />
            </el-select>
          </el-form-item>
          <el-form-item style="flex: 1; text-align: right">
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div class="tab-box">
      <div
        class="tab-item"
        :class="{ active: activeTab === item.value }"
        v-for="item in tabList"
        :key="item.value"
        @click="handleTabClick(item.value)"
      >
        <span>{{ item.name }}</span>
      </div>
    </div>
    <div class="page-ctx">
      <!-- 工单列表 -->
      <div class="service-list">
        <div v-for="item in serviceList" :key="item.id" class="service-item">
          <!-- 头部信息 -->
          <div class="service-header">
            <div class="header-left">
              <span class="status" :class="item.statusClass">{{
                checkStatus(item.checkStatus)
              }}</span>
              <div class="service-info">
                <span class="date">{{ item.created_at }}</span>
                <span class="order-info">工单编号：{{ item.workorder_no }}</span>
              </div>
            </div>
            <div class="header-right">
              <span class="pay-amount"
                >金额：<span class="amount">￥{{ item.payPrice }}</span></span
              >
            </div>
          </div>

          <!-- 内容区域 -->
          <div class="service-content">
            <div class="content-top">
              <div class="content-left">
                <h4 class="service-title">{{ workOrderName(item) }}</h4>
                <div class="service-info">
                  <div class="info-item">
                    <span class="info-label">设备类型：</span>
                    <span class="info-value">{{ deviceTypeName(item) }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">设备位置：</span>
                    <span class="info-value">{{ item.deviceAddress }}</span>
                  </div>
                  <div class="download-files">
                    <div class="file-item">
                      <span class="file-type">服务合同：</span>
                      <img
                        src="@/assets/image/icon/pdf.png"
                        class="file-icon"
                        alt="file"
                      />
                      <span class="file-name">{{ item.contractName }}</span>
                      <a
                        href="#"
                        class="download-link"
                        @click="downloadFile(item.contractUrl)"
                        >下载</a
                      >
                    </div>
                  </div>
                </div>
              </div>

              <div class="content-right">
                <div class="action-buttons">
                  <el-button size="small" @click="handleAction('detail', item)">
                    工单详情
                  </el-button>
                  <el-button
                    size="small"
                    @click="handleAction('backContract', item)"
                    v-if="item.workorderStatus == 0"
                  >
                    回传合同
                  </el-button>
                  <el-button
                    size="small"
                    @click="handleAction('confirm', item)"
                    v-if="item.workorderStatus == 3"
                  >
                    服务完成
                  </el-button>
                </div>
              </div>
            </div>
            <div class="content-bottom" v-if="item.workorderStatus == 0">
              <div class="notice">
                <img
                  src="@/assets/image/icon/notice.png"
                  class="notice-icon"
                  alt="notice"
                />
                <span class="notice-text">请下载服务合同后签字盖章回传系统确认工单</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-empty v-if="total == 0" description="暂无数据" />
    <el-pagination
      v-if="total > 0"
      style="margin-top: 20px; text-align: center"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      layout="prev, pager, next"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
export default {
  name: "service-provider-list",
  data() {
    return {
      serviceList: [],
      tabList: [
        { name: "全部工单", value: "0" },
        { name: "待确认", value: "1" },
        { name: "服务中", value: "4" },
        { name: "已完成", value: "5" },
      ],
      activeTab: "0",
      currentPage: 1,
      pageSize: 10,
      total: 0,
      searchForm: {
        workorder_no: "",
        workOrderType: "",
        deviceType: "",
      },
    };
  },
  computed: {
    // 审核状态
    checkStatus() {
      return (status) => {
        return {
          0: "待查看",
          1: "已查看",
          2: "已处理",
        }[status];
      };
    },
    // 需求类型
    workOrderName() {
      return (item) => {
        return {
          1: "售后运维需求表",
          2: "光储充相关产品需求表",
          3: "新能源光储充项目投融资信息需求表",
          4: "项目转让需求表",
          5: "光伏组件/锂电池/铅酸电池回收业务信息表",
        }[item.workOrderType];
      };
    },
    // 设备类型
    deviceTypeName() {
      return (item) => {
        return {
          1: "光伏",
          2: "储能",
          3: "拆冲",
          4: item.otherDevice,
        }[item.deviceType];
      };
    },
  },
  mounted() {
    this.handleSearch();
  },
  methods: {
    handleTabClick(value) {
      this.activeTab = value;
      this.handleSearch();
    },
    downloadFile(file) {
      // 处理文件下载
      window.open(file, "_blank");
    },
    handleAction(action, item) {
      if (action == "detail") {
        // 处理操作按钮点击
        this.$router.push({
          path: "/service-provider-detail",
          query: {
            id: item.id,
          },
        });
      }
    },
    handleCurrentChange(page) {
      this.currentPage = page;
    },
    handleSearch() {
      this.$api({
        url: "myServiceWorkorderList",
        method: "get",
        data: {
          page: this.currentPage,
          pageSize: this.pageSize,
          workorderStatus: this.activeTab,
          ...this.searchForm,
        },
      }).then((res) => {
        if (res.code === 200) {
          this.serviceList = res.data.list;
          this.total = res.data.totalCount;
        }
      });
    },
    handleReset() {
      // 处理重置功能
      this.searchForm = {
        orderNo: "",
        orderType: "",
        deviceType: "",
        deviceLocation: "",
      };
      this.activeTab = "0";
      this.currentPage = 1;
      this.handleSearch();
    },
  },
};
</script>

<style lang="less" scoped src="./service_provider_list.less"></style>
