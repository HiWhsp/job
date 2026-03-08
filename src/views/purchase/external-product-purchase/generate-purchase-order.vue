<template>
  <div class="view-wrap generate-order-page">
    <h1 class="page-title">生成采购单</h1>

    <!-- 订单基础信息 -->
    <div class="section-block">
      <div class="section-title-bar">
        <span class="title-line" />
        <h2 class="section-title">订单基础信息</h2>
      </div>
      <el-form ref="baseForm" :model="form" label-width="120px" class="base-form">
        <el-form-item label="采购单名称:">
          <el-input v-model="form.purchaseName" placeholder="请输入" clearable style="width: 100%; max-width: 600px" />
        </el-form-item>
      </el-form>
    </div>

    <!-- 客户信息 -->
    <div class="section-block">
      <div class="section-title-bar">
        <span class="title-line" />
        <h2 class="section-title">客户信息</h2>
      </div>
      <div class="customer-info-grid">
        <div class="info-row">
          <div class="info-item">
            <span class="info-label">客户编号:</span>
            <span class="info-value">{{ customer.customerNo }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">客户名称:</span>
            <span class="info-value">{{ customer.customerName }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">客户属地:</span>
            <span class="info-value">{{ customer.region }}</span>
          </div>
        </div>
        <div class="info-row">
          <div class="info-item">
            <span class="info-label">客户区域:</span>
            <span class="info-value">{{ customer.area }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">客户属性A:</span>
            <span class="info-value">{{ customer.attrA }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">客户属性B:</span>
            <span class="info-value">{{ customer.attrB }}</span>
          </div>
        </div>
        <div class="info-row">
          <div class="info-item">
            <span class="info-label">客户直接联系人:</span>
            <span class="info-value">{{ customer.contact }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">客户联系电话:</span>
            <span class="info-value">{{ customer.contactPhone }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">公司电话:</span>
            <span class="info-value">{{ customer.companyPhone }}</span>
          </div>
        </div>
        <div class="info-row">
          <div class="info-item">
            <span class="info-label">户名:</span>
            <span class="info-value">{{ customer.accountName }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">账号:</span>
            <span class="info-value">{{ customer.accountNo }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">开户行:</span>
            <span class="info-value">{{ customer.bank }}</span>
          </div>
        </div>
        <div class="info-row">
          <div class="info-item info-item-full">
            <span class="info-label">收货地址:</span>
            <span class="info-value">{{ customer.shippingAddress }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">收货人:</span>
            <span class="info-value">{{ customer.consignee }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">收货人联系方式:</span>
            <span class="info-value">{{ customer.consigneePhone }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 外购产品信息 -->
    <div class="section-block">
      <div class="section-title-bar">
        <span class="title-line" />
        <h2 class="section-title">外购产品信息</h2>
      </div>
      <div class="table-box">
        <el-table
          :data="productList"
          header-cell-class-name="table-header-cell"
          :row-class-name="tableRowClassName"
        >
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column type="index" label="序号" width="70" align="center">
            <template slot-scope="scope">
              {{ String(scope.$index + 1).padStart(3, '0') }}
            </template>
          </el-table-column>
          <el-table-column prop="productName" label="产品名称" min-width="120" show-overflow-tooltip />
          <el-table-column prop="spec" label="规格" min-width="100" show-overflow-tooltip />
          <el-table-column label="单价" min-width="100" align="center">
            <template slot-scope="{ row }">
              <el-input
                v-model.number="row.unitPrice"
                size="small"
                style="width: 80px"
                @input="calcRowTotal(row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="数量" min-width="100" align="center">
            <template slot-scope="{ row }">
              <el-input
                v-model.number="row.quantity"
                size="small"
                style="width: 80px"
                @input="calcRowTotal(row)"
              />
            </template>
          </el-table-column>
          <el-table-column prop="totalPrice" label="总价" min-width="110" align="right">
            <template slot-scope="{ row }">{{ formatMoney(row.totalPrice) }}</template>
          </el-table-column>
          <el-table-column prop="unit" label="单位" width="80" align="center" />
          <el-table-column prop="stock" label="库存" width="80" align="center" />
          <el-table-column prop="stockStatus" label="库存状态" width="90" align="center">
            <template slot-scope="{ row }">
              <span :class="{ 'stock-out': row.stockStatus === '缺货' }">{{ row.stockStatus }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="purchase-total">
          <span class="total-label">采购金额:</span>
          <span class="total-value">{{ formatMoney(purchaseAmount) }}</span>
        </div>
      </div>
    </div>

    <!-- 底部操作 -->
    <div class="footer-actions">
      <el-button type="primary" @click="handleConfirm">确定</el-button>
      <el-button @click="handleCancel">取消</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "GeneratePurchaseOrder",
  data() {
    return {
      form: {
        purchaseName: ""
      },
      customer: {
        customerNo: "L2026001",
        customerName: "浙江求实医疗科技有限公司",
        region: "国外",
        area: "美国",
        attrA: "临床",
        attrB: "经销商",
        contact: "郭亚菲",
        contactPhone: "15931263178",
        companyPhone: "0573-84986384",
        accountName: "浙江求实医疗科技有限公司",
        accountNo: "78544212657855",
        bank: "中国银行",
        shippingAddress: "浙江省嘉兴市嘉善县天凝镇天凝大道666号",
        consignee: "郭菲菲",
        consigneePhone: "15931263178"
      },
      productList: [
        { productName: "单层牙齿盘", spec: "98,A1,10mm", unitPrice: 20, quantity: 20, unit: "盒", stock: 20, stockStatus: "有货", totalPrice: 400 },
        { productName: "单层牙齿盘", spec: "98,A1,10mm", unitPrice: 20, quantity: 20, unit: "盒", stock: 20, stockStatus: "缺货", totalPrice: 400 },
        { productName: "单层牙齿盘", spec: "98,A1,10mm", unitPrice: 20, quantity: 20, unit: "盒", stock: 20, stockStatus: "有货", totalPrice: 400 },
        { productName: "单层牙齿盘", spec: "98,A1,10mm", unitPrice: 20, quantity: 20, unit: "盒", stock: 20, stockStatus: "缺货", totalPrice: 400 }
      ]
    };
  },
  computed: {
    purchaseAmount() {
      return this.productList.reduce((sum, row) => sum + (Number(row.totalPrice) || 0), 0);
    }
  },
  created() {
    const id = this.$route.query.id;
    if (id) {
      // TODO: 根据请购单 id 拉取客户信息、产品列表
    }
    this.productList.forEach(row => this.calcRowTotal(row));
  },
  methods: {
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 === 1 ? "row-even" : "";
    },
    calcRowTotal(row) {
      const price = Number(row.unitPrice) || 0;
      const qty = Number(row.quantity) || 0;
      row.totalPrice = (price * qty).toFixed(2);
    },
    formatMoney(val) {
      if (val == null || val === "") return "0.00";
      return Number(val).toFixed(2);
    },
    handleConfirm() {
      if (!this.form.purchaseName.trim()) {
        this.$message.warning("请输入采购单名称");
        return;
      }
      // TODO: 提交生成采购单接口
      this.$message.success("生成成功");
      this.$router.push({ name: "external-product-purchase-list" });
    },
    handleCancel() {
      this.$router.push({ name: "external-product-purchase-list" });
    }
  }
};
</script>

<style lang="less" scoped>
.generate-order-page {
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e6e6e6;
  min-height: 100%;
  padding: 24px 27px 80px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 24px;
  text-align: left;
}

.section-block {
  margin-bottom: 32px;
}

.section-title-bar {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #E6E6E6;
  .title-line {
    width: 8px;
    height: 21px;
    background: #2373C8;
    border-radius: 2px;
    margin-right: 8px;
  }
  .section-title {
    font-size: 16px;
    font-weight: bold;
    color: #2373C8;
    margin: 0;
  }
}

.base-form {
  ::v-deep .el-form-item__label {
    color: #303133;
    font-size: 14px;
  }
  ::v-deep .el-input__inner {
    border-radius: 4px;
    border-color: #dcdfe6;
  }
  ::v-deep .el-form-item__content {
    text-align: left;
  }
}

.customer-info-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 0;
}
.info-row {
  display: flex;
  align-items: flex-start;
  gap: 24px 48px;
  flex-wrap: wrap;
}
.info-item {
  display: flex;
  align-items: flex-start;
  font-size: 14px;
  min-width: 200px;
  flex: 1;
  .info-label {
    color: #333;
    min-width: 110px;
    flex-shrink: 0;
    text-align: left;
  }
  .info-value {
    color: #333;
    word-break: break-all;
  }
  &.info-item-full {
    flex: 1 1 100%;
    max-width: 100%;
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
    .el-table__body tr.row-even td {
      background: #f3f7fa;
    }
    .el-table__body tr:hover > td {
      background: #f5f7fa !important;
    }
    .el-input__inner {
      border-radius: 4px;
    }
  }
  .stock-out {
    color: #f56c6c;
  }
}
.purchase-total {
  text-align: right;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  background: #EEEEEE;
  height: 50px;
  line-height: 50px;
  padding-right: 90px;
  .total-label {
    margin-right: 8px;
  }
  .total-value {
    font-size: 16px;
  }
}

.footer-actions {
  display: flex;
  gap: 12px;
  padding-top: 24px;
  margin-top: 8px;
  .el-button--primary {
    background: linear-gradient(90deg, #157de9 0%, #3697fd 100%) !important;
    border: none;
  }
  .el-button:not(.el-button--primary) {
    background: #fff;
    border-color: #dcdfe6;
    color: #606266;
  }
}
</style>
