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
          <div class="info-item">
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
          @selection-change="handleProductSelectionChange"
        >
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="id" label="序号" width="70" align="center" />
          <el-table-column prop="productName" label="产品名称" width="160" show-overflow-tooltip />
          <el-table-column prop="spec" label="规格" align="center" show-overflow-tooltip />
          <el-table-column prop="unitPrice" label="单价" align="center" />
          <el-table-column prop="quantity" label="数量" align="center" />
          <el-table-column prop="totalPrice" label="总价" align="center" />
          <el-table-column prop="unit" label="单位" align="center" />
          <el-table-column prop="stock" label="库存" align="center" />
          <el-table-column prop="stockStatus" label="库存状态" align="center" />
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
const DETAIL_API = "/getStaffOrder";
const CUSTOMER_API = "/getCustomer";
const ADD_API = "/addForeignProductOrder";

export default {
  name: "GeneratePurchaseOrder",
  data() {
    return {
      form: {
        purchaseName: "",
        id: ""
      },
      edit: false,
      staffOrderId: "",
      customer: {
        customerNo: "",
        customerName: "",
        region: "",
        area: "",
        attrA: "",
        attrB: "",
        contact: "",
        contactPhone: "",
        companyPhone: "",
        accountName: "",
        accountNo: "",
        bank: "",
        shippingAddress: "",
        consignee: "",
        consigneePhone: ""
      },
      productList: [],
      selectedProducts: []
    };
  },
  computed: {
    purchaseAmount() {
      return this.productList.reduce((sum, row) => sum + (Number(row.totalPrice) || 0), 0);
    }
  },
  created() {
    const id = this.$route.query.id;
    const edit = this.$route.query.edit;
    this.edit = edit;
    if (id) {
      this.form.id = String(id);
      this.loadDetail(String(id));
    }
  },
  methods: {
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 === 1 ? "row-even" : "";
    },
    _parseJson(val) {
      if (val == null || val === "") return null;
      if (typeof val === "object") return val;
      try {
        return typeof val === "string" ? JSON.parse(val) : val;
      } catch (e) {
        return null;
      }
    },
    _parseCustomerJson(val) {
      if (val == null || val === "") return {};
      if (typeof val === "object") return val || {};
      try {
        return typeof val === "string" ? (JSON.parse(val) || {}) : {};
      } catch (e) {
        return {};
      }
    },
    loadCustomerDetail(userId) {
      if (!userId) return;
      this.$api({
        url: CUSTOMER_API,
        method: "post",
        data: { id: String(userId) }
      })
        .then(res => {
          if (!res || !res.data) return;
          const data = res.data;
          const payment = this._parseCustomerJson(data.paymentJson);
          const address = this._parseCustomerJson(data.addressJson);
          this.customer = {
            ...this.customer,
            customerNo: data.customerNo ?? "",
            customerName: data.title ?? "",
            region: data.territory === 1 ? "国内" : data.territory === 2 ? "国外" : (data.territory ?? ""),
            area: data.region ?? "",
            attrA: data.attributeA ?? "",
            attrB: data.attributeB ?? "",
            contact: data.contact ?? "",
            contactPhone: data.phone ?? "",
            companyPhone: data.companyPhone ?? "",
            accountName: payment.account ?? "",
            accountNo: payment.code ?? "",
            bank: payment.bank ?? "",
            shippingAddress: address.address ?? "",
            consignee: address.name ?? "",
            consigneePhone: address.phone ?? ""
          };
        })
        .catch(() => {});
    },
    loadDetail(id) {
      this.$api({ url: DETAIL_API, method: "post", data: { id } })
        .then(res => {
          if (!res || res.code !== 200 || !res.data) {
            this.$message.error("获取采购单详情失败");
            return;
          }
          const d = res.data;
          // 基础信息：采购单名称
          this.form.purchaseName = d.title || "";
          this.staffOrderId = d.id != null ? String(d.id) : "";

          // 客户信息：优先用客户详情接口（按 userId），同时保留 customerTitle 兜底
          this.customer.customerName = d.customerTitle || "";
          if (d.customerId != null && d.customerId !== "") {
            this.loadCustomerDetail(String(d.customerId));
          }

          // 产品列表
          const products = Array.isArray(d.foreignProductJson) ? d.foreignProductJson : (this._parseJson(d.foreignProductJson) || []);
          const rows = Array.isArray(products) ? products : [];
          this.productList = rows.map(it => {
            const info = it && it.foreign_product ? it.foreign_product : {};
            const unitPrice = it && it.price != null ? Number(it.price) : 0;
            const quantity = it && it.num != null ? Number(it.num) : 0;
            return {
              id: it && it.id != null ? String(it.id) : "",
              foreignProductId: it && it.foreignProductId != null ? String(it.foreignProductId) : (info.id != null ? String(info.id) : ""),
              productName: info.title || "",
              spec: info.keyVals || "",
              unitPrice,
              quantity,
              unit: info.unit || "",
              stock: info.kucun,
              stockStatus: Number(info.kucun) > 0 ? "有货" : "缺货",
              totalPrice: info.totalPrice
            };
          });
          this.productList.forEach(row => this.calcRowTotal(row));
          this.selectedProducts = [];
        })
        .catch(() => {
          this.$message.error("获取采购单详情失败");
        });
    },
    handleProductSelectionChange(selection) {
      this.selectedProducts = selection || [];
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
      if (!this.staffOrderId) {
        this.$message.warning("缺少业务员订单id");
        return;
      }
      const rows = (this.selectedProducts && this.selectedProducts.length) ? this.selectedProducts : [];
      if (!rows || !rows.length) {
        this.$message.warning("请至少选择一条产品");
        return;
      }
      const items = rows
        .map(r => ({
          foreignProductId: String(r.foreignProductId || ""),
          price: String(r.unitPrice != null ? r.unitPrice : ""),
          num: String(r.quantity != null ? r.quantity : "")
        }))
        .filter(it => it.foreignProductId && it.price && it.num && Number(it.num) > 0);
      if (!items.length) {
        this.$message.warning("请选择产品并填写有效数量/单价");
        return;
      }
      const data = {
        title: this.form.purchaseName,
        productJson: JSON.stringify(items),
        staffOrderId: String(this.staffOrderId)
      };
      if (this.edit) data.id = String(this.form.id);
      this.$api({ url: ADD_API, method: "post", data })
        .then(res => {
          if (res && res.code === 200) {
            this.$message.success("生成成功");
            this.$router.push({ name: "external-product-purchase-list" });
          } else {
            this.$message.error((res && res.msg) || "生成失败");
          }
        })
        .catch(() => {
          this.$message.error("生成失败");
        });
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
  align-items: center;
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
