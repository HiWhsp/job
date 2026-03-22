<template>
  <el-drawer
    title="包装详情"
    :visible.sync="drawerVisible"
    direction="rtl"
    size="640px"
    custom-class="external-package-detail-drawer-wrap"
    @close="handleClose"
  >
    <div class="detail-drawer-body">
      <div v-if="loading" class="detail-loading-wrap">
        <span>加载中...</span>
      </div>
      <template v-else-if="!loading">
        <div class="detail-section">
          <div class="detail-section-title">基础信息</div>
          <div class="detail-section-content">
            <div class="detail-row two-col">
              <div class="detail-item">
                <span class="detail-label">包装编码：</span>
                <span class="detail-value">{{ merged.packNo || "—" }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">包装名称：</span>
                <span class="detail-value">{{ merged.title || "—" }}</span>
              </div>
            </div>
            <div class="detail-row two-col">
              <div class="detail-item">
                <span class="detail-label">对应产品：</span>
                <span class="detail-value">{{ merged.productTitle || "—" }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">客户名称：</span>
                <span class="detail-value">{{ merged.customerTitle || "—" }}</span>
              </div>
            </div>
            <div class="detail-row two-col">
              <div class="detail-item">
                <span class="detail-label">单位：</span>
                <span class="detail-value">{{ merged.unit || "—" }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">更新时间：</span>
                <span class="detail-value">{{ merged.updated_at || "—" }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="detail-drawer-footer">
          <el-button type="primary" @click="handleConfirm">确定</el-button>
          <el-button @click="handleClose">取消</el-button>
        </div>
      </template>
    </div>
  </el-drawer>
</template>

<script>
export default {
  name: "ExternalPackageDetailDrawer",

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    /** 外来包装 id（列表行 id） */
    packId: {
      type: [String, Number],
      default: null
    },
    /** 列表行数据，用于接口未返回名称类字段时兜底 */
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
        packNo: d.packNo ?? r.packNo,
        title: d.title ?? r.title,
        productTitle: d.productTitle ?? r.productTitle,
        customerTitle: d.customerTitle ?? r.customerTitle,
        unit: d.unit ?? r.unit,
        updated_at: d.updated_at ?? r.updated_at
      };
    }
  },

  watch: {
    visible(val) {
      if (val && this.packId != null && this.packId !== "") {
        this.loadDetail();
      }
      if (!val) {
        this.detail = null;
      }
    },
    packId() {
      if (this.visible && this.packId != null && this.packId !== "") {
        this.loadDetail();
      }
    }
  },

  methods: {
    handleClose() {
      this.$emit("update:visible", false);
      this.$emit("close");
    },
    handleConfirm() {
      this.$emit("update:visible", false);
      this.$emit("confirm");
    },
    loadDetail() {
      const id = this.packId;
      if (id == null || id === "") return;
      this.loading = true;
      this.detail = null;
      this.$api({
        url: "/getForeignPack",
        method: "post",
        data: { id: String(id) }
      })
        .then(res => {
          if (res && res.data) {
            this.detail = res.data;
          } else {
            this.$message.error((res && res.msg) || "获取包装详情失败");
          }
        })
        .catch(() => {
          this.$message.error("获取包装详情失败");
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
  border-bottom: 1px solid #edf0f6;

  span {
    text-align: left;
    font-family: Microsoft YaHei, Microsoft YaHei;
    font-weight: bold;
    font-size: 14px;
    color: #333333;
  }
}

.detail-drawer-body {
  padding: 24px 28px 24px;
}

.detail-loading-wrap {
  padding: 40px 0;
  text-align: center;
  color: #909399;
  font-size: 14px;
}

.detail-section {
  margin-bottom: 32px;
}

.detail-section-title {
  position: relative;
  padding-left: 14px;
  margin-bottom: 20px;
  font-size: 16px;
  font-weight: bold;
  color: #2373c8;
  text-align: left;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e5e5;

  &::before {
    position: absolute;
    content: "";
    left: 0;
    top: 2px;
    width: 8px;
    height: 21px;
    background: #3377fe;
    border-radius: 2px;
  }
}

.detail-row {
  margin-bottom: 18px;

  &:last-child {
    margin-bottom: 0;
  }

  &.two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0 32px;
    margin-bottom: 18px;
    margin-left: 28px;
  }
}

.detail-item {
  min-width: 0;
  display: flex;
  align-items: flex-start;

  .detail-label {
    flex: 0 0 auto;
    font-size: 14px;
    color: #333;
    margin-right: 12px;
    white-space: nowrap;
    line-height: 22px;
    min-width: 96px;
  }

  .detail-value {
    flex: 1;
    font-size: 14px;
    color: #303133;
    word-break: break-all;
    line-height: 22px;
  }
}

.detail-drawer-footer {
  padding: 16px 24px 0;
  background: #fff;
  text-align: right;

  .el-button {
    width: 91px;
    height: 38px;
    background: #2373c8;
    border-radius: 4px;

    & + .el-button {
      margin-left: 12px;
    }
  }

  .el-button--default {
    background: #ffffff;
    border: 1px solid #b8b8b8;
    color: #6a6a6a;
  }
}
</style>

<style lang="less">
.external-package-detail-drawer-wrap {
  .el-drawer__body {
    overflow: auto;
    position: relative;
  }
}
</style>
