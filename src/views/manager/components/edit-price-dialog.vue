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
      <div v-if="specList && specList.length" class="spec-table">
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
      <el-empty v-else description="暂无价格数据" />
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
      specList: [],
      loading: false
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
    async buildSpecList() {
      if (!this.productRow) {
        this.specList = [];
        return;
      }
      // currentSpecOnly: 1 单独规格（用当前行的库存 id）；否则 2 全部规格（用商品 id）
      const id = this.productRow.id != null ? String(this.productRow.id) : "";
      const type = this.currentSpecOnly ? "1" : "2";
      if (!id) {
        this.specList = [];
        return;
      }
      const loading = this.$loading({
        lock: true,
        fullscreen: true,
        text: "正在加载价格信息...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.35)"
      });
      this.loading = true;
      try {
        const res = await this.$api({
          url: "/getProductInventory",
          method: "post",
          data: { id, type }
        });
        const list = Array.isArray(res && res.data ? res.data : []) ? res.data : [];
        this.specList = list.map((it) => ({
          id: it.id,
          specText: it.keyVals || "",
          productCode: it.sn || "",
          dealerPrice: it.price1 != null ? String(it.price1) : "",
          terminalPrice: it.price2 != null ? String(it.price2) : ""
        }));
      } catch (e) {
        this.$message.error((e && e.msg) ? e.msg : "获取价格信息失败");
        this.specList = [];
      } finally {
        this.loading = false;
        loading.close();
      }
    },
    async handleSubmit() {
      if (!Array.isArray(this.specList) || !this.specList.length) {
        this.$message.warning("暂无可提交的价格数据");
        return;
      }
      const payload = this.specList
        .filter((it) => it && it.id != null)
        .map((it) => ({
          id: String(it.id),
          price1: it.dealerPrice != null ? String(it.dealerPrice) : "",
          price2: it.terminalPrice != null ? String(it.terminalPrice) : ""
        }));
      if (!payload.length) {
        this.$message.warning("暂无可提交的价格数据");
        return;
      }
      const loading = this.$loading({
        lock: true,
        fullscreen: true,
        text: "正在提交价格...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.35)"
      });
      try {
        await this.$api({
          url: "/setProductInventoryPrice",
          method: "post",
          data: { info: JSON.stringify(payload) }
        });
        this.$message.success("提交成功");
        this.$emit("submit", this.specList);
        this.handleClose();
      } catch (e) {
        this.$message.error((e && e.msg) ? e.msg : "提交价格失败");
      } finally {
        loading.close();
      }
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
