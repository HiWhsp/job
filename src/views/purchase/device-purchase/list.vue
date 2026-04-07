<template>
  <div class="view-wrap purchase-page">
    <!-- 搜索筛选 -->
    <div class="search-section">
      <el-form :model="queryParams" ref="queryForm" inline class="search-form" label-width="80px">
        <div class="search-row">
          <el-form-item label="关键词" prop="keyword">
            <el-input
              v-model="queryParams.keyword"
              placeholder="订单号"
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
              <el-option label="待审核" value="pending" />
              <el-option label="审核未通过" value="rejected" />
              <el-option label="待财务付款" value="pending_payment" />
              <el-option label="采购中" value="purchasing" />
              <el-option label="采购完成" value="completed" />
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

    <!-- 标题 + 新增按钮 -->
    <div class="table-util-bar">
      <div class="list-title">设备采购单</div>
      <el-button type="primary" @click="handleAdd">新增设备采购单</el-button>
    </div>

    <!-- 表格 -->
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
          <el-table-column prop="purchaseNo" label="采购单号" align="center" show-overflow-tooltip />
          <el-table-column prop="purchaseName" label="采购名称" align="center" show-overflow-tooltip />
          <el-table-column prop="amount" label="金额" align="center" />
          <el-table-column prop="status" label="状态" align="center">
            <template slot-scope="{ row }">
              <el-tag v-if="row.status === '待审核'" type="info" size="small" effect="plain">待审核</el-tag>
              <el-tag v-else-if="row.status === '审核未通过'" type="danger" size="small" effect="plain">审核未通过</el-tag>
              <el-tag v-else-if="row.status === '待财务付款'" type="success" size="small" effect="plain">待财务付款</el-tag>
              <el-tag v-else-if="row.status === '采购中'" type="success" size="small" effect="plain">采购中</el-tag>
              <el-tag v-else-if="row.status === '采购完成'" type="success" size="small" effect="plain">采购完成</el-tag>
              <span v-else>—</span>
            </template>
          </el-table-column>
          <el-table-column prop="submitTime" label="提交时间" align="center" />
          <el-table-column label="操作" width="220" align="left">
            <template slot-scope="{ row }">
              <span class="row-acts">
                <span class="row-act" @click="handleView(row)">查看详情</span>
                <template v-if="row.status === '待审核' || row.status === '审核未通过'">
                  <span class="row-act" @click="handleEdit(row)">编辑</span>
                  <span class="row-act" @click="handleDelete(row)">删除</span>
                </template>
                <span v-if="row.status === '采购中'" class="row-act" @click="handleComplete(row)">采购完成</span>
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
  </div>
</template>

<script>
const LIST_API = "/getPurchaseEquipmentOrderList";
const FINISH_API = "/finishPurchaseEquipmentOrder";
const DELETE_API = "/delPurchaseEquipmentOrder";

export default {
  name: "DevicePurchaseList",
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
      tableData: []
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
    _statusParam() {
      // 接口参数 status：1生产副总审核，2总经理审核，3待财务付款，4待采购，5已采购，-1审核未通过
      const map = {
        pending: "1",
        rejected: "-1",
        pending_payment: "3",
        purchasing: "4",
        completed: "5"
      };
      return map[this.queryParams.status] != null ? map[this.queryParams.status] : "";
    },
    _statusTextByOrderStatus(v) {
      const s = Number(v);
      const map = {
        1: "待审核",
        2: "待审核",
        3: "待财务付款",
        4: "采购中",
        5: "采购完成",
        [-1]: "审核未通过"
      };
      return map[s] != null ? map[s] : (v != null ? String(v) : "—");
    },
    loadList() {
      const [start_time = "", end_time = ""] = this.queryParams.dateRange || [];
      const params = {
        limit: String(this.queryParams.pageSize),
        page: String(this.queryParams.pageNum),
        status: this._statusParam(),
        keyword: this.queryParams.keyword || "",
        start_time: start_time || "",
        end_time: end_time || "",
        // 按接口文档必传，但该页面没有付款筛选，传空
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
              amount: it.price,
              status: this._statusTextByOrderStatus(it.orderStatus),
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
    handleAdd() {
      this.$router.push({ name: "device-purchase-add" });
    },
    handleView(row) {
      this.$router.push({
        path: "/purchase/device-purchase/detail",
        query: { id: row.id }
      });
    },
    handleEdit(row) {
      const id = row && row.id != null ? String(row.id) : "";
      if (!id) {
        this.$message.warning("缺少采购单id");
        return;
      }
      // 编辑同新增：进入 add 页并携带 id
      this.$router.push({ name: "device-purchase-add", query: { id } });
    },
    handleDelete(row) {
      this.$confirm("确定删除该采购单吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        // TODO: 调用删除接口
        this.$api({
          url: DELETE_API,
          method: "post",
          data: { id: row.id }
        }).then(res => {
          if (res && res.code === 200) {
            this.$message.success("删除成功");
            this.loadList();
          }
        }).catch(() => {});
      }).catch(() => {});
    },
    handleComplete(row) {
      this.$confirm("确定将该采购单标记为采购完成吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const id = row && row.id != null ? String(row.id) : "";
          if (!id) {
            this.$message.warning("缺少采购单id");
            return;
          }
          return this.$api({
            url: FINISH_API,
            method: "post",
            data: { id }
          });
        })
        .then(res => {
          if (!res) return;
          if (res.code === 200) {
            this.$message.success("操作成功");
            this.loadList();
          } else {
            this.$message.error(res.msg || "操作失败");
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
  margin-bottom: 16px;
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
.table-util-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 27px 16px;
  margin-bottom: 0;
  .list-title {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
    margin: 0;
  }
  .el-button--primary {
    background: linear-gradient(90deg, #157de9 0%, #3697fd 100%) !important;
    border: none;
  }
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
  justify-content: left;
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
</style>
