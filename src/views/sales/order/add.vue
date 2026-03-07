<template>
  <div class="view-wrap order-add-page">
    <div class="form-card">
      <div class="page-title">新增订单</div>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="200px" class="order-form">
        <div class="form-section">
          <div class="section-content">
            <!-- 客户名称 -->
            <el-form-item label="客户名称:" prop="customerName" required>
              <div class="customer-name-row">
                <el-input
                  v-model="form.customerName"
                  placeholder="请输入查询"
                  clearable
                  class="input-with-btn"
                />
                <el-button type="primary" @click="handleAddCustomer">新增客户</el-button>
              </div>
            </el-form-item>

            <!-- 订单类型 -->
            <el-form-item label="订单类型:" prop="orderType" required>
              <el-select v-model="form.orderType" placeholder="请选择销售订单/样品订单" clearable>
                <el-option label="销售订单" value="sales" />
                <el-option label="样品订单" value="sample" />
              </el-select>
            </el-form-item>

            <!-- 选择价格类型 -->
            <el-form-item label="选择价格类型:" prop="priceType">
              <el-radio-group v-model="form.priceType">
                <el-radio label="dealer">经销商指导价格</el-radio>
                <el-radio label="terminal">终端指导价格</el-radio>
              </el-radio-group>
            </el-form-item>

            <!-- 是否需要审批 -->
            <el-form-item label="是否需要审批:" prop="needApprove">
              <el-radio-group v-model="form.needApprove">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>

            <!-- 支付方式 -->
            <el-form-item label="支付方式:" prop="payMethod" required>
              <el-select v-model="form.payMethod" placeholder="请选择" clearable>
                <el-option label="现结" value="cash" />
                <el-option label="账期" value="credit" />
                <el-option label="分期付款" value="installment" />
              </el-select>
            </el-form-item>

            <!-- 是否付款 -->
            <el-form-item label="是否付款:" prop="isPaid">
              <el-radio-group v-model="form.isPaid">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>

            <!-- 付款金额 -->
            <el-form-item label="付款金额:" prop="payAmount">
              <el-input v-model="form.payAmount" placeholder="请输入" clearable />
            </el-form-item>

            <!-- 库存是否满足订单要求 -->
            <el-form-item label="库存是否满足订单要求:" prop="stockMeet">
              <el-radio-group v-model="form.stockMeet">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>

            <!-- 是否接受分批发货 -->
            <el-form-item label="是否接受分批发货:" prop="acceptBatch">
              <el-radio-group v-model="form.acceptBatch">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>

            <!-- 包装规格 -->
            <el-form-item label="包装规格:" prop="packageSpec">
              <div class="package-spec-wrap">
                <el-select
                  v-model="form.packageSpec"
                  placeholder="请选择"
                  clearable
                  @change="onPackageSpecChange"
                >
                  <el-option label="标准彩盒" value="color_box" />
                  <el-option label="标准白盒" value="white_box" />
                  <el-option label="无包装" value="none" />
                  <el-option label="客户定制包装" value="custom" />
                  <el-option label="其他(输入形式)" value="other" />
                </el-select>
              </div>
            </el-form-item>
            <el-form-item v-if="form.packageSpec === 'other'" label prop="packageSpecOther">
              <el-input v-model="form.packageSpecOther" placeholder="请输入" clearable />
            </el-form-item>

            <!-- 合同图片 -->
            <el-form-item label="合同图片:" prop="contractImages" class="form-item--upload">
              <el-upload
                class="upload-image-card"
                action="#"
                list-type="picture-card"
                :auto-upload="false"
                :file-list="form.contractImageList"
                :on-change="(file, list) => handleImageChange('contract', list)"
                :on-remove="() => handleImageRemove('contract')"
              >
                <i class="el-icon-plus" />
                <span class="upload-text">添加图片</span>
              </el-upload>
            </el-form-item>

            <!-- 付款凭证 -->
            <el-form-item label="付款凭证:" prop="payVoucherImages" class="form-item--upload">
              <el-upload
                class="upload-image-card"
                action="#"
                list-type="picture-card"
                :auto-upload="false"
                :file-list="form.payVoucherImageList"
                :on-change="(file, list) => handleImageChange('payVoucher', list)"
                :on-remove="() => handleImageRemove('payVoucher')"
              >
                <i class="el-icon-plus" />
                <span class="upload-text">添加图片</span>
              </el-upload>
            </el-form-item>
          </div>
        </div>

        <!-- 产品信息 -->
        <div class="block-section">
          <div class="block-header">
            <span class="block-title">产品信息</span>
            <div class="block-actions">
              <el-button type="primary" size="small" @click="handleDeleteProducts">删除</el-button>
              <el-button type="primary" size="small" @click="handleAddProduct">添加产品</el-button>
            </div>
          </div>
          <el-table
            ref="productTable"
            :data="productList"
            class="data-table"
            @selection-change="onProductSelectionChange"
          >
            <el-table-column type="selection" width="48" align="center" />
            <el-table-column prop="code" label="产品编码" min-width="120" />
            <el-table-column prop="name" label="产品名称" min-width="120" />
            <el-table-column prop="spec" label="规格" min-width="120" />
            <el-table-column prop="category" label="所属分类" min-width="100" />
            <el-table-column prop="unit" label="单位" width="70" align="center" />
            <el-table-column prop="guidePrice" label="指导价格" width="100" align="right" />
            <el-table-column label="数量" width="100" align="center">
              <template slot-scope="{ row }">
                <el-input
                  v-model.number="row.quantity"
                  size="small"
                  @input="calcProductGuideTotal(row)"
                />
              </template>
            </el-table-column>
            <el-table-column label="指导总价" width="110" align="right">
              <template slot-scope="{ row }">
                <el-input v-model="row.guideTotal" size="small" readonly />
              </template>
            </el-table-column>
            <el-table-column label="实际价格" width="110" align="right">
              <template slot-scope="{ row }">
                <el-input v-model="row.actualPrice" placeholder="请输入" size="small" />
              </template>
            </el-table-column>
            <el-table-column prop="stockQty" label="库存数量" width="90" align="center" />
            <el-table-column label="库存状态" width="90" align="center">
              <template slot-scope="{ row }">
                <span
                  :class="{ 'stock-out': row.stockStatus === '缺货' }"
                >{{ row.stockStatus || '—' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80" align="center" fixed="right">
              <template slot-scope="{ $index }">
                <el-button
                  type="text"
                  size="small"
                  class="link-btn"
                  @click="handleRemoveProduct($index)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="block-total">产品总价: {{ productTotal }}</div>
        </div>

        <!-- 外购产品信息 -->
        <div class="block-section">
          <div class="block-header">
            <span class="block-title">外购产品信息</span>
            <div class="block-actions">
              <el-button type="primary" size="small" @click="handleDeleteExternalProducts">删除</el-button>
              <el-button type="primary" size="small" @click="handleAddProduct">添加外购产品</el-button>
            </div>
          </div>
          <el-table
            ref="externalTable"
            :data="externalTableData"
            class="data-table"
            :row-class-name="externalRowClassName"
          >
            <el-table-column
              type="selection"
              width="48"
              align="center"
              :selectable="(row) => !row.isNew"
            />
            <el-table-column label="序号" width="70" align="center">
              <template slot-scope="{ $index }">{{ formatSeq($index) }}</template>
            </el-table-column>
            <el-table-column label="产品名称" min-width="120">
              <template slot-scope="{ row }">
                <el-input v-if="row.isNew" v-model="row.name" placeholder="输入选择" size="small" />
                <span v-else>{{ row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="规格" min-width="120">
              <template slot-scope="{ row }">
                <el-input v-if="row.isNew" v-model="row.spec" placeholder="输入选择" size="small" />
                <span v-else>{{ row.spec }}</span>
              </template>
            </el-table-column>
            <el-table-column label="单价" width="100" align="right">
              <template slot-scope="{ row }">
                <el-input
                  v-if="row.isNew"
                  v-model.number="row.price"
                  placeholder="请输入"
                  size="small"
                  @input="calcExternalRowTotal(row)"
                />
                <span v-else>{{ row.price }}</span>
              </template>
            </el-table-column>
            <el-table-column label="数量" width="90" align="center">
              <template slot-scope="{ row }">
                <el-input
                  v-if="row.isNew"
                  v-model.number="row.quantity"
                  placeholder="请输入"
                  size="small"
                  @input="calcExternalRowTotal(row)"
                />
                <span v-else>{{ row.quantity }}</span>
              </template>
            </el-table-column>
            <el-table-column label="总价" width="110" align="right">
              <template slot-scope="{ row }">{{ row.total != null ? row.total : '0.00' }}</template>
            </el-table-column>
            <el-table-column label="单位" width="70" align="center">
              <template slot-scope="{ row }">
                <el-input v-if="row.isNew" v-model="row.unit" placeholder="请输入" size="small" />
                <span v-else>{{ row.unit }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="stock" label="库存" width="70" align="center" />
            <el-table-column label="库存状态" width="90" align="center">
              <template slot-scope="{ row }">
                <span
                  :class="{ 'stock-out': row.stockStatus === '缺货' }"
                >{{ row.stockStatus || '—' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="140" align="center" fixed="right">
              <template slot-scope="{ row, $index }">
                <template v-if="row.isNew">
                  <el-button
                    type="text"
                    size="small"
                    class="link-btn"
                    @click="handleSaveExternalRow"
                  >保存</el-button>
                </template>
                <template v-else>
                  <el-button
                    type="text"
                    size="small"
                    class="link-btn"
                    @click="handleEditExternalRow($index)"
                  >编辑</el-button>
                  <el-button
                    type="text"
                    size="small"
                    class="link-btn"
                    @click="handleRemoveExternalProduct($index)"
                  >删除</el-button>
                </template>
              </template>
            </el-table-column>
          </el-table>
          <div class="block-total">产品总价: {{ externalProductTotal }}</div>
        </div>

        <!-- 订单总金额 -->
        <div class="order-total-row">
          <span class="order-total-label">订单总金额:</span>
          <span class="order-total-value">{{ orderTotal }}</span>
        </div>

        <!-- 底部按钮 -->
        <div class="form-footer">
          <el-button type="primary" @click="handleSubmit">提交</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </div>
      </el-form>

      <!-- 添加产品弹窗 -->
      <add-product-dialog
        :visible.sync="addProductVisible"
        @confirm="onAddProductConfirm"
      />
    </div>
  </div>
</template>

<script>
import AddProductDialog from './components/add-product-dialog.vue';

export default {
  name: "OrderAdd",

  components: {
    AddProductDialog,
  },

  data() {
    return {
      form: {
        customerName: "",
        orderType: "",
        priceType: "dealer",
        needApprove: false,
        payMethod: "",
        isPaid: true,
        payAmount: "",
        stockMeet: false,
        acceptBatch: true,
        packageSpec: "",
        packageSpecOther: "",
        contractImageList: [],
        payVoucherImageList: []
      },
      rules: {
        customerName: [
          { required: true, message: "请输入或选择客户名称", trigger: "blur" }
        ],
        orderType: [
          { required: true, message: "请选择订单类型", trigger: "change" }
        ],
        payMethod: [
          { required: true, message: "请选择支付方式", trigger: "change" }
        ]
      },
      productList: [
        {
          code: "4578786954",
          name: "单层牙齿盘",
          spec: "98,A1,10mm",
          category: "树脂盘",
          unit: "盒",
          guidePrice: "15.00",
          quantity: 20,
          guideTotal: "300.00",
          actualPrice: "",
          stockQty: 60,
          stockStatus: "有货"
        },
        {
          code: "4578786955",
          name: "单层牙齿盘",
          spec: "98,A1,10mm",
          category: "树脂盘",
          unit: "盒",
          guidePrice: "20.00",
          quantity: 200,
          guideTotal: "4000.00",
          actualPrice: "",
          stockQty: 60,
          stockStatus: "有货"
        }
      ],
      productSelected: [],
      externalProductList: [
        {
          name: "单层牙齿盘",
          spec: "98,A1,10mm",
          price: "2000.00",
          quantity: 20,
          total: "40000.00",
          unit: "盒",
          stock: "20",
          stockStatus: "有货"
        },
        {
          name: "单层牙齿盘",
          spec: "98,A1,10mm",
          price: "2000.00",
          quantity: 20,
          total: "40000.00",
          unit: "盒",
          stock: "20",
          stockStatus: "缺货"
        }
      ],
      externalNewRow: null,
      addProductVisible: false,
      addExternalProductVisible: false
    };
  },

  computed: {
    externalTableData() {
      const list = (this.externalProductList || []).slice();
      if (this.externalNewRow) list.push(this.externalNewRow);
      return list;
    },
    productTotal() {
      const sum = this.productList.reduce(
        (s, row) =>
          s + (parseFloat(row.actualPrice) || parseFloat(row.guideTotal) || 0),
        0
      );
      return sum.toFixed(2);
    },
    externalProductTotal() {
      const sum = this.externalProductList.reduce(
        (s, row) => s + (parseFloat(row.total) || 0),
        0
      );
      return sum.toFixed(2);
    },
    orderTotal() {
      const p = parseFloat(this.productTotal) || 0;
      const e = parseFloat(this.externalProductTotal) || 0;
      return (p + e).toFixed(2);
    }
  },

  methods: {
    formatSeq(index) {
      return String(index + 1).padStart(3, "0");
    },
    onProductSelectionChange(rows) {
      this.productSelected = rows || [];
    },
    handleDeleteProducts() {
      if (!this.productSelected.length) {
        this.$message.warning("请先勾选要删除的产品");
        return;
      }
      this.productList = this.productList.filter(
        row => !this.productSelected.includes(row)
      );
      this.productSelected = [];
    },
    handleAddProduct() {
      this.addProductVisible = true;
    },
    onAddProductConfirm(rows) {
      rows.forEach(r => {
        this.productList.push({
          code: r.code,
          name: r.name,
          spec: r.spec,
          category: r.category,
          unit: r.unit,
          guidePrice: r.guidePrice,
          quantity: r.quantity,
          guideTotal: r.guideTotal,
          actualPrice: r.actualPrice || "",
          stockQty: r.stockQty,
          stockStatus: r.stockStatus
        });
      });
    },
    handleRemoveProduct(index) {
      this.productList.splice(index, 1);
    },
    calcProductGuideTotal(row) {
      const q = Number(row.quantity) || 0;
      const p = parseFloat(row.guidePrice) || 0;
      row.guideTotal = (q * p).toFixed(2);
    },
    externalRowClassName({ row }) {
      return row.isNew ? "row-new" : "";
    },
    handleDeleteExternalProducts() {
      const ref = this.$refs.externalTable;
      if (!ref) return;
      const selection = ref.selection || [];
      if (!selection.length) {
        this.$message.warning("请先勾选要删除的外购产品");
        return;
      }
      this.externalProductList = this.externalProductList.filter(
        row => !selection.includes(row)
      );
    },
    handleAddExternalProduct() {
      if (this.externalNewRow) {
        this.$message.warning("请先保存当前新增行");
        return;
      }
      this.externalNewRow = {
        isNew: true,
        name: "",
        spec: "",
        price: null,
        quantity: null,
        total: "0.00",
        unit: "",
        stock: "",
        stockStatus: "缺货"
      };
    },
    calcExternalRowTotal(row) {
      if (!row || !row.isNew) return;
      const p = parseFloat(row.price) || 0;
      const q = Number(row.quantity) || 0;
      row.total = (p * q).toFixed(2);
    },
    handleSaveExternalRow() {
      const row = this.externalNewRow;
      if (!row) return;
      if (!row.name || !row.spec) {
        this.$message.warning("请填写产品名称、规格");
        return;
      }
      this.externalProductList.push({
        name: row.name,
        spec: row.spec,
        price: String(row.price != null ? row.price : ""),
        quantity: row.quantity,
        total: row.total || "0.00",
        unit: row.unit || "",
        stock: row.stock || "",
        stockStatus: row.stockStatus || "—"
      });
      this.externalNewRow = null;
    },
    handleEditExternalRow(index) {
      // TODO: 可改为行内编辑或弹窗编辑
      this.$message.info("编辑第" + (index + 1) + "行");
    },
    handleRemoveExternalProduct(index) {
      this.externalProductList.splice(index, 1);
    },
    onPackageSpecChange() {
      if (this.form.packageSpec !== "other") {
        this.form.packageSpecOther = "";
      }
    },
    handleAddCustomer() {
      // TODO: 跳转新增客户或打开弹窗
      this.$message.info("跳转新增客户");
    },
    handleImageChange(type, fileList) {
      if (type === "contract") {
        this.form.contractImageList = fileList;
      } else {
        this.form.payVoucherImageList = fileList;
      }
    },
    handleImageRemove(type) {
      if (type === "contract") {
        this.form.contractImageList = [];
      } else {
        this.form.payVoucherImageList = [];
      }
    },
    handleSubmit() {
      this.$refs.formRef.validate(valid => {
        if (!valid) return;
        // TODO: 调用新增订单接口，提交 form + productList + externalProductList
        this.$message.success("提交成功");
        this.$router.push("/sales/order/list");
      });
    },
    handleCancel() {
      this.$router.back();
    }
  }
};
</script>

<style lang="less" scoped>
.order-add-page {
  background: #f8f8f8;
  min-height: 100%;
}

.form-card {
  background: #fff;
  border-radius: 8px;
  padding: 24px 32px 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.page-title {
  font-size: 20px;
  font-weight: 500;
  color: #333;
  margin-bottom: 32px;
  text-align: left;
}

.order-form {
  .form-section {
    margin-bottom: 0;
  }
}

.section-content {
  .el-form-item {
    margin-bottom: 20px;
  }

  ::v-deep .el-form-item__content {
    min-height: 40px;
    height: 40px;
    display: flex;
    align-items: center;
  }

  /* 含上传的表单项不限制内容高度 */
  .form-item--upload ::v-deep .el-form-item__content {
    height: auto;
    min-height: 40px;
    align-items: flex-start;
  }

  ::v-deep .el-input {
    width: 800px;
  }

  ::v-deep .el-input__inner {
    width: 800px;
  }

  .el-form-item__label {
    color: #333;
    font-size: 14px;
  }

  .el-form-item.is-required:not(.is-no-asterisk) .el-form-item__label::before {
    color: #f56c6c;
  }

  ::v-deep .el-radio-group {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    height: 40px;
  }
}

.customer-name-row {
  display: flex;
  align-items: center;

  .input-with-btn {
    margin-right: 12px;
  }
}

.package-other-input {
  margin-top: 12px;
}

.package-spec-wrap {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.upload-image-card {
  ::v-deep .el-upload--picture-card {
    width: 120px;
    height: 120px;
    line-height: 120px;
    border: 1px solid #e5e5e5;
    background: #fafafa;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 4px;

    .el-icon-plus {
      font-size: 28px;
      color: #909399;
      margin-bottom: 4px;
    }
  }

  ::v-deep .el-upload-list--picture-card .el-upload-list__item {
    width: 120px;
    height: 120px;
    border-radius: 4px;
    border: 1px solid #e5e5e5;
  }
}

.upload-text {
  font-size: 14px;
  color: #606266;
  line-height: 20px;
}

/* 产品信息 / 外购产品信息 */
.block-section {
  margin-top: 32px;
  margin-bottom: 24px;
}

.block-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  background: #eeeeee;
  height: 50px;
  line-height: 50px;
  padding: 0 20px;
}

.block-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.block-actions {
  .el-button {
    margin-left: 8px;
  }
}

.data-table {
  margin-bottom: 12px;

  .stock-out {
    color: #f56c6c;
  }

  .link-btn {
    color: #2373c8;
    padding: 0 4px;
  }

  ::v-deep .el-input__inner {
    width: 100%;
  }
}

.block-total {
  text-align: right;
  font-size: 16px;
  color: #333;
  height: 50px;
  line-height: 50px;
  padding: 0 100px;
  background: #eeeeee;
  font-weight: bold;
}

.order-total-row {
  margin-top: 24px;
  padding: 16px 0;
  text-align: left;
  font-size: 16px;
  color: #333;
  font-weight: bold;
}

.order-total-label {
  margin-right: 8px;
}

.order-total-value {
  font-weight: bold;
}

.form-footer {
  margin-top: 48px;
  padding-top: 24px;
  text-align: left;
  .el-button {
    min-width: 112px;
    height: 38px;
    margin-right: 16px;
  }

  .el-button--primary {
    background: #2373c8 !important;
    border-color: #2373c8;
  }
}
</style>
