<template>
  <div class="page">
    <div class="page-header">
      <div class="page-header-title">
        <span>Service Orders</span>
        <span style="margin: 0 10px">></span>
        <span>Order Details</span>
      </div>
    </div>
    <div class="page-ctx">
      <!-- 基本信息 -->
      <div class="basic-info">
        <div class="demand-info">
          <div class="demand-info-left">
            <p class="demand-date">{{ demandInfo.created_at }}</p>
            <i class="col-line"></i>
            <p class="demand-number">Order No.: {{ demandInfo.workorder_no }}</p>
          </div>
          <div class="demand-info-right">
            <el-button v-if="processStatus == 1" @click="backContract">
              <span>Return Contract</span>
            </el-button>
            <el-button v-if="processStatus == 2" @click="showPaymentModal">
              Service Complete
            </el-button>
          </div>
        </div>
        <div class="demand-status">
          <p>
            <!-- 当前状态：<span>{{ workorderStatusName(demandInfo) }}</span> -->
            Current Status: <span>{{ serviceStatus(demandInfo) }}</span>
          </p>
          <p>
            Amount: <span>￥{{ demandInfo.servicePrice }}</span>
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
            <span class="info-value">常规保养</span>
          </div> -->
          <div class="download-files">
            <!-- <div class="file-item">
              <span class="file-type">Download Order:</span>
              <img src="@/assets/image/icon/pdf.png" class="file-icon" alt="file" />
              <span class="file-name">{{ demandInfo.workorderName }}</span>
              <a
                href="#"
                class="download-link"
                @click="downloadFile(demandInfo.workorderUrl_full)"
                >Download</a
              >
            </div> -->
            <div class="file-item" v-if="demandInfo.serviceOriginContractUrl">
              <span class="file-type">Download Contract:</span>
              <img src="@/assets/image/icon/pdf.png" class="file-icon" alt="file" />
              <span class="file-name">{{
                demandInfo.serviceOriginContractName || "--"
              }}</span>
              <a
                href="#"
                class="download-link"
                @click="
                  downloadFile(
                    vuex_config.file_url_pre + demandInfo.serviceOriginContractUrl
                  )
                "
                >Download</a
              >
            </div>
          </div>
        </div>
        <div class="content-bottom">
          <div class="notice">
            <img src="@/assets/image/icon/notice.png" class="notice-icon" alt="notice" />
            <span class="notice-text">
              1. Please confirm the order within 24 hours of receiving it, otherwise the
              order will be automatically cancelled.
            </span>
          </div>
        </div>
      </div>

      <div class="form-content">
        <div class="form-section">
          <div class="form-row">
            <label class="form-label">Customer Name</label>
            <div class="form-input">
              <el-input
                v-model="demandInfo.user_info.nickname"
                placeholder="Customer Name"
                disabled
              />
            </div>
          </div>

          <div class="form-row">
            <label class="form-label">Contact</label>
            <div class="form-input">
              <el-input
                v-model="demandInfo.user_info.mobile"
                placeholder="Contact"
                disabled
              />
            </div>
          </div>
          <div class="form-row">
            <label class="form-label">Device Type</label>
            <div class="form-input">
              <el-radio-group v-model="demandInfo.deviceType" disabled>
                <el-radio :label="1">Solar</el-radio>
                <el-radio :label="2">Energy Storage</el-radio>
                <el-radio :label="3">Diesel</el-radio>
                <el-radio :label="4">Other</el-radio>
              </el-radio-group>
            </div>
          </div>

          <div class="form-row">
            <label class="form-label">Device Specification</label>
            <div class="form-input">
              <el-input
                v-model="demandInfo.deviceGuige"
                placeholder="Device specification details"
                disabled
              />
            </div>
          </div>

          <div class="form-row">
            <label class="form-label">Device Location</label>
            <div class="form-input">
              <el-input
                v-model="demandInfo.deviceAddress"
                placeholder="Detailed location information"
                disabled
              />
            </div>
          </div>

          <div class="form-row">
            <label class="form-label">Fault Description</label>
            <div class="form-input">
              <el-input
                v-model="demandInfo.faultDescription"
                type="textarea"
                :rows="3"
                placeholder="Fault description details"
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
                <div class="upload-image">
                  No {{ demandInfo.workOrderType == 1 ? "Images" : "Attachments" }}
                </div>
              </div>
            </div>
          </div>

          <div class="form-row">
            <label class="form-label">Additional Notes</label>
            <div class="form-input">
              <el-input
                v-model="demandInfo.remark"
                type="textarea"
                :rows="4"
                placeholder="Additional notes"
                disabled
              />
            </div>
          </div>
        </div>
      </div>
      <!-- 服务信息 -->
      <div class="my-info" v-if="[2, 3].includes(processStatus)">
        <h3 class="info-title">Service Information</h3>
        <div class="info-content">
          <div class="info-row">
            <span class="info-label">Service Personnel:</span>
            <span class="info-value">{{ demandInfo.serviceUserName }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Contact:</span>
            <span class="info-value">{{ demandInfo.servicePhone }}</span>
          </div>
          <div class="info-row" v-if="demandInfo.servicePhotos">
            <span class="info-label">Service Images:</span>
            <div class="info-value">
              <img
                :src="item"
                v-for="(item, index) in demandInfo.servicePhotos.split(',')"
                :key="index"
                class="file-icon"
                alt="file"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

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
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: "",
      demandType: "",
      processStatus: 1,
      demandInfo: {
        publishTime: "2021-08-18 13:29",
        contact: "565884455112454",
        statusText: "",
        company: "XXXXXXXX科技有限公司",
        phone: "010-12345678",
        email: "815625979@qq.com",
      },
      processSteps: [
        {
          title: "Pending",
          time: "",
          completed: false,
          active: false,
          id: 1,
        },
        {
          title: "In Service",
          time: "",
          completed: false,
          active: false,
          id: 2,
        },
        {
          title: "Completed",
          time: "",
          completed: false,
          active: false,
          id: 3,
        },
      ],
      paymentUrl: [],
      paymentModalVisible: false,
      backOpenModalVisible: false,
      backUrl: [],
    };
  },
  computed: {
    serviceStatus() {
      return (item) => {
        return {
          0: "Unassigned",
          1: "Pending",
          2: "In Service",
          3: "Completed",
        }[item.serviceStatus];
      };
    },
  },
  mounted() {
    this.id = this.$route.query.id; // 修复参数获取
    this.initDemandInfo();
  },
  methods: {
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
        this.updateProcessStatus(this.demandInfo.serviceStatus);
      });
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

    showPaymentModal() {
      this.paymentModalVisible = true;
    },

    // 处理支付凭证上传
    handlePaymentVoucherUpload(file, fileList) {
      this.paymentUrl = fileList;
    },

    backContract() {
      this.backOpenModalVisible = true;
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
        this.initDemandInfo();
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
          this.initDemandInfo();
        });
        this.initDemandInfo();
      });
    },

    // 取消支付
    cancelPayment() {
      this.paymentModalVisible = false;
    },

    // 回传工单成功
    upload_on_success(file, fileList) {
      this.backUrl = fileList;
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

<style lang="less" scoped src="./service_provider_detail.less"></style>
