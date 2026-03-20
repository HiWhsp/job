<template>
  <div class="view-wrap material-kucun-detail-page">
    <div class="page-title">查看详情</div>

    <div class="block-section">
      <div class="block-title">
        <span class="block-title-bar" />
        <span>原料信息</span>
      </div>
      <div class="info-grid">
        <div class="info-row">
          <div class="info-item">
            <span class="info-label">原料编码</span>
            <span class="info-value">{{ productInfo.code }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">原料名称</span>
            <span class="info-value">{{ productInfo.name }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">所属分类</span>
            <span class="info-value">{{ productInfo.categoryName }}</span>
          </div>
        </div>
        <div class="info-row">
          <div class="info-item">
            <span class="info-label">规格</span>
            <span class="info-value">{{ productInfo.spec }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">批次</span>
            <span class="info-value">{{ productInfo.batchNo }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">规格编码</span>
            <span class="info-value">{{ productInfo.sn }}</span>
          </div>
        </div>
        <div class="info-row">
          <div class="info-item">
            <span class="info-label">单位</span>
            <span class="info-value">{{ productInfo.unit }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">库存数量</span>
            <span class="info-value">{{ productInfo.stockQuantity }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">预警数量</span>
            <span class="info-value">{{ productInfo.warnQuantity }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="block-section">
      <div class="block-title">
        <span class="block-title-bar" />
        <span>出入库记录</span>
      </div>
      <el-tabs v-model="activeTab" @tab-click="handleTabClick">
        <el-tab-pane label="入库记录" name="in">
          <div class="search-section">
            <el-form :model="inQueryParams" ref="inQueryForm" inline class="search-form" label-width="80px">
              <el-form-item label="关键词">
                <el-input
                  v-model="inQueryParams.keyword"
                  placeholder="单号等"
                  clearable
                  style="width: 260px"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleInQuery">搜索</el-button>
                <el-button @click="resetInQuery">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="table-box">
            <el-table
              :data="inTableData"
              header-cell-class-name="table-header-cell"
              :row-class-name="tableRowClassName"
            >
              <el-table-column prop="kuNo" label="单号" min-width="140" show-overflow-tooltip />
              <el-table-column prop="num" label="变动数量" min-width="100" align="center" show-overflow-tooltip />
              <el-table-column prop="yNum" label="变动前" min-width="90" align="center" show-overflow-tooltip />
              <el-table-column prop="xNum" label="变动后" min-width="90" align="center" show-overflow-tooltip />
              <el-table-column prop="created_at" label="时间" min-width="170" align="center" show-overflow-tooltip />
              <el-table-column label="操作" width="100" align="center" fixed="right">
                <template slot-scope="{ row }">
                  <span class="row-acts">
                    <span class="row-act" @click="handleLogDetail(row, 'in')">查看详情</span>
                  </span>
                </template>
              </el-table-column>
            </el-table>
            <div class="pagination-wrap">
              <el-pagination
                @size-change="handleInSizeChange"
                @current-change="handleInCurrentChange"
                :current-page="inQueryParams.pageNum"
                :page-sizes="[10, 20, 50]"
                :page-size="inQueryParams.pageSize"
                layout="total, prev, pager, next"
                :total="inTotal"
              />
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="出库记录" name="out">
          <div class="search-section">
            <el-form :model="outQueryParams" ref="outQueryForm" inline class="search-form" label-width="80px">
              <el-form-item label="关键词">
                <el-input
                  v-model="outQueryParams.keyword"
                  placeholder="单号等"
                  clearable
                  style="width: 260px"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleOutQuery">搜索</el-button>
                <el-button @click="resetOutQuery">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="table-box">
            <el-table
              :data="outTableData"
              header-cell-class-name="table-header-cell"
              :row-class-name="tableRowClassName"
            >
              <el-table-column prop="kuNo" label="单号" min-width="140" show-overflow-tooltip />
              <el-table-column prop="num" label="变动数量" min-width="100" align="center" show-overflow-tooltip />
              <el-table-column prop="yNum" label="变动前" min-width="90" align="center" show-overflow-tooltip />
              <el-table-column prop="xNum" label="变动后" min-width="90" align="center" show-overflow-tooltip />
              <el-table-column prop="created_at" label="时间" min-width="170" align="center" show-overflow-tooltip />
              <el-table-column label="操作" width="100" align="center" fixed="right">
                <template slot-scope="{ row }">
                  <span class="row-acts">
                    <span class="row-act" @click="handleLogDetail(row, 'out')">查看详情</span>
                  </span>
                </template>
              </el-table-column>
            </el-table>
            <div class="pagination-wrap">
              <el-pagination
                @size-change="handleOutSizeChange"
                @current-change="handleOutCurrentChange"
                :current-page="outQueryParams.pageNum"
                :page-sizes="[10, 20, 50]"
                :page-size="outQueryParams.pageSize"
                background
                layout="total, prev, pager, next, jumper"
                :total="outTotal"
              />
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <el-drawer
      title="入库详情"
      :visible.sync="inDetailDrawerVisible"
      direction="rtl"
      size="800px"
      :before-close="closeInDetailDrawer"
    >
      <div class="in-detail-drawer">
        <div class="in-detail-info">
          <div class="in-detail-info-item">
            <span class="label">单号：</span>
            <span class="value">{{ logDetail.kuNo }}</span>
          </div>
          <div class="in-detail-info-item">
            <span class="label">时间：</span>
            <span class="value">{{ logDetail.created_at }}</span>
          </div>
        </div>
        <div class="in-detail-info in-detail-info--row2">
          <div class="in-detail-info-item">
            <span class="label">变动数量：</span>
            <span class="value">{{ logDetail.num }}</span>
          </div>
          <div class="in-detail-info-item">
            <span class="label">变动前 / 后：</span>
            <span class="value">{{ logDetail.yNum }} → {{ logDetail.xNum }}</span>
          </div>
        </div>
        <div class="in-detail-table-wrap">
          <el-table :data="logDetailGoodsList" border header-cell-class-name="table-header-cell">
            <el-table-column type="index" label="序号" width="60" align="center" />
            <el-table-column prop="materialName" label="原料名称" min-width="120" show-overflow-tooltip />
            <el-table-column prop="spec" label="规格" min-width="120" show-overflow-tooltip />
            <el-table-column prop="batchNo" label="批次" min-width="100" show-overflow-tooltip />
            <el-table-column prop="unit" label="单位" width="80" align="center" />
            <el-table-column prop="quantity" label="本次入库数量" width="120" align="center" />
          </el-table>
        </div>
        <div class="in-detail-footer">
          <el-button type="primary" @click="confirmInDetail">确定</el-button>
          <el-button @click="closeInDetailDrawer">取消</el-button>
        </div>
      </div>
    </el-drawer>

    <el-drawer
      title="出库详情"
      :visible.sync="outDetailDrawerVisible"
      direction="rtl"
      size="800px"
      :before-close="closeOutDetailDrawer"
    >
      <div class="in-detail-drawer">
        <div class="out-detail-info">
          <div class="wrap">
            <div class="in-detail-info-item">
              <span class="label">单号：</span>
              <span class="value">{{ logDetail.kuNo }}</span>
            </div>
            <div class="in-detail-info-item">
              <span class="label">时间：</span>
              <span class="value">{{ logDetail.created_at }}</span>
            </div>
          </div>
          <div class="wrap">
            <div class="in-detail-info-item">
              <span class="label">变动数量：</span>
              <span class="value">{{ logDetail.num }}</span>
            </div>
            <div class="in-detail-info-item">
              <span class="label">变动前 / 后：</span>
              <span class="value">{{ logDetail.yNum }} → {{ logDetail.xNum }}</span>
            </div>
          </div>
        </div>
        <div class="in-detail-table-wrap">
          <el-table :data="logDetailGoodsList" border header-cell-class-name="table-header-cell">
            <el-table-column type="index" label="序号" width="60" align="center" />
            <el-table-column prop="materialName" label="原料名称" min-width="120" show-overflow-tooltip />
            <el-table-column prop="spec" label="规格" min-width="120" show-overflow-tooltip />
            <el-table-column prop="batchNo" label="批次" min-width="100" show-overflow-tooltip />
            <el-table-column prop="unit" label="单位" width="80" align="center" />
            <el-table-column prop="quantity" label="本次出库数量" width="120" align="center" />
          </el-table>
        </div>
        <div class="in-detail-footer">
          <el-button type="primary" @click="confirmOutDetail">确定</el-button>
          <el-button @click="closeOutDetailDrawer">取消</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
const DETAIL_API = '/getMaterialKuCun';
const LOG_LIST_API = '/getMaterialKuCunLogList';
const LOG_DETAIL_API = '/getMaterialKuCunLog';

export default {
  name: 'MaterialWarehouseManagementDetail',

  data() {
    return {
      kucunId: '',
      inventoryId: '',
      productInfo: {
        code: '',
        name: '',
        categoryName: '',
        spec: '',
        batchNo: '',
        sn: '',
        unit: '',
        stockQuantity: '',
        warnQuantity: ''
      },
      activeTab: 'in',
      inQueryParams: {
        keyword: '',
        pageNum: 1,
        pageSize: 20
      },
      inTotal: 0,
      inTableData: [],
      outQueryParams: {
        keyword: '',
        pageNum: 1,
        pageSize: 20
      },
      outTotal: 0,
      outTableData: [],
      inDetailDrawerVisible: false,
      outDetailDrawerVisible: false,
      logDetail: {
        kuNo: '',
        created_at: '',
        num: '',
        yNum: '',
        xNum: ''
      },
      logDetailGoodsList: []
    };
  },

  created() {
    this.kucunId = this.$route.query.id != null ? String(this.$route.query.id) : '';
  },

  mounted() {
    this.loadDetail().then(() => {
      this.loadInList();
    });
  },

  methods: {
    normalizeLogDetailPayload(data) {
      if (data == null) return null;
      if (Array.isArray(data)) {
        return data.length ? data[0] : null;
      }
      return data;
    },
    mapLogRow(it) {
      return {
        id: it.id,
        materialId: it.materialId,
        inventoryId: it.inventoryId,
        type: it.type,
        num: it.num != null ? it.num : '',
        kuNo: it.kuNo || '',
        yNum: it.yNum != null ? it.yNum : '',
        xNum: it.xNum != null ? it.xNum : '',
        created_at: it.created_at || '',
        orderId: it.orderId,
        userId: it.userId
      };
    },
    loadDetail() {
      if (!this.kucunId) {
        this.$message.warning('缺少库存记录 id');
        return Promise.resolve();
      }
      return this.$api({
        url: DETAIL_API,
        method: 'post',
        data: { id: this.kucunId }
      })
        .then(res => {
          if (res && res.code === 200 && res.data) {
            const d = res.data;
            const m = d.material || {};
            const inv = d.inventory || {};
            this.inventoryId = inv.id != null ? String(inv.id) : '';
            this.productInfo = {
              code: m.materialNo || '',
              name: m.title || '',
              categoryName: d.cateTitle || '',
              spec: inv.keyVals || '',
              batchNo: inv.batchNo || '',
              sn: inv.sn || '',
              unit: m.unit || '',
              stockQuantity: d.num != null ? d.num : '',
              warnQuantity: d.yjNum != null ? d.yjNum : ''
            };
          } else {
            this.$message.error((res && res.msg) || '加载详情失败');
          }
        })
        .catch(() => {
          this.$message.error('加载详情失败');
        });
    },
    handleTabClick(tab) {
      if (tab.name === 'in') {
        this.loadInList();
      } else {
        this.loadOutList();
      }
    },
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 === 1 ? 'row-even' : '';
    },
    loadInList() {
      if (!this.inventoryId) {
        this.inTableData = [];
        this.inTotal = 0;
        return;
      }
      this.$api({
        url: LOG_LIST_API,
        method: 'post',
        data: {
          page: String(this.inQueryParams.pageNum),
          limit: String(this.inQueryParams.pageSize),
          type: '1',
          inventoryId: this.inventoryId,
          keyword: this.inQueryParams.keyword || ''
        }
      })
        .then(res => {
          if (res && res.code === 200 && res.data) {
            const list = Array.isArray(res.data.list) ? res.data.list : [];
            this.inTableData = list.map(it => this.mapLogRow(it));
            this.inTotal = res.data.count != null ? res.data.count : list.length;
          } else {
            this.inTableData = [];
            this.inTotal = 0;
          }
        })
        .catch(() => {
          this.inTableData = [];
          this.inTotal = 0;
        });
    },
    handleInQuery() {
      this.inQueryParams.pageNum = 1;
      this.loadInList();
    },
    resetInQuery() {
      this.inQueryParams.keyword = '';
      this.inQueryParams.pageNum = 1;
      this.$refs.inQueryForm && this.$refs.inQueryForm.resetFields();
      this.loadInList();
    },
    handleInSizeChange(val) {
      this.inQueryParams.pageSize = val;
      this.loadInList();
    },
    handleInCurrentChange(val) {
      this.inQueryParams.pageNum = val;
      this.loadInList();
    },
    loadOutList() {
      if (!this.inventoryId) {
        this.outTableData = [];
        this.outTotal = 0;
        return;
      }
      this.$api({
        url: LOG_LIST_API,
        method: 'post',
        data: {
          page: String(this.outQueryParams.pageNum),
          limit: String(this.outQueryParams.pageSize),
          type: '2',
          inventoryId: this.inventoryId,
          keyword: this.outQueryParams.keyword || ''
        }
      })
        .then(res => {
          if (res && res.code === 200 && res.data) {
            const list = Array.isArray(res.data.list) ? res.data.list : [];
            this.outTableData = list.map(it => this.mapLogRow(it));
            this.outTotal = res.data.count != null ? res.data.count : list.length;
          } else {
            this.outTableData = [];
            this.outTotal = 0;
          }
        })
        .catch(() => {
          this.outTableData = [];
          this.outTotal = 0;
        });
    },
    handleOutQuery() {
      this.outQueryParams.pageNum = 1;
      this.loadOutList();
    },
    resetOutQuery() {
      this.outQueryParams.keyword = '';
      this.outQueryParams.pageNum = 1;
      this.$refs.outQueryForm && this.$refs.outQueryForm.resetFields();
      this.loadOutList();
    },
    handleOutSizeChange(val) {
      this.outQueryParams.pageSize = val;
      this.loadOutList();
    },
    handleOutCurrentChange(val) {
      this.outQueryParams.pageNum = val;
      this.loadOutList();
    },
    fillLogDetailDrawer(d, which) {
      const m = d.material || {};
      const inv = d.inventory || {};
      this.logDetail = {
        kuNo: d.kuNo || '',
        created_at: d.created_at || '',
        num: d.num != null ? d.num : '',
        yNum: d.yNum != null ? d.yNum : '',
        xNum: d.xNum != null ? d.xNum : ''
      };
      this.logDetailGoodsList = [
        {
          materialName: m.title || this.productInfo.name,
          spec: inv.keyVals || this.productInfo.spec,
          batchNo: inv.batchNo || this.productInfo.batchNo,
          unit: m.unit || this.productInfo.unit,
          quantity: d.num != null ? d.num : ''
        }
      ];
      if (which === 'in') {
        this.inDetailDrawerVisible = true;
      } else {
        this.outDetailDrawerVisible = true;
      }
    },
    handleLogDetail(row, which) {
      if (!row || row.id == null) {
        this.$message.warning('记录无效');
        return;
      }
      this.$api({
        url: LOG_DETAIL_API,
        method: 'post',
        data: { id: String(row.id) }
      })
        .then(res => {
          if (res && res.code === 200) {
            const d = this.normalizeLogDetailPayload(res.data);
            if (!d) {
              this.$message.error('无详情数据');
              return;
            }
            this.fillLogDetailDrawer(d, which);
          } else {
            this.$message.error((res && res.msg) || '加载详情失败');
          }
        })
        .catch(() => {
          this.$message.error('加载详情失败');
        });
    },
    closeInDetailDrawer(done) {
      if (typeof done === 'function') done();
      else this.inDetailDrawerVisible = false;
    },
    confirmInDetail() {
      this.inDetailDrawerVisible = false;
    },
    closeOutDetailDrawer(done) {
      if (typeof done === 'function') done();
      else this.outDetailDrawerVisible = false;
    },
    confirmOutDetail() {
      this.outDetailDrawerVisible = false;
    }
  }
};
</script>

<style lang="less" scoped>
.material-kucun-detail-page {
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

.block-section {
  margin-bottom: 24px;
  &:last-child {
    margin-bottom: 0;
  }
}

.block-title {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
  color: #2373c8;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e5e5;

  .block-title-bar {
    width: 8px;
    height: 20px;
    background: #2373c8;
    border-radius: 2px;
    margin-right: 8px;
  }
}

.info-grid {
  padding: 20px 24px;
}

.info-row {
  display: flex;
  margin-bottom: 16px;
  &:last-child {
    margin-bottom: 0;
  }
}

.info-item {
  flex: 1;
  display: flex;
  align-items: center;
  min-width: 0;

  .info-label {
    color: #606266;
    font-size: 14px;
    width: 110px;
    flex-shrink: 0;
    text-align: left;
  }

  .info-value {
    color: #303133;
    font-size: 14px;
  }
}

.search-section {
  padding: 30px 0;
  margin-bottom: 0;
  text-align: left;
  border-top: 1px solid #edf0f6;
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
  ::v-deep .el-input__inner {
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

::v-deep .el-tabs__header {
  margin-bottom: 0;
}
::v-deep .el-tabs__item {
  font-size: 14px;
  color: #606266;
  &.is-active {
    color: #157de9;
    font-weight: 500;
  }
}
::v-deep .el-tabs__ink-bar,
::v-deep .el-tabs__active-bar {
  background: linear-gradient(90deg, #157de9 0%, #3697fd 100%);
}
::v-deep .el-tabs__nav-wrap::after {
  display: none;
}
::v-deep .el-tabs__content {
  overflow: visible;
}

.table-box {
  margin-top: 0;
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
  }
}

.pagination-wrap {
  padding: 16px 0;
  display: flex;
  justify-content: flex-end;
}

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

.in-detail-drawer {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.in-detail-info {
  margin-bottom: 12px;
  font-size: 14px;
  color: #333;
  display: flex;
  align-items: center;
  padding: 0 60px;
  flex-wrap: wrap;

  &.in-detail-info--row2 {
    .in-detail-info-item {
      min-width: 200px;
    }
  }

  .in-detail-info-item {
    margin-bottom: 8px;
    flex: 1;
    text-align: left;
    .label {
      color: #333;
    }
    .value {
      margin-left: 24px;
    }
  }
}

.out-detail-info {
  margin-bottom: 20px;
  font-size: 14px;
  color: #333;
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 0 60px;

  .wrap {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .in-detail-info-item {
      margin-bottom: 0;
      flex: 1;
      min-width: 200px;
      text-align: left;
      .label {
        color: #333;
      }
      .value {
        margin-left: 24px;
      }
    }
  }
}

.in-detail-table-wrap {
  flex: 1;
  overflow: auto;
  padding: 0 30px;
  ::v-deep .el-table {
    font-size: 14px;
    .table-header-cell {
      background: #f5f7fa;
      color: #303133;
      font-weight: 500;
    }
  }
}

.in-detail-footer {
  margin-top: 24px;
  padding: 20px 15px;
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
