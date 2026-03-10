<template>
  <div class="view-wrap inventory-check-page">
    <!-- 搜索/筛选区域 -->
    <div class="search-section">
      <el-form :model="queryParams" ref="queryForm" inline class="search-form" label-width="90px">
        <el-form-item label="盘点名称">
          <el-input
            v-model="queryParams.checkName"
            placeholder="请输入"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="盘点单号">
          <el-input
            v-model="queryParams.checkNo"
            placeholder="请输入"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="时间筛选">
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
        <div class="table-title">原料库存盘点</div>
        <div class="table-acts">
          <el-button type="primary" size="small" @click="handleAddCheck">新增盘点</el-button>
          <el-button size="small" @click="handleExport">导出</el-button>
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
          <el-table-column prop="checkNo" label="盘点单号" min-width="120" show-overflow-tooltip />
          <el-table-column prop="checkName" label="盘点名称" min-width="120" show-overflow-tooltip />
          <el-table-column prop="remark" label="备注" min-width="140" show-overflow-tooltip />
          <el-table-column prop="checkTime" label="盘点时间" width="120" align="center" />
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

    <!-- 新增盘点弹框 -->
    <el-dialog
      title="新增盘点"
      :visible.sync="addCheckDialogVisible"
      width="520px"
      :close-on-click-modal="false"
      @close="handleAddCheckDialogClose"
    >
      <el-form ref="addCheckForm" :model="addCheckForm" :rules="addCheckRules" label-width="100px">
        <el-form-item label="盘点名称：" prop="checkName">
          <el-input v-model="addCheckForm.checkName" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
          <el-input v-model="addCheckForm.remark" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="库存文件：" prop="inventoryFile">
          <div class="upload-file-row">
            <el-upload
              ref="uploadRef"
              :auto-upload="false"
              :limit="1"
              :on-change="handleFileChange"
              :on-remove="handleFileRemove"
              :file-list="addCheckForm.fileList"
            >
              <el-button size="small" type="primary">上传文件</el-button>
            </el-upload>
            <span v-if="addCheckForm.fileName" class="file-name">{{ addCheckForm.fileName }}</span>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleAddCheckSubmit">提交</el-button>
        <el-button @click="addCheckDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'WarehouseProductInventoryCheck',
  data() {
    return {
      queryParams: {
        checkName: '',
        checkNo: '',
        dateRange: null,
        pageNum: 1,
        pageSize: 20
      },
      total: 8,
      tableHeight: 0,
      tableData: [
        { id: 1, checkNo: '4578786954', checkName: '盘点名称', remark: '盘点备注文字', checkTime: '2026-1-15' },
        { id: 2, checkNo: '4578786954', checkName: '盘点名称', remark: '盘点备注文字', checkTime: '2026-1-15' },
        { id: 3, checkNo: '4578786954', checkName: '盘点名称', remark: '盘点备注文字', checkTime: '2026-1-15' },
        { id: 4, checkNo: '4578786954', checkName: '盘点名称', remark: '盘点备注文字', checkTime: '2026-1-15' },
        { id: 5, checkNo: '4578786954', checkName: '盘点名称', remark: '盘点备注文字', checkTime: '2026-1-15' },
        { id: 6, checkNo: '4578786954', checkName: '盘点名称', remark: '盘点备注文字', checkTime: '2026-1-15' },
        { id: 7, checkNo: '4578786954', checkName: '盘点名称', remark: '盘点备注文字', checkTime: '2026-1-15' },
        { id: 8, checkNo: '4578786954', checkName: '盘点名称', remark: '盘点备注文字', checkTime: '2026-1-15' }
      ],
      addCheckDialogVisible: false,
      addCheckForm: {
        checkName: '',
        remark: '',
        inventoryFile: null,
        fileName: '',
        fileList: []
      },
      addCheckRules: {
        checkName: [{ required: true, message: '请输入盘点名称', trigger: 'blur' }]
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
      // TODO: 调用产品库存盘点列表接口
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
    handleAddCheck() {
      this.addCheckDialogVisible = true;
    },
    handleViewDetail(row) {
      // TODO: 跳转盘点详情或打开详情抽屉
      this.$message.info('查看详情：' + row.checkNo);
    },
    handleExport() {
      // TODO: 导出
      this.$message.info('导出');
    },
    handleAddCheckDialogClose() {
      this.addCheckForm.checkName = '';
      this.addCheckForm.remark = '';
      this.addCheckForm.inventoryFile = null;
      this.addCheckForm.fileName = '';
      this.addCheckForm.fileList = [];
      this.$refs.addCheckForm && this.$refs.addCheckForm.resetFields();
    },
    handleFileChange(file) {
      this.addCheckForm.inventoryFile = file.raw;
      this.addCheckForm.fileName = file.name || '库存文件.excel';
    },
    handleFileRemove() {
      this.addCheckForm.inventoryFile = null;
      this.addCheckForm.fileName = '';
      this.addCheckForm.fileList = [];
    },
    handleAddCheckSubmit() {
      this.$refs.addCheckForm.validate(valid => {
        if (!valid) return;
        // TODO: 提交新增盘点接口，可带上 addCheckForm.checkName, addCheckForm.remark, addCheckForm.inventoryFile
        this.$message.success('提交成功');
        this.addCheckDialogVisible = false;
        this.handleAddCheckDialogClose();
        this.loadList();
      });
    }
  }
};
</script>

<style lang="less" scoped>
.inventory-check-page {
  background: #fff;
  border-radius: 8px;
  height: 100%;
}

.search-section {
  padding: 20px 24px;
  margin-bottom: 20px;
  text-align: left;
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

.upload-file-row {
  display: flex;
  align-items: center;
  gap: 12px;

  .file-name {
    font-size: 14px;
    color: #606266;
  }
}

::v-deep .el-dialog__footer {
  text-align: center;
}
</style>
