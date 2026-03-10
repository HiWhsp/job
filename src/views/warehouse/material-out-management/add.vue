<template>
  <div class="view-wrap material-out-add-page">
    <div class="page-title">新增原料出库单</div>

    <div class="form-section">
      <el-form :model="form" ref="formRef" label-width="100px" class="base-form">
        <el-form-item label="出库单名称：">
          <el-input v-model="form.outName" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="出库单备注：">
          <el-input v-model="form.remark" placeholder="请输入" clearable />
        </el-form-item>
      </el-form>
    </div>

    <div class="table-section">
      <div class="section-bar">
        <div class="section-title">原料信息</div>
        <div class="section-acts">
          <el-button size="small" type="primary" @click="handleBatchDelete" :disabled="!multipleSelection.length">删除</el-button>
          <el-button type="primary" size="small" @click="openAddMaterialDialog">添加原料</el-button>
        </div>
      </div>

      <div class="table-box">
        <el-table
          ref="mainTableRef"
          :data="materials"
          border
          header-cell-class-name="table-header-cell"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="code" label="原料编号" min-width="120" show-overflow-tooltip />
          <el-table-column prop="name" label="原料名称" min-width="120" show-overflow-tooltip />
          <el-table-column prop="spec" label="规格" min-width="120" show-overflow-tooltip />
          <el-table-column label="数量" width="140" align="center">
            <template slot-scope="{ row }">
              <el-input v-model="row.quantity" size="small" style="width: 90px" />
            </template>
          </el-table-column>
          <el-table-column prop="categoryName" label="所属分类" min-width="120" show-overflow-tooltip />
          <el-table-column prop="unit" label="单位" width="80" align="center" />
          <el-table-column label="操作" width="100" align="center" fixed="right">
            <template slot-scope="{ $index }">
              <span class="row-act" @click="removeMaterial($index)">删除</span>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="page-footer">
        <el-button type="primary" @click="submit">提交</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </div>

    <!-- 添加原料弹框 -->
    <el-dialog
      title="添加原料"
      :visible.sync="addMaterialDialogVisible"
      width="1100px"
      :close-on-click-modal="false"
      @close="handleAddMaterialDialogClose"
    >
      <div class="dialog-search">
        <el-form :model="dialogQuery" ref="dialogQueryForm" inline class="search-form" label-width="70px">
          <el-form-item label="关键词">
            <el-input v-model="dialogQuery.keyword" placeholder="原料名称/原料编号" clearable style="width: 240px" />
          </el-form-item>
          <el-form-item label="原料分类">
            <el-select v-model="dialogQuery.categoryId" placeholder="请选择" clearable style="width: 220px">
              <el-option label="原料分类名称" value="1" />
              <el-option label="原料分类名称2" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleDialogQuery">搜索</el-button>
            <el-button @click="resetDialogQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-table
        ref="dialogTableRef"
        :data="dialogTableData"
        border
        height="480"
        header-cell-class-name="table-header-cell"
        @selection-change="handleDialogSelectionChange"
      >
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column prop="code" label="原料编码" min-width="120" show-overflow-tooltip />
        <el-table-column prop="name" label="原料名称" min-width="120" show-overflow-tooltip />
        <el-table-column prop="spec" label="规格" min-width="120" show-overflow-tooltip />
        <el-table-column prop="categoryName" label="所属分类" min-width="140" show-overflow-tooltip />
        <el-table-column label="数量" width="160" align="center">
          <template slot-scope="{ row }">
            <el-input v-model="row.quantity" size="small" placeholder="请填写" style="width: 110px" />
          </template>
        </el-table-column>
      </el-table>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addMaterialDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmAddMaterials">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'WarehouseMaterialOutManagementAdd',
  data() {
    return {
      form: {
        outName: '',
        remark: ''
      },
      materials: Array.from({ length: 10 }, () => ({
        code: '4578786954',
        name: '原料名称',
        spec: '98,A1,10mm',
        quantity: '20',
        categoryName: '原料分类',
        unit: '盒'
      })),
      multipleSelection: [],
      addMaterialDialogVisible: false,
      dialogQuery: {
        keyword: '',
        categoryId: ''
      },
      dialogTableData: Array.from({ length: 8 }, () => ({
        code: '4578786954',
        name: '原料名称',
        spec: '98,A1,10mm',
        categoryName: '原料分类名称',
        quantity: ''
      })),
      dialogSelection: []
    };
  },
  methods: {
    handleSelectionChange(list) {
      this.multipleSelection = list;
    },
    handleBatchDelete() {
      if (!this.multipleSelection.length) return;
      const toDelete = new Set(this.multipleSelection.map(i => i.code + '|' + i.spec));
      this.materials = this.materials.filter(i => !toDelete.has(i.code + '|' + i.spec));
      this.multipleSelection = [];
    },
    removeMaterial(index) {
      this.materials.splice(index, 1);
    },
    openAddMaterialDialog() {
      this.addMaterialDialogVisible = true;
    },
    handleAddMaterialDialogClose() {
      this.dialogSelection = [];
      this.dialogQuery.keyword = '';
      this.dialogQuery.categoryId = '';
      this.$refs.dialogQueryForm && this.$refs.dialogQueryForm.resetFields();
      this.$refs.dialogTableRef && this.$refs.dialogTableRef.clearSelection();
    },
    handleDialogQuery() {
      // TODO: 调用原料列表接口
    },
    resetDialogQuery() {
      this.$refs.dialogQueryForm && this.$refs.dialogQueryForm.resetFields();
      this.handleDialogQuery();
    },
    handleDialogSelectionChange(list) {
      this.dialogSelection = list;
    },
    confirmAddMaterials() {
      if (!this.dialogSelection.length) {
        this.addMaterialDialogVisible = false;
        return;
      }
      const existingKey = new Set(this.materials.map(i => i.code + '|' + i.spec));
      const newItems = this.dialogSelection
        .filter(i => !existingKey.has(i.code + '|' + i.spec))
        .map(i => ({
          code: i.code,
          name: i.name,
          spec: i.spec,
          quantity: i.quantity || '',
          categoryName: i.categoryName,
          unit: '盒'
        }));
      this.materials = this.materials.concat(newItems);
      this.addMaterialDialogVisible = false;
      this.handleAddMaterialDialogClose();
    },
    submit() {
      // TODO: 提交新增出库单接口 form + materials
      this.$message.success('提交成功');
      this.$router.back();
    },
    cancel() {
      this.$router.back();
    }
  }
};
</script>

