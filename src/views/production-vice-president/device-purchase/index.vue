<template>
  <div class="view-wrap purchase-page">
    <div class="search-section">
      <el-form :model="queryParams" ref="queryForm" inline class="search-form" label-width="80px">
        <div class="search-row">
          <el-form-item label="关键词" prop="keyword">
            <el-input
              v-model="queryParams.keyword"
              placeholder="设备采购单单号/订单号"
              clearable
              style="width: 260px"
            />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="请选择"
              clearable
              style="width: 180px"
            >
              <el-option label="待审核" value="1" />
              <el-option label="总经理审核" value="2" />
              <el-option label="待财务付款" value="3" />
              <el-option label="待采购" value="4" />
              <el-option label="质检入库" value="5" />
              <el-option label="已完成" value="6" />
              <el-option label="审核未通过" value="-1" />
            </el-select>
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

    <div class="list-title">设备采购单</div>

    <div class="table-view">
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
              <el-tag v-else-if="row.status === '待采购'" type="success" size="small" effect="plain">待采购</el-tag>
              <el-tag v-else-if="row.status === '采购完成'" type="success" size="small" effect="plain">采购完成</el-tag>
              <el-tag v-else-if="row.status === '质检入库中'" type="success" size="small" effect="plain">质检入库中</el-tag>
              <el-tag v-else-if="row.status === '已完成'" type="success" size="small" effect="plain">已完成</el-tag>
              <span v-else>—</span>
            </template>
          </el-table-column>
          <el-table-column prop="submitTime" label="提交时间" width="120" align="center" />
          <el-table-column label="操作" min-width="200" align="center" fixed="right">
            <template slot-scope="{ row }">
              <span class="row-acts">
                <span class="row-act" @click="handleView(row)">查看详情</span>
                <span v-if="row.status === '待审核'" class="row-act" @click="handleAudit(row)">立即审核</span>
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

    <!-- 审核弹框 -->
    <el-dialog
      title="审核"
      :visible.sync="auditDialogVisible"
      width="520px"
      :close-on-click-modal="false"
      @close="closeAuditDialog"
    >
      <el-form ref="auditForm" :model="auditForm" label-width="100px" class="audit-form">
        <el-form-item label="审核:">
          <el-radio-group v-model="auditForm.result">
            <el-radio label="pass">通过</el-radio>
            <el-radio label="reject">未通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核备注:">
          <el-input
            v-model="auditForm.remark"
            placeholder="请输入"
            clearable
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitAudit">提交</el-button>
        <el-button @click="auditDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
const LIST_API = "/getPurchaseEquipmentOrderList";
const REVIEW_API = "/reviewPurchaseEquipmentOrder";

export default {
  name: "ProductionVicePresidentDevicePurchase",
  data() {
    return {
      queryParams: {
        keyword: "",
        status: "",
        dateRange: null,
        pageNum: 1,
        pageSize: 20
      },
      total: 0,
      tableHeight: 0,
      tableData: [],
      auditDialogVisible: false,
      auditRow: null,
      auditForm: {
        result: "reject",
        remark: ""
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
    _orderStatusText(v) {
      const s = Number(v);
      const map = {
        1: "待审核",
        2: "待审核",
        3: "待财务付款",
        4: "待采购",
        5: "质检入库中",
        6: "已完成",
        [-1]: "审核未通过"
      };
      return map[s] != null ? map[s] : (v != null ? String(v) : "—");
    },
    loadList() {
      const [start_time = "", end_time = ""] = this.queryParams.dateRange || [];
      const params = {
        page: String(this.queryParams.pageNum),
        limit: String(this.queryParams.pageSize),
        status: String(this.queryParams.status || ""),
        keyword: this.queryParams.keyword || "",
        start_time: start_time || "",
        end_time: end_time || "",
        isPay: ""
      };
      this.$api({ url: LIST_API, method: "post", data: params })
        .then(res => {
          if (res && res.code === 200 && res.data) {
            const list = Array.isArray(res.data.list) ? res.data.list : [];
            this.tableData = list.map(it => ({
              ...it,
              purchaseNo: it.purchaseNo,
              purchaseName: it.title,
              orderAmount: it.price,
              status: this._orderStatusText(it.orderStatus),
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
    handleView(row) {
      this.$router.push({
        path: "/production-vice-president/device-purchase/detail",
        query: { id: row.id }
      });
    },
    handleAudit(row) {
      this.auditRow = row;
      this.auditForm.result = "reject";
      this.auditForm.remark = "";
      this.auditDialogVisible = true;
    },
    closeAuditDialog() {
      this.auditRow = null;
      this.auditForm.result = "reject";
      this.auditForm.remark = "";
    },
    submitAudit() {
      if (this.auditForm.result === "reject" && !this.auditForm.remark.trim()) {
        this.$message.warning("审核未通过时请填写审核备注");
        return;
      }
      const id = this.auditRow && this.auditRow.id != null ? String(this.auditRow.id) : "";
      if (!id) {
        this.$message.warning("缺少采购单id");
        return;
      }
      const status = this.auditForm.result === "pass" ? "1" : "-1";
      this.$api({
        url: REVIEW_API,
        method: "post",
        data: {
          id,
          status,
          cont: this.auditForm.remark || ""
        }
      })
        .then(res => {
          if (res && res.code === 200) {
            this.$message.success("审核成功");
            this.auditDialogVisible = false;
            this.closeAuditDialog();
            this.loadList();
          } else {
            this.$message.error((res && res.msg) || "审核失败");
          }
        })
        .catch(() => {
          this.$message.error("审核失败");
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
.list-title {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
  padding: 0 27px 16px;
  text-align: left;
}
.table-view {
  overflow: hidden;
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
}

.audit-form {
  ::v-deep .el-form-item__label {
    color: #303133;
    font-size: 14px;
  }
  ::v-deep .el-input__inner {
    border-radius: 4px;
  }
  ::v-deep .el-radio-group {
    height: 38px;
    width: 100%;
    display: flex;
    align-items: center;
  }
  ::v-deep .el-radio {
    margin-right: 12px;
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
