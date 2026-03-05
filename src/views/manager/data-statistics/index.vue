<template>
  <div class="view-wrap data-statistics-page">
    <!-- 顶部：标题 + 时间筛选 -->
    <div class="page-head">
      <div class="page-title">
        数据总览
        <el-tooltip effect="dark" content="统计数据示例展示，接入接口后可替换为真实数据" placement="right">
          <i class="el-icon-question title-tip" />
        </el-tooltip>
      </div>

      <div class="page-filters">
        <span class="filter-label">时间筛选</span>
        <el-date-picker
          v-model="queryParams.dateRange"
          type="daterange"
          range-separator="-"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          clearable
          class="filter-date"
        />
        <el-button type="primary" @click="handleQuery">搜索</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stat-cards">
      <div v-for="item in statCards" :key="item.key" class="stat-card">
        <div class="stat-value">{{ formatMoney(item.value, item.isMoney) }}</div>
        <div class="stat-label">{{ item.label }}</div>
      </div>
    </div>

    <!-- 下方：左右统计表 -->
    <div class="stat-panels">
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="panel-card">
            <div class="panel-head">
              <div class="panel-title">产品销售数量统计</div>
              <div class="panel-filter">
                <span class="panel-filter-label">产品分类</span>
                <el-select v-model="productQuery.category" placeholder="请选择" clearable size="small" class="panel-select">
                  <el-option v-for="opt in productCategoryOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
                </el-select>
              </div>
            </div>
            <div class="panel-body">
              <el-table
                :data="filteredProductRows"
                header-cell-class-name="table-header-cell"
                :row-class-name="tableRowClassName"
              >
                <el-table-column prop="productName" label="产品名称" min-width="120" show-overflow-tooltip />
                <el-table-column prop="productCode" label="产品编码" min-width="110" show-overflow-tooltip />
                <el-table-column prop="categoryName" label="所属分类" min-width="100" show-overflow-tooltip />
                <el-table-column prop="saleQty" label="销售数量" min-width="90" align="right" />
                <el-table-column prop="saleAmount" label="销售金额" min-width="100" align="right">
                  <template slot-scope="{ row }">
                    {{ formatMoney(row.saleAmount, true) }}
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-col>

        <el-col :span="12">
          <div class="panel-card">
            <div class="panel-head">
              <div class="panel-title">客户数据统计</div>
              <div class="panel-filter">
                <span class="panel-filter-label">客户名称</span>
                <el-select v-model="customerQuery.customerId" placeholder="请选择" clearable size="small" class="panel-select">
                  <el-option v-for="opt in customerOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
                </el-select>
              </div>
            </div>
            <div class="panel-body">
              <el-table
                :data="filteredCustomerRows"
                header-cell-class-name="table-header-cell"
                :row-class-name="tableRowClassName"
              >
                <el-table-column prop="customerName" label="客户名称" min-width="160" show-overflow-tooltip />
                <el-table-column prop="orderCount" label="订单数量" min-width="90" align="right" />
                <el-table-column prop="orderAmount" label="订单总金额" min-width="110" align="right">
                  <template slot-scope="{ row }">
                    {{ formatMoney(row.orderAmount, true) }}
                  </template>
                </el-table-column>
                <el-table-column prop="paidAmount" label="已回款金额" min-width="110" align="right">
                  <template slot-scope="{ row }">
                    {{ formatMoney(row.paidAmount, true) }}
                  </template>
                </el-table-column>
                <el-table-column prop="unpaidAmount" label="未回款金额" min-width="110" align="right">
                  <template slot-scope="{ row }">
                    {{ formatMoney(row.unpaidAmount, true) }}
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DataStatistics',
  data() {
    return {
      queryParams: {
        dateRange: []
      },
      statCards: [
        { key: 'orderTotal', label: '订单总金额', value: 10000, isMoney: true },
        { key: 'orderCount', label: '订单数量', value: 200, isMoney: false },
        { key: 'paidTotal', label: '已回款金额', value: 5000, isMoney: true },
        { key: 'unpaidTotal', label: '待回款金额', value: 5000, isMoney: true },
        { key: 'purchaseTotal', label: '采购总金额', value: 5000, isMoney: true }
      ],

      productQuery: {
        category: ''
      },
      productCategoryOptions: [
        { label: '颗粒盘', value: '颗粒盘' },
        { label: '胶囊', value: '胶囊' },
        { label: '片剂', value: '片剂' }
      ],
      productRows: [
        { productName: '单层牙齿盘', productCode: '7889789', categoryName: '颗粒盘', saleQty: 500, saleAmount: 50000 },
        { productName: '单层牙齿盘', productCode: '7889789', categoryName: '颗粒盘', saleQty: 500, saleAmount: 50000 },
        { productName: '单层牙齿盘', productCode: '500.00', categoryName: '颗粒盘', saleQty: 50000, saleAmount: 50000 },
        { productName: '单层牙齿盘', productCode: '500.00', categoryName: '颗粒盘', saleQty: 50000, saleAmount: 50000 },
        { productName: '单层牙齿盘', productCode: '500.00', categoryName: '颗粒盘', saleQty: 50000, saleAmount: 50000 },
        { productName: '单层牙齿盘', productCode: '500.00', categoryName: '颗粒盘', saleQty: 50000, saleAmount: 50000 },
        { productName: '单层牙齿盘', productCode: '500.00', categoryName: '颗粒盘', saleQty: 50000, saleAmount: 50000 },
        { productName: '单层牙齿盘', productCode: '500.00', categoryName: '颗粒盘', saleQty: 50000, saleAmount: 50000 }
      ],

      customerQuery: {
        customerId: ''
      },
      customerOptions: [
        { label: '浙江求实医疗科技有限公司', value: '1' },
        { label: '上海示例有限公司', value: '2' }
      ],
      customerRows: [
        { customerId: '1', customerName: '浙江求实医疗科技有限公司', orderCount: 500, orderAmount: 50000, paidAmount: 50000, unpaidAmount: 0 },
        { customerId: '1', customerName: '浙江求实医疗科技有限公司', orderCount: 500, orderAmount: 50000, paidAmount: 50000, unpaidAmount: 0 },
        { customerId: '1', customerName: '浙江求实医疗科技有限公司', orderCount: 50000, orderAmount: 50000, paidAmount: 50000, unpaidAmount: 0 },
        { customerId: '1', customerName: '浙江求实医疗科技有限公司', orderCount: 50000, orderAmount: 50000, paidAmount: 50000, unpaidAmount: 0 },
        { customerId: '1', customerName: '浙江求实医疗科技有限公司', orderCount: 50000, orderAmount: 50000, paidAmount: 50000, unpaidAmount: 0 },
        { customerId: '1', customerName: '浙江求实医疗科技有限公司', orderCount: 50000, orderAmount: 50000, paidAmount: 50000, unpaidAmount: 0 },
        { customerId: '1', customerName: '浙江求实医疗科技有限公司', orderCount: 50000, orderAmount: 50000, paidAmount: 50000, unpaidAmount: 0 },
        { customerId: '1', customerName: '浙江求实医疗科技有限公司', orderCount: 50000, orderAmount: 50000, paidAmount: 50000, unpaidAmount: 0 }
      ]
    };
  },
  computed: {
    filteredProductRows() {
      const { category } = this.productQuery;
      if (!category) return this.productRows;
      return this.productRows.filter((r) => r.categoryName === category);
    },
    filteredCustomerRows() {
      const { customerId } = this.customerQuery;
      if (!customerId) return this.customerRows;
      return this.customerRows.filter((r) => r.customerId === customerId);
    }
  },
  methods: {
    handleQuery() {
      this.$message.success('已按时间筛选刷新（示例）');
    },
    resetQuery() {
      this.queryParams.dateRange = [];
      this.$message.success('已重置（示例）');
    },
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 === 1 ? 'row-even' : '';
    },
    formatMoney(val, isMoney) {
      if (!isMoney) return val ?? 0;
      const num = Number(val || 0);
      return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
  }
};
</script>

