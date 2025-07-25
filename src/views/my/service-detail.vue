<template>
  <div class="page">
    <div class="page-header">
      <div class="page-header-title">
        <span>Work Order Management</span>
        <span style="margin: 0 10px">></span>
        <span>Work Order Details</span>
      </div>
    </div>
    <div class="page-ctx">
      <!-- 基本信息 -->
      <div class="basic-info">
        <div class="demand-info">
          <div class="demand-info-left">
            <p class="demand-date">Work No.: {{ demandInfo.workorder_no }}</p>
            <i class="col-line"></i>
            <p class="demand-number">
              Demand Order:
              {{ demandInfo.user_require ? demandInfo.user_require.serialNo : "" }}
            </p>
          </div>
          <div class="demand-info-right">
            <el-button v-if="processStatus === 1" @click="backOpen(1)">
              <span>Work Order</span>
            </el-button>
            <el-button v-if="processStatus === 1" @click="backOpen(2)">
              <span>Contract</span>
            </el-button>
            <el-button v-if="processStatus === 2" @click="showPaymentModal">
              Payment
            </el-button>
            <el-button v-if="processStatus === 5" @click="confirmFinish">
              Confirm
            </el-button>
          </div>
        </div>
        <div class="demand-status">
          <p>
            Current Status: <span>{{ workorderStatusName(demandInfo) }}</span>
          </p>
          <p>
            {{
              demandInfo.payStatus == 0
                ? "Pending Payment"
                : demandInfo.payStatus == 2
                ? "Paid"
                : "Pending Confirmation"
            }}:
            <span
              >￥{{
                demandInfo.payStatus == 0
                  ? demandInfo.originPrice
                  : demandInfo.payStatus == 2
                  ? demandInfo.payPrice
                  : demandInfo.originPrice
              }}</span
            >
          </p>
        </div>
        <!-- 流程 -->
        <div class="demand-process">
          <div class="process-container">
            <div
              v-for="(step, index) in processSteps"
              :key="index"
              class="process-step"
              :class="{ active: step.active }"
            >
              <div class="step-content">
                <div class="step-title">{{ step.title }}</div>
                <div class="step-time">{{ step.time }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="service-content">
        <h4 class="service-title">Title: {{ workOrderName(demandInfo) }}</h4>
        <div class="service-info">
          <!-- <div class="info-item">
            <span class="info-label">工单类型：</span>
            <span class="info-value">{{ workOrderName(demandInfo) }}</span>
          </div> -->
          <div class="download-files">
            <div class="file-item" v-if="demandInfo.workorderUrl_full">
              <span class="file-type">Download Work Order:</span>
              <img src="@/assets/image/icon/pdf.png" class="file-icon" alt="file" />
              <span class="file-name">{{ demandInfo.workorderName || "--" }}</span>
              <a
                href="#"
                class="download-link"
                @click="downloadFile(demandInfo.workorderUrl_full)"
                >Download</a
              >
            </div>
            <div class="file-item" v-else>
              <span class="file-type">Download Work Order:</span>
              <span class="file-name">Not Uploaded</span>
            </div>
            <div class="file-item" v-if="demandInfo.contractUrl_full">
              <span class="file-type">Download Contract:</span>
              <img src="@/assets/image/icon/pdf.png" class="file-icon" alt="file" />
              <span class="file-name">{{ demandInfo.contractName || "--" }}</span>
              <a
                href="#"
                class="download-link"
                @click="downloadFile(demandInfo.contractUrl_full)"
                >Download</a
              >
            </div>
            <div class="file-item" v-else>
              <span class="file-type">Download Contract:</span>
              <span class="file-name">Not Uploaded</span>
            </div>
          </div>
        </div>
        <div class="content-bottom">
          <div class="notice">
            <img src="@/assets/image/icon/notice.png" class="notice-icon" alt="notice" />
            <span class="notice-text">
              1. Download the work order and contract, sign and stamp them, and send them
              back to the system for confirmation
            </span>
          </div>
        </div>
      </div>

      <!-- 我的信息 -->
      <div class="my-info">
        <h3 class="info-title">Basic Information</h3>
        <div class="info-content">
          <div class="info-row">
            <span class="info-label">Person:</span>
            <span class="info-value">{{ demandInfo.contactPerson }}</span>
            <span class="info-label">Creator:</span>
            <span class="info-value">Not Available</span>
          </div>
          <div class="info-row">
            <span class="info-label">Phone:</span>
            <span class="info-value">{{ demandInfo.contact }}</span>
            <!-- <span class="info-label">工单分类：</span>
            <span class="info-value">{{ demandInfo.email }}</span> -->
          </div>
          <div class="info-row">
            <span class="info-label">Name:</span>
            <span class="info-value">{{ demandInfo.companyName }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Email:</span>
            <span class="info-value">{{ demandInfo.email }}</span>
          </div>
        </div>
      </div>
      <div class="form-content">
        <div class="form-section">
          <div class="form-row">
            <label class="form-label">Device Type</label>
            <div class="form-input">
              <el-radio-group v-model="demandInfo.deviceType" disabled>
                <el-radio :label="1">Photovoltaic</el-radio>
                <el-radio :label="2">Energy Storage</el-radio>
                <el-radio :label="3">Charging Station</el-radio>
                <el-radio :label="4">Other</el-radio>
              </el-radio-group>
            </div>
          </div>

          <div class="form-row">
            <label class="form-label">Specification</label>
            <div class="form-input">
              <el-input
                v-model="demandInfo.deviceGuige"
                placeholder="Completed content specification name"
                disabled
              />
            </div>
          </div>

          <div class="form-row">
            <label class="form-label">Location</label>
            <div class="form-input">
              <el-input
                v-model="demandInfo.deviceAddress"
                placeholder="Completed content detailed location information"
                disabled
              />
            </div>
          </div>

          <div class="form-row">
            <label class="form-label">Description</label>
            <div class="form-input">
              <el-input
                v-model="demandInfo.faultDescription"
                type="textarea"
                :rows="3"
                placeholder="Completed content fault description"
                disabled
              />
            </div>
          </div>

          <div class="form-row">
            <label class="form-label">{{
              demandInfo.workOrderType == 1 ? "Images" : "Attachments"
            }}</label>
            <div class="form-input">
              <div class="upload-images" v-if="demandInfo.workOrderType == 1">
                <div
                  class="upload-image"
                  v-for="(item, index) in demandInfo.photos_full"
                  :key="index"
                >
                  <img :src="item" alt="" />
                </div>
              </div>
              <div class="upload-images" v-else>
                <div
                  class="upload-image"
                  v-for="(item, index) in demandInfo.attach_full"
                  :key="index"
                >
                  <img :src="item" alt="" />
                </div>
              </div>
            </div>
          </div>

          <div class="form-row">
            <label class="form-label">Notes</label>
            <div class="form-input">
              <el-input
                v-model="demandInfo.remark"
                type="textarea"
                :rows="4"
                placeholder="Completed content additional notes"
                disabled
              />
            </div>
          </div>
        </div>
      </div>
      <!-- 服务信息 -->
      <div class="my-info" v-if="[4, 5, 6].includes(processStatus)">
        <h3 class="info-title">Service Information</h3>
        <div class="info-content">
          <div class="info-row">
            <span class="info-label">Service Person:</span>
            <span class="info-value">{{ demandInfo.serviceUserName }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Contact Info:</span>
            <span class="info-value">{{ demandInfo.servicePhone }}</span>
          </div>
          <div class="info-row" v-if="[5, 6].includes(processStatus)">
            <span class="info-label">Service Images:</span>
            <span class="info-value">
              <img
                :src="vuex_config.file_url_pre + item"
                v-for="(item, index) in demandInfo.servicePhotos.split(',')"
                :key="index"
                class="file-icon"
                alt="file"
              />
            </span>
          </div>
        </div>
      </div>
    </div>

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
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: "",
      demandType: "",
      processStatus: 1,
      demandInfo: {},
      processSteps: [
        {
          title: "Work Order Confirm",
          time: "",
          completed: false,
          active: false,
          id: 1,
        },
        {
          title: "Pending Payment",
          time: "",
          completed: false,
          active: false,
          id: 2,
        },
        {
          title: "Paid",
          time: "",
          completed: false,
          active: false,
          id: 3,
        },
        {
          title: "Service Staff Assigned",
          time: "",
          completed: false,
          active: false,
          id: 4,
        },
        {
          title: "Service Completed",
          time: "",
          completed: false,
          active: false,
          id: 5,
        },
        {
          title: "Service Confirmed",
          time: "",
          completed: false,
          active: false,
          id: 6,
        },
      ],
      paymentUrl: [],
      paymentModalVisible: false,
      selectedPayment: "alipay",
      backOpenType: 1,
      backOpenTitle: "",
      backOpenModalVisible: false,
      backUrl: [],
      offlinePaymentInfo: {},
    };
  },
  mounted() {
    this.id = this.$route.query.id; // 修复参数获取
    this.initDemandInfo();
  },
  methods: {
    // 初始化工单信息
    initDemandInfo() {
      this.$api({
        url: "workorderDetail",
        method: "post",
        data: {
          id: this.id,
        },
      }).then((res) => {
        this.demandInfo = {
          ...res.data,
          photosJson: res.data.photosJson || [],
          attachJson: res.data.attachJson || [],
        };
        this.updateProcessStatus(this.demandInfo.workorderStatus);
      });
    },

    // 回传工单
    backOpen(type) {
      this.backOpenType = type;
      this.backOpenTitle = type == 1 ? "Upload Work Order" : "Upload Contract";
      this.backOpenModalVisible = true;
    },

    // 回传工单成功
    upload_on_success(file, fileList) {
      this.backUrl = fileList;
    },

    upload_on_payment_success(file, fileList) {
      this.paymentUrl = fileList;
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
        this.initDemandInfo();
      });
    },
    cancelBackOpen() {
      this.backUrl = [];
      this.backOpenTitle = "";
      this.backOpenModalVisible = false;
    },

    // 更新流程状态
    updateProcessStatus(currentStep) {
      this.processStatus = currentStep;
      this.processSteps.forEach((step, index) => {
        if (step.id < currentStep) {
          step.active = true;
          // 为已完成的步骤添加时间（示例时间）
          if (index === 0) step.time = this.demandInfo["status0_time"];
          if (index === 1) step.time = this.demandInfo["status1_time"];
          if (index === 2) step.time = this.demandInfo["status2_time"];
          if (index === 3) step.time = this.demandInfo["status3_time"];
          if (index === 4) step.time = this.demandInfo["status4_time"];
          if (index === 5) step.time = this.demandInfo["status5_time"];
          if (index === 6) step.time = this.demandInfo["status6_time"];
        } else if (step.id === currentStep) {
          step.active = true; // 当前步骤也标记为已完成
          // 为当前步骤添加时间
          if (index === 0) step.time = this.demandInfo["status0_time"];
          if (index === 1) step.time = this.demandInfo["status1_time"];
          if (index === 2) step.time = this.demandInfo["status2_time"];
          if (index === 3) step.time = this.demandInfo["status3_time"];
          if (index === 4) step.time = this.demandInfo["status4_time"];
          if (index === 5) step.time = this.demandInfo["status5_time"];
          if (index === 6) step.time = this.demandInfo["status6_time"];
        } else {
          step.active = false;
          step.time = ""; // 未来步骤不显示时间
        }
      });
    },

    // 处理文件上传
    handleAvatarSuccess(file, fileList) {
      console.log("文件上传:", file);
      // 这里可以处理文件上传逻辑
    },

    // 显示支付方式弹框
    showPaymentModal() {
      this.paymentModalVisible = true;
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

    // 取消支付
    cancelPayment() {
      this.paymentModalVisible = false;
      this.selectedPayment = "alipay";
    },
    confirmFinish() {
      this.$confirm("Confirm service completion?", "Confirmation", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        type: "warning",
      }).then(() => {
        this.$api({
          url: "userConfirmFinish",
          method: "post",
          data: {
            workorder_id: this.id,
          },
        }).then((res) => {
          this.$message.success("Confirmed completion");
        });
      });
    },

    downloadFile(file) {
      // 处理文件下载
      console.log("下载文件:", file);
      window.open(file, "_blank");
    },
    upload_before_upload(file) {
      const isLt2M = file.size / 1024 / 1024 < 20;
      return isLt2M;
    },
  },
};
</script>

<style lang="less" scoped src="./service-detail.less"></style>
