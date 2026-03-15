<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="添加外购产品"
    width="1000px"
    custom-class="add-external-product-dialog"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="dialog-search">
      <el-form :model="query" inline class="search-form" label-width="80px">
        <el-form-item label="关键词">
          <el-input v-model="query.keyword" placeholder="包装名称/产品名称" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

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
        <el-table-column prop="productNo" label="产品编码" min-width="120" show-overflow-tooltip />
        <el-table-column prop="title" label="产品名称" min-width="140" show-overflow-tooltip />
        <el-table-column prop="keyVals" label="规格" min-width="120" show-overflow-tooltip />
        <el-table-column prop="unit" label="单位" width="80" align="center" />
        <el-table-column label="单价" width="100" align="center">
          <template slot-scope="{ row }">
            <el-input v-model.number="row.price" size="small" placeholder="请输入" />
          </template>
        </el-table-column>
        <el-table-column label="数量" width="100" align="center">
          <template slot-scope="{ row }">
            <el-input v-model.number="row.quantity" size="small" placeholder="请填写" />
          </template>
        </el-table-column>
        <el-table-column label="总价" width="100" align="center">
          <template slot-scope="{ row }">
            <span>{{ getRowTotal(row) }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="dialog-pagination">
        <el-pagination
          small
          :current-page="query.pageNum"
          :page-size="query.pageSize"
          :total="total"
          layout="total, prev, pager, next"
          @current-change="onPageChange"
        />
      </div>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'AddExternalProductDialog',

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
        pageNum: 1,
        pageSize: 20
      },
      total: 0,
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
      if (val) this.fetchList();
    }
  },

  methods: {
    /** 与外购产品管理 list 一致：POST /getForeignProductList，page/limit/keyword */
    fetchList() {
      const params = {
        page: String(this.query.pageNum),
        limit: String(this.query.pageSize),
        keyword: (this.query.keyword || '').trim()
      };
      this.$api({
        url: '/getForeignProductList',
        method: 'post',
        data: params
      })
        .then(res => {
          if (res && res.code === 200 && res.data) {
            const list = Array.isArray(res.data.list) ? res.data.list : [];
            this.tableData = list.map(row => ({
              ...row,
              productId: row.id != null ? row.id : '',
              price: row.price != null ? row.price : null,
              quantity: null
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
    onPageChange(page) {
      this.query.pageNum = page;
      this.fetchList();
    },
    getRowTotal(row) {
      const p = parseFloat(row.price) || 0;
      const q = Number(row.quantity) || 0;
      if (q > 0) return (p * q).toFixed(2);
      return '—';
    },
    onSelectionChange(rows) {
      this.selectedRows = rows || [];
    },
    handleSearch() {
      this.query.pageNum = 1;
      this.fetchList();
    },
    handleReset() {
      this.query.keyword = '';
      this.query.pageNum = 1;
      this.fetchList();
    },
    handleConfirm() {
      const rows = this.selectedRows
        .filter(r => (Number(r.quantity) || 0) > 0)
        .map(r => {
          const p = parseFloat(r.price) || 0;
          const q = Number(r.quantity) || 0;
          const total = (p * q).toFixed(2);
          return {
            productId: r.productId != null ? String(r.productId) : (r.id != null ? String(r.id) : '2'),
            name: r.title || r.name || '',
            spec: r.keyVals || r.spec || '',
            unit: r.unit || '',
            price: String(p),
            quantity: q,
            total
          };
        });
      if (!rows.length) {
        this.$message.warning('请勾选外购产品并填写单价、数量');
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
.dialog-table ::v-deep .el-input__inner {
  width: 100%;
}
.dialog-pagination {
  margin-top: 12px;
  text-align: right;
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
