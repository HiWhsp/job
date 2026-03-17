<template>
  <div class="view-wrap external-product-purchase-page">
    <!-- 搜索/筛选区域 -->
    <div class="search-section">
      <el-form :model="queryParams" ref="queryForm" inline class="search-form" label-width="80px">
        <div class="search-row">
          <el-form-item label="关键词" prop="keyword">
            <el-input
              v-model="queryParams.keyword"
              placeholder="采购单号/订单号/客户名称"
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

    <!-- 表格区域 -->
    <div class="table-view">
      <div class="table-util-bar">
        <div class="table-tabs">
          <div
            v-for="(tab, index) in statusTabs"
            :key="index"
            class="tab-item"
            :class="{ active: statusTab === tab.value }"
            @click="handleStatusTabChange(tab.value)"
          >{{ tab.label }}</div>
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
            <template slot-scope="scope">
              {{ String((queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1).padStart(3, '0') }}
            </template>
          </el-table-column>
          <el-table-column prop="purchaseNo" label="外购请购单单号" align="center" show-overflow-tooltip />
          <el-table-column prop="staffOrderNo" label="所属订单号" align="center" show-overflow-tooltip />
          <el-table-column prop="customerTitle" label="客户名称" align="center" show-overflow-tooltip />
          <el-table-column prop="price" label="订单金额" align="center">
            <template slot-scope="{ row }">{{ row.price }}</template>
          </el-table-column>
          <el-table-column prop="orderStatus" label="状态" width="100" align="center">
            <template slot-scope="{ row }">
              <el-tag :type="orderStatusTagType(row.orderStatus)" size="small" effect="light">
                {{ orderStatusText(row.orderStatus) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="updated_at" label="提交时间" width="160" align="center" />
          <el-table-column label="操作" width="220" align="center">
            <template slot-scope="{ row }">
              <span class="row-acts">
                <span class="row-act" @click="handleView(row)">查看详情</span>
                <span v-if="String(row.orderStatus) === '2'" class="row-act" @click="handleAudit(row)">立即审核</span>
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
      width="480px"
      :close-on-click-modal="false"
      @close="closeAuditDialog"
    >
      <el-form label-width="100px">
        <el-form-item label="审核状态:" style="text-align: left;">
          <el-radio-group v-model="auditChoice">
            <el-radio label="pass">通过</el-radio>
            <el-radio label="reject">不通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核备注:">
          <el-input
            v-model="auditRemark"
            placeholder="请输入"
            clearable
            type="textarea"
            :rows="3"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitAudit">提交</el-button>
        <el-button @click="closeAuditDialog">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
  
<script>
const LIST_API = "/getPurchaseForeignProductOrderList";
const REVIEW_API = "/reviewForeignProductOrder";

export default {
  name: "ExternalProductPurchaseList",
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
      statusTab: "2", // orderStatus：1生产副总审核,2总经理审核,3待财务付款,4待采购,5质检入库,6已完成,-1审核未通过
      statusTabs: [
        { label: "待审核", value: "2" },
        { label: "已审核", value: "4" },
        { label: "审核未通过", value: "-1" }
      ],
      tableData: [],
      auditDialogVisible: false,
      rowToAudit: null,
      auditChoice: "pass",
      auditRemark: ""
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
      const [start_time = "", end_time = ""] = this.queryParams.dateRange || [];
      const params = {
        page: String(this.queryParams.pageNum),
        limit: String(this.queryParams.pageSize),
        orderStatus: String(this.statusTab || ""),
        keyword: this.queryParams.keyword || "",
        start_time: start_time || "",
        end_time: end_time || ""
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
    handleStatusTabChange(value) {
      this.statusTab = value;
      this.queryParams.pageNum = 1;
      this.loadList();
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
        path: "/general-manager/external-product-purchase/detail",
        query: { id: row.id }
      });
    },
    handleAudit(row) {
      this.rowToAudit = row;
      this.auditChoice = "pass";
      this.auditRemark = "";
      this.auditDialogVisible = true;
    },
    closeAuditDialog() {
      this.auditDialogVisible = false;
      this.rowToAudit = null;
      this.auditChoice = "pass";
      this.auditRemark = "";
    },
    submitAudit() {
      if (!this.rowToAudit) return;
      const id = this.rowToAudit.id;
      const status = this.auditChoice === "pass" ? "1" : "-1";
      const cont = (this.auditRemark || "").trim();
      if (status === "-1" && !cont) {
        this.$message.warning("驳回时请填写审核原因");
        return;
      }

      this.$api({
        url: REVIEW_API,
        method: "post",
        data: { id: String(id), status, cont }
      })
        .then(res => {
          if (res && res.code === 200) {
            this.$message.success(status === "1" ? "审核通过" : "审核驳回");
            this.closeAuditDialog();
            this.loadList();
          } else {
            this.$message.error((res && res.msg) || "提交失败");
          }
        })
        .catch(err => {
          this.$message.error((err && err.msg) ? err.msg : "提交失败");
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
.external-product-purchase-page {
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

  ::v-deep .el-input__inner,
  ::v-deep .el-select .el-input__inner {
    border-radius: 4px;
    border-color: #dcdfe6;
  }

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

  /* 状态标签：待审核-灰底白字，审核未通过-红底白字，已审核-绿底白字 */
  ::v-deep .el-tag--info {
    background-color: #909399;
    border-color: #909399;
    color: #fff;
  }
  ::v-deep .el-tag--danger {
    background-color: #f56c6c;
    border-color: #f56c6c;
    color: #fff;
  }
  ::v-deep .el-tag--success {
    background-color: #67c23a;
    border-color: #67c23a;
    color: #fff;
  }
}

.row-acts {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0 8px;

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
  justify-content: right;
  border-top: 1px solid #ebeef5;
}

::v-deep .el-dialog__footer {
  text-align: center;
}
</style>
  