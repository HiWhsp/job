<template>
  <div class="view-wrap purchase-order-list-page">
    <!-- 搜索筛选 -->
    <div class="search-section">
      <el-form :model="queryParams" ref="queryForm" inline class="search-form" label-width="80px">
        <div class="search-row">
          <el-form-item label="关键词" prop="keyword">
            <el-input v-model="queryParams.keyword" placeholder="采购单单号/订单号" clearable style="width: 260px" />
          </el-form-item>
          <el-form-item label="状态" prop="orderStatus">
            <el-select v-model="queryParams.orderStatus" placeholder="请选择" clearable style="width: 180px">
              <el-option label="待审核" value="1,2" />
              <el-option label="待采购" value="4" />
              <el-option label="质检入库中" value="5" />
              <el-option label="已完成" value="6" />
              <el-option label="审核未通过" value="-1" />
            </el-select>
          </el-form-item>
          <el-form-item label="付款状态" prop="isPay">
            <el-select v-model="queryParams.isPay" placeholder="请选择" clearable style="width: 140px">
              <el-option label="未付款" value="99" />
              <el-option label="已付款" value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="时间筛选" prop="dateRange">
            <el-date-picker v-model="queryParams.dateRange" type="daterange" range-separator="-"
              start-placeholder="开始时间" end-placeholder="结束时间" clearable style="width: 236px"
              value-format="yyyy-MM-dd" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleQuery">搜索</el-button>
            <el-button @click="resetQuery">重置</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <!-- 列表标题 -->
    <div class="list-title">外采包装采购单</div>

    <!-- 表格 -->
    <div class="table-view">
      <div class="table-box">
        <el-table ref="tableH" :height="tableHeight" :data="tableData" header-cell-class-name="table-header-cell"
          :row-class-name="tableRowClassName">
          <el-table-column prop="id" label="序号" width="70" align="center" />
          <el-table-column prop="purchaseNo" label="外采包装采购单单号" min-width="160" show-overflow-tooltip />
          <el-table-column prop="title" label="包装规格" min-width="120" show-overflow-tooltip />
          <el-table-column prop="allNum" label="数量" width="80" align="center" />
          <el-table-column prop="onePrice" label="金额" min-width="100" align="center" />
          <el-table-column prop="expectedTime" label="预计到货期" width="120" align="center" />
          <el-table-column prop="staffOrderNo" label="所属订单号" min-width="120" show-overflow-tooltip />
          <el-table-column prop="customerTitle" label="客户名称" min-width="200" show-overflow-tooltip />
          <el-table-column label="订单时间" width="180" align="center">
            <template slot-scope="{ row }">
              {{ row.staffOrderTime || row.orderTime || '—' }}
            </template>
          </el-table-column>
          <el-table-column label="订单金额" min-width="110" align="right">
            <template slot-scope="{ row }">
              {{ row.price != null ? row.price : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="状态" width="140" align="center">
            <template slot-scope="{ row }">
              <el-tag v-if="row.orderStatus != null && row.orderStatus !== ''"
                :type="orderStatusTagType(row.orderStatus)" size="small" effect="plain">{{
                  orderStatusText(row.orderStatus) }}</el-tag>
              <span v-else>—</span>
            </template>
          </el-table-column>
          <el-table-column label="提交时间" width="160" align="center">
            <template slot-scope="{ row }">
              {{ row.updated_at || row.created_at || '—' }}
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="180" align="center" fixed="right">
            <template slot-scope="{ row }">
              <span class="row-acts">
                <span class="row-act" @click="handleView(row)">查看详情</span>
                <span v-if="Number(row.orderStatus) === -1" class="row-act" @click="handleModify(row)">修改</span>
                <span v-if="Number(row.orderStatus) === 4" class="row-act" @click="handleComplete(row)">采购完成</span>
              </span>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-wrap">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="queryParams.pageNum" :page-sizes="[10, 20, 50, 100]" :page-size="queryParams.pageSize"
            layout="total, prev, pager, next, jumper" :total="total" />
        </div>
      </div>
    </div>

    <!-- 与 list.vue 一致：生成/修改采购单（修改时带采购单 id） -->
    <el-dialog
      :title="generateOrderDialogTitle"
      :visible.sync="generateOrderDialogVisible"
      width="480px"
      :close-on-click-modal="false"
      @close="closeGenerateOrderDialog"
    >
      <el-form
        ref="generateOrderForm"
        :model="generateOrderForm"
        :rules="generateOrderRules"
        label-width="100px"
        class="generate-order-form"
      >
        <el-form-item label="采购数量:" prop="quantity">
          <el-input v-model="generateOrderForm.quantity" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="采购单价:" prop="unitPrice">
          <el-input v-model="generateOrderForm.unitPrice" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="采购总金额:">
          <span class="total-amount">{{ totalAmountDisplay }}</span>
        </el-form-item>
        <el-form-item label="预计到货期:" prop="arrivalDate">
          <el-date-picker
            v-model="generateOrderForm.arrivalDate"
            type="date"
            placeholder="请选择"
            clearable
            value-format="yyyy-MM-dd"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitGenerateOrder">提交</el-button>
        <el-button @click="generateOrderDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
/** 采购单列表（原料/外购包装共用）；外购包装固定 materialType=2 */
const LIST_API = "/getPurchaseMaterialOrderList";
const FINISH_PURCHASE_API = "/finishPurchaseMaterialOrder";
/** 与 external-package-purchase/list.vue 一致 */
const ADD_PURCHASE_PACK_ORDER_API = "/addPurchaseMaterialPackOrder";

export default {
  name: "ExternalPackagePurchaseOrderList",
  data() {
    return {
      queryParams: {
        keyword: "",
        orderStatus: "",
        isPay: "",
        dateRange: null,
        pageNum: 1,
        pageSize: 20
      },
      total: 0,
      tableHeight: 0,
      tableData: [],
      generateOrderDialogVisible: false,
      generateOrderDialogTitle: "修改采购单",
      generateOrderRow: null,
      generateOrderForm: {
        quantity: "",
        unitPrice: "",
        arrivalDate: ""
      },
      generateOrderRules: {
        quantity: [{ required: true, message: "请输入采购数量", trigger: "blur" }],
        unitPrice: [{ required: true, message: "请输入采购单价", trigger: "blur" }],
        arrivalDate: [{ required: true, message: "请选择预计到货期", trigger: "change" }]
      }
    };
  },
  computed: {
    totalAmountDisplay() {
      const qty = Number(this.generateOrderForm.quantity);
      const price = Number(this.generateOrderForm.unitPrice);
      if (isNaN(qty) || isNaN(price) || qty < 0 || price < 0) return "0.00";
      return (qty * price).toFixed(2);
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
        window.onresize = function () {
          const top = tableEl.offsetTop + 84 + 80;
          that.tableHeight = Math.max(window.innerHeight - top, 200);
        };
      });
    },
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 === 1 ? "row-even" : "";
    },
    orderStatusText(v) {
      const s = Number(v);
      const map = {
        1: "待审核",
        2: "待审核",
        4: "待采购",
        5: "质检入库中",
        6: "已完成",
        [-1]: "审核未通过"
      };
      return map[s] != null ? map[s] : (v != null && v !== "" ? String(v) : "—");
    },
    orderStatusTagType(v) {
      const s = Number(v);
      if (s === 1 || s === 2) return "info";
      if (s === -1) return "danger";
      return "success";
    },
    loadList() {
      const [start_time = "", end_time = ""] = this.queryParams.dateRange || [];
      const params = {
        limit: String(this.queryParams.pageSize),
        page: String(this.queryParams.pageNum),
        orderStatus: String(this.queryParams.orderStatus || ""),
        keyword: this.queryParams.keyword || "",
        start_time: start_time || "",
        end_time: end_time || "",
        isPay: String(this.queryParams.isPay || ""),
        materialType: "2"
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
      this.queryParams.keyword = "";
      this.queryParams.orderStatus = "";
      this.queryParams.isPay = "";
      this.queryParams.dateRange = null;
      this.queryParams.pageNum = 1;
      this.loadList();
    },
    handleView(row) {
      // TODO: 若有采购单详情页，可跳转 /purchase/external-package-purchase/purchase-order-detail?id=xxx
      this.$router.push({
        path: "/purchase/external-package-purchase/purchase-order-detail",
        query: { id: row.id }
      });
    },
    /** 与 list.vue「生成采购单」同一弹框，用于驳回后重新编辑提交 */
    handleModify(row) {
      this.generateOrderDialogTitle = "修改采购单";
      this.generateOrderRow = row;
      this.generateOrderForm.quantity =
        row.allNum != null && row.allNum !== "" ? String(row.allNum) : "";
      const num = Number(row.allNum);
      const total = Number(row.price);
      if (row.onePrice != null && row.onePrice !== "") {
        this.generateOrderForm.unitPrice = String(row.onePrice);
      } else if (num > 0 && !Number.isNaN(total)) {
        this.generateOrderForm.unitPrice = (total / num).toFixed(2);
      } else {
        this.generateOrderForm.unitPrice = "";
      }
      this.generateOrderForm.arrivalDate = row.expectedTime || "";
      this.generateOrderDialogVisible = true;
      this.$nextTick(() => {
        this.$refs.generateOrderForm && this.$refs.generateOrderForm.clearValidate();
      });
    },
    closeGenerateOrderDialog() {
      this.generateOrderRow = null;
      this.generateOrderForm.quantity = "";
      this.generateOrderForm.unitPrice = "";
      this.generateOrderForm.arrivalDate = "";
      this.$refs.generateOrderForm && this.$refs.generateOrderForm.resetFields();
    },
    submitGenerateOrder() {
      this.$refs.generateOrderForm.validate(valid => {
        if (!valid) return;
        const row = this.generateOrderRow;
        if (!row) return;
        const staffOrderId =
          row.staffOrderId != null && row.staffOrderId !== ""
            ? String(row.staffOrderId)
            : "";
        if (!staffOrderId) {
          this.$message.warning("缺少业务订单 staffOrderId");
          return;
        }
        const purchaseOrderId = row.id != null ? String(row.id) : "";
        if (!purchaseOrderId) {
          this.$message.warning("缺少采购单 id");
          return;
        }
        const num = String(this.generateOrderForm.quantity || "");
        const unitPrice = Number(this.generateOrderForm.unitPrice) || 0;
        const expectedTime = String(this.generateOrderForm.arrivalDate || "");
        const price =
          (Number(this.generateOrderForm.quantity) || 0) * unitPrice;

        const data = {
          staffOrderId,
          num,
          expectedTime,
          price: String(price.toFixed(2)),
          id: purchaseOrderId
        };

        this.$api({ url: ADD_PURCHASE_PACK_ORDER_API, method: "post", data })
          .then(res => {
            if (res && res.code === 200) {
              this.$message.success("提交成功");
              this.generateOrderDialogVisible = false;
              this.closeGenerateOrderDialog();
              this.loadList();
            } else {
              this.$message.error((res && res.msg) || "提交失败");
            }
          })
          .catch(() => {
            this.$message.error("提交失败");
          });
      });
    },
    handleComplete(row) {
      const id = row && row.id != null ? String(row.id) : "";
      if (!id) {
        this.$message.warning("缺少采购单 id");
        return;
      }
      this.$confirm("确定将该采购单标记为采购完成吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() =>
          this.$api({
            url: FINISH_PURCHASE_API,
            method: "post",
            data: { id }
          })
        )
        .then(res => {
          if (res && res.code === 200) {
            this.$message.success("操作成功");
            this.loadList();
          } else {
            this.$message.error((res && res.msg) || "提交失败");
          }
        })
        .catch(() => { });
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
.purchase-order-list-page {
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

.list-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  padding: 0 27px 16px;
  margin-bottom: 0;
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

    .el-table__body tr:hover>td {
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

.generate-order-form {
  ::v-deep .el-form-item__label {
    color: #303133;
    font-size: 14px;
  }
  ::v-deep .el-input__inner {
    border-radius: 4px;
    border-color: #dcdfe6;
  }
  .total-amount {
    width: 100%;
    display: inline-block;
    font-size: 16px;
    color: #333;
    font-weight: bold;
    text-align: left;
  }
}
::v-deep .el-dialog__footer {
  text-align: right;
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