<style lang="less" scoped>
.data-statistics-page {
  padding: 18px 20px 20px;
}

.page-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.page-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  display: flex;
  align-items: center;
  gap: 8px;

  .title-tip {
    color: #c0c4cc;
    cursor: pointer;
    font-size: 14px;
  }
}

.page-filters {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;

  .filter-label {
    color: #606266;
    font-size: 14px;
  }

  .filter-date {
    width: 260px;
  }

  .el-button--primary {
    background: linear-gradient(90deg, #157de9 0%, #3697fd 100%) !important;
  }
}

.stat-cards {
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
}

.stat-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 14px rgba(0, 0, 0, 0.06);
  padding: 18px 18px 14px;
  min-height: 78px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .stat-value {
    color: #f56c6c;
    font-size: 20px;
    font-weight: 600;
    line-height: 26px;
  }

  .stat-label {
    margin-top: 6px;
    color: #909399;
    font-size: 12px;
  }
}

.stat-panels {
  margin-top: 18px;
}

.panel-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 14px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.panel-head {
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.panel-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.panel-filter {
  display: flex;
  align-items: center;
  gap: 10px;

  .panel-filter-label {
    font-size: 13px;
    color: #606266;
  }

  .panel-select {
    width: 180px;
  }
}

.panel-body {
  padding: 0 12px 14px;
}

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

@media screen and (max-width: 1280px) {
  .stat-cards {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
