<template>
  <div class="page">
    <div class="page-header">
      <div class="page-header-title">
        <span>工单管理</span>
        <span style="margin: 0 10px">></span>
        <span>工单详情</span>
      </div>
    </div>
    <div class="page-ctx">
      <!-- 基本信息 -->
      <div class="basic-info">
        <div class="demand-info">
          <div class="demand-info-left">
            <p class="demand-date">工单号：{{ demandInfo.workorder_no }}</p>
            <i class="col-line"></i>
            <p class="demand-number">关联需求单：{{ demandInfo.serialNo }}</p>
          </div>
          <div class="demand-info-right">
            <el-button v-if="processStatus === 1" @click="backOpen(1)">
              <span>回传工单</span>
            </el-button>
            <el-button v-if="processStatus === 1" @click="backOpen(2)">
              <span>回传合同</span>
            </el-button>
            <el-button v-if="processStatus === 2" @click="showPaymentModal">
              去支付
            </el-button>
            <el-button v-if="processStatus === 5" @click="confirmFinish">
              确认完成
            </el-button>
          </div>
        </div>
        <div class="demand-status">
          <p>
            当前状态：<span>{{ workorderStatusName(demandInfo) }}</span>
          </p>
          <p>
            {{
              demandInfo.payStatus == 0
                ? "待支付"
                : demandInfo.payStatus == 2
                ? "已支付"
                : "待确认"
            }}：<span
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
        <h4 class="service-title">标题：{{ workOrderName(demandInfo) }}</h4>
        <div class="service-info">
          <!-- <div class="info-item">
            <span class="info-label">工单类型：</span>
            <span class="info-value">{{ workOrderName(demandInfo) }}</span>
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

      <!-- 我的信息 -->
      <div class="my-info">
        <h3 class="info-title">基本信息</h3>
        <div class="info-content">
          <div class="info-row">
            <span class="info-label">联系人：</span>
            <span class="info-value">{{ demandInfo.contactPerson }}</span>
            <span class="info-label">创建人员：</span>
            <span class="info-value">暂无</span>
          </div>
          <div class="info-row">
            <span class="info-label">联系电话：</span>
            <span class="info-value">{{ demandInfo.contact }}</span>
            <!-- <span class="info-label">工单分类：</span>
            <span class="info-value">{{ demandInfo.email }}</span> -->
          </div>
          <div class="info-row">
            <span class="info-label">企业名称：</span>
            <span class="info-value">{{ demandInfo.companyName }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">联系邮箱：</span>
            <span class="info-value">{{ demandInfo.email }}</span>
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
      <div class="my-info" v-if="[4, 5, 6].includes(processStatus)">
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
          <div class="info-row" v-if="[5, 6].includes(processStatus)">
            <span class="info-label">服务图片：</span>
            <span class="info-value">
              <img src="@/assets/image/icon/pdf.png" class="file-icon" alt="file" />
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 支付方式弹框 -->
    <el-dialog
      title="选择支付方式"
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

          <div
            class="payment-method wechat"
            :class="{ active: selectedPayment === 'wechat' }"
            @click="selectPayment('wechat')"
          ></div>

          <div
            class="payment-method offline"
            :class="{ active: selectedPayment === 'offline' }"
            @click="selectPayment('offline')"
          >
            线下支付
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
            <p>请使用{{ selectedPayment === "alipay" ? "支付宝" : "微信" }}扫一扫</p>
            <p>二维码或支付</p>
          </div>
        </div>

        <!-- 线下支付区域 -->
        <div class="offline-payment-section" v-if="selectedPayment === 'offline'">
          <div class="bank-info">
            <div class="info-item">
              <span class="info-label">收款单位名称：</span>
              <span class="info-value">{{ offlinePaymentInfo.pay_company_name }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">收款单位账号：</span>
              <span class="info-value">{{ offlinePaymentInfo.pay_account }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">收款单位开户行名称：</span>
              <span class="info-value">{{ offlinePaymentInfo.pay_bank_name }}</span>
            </div>
          </div>

          <div class="upload-section">
            <div class="upload-label">上传支付凭证：</div>
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
            <el-button type="primary" @click="submitOfflinePayment">提交</el-button>
            <el-button @click="cancelPayment">取消</el-button>
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
        <el-button type="primary" @click="submitBackOpen">提交</el-button>
        <el-button @click="cancelBackOpen">取消</el-button>
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
          title: "待工单确认",
          time: "",
          completed: false,
          active: false,
          id: 1,
        },
        {
          title: "待付款",
          time: "",
          completed: false,
          active: false,
          id: 2,
        },
        {
          title: "已付款",
          time: "",
          completed: false,
          active: false,
          id: 3,
        },
        {
          title: "已分配服务人员",
          time: "",
          completed: false,
          active: false,
          id: 4,
        },
        {
          title: "服务已完成",
          time: "",
          completed: false,
          active: false,
          id: 5,
        },
        {
          title: "服务已确认",
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
          photosJson: JSON.parse(res.data.photosJson) || [],
          attachJson: JSON.parse(res.data.attachJson) || [],
        };
        this.updateProcessStatus(this.demandInfo.workorderStatus);
      });
    },

    // 回传工单
    backOpen(type) {
      this.backOpenType = type;
      this.backOpenTitle = type == 1 ? "回传工单" : "回传合同";
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
        url = item.response.data.full_url;
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
        this.$message.success("回传成功");
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
      this.processSteps.forEach((step, index) => {
        if (step.id < currentStep) {
          step.active = true;
          // 为已完成的步骤添加时间（示例时间）
          if (index === 0) step.time = this.demandInfo['status0_time'];
          if (index === 1) step.time = this.demandInfo['status1_time'];
          if (index === 2) step.time = this.demandInfo['status2_time'];
          if (index === 3) step.time = this.demandInfo['status3_time'];
          if (index === 4) step.time = this.demandInfo['status4_time'];
          if (index === 5) step.time = this.demandInfo['status5_time'];
          if (index === 6) step.time = this.demandInfo['status6_time'];
        } else if (step.id === currentStep) {
          step.active = true; // 当前步骤也标记为已完成
          // 为当前步骤添加时间
          if (index === 0) step.time = this.demandInfo['status0_time'];
          if (index === 1) step.time = this.demandInfo['status1_time'];
          if (index === 2) step.time = this.demandInfo['status2_time'];
          if (index === 3) step.time = this.demandInfo['status3_time'];
          if (index === 4) step.time = this.demandInfo['status4_time'];
          if (index === 5) step.time = this.demandInfo['status5_time'];
          if (index === 6) step.time = this.demandInfo['status6_time'];
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
        url = item.response.data.full_url;
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
        this.$message.success("提交成功");
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
      this.$confirm("确认完成服务？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$api({
          url: "userConfirmFinish",
          method: "post",
          data: {
            workorder_id: this.id,
          },
        }).then((res) => {
          this.$message.success("确认完成");
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
