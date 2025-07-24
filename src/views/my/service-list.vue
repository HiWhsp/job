<template>
  <div class="page">
    <div class="page-header">
      <div class="page-header-title">
        <span>Work Order Management</span>
      </div>
      <div class="search-box">
        <el-input v-model="keyword" placeholder="Enter keyword" />
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
                <span class="order-info">Work No.: {{ item.workorder_no }}</span>
                <span class="relation-info"
                  >Demand No.:
                  <span class="relation-order">{{
                    item.user_require ? item.user_require.serialNo : ""
                  }}</span></span
                >
              </div>
            </div>
            <div class="header-right">
              <span class="pay-amount"
                >{{
                  item.payStatus == 0
                    ? "Payment"
                    : item.payStatus == 2
                    ? "Paid"
                    : "Confirmation"
                }}:
                <span class="amount"
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
                <h4 class="service-title">{{ workOrderName(item) || "--" }}</h4>
                <div class="service-info">
                  <div class="info-item">
                    <span class="info-label">Device Type:</span>
                    <span class="info-value">{{ deviceTypeName(item) || "--" }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Device Location:</span>
                    <span class="info-value">{{ item.deviceAddress || "--" }}</span>
                  </div>
                  <div class="download-files">
                    <div class="file-item" v-if="item.workorderUrl_full">
                      <span class="file-type">Download Work Order:</span>
                      <img
                        src="@/assets/image/icon/pdf.png"
                        class="file-icon"
                        alt="file"
                      />
                      <span class="file-name">{{ item.workorderName || "--" }}</span>
                      <a
                        href="#"
                        class="download-link"
                        @click="downloadFile(item.workorderUrl_full)"
                        >Download</a
                      >
                    </div>
                    <div class="file-item" v-else>
                      <span class="file-type">Download Work Order:</span>
                      <span class="file-name">Not Uploaded</span>
                    </div>
                    <div class="file-item" v-if="item.contractUrl_full">
                      <span class="file-type">Download Contract:</span>
                      <img
                        src="@/assets/image/icon/pdf.png"
                        class="file-icon"
                        alt="file"
                      />
                      <span class="file-name">{{ item.contractName || "--" }}</span>
                      <a
                        href="#"
                        class="download-link"
                        @click="downloadFile(item.contractUrl_full)"
                        >Download</a
                      >
                    </div>
                    <div class="file-item" v-else>
                      <span class="file-type">Download Contract:</span>
                      <span class="file-name">Not Uploaded</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="content-right">
                <div class="action-buttons">
                  <el-button size="small" @click="handleAction('detail', item)">
                    Work Order Details
                  </el-button>
                  <el-button
                    size="small"
                    @click="handleAction('backWorkorder', item)"
                    v-if="item.workorderStatus == 1"
                  >
                    Upload Work Order
                  </el-button>
                  <el-button
                    size="small"
                    @click="handleAction('backContract', item)"
                    v-if="item.workorderStatus == 1"
                  >
                    Upload Contract
                  </el-button>
                  <el-button
                    size="small"
                    @click="handleAction('pay', item)"
                    v-if="item.workorderStatus == 2"
                  >
                    Go to Payment
                  </el-button>
                  <el-button
                    size="small"
                    @click="handleAction('confirm', item)"
                    v-if="item.workorderStatus == 5"
                  >
                    Confirm Completion
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
                  >Download the work order and contract, sign and stamp them, and send
                  them back to the system for confirmation</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
      <el-empty v-if="total == 0" description="No Data" />
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

    <!-- 回传工单弹框 -->
    <el-dialog
      :title="backOpenTitle"
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

    <!-- 支付方式弹框 -->
    <el-dialog
      title="Select Payment Method"
      :visible.sync="paymentModalVisible"
      width="600px"
      :close-on-click-modal="false"
      custom-class="payment-modal"
    >
      <div class="payment-content">
        <div class="payment-methods">
          <div
            class="payment-method alipay"
            :class="{ active: selectedPayment === 'alipay' }"
            @click="selectPayment('alipay')"
          ></div>

          <!-- <div
            class="payment-method wechat"
            :class="{ active: selectedPayment === 'wechat' }"
            @click="selectPayment('wechat')"
          ></div> -->

          <div
            class="payment-method offline"
            :class="{ active: selectedPayment === 'offline' }"
            @click="selectPayment('offline')"
          >
            Offline Payment
          </div>
        </div>

        <!-- 二维码区域 -->
        <div
          class="qrcode-section"
          v-if="selectedPayment && selectedPayment !== 'offline'"
        >
          <div class="qrcode-container">
            <!-- 二维码占位区域 -->
            <div class="qrcode-placeholder"></div>
          </div>
          <div class="qrcode-tips">
            <p>
              Please use {{ selectedPayment === "alipay" ? "Alipay" : "WeChat" }} to scan
            </p>
            <p>QR code to pay</p>
          </div>
        </div>

        <!-- 线下支付区域 -->
        <div class="offline-payment-section" v-if="selectedPayment === 'offline'">
          <div class="bank-info">
            <div class="info-item">
              <span class="info-label">Payee Name:</span>
              <span class="info-value">{{ offlinePaymentInfo.pay_company_name }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Account Number:</span>
              <span class="info-value">{{ offlinePaymentInfo.pay_account }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Bank Name:</span>
              <span class="info-value">{{ offlinePaymentInfo.pay_bank_name }}</span>
            </div>
          </div>

          <div class="upload-section">
            <div class="upload-label">Upload Payment Proof:</div>
            <div class="upload-area">
              <el-upload
                class="payment-uploader"
                :data="mix_upload_data"
                :name="mix_upload_name"
                :action="mix_upload_action"
                list-type="picture-card"
                :limit="1"
                :file-list="paymentUrl"
                :on-change="upload_on_payment_success"
                :before-upload="upload_before_upload"
              >
                <div class="upload-placeholder">
                  <i class="el-icon-plus"></i>
                </div>
              </el-upload>
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
  data() {
    return {
      backOpenTitle: "",
      backOpenModalVisible: false,
      backUrl: [],
      backOpenType: "",
      paymentModalVisible: false,
      selectedPayment: "alipay",
      paymentUrl: [],
      offlinePaymentInfo: {},
      id: "",
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
    // 回传工单
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
    // 处理操作按钮点击
    handleAction(action, item) {
      // 处理操作按钮点击
      console.log("执行操作:", action.name, item);
      this.id = item.id;
      if (action == "detail") {
        this.$router.push({
          path: "service-detail",
          query: {
            id: item.id,
          },
        });
      } else if (action == "backWorkorder") {
        this.backOpenTitle = "Upload Work Order";
        this.backOpenModalVisible = true;
        this.backOpenType = "1";
      } else if (action == "backContract") {
        this.backOpenTitle = "Upload Contract";
        this.backOpenModalVisible = true;
        this.backOpenType = "2";
      } else if (action == "pay") {
        this.paymentModalVisible = true;
        this.selectedPayment = "alipay";
        this.$api({
          url: "orderPay",
          method: "post",
          data: {
            type: 1,
            order_id: item.id,
          },
        }).then((res) => {
          console.log(res);
        });
      } else if (action == "confirm") {
        this.$confirm("Confirm service completion?", "Confirmation", {
          confirmButtonText: "Confirm",
          cancelButtonText: "Cancel",
          type: "warning",
        }).then(() => {
          this.$api({
            url: "userConfirmFinish",
            method: "post",
            data: {
              workorder_id: item.id,
            },
          }).then((res) => {
            this.$message.success("Confirmed completion");
            this.getServiceList();
          });
        });
      }
    },
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getServiceList();
    },

    // 回传工单
    submitBackOpen() {
      console.log("提交回传", this.backUrl);
      let url = "";
      let originName = "";
      this.backUrl.forEach((item) => {
        url = item.response.data.save_url;
        originName = item.response.data.originName;
      });
      this.$api({
        url: "backWorkorder",
        method: "post",
        data: {
          workorderId: this.id,
          type: this.backOpenType,
          url: url,
          name: originName,
        },
      }).then((res) => {
        this.$message.success("Upload successful");
        this.backOpenModalVisible = false;
        this.backUrl = [];
        this.getServiceList();
      });
    },
    // 取消回传
    cancelBackOpen() {
      this.backUrl = [];
      this.backOpenTitle = "";
      this.backOpenModalVisible = false;
    },

    // 选择支付方式
    selectPayment(paymentMethod) {
      this.selectedPayment = paymentMethod;
      if (paymentMethod === "offline") {
        this.$api({
          url: "offPaySetting",
          method: "get",
        }).then((res) => {
          this.offlinePaymentInfo = res.data;
        });
      }
    },

    // 提交线下支付
    submitOfflinePayment() {
      console.log("提交线下支付");
      let url = "";
      let originName = "";
      this.paymentUrl.forEach((item) => {
        url = item.response.data.save_url;
        originName = item.originName;
      });
      this.$api({
        url: "uploadPayProve",
        method: "post",
        data: {
          workorderId: this.id,
          payProve: url,
        },
      }).then((res) => {
        this.$message.success("Submitted successfully");
        this.paymentModalVisible = false;
        this.paymentUrl = [];
        this.initDemandInfo();
      });
    },

    upload_on_payment_success(file, fileList) {
      this.paymentUrl = fileList;
    },

    // 取消支付
    cancelPayment() {
      this.paymentModalVisible = false;
      this.selectedPayment = "alipay";
    },

    // 回传工单成功
    upload_on_success(file, fileList) {
      this.backUrl = fileList;
    },
    upload_before_upload(file) {
      const isLt2M = file.size / 1024 / 1024 < 20;
      return isLt2M;
    },
  },
};
</script>

<style lang="less" scoped src="./service-list.less"></style>
