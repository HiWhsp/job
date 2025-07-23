<template>
  <div class="page">
    <div class="page-header">
      <!-- 搜索项 -->
      <div class="search-form">
        <el-form :model="searchForm" ref="searchForm" :inline="true" size="small">
          <el-form-item label="Order No." prop="workorder_no">
            <el-input
              v-model="searchForm.workorder_no"
              placeholder="Enter order number"
              clearable
              style="width: 200px"
              @change="handleSearch"
            />
          </el-form-item>
          <el-form-item label="Order Type" prop="workOrderType">
            <el-select
              v-model="searchForm.workOrderType"
              placeholder="Select order type"
              clearable
              style="width: 200px"
              @change="handleSearch"
            >
              <!-- 不传或传空获取全部;1售后运维需求表 2项目产品需求表 3项目融资表 4项目转让表 5产品回收利用表 -->
              <el-option label="All" value="" />
              <el-option label="After-sales Service" value="1" />
              <el-option label="Product Requirement" value="2" />
              <el-option label="Project Financing" value="3" />
              <el-option label="Project Transfer" value="4" />
              <el-option label="Product Recycling" value="5" />
            </el-select>
          </el-form-item>
          <el-form-item label="Device Type" prop="deviceType">
            <el-select
              v-model="searchForm.deviceType"
              placeholder="Select device type"
              clearable
              style="width: 200px"
              @change="handleSearch"
            >
              <el-option label="All" value="" />
              <el-option label="Solar" value="1" />
              <el-option label="Energy Storage" value="2" />
              <el-option label="Diesel" value="3" />
              <el-option label="Other" value="4" />
            </el-select>
          </el-form-item>
          <el-form-item style="flex: 1; text-align: right">
            <el-button type="primary" @click="handleSearch">Search</el-button>
            <el-button @click="handleReset">Reset</el-button>
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
              <span
                class="status"
                :class="item.serviceStatus == 3 ? 'status-payment' : 'status-pending'"
                >{{ checkStatus(item.serviceStatus) }}</span
              >
              <div class="service-info">
                <span class="date">{{ item.created_at }}</span>
                <span class="order-info">Order No.: {{ item.workorder_no }}</span>
              </div>
            </div>
            <div class="header-right">
              <span class="pay-amount"
                >Amount: <span class="amount">￥{{ item.payPrice }}</span></span
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
                    <span class="info-label">Device Type:</span>
                    <span class="info-value">{{ deviceTypeName(item) }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Device Location:</span>
                    <span class="info-value">{{ item.deviceAddress }}</span>
                  </div>
                  <div class="download-files">
                    <div class="file-item">
                      <span class="file-type">Service Contract:</span>
                      <img
                        src="@/assets/image/icon/pdf.png"
                        class="file-icon"
                        alt="file"
                      />
                      <span class="file-name">{{ item.serviceOriginContractName }}</span>
                      <a
                        href="#"
                        class="download-link"
                        @click="downloadFile(item.serviceOriginContractUrl_full)"
                        >Download</a
                      >
                    </div>
                  </div>
                </div>
              </div>

              <div class="content-right">
                <div class="action-buttons">
                  <el-button size="small" @click="handleAction('detail', item)">
                    Order Details
                  </el-button>
                  <el-button
                    size="small"
                    @click="handleAction('backContract', item)"
                    v-if="item.serviceStatus == 1"
                  >
                    Return Contract
                  </el-button>
                  <el-button
                    size="small"
                    @click="handleAction('confirm', item)"
                    v-if="item.serviceStatus == 2"
                  >
                    Service Complete
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
                <span class="notice-text"
                  >Please download the service contract, sign and stamp it, then upload it
                  back to the system to confirm the order</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-empty v-if="total == 0" description="No data" />
    <el-pagination
      v-if="total > 0"
      style="margin-top: 20px; text-align: center"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      layout="prev, pager, next"
      @current-change="handleCurrentChange"
    />

    <!-- 回传合同弹框 -->
    <el-dialog
      title="Return Contract"
      :visible.sync="backOpenModalVisible"
      width="400px"
      :close-on-click-modal="false"
    >
      <!-- 一个上传组件, 一个提交 取消按钮 -->
      <el-upload
        class="upload-demo"
        :file-list="backUrl"
        :data="mix_upload_data"
        :name="mix_upload_name"
        :action="mix_upload_action"
        list-type="picture-card"
        :limit="1"
        :on-change="upload_on_success"
        :before-upload="upload_before_upload"
      >
        <i class="el-icon-plus"></i>
      </el-upload>
      <div class="back-open-actions">
        <el-button type="primary" @click="submitBackOpen">Submit</el-button>
        <el-button @click="cancelBackOpen">Cancel</el-button>
      </div>
    </el-dialog>

    <!-- 服务完成弹框 -->
    <el-dialog
      title="Service Complete"
      :visible.sync="paymentModalVisible"
      width="600px"
      :close-on-click-modal="false"
      custom-class="payment-modal"
    >
      <div class="payment-content">
        <!-- 线下支付区域 -->
        <div class="offline-payment-section">
          <div class="upload-section">
            <div class="upload-label">Upload Service Report:</div>
            <div class="upload-area">
              <el-upload
                class="payment-uploader"
                :file-list="paymentUrl"
                :data="mix_upload_data"
                :name="mix_upload_name"
                :action="mix_upload_action"
                :before-upload="upload_before_upload"
                :on-change="handlePaymentVoucherUpload"
              >
                <div class="upload-placeholder">
                  <i class="el-icon-plus"></i>
                </div>
              </el-upload>
              <span>Upload customer-signed service report/on-site repair images</span>
            </div>
          </div>

          <div class="offline-actions">
            <el-button type="primary" @click="submitOfflinePayment">Submit</el-button>
            <el-button @click="cancelPayment">Cancel</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "service-provider-list",
  data() {
    return {
      id: "",
      serviceList: [],
      tabList: [
        { name: "All Orders", value: "" },
        { name: "Pending", value: "1" },
        { name: "In Service", value: "2" },
        { name: "Completed", value: "3" },
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
      backOpenModalVisible: false,
      paymentModalVisible: false,
      backUrl: [],
      paymentUrl: [],
    };
  },
  computed: {
    // 审核状态
    checkStatus() {
      return (status) => {
        return {
          0: "Unassigned",
          1: "Pending",
          2: "In Service",
          3: "Completed",
        }[status];
      };
    },
    // 需求类型
    workOrderName() {
      return (item) => {
        return {
          1: "After-sales Service Request",
          2: "Solar Storage Charging Product Request",
          3: "New Energy Solar Storage Charging Project Investment Request",
          4: "Project Transfer Request",
          5: "Solar Module/Lithium Battery/Lead Acid Battery Recycling Business Information",
        }[item.workOrderType];
      };
    },
    // 设备类型
    deviceTypeName() {
      return (item) => {
        return {
          1: "Solar",
          2: "Energy Storage",
          3: "Diesel",
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
      this.id = item.id;
      if (action == "detail") {
        // 处理操作按钮点击
        this.$router.push({
          path: "/service-provider-detail",
          query: {
            id: item.id,
          },
        });
      }
      if (action == "backContract") {
        this.backOpenModalVisible = true;
      } else if (action == "confirm") {
        this.paymentModalVisible = true;
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
          serviceStatus: this.activeTab,
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

    submitBackOpen() {
      console.log("提交回传", this.backUrl);
      let url = "";
      let originName = "";
      this.backUrl.forEach((item) => {
        url = item.response.data.save_url;
        originName = item.response.data.originName;
      });
      this.$api({
        url: "serviceContract",
        method: "post",
        data: {
          workorderId: this.id,
          url: url,
          name: originName,
        },
      }).then((res) => {
        this.$message.success("Contract uploaded successfully");
        this.backOpenModalVisible = false;
        this.backUrl = [];
        this.handleSearch();
      });
    },
    cancelBackOpen() {
      this.backUrl = [];
      this.backOpenModalVisible = false;
    },

    // 提交线下支付
    submitOfflinePayment() {
      if (this.paymentUrl.length == 0) {
        this.$message.error("Please upload service report");
        return;
      }
      let url = [];
      this.paymentUrl.forEach((item) => {
        url.push(item.response.data.save_url);
      });
      this.$api({
        url: "submitServicePhoto",
        method: "post",
        data: {
          workorderId: this.id,
          servicePhotos: url.join(","),
        },
      }).then((res) => {
        this.$message.success("Service images uploaded successfully");
        this.paymentModalVisible = false;
        this.$api({
          url: "serviceConfirmFinish",
          method: "post",
          data: {
            workorder_id: this.id,
          },
        }).then((res) => {
          // this.$message.success("确认完成");
          this.handleSearch();
        });
        this.handleSearch();
      });
    },

    //
    cancelPayment() {
      this.paymentModalVisible = false;
    },

    // 回传工单成功
    upload_on_success(file, fileList) {
      this.backUrl = fileList;
    },

    // 处理支付凭证上传
    handlePaymentVoucherUpload(file, fileList) {
      this.paymentUrl = fileList;
    },
    upload_before_upload(file) {
      const isLt2M = file.size / 1024 / 1024 < 20;
      return isLt2M;
    },
  },
};
</script>

<style lang="less" scoped src="./service_provider_list.less"></style>
