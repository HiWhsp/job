<template>
  <div class="view-wrap add-purchase-page">
    <h1 class="page-title">新增设备采购单</h1>

    <!-- 采购基本信息 -->
    <div class="form-section">
      <el-form ref="baseForm" :model="form" :rules="baseRules" label-width="150px" class="base-form">
        <el-form-item label="采购名称:" prop="purchaseName">
          <el-input v-model="form.purchaseName" placeholder="请输入" clearable style="width: 400px" />
        </el-form-item>
        <el-form-item label="合同图片:">
          <el-upload class="contract-upload" list-type="picture-card" :action="uploadAction" name="file"
            :file-list="contractFileList" accept="image/*"
            :on-success="(res, file, list) => handleContractUploadSuccess(res, file, list)"
            :on-remove="(file, list) => handleContractRemove(file, list)" :http-request="handleContractUploadRequest">
            <div class="upload-inner">
              <i class="el-icon-plus" />
              <span class="upload-tip">添加图片</span>
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
    </div>

    <!-- 设备信息 -->
    <div class="device-section">
      <div class="section-header">
        <h2 class="section-title">设备信息</h2>
        <div class="section-actions">
          <el-button type="primary" @click="handleBatchDelete">删除</el-button>
          <el-button type="primary" @click="handleAddDevice">添加采购产品</el-button>
        </div>
      </div>
      <div class="table-box">
        <el-table ref="deviceTable" :data="deviceList" header-cell-class-name="table-header-cell"
          :row-class-name="tableRowClassName" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" align="center" :selectable="selectableRow" />
          <el-table-column type="index" label="序号" width="70" align="center">
            <template slot-scope="scope">
              {{ String(scope.$index + 1).padStart(3, '0') }}
            </template>
          </el-table-column>
          <el-table-column label="设备名称" min-width="140">
            <template slot-scope="{ row }">
              <el-input v-if="row.isEditing" v-model="row.deviceName" placeholder="请输入" size="small"
                style="width: 100%" />
              <span v-else>{{ row.deviceName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="单价" min-width="100" align="center">
            <template slot-scope="{ row }">
              <el-input v-if="row.isEditing" v-model="row.unitPrice" placeholder="请输入" size="small" style="width: 90px"
                @input="calcRowTotal(row)" />
              <span v-else>{{ row.unitPrice }}</span>
            </template>
          </el-table-column>
          <el-table-column label="数量" min-width="90" align="center">
            <template slot-scope="{ row }">
              <el-input v-if="row.isEditing" v-model="row.quantity" placeholder="请输入" size="small" style="width: 80px"
                @input="calcRowTotal(row)" />
              <span v-else>{{ row.quantity }}</span>
            </template>
          </el-table-column>
          <el-table-column label="总价" min-width="110" align="right">
            <template slot-scope="{ row }">
              {{ row.isEditing ? formatMoney(row.totalPrice) : row.totalPrice }}
            </template>
          </el-table-column>
          <el-table-column label="单位" width="90" align="center">
            <template slot-scope="{ row }">
              <el-input v-if="row.isEditing" v-model="row.unit" placeholder="请输入" size="small" style="width: 70px" />
              <span v-else>{{ row.unit }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120" align="center" fixed="right">
            <template slot-scope="{ row, $index }">
              <template v-if="row.isEditing">
                <span class="row-act" @click="handleSaveRow($index)">保存</span>
                <span class="row-act" @click="handleDeleteRow($index)">删除</span>
              </template>
              <template v-else>
                <span class="row-act" @click="handleEditRow($index)">编辑</span>
                <span class="row-act" @click="handleDeleteRow($index)">删除</span>
              </template>
            </template>
          </el-table-column>
        </el-table>
        <div class="purchase-total">
          <span class="total-label">采购总价:</span>
          <span class="total-value">{{ formatMoney(purchaseTotal) }}</span>
        </div>
      </div>
    </div>

    <!-- 底部操作 -->
    <div class="footer-actions">
      <el-button type="primary" @click="handleSubmit">提交</el-button>
      <el-button @click="handleCancel">取消</el-button>
    </div>
  </div>
</template>

<script>
let rowId = 1;
import axios from "axios";
import { UPLOAD_ROOT } from "@/config/env.js";

const ADD_API = "/addPurchaseEquipmentOrder";
const DETAIL_API = "/getPurchaseEquipmentOrder";

export default {
  name: "DevicePurchaseAdd",
  data() {
    return {
      form: {
        purchaseName: "",
        pdfUrl: "",
        id: ""
      },
      baseRules: {
        purchaseName: [{ required: true, message: "请输入采购名称", trigger: "blur" }]
      },
      uploadAction: UPLOAD_ROOT,
      contractFileList: [],
      deviceList: [],
      selectedRows: []
    };
  },
  computed: {
    purchaseTotal() {
      return this.deviceList.reduce((sum, row) => {
        const total = parseFloat(row.totalPrice) || 0;
        return sum + total;
      }, 0);
    }
  },
  created() {
    const id = this.$route.query.id;
    if (id) {
      this.form.id = String(id);
      this.loadEditDetail(String(id));
    }
  },
  methods: {
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 === 1 ? "row-even" : "";
    },
    selectableRow(row) {
      return !row.isEditing;
    },
    handleSelectionChange(selection) {
      this.selectedRows = selection;
    },
    handleContractUploadRequest(option) {
      const formData = new FormData();
      formData.append("file", option.file);
      const token = localStorage.getItem("token");
      axios
        .post(UPLOAD_ROOT, formData, {
          headers: { Authorization: "Bearer " + token },
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
    handleContractUploadSuccess(res, file, fileList) {
      this.contractFileList = fileList;
      const r = res || (file && file.response);
      const payload = (r && r.data) ? r.data : r;
      const url = (payload && (payload.path || payload.url)) || (r && r.path) || (file && file.url) || "";
      if (url && file) file.url = url;
      if (url) this.form.pdfUrl = url;
    },
    handleContractRemove(file, fileList) {
      this.contractFileList = fileList || [];
      const urls = this.contractFileList.map(f => f.url || (f.response && f.response.url)).filter(Boolean);
      this.form.pdfUrl = urls[0] || "";
    },
    calcRowTotal(row) {
      const price = parseFloat(row.unitPrice) || 0;
      const qty = parseInt(row.quantity, 10) || 0;
      row.totalPrice = (price * qty).toFixed(2);
    },
    formatMoney(val) {
      if (val == null || val === "") return "0.00";
      const n = parseFloat(val);
      return isNaN(n) ? "0.00" : n.toFixed(2);
    },
    handleAddDevice() {
      const hasEditing = this.deviceList.some(r => r.isEditing);
      if (hasEditing) {
        this.$message.warning("请先保存当前编辑行");
        return;
      }
      this.deviceList.push({
        id: rowId++,
        deviceName: "",
        unitPrice: "",
        quantity: "",
        totalPrice: "0.00",
        unit: "台",
        isEditing: true
      });
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
    loadEditDetail(id) {
      this.$api({ url: DETAIL_API, method: "post", data: { id } })
        .then(res => {
          if (!res || res.code !== 200 || !res.data) return;
          const d = res.data;
          this.form.purchaseName = d.title || "";
          this.form.pdfUrl = d.pdfUrl || "";
          if (this.form.pdfUrl) {
            this.contractFileList = [{ name: "合同图片", url: this.form.pdfUrl }];
          } else {
            this.contractFileList = [];
          }
          const arr = Array.isArray(d.productJson) ? d.productJson : (this._parseJson(d.productJson) || []);
          const rows = Array.isArray(arr) ? arr : [];
          this.deviceList = rows.map(it => ({
            id: rowId++,
            deviceName: it.title || "",
            unitPrice: it.price || "",
            quantity: it.num != null ? it.num : "",
            totalPrice: it.totalPrice || this.formatMoney((Number(it.price) || 0) * (Number(it.num) || 0)),
            unit: it.unit || "台",
            isEditing: false
          }));
        })
        .catch(() => { });
    },
    handleSaveRow(index) {
      const row = this.deviceList[index];
      if (!row.deviceName || !row.unitPrice || !row.quantity) {
        this.$message.warning("请填写设备名称、单价、数量");
        return;
      }
      this.calcRowTotal(row);
      row.isEditing = false;
      row.totalPrice = this.formatMoney(row.totalPrice);
      this.$message.success("保存成功");
    },
    handleEditRow(index) {
      const row = this.deviceList[index];
      const hasEditing = this.deviceList.some(r => r.isEditing);
      if (hasEditing) {
        this.$message.warning("请先保存当前编辑行");
        return;
      }
      row.isEditing = true;
    },
    handleDeleteRow(index) {
      this.deviceList.splice(index, 1);
    },
    handleBatchDelete() {
      if (this.selectedRows.length === 0) {
        this.$message.warning("请先勾选要删除的设备");
        return;
      }
      const ids = this.selectedRows.map(r => r.id);
      this.deviceList = this.deviceList.filter(item => !ids.includes(item.id));
      this.$message.success("删除成功");
    },
    handleSubmit() {
      this.$refs.baseForm.validate(valid => {
        if (!valid) return;
        const hasEditing = this.deviceList.some(row => row.isEditing);
        if (hasEditing) {
          this.$message.warning("请先保存正在编辑的设备行");
          return;
        }
        if (this.deviceList.length === 0) {
          this.$message.warning("请至少添加一条设备");
          return;
        }
        const productArr = this.deviceList.map(r => {
          const price = String(r.unitPrice != null ? r.unitPrice : "");
          const num = String(r.quantity != null ? r.quantity : "");
          const totalPrice = this.formatMoney((Number(r.unitPrice) || 0) * (Number(r.quantity) || 0));
          return {
            title: r.deviceName || "",
            price,
            num,
            unit: r.unit || "",
            totalPrice
          };
        }).filter(it => it.title && it.price && it.num && Number(it.num) > 0);
        if (!productArr.length) {
          this.$message.warning("请填写有效的设备名称/单价/数量");
          return;
        }
        const data = {
          title: this.form.purchaseName,
          pdfUrl: this.form.pdfUrl || "",
          productJson: JSON.stringify(productArr)
        };
        if (this.form.id) data.id = String(this.form.id);
        this.$api({ url: ADD_API, method: "post", data })
          .then(res => {
            if (res && res.code === 200) {
              this.$message.success("提交成功");
              this.$router.push({ name: "device-purchase-list" });
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
      this.$router.push({ name: "device-purchase-list" });
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
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 24px;
  text-align: left;
}

.form-section {
  margin-bottom: 32px;

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
}

.contract-upload {
  display: flex;

  ::v-deep .el-upload--picture-card {
    width: 120px;
    height: 120px;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  ::v-deep .el-upload-list__item {
    width: 120px;
    height: 120px;
  }

  .upload-inner {
    display: flex;
    flex-direction: column;
    align-items: center;

    .el-icon-plus {
      font-size: 28px;
      margin-bottom: 8px;
      color: #8c939d;
    }
  }

  .upload-tip {
    font-size: 12px;
    color: #909399;
  }
}

.device-section {
  margin-bottom: 40px;

  .section-header {
    background: #EFEFEF;
    height: 50px;
    line-height: 50px;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
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

    .el-table__body tr:hover>td {
      background: #f5f7fa !important;
    }

    .el-input__inner {
      border-radius: 4px;
    }
  }

  .row-act {
    color: #3377fe;
    cursor: pointer;
    font-size: 14px;
    margin: 0 4px;

    &:hover {
      text-decoration: underline;
    }
  }
}

.purchase-total {
  text-align: right;
  height: 50px;
  line-height: 50px;
  padding: 0 20px;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  background: #EFEFEF;
  margin-top: 16px;

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
