<template>
  <div class="page">
    <div class="page-header">
      <div class="page-header-title">
        <span>工单管理</span>
      </div>
      <div class="search-box">
        <el-input v-model="keyword" placeholder="输入关键字" />
        <el-button type="primary">
          <i class="el-icon-search"></i>
        </el-button>
      </div>
    </div>
    <div class="page-ctx">
      <!-- 工单列表 -->
      <div class="service-list" v-if="total > 0">
        <div v-for="item in serviceList" :key="item.id" class="service-item">
          <!-- 头部信息 -->
          <div class="service-header">
            <div class="header-left">
              <span class="status" :class="item.statusClass">{{ item.status }}</span>
              <div class="service-info">
                <span class="date">{{ item.date }}</span>
                <span class="order-info">工单编号：{{ item.orderNo }}</span>
                <span class="relation-info"
                  >关联需求表单号：<span class="relation-order">{{
                    item.relationNo
                  }}</span></span
                >
              </div>
            </div>
            <div class="header-right">
              <span class="pay-amount"
                >待支付：<span class="amount">￥{{ item.payAmount }}</span></span
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
                    <div v-for="file in item.files" :key="file.name" class="file-item">
                      <span class="file-type">{{ file.type }}：</span>
                      <img
                        src="@/assets/image/icon/pdf.png"
                        class="file-icon"
                        alt="file"
                      />
                      <span class="file-name">{{ file.name }}</span>
                      <a href="#" class="download-link" @click="downloadFile(file)"
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
      <el-empty v-if="total == 0" description="暂无数据" />
    </div>
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
      currentPage: 1,
      pageSize: 10,
      total: 0,
    };
  },
  mounted() {
    this.getServiceList();
  },
  methods: {
    getServiceList() {
      this.$api({
        url: "myFormalWorkorderList",
        method: "get",
        data: {
          page: this.currentPage,
          pageSize: this.pageSize,
          keyword: this.keyword,
        },
      }).then((res) => {
        this.serviceList = res.data.list;
        this.total = res.data.totalCount;
      });
    },
    downloadFile(file) {
      // 处理文件下载
      console.log("下载文件:", file);
    },
    handleAction(action, item) {
      // 处理操作按钮点击
      console.log("执行操作:", action.name, item);
    },
    handleCurrentChange(page) {
      this.currentPage = page;
    },
  },
};
</script>

<style lang="less" scoped src="./service-list.less"></style>
