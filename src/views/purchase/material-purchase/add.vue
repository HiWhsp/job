<template>
  <div class="view-wrap add-purchase-page">
    <h1 class="page-title">新增原料采购单</h1>

    <!-- 采购单基本信息 -->
    <div class="form-section">
      <el-form ref="baseForm" :model="form" :rules="baseRules" label-width="120px" class="base-form">
        <el-form-item label="采购单名称:" prop="purchaseName">
          <el-input v-model="form.purchaseName" placeholder="请输入" clearable style="width: 400px" />
        </el-form-item>
        <el-form-item label="采购单金额:" prop="purchaseAmount">
          <el-input v-model="form.purchaseAmount" placeholder="请输入" clearable style="width: 400px" />
        </el-form-item>
      </el-form>
    </div>

    <!-- 原料信息 -->
    <div class="material-section">
      <div class="section-header">
        <h2 class="section-title">原料信息</h2>
        <div class="section-actions">
          <el-button type="primary" @click="handleBatchDelete">删除</el-button>
          <el-button type="primary" @click="handleAddMaterial">添加原料</el-button>
        </div>
      </div>
      <div class="table-box">
        <el-table
          ref="materialTable"
          :data="materialList"
          header-cell-class-name="table-header-cell"
          :row-class-name="tableRowClassName"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="materialCode" label="原料编码" min-width="120" show-overflow-tooltip />
          <el-table-column prop="materialName" label="原料名称" min-width="120" show-overflow-tooltip />
          <el-table-column prop="spec" label="规格" min-width="100" show-overflow-tooltip />
          <el-table-column label="数量" min-width="100" align="center">
            <template slot-scope="{ row }">
              <el-input
                v-model.number="row.quantity"
                placeholder="数量"
                size="small"
                style="width: 80px"
                @input="row.quantity = row.quantity === '' ? '' : Number(row.quantity)"
              />
            </template>
          </el-table-column>
          <el-table-column prop="category" label="所属分类" min-width="100" show-overflow-tooltip />
          <el-table-column prop="productCategory" label="用于产品大类" min-width="140" show-overflow-tooltip />
          <el-table-column prop="unit" label="单位" width="80" align="center" />
          <el-table-column label="操作" width="80" align="center" fixed="right">
            <template slot-scope="{ $index }">
              <span class="row-act" @click="handleDeleteRow($index)">删除</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 底部操作 -->
    <div class="footer-actions">
      <el-button type="primary" @click="handleSubmit">提交</el-button>
      <el-button @click="handleCancel">取消</el-button>
    </div>

    <!-- 添加原料弹框 -->
    <el-dialog
      title="添加原料"
      :visible.sync="addMaterialDialogVisible"
      width="800px"
      custom-class="add-material-dialog"
      :close-on-click-modal="false"
      @close="closeAddMaterialDialog"
    >
      <div class="dialog-search">
        <el-form :model="addMaterialQuery" ref="addMaterialQueryForm" inline label-width="80px">
          <el-form-item label="关键词" prop="keyword">
            <el-input
              v-model="addMaterialQuery.keyword"
              placeholder="原料名称/原料编码"
              clearable
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="原料分类" prop="category">
            <el-select
              v-model="addMaterialQuery.category"
              placeholder="请选择"
              clearable
              style="width: 180px"
            >
              <el-option
                v-for="opt in cateOptions"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchAddMaterial">搜索</el-button>
            <el-button @click="resetAddMaterialQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="dialog-table-wrap">
        <el-table
          ref="addMaterialTable"
          :data="addMaterialList"
          max-height="360"
          header-cell-class-name="table-header-cell"
          @selection-change="handleAddMaterialSelectionChange"
        >
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="materialCode" label="原料编码" min-width="120" show-overflow-tooltip />
          <el-table-column prop="materialName" label="原料名称" min-width="120" show-overflow-tooltip />
          <el-table-column prop="spec" label="规格" min-width="120" show-overflow-tooltip />
          <el-table-column prop="category" label="所属分类" min-width="120" show-overflow-tooltip />
          <el-table-column label="数量" min-width="120" align="center">
            <template slot-scope="{ row }">
              <el-input
                v-model="row.quantity"
                placeholder="请填写"
                size="small"
                style="width: 100px"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addMaterialDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmAddMaterial">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
const ADD_API = "/addPurchaseMaterialOrder";
const MATERIAL_LIST_API = "/getMaterialList";
const DETAIL_API = "/getPurchaseMaterialOrder";
const MATERIAL_CATE_API = "/getMaterialCateList";

