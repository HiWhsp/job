<template>
  <div class="view-wrap product-page">
    <!-- 搜索/筛选区域 -->
    <div class="search-section">
      <el-form :model="queryParams" ref="queryForm" inline class="search-form" label-width="80px">
        <el-form-item label="关键词">
          <el-input
            v-model="queryParams.keyword"
            placeholder="产品名称/产品编码"
            clearable
            style="width: 260px"
          />
        </el-form-item>
        <el-form-item label="产品分类" prop="categoryIds">
          <el-cascader
            ref="cascaderRef"
            v-model="queryParams.categoryIds"
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
          <el-button type="primary" @click="handleQuery">搜索</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格区域 -->
    <div class="table-view">
      <div class="table-util-bar">
        <div class="table-title">产品管理</div>
        <div class="table-acts">
          <el-button type="primary" size="small" @click="handleImport">批量导入</el-button>
          <el-button type="primary" size="small" @click="handleAdd">新增产品</el-button>
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
          <el-table-column prop="productNo" label="产品编码" min-width="120" show-overflow-tooltip />
          <el-table-column prop="title" label="产品名称" min-width="140" show-overflow-tooltip>
            <template slot-scope="{ row }">
              <span class="link-name" @click="handleView(row)">{{ row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="keyVals" label="规格" min-width="120" show-overflow-tooltip />
          <el-table-column prop="cateTitle" label="所属分类" min-width="100" show-overflow-tooltip />
          <el-table-column prop="unit" label="单位" min-width="80" show-overflow-tooltip />
          <el-table-column prop="updated_at" label="更新时间" min-width="110" show-overflow-tooltip />
          <el-table-column label="操作" width="240" align="center" fixed="right">
            <template slot-scope="{ row }">
              <span class="row-acts">
                <span class="row-act" @click="handleView(row)">查看详情</span>
                <span class="row-act" @click="handleEdit(row)">编辑</span>
                <span class="row-act row-act-danger" @click="handleDelete(row)">删除</span>
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

    <!-- 产品详情：右侧抽屉（与产品指导价格等页一致，自右向左展开） -->
    <product-detail-drawer :visible.sync="detailDrawerVisible" :product-id="detailProductId" />

    <import-modal ref="importModal" @confirm="handleImportConfirm" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ProductDetailDrawer from './components/product-detail-drawer.vue';
import ImportModal from '@/components/upload/import_file_modal.vue';

export default {
  name: 'ProductList',

  components: {
    ProductDetailDrawer,
    ImportModal
  },

  computed: {
    ...mapState(['vuex_product_cate_list']),
    /** 将 Vuex 树形分类转为 Cascader 所需格式 { value, label, children } */
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
    }
  },

  data() {
    return {
      detailDrawerVisible: false,
      detailProductId: null,
      queryParams: {
        keyword: '',
        categoryIds: [], // 级联选中的路径 [一级id, 二级id, ...]，请求时取最后一项作为 categoryId
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
    withFullLoading(text, fn) {
      const loading = this.$loading({
        lock: true,
        fullscreen: true,
        text: text || '处理中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.35)'
      });
      const close = () => {
        try { loading && loading.close && loading.close(); } catch (e) { }
      };
      return Promise.resolve()
        .then(fn)
        .finally(close);
    },
    setView() {
      this.$nextTick(() => {
        const refTable = this.$refs.tableRef;
        if (!refTable) return;
        const tableEl = refTable.$el ? refTable.$el : refTable;
        const tableOffsetTop = tableEl.offsetTop + 85;
        const windowHeight = window.innerHeight;
        this.tableHeight = Math.max(windowHeight - tableOffsetTop - 80, 200);
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
      const ids = this.queryParams.categoryIds || [];
      const cateId = ids.length ? String(ids[ids.length - 1]) : '';
      const params = {
        page: String(this.queryParams.pageNum),
        limit: String(this.queryParams.pageSize),
        keyword: this.queryParams.keyword || '',
        cateId
      };
      this.$api({
        url: '/getProductList',
        method: 'post',
        data: params
      })
        .then(res => {
          if (res && res.data) {
            const list = res.data.list || res.data.rows || [];
            this.tableData = list;
            this.total = res.data.total ?? res.data.count ?? list.length;
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
      this.$refs['queryForm'].resetFields();
      this.queryParams.keyword = '';
      this.queryParams.categoryIds = [];
      this.queryParams.pageNum = 1;
      this.loadList();
    },
    /** 级联收起时把焦点移出下拉层，避免 aria-hidden 与焦点冲突的控制台警告 */
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
    handleView(row) {
      const id = row && row.id;
      if (id == null || id === '') {
        this.$message.warning('缺少产品 id');
        return;
      }
      this.detailProductId = id;
      this.detailDrawerVisible = true;
    },
    handleEdit(row) {
      // TODO: 编辑产品，如 this.$router.push('/manager/product-edit?id=' + row.id)
      this.$router.push('/manager/product/add?id=' + row.id);
    },
    handleDelete(row) {
      this.$confirm('确定要删除该产品吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const id = row && row.id != null ? String(row.id) : '';
          if (!id) {
            this.$message.error('缺少产品id，无法删除');
            return;
          }
          try {
            await this.withFullLoading('正在删除产品...', async () => {
              await this.$api({
                url: '/delProduct',
                method: 'post',
                data: { id }
              });
              this.loadList();
            });
            this.$message.success('删除成功');
          } catch (e) {
            this.$message.error((e && e.msg) ? e.msg : '删除失败');
          }
        })
        .catch(() => {});
    },
    handleAdd() {
      this.$router.push('/manager/product/add');
    },
    handleImport() {
      this.$refs.importModal.init('产品导入', '/importProduct');
    },
    handleImportConfirm() {
      this.loadList();
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
.product-page {
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
  ::v-deep .el-select .el-input__inner {
    border-radius: 4px;
    border-color: #dcdfe6;
  }

  .el-button--primary {
    background: linear-gradient(90deg, #157de9 0%, #3697fd 100%) !important;
    border: none;
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
  }
}

.table-box {
  width: 100%;
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

.link-name {
  color: #2373c8;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
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

    & + .row-act::before {
      content: '';
      display: inline-block;
      width: 1px;
      height: 12px;
      background: #dcdfe6;
      margin: 0 8px;
      vertical-align: middle;
    }

    &.row-act-danger {
      color: #f56c6c;
    }
  }
}

.pagination-wrap {
  padding: 16px 24px;
  background: #fff;
  display: flex;
  justify-content: flex-end;
}
</style>
