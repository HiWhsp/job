<template>
  <div class="view-wrap purchase-page">
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
    <div class="table-view">
      <div class="table-util-bar">
        <div class="table-tabs">
          <div
            v-for="(tab, index) in statusTabs"
            :key="index"
            class="tab-item"
            :class="{ active: statusTab === tab.value }"
            @click="handleTabChange(tab.value)"
          >{{ tab.label }}</div>
        </div>
        <el-button type="primary" @click="handleAdd">新增原料采购单</el-button>
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
            <template slot-scope="scope">
              {{ String((queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1).padStart(3, '0') }}
            </template>
          </el-table-column>
          <el-table-column prop="purchaseNo" label="采购单号" align="center" show-overflow-tooltip />
          <el-table-column prop="purchaseName" label="采购单名称" align="center" show-overflow-tooltip />
          <el-table-column prop="orderAmount" label="订单金额" align="center" />
          <el-table-column prop="orderStatus" label="状态" align="center">
            <template slot-scope="{ row }">
              <el-tag
                v-if="row.orderStatus != null && row.orderStatus !== ''"
                :type="orderStatusTagType(row.orderStatus)"
                size="small"
                effect="plain"
              >{{ orderStatusText(row.orderStatus) }}</el-tag>
              <span v-else>—</span>
            </template>
          </el-table-column>
          <el-table-column prop="submitTime" label="提交时间" align="center" />
          <el-table-column label="操作" width="300" align="left">
            <template slot-scope="{ row }">
              <span class="row-acts">
                <span class="row-act" @click="handleView(row)">查看详情</span>
                <template v-if="row.orderStatus == 1 || row.orderStatus == -1">
                  <span class="row-act" @click="handleEdit(row)">编辑</span>
                  <span class="row-act" @click="handleDelete(row)">删除</span>
                </template>
                <template v-if="row.orderStatus == 4">
                  <span class="row-act" @click="handleUploadContract(row)">上传合同</span>
                  <span class="row-act" @click="handleCompleteAndWarehouse(row)">采购完成并提交入库</span>
                </template>
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

    <!-- 上传合同弹框 -->
    <el-dialog
      title="上传合同"
      :visible.sync="uploadContractDialogVisible"
      width="520px"
      :close-on-click-modal="false"
      @close="closeUploadContractDialog"
    >
      <el-form ref="uploadContractForm" :model="uploadContractForm" label-width="100px" class="upload-contract-form">
        <el-form-item label="合同文件:">
          <div class="contract-upload-row">
            <el-button type="primary" @click="triggerContractFileInput">上传文件</el-button>
            <input
              ref="contractFileInput"
              type="file"
              accept=".pdf,.doc,.docx"
              class="contract-file-input"
              @change="onContractFileChange"
            />
            <span class="contract-file-name">{{ uploadContractForm.fileName || '未选择文件' }}</span>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitUploadContract">提交</el-button>
        <el-button @click="uploadContractDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import { UPLOAD_ROOT } from "@/config/env.js";

const LIST_API = "/getPurchaseMaterialOrderList";
const SET_CONTRACT_API = "/setPurchaseMaterialContract";
const FINISH_PURCHASE_API = "/finishPurchaseMaterialOrder";

export default {
  name: "MaterialPurchase",
  data() {
    return {
      queryParams: {
        keyword: "",
        dateRange: null,
        pageNum: 1,
        pageSize: 20
      },
      total: 0,
      tableHeight: 0,
      statusTab: "pending",
      statusTabs: [
        { label: "待审核", value: "pending" },
        { label: "待付款", value: "pending_payment" },
        { label: "待采购", value: "to_purchase" },
        { label: "质检入库中", value: "qc_ing" },
        { label: "已完成", value: "completed" },
        { label: "审核未通过", value: "rejected" }
      ],
      tableData: [],
      // 上传合同弹框
      uploadContractDialogVisible: false,
      uploadContractRow: null,
      uploadContractForm: {
        file: null,
        fileName: ""
      }
    };
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
        this.tableHeight = Math.max(
          window.innerHeight - tableOffsetTop - 80,
          200
        );
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
    _orderStatusByTab(tab) {
      const map = {
        pending: 1, // 生产副总审核
        pending_payment: 3, // 待财务付款
        to_purchase: 4, // 待采购
        qc_ing: 5, // 质检入库
        completed: 6, // 已完成
        rejected: -1 // 审核未通过
      };
      return map[tab] != null ? map[tab] : "";
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
    loadList() {
      const [start_time = "", end_time = ""] = this.queryParams.dateRange || [];
      const params = {
        limit: String(this.queryParams.pageSize),
        page: String(this.queryParams.pageNum),
        orderStatus: String(this._orderStatusByTab(this.statusTab)),
        keyword: this.queryParams.keyword || "",
        start_time: start_time || "",
        end_time: end_time || "",
        // 后端要求必传：原料=1，外购包装=2（库管入库时不需要传）
        materialType: "1",
        // 采购端该页不以付款状态为筛选项，按接口要求占位传空
        isPay: ""
      };
      this.$api({
        url: LIST_API,
        method: "post",
        data: params
      })
        .then(res => {
          if (res && res.code === 200 && res.data) {
            const list = Array.isArray(res.data.list) ? res.data.list : [];
            this.tableData = list.map(it => ({
              ...it,
              purchaseNo: it.purchaseNo,
              purchaseName: it.title,
              orderAmount: it.price,
              // 保留 status 字段给旧逻辑兼容（操作列判断等），同时状态列改用 orderStatus 枚举展示
              status: this.orderStatusText(it.orderStatus),
             submitTime: it.created_at
            }));
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
      this.queryParams.pageNum = 1;
      this.loadList();
    },
    handleView(row) {
      this.$router.push({
        path: "/purchase/material-purchase/detail",
        query: { id: row.id }
      });
    },
    handleAdd() {
      this.$router.push({ name: "material-purchase-add" });
    },
    handleEdit(row) {
      const id = row && row.id != null ? String(row.id) : "";
      if (!id) {
        this.$message.warning("缺少采购单id");
        return;
      }
      // 编辑同新增页：带 id 进入 add 页
      this.$router.push({ name: "material-purchase-add", query: { id } });
    },
    handleDelete(row) {
      this.$confirm("确定删除该采购单吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        // TODO: 调用删除接口
        this.$message.success("删除成功");
        this.loadList();
      }).catch(() => {});
    },
    handleUploadContract(row) {
      this.uploadContractRow = row;
      this.uploadContractDialogVisible = true;
    },
    closeUploadContractDialog() {
      this.uploadContractRow = null;
      this.uploadContractForm.file = null;
      this.uploadContractForm.fileName = "";
      this.$refs.contractFileInput && (this.$refs.contractFileInput.value = "");
    },
    triggerContractFileInput() {
      this.$refs.contractFileInput && this.$refs.contractFileInput.click();
    },
    onContractFileChange(e) {
      const file = e.target.files && e.target.files[0];
      if (file) {
        this.uploadContractForm.file = file;
        this.uploadContractForm.fileName = file.name;
      }
    },
    submitUploadContract() {
      if (!this.uploadContractForm.file) {
        this.$message.warning("请先选择合同文件");
        return;
      }
      const id = this.uploadContractRow && this.uploadContractRow.id != null ? String(this.uploadContractRow.id) : "";
      if (!id) {
        this.$message.warning("缺少采购单id");
        return;
      }
      const file = this.uploadContractForm.file;
      const formData = new FormData();
      formData.append("file", file);
      const token = localStorage.getItem("token");
      axios
        .post(UPLOAD_ROOT, formData, {
          headers: { Authorization: "Bearer " + token },
          timeout: 60000
        })
        .then(res => {
          const data = res.data || res;
          const payload = (data && data.data) ? data.data : data;
          const pdfUrl = (payload && (payload.path || payload.url)) || (data && data.path) || "";
          if (!pdfUrl) {
            this.$message.error("合同上传失败");
            return Promise.reject(new Error("no pdfUrl"));
          }
          return this.$api({
            url: SET_CONTRACT_API,
            method: "post",
            data: { id, pdfUrl }
          });
        })
        .then(res => {
          if (res && res.code === 200) {
            this.$message.success("上传成功");
            this.uploadContractDialogVisible = false;
            this.closeUploadContractDialog();
            this.loadList();
          } else {
            this.$message.error((res && res.msg) || "上传失败");
          }
        })
        .catch(err => {
          if (err && err.message === "no pdfUrl") return;
          this.$message.error((err && err.msg) ? err.msg : "上传失败");
        });
    },
    handleCompleteAndWarehouse(row) {
      const id = row && row.id != null ? String(row.id) : "";
      if (!id) {
        this.$message.warning("缺少采购单id");
        return;
      }
      this.$confirm("确认提交入库吗？提交后将进入入库流程。", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return this.$api({
            url: FINISH_PURCHASE_API,
            method: "post",
            data: { id }
          });
        })
        .then(res => {
          if (res && res.code === 200) {
            this.$message.success("提交成功");
            this.loadList();
          } else {
            this.$message.error((res && res.msg) || "提交失败");
          }
        })
        .catch(() => {});
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
.purchase-page {
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
  ::v-deep .el-form-item {
    margin-bottom: 0;
  }
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
  justify-content: space-between;
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
      &:hover {
        color: #606266;
      }
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
    .el-table__body tr.row-even td {
      background: #f3f7fa;
    }
    .el-table__body tr:hover > td {
      background: #f5f7fa !important;
    }
  }
  /* 状态标签：待审核-灰，审核未通过-红，其他-绿 */
  ::v-deep .el-tag--info.el-tag--plain {
    background-color: #f4f4f5;
    border-color: #e9e9eb;
    color: #909399;
  }
  ::v-deep .el-tag--danger.el-tag--plain {
    background-color: #fef0f0;
    border-color: #fde2e2;
    color: #f56c6c;
  }
  ::v-deep .el-tag--success.el-tag--plain {
    background-color: #f0f9eb;
    border-color: #e1f3d8;
    color: #67c23a;
  }
}
.row-acts {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 0 12px;
  .row-act {
    color: #3377fe;
    cursor: pointer;
    font-size: 14px;
    &:hover {
      text-decoration: underline;
    }
  }
}
.pagination-wrap {
  padding: 16px 24px;
  background: #fff;
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #ebeef5;
}

/* 上传合同弹框 */
.upload-contract-form {
  ::v-deep .el-form-item__label {
    color: #303133;
    font-size: 14px;
  }
}
.contract-upload-row {
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  .contract-file-input {
    position: absolute;
    left: 0;
    top: 0;
    width: 0;
    height: 0;
    opacity: 0;
    pointer-events: none;
  }
  .el-button--primary {
    background: linear-gradient(90deg, #157de9 0%, #3697fd 100%) !important;
    border: none;
  }
  .contract-file-name {
    font-size: 14px;
    color: #303133;
  }
}
::v-deep .el-dialog__footer {
  text-align: center;
  .el-button--primary {
    background: linear-gradient(90deg, #157de9 0%, #3697fd 100%) !important;
    border: none;
  }
  .el-button:not(.el-button--primary) {
    background: #fff;
    border-color: #dcdfe6;
    color: #606266;
  }
}
</style>
  