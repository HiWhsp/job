<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="添加产品"
    width="900px"
    custom-class="add-product-dialog"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <!-- 搜索与筛选 -->
    <div class="dialog-search">
      <el-form :model="query" inline class="search-form" label-width="80px">
        <el-form-item label="关键词">
          <el-input v-model="query.keyword" placeholder="产品名称/产品编号" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="产品分类">
          <el-select v-model="query.category" placeholder="请选择" clearable style="width: 160px">
            <el-option label="树脂盘" value="树脂盘" />
            <el-option label="其他分类" value="其他" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 产品列表表格 -->
    <div class="dialog-table-wrap">
      <el-table
        ref="tableRef"
        :data="tableData"
        border
        max-height="360"
        class="dialog-table"
        @selection-change="onSelectionChange"
      >
        <el-table-column type="selection" width="48" align="center" />
        <el-table-column prop="code" label="产品编码" min-width="120" />
        <el-table-column prop="name" label="产品名称" min-width="120" />
        <el-table-column prop="spec" label="规格" min-width="110" />
        <el-table-column prop="category" label="所属分类" min-width="100" />
        <el-table-column prop="guidePrice" label="指导价格" width="100" align="right" />
        <el-table-column label="数量" width="100" align="center">
          <template slot-scope="{ row }">
            <el-input
              v-model.number="row.quantity"
              size="small"
              placeholder="请填写"
            />
          </template>
        </el-table-column>
        <el-table-column label="指导总价" width="100" align="right">
          <template slot-scope="{ row }">
            <span>{{ getGuideTotalDisplay(row) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="实际价格" width="100" align="right">
          <template slot-scope="{ row }">
            <el-input v-model="row.actualPrice" size="small" placeholder="请填写" />
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'AddProductDialog',

  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      query: {
        keyword: '',
        category: ''
      },
      tableData: [],
      selectedRows: []
    };
  },

  computed: {
    dialogVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit('update:visible', val);
      }
    }
  },

  watch: {
    visible(val) {
      if (val) {
        this.fetchList();
      }
    }
  },

  methods: {
    fetchList() {
      // TODO: 根据 query 调接口，这里用示例数据
      this.tableData = [
        { code: '4578786954', name: '单层牙齿盘', spec: '98,A1,10mm', category: '树脂盘', guidePrice: '15.00', quantity: null, actualPrice: '' },
        { code: '4578786955', name: '单层牙齿盘', spec: '98,A1,10mm', category: '树脂盘', guidePrice: '20.00', quantity: null, actualPrice: '' },
        { code: '4578786956', name: '双层牙齿盘', spec: '98,B1,10mm', category: '树脂盘', guidePrice: '25.00', quantity: null, actualPrice: '' }
      ];
    },
    getGuideTotalDisplay(row) {
      const q = Number(row.quantity);
      const p = parseFloat(row.guidePrice) || 0;
      if (q > 0) return (q * p).toFixed(2);
      return '—';
    },
    onSelectionChange(rows) {
      this.selectedRows = rows || [];
    },
    handleSearch() {
      this.fetchList();
    },
    handleReset() {
      this.query.keyword = '';
      this.query.category = '';
      this.fetchList();
    },
    handleConfirm() {
      const rows = this.selectedRows.map(r => {
        const q = Number(r.quantity) || 0;
        const p = parseFloat(r.guidePrice) || 0;
        const guideTotal = (q * p).toFixed(2);
        return {
          code: r.code,
          name: r.name,
          spec: r.spec,
          category: r.category,
          unit: r.unit || '盒',
          guidePrice: r.guidePrice,
          quantity: q,
          guideTotal,
          actualPrice: r.actualPrice || '',
          stockQty: r.stockQty != null ? r.stockQty : 0,
          stockStatus: r.stockStatus || '—'
        };
      });
      if (!rows.length) {
        this.$message.warning('请勾选产品并填写数量');
        return;
      }
      const invalid = rows.some(r => !r.quantity || r.quantity <= 0);
      if (invalid) {
        this.$message.warning('请为所选产品填写数量');
        return;
      }
      this.$emit('confirm', rows);
      this.handleClose();
    },
    handleClose() {
      this.dialogVisible = false;
      this.$emit('close');
    }
  }
};
</script>

<style lang="less" scoped>
.dialog-search {
  margin-bottom: 16px;
  text-align: left;

  .search-form .el-form-item {
    margin-bottom: 12px;
    margin-right: 16px;
  }
}

.dialog-table-wrap {
  margin-bottom: 8px;
}

.dialog-table {
  ::v-deep .el-input__inner {
    width: 100%;
  }
}

.dialog-footer {
  text-align: right;

  .el-button {
    min-width: 80px;
  }

  .el-button--primary {
    background: #2373c8;
    border-color: #2373c8;
  }
}
</style>

<style lang="less">
.add-product-dialog {
  border-radius: 8px;

  .el-dialog__header {
    padding: 16px 20px;
    background: #f7f7f7;
    text-align: left;

    .el-dialog__title {
      font-size: 18px;
      color: #333;
    }

    .el-dialog__headerbtn .el-dialog__close {
      color: #909399;
      font-size: 16px;
    }
  }

  .el-dialog__body {
    padding: 20px;
    max-height: 70vh;
    overflow-y: auto;
  }

  .el-dialog__footer {
    padding: 12px 20px 20px;
    border-top: 1px solid #ebeef5;
  }
}
</style>
