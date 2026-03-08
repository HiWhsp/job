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
          <el-table-column prop="purchaseNo" label="采购单号" min-width="120" show-overflow-tooltip />
          <el-table-column prop="purchaseName" label="采购单名称" min-width="140" show-overflow-tooltip />
          <el-table-column prop="orderAmount" label="订单金额" min-width="110" align="right" />
          <el-table-column prop="status" label="状态" width="120" align="center">
            <template slot-scope="{ row }">
              <el-tag v-if="row.status === '待审核'" type="info" size="small" effect="plain">待审核</el-tag>
              <el-tag v-else-if="row.status === '审核未通过'" type="danger" size="small" effect="plain">审核未通过</el-tag>
              <el-tag v-else-if="row.status === '财务付款中'" type="success" size="small" effect="plain">财务付款中</el-tag>
              <el-tag v-else-if="row.status === '待采购'" type="success" size="small" effect="plain">待采购</el-tag>
              <el-tag v-else-if="row.status === '质检入库中'" type="success" size="small" effect="plain">质检入库中</el-tag>
              <el-tag v-else-if="row.status === '已完成'" type="success" size="small" effect="plain">已完成</el-tag>
              <span v-else>—</span>
            </template>
          </el-table-column>
          <el-table-column prop="submitTime" label="提交时间" width="120" align="center" />
          <el-table-column label="操作" min-width="280" align="center" fixed="right">
            <template slot-scope="{ row }">
              <span class="row-acts">
                <span class="row-act" @click="handleView(row)">查看详情</span>
                <template v-if="row.status === '待审核' || row.status === '审核未通过'">
                  <span class="row-act" @click="handleEdit(row)">编辑</span>
                  <span class="row-act" @click="handleDelete(row)">删除</span>
                </template>
                <template v-if="row.status === '待采购'">
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
      tableData: [
        { id: 1, purchaseNo: "4521414", purchaseName: "采购单名称", orderAmount: "5000.00", status: "待审核", submitTime: "2026-01-05" },
        { id: 2, purchaseNo: "4521414", purchaseName: "采购单名称", orderAmount: "5000.00", status: "待审核", submitTime: "2026-01-05" },
        { id: 3, purchaseNo: "4521414", purchaseName: "采购单名称", orderAmount: "5000.00", status: "审核未通过", submitTime: "2026-01-05" },
        { id: 4, purchaseNo: "4521414", purchaseName: "采购单名称", orderAmount: "5000.00", status: "财务付款中", submitTime: "2026-01-05" },
        { id: 5, purchaseNo: "4521414", purchaseName: "采购单名称", orderAmount: "5000.00", status: "待采购", submitTime: "2026-01-05" },
        { id: 6, purchaseNo: "4521414", purchaseName: "采购单名称", orderAmount: "5000.00", status: "质检入库中", submitTime: "2026-01-05" }
      ],
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
    loadList() {
      // TODO: 调用原料采购列表接口
      this.total = this.tableData.length;
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
      // TODO: 跳转编辑页
      this.$message.info("编辑：" + row.purchaseNo);
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
      // TODO: 调用上传接口，传入 this.uploadContractRow.id 与 this.uploadContractForm.file
      this.$message.success("上传成功");
      this.uploadContractDialogVisible = false;
      this.closeUploadContractDialog();
      this.loadList();
    },
    handleCompleteAndWarehouse(row) {
      // TODO: 采购完成并提交入库
      this.$message.info("采购完成并提交入库：" + row.purchaseNo);
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
  justify-content: center;
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
  