export default {
  name: "MaterialPurchaseAdd",
  data() {
    return {
      form: {
        purchaseName: "",
        purchaseAmount: "",
        id: ""
      },
      baseRules: {
        purchaseName: [{ required: true, message: "请输入采购单名称", trigger: "blur" }],
        purchaseAmount: [{ required: true, message: "请输入采购单金额", trigger: "blur" }]
      },
      materialList: [],
      selectedRows: [],
      // 添加原料弹框
      addMaterialDialogVisible: false,
      addMaterialQuery: {
        keyword: "",
        category: "",
        pageNum: 1,
        pageSize: 10
      },
      cateOptions: [],
      addMaterialList: [],
      addMaterialSelected: []
    };
  },
  created() {
    const id = this.$route.query.id;
    if (id) {
      this.form.id = String(id);
      this.loadEditDetail(String(id));
    }
    this.loadMaterialCateOptions();
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
    _walkCateTree(nodes, prefix = "") {
      const arr = Array.isArray(nodes) ? nodes : [];
      const out = [];
      arr.forEach(n => {
        if (!n) return;
        const title = n.title != null ? String(n.title) : "";
        const path = prefix ? `${prefix}/${title}` : title;
        const children = n.child;
        const hasChildren = Array.isArray(children) && children.length > 0;
        if (hasChildren) {
          out.push(...this._walkCateTree(children, path));
        } else {
          const id = n.id != null ? String(n.id) : "";
          if (!id) return;
          out.push({ label: path || id, value: id });
        }
      });
      return out;
    },
    loadMaterialCateOptions() {
      this.$api({ url: MATERIAL_CATE_API, method: "post", data: {} })
        .then(res => {
          if (res && res.code === 200) {
            const data = res.data;
            this.cateOptions = this._walkCateTree(data);
          } else {
            this.cateOptions = [];
          }
        })
        .catch(() => {
          this.cateOptions = [];
        });
    },
    loadEditDetail(id) {
      this.$api({ url: DETAIL_API, method: "post", data: { id } })
        .then(res => {
          if (!res || res.code !== 200 || !res.data) return;
          const d = res.data;
          this.form.purchaseName = d.title || "";
          this.form.purchaseAmount = d.price || "";
          const productArr = Array.isArray(d.productJson) ? d.productJson : (this._parseJson(d.productJson) || []);
          const products = Array.isArray(productArr) ? productArr : [];
          this.materialList = products.map(it => {
            const info = it && it.info ? it.info : {};
            const materialId = info.id || it.materialId || "";
            const inventoryId = it.inventoryId || info.inventoryId || "";
            const key = `${materialId}_${inventoryId}`;
            return {
              id: key,
              materialId: String(materialId || ""),
              inventoryId: String(inventoryId || ""),
              materialCode: info.sn || info.materialNo || "",
              materialName: info.title || "",
              spec: info.keyVals || info.storageConditions || "",
              quantity: it.num != null ? Number(it.num) : "",
              category: info.cateTitle || info.productCateTitle || "",
              productCategory: info.useProductCateTitle || info.productCategoryTitle || "",
              unit: info.unit || ""
            };
          });
        })
        .catch(() => {});
    },
    handleSelectionChange(selection) {
      this.selectedRows = selection;
    },
    handleBatchDelete() {
      if (this.selectedRows.length === 0) {
        this.$message.warning("请先勾选要删除的原料");
        return;
      }
      const ids = this.selectedRows.map(r => r.id);
      this.materialList = this.materialList.filter(item => !ids.includes(item.id));
      this.$message.success("删除成功");
    },
    handleAddMaterial() {
      this.addMaterialDialogVisible = true;
      this.$nextTick(() => {
        this.searchAddMaterial();
      });
    },
    closeAddMaterialDialog() {
      this.addMaterialQuery.keyword = "";
      this.addMaterialQuery.category = "";
      this.addMaterialQuery.pageNum = 1;
      this.addMaterialSelected = [];
    },
    searchAddMaterial() {
      const params = {
        limit: String(this.addMaterialQuery.pageSize),
        page: String(this.addMaterialQuery.pageNum),
        keyword: this.addMaterialQuery.keyword || "",
        cateId: this.addMaterialQuery.category ? String(this.addMaterialQuery.category) : ""
      };
      this.$api({ url: MATERIAL_LIST_API, method: "post", data: params })
        .then(res => {
          if (res && res.code === 200 && res.data) {
            const list = Array.isArray(res.data.list) ? res.data.list : [];
            this.addMaterialList = list.map(it => {
              const materialId = it.id != null ? String(it.id) : "";
              const inventoryId = it.inventoryId != null ? String(it.inventoryId) : "";
              return {
                id: `${materialId}_${inventoryId}`,
                materialId,
                inventoryId,
                materialCode: it.materialNo || "",
                materialName: it.title || "",
                spec: it.storageConditions || it.batchNo || "",
                category: it.cateTitle || "",
                unit: it.unit || "",
                productCategory: it.productCateTitle || "",
                quantity: ""
              };
            });
          } else {
            this.addMaterialList = [];
          }
        })
        .catch(() => {
          this.addMaterialList = [];
        });
    },
    resetAddMaterialQuery() {
      this.$refs.addMaterialQueryForm && this.$refs.addMaterialQueryForm.resetFields();
      this.addMaterialQuery.pageNum = 1;
      this.searchAddMaterial();
    },
    handleAddMaterialSelectionChange(selection) {
      this.addMaterialSelected = selection;
    },
    confirmAddMaterial() {
      const toAdd = this.addMaterialSelected.filter(row => row.quantity !== "" && row.quantity != null);
      if (this.addMaterialSelected.length === 0) {
        this.$message.warning("请先勾选要添加的原料");
        return;
      }
      if (toAdd.length === 0) {
        this.$message.warning("请为勾选的原料填写数量");
        return;
      }
      toAdd.forEach(row => {
        const key = row.id;
        const exists = this.materialList.find(m => m.id === key);
        const qty = Number(row.quantity) || 0;
        if (exists) {
          const old = Number(exists.quantity) || 0;
          exists.quantity = old + qty;
        } else {
          this.materialList.push({
            id: key,
            materialId: row.materialId,
            inventoryId: row.inventoryId,
            materialCode: row.materialCode,
            materialName: row.materialName,
            spec: row.spec,
            quantity: qty,
            category: row.category,
            productCategory: row.productCategory || "",
            unit: row.unit || ""
          });
        }
      });
      this.addMaterialDialogVisible = false;
      this.$message.success("添加成功");
    },
    handleDeleteRow(index) {
      this.materialList.splice(index, 1);
    },
    handleSubmit() {
      this.$refs.baseForm.validate(valid => {
        if (!valid) return;
        if (this.materialList.length === 0) {
          this.$message.warning("请至少添加一条原料");
          return;
        }
        const items = (this.materialList || [])
          .map(it => ({
            materialId: String(it.materialId || ""),
            inventoryId: String(it.inventoryId || ""),
            num: String(it.quantity != null ? it.quantity : "")
          }))
          .filter(it => it.materialId && it.inventoryId && it.num && Number(it.num) > 0);
        if (!items.length) {
          this.$message.warning("请为原料填写有效数量");
          return;
        }
        const data = {
          title: this.form.purchaseName,
          price: String(this.form.purchaseAmount),
          productJson: JSON.stringify(items)
        };
        if (this.form.id) data.id = String(this.form.id);
        this.$api({ url: ADD_API, method: "post", data })
          .then(res => {
            if (res && res.code === 200) {
              this.$message.success("提交成功");
              this.$router.push({ name: "material-purchase-list" });
            } else {
              this.$message.error((res && res.msg) || "提交失败");
            }
          })
          .catch(() => {
            this.$message.error("提交失败");
          });
      });
    },
    handleCancel() {
      this.$router.push({ name: "material-purchase-list" });
    }
  }
};
</script>

