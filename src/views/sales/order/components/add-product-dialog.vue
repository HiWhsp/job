<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="添加产品"
    width="1000px"
    custom-class="add-product-dialog"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <!-- 搜索与筛选（与产品管理 list 一致：keyword、cateld） -->
    <div class="dialog-search">
      <el-form :model="query" inline class="search-form" label-width="80px">
        <el-form-item label="关键词">
          <el-input v-model="query.keyword" placeholder="产品名称/产品编码" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="产品分类" prop="categoryIds">
          <el-cascader
            ref="cascaderRef"
            v-model="query.categoryIds"
            :options="productCategoryCascaderOptions"
            :props="{
              value: 'value',
              label: 'label',
              children: 'children',
              checkStrictly: true
            }"
            placeholder="请选择产品分类"
            clearable
            style="width: 260px"
            show-all-levels
            @visible-change="onCascaderVisibleChange"
          />
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
        <el-table-column prop="code" label="产品编码" min-width="120" show-overflow-tooltip />
        <el-table-column prop="name" label="产品名称" min-width="120" show-overflow-tooltip />
        <el-table-column prop="spec" label="规格" min-width="110" show-overflow-tooltip />
        <el-table-column prop="category" label="所属分类" min-width="100" show-overflow-tooltip />
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
import { mapState } from 'vuex';

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
        categoryIds: [],
        pageNum: 1,
        pageSize: 20
      },
      total: 0,
      tableData: [],
      selectedRows: []
    };
  },

  computed: {
    ...mapState(['vuex_product_cate_list']),
    /** 与产品管理 list 一致：将 Vuex 树形分类转为 Cascader 所需格式 */
    productCategoryCascaderOptions() {
      const list = this.vuex_product_cate_list || [];
      const mapTree = (nodes) => {
        if (!Array.isArray(nodes)) return [];
        return nodes.map(node => {
          const item = {
            value: node.id,
            label: node.title || ''
          };
          if (Array.isArray(node.child) && node.child.length) {
            item.children = mapTree(node.child);
          }
          return item;
        });
      };
      return mapTree(list);
    },
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
    /** 与产品管理 list 一致：POST /getProductList，page/limit/keyword/cateld（取 categoryIds 最后一项） */
    fetchList() {
      const ids = this.query.categoryIds || [];
      const cateld = ids.length ? String(ids[ids.length - 1]) : '';
      const params = {
        page: String(this.query.pageNum),
        limit: String(this.query.pageSize),
        keyword: (this.query.keyword || '').trim(),
        cateld
      };
      this.$api({
        url: '/getProductList',
        method: 'post',
        data: params
      })
        .then(res => {
          if (res && res.data) {
            const list = res.data.list || res.data.rows || [];
            this.tableData = list.map(row => ({
              id: row.id,
              productId: row.productId != null ? row.productId : row.id,
              inventoryId: row.inventoryId != null ? row.inventoryId : row.id,
              code: row.productNo || row.code || '',
              name: row.title || row.name || '',
              spec: row.keyVals || row.spec || '',
              category: row.cateTitle || row.category || '',
              unit: row.unit || '盒',
              guidePrice: row.guidePrice != null ? String(row.guidePrice) : (row.price != null ? String(row.price) : ''),
              quantity: null,
              actualPrice: '',
              stockQty: row.stockQty != null ? row.stockQty : 0,
              stockStatus: row.stockStatus || '—'
            }));
            this.total = res.data.total ?? res.data.count ?? this.tableData.length;
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
      this.query.categoryIds = [];
      this.query.pageNum = 1;
      this.fetchList();
    },
    onCascaderVisibleChange(visible) {
      if (!visible) {
        this.$nextTick(() => {
          requestAnimationFrame(() => {
            const active = document.activeElement;
            const cascaderEl = this.$refs.cascaderRef?.$el;
            if (cascaderEl && active && cascaderEl.contains(active)) {
              active.blur();
            }
          });
        });
      }
    },
    handleConfirm() {
      const rows = this.selectedRows.map(r => {
        const q = Number(r.quantity) || 0;
        const p = parseFloat(r.guidePrice) || 0;
        const guideTotal = (q * p).toFixed(2);
        return {
          productId: r.productId != null ? r.productId : r.id,
          inventoryId: r.inventoryId != null ? r.inventoryId : r.id,
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

.dialog-pagination {
  margin-top: 12px;
  text-align: right;
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
