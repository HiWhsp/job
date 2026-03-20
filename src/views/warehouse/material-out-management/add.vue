<template>
  <div class="view-wrap material-out-add-page">
    <div class="page-title">新增原料出库单</div>

    <div class="form-section">
      <el-form :model="form" ref="formRef" label-width="120px" class="base-form">
        <el-form-item label="出库单名称：" prop="outName" :rules="[{ required: true, message: '请输入出库单名称', trigger: 'blur' }]">
          <el-input v-model="form.outName" placeholder="请输入" clearable style="max-width: 520px" />
        </el-form-item>
        <el-form-item label="出库单备注：">
          <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="请输入" clearable style="max-width: 520px" />
        </el-form-item>
      </el-form>
    </div>

    <div class="table-section">
      <div class="section-bar">
        <div class="section-title">原料信息</div>
        <div class="section-acts">
          <el-button size="small" type="primary" :disabled="!multipleSelection.length" @click="handleBatchDelete">删除</el-button>
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
          <el-table-column prop="batchNo" label="批次" min-width="100" show-overflow-tooltip />
          <el-table-column label="出库数量" width="140" align="center">
            <template slot-scope="{ row }">
              <el-input v-model="row.quantity" size="small" style="width: 90px" placeholder="必填" />
            </template>
          </el-table-column>
          <el-table-column prop="stockNum" label="当前库存" width="100" align="center" />
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
        <el-button type="primary" :loading="submitLoading" @click="submit">提交</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </div>

    <el-dialog
      title="添加原料"
      :visible.sync="addMaterialDialogVisible"
      width="1100px"
      :close-on-click-modal="false"
      append-to-body
      @close="handleAddMaterialDialogClose"
    >
      <div class="dialog-search">
        <el-form :model="dialogQuery" ref="dialogQueryForm" inline class="search-form" label-width="70px">
          <el-form-item label="关键词">
            <el-input v-model="dialogQuery.keyword" placeholder="原料名称/编号" clearable style="width: 240px" />
          </el-form-item>
          <el-form-item label="分类">
            <el-select v-model="dialogQuery.categoryId" placeholder="请选择" clearable style="width: 220px">
              <el-option v-for="opt in cateOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
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
        max-height="420"
        header-cell-class-name="table-header-cell"
        @selection-change="handleDialogSelectionChange"
      >
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column prop="code" label="原料编码" min-width="120" show-overflow-tooltip />
        <el-table-column prop="name" label="原料名称" min-width="120" show-overflow-tooltip />
        <el-table-column prop="spec" label="规格" min-width="120" show-overflow-tooltip />
        <el-table-column prop="batchNo" label="批次" min-width="100" show-overflow-tooltip />
        <el-table-column prop="stockNum" label="库存" width="90" align="center" />
        <el-table-column prop="categoryName" label="所属分类" min-width="120" show-overflow-tooltip />
        <el-table-column label="出库数量" width="160" align="center">
          <template slot-scope="{ row }">
            <el-input v-model="row.quantity" size="small" placeholder="请填写" style="width: 110px" />
          </template>
        </el-table-column>
      </el-table>

      <div class="dialog-pagination">
        <el-pagination
          @size-change="handleDialogSizeChange"
          @current-change="handleDialogPageChange"
          :current-page="dialogQuery.pageNum"
          :page-sizes="[10, 20, 50]"
          :page-size="dialogQuery.pageSize"
          layout="total, sizes, prev, pager, next"
          :total="dialogTotal"
        />
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addMaterialDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmAddMaterials">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
const ADD_API = '/addMaterialOutboundOrder';
const KUCUN_LIST_API = '/getMaterialKuCunList';
const CATE_API = '/getMaterialCateList';