<style lang="less" scoped>
.add-purchase-page {
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e6e6e6;
  min-height: 100%;
  padding: 24px 27px 80px;
}

.page-title {
  text-align: left;
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 32px;
}

.form-section {
  margin-bottom: 32px;
  .base-form {
    max-width: 600px;
    ::v-deep .el-form-item__label {
      color: #303133;
      font-size: 14px;
    }
    ::v-deep .el-input__inner {
      border-radius: 4px;
      border-color: #dcdfe6;
    }
  }
}

.material-section {
  margin-bottom: 40px;
  .section-header {
    background: #EEEEEE;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    padding: 0 20px;
  }
  .section-title {
    font-size: 16px;
    font-weight: 500;
    color: #303133;
    margin: 0;
  }
  .section-actions {
    display: flex;
    gap: 12px;
  }
  .el-button--primary {
    background: linear-gradient(90deg, #157de9 0%, #3697fd 100%) !important;
    border: none;
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
  }
  .row-act {
    color: #3377fe;
    cursor: pointer;
    font-size: 14px;
    &:hover {
      text-decoration: underline;
    }
  }
}

.footer-actions {
  display: flex;
  gap: 12px;
  padding-top: 24px;
  border-top: 1px solid #ebeef5;
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

<style lang="less">
/* 添加原料弹框：挂载在 body，使用 custom-class 不加 scoped */
.add-material-dialog .el-dialog__body {
  padding: 16px 20px 20px;
}
.add-material-dialog .dialog-search {
  margin-bottom: 16px;
  .el-form-item {
    margin-bottom: 0;
  }
  .el-form-item__label {
    color: #303133;
    font-size: 14px;
  }
  .el-input__inner,
  .el-select .el-input__inner {
    border-radius: 4px;
    border-color: #dcdfe6;
  }
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
.add-material-dialog .dialog-table-wrap {
  .el-table .table-header-cell {
    background: #f5f7fa;
    color: #303133;
    font-weight: 500;
  }
  .el-table {
    font-size: 14px;
  }
}
.add-material-dialog .dialog-footer {
  text-align: right;
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