<style lang="less" scoped>
.material-out-add-page {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
}

.page-title {
  font-family: Microsoft YaHei, Microsoft YaHei;
  font-weight: bold;
  font-size: 20px;
  color: #333333;
  line-height: 28px;
  margin-bottom: 24px;
  text-align: left;
}

.base-form {
  max-width: 900px;
  ::v-deep .el-form-item__label {
    color: #333;
  }
}

.table-section {
  margin-top: 10px;
}

.section-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  padding: 12px 16px;
  background: #EEEEEE;
  margin-bottom: 24px;

  .section-title {
    font-weight: bold;
    font-size: 14px;
    color: #333;
  }

  .section-acts {
    display: flex;
    align-items: center;
    gap: 10px;

    .el-button--primary {
      background: linear-gradient( 90deg, #157DE9 0%, #3697FD 100%) !important;
      border: none;
    }
  }
}

.table-box {
  ::v-deep .el-table {
    font-size: 14px;

    .table-header-cell {
      background: #f5f7fa;
      color: #303133;
      font-weight: 500;
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

.page-footer {
  margin-top: 24px;
  text-align: left;

  .el-button--primary {
    background: #2373c8 !important;
    border: none;
  }
}

.dialog-search {
  padding-bottom: 12px;
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
  ::v-deep .el-select .el-input__inner {
    border-radius: 4px;
    border-color: #dcdfe6;
  }

  .el-button--primary {
    background: linear-gradient(90deg, #157de9 0%, #3697fd 100%) !important;
    border: none;
  }
}

::v-deep .el-dialog__footer {
  text-align: right;
}
</style>
