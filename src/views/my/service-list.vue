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
              <span
                class="status"
                :class="{
                  'status-pending': item.workorderStatus < 5,
                  'status-payment': item.workorderStatus >= 5,
                }"
                >{{ workorderStatusName(item) }}</span
              >
              <div class="service-info">
                <span class="date">{{ item.created_at }}</span>
                <span class="order-info">工单编号：{{ item.workorder_no }}</span>
                <span class="relation-info"
                  >关联需求表单号：<span class="relation-order">{{
                    item.serialNo
                  }}</span></span
                >
              </div>
            </div>
            <div class="header-right">
              <span class="pay-amount"
                >{{
                  item.payStatus == 0
                    ? "待支付"
                    : item.payStatus == 2
                    ? "已支付"
                    : "待确认"
                }}：<span class="amount"
                  >￥{{
                    item.payStatus == 0
                      ? item.originPrice
                      : item.payStatus == 2
                      ? item.payPrice
                      : item.originPrice
                  }}</span
                ></span
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
                      <span class="file-type">下载工单：</span>
                      <img
                        src="@/assets/image/icon/pdf.png"
                        class="file-icon"
                        alt="file"
                      />
                      <span class="file-name">{{ item.workorderName }}</span>
                      <a
                        href="#"
                        class="download-link"
                        @click="downloadFile(item.workorderUrl)"
                        >下载</a
                      >
                    </div>
                    <div class="file-item">
                      <span class="file-type">下载合同：</span>
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
                    @click="handleAction('backWorkorder', item)"
                    v-if="item.workorderStatus == 1"
                  >
                    回传工单
                  </el-button>
                  <el-button
                    size="small"
                    @click="handleAction('backContract', item)"
                    v-if="item.workorderStatus == 1"
                  >
                    回传合同
                  </el-button>
                  <el-button
                    size="small"
                    @click="handleAction('pay', item)"
                    v-if="item.workorderStatus == 2"
                  >
                    去支付
                  </el-button>
                  <el-button
                    size="small"
                    @click="handleAction('confirm', item)"
                    v-if="item.workorderStatus == 4"
                  >
                    确认完成
                  </el-button>
                </div>
              </div>
            </div>
            <div class="content-bottom" v-if="item.workorderStatus == 1">
              <div class="notice">
                <img
                  src="@/assets/image/icon/notice.png"
                  class="notice-icon"
                  alt="notice"
                />
                <span class="notice-text"
                  >请下载工单、合同后签字盖章回传系统确认工单</span
                >
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
      serviceList: [],
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
      window.open(file, "_blank");
    },
    handleAction(action, item) {
      // 处理操作按钮点击
      console.log("执行操作:", action.name, item);
      if (action == "detail") {
        this.$router.push({
          path: "service-detail",
          query: {
            id: item.id,
          },
        });
      }
    },
    handleCurrentChange(page) {
      this.currentPage = page;
    },
  },
};
</script>

<style lang="less" scoped src="./service-list.less"></style>
