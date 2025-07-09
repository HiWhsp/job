<template>
  <div class="page">
    <div class="page-header">
      <div class="page-header-title">
        <span>服务工单</span>
        <span style="margin: 0 10px">></span>
        <span>工单详情</span>
      </div>
    </div>
    <div class="page-ctx">
      <!-- 基本信息 -->
      <div class="basic-info">
        <div class="demand-info">
          <div class="demand-info-left">
            <p class="demand-date">{{ demandInfo.created_at }}</p>
            <i class="col-line"></i>
            <p class="demand-number">工单编号：{{ demandInfo.workorder_no }}</p>
          </div>
          <div class="demand-info-right">
            <el-button v-if="processStatus == 1">
              <span>回传合同</span>
            </el-button>
            <el-button v-if="processStatus == 4" @click="showPaymentModal">
              服务完成
            </el-button>
            <!-- <el-button v-if="processStatus == 5" @click="confirmFinish">
              确认完成
            </el-button> -->
          </div>
        </div>
        <div class="demand-status">
          <p>
            当前状态：<span>{{ workorderStatusName(demandInfo) }}</span>
          </p>
          <p>
            金额：<span>￥{{ demandInfo.originPrice }}</span>
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
        <h4 class="service-title">标题：{{ workOrderName(demandInfo) }}</h4>
        <div class="service-info">
          <!-- <div class="info-item">
            <span class="info-label">工单类型：</span>
            <span class="info-value">常规保养</span>
          </div> -->
          <div class="download-files">
            <div class="file-item">
              <span class="file-type">下载工单：</span>
              <img src="@/assets/image/icon/pdf.png" class="file-icon" alt="file" />
              <span class="file-name">{{ demandInfo.workorderName }}</span>
              <a
                href="#"
                class="download-link"
                @click="downloadFile(demandInfo.workorderUrl_full)"
                >下载</a
              >
            </div>
            <div class="file-item">
              <span class="file-type">下载合同：</span>
              <img src="@/assets/image/icon/pdf.png" class="file-icon" alt="file" />
              <span class="file-name">{{ demandInfo.contractName }}</span>
              <a
                href="#"
                class="download-link"
                @click="downloadFile(demandInfo.contractUrl_full)"
                >下载</a
              >
            </div>
          </div>
        </div>
        <div class="content-bottom">
          <div class="notice">
            <img src="@/assets/image/icon/notice.png" class="notice-icon" alt="notice" />
            <span class="notice-text">
              1. 请在收到工单后24小时内确认工单，否则将自动取消工单。
            </span>
          </div>
        </div>
      </div>

      <div class="form-content">
        <div class="form-section">
          <div class="form-row">
            <label class="form-label">设备类型</label>
            <div class="form-input">
              <el-radio-group v-model="demandInfo.deviceType" disabled>
                <el-radio :label="1">光伏</el-radio>
                <el-radio :label="2">储能</el-radio>
                <el-radio :label="3">采发</el-radio>
                <el-radio :label="4">其他</el-radio>
              </el-radio-group>
            </div>
          </div>

          <div class="form-row">
            <label class="form-label">设备规格</label>
            <div class="form-input">
              <el-input
                v-model="demandInfo.deviceGuige"
                placeholder="完善后的内容规格名称规格名称规格名称"
                disabled
              />
            </div>
          </div>

          <div class="form-row">
            <label class="form-label">设备位置</label>
            <div class="form-input">
              <el-input
                v-model="demandInfo.deviceAddress"
                placeholder="完善后的内容详细位置信息详细位置信息详细位置信息"
                disabled
              />
            </div>
          </div>

          <div class="form-row">
            <label class="form-label">故障现象</label>
            <div class="form-input">
              <el-input
                v-model="demandInfo.faultDescription"
                type="textarea"
                :rows="3"
                placeholder="完善后的内容故障现象描述文案故障现象描述文案"
                disabled
              />
            </div>
          </div>

          <div class="form-row">
            <label class="form-label">{{
              demandInfo.workorderStatus == 1 ? "图片" : "附件"
            }}</label>
            <div class="form-input">
              <div class="upload-images" v-if="demandInfo.workorderStatus == 1">
                <div
                  class="upload-image"
                  v-for="(item, index) in demandInfo.photosJson"
                  :key="index"
                >
                  <img :src="item.url" alt="" />
                </div>
              </div>
              <div class="upload-images" v-else>
                <div
                  class="upload-image"
                  v-for="(item, index) in demandInfo.attachJson"
                  :key="index"
                >
                  <img :src="item.url" alt="" />
                </div>
                <div class="upload-image">
                  暂无{{ demandInfo.workorderStatus == 1 ? "图片" : "附件" }}
                </div>
              </div>
            </div>
          </div>

          <div class="form-row">
            <label class="form-label">补充说明</label>
            <div class="form-input">
              <el-input
                v-model="demandInfo.remark"
                type="textarea"
                :rows="4"
                placeholder="完善后的内容补充说明"
                disabled
              />
            </div>
          </div>
        </div>
      </div>
      <!-- 服务信息 -->
      <div class="my-info" v-if="[4, 5].includes(processStatus)">
        <h3 class="info-title">服务信息</h3>
        <div class="info-content">
          <div class="info-row">
            <span class="info-label">服务人员：</span>
            <span class="info-value">{{ demandInfo.serviceUserName }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">联系方式：</span>
            <span class="info-value">{{ demandInfo.servicePhone }}</span>
          </div>
          <div class="info-row" v-if="processStatus == 5">
            <span class="info-label">服务图片：</span>
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
      title="服务完成"
      :visible.sync="paymentModalVisible"
      width="600px"
      :close-on-click-modal="false"
      custom-class="payment-modal"
    >
      <div class="payment-content">
        <!-- 线下支付区域 -->
        <div class="offline-payment-section">
          <div class="upload-section">
            <div class="upload-label">上传服务单：</div>
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
              <span>上传客户签字的服务单/现场维修图片</span>
            </div>
          </div>

          <div class="offline-actions">
            <el-button type="primary" @click="submitOfflinePayment">提交</el-button>
            <el-button @click="cancelPayment">取消</el-button>
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
          title: "待确认",
          time: "",
          completed: false,
          active: false,
          id: 1,
        },
        {
          title: "服务中",
          time: "",
          completed: false,
          active: false,
          id: 4,
        },
        {
          title: "已完成",
          time: "",
          completed: false,
          active: false,
          id: 5,
        },
      ],
      paymentUrl: [],
      paymentModalVisible: false,
    };
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
          photosJson: JSON.parse(res.data.photosJson) || [],
          attachJson: JSON.parse(res.data.attachJson) || [],
        };
        this.updateProcessStatus(this.demandInfo.workorderStatus);
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

    // 提交线下支付
    submitOfflinePayment() {
      if (this.paymentUrl.length == 0) {
        this.$message.error("请上传服务单");
        return;
      }
      let url = [];
      this.paymentUrl.forEach((item) => {
        url.push(item.response.data.full_url);
      });
      this.$api({
        url: "submitServicePhoto",
        method: "post",
        data: {
          workorderId: this.id,
          servicePhotos: url.join(","),
        },
      }).then((res) => {
        this.$message.success("服务确认完成");
        this.paymentModalVisible = false;
        this.$api({
          url: "submitServicePhoto",
          method: "post",
          data: {
            workorderId: this.id,
          },
        }).then((res) => {
          // this.$message.success("确认完成");
          this.initDemandInfo();
        });
        this.initDemandInfo();
      });
    },

    confirmFinish() {
      this.$confirm("确认完成服务？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$api({
          url: "submitServicePhoto",
          method: "post",
          data: {
            workorderId: this.id,
          },
        }).then((res) => {
          this.$message.success("确认完成");
          this.initDemandInfo();
        });
      });
    },

    // 取消支付
    cancelPayment() {
      this.paymentModalVisible = false;
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
