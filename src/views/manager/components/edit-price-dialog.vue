<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="编辑价格"
    width="720px"
    custom-class="edit-price-dialog"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="edit-price-body">
      <div class="spec-table">
        <div class="spec-table-header">
          <div class="col-spec">规格</div>
          <div class="col-code">数字标识</div>
          <div class="col-dealer">经销商指导价格</div>
          <div class="col-terminal">终端指导价格</div>
        </div>
        <div v-for="(item, index) in specList" :key="index" class="spec-table-row">
          <div class="col-spec">{{ item.specText }}</div>
          <div class="col-code">{{ item.productCode }}</div>
          <div class="col-dealer">
            <el-input v-model="item.dealerPrice" placeholder="经销商指导价格" clearable />
          </div>
          <div class="col-terminal">
            <el-input v-model="item.terminalPrice" placeholder="终端指导价格" clearable />
          </div>
        </div>
      </div>
    </div>
    <div slot="footer" class="edit-price-footer">
      <el-button type="primary" @click="handleSubmit">提交</el-button>
      <el-button @click="handleClose">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "EditPriceDialog",

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    /** 当前产品行（表格行），用于编辑当前规格或拉取所有规格数据） */
    productRow: {
      type: Object,
      default: null
    },
    /** 是否仅编辑当前规格。false = 编辑所有规格 */
    currentSpecOnly: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      specList: []
    };
  },

  computed: {
    dialogVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit("update:visible", val);
      }
    }
  },

  watch: {
    visible(val) {
      if (val) {
        this.buildSpecList();
      }
    }
  },

  methods: {
    buildSpecList() {
      if (this.productRow) {
        if (this.currentSpecOnly) {
          this.specList = [
            {
              specText: this.productRow.spec,
              productCode: this.productRow.productCode,
              dealerPrice: this.productRow.dealerPrice || "",
              terminalPrice: this.productRow.terminalPrice || ""
            }
          ];
        } else {
          // 编辑所有规格：示例多规格（A1,98,10mm 等），实际可改为接口拉取
          const specs = [
            "A1,98,10mm",
            "A2,98,10mm",
            "A3,98,10mm",
            "A3.5,98,10mm",
            "A4,98,10mm"
          ];
          const code = this.productRow.productCode || "789754456";
          this.specList = specs.map((specText, i) => ({
            specText,
            productCode: code,
            dealerPrice: i >= 3 ? (i === 3 ? "40.00" : "20.00") : "",
            terminalPrice: i >= 3 ? (i === 3 ? "40.00" : "20.00") : ""
          }));
        }
      } else {
        this.specList = [];
      }
    },
    handleSubmit() {
      // TODO: 调用提交接口
      this.$emit("submit", this.specList);
      this.$message.success("提交成功");
      this.handleClose();
    },
    handleClose() {
      this.dialogVisible = false;
      this.$emit("close");
    }
  }
};
</script>

<style lang="less" scoped>
.edit-price-body {
  padding: 0 4px;
}

.spec-table {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
}

.spec-table-header,
.spec-table-row {
  display: flex;
  align-items: stretch;
  min-height: 44px;
}

.spec-table-header {
  background: #f5f7fa;
  color: #303133;
  font-size: 14px;
  font-weight: 500;
}

.spec-table-row {
  border-top: 1px solid #ebeef5;
  background: #fff;

  &:hover {
    background: #fafafa;
  }
}

.col-spec,
.col-code,
.col-dealer,
.col-terminal {
  display: flex;
  align-items: center;
  padding: 0 12px;
  border-right: 1px solid #ebeef5;

  &:last-child {
    border-right: none;
  }
}

.col-spec {
  width: 160px;
  min-width: 160px;
  flex-shrink: 0;
}

.col-code {
  width: 140px;
  min-width: 140px;
  flex-shrink: 0;
  color: #606266;
}

.col-dealer,
.col-terminal {
  flex: 1;
  min-width: 0;
}

.col-dealer ::v-deep .el-input,
.col-terminal ::v-deep .el-input {
  width: 100%;
}

.col-dealer ::v-deep .el-input__inner,
.col-terminal ::v-deep .el-input__inner {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background: #fff;
}

.edit-price-footer {
  text-align: right;

  .el-button--primary {
    background: linear-gradient(90deg, #157de9 0%, #3697fd 100%) !important;
    border: none;
  }
}
</style>

<style lang="less">
.edit-price-dialog {
  border-radius: 8px;

  .el-dialog__header {
    padding: 16px 20px;
    background: #f7f7f7;
    text-align: left;

    .el-dialog__title {
      font-size: 18px;
      color: #333;
    }

    .el-dialog__headerbtn .el-dialog__close {
      color: #909399;
      font-size: 16px;
    }
  }

  .el-dialog__body {
    padding: 20px;
    max-height: 60vh;
    overflow-y: auto;
  }

  .el-dialog__footer {
    padding: 12px 20px 20px;
    border-top: 1px solid #ebeef5;
  }
}
</style>
