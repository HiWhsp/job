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
            <p class="demand-date">{{ demandInfo.publishTime }}</p>
            <i class="col-line"></i>
            <p class="demand-number">工单编号：{{ demandInfo.contact }}</p>
          </div>
          <div class="demand-info-right">
            <el-button v-if="processStatus === 0">
              <span>回传合同</span>
            </el-button>
            <el-button v-if="processStatus === 1" @click="showPaymentModal">
              服务完成
            </el-button>
            <el-button v-if="processStatus === 3" @click="confirmFinish">
              确认完成
            </el-button>
          </div>
        </div>
        <div class="demand-status">
          <p>
            当前状态：<span>{{ demandInfo.statusText }}</span>
          </p>
          <p>金额：<span>￥1900</span></p>
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
        <h4 class="service-title">标题：售后运维服务清单</h4>
        <div class="service-info">
          <div class="info-item">
            <span class="info-label">工单类型：</span>
            <span class="info-value">常规保养</span>
          </div>
          <div class="download-files">
            <div class="file-item">
              <span class="file-type">下载工单：</span>
              <img
                src="@/assets/image/icon/pdf.png"
                class="file-icon"
                alt="file"
              />
              <span class="file-name">XXXX工单.pdf</span>
              <a href="#" class="download-link">下载</a>
            </div>
            <div class="file-item">
              <span class="file-type">下载合同：</span>
              <img
                src="@/assets/image/icon/pdf.png"
                class="file-icon"
                alt="file"
              />
              <span class="file-name">XXXX工单.pdf</span>
              <a href="#" class="download-link">下载</a>
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
            <span class="notice-text">
              1. 请在收到工单后24小时内确认工单，否则将自动取消工单。
            </span>
          </div>
        </div>
      </div>

      <!-- 我的信息 -->
      <!-- <div class="my-info">
        <h3 class="info-title">基本信息</h3>
        <div class="info-content">
          <div class="info-row">
            <span class="info-label">联系人：</span>
            <span class="info-value">{{ demandInfo.company }}</span>
            <span class="info-label">创建人员：</span>
            <span class="info-value">张三</span>
          </div>
          <div class="info-row">
            <span class="info-label">联系电话：</span>
            <span class="info-value">{{ demandInfo.phone }}</span>
            <span class="info-label">工单分类：</span>
            <span class="info-value">{{ demandInfo.email }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">企业名称：</span>
            <span class="info-value">{{ demandInfo.phone }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">联系邮箱：</span>
            <span class="info-value">{{ demandInfo.phone }}</span>
          </div>
        </div>
      </div> -->
      <div class="form-content">
        <div class="form-section">
          <div class="form-row">
            <label class="form-label">设备类型</label>
            <div class="form-input">
              <el-radio-group v-model="formData.deviceType">
                <el-radio label="光伏">光伏</el-radio>
                <el-radio label="储能">储能</el-radio>
                <el-radio label="采发">采发</el-radio>
                <el-radio label="其他">其他</el-radio>
              </el-radio-group>
            </div>
          </div>

          <div class="form-row">
            <label class="form-label">设备规格</label>
            <div class="form-input">
              <el-input
                v-model="formData.deviceSpec"
                placeholder="完善后的内容规格名称规格名称规格名称"
              />
            </div>
          </div>

          <div class="form-row">
            <label class="form-label">设备位置</label>
            <div class="form-input">
              <el-input
                v-model="formData.deviceLocation"
                placeholder="完善后的内容详细位置信息详细位置信息详细位置信息"
              />
            </div>
          </div>

          <div class="form-row">
            <label class="form-label">故障现象</label>
            <div class="form-input">
              <el-input
                v-model="formData.faultDescription"
                type="textarea"
                :rows="3"
                placeholder="完善后的内容故障现象描述文案故障现象描述文案"
              />
            </div>
          </div>

          <div class="form-row">
            <label class="form-label">上传图片</label>
            <div class="form-input">
              <el-upload
                class="avatar-uploader"
                action="#"
                :show-file-list="false"
                :auto-upload="false"
                :on-change="handleAvatarSuccess"
              >
                <div class="upload-placeholder">
                  <i class="el-icon-plus"></i>
                  <div class="upload-text">图片</div>
                </div>
              </el-upload>
            </div>
          </div>

          <div class="form-row">
            <label class="form-label">补充说明</label>
            <div class="form-input">
              <el-input
                v-model="formData.additionalInfo"
                type="textarea"
                :rows="4"
                placeholder="完善后的内容补充说明信息补充说明信息补充说明信息补充说明信息补充说明信息补充说明信息补充说明信息补充说明信息补充说明信息补充说明信息补充说明信息补充说明信息"
              />
            </div>
          </div>
        </div>
      </div>
      <!-- 服务信息 -->
      <div class="my-info">
        <h3 class="info-title">服务信息</h3>
        <div class="info-content">
          <div class="info-row">
            <span class="info-label">服务人员：</span>
            <span class="info-value">{{ demandInfo.company }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">联系方式：</span>
            <span class="info-value">{{ demandInfo.phone }}</span>
          </div>
          <div class="info-row" v-if="processStatus == 2">
            <span class="info-label">服务图片：</span>
            <span class="info-value">
              <img
                src="@/assets/image/icon/pdf.png"
                class="file-icon"
                alt="file"
              />
            </span>
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
                action="#"
                :show-file-list="false"
                :auto-upload="false"
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
            <el-button type="primary" @click="submitOfflinePayment"
              >提交</el-button
            >
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
      title: "",
      demandType: "",
      processStatus: 2,
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
        },
        {
          title: "服务中",
          time: "",
          completed: false,
          active: false,
        },
        {
          title: "已完成",
          time: "",
          completed: false,
          active: false,
        },
      ],
      formData: {
        deviceType: "光伏",
        deviceSpec: "",
        deviceLocation: "",
        faultDescription: "",
        additionalInfo: "",
      },
      paymentModalVisible: false,
    };
  },
  mounted() {
    this.title = this.$route.query.id; // 修复参数获取
    this.initDemandInfo();
  },
  methods: {
    initDemandInfo() {
      // 从路由参数获取信息
      const query = this.$route.query;
      this.demandType = query.type || "default";
      this.demandInfo.publishTime = query.publishTime || "2021-08-18 13:29";
      this.demandInfo.contact = query.contact || "565884455112454";
      this.demandInfo.company = query.company || "XXXXXXXX科技有限公司";
      this.demandInfo.statusText = "已处理（生成工作指导：OPS-2024-US-CA-001）";
      this.updateProcessStatus(this.processStatus); // 已分配服务人员状态
    },

    // 更新流程状态
    updateProcessStatus(currentStep) {
      this.processSteps.forEach((step, index) => {
        if (index < currentStep) {
          step.active = true;
          // 为已完成的步骤添加时间（示例时间）
          if (index === 0) step.time = "2020-05-12 15:50";
          if (index === 1) step.time = "2020-05-13 10:30";
          if (index === 2) step.time = "2020-05-14 14:20";
        } else if (index === currentStep) {
          step.active = true; // 当前步骤也标记为已完成
          // 为当前步骤添加时间
          if (index === 0) step.time = "2020-05-12 15:50";
          if (index === 1) step.time = "2020-05-13 10:30";
          if (index === 2) step.time = "2020-05-14 14:20";
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
      console.log("支付凭证上传:", file);
      // 这里可以处理支付凭证上传逻辑
    },

    // 提交线下支付
    submitOfflinePayment() {
      console.log("提交线下支付");
      // 这里可以处理线下支付提交逻辑
      this.$message.success("支付凭证已提交，请等待审核");
      this.paymentModalVisible = false;
    },

    // 取消支付
    cancelPayment() {
      this.paymentModalVisible = false;
    },
    confirmFinish() {
      this.$confirm("确认完成服务？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$message.success("确认完成");
        this.processStatus = 4;
        this.updateProcessStatus(this.processStatus);
      });
    },
  },
};
</script>

<style lang="less" scoped src="./service_provider_detail.less"></style>
