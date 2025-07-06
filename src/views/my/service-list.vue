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
                <span class="order-info"
                  >工单编号：{{ item.workorder_no }}</span
                >
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
                        @click="downloadFile(item.workorderUrl_full)"
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
                        @click="downloadFile(item.contractUrl_full)"
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
            <p>
              请使用{{ selectedPayment === "alipay" ? "支付宝" : "微信" }}扫一扫
            </p>
            <p>二维码或支付</p>
          </div>
        </div>

        <!-- 线下支付区域 -->
        <div
          class="offline-payment-section"
          v-if="selectedPayment === 'offline'"
        >
          <div class="bank-info">
            <div class="info-item">
              <span class="info-label">收款单位名称：</span>
              <span class="info-value">{{
                offlinePaymentInfo.pay_company_name
              }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">收款单位账号：</span>
              <span class="info-value">{{
                offlinePaymentInfo.pay_account
              }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">收款单位开户行名称：</span>
              <span class="info-value">{{
                offlinePaymentInfo.pay_bank_name
              }}</span>
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
        this.backOpenTitle = "回传工单";
        this.backOpenModalVisible = true;
        this.backOpenType = "1";
      } else if (action == "backContract") {
        this.backOpenTitle = "回传合同";
        this.backOpenModalVisible = true;
        this.backOpenType = "2";
      } else if (action == "pay") {
        this.paymentModalVisible = true;
        this.selectedPayment = "alipay";
      } else if (action == "confirm") {
        this.$confirm("确认完成服务？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          this.$api({
            url: "userConfirmFinish",
            method: "post",
            data: {
              workorder_id: item.id,
            },
          }).then((res) => {
            this.$message.success("确认完成");
            this.getServiceList();
          });
        });
      }
    },
    handleCurrentChange(page) {
      this.currentPage = page;
    },

    // 回传工单
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
