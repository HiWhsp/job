<template>
  <div class="page">
    <div class="page-header">
      <!-- 搜索项 -->
      <div class="search-form">
        <el-form :model="searchForm" ref="searchForm" :inline="true" size="small">
          <el-form-item label="工单编号" prop="workorder_no">
            <el-input
              v-model="searchForm.workorder_no"
              placeholder="请输入工单编号"
              clearable
              style="width: 200px"
              @change="handleSearch"
            />
          </el-form-item>
          <el-form-item label="工单类型" prop="workOrderType">
            <el-select
              v-model="searchForm.workOrderType"
              placeholder="请选择工单类型"
              clearable
              style="width: 200px"
              @change="handleSearch"
            >
              <!-- 不传或传空获取全部;1售后运维需求表 2项目产品需求表 3项目融资表 4项目转让表 5产品回收利用表 -->
              <el-option label="全部" value="" />
              <el-option label="售后运维需求表" value="1" />
              <el-option label="项目产品需求表" value="2" />
              <el-option label="项目融资表" value="3" />
              <el-option label="项目转让表" value="4" />
              <el-option label="产品回收利用表" value="5" />
            </el-select>
          </el-form-item>
          <el-form-item label="设备类型" prop="deviceType">
            <el-select
              v-model="searchForm.deviceType"
              placeholder="请选择设备类型"
              clearable
              style="width: 200px"
              @change="handleSearch"
            >
              <el-option label="全部" value="" />
              <el-option label="光伏" value="1" />
              <el-option label="储能" value="2" />
              <el-option label="柴冲" value="3" />
              <el-option label="柴发" value="4" />
              <el-option label="其他" value="5" />
            </el-select>
          </el-form-item>
          <el-form-item style="flex: 1; text-align: right">
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="handleReset">重置</el-button>
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
                <span class="order-info">工单编号：{{ item.workorder_no }}</span>
              </div>
            </div>
            <div class="header-right">
              <span class="pay-amount"
                >金额：<span class="amount">￥{{ item.servicePrice }}</span></span
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
                    <div class="file-item" v-if="item.serviceOriginContractUrl">
                      <span class="file-type">初始服务合同：</span>
                      <img
                        src="@/assets/image/icon/pdf.png"
                        class="file-icon"
                        alt="file"
                      />
                      <span class="file-name">{{
                        item.serviceOriginContractName || "--"
                      }}</span>
                      <a
                        href="#"
                        class="download-link"
                        @click="
                          downloadFile(
                            vuex_config.file_url_pre + item.serviceOriginContractUrl
                          )
                        "
                        >下载</a
                      >
                    </div>
                    <div class="file-item" v-else>
                      <span class="file-type">初始服务合同：</span>
                      <span class="file-name">暂未上传</span>
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
                    @click="handleAction('backContract', item)"
                    v-if="item.serviceStatus == 1"
                  >
                    回传合同
                  </el-button>
                  <el-button
                    size="small"
                    @click="handleAction('confirm', item)"
                    v-if="item.serviceStatus == 2"
                  >
                    服务完成
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
                <span class="notice-text">请下载服务合同后签字盖章回传系统确认工单</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-empty v-if="total == 0" description="暂无数据" />
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
      title="回传合同"
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
  name: "service-provider-list",
  data() {
    return {
      id: "",
      serviceList: [],
      tabList: [
        { name: "全部工单", value: "" },
        { name: "待确认", value: "1" },
        { name: "服务中", value: "2" },
        { name: "已完成", value: "3" },
      ],
      activeTab: "",
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
          0: "未分配",
          1: "待确认",
          2: "服务中",
          3: "已完成",
        }[status];
      };
    },
    // 需求类型
    workOrderName() {
      return (item) => {
        return {
          1: "售后运维需求表",
          2: "光储充相关产品需求表",
          3: "新能源光储充项目投融资信息需求表",
          4: "项目转让需求表",
          5: "光伏组件/锂电池/铅酸电池回收业务信息表",
        }[item.workOrderType];
      };
    },
    // 设备类型
    deviceTypeName() {
      return (item) => {
        return {
          1: "光伏",
          2: "储能",
          3: "拆冲",
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
        this.$message.success("回传成功");
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
        this.$message.error("请上传服务单");
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
        this.$message.success("服务图片上传完成");
        this.paymentModalVisible = false;
        this.$api({
          url: "serviceConfirmFinish",
          method: "post",
          data: {
            workorderId: this.id,
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
