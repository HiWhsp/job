<template>
  <div class="view-wrap data-statistics-page">
    <!-- 顶部：标题 + 时间筛选 -->
    <div class="page-head">
      <div class="page-title">
        数据总览
        <div class="title-icon" @click="handleQuery">
          <i class="el-icon-refresh-left" />
        </div>
      </div>

      <div class="page-filters">
        <span class="filter-label">时间筛选</span>
        <el-date-picker v-model="queryParams.dateRange" type="daterange" range-separator="-" start-placeholder="开始时间"
          end-placeholder="结束时间" clearable class="filter-date" value-format="yyyy-MM-dd" />
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
                <el-cascader ref="productCateCascaderRef" v-model="productQuery.categoryIds"
                  :options="productCategoryCascaderOptions" :props="{
                    value: 'value',
                    label: 'label',
                    children: 'children',
                    checkStrictly: true
                  }" placeholder="请选择" clearable size="small" class="panel-select" show-all-levels
                  @visible-change="onProductCateVisibleChange" @change="handleQuery" />
              </div>
            </div>
            <div class="panel-body">
              <el-table :height="tableHeight" :data="productRows" header-cell-class-name="table-header-cell"
                :row-class-name="tableRowClassName">
                <el-table-column prop="title" label="产品名称" min-width="120" show-overflow-tooltip />
                <el-table-column prop="registerNo" label="产品编码" min-width="110" show-overflow-tooltip />
                <el-table-column prop="cateTitle" label="所属分类" min-width="100" show-overflow-tooltip />
                <el-table-column prop="orderNum" label="销售数量" min-width="90" align="right" />
                <el-table-column prop="orderPrice" label="销售金额" min-width="100" align="right">
                  <template slot-scope="{ row }">{{ formatMoney(row.orderPrice, true) }}</template>
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
                <el-select v-model="customerQuery.customerId" placeholder="请选择" clearable size="small"
                  class="panel-select" @change="handleQuery">
                  <el-option v-for="opt in customerOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
                </el-select>
              </div>
            </div>
            <div class="panel-body">
              <el-table ref="tableH" :height="tableHeight" :data="customerRows" header-cell-class-name="table-header-cell"
                :row-class-name="tableRowClassName">
                <el-table-column prop="title" label="客户名称" min-width="160" show-overflow-tooltip />
                <el-table-column prop="orderNum" label="订单数量" min-width="90" align="right" />
                <el-table-column prop="orderPrice" label="订单总金额" min-width="110" align="right">
                  <template slot-scope="{ row }">{{ formatMoney(row.orderPrice, true) }}</template>
                </el-table-column>
                <el-table-column prop="payPrice" label="已回款金额" min-width="110" align="right">
                  <template slot-scope="{ row }">{{ formatMoney(row.payPrice, true) }}</template>
                </el-table-column>
                <el-table-column prop="noPayPrice" label="未回款金额" min-width="110" align="right">
                  <template slot-scope="{ row }">{{ formatMoney(row.noPayPrice, true) }}</template>
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
import { mapState } from "vuex";

