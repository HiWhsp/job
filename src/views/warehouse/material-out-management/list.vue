<template>
  <div class="view-wrap material-out-list-page">
    <!-- 搜索/筛选区域 -->
    <div class="search-section">
      <el-form :model="queryParams" ref="queryForm" inline class="search-form" label-width="80px">
        <el-form-item label="关键词" prop="keyword">
          <el-input
            v-model="queryParams.keyword"
            placeholder="出库单号/出库单名称"
            clearable
            style="width: 260px"
          />
        </el-form-item>
        <el-form-item label="时间筛选" prop="dateRange">
          <el-date-picker
            v-model="queryParams.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="yyyy-MM-dd"
            style="width: 340px"
          />
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
        <div class="table-title">原料出库管理</div>
        <div class="table-acts">
          <el-button size="small" @click="handleExport">导出</el-button>
          <el-button type="primary" size="small" @click="handleAdd">新增原料出库单</el-button>
        </div>
      </div>
      <div class="table-box">
        <el-table
          ref="tableRef"
          :height="tableHeight"
          :data="tableData"
          header-cell-class-name="table-header-cell"
          :row-class-name="tableRowClassName"
        >
          <el-table-column label="序号" width="70" align="center">
            <template slot-scope="scope">
              {{ String((queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1).padStart(3, '0') }}
            </template>
          </el-table-column>
          <el-table-column prop="outNo" label="出库单号" min-width="120" show-overflow-tooltip />
          <el-table-column prop="outName" label="出库单名称" min-width="120" show-overflow-tooltip />
          <el-table-column prop="remark" label="出库单备注" min-width="340" show-overflow-tooltip />
          <el-table-column prop="outTime" label="出库时间" width="120" align="center" />
          <el-table-column label="操作" width="120" align="center" fixed="right">
            <template slot-scope="{ row }">
              <span class="row-act" @click="handleViewDetail(row)">查看详情</span>
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

    <!-- 出库详情抽屉：从右到左打开，800px -->
    <el-drawer
      title="出库详情"
      :visible.sync="detailDrawerVisible"
      direction="rtl"
      size="800px"
      :before-close="closeDetailDrawer"
    >
      <div class="detail-drawer">
        <div class="detail-base-info">
          <div class="info-line">
            <div class="info-item">
              <span class="label">出库单号：</span>
              <span class="value">{{ detailInfo.outNo }}</span>
            </div>
            <div class="info-item">
              <span class="label">出库时间：</span>
              <span class="value">{{ detailInfo.outTime }}</span>
            </div>
          </div>
          <div class="info-line">
            <div class="info-item">
              <span class="label">出库单名称：</span>
              <span class="value">{{ detailInfo.outName }}</span>
            </div>
            <div class="info-item">
              <span class="label">出库单备注：</span>
              <span class="value">{{ detailInfo.remark }}</span>
            </div>
          </div>
        </div>

        <div class="detail-section">
          <el-table :data="detailMaterials" border header-cell-class-name="table-header-cell">
            <el-table-column label="序号" width="70" align="center">
              <template slot-scope="{ $index }">{{ String($index + 1).padStart(3, '0') }}</template>
            </el-table-column>
            <el-table-column prop="materialName" label="原料名称" min-width="160" show-overflow-tooltip />
            <el-table-column prop="spec" label="规格" min-width="140" show-overflow-tooltip />
            <el-table-column prop="unit" label="单位" width="80" align="center" />
            <el-table-column prop="quantity" label="本次出库数量" width="120" align="center" />
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
  name: 'WarehouseMaterialOutManagementList',
  data() {
    return {
      queryParams: {
        keyword: '',
        dateRange: null,
        pageNum: 1,
        pageSize: 20
      },
      total: 295,
      tableHeight: 0,
      tableData: Array.from({ length: 10 }, () => ({
        outNo: '4521414',
        outName: '出库单名称',
        remark: '出库单备注信息出库单备注信息出库单备注信息出库单备注信息出库单备注信息出库单备注信息出库单备注信息',
        outTime: '2026-01-05'
      })),
      detailDrawerVisible: false,
      detailInfo: {
        outNo: '',
        outTime: '',
        outName: '',
        remark: ''
      },
      detailMaterials: []
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
      return rowIndex % 2 === 1 ? 'row-even' : '';
    },
    loadList() {
      // TODO: 调用原料出库管理列表接口
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
      this.$message.info('导出');
    },
    handleAdd() {
      this.$router.push('/warehouse/material-out-management/add');
    },
    handleViewDetail(row) {
      // TODO: 可根据 row.id 请求详情接口，这里用示例数据
      this.detailInfo = { ...row };
      this.detailMaterials = Array.from({ length: 10 }, () => ({
        materialName: '原料名称1',
        spec: '98,A1,10mm',
        unit: '盒',
        quantity: 10
      }));
      this.detailDrawerVisible = true;
    },
    closeDetailDrawer(done) {
      if (typeof done === 'function') done();
      else this.detailDrawerVisible = false;
    }
  }
};
</script>

<style lang="less" scoped>
.material-out-list-page {
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

    .el-table__body tr:hover > td {
      background: #f5f7fa !important;
    }
  }
}

.row-act {
  color: #3377fe;
  cursor: pointer;
  font-size: 14px;
  &:hover {
    text-decoration: underline;
  }
}

.pagination-wrap {
  padding: 16px 24px;
  background: #fff;
  display: flex;
  justify-content: flex-end;
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
    flex: 1;
    min-width: 0;
    text-align: left;
    font-size: 14px;
    color: #333;
    display: flex;

    .label {
      color: #333;
      margin-right: 12px;
      min-width: 112px;
    }
  }
}

.detail-section {
  margin-top: 12px;
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
