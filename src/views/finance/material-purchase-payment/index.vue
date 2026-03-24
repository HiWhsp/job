<template>
  <div class="view-wrap finance-page">
    <!-- 搜索/筛选区域 -->
    <div class="search-section">
      <el-form :model="queryParams" ref="queryForm" inline class="search-form" label-width="80px">
        <div class="search-row">
          <el-form-item label="关键词" prop="keyword">
            <el-input
              v-model="queryParams.keyword"
              placeholder="采购单号/采购单名称"
              clearable
              style="width: 260px"
            />
          </el-form-item>
          <!-- <el-form-item label="付款状态" prop="isPay">
            <el-select v-model="queryParams.isPay" placeholder="请选择" clearable style="width: 140px">
              <el-option label="未付款" value="99" />
              <el-option label="已付款" value="1" />
            </el-select>
          </el-form-item> -->
          <el-form-item label="时间筛选" prop="dateRange">
            <el-date-picker
              v-model="queryParams.dateRange"
              type="daterange"
              range-separator="-"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              clearable
              style="width: 236px"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleQuery">搜索</el-button>
            <el-button @click="resetQuery">重置</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <!-- 表格区域：标签页 -->
    <div class="table-view">
      <div class="table-util-bar">
        <div class="table-tabs">
          <div
            v-for="(tab, index) in statusTabs"
            :key="index"
            class="tab-item"
            :class="{ active: statusTab === tab.value }"
            @click="handleTabChange(tab.value)"
          >
            {{ tab.label }}
          </div>
        </div>
      </div>
      <div class="table-box">
        <el-table
          ref="tableH"
          :height="tableHeight"
          :data="tableData"
          header-cell-class-name="table-header-cell"
          :row-class-name="tableRowClassName"
        >
          <el-table-column type="index" label="序号" width="70" align="center">
            <template slot-scope="scope">{{ (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1 }}</template>
          </el-table-column>
          <el-table-column prop="purchaseNo" label="采购单号" min-width="120" show-overflow-tooltip />
          <el-table-column prop="title" label="采购单名称" min-width="140" show-overflow-tooltip />
          <el-table-column prop="price" label="订单金额" min-width="110" align="right" />
          <el-table-column prop="orderStatus" label="状态" width="120" align="center">
            <template slot-scope="{ row }">
              <el-tag :type="payStatusTagType(row.isPay)" size="small" effect="light">
                {{ payStatusText(row.isPay) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="created_at" label="提交时间" width="160" align="center" />
          <!-- <el-table-column prop="isPay" label="付款状态" width="110" align="center">
            <template slot-scope="{ row }">
              <el-tag :type="payTagType(row.isPay)" size="small">{{ payText(row.isPay) }}</el-tag>
            </template>
          </el-table-column> -->
          <el-table-column label="操作" width="180" align="center" fixed="right">
            <template slot-scope="{ row }">
              <span class="row-acts">
                <span class="row-act" @click="handleView(row)">查看详情</span>
                <span v-if="String(row.isPay) !== '1'" class="row-act" @click="handlePay(row)">立即付款</span>
              </span>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-wrap">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryParams.pageNum"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="queryParams.pageSize"
            layout="total, prev, pager, next, jumper"
            :total="total"
          />
        </div>
      </div>
    </div>

    <!-- 付款弹框 -->
    <el-dialog
      title="付款"
      :visible.sync="payDialogVisible"
      width="520px"
      :close-on-click-modal="false"
      @close="closePayDialog"
    >
      <el-form ref="payForm" :model="payForm" :rules="payRules" label-width="100px">
        <el-form-item label="付款金额:" prop="amount">
          <el-input v-model="payForm.amount" placeholder="请输入" clearable style="width: 100%" />
        </el-form-item>
        <el-form-item label="付款凭证:">
          <el-upload
            class="pay-upload"
            list-type="picture-card"
            :action="uploadAction"
            name="file"
            :file-list="payForm.voucherList"
            accept="image/*"
            :on-success="(res, file, list) => handlePayUploadSuccess(res, file, list)"
            :on-remove="(file, list) => handlePayUploadRemove(file, list)"
            :http-request="handlePayUploadRequest"
          >
            <div class="upload-inner">
              <i class="el-icon-plus" />
              <span class="upload-tip">添加图片</span>
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitPay">提交</el-button>
        <el-button @click="closePayDialog">取消</el-button>
      </span>
    </el-dialog>

    <!-- 采购单详情：从右到左打开的抽屉，宽度 800px -->
    <el-drawer
      title="采购单详情"
      :visible.sync="detailVisible"
      direction="rtl"
      size="800px"
      :before-close="closeDetailDrawer"
      custom-class="purchase-detail-drawer"
    >
      <div v-loading="detailLoading" class="detail-body">
        <div v-if="!detailRow && !detailLoading" class="detail-empty">—</div>
        <div v-else-if="detailRow">
          <div class="detail-row">
            <div class="detail-item">
              <span class="detail-label">采购单号:</span>
              <span class="detail-value">{{ detailRow.purchaseNo || "—" }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">采购单名称:</span>
              <span class="detail-value">{{ detailRow.title || "—" }}</span>
            </div>
          </div>
          <div class="detail-row">
            <div class="detail-item">
              <span class="detail-label">提交时间:</span>
              <span class="detail-value">{{ detailRow.created_at || "—" }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">订单状态:</span>
              <span class="detail-value">
                <el-tag :type="orderStatusTagType(detailRow.orderStatus)" size="small">
                  {{ orderStatusText(detailRow.orderStatus) }}
                </el-tag>
              </span>
            </div>
          </div>
          <div class="detail-row">
            <div class="detail-item">
              <span class="detail-label">订单金额:</span>
              <span class="detail-value detail-amount">{{ detailRow.price || "—" }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">付款状态:</span>
              <span class="detail-value">
                <el-tag :type="payTagType(detailRow.isPay)" size="small">{{ payText(detailRow.isPay) }}</el-tag>
              </span>
            </div>
          </div>

          <div class="detail-section">
            <div class="detail-section-title">付款信息</div>
            <div class="detail-row">
              <div class="detail-item">
                <span class="detail-label">付款时间:</span>
                <span class="detail-value">{{ payJsonDetail.created_at || "—" }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">付款人:</span>
                <span class="detail-value">{{ payJsonDetail.name || "—" }}</span>
              </div>
            </div>
            <div class="detail-row">
              <div class="detail-item">
                <span class="detail-label">付款金额:</span>
                <span class="detail-value">{{ payJsonDetail.price || "—" }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">付款凭证:</span>
                <div class="detail-value">
                  <el-image
                    v-if="payJsonDetail.image"
                    :src="payJsonDetail.image"
                    fit="contain"
                    class="voucher-preview"
                    :preview-src-list="[payJsonDetail.image]"
                  />
                  <span v-else>—</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import axios from "axios";
import { UPLOAD_ROOT } from "@/config/env.js";

const LIST_API = "/getPurchaseMaterialOrderList";
const PAY_API = "/payPurchaseMaterialOrder";
const DETAIL_API = "/getPurchaseMaterialOrder";

export default {
  name: "MaterialPurchasePayment",
  data() {
    return {
      uploadAction: UPLOAD_ROOT,
      queryParams: {
        keyword: "",
        isPay: "99",
        dateRange: null,
        pageNum: 1,
        pageSize: 20
      },
      total: 0,
      tableHeight: 0,
      tableData: [],
      statusTab: "99",
      statusTabs: [
        { label: "待付款", value: "99" },
        { label: "已付款", value: "1" }
      ],
      detailVisible: false,
      detailLoading: false,
      detailRow: null,
      payDialogVisible: false,
      rowToPay: null,
      payForm: {
        amount: "",
        voucherList: []
      },
      payRules: {
        amount: [
          { required: true, message: "请输入付款金额", trigger: "blur" },
          { pattern: /^\d+(\.\d{1,2})?$/, message: "请输入有效金额（最多两位小数）", trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    payJsonDetail() {
      return this.detailRow ? this._parseJson(this.detailRow.payJson) : {};
    },
    ruKuJsonDetail() {
      return this.detailRow ? this._parseJson(this.detailRow.ruKuJson) : {};
    },
    reviewList() {
      const list = this.detailRow ? this.detailRow.reviewJson : [];
      const arr = Array.isArray(list) ? list : (this._parseJson(list) || []);
      return Array.isArray(arr) ? arr : [];
    },
    productList() {
      const list = this.detailRow ? this.detailRow.productJson : [];
      const arr = Array.isArray(list) ? list : (this._parseJson(list) || []);
      const rows = Array.isArray(arr) ? arr : [];
      return rows.map(it => {
        const info = (it && it.info) ? it.info : {};
        return {
          sn: info.sn || "",
          title: info.title || "",
          spec: info.keyVals || "",
          category: info.productCateTitle || "",
          num: it && it.num != null ? it.num : "",
          rkNum: it && it.rkNum != null ? it.rkNum : ""
        };
      });
    }
  },
  mounted() {
    this.setView();
    this.loadList();
  },
  methods: {
    setView() {
      this.$nextTick(() => {
        const refTable = this.$refs.tableH;
        if (!refTable) return;
        const tableEl = refTable.$el || refTable;
        const tableOffsetTop = tableEl.offsetTop + 85;
        this.tableHeight = Math.max(window.innerHeight - tableOffsetTop - 80, 200);
        const that = this;
        window.onresize = function() {
          const top = tableEl.offsetTop + 84 + 80;
          that.tableHeight = Math.max(window.innerHeight - top, 200);
        };
      });
    },
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 === 1 ? "row-even" : "";
    },
    loadList() {
      const [start_time = "", end_time = ""] = this.queryParams.dateRange || [];
      const params = {
        limit: String(this.queryParams.pageSize),
        page: String(this.queryParams.pageNum),
        keyword: this.queryParams.keyword || "",
        start_time: start_time || "",
        end_time: end_time || "",
        isPay: String(this.queryParams.isPay || ""),
        materialType: 1
      };
      this.$api({
        url: LIST_API,
        method: "post",
        data: params
      })
        .then(res => {
          if (res && res.code === 200 && res.data) {
            const list = Array.isArray(res.data.list) ? res.data.list : [];
            this.tableData = list;
            this.total = res.data.count ?? list.length;
          } else {
            this.tableData = [];
            this.total = 0;
          }
        })
        .catch(() => {
          this.tableData = [];
          this.total = 0;
        });
    },
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.loadList();
    },
    resetQuery() {
      this.$refs.queryForm.resetFields();
      this.queryParams.pageNum = 1;
      this.loadList();
    },
    handleTabChange(value) {
      this.statusTab = value;
      // tab 只做快捷过滤付款状态
      this.queryParams.isPay = value;
      this.queryParams.pageNum = 1;
      this.loadList();
    },
    handleView(row) {
      // TODO: 跳转详情或弹窗
      this.$api({
        url: "/getPurchaseMaterialOrder",
        method: "post",
        data: { id: row.id }
      })
        .then(res => {
          console.log(res);
        });
    },
    handlePay(row) {
      this.rowToPay = row;
      this.payForm.amount = row && row.price != null ? String(row.price) : "";
      this.payForm.voucherList = [];
      this.payDialogVisible = true;
    },
    closePayDialog() {
      this.payDialogVisible = false;
      this.rowToPay = null;
      this.payForm.amount = "";
      this.payForm.voucherList = [];
      this.$refs.payForm && this.$refs.payForm.resetFields();
    },
    handlePayUploadRequest(option) {
      const formData = new FormData();
      formData.append("file", option.file);
      const token = localStorage.getItem("token");
      axios
        .post(UPLOAD_ROOT, formData, {
          headers: { Authorization: "Bearer " + token },
          timeout: 60000
        })
        .then(res => {
          const data = res.data || res;
          const payload = (data && data.data) ? data.data : data;
          const url = (payload && (payload.path || payload.url)) || (data && data.path) || "";
          option.onSuccess({ url });
        })
        .catch(err => {
          this.$message.error(
            (err.response && err.response.data && err.response.data.msg) || "上传失败"
          );
          option.onError(err);
        });
    },
    handlePayUploadSuccess(res, file, fileList) {
      this.payForm.voucherList = fileList;
      const r = res || (file && file.response);
      const payload = (r && r.data) ? r.data : r;
      const url = (payload && (payload.path || payload.url)) || (r && r.path) || (file && file.url) || "";
      if (url && file) file.url = url;
    },
    handlePayUploadRemove(file, fileList) {
      this.payForm.voucherList = fileList || [];
    },
    getPayVoucherUrls() {
      const list = this.payForm.voucherList || [];
      return list.map(f => f.url || (f.response && f.response.url)).filter(Boolean);
    },
    payText(v) {
      const s = Number(v);
      if (s === 1) return "已付款";
      return "未付款";
    },
    payTagType(v) {
      const s = Number(v);
      return s === 1 ? "success" : "info";
    },
    _parseJson(val) {
      if (val == null) return {};
      if (typeof val === "object") return val;
      try {
        return typeof val === "string" ? JSON.parse(val || "{}") : {};
      } catch (e) {
        return {};
      }
    },
    loadDetail(id) {
      if (!id) return Promise.resolve(null);
      this.detailLoading = true;
      return this.$api({
        url: DETAIL_API,
        method: "post",
        data: { id: String(id) }
      })
        .then(res => {
          if (res && res.code === 200 && res.data) return res.data;
          return null;
        })
        .finally(() => {
          this.detailLoading = false;
        });
    },
    orderStatusText(v) {
      const s = Number(v);
      const map = {
        1: "生产副总审核",
        2: "总经理审核",
        3: "待财务付款",
        4: "待采购",
        5: "质检入库",
        6: "已完成",
        [-1]: "审核未通过"
      };
      return map[s] != null ? map[s] : (v != null ? String(v) : "—");
    },
    orderStatusTagType(v) {
      const s = Number(v);
      if (s === -1) return "danger";
      if (s === 6) return "success";
      if (s === 3) return "warning";
      return "info";
    },
    payStatusText(v) {
      const s = Number(v);
      if (s === 0) return "未付款";
      if (s === 1) return "已付款";
      return "—";
    },
    payStatusTagType(v) {
      const s = Number(v);
      if (s === 0) return "info";
      if (s === 1) return "success";
      return "info";
    },
    handleView(row) {
      const id = row && row.id != null ? String(row.id) : "";
      if (!id) {
        this.$message.warning("缺少采购单id");
        return;
      }
      this.detailVisible = true;
      this.detailRow = null;
      this.loadDetail(id).then(data => {
        if (!this.detailVisible) return;
        if (!data) {
          this.$message.error("获取采购单详情失败");
          return;
        }
        this.detailRow = data;
      });
    },
    closeDetailDrawer(done) {
      this.detailRow = null;
      done();
    },
    submitPay() {
      this.$refs.payForm.validate(valid => {
        if (!valid) return;
        if (!this.rowToPay) return;
        const id = this.rowToPay.id != null ? String(this.rowToPay.id) : "";
        if (!id) {
          this.$message.warning("缺少采购单id");
          return;
        }
        const urls = this.getPayVoucherUrls();
        if (!urls.length) {
          this.$message.warning("请上传付款凭证");
          return;
        }
        const image = urls.join(",");
        const price = String(this.payForm.amount || "0");
        this.$api({
          url: PAY_API,
          method: "post",
          data: { id, price, image }
        })
          .then(res => {
            if (res && res.code === 200) {
              this.$message.success("提交成功");
              this.closePayDialog();
              this.loadList();
            } else {
              this.$message.error((res && res.msg) || "提交失败");
            }
          })
          .catch(err => {
            this.$message.error((err && err.msg) ? err.msg : "提交失败");
          });
      });
    },
    handleSizeChange(val) {
      this.queryParams.pageSize = val;
      this.loadList();
    },
    handleCurrentChange(val) {
      this.queryParams.pageNum = val;
      this.loadList();
    }
  }
};
</script>

<style lang="less" scoped>
.finance-page {
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e6e6e6;
  height: 100%;
}
.search-section {
  padding: 20px 24px;
  margin-bottom: 20px;
}
.search-form {
  .search-row {
    margin-bottom: 0;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px 24px;
  }
  ::v-deep .el-form-item { margin-bottom: 0; }
  ::v-deep .el-form-item__label {
    color: #303133;
    font-size: 14px;
  }
  ::v-deep .el-input__inner {
    border-radius: 4px;
    border-color: #dcdfe6;
  }
  .el-button--primary {
    background: linear-gradient(90deg, #157de9 0%, #3697fd 100%) !important;
  }
}
.table-view {
  overflow: hidden;
}
.table-util-bar {
  display: flex;
  align-items: center;
  padding-bottom: 0;
  margin: 0 27px 25px;
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  .table-tabs {
    display: flex;
    align-items: center;
    gap: 32px;
    height: 44px;
    position: relative;
    .tab-item {
      font-size: 15px;
      color: #909399;
      cursor: pointer;
      padding: 0 4px 16px;
      position: relative;
      transition: color 0.2s;
      &:hover { color: #606266; }
      &.active {
        color: #3377fe;
        font-weight: 500;
        &::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: -4px;
          height: 2px;
          background: #3377fe;
          border-radius: 1px;
        }
      }
    }
  }
}
.table-box {
  margin: 0 27px;
  ::v-deep .el-table {
    font-size: 14px;
    .table-header-cell {
      background: #f5f7fa;
      color: #303133;
      font-weight: 500;
    }
    .el-table__body tr.row-even td { background: #f3f7fa; }
    .el-table__body tr:hover > td { background: #f5f7fa !important; }
  }
}
.row-acts {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0 12px;
  .row-act {
    color: #3377fe;
    cursor: pointer;
    font-size: 14px;
    &:hover { text-decoration: underline; }
  }
}
.pagination-wrap {
  padding: 16px 24px;
  background: #fff;
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #ebeef5;
}

::v-deep .el-dialog__footer {
  text-align: center;
}

/* 付款弹框 - 凭证上传 */
.pay-upload {
  ::v-deep .el-upload--picture-card {
    width: 120px;
    height: 120px;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .upload-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    .el-icon-plus {
      font-size: 28px;
      margin-bottom: 8px;
      color: #8c939d;
    }
  }
  .upload-tip {
    font-size: 12px;
    color: #909399;
  }
}

/* 采购单详情抽屉 */
.detail-body {
  padding: 18px 20px;
}
.detail-empty {
  color: #909399;
  padding: 24px 0;
  text-align: center;
}
.detail-row {
  display: flex;
  gap: 24px;
  margin-bottom: 12px;
}
.detail-item {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}
.detail-label {
  width: 96px;
  color: #606266;
  text-align: left;
  flex: 0 0 auto;
  font-size: 14px;
}
.detail-value {
  color: #303133;
  flex: 1 1 auto;
  min-width: 0;
  word-break: break-all;
  font-size: 14px;
  text-align: left;
}
.detail-amount {
  font-weight: 600;
}
.detail-section {
  margin-top: 18px;
}
.detail-section-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 20px;
  text-align: left;
}
.detail-table {
  width: 100%;
}
.voucher-preview {
  width: 120px;
  height: 80px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  background: #f5f7fa;
}

::v-deep .el-drawer.rtl {
  width: 800px !important;
}
::v-deep .el-drawer__header {
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  text-align: left;
}
::v-deep .el-drawer__body {
  padding: 0 24px 24px;
}
</style>
