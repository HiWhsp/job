<template>
  <div class="view-wrap product-out-apply-page">
    <!-- 搜索/筛选区域 -->
    <div class="search-section">
      <el-form :model="queryParams" ref="queryForm" inline class="search-form" label-width="80px">
        <el-form-item label="关键词" prop="keyword">
          <el-input v-model="queryParams.keyword" placeholder="出库单号/订单编号/客户名称" clearable style="width: 260px" />
        </el-form-item>
        <el-form-item label="时间筛选" prop="dateRange">
          <el-date-picker v-model="queryParams.dateRange" type="daterange" range-separator="至" start-placeholder="开始时间"
            end-placeholder="结束时间" value-format="yyyy-MM-dd" style="width: 340px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">搜索</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格区域 -->
    <div class="table-view">
      <div class="table-util-bar">
        <div class="table-title">产品出库申请</div>
        <div class="table-acts">
          <el-button size="small" @click="handleExport">导出</el-button>
        </div>
      </div>
      <div class="table-box">
        <el-table ref="tableRef" :height="tableHeight" :data="tableData" header-cell-class-name="table-header-cell"
          :row-class-name="tableRowClassName">
          <el-table-column label="序号" width="70" align="center">
            <template slot-scope="scope">
              {{ String((queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1).padStart(3, '0') }}
            </template>
          </el-table-column>
          <el-table-column prop="outNo" label="出库单号" min-width="110" show-overflow-tooltip />
          <el-table-column prop="customerName" label="客户名称" min-width="160" show-overflow-tooltip />
          <el-table-column prop="region" label="属地" width="90" align="center" />
          <el-table-column prop="receiveAddress" label="收货地址" min-width="220" show-overflow-tooltip />
          <el-table-column prop="orderNo" label="所属订单号" min-width="120" show-overflow-tooltip />
          <el-table-column prop="applyTime" label="申请时间" width="120" align="center" />
          <el-table-column label="操作" width="260" align="center" fixed="right">
            <template slot-scope="{ row }">
              <span class="row-acts">
                <span class="row-act" @click="handleViewDetail(row)">查看详情</span>
                <span class="row-act" @click="handleShip(row)">立即发货</span>
                <span class="row-act" @click="handleUploadQc(row)">上传出库质检单</span>
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

    <!-- 发货弹框 -->
    <el-dialog title="发货" :visible.sync="shipDialogVisible" width="560px" :close-on-click-modal="false"
      @close="handleShipDialogClose">
      <el-form ref="shipFormRef" :model="shipForm" label-width="90px">
        <el-form-item label="物流单号：">
          <el-input v-model="shipForm.logisticsNo" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="发货照片：">
          <el-upload class="ship-photo-uploader" action="#" :auto-upload="false" list-type="picture-card" :limit="1"
            :file-list="shipForm.photoList" :on-change="handleShipPhotoChange" :on-remove="handleShipPhotoRemove">
            <i class="el-icon-plus"></i>
            <div class="upload-plus-text">添加照片</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitShip">提交</el-button>
        <el-button @click="shipDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>

    <!-- 出库详情抽屉：从右到左打开，800px -->
    <el-drawer title="出库详情" :visible.sync="detailDrawerVisible" direction="rtl" size="800px"
      :before-close="closeDetailDrawer">
      <div class="detail-drawer">
        <div class="detail-base-info">
          <div class="info-line">
            <div class="info-item"><span class="label">出库单号：</span><span class="value">{{ detailInfo.outNo }}</span>
            </div>
            <div class="info-item"><span class="label">出库时间：</span><span class="value">{{ detailInfo.outTime }}</span>
            </div>
          </div>

          <div class="info-line">
            <div class="info-item"><span class="label">所属订单号：</span><span class="value">{{ detailInfo.orderNo }}</span>
            </div>
            <div class="info-item"><span class="label">客户名称：</span><span class="value">{{ detailInfo.customerName
                }}</span>
            </div>
          </div>

          <div class="info-line">
            <div class="info-item"><span class="label">属地：</span><span class="value">{{ detailInfo.region }}</span>
            </div>
            <div class="info-item"><span class="label">收货地址：</span><span class="value">{{ detailInfo.receiveAddress
                }}</span></div>
          </div>
          <div class="info-line">
            <div class="info-item"><span class="label">收货人：</span><span class="value">{{ detailInfo.receiver }}</span>
            </div>
            <div class="info-item"><span class="label">收货人联系方式方式：</span><span class="value">{{ detailInfo.receiverPhone
                }}</span></div>
          </div>
        </div>

        <div class="detail-section">
          <div class="section-title"><span class="section-bar"></span><span>产品信息</span></div>
          <el-table :data="detailProducts" border header-cell-class-name="table-header-cell">
            <el-table-column label="序号" width="70" align="center">
              <template slot-scope="{ $index }">{{ String($index + 1).padStart(3, '0') }}</template>
            </el-table-column>
            <el-table-column prop="productName" label="产品名称" min-width="140" show-overflow-tooltip />
            <el-table-column prop="spec" label="规格" min-width="120" show-overflow-tooltip />
            <el-table-column prop="unit" label="单位" width="80" align="center" />
            <el-table-column prop="quantity" label="出库数量" width="120" align="center" />
          </el-table>
        </div>

        <div class="detail-section">
          <div class="section-title"><span class="section-bar"></span><span>外购产品</span></div>
          <el-table :data="detailOutsourcedProducts" border header-cell-class-name="table-header-cell">
            <el-table-column label="序号" width="70" align="center">
              <template slot-scope="{ $index }">{{ String($index + 1).padStart(3, '0') }}</template>
            </el-table-column>
            <el-table-column prop="productName" label="产品名称" min-width="140" show-overflow-tooltip />
            <el-table-column prop="spec" label="规格" min-width="120" show-overflow-tooltip />
            <el-table-column prop="unit" label="单位" width="80" align="center" />
            <el-table-column prop="quantity" label="出库数量" width="120" align="center" />
          </el-table>
        </div>

        <div class="detail-footer">
          <el-button type="primary" @click="detailDrawerVisible = false">确定</el-button>
          <el-button @click="detailDrawerVisible = false">取消</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "WarehouseProductOutApply",
  data() {
    return {
      queryParams: {
        keyword: "",
        dateRange: null,
        pageNum: 1,
        pageSize: 20
      },
      total: 7,
      tableHeight: 0,
      tableData: [
        {
          id: 1,
          outNo: "4521414",
          customerName: "浙江求实医疗科技有限公司",
          region: "国内",
          receiveAddress: "浙江省嘉兴市嘉善县天凝镇天凝大道666号",
          orderNo: "2026001-999",
          applyTime: "2026-01-05"
        },
        {
          id: 2,
          outNo: "4521414",
          customerName: "浙江求实医疗科技有限公司",
          region: "国外",
          receiveAddress: "国外地址",
          orderNo: "2026001-999",
          applyTime: "2026-01-05"
        },
        {
          id: 3,
          outNo: "4521414",
          customerName: "浙江求实医疗科技有限公司",
          region: "国内",
          receiveAddress: "浙江省嘉兴市嘉善县天凝镇天凝大道666号",
          orderNo: "2026001-999",
          applyTime: "2026-01-05"
        },
        {
          id: 4,
          outNo: "4521414",
          customerName: "浙江求实医疗科技有限公司",
          region: "国内",
          receiveAddress: "浙江省嘉兴市嘉善县天凝镇天凝大道666号",
          orderNo: "2026001-999",
          applyTime: "2026-01-05"
        },
        {
          id: 5,
          outNo: "4521414",
          customerName: "浙江求实医疗科技有限公司",
          region: "国内",
          receiveAddress: "浙江省嘉兴市嘉善县天凝镇天凝大道666号",
          orderNo: "2026001-999",
          applyTime: "2026-01-05"
        },
        {
          id: 6,
          outNo: "4521414",
          customerName: "浙江求实医疗科技有限公司",
          region: "国内",
          receiveAddress: "浙江省嘉兴市嘉善县天凝镇天凝大道666号",
          orderNo: "2026001-999",
          applyTime: "2026-01-05"
        },
        {
          id: 7,
          outNo: "4521414",
          customerName: "浙江求实医疗科技有限公司",
          region: "国内",
          receiveAddress: "浙江省嘉兴市嘉善县天凝镇天凝大道666号",
          orderNo: "2026001-999",
          applyTime: "2026-01-05"
        }
      ],
      shipDialogVisible: false,
      currentShipRow: null,
      shipForm: {
        logisticsNo: "",
        photoList: []
      },
      detailDrawerVisible: false,
      detailInfo: {
        outNo: "",
        outTime: "",
        orderNo: "",
        region: "",
        customerName: "",
        receiveAddress: "",
        receiver: "",
        receiverPhone: ""
      },
      detailProducts: [],
      detailOutsourcedProducts: []
    };
  },
  mounted() {
    this.setView();
    this.loadList();
  },
  methods: {
    setView() {
      this.$nextTick(() => {
        const refTable = this.$refs.tableRef;
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
    loadList() {
      // TODO: 调用产品出库申请列表接口
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
    handleSizeChange(val) {
      this.queryParams.pageSize = val;
      this.loadList();
    },
    handleCurrentChange(val) {
      this.queryParams.pageNum = val;
      this.loadList();
    },
    handleExport() {
      // TODO: 导出
      this.$message.info("导出");
    },
    handleShip(row) {
      this.currentShipRow = row;
      this.shipForm.logisticsNo = "";
      this.shipForm.photoList = [];
      this.shipDialogVisible = true;
    },
    handleShipDialogClose() {
      this.currentShipRow = null;
      this.shipForm.logisticsNo = "";
      this.shipForm.photoList = [];
    },
    handleShipPhotoChange(file, fileList) {
      this.shipForm.photoList = fileList.slice(-1);
    },
    handleShipPhotoRemove(file, fileList) {
      this.shipForm.photoList = fileList;
    },
    submitShip() {
      // TODO: 调用立即发货接口 this.currentShipRow.id, shipForm
      this.$message.success("提交成功");
      this.shipDialogVisible = false;
    },
    handleUploadQc(row) {
      // TODO: 上传出库质检单
      this.$message.info("上传出库质检单：" + row.outNo);
    },
    handleViewDetail(row) {
      // TODO: 可根据 row.id 请求出库详情，这里用示例数据
      this.detailInfo = {
        outNo: "2026001",
        outTime: "2026-01-05",
        orderNo: row.orderNo || "2026001-999",
        region: row.region || "国内",
        customerName: row.customerName || "浙江求实医疗科技有限公司",
        receiveAddress: row.receiveAddress || "浙江省嘉兴市嘉善县天凝镇天凝大道666号",
        receiver: "郭菲菲",
        receiverPhone: "15931263178"
      };
      this.detailProducts = Array.from({ length: 5 }, () => ({
        productName: "单层牙齿盘",
        spec: "98,A1,10mm",
        unit: "盒",
        quantity: 10
      }));
      this.detailOutsourcedProducts = Array.from({ length: 5 }, () => ({
        productName: "单层牙齿盘",
        spec: "98,A1,10mm",
        unit: "盒",
        quantity: 10
      }));
      this.detailDrawerVisible = true;
    },
    closeDetailDrawer(done) {
      if (typeof done === "function") done();
      else this.detailDrawerVisible = false;
    }
  }
};
</script>

<style lang="less" scoped>
.product-out-apply-page {
  background: #fff;
  border-radius: 8px;
}

.search-section {
  text-align: left;
  padding: 20px 24px;
  margin-bottom: 20px;
}

.search-form {
  ::v-deep .el-form-item {
    margin-bottom: 0;
    margin-right: 16px;
  }

  ::v-deep .el-form-item__label {
    color: #303133;
    font-size: 14px;
  }

  ::v-deep .el-input__inner,
  ::v-deep .el-date-editor {
    border-radius: 4px;
    border-color: #dcdfe6;
  }

  .el-button--primary {
    background: linear-gradient(90deg, #157de9 0%, #3697fd 100%) !important;
    border: none;
  }

  .el-button:not(.el-button--primary) {
    background: #fff;
    border: 1px solid #dcdfe6;
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
  padding-bottom: 20px;
  margin: 0 27px 25px;
  background: #fff;
  border-bottom: 1px solid #edf0f6;

  .table-title {
    font-family: Microsoft YaHei, Microsoft YaHei;
    font-weight: bold;
    font-size: 16px;
    color: #333333;
  }

  .table-acts {
    display: flex;
    align-items: center;
    gap: 10px;

    .el-button--primary {
      background: linear-gradient(90deg, #157de9 0%, #3697fd 100%) !important;
      border: none;
    }

    .el-button:not(.el-button--primary) {
      background: #fff;
      border: 1px solid #dcdfe6;
      color: #606266;
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

    .el-table__body tr:hover>td {
      background: #f5f7fa !important;
    }
  }
}

.row-acts {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;

  .row-act {
    color: #3377fe;
    cursor: pointer;
    font-size: 14px;

    &:hover {
      text-decoration: underline;
    }

    &+.row-act::before {
      content: '';
      display: inline-block;
      width: 1px;
      height: 12px;
      background: #dcdfe6;
      margin: 0 8px;
      vertical-align: middle;
    }
  }
}

.pagination-wrap {
  padding: 16px 24px;
  background: #fff;
  display: flex;
  justify-content: flex-end;
}

::v-deep .el-dialog__footer {
  text-align: center;
}

.ship-photo-uploader {
  ::v-deep .el-upload--picture-card {
    width: 120px;
    height: 120px;
    line-height: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  ::v-deep .el-icon-plus {
    font-size: 26px;
    color: #909399;
  }

  .upload-plus-text {
    margin-top: 10px;
    color: #909399;
    font-size: 12px;
  }
}

/* 详情抽屉 */
::v-deep .el-drawer__header {
  height: 60px;
  line-height: 60px;
  font-size: 18px;
  color: #333;
  font-weight: bold;
  text-align: left;
  border-bottom: 1px solid #eeeeee;
  padding: 0 16px;
}

.detail-drawer {
  padding: 0 24px 20px;
  height: 100%;
  overflow: auto;
}

.detail-base-info {
  padding: 16px 0 6px;

  .info-line {
    display: flex;
    align-items: flex-start;
    margin-bottom: 10px;
  }

  .info-item {
    min-width: 300px;
    text-align: left;
    font-size: 14px;
    color: #333;
    display: flex;
    align-items: start;

    .label {
      color: #333;
      min-width: 112px;
      display: inline-block;
    }

    .value {
      margin-left: 12px;
      color: #333;
    }
  }
}

.detail-section {
  margin-top: 18px;
}

.section-title {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
  color: #2373c8;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e5e5;

  .section-bar {
    width: 8px;
    height: 20px;
    background: #2373c8;
    border-radius: 2px;
    margin-right: 8px;
  }
}

.detail-footer {
  margin-top: 24px;
  padding: 20px 0 10px;
  text-align: right;
  border-top: 1px solid #eeeeee;

  .el-button--primary {
    background: #2373c8 !important;
    border: none;
  }

  .el-button:not(.el-button--primary) {
    background: #fff;
    border: 1px solid #b8b8b8;
    color: #6a6a6a;
  }
}
</style>
