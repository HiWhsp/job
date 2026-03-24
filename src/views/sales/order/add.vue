<template>
  <div class="view-wrap order-add-page">
    <div class="form-card">
      <div class="page-title">{{ editOrderId ? '编辑订单' : '新增订单' }}</div>
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
                list-type="picture-card"
                :action="uploadAction"
                name="file"
                :file-list="form.contractImageList"
                :on-success="(res, file, list) => handleUploadSuccess('contract', res, file, list)"
                :on-remove="(file, list) => handleUploadRemove('contract', file, list)"
                :http-request="(opt) => handleUploadRequest(opt, 'contract')"
              >
                <i class="el-icon-plus" />
                <span class="upload-text">添加图片</span>
              </el-upload>
            </el-form-item>

            <!-- 付款凭证 -->
            <el-form-item label="付款凭证:" prop="payVoucherImages" class="form-item--upload">
              <el-upload
                class="upload-image-card"
                list-type="picture-card"
                :action="uploadAction"
                name="file"
                :file-list="form.payVoucherImageList"
                :on-success="(res, file, list) => handleUploadSuccess('payVoucher', res, file, list)"
                :on-remove="(file, list) => handleUploadRemove('payVoucher', file, list)"
                :http-request="(opt) => handleUploadRequest(opt, 'payVoucher')"
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
                  :class="{ 'stock-out': row.stockQty && row.stockQty == 0 }"
                >{{ row.stockQty && row.stockQty == 0 ? '缺货' : '有货' }}</span>
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
              <el-button type="primary" size="small" @click="handleAddExternalProduct">添加外购产品</el-button>
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
                  :class="{ 'stock-out': row.stockStatus && row.stockStatus == '缺货' }"
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

      <!-- 添加产品弹窗：getProductList -->
      <add-product-dialog :visible.sync="addProductVisible" @confirm="onAddProductConfirm" />

      <!-- 添加外购产品弹窗：getForeignProductList -->
      <add-external-product-dialog
        :visible.sync="addExternalProductVisible"
        @confirm="onAddExternalProductConfirm"
      />

      <!-- 选择客户弹窗：getCustomerList 按 form.customerName 查询 -->
      <el-dialog
        title="选择客户"
        :visible.sync="customerSelectVisible"
        width="700px"
        :close-on-click-modal="false"
        @open="loadCustomerList"
      >
        <el-table
          ref="customerTable"
          :data="customerList"
          highlight-current-row
          max-height="360"
          @current-change="onCustomerRowSelect"
        >
          <el-table-column type="index" label="序号" width="60" align="center" />
          <el-table-column prop="title" label="客户名称" show-overflow-tooltip />
          <el-table-column prop="customerNo" label="客户编码" show-overflow-tooltip />
          <el-table-column prop="territory" label="属地" />
          <el-table-column label="操作" width="80" align="center" fixed="right">
            <template slot-scope="{ row }">
              <el-button type="text" size="small" @click="selectCustomer(row)">选择</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button @click="customerSelectVisible = false">取消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { UPLOAD_ROOT } from "@/config/env.js";
import AddProductDialog from "./components/add-product-dialog.vue";
import AddExternalProductDialog from "./components/add-external-product-dialog.vue";

