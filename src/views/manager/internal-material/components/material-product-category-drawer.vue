<template>
  <el-drawer
    title="用于产品分类"
    :visible.sync="drawerVisible"
    direction="rtl"
    size="720px"
    custom-class="material-product-category-drawer-wrap"
    :before-close="handleBeforeClose"
    @close="handleClose"
  >
    <div class="mpc-drawer-body">
      <div v-if="loading" class="mpc-loading">加载中...</div>
      <template v-else>
        <!-- 顶部原料信息 -->
        <div class="mpc-info-grid">
          <div class="mpc-info-item">
            <span class="mpc-label">原料名称：</span>
            <span class="mpc-value">{{ merged.title || "—" }}</span>
          </div>
          <div class="mpc-info-item">
            <span class="mpc-label">原料编码：</span>
            <span class="mpc-value">{{ merged.materialNo || "—" }}</span>
          </div>
          <div class="mpc-info-item">
            <span class="mpc-label">所属分类：</span>
            <span class="mpc-value">{{ merged.cateTitle || "—" }}</span>
          </div>
          <div class="mpc-info-item">
            <span class="mpc-label">单位：</span>
            <span class="mpc-value">{{ merged.unit || "—" }}</span>
          </div>
          <div class="mpc-info-item">
            <span class="mpc-label">存储条件：</span>
            <span class="mpc-value">{{ merged.storageConditions || "—" }}</span>
          </div>
        </div>

        <!-- 产品大类列表 -->
        <div class="mpc-table-wrap">
          <el-table
            :data="categoryRows"
            border
            header-cell-class-name="mpc-table-header"
            empty-text="暂无关联产品大类"
          >
            <el-table-column label="序号" width="72" align="center">
              <template slot-scope="{ row }">{{ row._index }}</template>
            </el-table-column>
            <el-table-column
              prop="title"
              label="产品大类名称"
              min-width="160"
              align="center"
              show-overflow-tooltip
            />
            <el-table-column
              prop="code"
              label="产品大类编码"
              min-width="160"
              align="center"
              show-overflow-tooltip
            />
          </el-table>
        </div>

        <div class="mpc-drawer-footer">
          <el-button type="primary" @click="handleConfirm">确定</el-button>
          <el-button @click="handleClose">取消</el-button>
        </div>
      </template>
    </div>
  </el-drawer>
</template>

<script>
/**
 * 从详情接口数据中解析「用于产品大类/产品分类」表格行。
 * 兼容多种后端字段：列表数组或单个 title + code。
 */
function normalizeProductCategoryRows(raw) {
  if (!raw || typeof raw !== "object") return [];
  const list =
    raw.productCateList ||
    raw.productCates ||
    raw.useProductCateList ||
    raw.productCategoryList;
  if (Array.isArray(list) && list.length) {
    return list.map((it, i) => ({
      _index: String(i + 1).padStart(3, "0"),
      title:
        it.title ||
        it.name ||
        it.cateTitle ||
        it.productCateTitle ||
        it.categoryName ||
        "",
      code:
        it.code != null && it.code !== ""
          ? String(it.code)
          : it.cateNo != null && it.cateNo !== ""
          ? String(it.cateNo)
          : it.productCateNo != null && it.productCateNo !== ""
          ? String(it.productCateNo)
          : it.sn != null && it.sn !== ""
          ? String(it.sn)
          : it.id != null && it.id !== ""
          ? String(it.id)
          : ""
    }));
  }
  const title = raw.productCateTitle || raw.useProductCateTitle || "";
  const code =
    raw.productCateNo != null && raw.productCateNo !== ""
      ? String(raw.productCateNo)
      : raw.productCategoryCode != null && raw.productCategoryCode !== ""
      ? String(raw.productCategoryCode)
      : raw.productCateCode != null && raw.productCateCode !== ""
      ? String(raw.productCateCode)
      : "";
  if (title || code) {
    return [{ _index: "001", title, code }];
  }
  return [];
}