export default {
  name: "DataStatistics",

  computed: {
    ...mapState(["vuex_product_cate_list"]),
    /** 将 Vuex 树形分类转为 Cascader 所需格式 { value, label, children }（与 product/list.vue 一致） */
    productCategoryCascaderOptions() {
      const list = this.vuex_product_cate_list || [];
      const mapTree = (nodes) => {
        if (!Array.isArray(nodes)) return [];
        return nodes.map(node => {
          const item = {
            value: node.id,
            label: node.title || ""
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
      queryParams: {
        dateRange: []
      },
      statCards: [
        { key: "orderPrice", label: "订单总金额", value: 10000, isMoney: true },
        { key: "orderNum", label: "订单数量", value: 200, isMoney: false },
        { key: "payPrice", label: "已回款金额", value: 5000, isMoney: true },
        { key: "noPayPrice", label: "待回款金额", value: 5000, isMoney: true },
        {
          key: "purchasePrice",
          label: "采购总金额",
          value: 5000,
          isMoney: true
        }
      ],

      productQuery: {
        categoryIds: []
      },
      productRows: [],

      customerQuery: {
        customerId: ""
      },
      customerOptions: [],
      customerRows: [],
      tableHeight: 0,
    };
  },
  mounted() {
    this.$nextTick(() => {
      const refTable = this.$refs.tableH;
      if (!refTable) return;
      const tableEl = refTable.$el ? refTable.$el : refTable;
      // 使用 getBoundingClientRect().top 获取相对可视区的高度
      const rect = tableEl.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      this.tableHeight = Math.max(windowHeight - rect.top - 40, 200);
      const that = this;
      window.onresize = function () {
        const r = tableEl.getBoundingClientRect();
        that.tableHeight = Math.max(window.innerHeight - r.top - 40, 200);
      };
    });
    this.initDefaultDateRange();
    this.loadCustomerOptions();
    this.loadStatistics();
  },

  methods: {
    /** 默认时间范围：最近 30 天 */
    initDefaultDateRange() {
      if (this.queryParams.dateRange && this.queryParams.dateRange.length === 2) return;
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 30);
      const fmt = (d) => {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${y}-${m}-${day}`;
      };
      this.queryParams.dateRange = [fmt(start), fmt(end)];
    },
    /** 请求统计接口，更新卡片与两个表格 */
    loadStatistics() {
      const [s_time = "", e_time = ""] = this.queryParams.dateRange || [];
      const ids = this.productQuery.categoryIds || [];
      const cateId = ids.length ? String(ids[ids.length - 1]) : "";
      const customerld = this.customerQuery.customerId ? String(this.customerQuery.customerId) : "";
      this.$api({
        url: "/getStatistics",
        method: "post",
        data: {
          s_time: s_time || "",
          e_time: e_time || "",
          customerld: customerld,
          cateId: cateId
        }
      })
        .then(res => {
          if (!res || !res.data) return;
          const d = res.data;
          this.statCards.forEach(card => {
            const v = d[card.key];
            card.value = v !== undefined && v !== null ? v : (card.isMoney ? 0 : 0);
          });
          this.customerRows = res.data.customerList || [];
          this.productRows = res.data.productList || [];
        })
        .catch(() => {
          this.customerRows = [];
          this.productRows = [];
        });
    },
    loadCustomerOptions() {
      const params = {
        page: "1",
        limit: "9999",
        keyword: "",
        territory: "",
        region: "",
        attributeA: "",
        attributeB: ""
      };
      this.$api({
        url: "/getCustomerList",
        method: "post",
        data: params
      })
        .then(res => {
          const list = (res && res.data && (res.data.list || res.data.rows)) || [];
          this.customerOptions = (list || [])
            .map(item => ({
              label: item.title || item.name || "",
              value: String(item.id)
            }))
            .filter(o => o.label && o.value);
        })
        .catch(() => {
          this.customerOptions = [];
        });
    },
    /** 级联收起时把焦点移出下拉层，避免 aria-hidden 与焦点冲突的控制台警告（与 product/list.vue 一致） */
    onProductCateVisibleChange(visible) {
      if (!visible) {
        this.$nextTick(() => {
          requestAnimationFrame(() => {
            const active = document.activeElement;
            const cascaderEl = this.$refs.productCateCascaderRef?.$el;
            if (cascaderEl && active && cascaderEl.contains(active)) {
              active.blur();
            }
          });
        });
      }
    },
    handleQuery() {
      this.loadStatistics();
    },
    resetQuery() {
      this.queryParams.dateRange = [];
      this.initDefaultDateRange();
      this.productQuery.categoryIds = [];
      this.customerQuery.customerId = "";
      this.loadStatistics();
      this.$message.success("已重置");
    },
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 === 1 ? "row-even" : "";
    },
    formatMoney(val, isMoney) {
      if (!isMoney) return val ?? 0;
      const num = Number(val || 0);
      return num.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    }
  }
};
</script>

<style lang="less" scoped>
.data-statistics-page {
}

.page-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  height: 80px;
  background: #fff;
  border-radius: 8px;
  padding: 0 22px;
}

.page-title {
  font-size: 16px;
  font-weight: 600;
  color: #555555;
  display: flex;
  align-items: center;
  gap: 12px;

  .title-icon {
    width: 21px;
    height: 21px;
    background: #d2d2d2;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    i {
      color: #fff;
      font-size: 12px;
    }
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
  height: 195px;
  background: #fff;
  border-radius: 6px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 21px;
  padding: 32px;
}

.stat-card {
  background: #F7F8FA;
  border-radius: 8px;
  padding-left: 36px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;

  .stat-value {
    color: #FF3131;
    font-size: 24px;
    font-weight: 600;
    line-height: 34px;
  }

  .stat-label {
    color: #7D7D7D;
    font-size: 14px;
    line-height: 19px;
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
  padding: 18px 26px;
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
  padding: 0 26px 14px;
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

  .el-table__body tr:hover>td {
    background: #f5f7fa !important;
  }
}

@media screen and (max-width: 1280px) {
  .stat-cards {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
