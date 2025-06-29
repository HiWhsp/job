<template>
  <div class="page">
    <div class="page-header">
      <!-- 搜索项 -->
      <div class="search-form">
        <el-form
          :model="searchForm"
          ref="searchForm"
          :inline="true"
          size="small"
        >
          <el-form-item label="工单编号" prop="orderNo">
            <el-input
              v-model="searchForm.orderNo"
              placeholder="请输入工单编号"
              clearable
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="工单类型" prop="orderType">
            <el-select
              v-model="searchForm.orderType"
              placeholder="请选择工单类型"
              clearable
              style="width: 200px"
            >
              <el-option label="全部" value="" />
              <el-option label="售后运维" value="maintenance" />
              <el-option label="安装调试" value="installation" />
              <el-option label="技术支持" value="support" />
            </el-select>
          </el-form-item>
          <el-form-item label="设备类型" prop="deviceType">
            <el-select
              v-model="searchForm.deviceType"
              placeholder="请选择设备类型"
              clearable
              style="width: 200px"
            >
              <el-option label="全部" value="" />
              <el-option label="光伏" value="solar" />
              <el-option label="风电" value="wind" />
              <el-option label="储能" value="storage" />
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
                item.status
              }}</span>
              <div class="service-info">
                <span class="date">{{ item.date }}</span>
                <span class="order-info">工单编号：{{ item.orderNo }}</span>
                <!-- <span class="relation-info"
                  >关联需求表单号：<span class="relation-order">{{
                    item.relationNo
                  }}</span></span
                > -->
              </div>
            </div>
            <div class="header-right">
              <span class="pay-amount"
                >待支付：<span class="amount"
                  >￥{{ item.payAmount }}</span
                ></span
              >
            </div>
          </div>

          <!-- 内容区域 -->
          <div class="service-content">
            <div class="content-top">
              <div class="content-left">
                <h4 class="service-title">{{ item.title }}</h4>
                <div class="service-info">
                  <div class="info-item">
                    <span class="info-label">设备类型：</span>
                    <span class="info-value">{{ item.deviceType }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">设备位置：</span>
                    <span class="info-value">{{ item.deviceLocation }}</span>
                  </div>
                  <div class="download-files">
                    <div
                      v-for="file in item.files"
                      :key="file.name"
                      class="file-item"
                    >
                      <span class="file-type">{{ file.type }}：</span>
                      <img
                        src="@/assets/image/icon/pdf.png"
                        class="file-icon"
                        alt="file"
                      />
                      <span class="file-name">{{ file.name }}</span>
                      <a
                        href="#"
                        class="download-link"
                        @click="downloadFile(file)"
                        >下载</a
                      >
                    </div>
                  </div>
                </div>
              </div>

              <div class="content-right">
                <div class="action-buttons">
                  <el-button
                    v-for="action in item.actions"
                    :key="action.name"
                    size="small"
                    @click="handleAction(action, item)"
                  >
                    {{ action.name }}
                  </el-button>
                </div>
              </div>
            </div>
            <div class="content-bottom">
              <div class="notice">
                <img
                  src="@/assets/image/icon/notice.png"
                  class="notice-icon"
                  alt="notice"
                />
                <span class="notice-text">{{ item.notice }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-pagination
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
      keyword: "",
      serviceList: [
        {
          id: 1,
          status: "待工单输入",
          statusClass: "status-pending",
          date: "2021-08-18 13:29",
          orderNo: "565884455112454",
          relationNo: "256555441255445",
          payAmount: "19999.90",
          title: "售后运维服务工单",
          deviceType: "光伏",
          deviceLocation: "设备位置详细信息设备位置详细信息设备位置详细信息",
          files: [
            { type: "下载工单", name: "XXXX工单.pdf" },
            { type: "下载合同", name: "XXXX合同.pdf" },
          ],
          notice: "请下载工单、合同后签字盖章传给系统认证工单",
          actions: [
            { name: "工单详情", type: "default" },
            { name: "回传工单", type: "primary" },
            { name: "回传合同", type: "primary" },
          ],
        },
        {
          id: 2,
          status: "待付款",
          statusClass: "status-payment",
          date: "2021-08-18 13:29",
          orderNo: "565884455112454",
          relationNo: "256555441255445",
          payAmount: "19999.90",
          title: "售后运维服务工单",
          deviceType: "光伏",
          deviceLocation: "设备位置详细信息设备位置详细信息设备位置详细信息",
          files: [
            { type: "我的工单", name: "XXXX工单.pdf" },
            { type: "我的合同", name: "XXXX合同.pdf" },
          ],
          actions: [
            { name: "工单详情", type: "default" },
            { name: "去支付", type: "danger" },
          ],
        },
      ],
      tabList: [
        { name: "全部工单", value: "0" },
        { name: "待确认", value: "1" },
        { name: "服务中", value: "2" },
        { name: "已完成", value: "3" },
      ],
      activeTab: "0",
      currentPage: 1,
      pageSize: 10,
      total: 100,
      searchForm: {
        orderNo: "",
        orderType: "",
        deviceType: "",
        deviceLocation: "",
      },
    };
  },
  methods: {
    handleTabClick(value) {
      this.activeTab = value;
    },
    downloadFile(file) {
      // 处理文件下载
      console.log("下载文件:", file);
    },
    handleAction(action, item) {
      // 处理操作按钮点击
      console.log("执行操作:", action.name, item);
      this.$router.push({
        name: "service-provider-detail",
        params: {
          id: item.id,
        },
      });
    },
    handleCurrentChange(page) {
      this.currentPage = page;
    },
    handleSearch() {
      // 处理搜索功能
      console.log("搜索条件:", this.searchForm);
    },
    handleReset() {
      // 处理重置功能
      this.searchForm = {
        orderNo: "",
        orderType: "",
        deviceType: "",
        deviceLocation: "",
      };
    },
  },
};
</script>

<style lang="less" scoped src="./service_provider_list.less"></style>