export default {
  name: "MaterialProductCategoryDrawer",

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    materialId: {
      type: [String, Number],
      default: null
    },
    rowSummary: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      loading: false,
      detail: null
    };
  },

  computed: {
    drawerVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit("update:visible", val);
      }
    },
    merged() {
      const r = this.rowSummary || {};
      const d = this.detail || {};
      return {
        materialNo: d.materialNo ?? r.materialNo,
        title: d.title ?? r.title,
        cateTitle: d.cateTitle ?? r.cateTitle,
        unit: d.unit ?? r.unit,
        storageConditions: d.storageConditions ?? r.storageConditions
      };
    },
    categoryRows() {
      const fromDetail = this.detail
        ? normalizeProductCategoryRows(this.detail)
        : [];
      if (fromDetail.length) return fromDetail;
      const r = this.rowSummary || {};
      return normalizeProductCategoryRows({
        productCateTitle: r.productCateTitle,
        productCateNo: r.productCateNo,
        productCategoryCode: r.productCategoryCode
      });
    }
  },

  watch: {
    visible(val) {
      if (val && this.materialId != null && this.materialId !== "") {
        this.loadDetail();
      }
      if (!val) {
        this.detail = null;
      }
    },
    materialId() {
      if (this.visible && this.materialId != null && this.materialId !== "") {
        this.loadDetail();
      }
    }
  },

  methods: {
    handleBeforeClose(done) {
      done();
    },
    handleClose() {
      this.$emit("update:visible", false);
      this.$emit("close");
    },
    handleConfirm() {
      this.$emit("update:visible", false);
      this.$emit("confirm");
    },
    loadDetail() {
      const id = this.materialId;
      if (id == null || id === "") return;
      this.loading = true;
      this.detail = null;
      this.$api({
        url: "/getMaterialInfo",
        method: "post",
        data: { id: String(id) }
      })
        .then(res => {
          if (res && res.data) {
            this.detail = { ...res.data };
          } else {
            this.$message.error((res && res.msg) || "获取原料信息失败");
          }
        })
        .catch(() => {
          this.$message.error("获取原料信息失败");
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="less" scoped>
::v-deep .el-drawer__header {
  padding: 0 24px;
  height: 57px;
  margin-bottom: 0;
  border-bottom: 1px solid #edf0f6;

  span {
    text-align: left;
    font-family: Microsoft YaHei, Microsoft YaHei;
    font-weight: bold;
    font-size: 14px;
    color: #333333;
  }
}

.mpc-drawer-body {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  height: 100%;
  padding: 20px 24px 24px;
  box-sizing: border-box;
}

.mpc-loading {
  padding: 48px 0;
  text-align: center;
  color: #909399;
  font-size: 14px;
}

.mpc-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px 24px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #edf0f6;
}

.mpc-info-full {
  grid-column: 1 / -1;
}

.mpc-info-item {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}

.mpc-label {
  width: 100px;
  font-size: 13px;
  color: #909399;
  line-height: 1.4;
  text-align: left;

  font-family: Microsoft YaHei, Microsoft YaHei;
  font-weight: 400;
  font-size: 14px;
  color: #333333;
}

.mpc-value {
  font-size: 14px;
  color: #303133;
  line-height: 22px;
  word-break: break-all;
}

.mpc-table-wrap {
  flex: 1;
  min-height: 200px;
  overflow: auto;

  ::v-deep .mpc-table-header {
    background: #f5f7fa !important;
    color: #303133;
    font-weight: 500;
  }

  ::v-deep .el-table {
    font-size: 14px;
  }

  ::v-deep .el-table th,
  ::v-deep .el-table td {
    border-color: #ebeef5;
  }
}

.mpc-drawer-footer {
  flex-shrink: 0;
  padding-top: 20px;
  margin-top: auto;
  text-align: right;
  border-top: 1px solid #edf0f6;

  .el-button--primary {
    min-width: 91px;
    background: linear-gradient(90deg, #157de9 0%, #3697fd 100%);
    border: none;
  }

  .el-button + .el-button {
    margin-left: 12px;
  }
}
</style>

<style lang="less">
.material-product-category-drawer-wrap {
  .el-drawer__body {
    display: flex;
    flex-direction: column;
    height: calc(100% - 57px);
    overflow: hidden;
    padding: 0;
    box-sizing: border-box;
  }
}
</style>