export default {
  name: "OrderAdd",

  components: {
    AddProductDialog,
    AddExternalProductDialog
  },

  data() {
    return {
      uploadAction: UPLOAD_ROOT,
      form: {
        customerId: "",
        customerName: "",
        orderType: "",
        priceType: "dealer",
        needApprove: false,
        payMethod: "",
        isPaid: true,
        payAmount: "0",
        stockMeet: true,
        acceptBatch: true,
        packageSpec: "",
        packageSpecOther: "",
        contractImageList: [],
        payVoucherImageList: []
      },
      rules: {
        customerName: [
          { required: true, message: "请输入客户名称", trigger: "blur" }
        ],
        orderType: [
          { required: true, message: "请选择订单类型", trigger: "change" }
        ],
        payMethod: [
          { required: true, message: "请选择支付方式", trigger: "change" }
        ]
      },
      productList: [],
      productSelected: [],
      externalProductList: [],
      externalNewRow: null,
      addProductVisible: false,
      addExternalProductVisible: false,
      customerSelectVisible: false,
      customerList: [],
      /** 路由带 id 时为编辑模式，提交时传给接口 */
      editOrderId: ""
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

  mounted() {
    const id = this.$route.query.id;
    if (id) {
      this.editOrderId = String(id);
      this.loadOrderDetail(this.editOrderId);
    }
  },

  watch: {
    "$route.query.id"(id) {
      if (id) {
        this.editOrderId = String(id);
        this.loadOrderDetail(this.editOrderId);
      } else {
        this.editOrderId = "";
        this.resetOrderFormForNew();
      }
    }
  },

  methods: {
    resetOrderFormForNew() {
      this.form = {
        customerId: "",
        customerName: "",
        orderType: "",
        priceType: "dealer",
        needApprove: false,
        payMethod: "",
        isPaid: true,
        payAmount: "0",
        stockMeet: true,
        acceptBatch: true,
        packageSpec: "",
        packageSpecOther: "",
        contractImageList: [],
        payVoucherImageList: []
      };
      this.productList = [];
      this.productSelected = [];
      this.externalProductList = [];
      this.externalNewRow = null;
      this.$nextTick(() => {
        this.$refs.formRef && this.$refs.formRef.clearValidate();
      });
    },
    /** 将逗号分隔或数组的图片地址转为 el-upload 的 file-list */
    imageUrlsToFileList(val) {
      let urls = [];
      if (Array.isArray(val)) {
        urls = val.map(s => String(s).trim()).filter(Boolean);
      } else if (typeof val === "string" && val.trim()) {
        urls = val.split(",").map(s => s.trim()).filter(Boolean);
      }
      return urls.map((url, i) => ({ name: `image-${i}`, url }));
    },
    /** 从 getStaffOrder 的 data 解析产品行（支持嵌套 product/inventory 或扁平字段） */
    parseProductRowsFromDetail(d) {
      let raw = d.productJson;
      if (typeof raw === "string" && raw.trim()) {
        try {
          raw = JSON.parse(raw);
        } catch (e) {
          raw = [];
        }
      }
      if (!Array.isArray(raw)) return [];
      return raw.map(item => {
        const p = item.product || {};
        const inv = item.inventory || {};
        const productId =
          item.productId != null
            ? item.productId
            : p.id != null
              ? p.id
              : "";
        const inventoryId =
          item.inventoryId != null
            ? item.inventoryId
            : inv.id != null
              ? inv.id
              : "";
        const qty = Number(item.num != null ? item.num : item.quantity) || 0;
        const guidePrice =
          item.yPrice != null ? item.yPrice : item.guidePrice != null ? item.guidePrice : "";
        const actualPrice =
          item.price != null && item.price !== ""
            ? item.price
            : item.actualPrice != null
              ? item.actualPrice
              : guidePrice;
        let guideTotal = item.totalPrice;
        if (guideTotal == null || guideTotal === "") {
          const gp = parseFloat(guidePrice) || 0;
          guideTotal = (gp * qty).toFixed(2);
        }
        const stockQty = item.stockQty != null ? item.stockQty : inv.kucun;
        const stockNum = Number(stockQty);
        return {
          productId: String(productId),
          inventoryId: String(inventoryId),
          code: p.productNo || inv.sn || item.code || "",
          name: p.title || item.name || "",
          spec: inv.keyVals || item.spec || "",
          category: item.category || p.cateTitle || "",
          unit: p.unit || item.unit || "",
          guidePrice,
          quantity: qty,
          guideTotal: String(guideTotal),
          actualPrice:
            actualPrice != null && actualPrice !== "" ? String(actualPrice) : "",
          stockQty: stockQty != null ? stockQty : "",
          stockStatus: stockNum === 0 ? "缺货" : "有货"
        };
      });
    },
    parseForeignRowsFromDetail(d) {
      let raw = d.foreignProductJson;
      if (typeof raw === "string" && raw.trim()) {
        try {
          raw = JSON.parse(raw);
        } catch (e) {
          raw = [];
        }
      }
      if (!Array.isArray(raw)) return [];
      return raw.map(item => {
        const fp = item.foreign_product || {};
        const price = item.price;
        const num = Number(item.num) || 0;
        let total = item.totalPrice;
        if (total == null || total === "") {
          const pr = parseFloat(price) || 0;
          total = (pr * num).toFixed(2);
        }
        return {
          productId: String(
            item.productId != null
              ? item.productId
              : fp.id != null
                ? fp.id
                : fp.productId != null
                  ? fp.productId
                  : "2"
          ),
          name: fp.title || fp.name || fp.keyVals || item.name || "",
          spec: fp.spec || fp.keyVals || item.spec || "",
          price: String(price != null ? price : ""),
          quantity: num,
          total: String(total),
          unit: fp.unit || item.unit || "",
          stock: item.stock || "",
          stockStatus: item.stockStatus || "—"
        };
      });
    },
    applyPackFromApi(packType, packStr) {
      const pt = String(packType != null ? packType : "1");
      const mapInv = {
        "1": "color_box",
        "2": "white_box",
        "3": "none",
        "4": "custom",
        "5": "other"
      };
      this.form.packageSpec = mapInv[pt] || "color_box";
      if (pt === "5") {
        const ps = packStr != null ? String(packStr) : "";
        this.form.packageSpecOther = ps === "5" ? "" : ps;
      } else {
        this.form.packageSpecOther = "";
      }
    },
    fillFormFromOrderData(d) {
      this.form.customerId =
        d.customerId != null && d.customerId !== "" ? String(d.customerId) : "";
      this.form.customerName =
        d.customerTitle != null ? String(d.customerTitle) : "";
      const ot = Number(d.orderType);
      this.form.orderType = ot === 2 ? "sample" : "sales";
      const pt = Number(d.priceType);
      this.form.priceType = pt === 2 ? "terminal" : "dealer";
      const ap = Number(d.isApproval);
      this.form.needApprove = ap === 1;
      const payT = Number(d.payType);
      if (payT === 2) this.form.payMethod = "credit";
      else if (payT === 3) this.form.payMethod = "installment";
      else this.form.payMethod = "cash";
      const ip = Number(d.isPay);
      this.form.isPaid = ip === 1;
      this.form.payAmount =
        d.payPrice != null && d.payPrice !== "" ? String(d.payPrice) : "0";
      const mk = Number(d.isManKuCun);
      this.form.stockMeet = mk !== 2;
      const mf = Number(d.isMoreFaHuo);
      this.form.acceptBatch = mf !== 2;
      this.applyPackFromApi(d.packType, d.packStr);
      this.form.contractImageList = this.imageUrlsToFileList(d.contractImages);
      this.form.payVoucherImageList = this.imageUrlsToFileList(d.payImage);
      this.productList = this.parseProductRowsFromDetail(d);
      this.externalProductList = this.parseForeignRowsFromDetail(d);
      this.productSelected = [];
      this.externalNewRow = null;
      this.$nextTick(() => {
        this.$refs.formRef && this.$refs.formRef.clearValidate();
      });
    },
    loadOrderDetail(id) {
      if (!id) return;
      const loading = this.$loading({
        lock: true,
        fullscreen: true,
        text: "加载订单详情...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.35)"
      });
      this.$api({
        url: "/getStaffOrder",
        method: "post",
        data: { id: String(id) }
      })
        .then(res => {
          if (!res || res.code !== 200 || !res.data) {
            this.$message.error((res && res.msg) || "获取订单详情失败");
            return;
          }
          this.fillFormFromOrderData(res.data);
        })
        .catch(err => {
          this.$message.error((err && err.msg) || "获取订单详情失败");
        })
        .finally(() => {
          loading.close();
        });
    },
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
          productId: r.productId || r.code || "",
          inventoryId: r.inventoryId || "",
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
    /** 添加外购产品：打开弹窗，由 getForeignProductList 接口获取列表并选择 */
    handleAddExternalProduct() {
      if (this.externalNewRow) {
        this.$message.warning("请先保存当前新增行");
        return;
      }
      this.addExternalProductVisible = true;
    },
    onAddExternalProductConfirm(rows) {
      if (!Array.isArray(rows)) return;
      rows.forEach(row => {
        this.externalProductList.push({
          productId: row.productId || "2",
          name: row.name || "",
          spec: row.spec || "",
          price: row.price != null ? String(row.price) : "",
          quantity: row.quantity,
          total: row.total || "0.00",
          unit: row.unit || "",
          stock: "",
          stockStatus: "—"
        });
      });
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
        productId: row.productId || "2",
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
    /** 点击新增客户：打开选择客户弹窗，调用 getCustomerList，keyword 使用 form.customerName */
    handleAddCustomer() {
      this.customerSelectVisible = true;
    },
    loadCustomerList() {
      this.$api({
        url: "/getCustomerList",
        method: "post",
        data: {
          page: "1",
          limit: "20",
          keyword: (this.form.customerName || "").trim()
        }
      })
        .then(res => {
          if (res && res.data) {
            const list = res.data.list || res.data.rows || [];
            this.customerList = list.map(row => ({
              ...row,
              territory: row.territory === 1 ? "国内" : row.territory === 2 ? "国外" : (row.territory ?? "")
            }));
          } else {
            this.customerList = [];
          }
        })
        .catch(() => {
          this.customerList = [];
        });
    },
    onCustomerRowSelect(row) {
      this._selectedCustomerRow = row;
    },
    selectCustomer(row) {
      if (!row) return;
      this.form.customerId = row.id != null ? String(row.id) : "";
      this.form.customerName = row.title != null ? String(row.title) : "";
      this.customerSelectVisible = false;
    },
    /** 自定义上传：使用 UPLOAD_ROOT，参数名 file（与 customer add 一致） */
    handleUploadRequest(option, field) {
      const formData = new FormData();
      formData.append("file", option.file);
      const token = localStorage.getItem("token");
      axios
        .post(UPLOAD_ROOT, formData, {
          headers: {
            Authorization: "Bearer " + token
          },
          timeout: 60000
        })
        .then(res => {
          const data = res.data || res;
          const payload = (data && data.data) ? data.data : data;
          const url = (payload && (payload.path || payload.url)) || (data && data.path) || "";
          option.onSuccess({ url });
        })
        .catch(err => {
          this.$message.error(
            (err.response && err.response.data && err.response.data.msg) || "上传失败"
          );
          option.onError(err);
        });
    },
    handleUploadSuccess(field, res, file, fileList) {
      if (field === "contract") {
        this.form.contractImageList = fileList;
      } else {
        this.form.payVoucherImageList = fileList;
      }
      const r = res || (file && file.response);
      const payload = (r && r.data) ? r.data : r;
      const url = (payload && (payload.path || payload.url)) || (r && r.path) || (file && file.url) || "";
      if (url && file) file.url = url;
    },
    handleUploadRemove(field, file, fileList) {
      if (field === "contract") {
        this.form.contractImageList = fileList || [];
      } else {
        this.form.payVoucherImageList = fileList || [];
      }
    },
    /** 订单类型 orderType：1销售订单 2样品订单 */
    getOrderTypeApi() {
      const map = { sales: "1", sample: "2" };
      return map[this.form.orderType] || "";
    },
    /** 价格类型 priceType：1经销商 2终端指导价格 */
    getPriceTypeApi() {
      return this.form.priceType === "terminal" ? "2" : "1";
    },
    /** 是否需要审核 isApproval：1需要 2不需要 */
    getIsApprovalApi() {
      return this.form.needApprove ? "1" : "2";
    },
    /** 支付方式 payType：1现结 2账期 3分期付款 */
    getPayTypeApi() {
      const map = { cash: "1", credit: "2", installment: "3" };
      return map[this.form.payMethod] || "";
    },
    /** 是否已付款 isPay：0未付款 1已付款 */
    getIsPayApi() {
      return this.form.isPaid ? "1" : "0";
    },
    /** 包装类型 -> 接口 packType：1标准彩盒 2标准白盒 3无包装 4客户定制包装 5其他 */
    getPackTypeValue() {
      const map = {
        color_box: "1",
        white_box: "2",
        none: "3",
        custom: "4",
        other: "5"
      };
      return map[this.form.packageSpec] || "1";
    },
    getPackStr() {
      const packType = this.getPackTypeValue();
      if (packType === "5") return this.form.packageSpecOther || "5";
      return packType;
    },
    /** 合同图片、付款凭证：上传后为 URL 逗号拼接，此处先传空串 */
    getContractImagesString() {
      if (!this.form.contractImageList || !this.form.contractImageList.length)
        return "";
      const urls = this.form.contractImageList
        .map(f => f.url || f.response?.url)
        .filter(Boolean);
      return urls.join(",");
    },
    getPayImageString() {
      if (
        !this.form.payVoucherImageList ||
        !this.form.payVoucherImageList.length
      )
        return "";
      const urls = this.form.payVoucherImageList
        .map(f => f.url || f.response?.url)
        .filter(Boolean);
      return urls.join(",");
    },
    /** 产品 Json：接口格式 [{"productId":"2","inventoryId":"5","yPrice":"20","price":"40","num":"10"},...] */
    buildProductJson() {
      const list = (this.productList || []).map(row => ({
        productId: String(
          row.productId != null ? row.productId : row.code || ""
        ),
        inventoryId: String(row.inventoryId != null ? row.inventoryId : ""),
        yPrice: String(row.guidePrice != null ? row.guidePrice : ""),
        price: String(
          row.actualPrice != null && row.actualPrice !== ""
            ? row.actualPrice
            : row.guidePrice || ""
        ),
        num: String(Number(row.quantity) || 0)
      }));
      return JSON.stringify(list);
    },
    /** 外购产品 Json：接口格式 [{"productId":"2","price":"100","num":"10"}] */
    buildForeignProductJson() {
      const list = (this.externalProductList || []).map(row => ({
        productId: String(row.productId != null ? row.productId : "2"),
        price: String(row.price != null ? row.price : ""),
        num: String(Number(row.quantity) || 0)
      }));
      return JSON.stringify(list);
    },
    handleSubmit() {
      this.$refs.formRef.validate(valid => {
        if (!valid) return;
        const customerId = String(this.form.customerId || "").trim();
        if (!customerId) {
          this.$message.warning("请选择客户（点击「新增客户」在列表中选择）");
          return;
        }
        if (!(this.productList && this.productList.length)) {
          this.$message.warning("请至少添加一条产品信息");
          return;
        }
        const orderType = this.getOrderTypeApi();
        const payType = this.getPayTypeApi();
        if (!orderType) {
          this.$message.warning("请选择订单类型");
          return;
        }
        if (!payType) {
          this.$message.warning("请选择支付方式");
          return;
        }
        const packType = this.getPackTypeValue();
        const packStr = this.getPackStr();
        const contractImages = this.getContractImagesString();
        const payImage = this.getPayImageString();
        const productJson = this.buildProductJson();
        const foreignProductJson = this.buildForeignProductJson();

        // 与接口文档一致：全部为 string；空图片用空格占位，避免 request 里删掉空字符串导致缺字段
        const data = {
          customerId,
          orderType,
          priceType: this.getPriceTypeApi(),
          isApproval: this.getIsApprovalApi(),
          payType,
          isPay: this.getIsPayApi(),
          payPrice: String(
            this.form.payAmount != null ? this.form.payAmount : "0"
          ),
          isManKuCun: this.form.stockMeet ? "1" : "2",
          isMoreFaHuo: this.form.acceptBatch ? "1" : "2",
          packType,
          packStr: packStr || packType,
          contractImages: contractImages || " ",
          payImage: payImage || " ",
          productJson,
          foreignProductJson
        };
        if (this.editOrderId) {
          data.id = String(this.editOrderId);
        }

        this.$api({
          url: "/addStaffOrder",
          method: "post",
          data
        })
          .then(res => {
            if (res && res.code === 200) {
              this.$message.success(this.editOrderId ? "保存成功" : "提交成功");
              this.$router.push("/sales/order/list");
            } else {
              this.$message.error((res && res.msg) || "提交失败");
            }
          })
          .catch(err => {
            this.$message.error(err && err.msg ? err.msg : "提交失败");
          });
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
  display: flex;
  ::v-deep .el-upload--picture-card {
    width: 120px;
    height: 120px;
    line-height: 120px;
    border: 1px solid #c0ccda;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

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
  }
  ::v-deep .el-upload-list__item-thumbnail {
    object-fit: fill;
  }
}

.upload-text {
  font-size: 14px;
  color: #878787;
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