export default {
  name: 'WarehouseMaterialOutManagementAdd',
  data() {
    return {
      form: {
        outName: '',
        remark: ''
      },
      materials: [],
      multipleSelection: [],
      submitLoading: false,
      addMaterialDialogVisible: false,
      cateOptions: [],
      dialogQuery: {
        keyword: '',
        categoryId: '',
        pageNum: 1,
        pageSize: 20
      },
      dialogTableData: [],
      dialogTotal: 0,
      dialogSelection: []
    };
  },
  methods: {
    rowKey(m) {
      return `${m.materialId}|${m.inventoryId}`;
    },
    _walkCateTree(list, acc = []) {
      if (!Array.isArray(list)) return acc;
      list.forEach(node => {
        if (!node || node.id == null) return;
        acc.push({
          value: String(node.id),
          label: node.title || String(node.id)
        });
        if (Array.isArray(node.child) && node.child.length) {
          this._walkCateTree(node.child, acc);
        }
      });
      return acc;
    },
    loadCategoryOptions() {
      this.$api({ url: CATE_API, method: 'post', data: {} })
        .then(res => {
          const data = res && res.data;
          this.cateOptions = this._walkCateTree(Array.isArray(data) ? data : []);
        })
        .catch(() => {
          this.cateOptions = [];
        });
    },
    handleSelectionChange(list) {
      this.multipleSelection = list || [];
    },
    handleBatchDelete() {
      if (!this.multipleSelection.length) return;
      const del = new Set(this.multipleSelection.map(i => this.rowKey(i)));
      this.materials = this.materials.filter(i => !del.has(this.rowKey(i)));
      this.multipleSelection = [];
    },
    removeMaterial(index) {
      this.materials.splice(index, 1);
    },
    openAddMaterialDialog() {
      if (!this.cateOptions.length) this.loadCategoryOptions();
      this.dialogQuery.pageNum = 1;
      this.addMaterialDialogVisible = true;
      this.$nextTick(() => {
        this.loadDialogList();
      });
    },
    mapKucunRow(it) {
      const material = it.material || {};
      const inventory = it.inventory || {};
      return {
        kucunId: it.id,
        materialId: it.materialId,
        inventoryId: it.inventoryId,
        stockNum: it.num != null ? it.num : '',
        code: material.materialNo || '',
        name: material.title || '',
        spec: inventory.keyVals || '',
        batchNo: inventory.batchNo || '',
        categoryName: it.cateTitle || '',
        unit: material.unit || '',
        quantity: ''
      };
    },
    loadDialogList() {
      this.$api({
        url: KUCUN_LIST_API,
        method: 'post',
        data: {
          page: String(this.dialogQuery.pageNum),
          limit: String(this.dialogQuery.pageSize),
          keyword: this.dialogQuery.keyword || '',
          cateId: this.dialogQuery.categoryId ? String(this.dialogQuery.categoryId) : ''
        }
      })
        .then(res => {
          if (res && res.code === 200 && res.data) {
            const list = Array.isArray(res.data.list) ? res.data.list : [];
            this.dialogTableData = list.map(it => this.mapKucunRow(it));
            this.dialogTotal = res.data.count != null ? res.data.count : list.length;
          } else {
            this.dialogTableData = [];
            this.dialogTotal = 0;
          }
        })
        .catch(() => {
          this.dialogTableData = [];
          this.dialogTotal = 0;
        });
    },
    handleAddMaterialDialogClose() {
      this.dialogSelection = [];
      this.dialogQuery.keyword = '';
      this.dialogQuery.categoryId = '';
      this.dialogQuery.pageNum = 1;
      this.dialogTableData = [];
      this.dialogTotal = 0;
      this.$refs.dialogQueryForm && this.$refs.dialogQueryForm.resetFields();
      this.$nextTick(() => {
        this.$refs.dialogTableRef && this.$refs.dialogTableRef.clearSelection();
      });
    },
    handleDialogQuery() {
      this.dialogQuery.pageNum = 1;
      this.loadDialogList();
    },
    resetDialogQuery() {
      this.dialogQuery.keyword = '';
      this.dialogQuery.categoryId = '';
      this.dialogQuery.pageNum = 1;
      this.$refs.dialogQueryForm && this.$refs.dialogQueryForm.resetFields();
      this.loadDialogList();
    },
    handleDialogPageChange(p) {
      this.dialogQuery.pageNum = p;
      this.loadDialogList();
    },
    handleDialogSizeChange(s) {
      this.dialogQuery.pageSize = s;
      this.dialogQuery.pageNum = 1;
      this.loadDialogList();
    },
    handleDialogSelectionChange(list) {
      this.dialogSelection = list || [];
    },
    confirmAddMaterials() {
      const sel = this.dialogSelection || [];
      if (!sel.length) {
        this.$message.warning('请先勾选原料');
        return;
      }
      for (let i = 0; i < sel.length; i++) {
        const r = sel[i];
        const q = String(r.quantity != null ? r.quantity : '').trim();
        if (!q) {
          this.$message.warning('请为勾选的原料填写出库数量');
          return;
        }
        const n = Number(q);
        if (isNaN(n) || n <= 0 || !Number.isInteger(n)) {
          this.$message.warning('出库数量须为正整数');
          return;
        }
        const max = Number(r.stockNum);
        if (!isNaN(max) && n > max) {
          this.$message.warning(`「${r.name || '原料'}」出库数量不能大于当前库存 ${r.stockNum}`);
          return;
        }
      }
      sel.forEach(p => {
        const n = Number(String(p.quantity).trim());
        const key = this.rowKey(p);
        const existing = this.materials.find(m => this.rowKey(m) === key);
        if (existing) {
          const cur = Number(String(existing.quantity || '').trim()) || 0;
          existing.quantity = String(cur + n);
        } else {
          this.materials.push({
            kucunId: p.kucunId,
            materialId: p.materialId,
            inventoryId: p.inventoryId,
            code: p.code,
            name: p.name,
            spec: p.spec,
            batchNo: p.batchNo,
            stockNum: p.stockNum,
            categoryName: p.categoryName,
            unit: p.unit,
            quantity: String(n)
          });
        }
      });
      this.addMaterialDialogVisible = false;
      this.handleAddMaterialDialogClose();
    },
    submit() {
      this.$refs.formRef.validate(valid => {
        if (!valid) return;
        if (!this.materials.length) {
          this.$message.warning('请添加原料');
          return;
        }
        const productJson = [];
        for (let i = 0; i < this.materials.length; i++) {
          const r = this.materials[i];
          const q = String(r.quantity != null ? r.quantity : '').trim();
          const n = Number(q);
          if (!q || isNaN(n) || n <= 0 || !Number.isInteger(n)) {
            this.$message.warning('请为每行填写有效的正整数出库数量');
            return;
          }
          const max = Number(r.stockNum);
          if (!isNaN(max) && n > max) {
            this.$message.warning(`「${r.name || '原料'}」出库数量不能大于当前库存`);
            return;
          }
          if (r.materialId == null || r.inventoryId == null) {
            this.$message.warning('原料数据不完整');
            return;
          }
          productJson.push({
            materialId: String(r.materialId),
            inventoryId: String(r.inventoryId),
            num: String(n)
          });
        }
        this.submitLoading = true;
        this.$api({
          url: ADD_API,
          method: 'post',
          data: {
            title: this.form.outName.trim(),
            cont: this.form.remark || '',
            productJson: JSON.stringify(productJson)
          }
        })
          .then(res => {
            this.submitLoading = false;
            if (res && res.code === 200) {
              this.$message.success('提交成功');
              this.$router.back();
            } else {
              this.$message.error((res && res.msg) || '提交失败');
            }
          })
          .catch(() => {
            this.submitLoading = false;
            this.$message.error('提交失败');
          });
      });
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
  background: #eeeeee;
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
      background: linear-gradient(90deg, #157de9 0%, #3697fd 100%) !important;
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

.dialog-pagination {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
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
