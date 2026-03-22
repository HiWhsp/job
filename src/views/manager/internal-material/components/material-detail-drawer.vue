<template>
  <el-drawer
    title="原料详情"
    :visible.sync="drawerVisible"
    direction="rtl"
    size="800px"
    custom-class="material-detail-drawer-wrap"
    @close="handleClose"
  >
    <div class="detail-drawer-body">
      <div v-if="loading" class="detail-loading-wrap">
        <span>加载中...</span>
      </div>
      <template v-else-if="!loading">
        <!-- 基础信息 -->
        <div class="detail-section">
          <div class="detail-section-title">基础信息</div>
          <div class="detail-section-content">
            <div class="detail-row two-col">
              <div class="detail-item">
                <span class="detail-label">原料编码：</span>
                <span class="detail-value">{{ merged.materialNo || "—" }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">原料名称：</span>
                <span class="detail-value">{{ merged.title || "—" }}</span>
              </div>
            </div>
            <div class="detail-row two-col">
              <div class="detail-item">
                <span class="detail-label">规格：</span>
                <span class="detail-value">{{ merged.spec || "—" }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">批次：</span>
                <span class="detail-value">{{ merged.batchNo || "—" }}</span>
              </div>
            </div>
            <div class="detail-row two-col">
              <div class="detail-item">
                <span class="detail-label">储存条件：</span>
                <span class="detail-value">{{ merged.storageConditions || "—" }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">单位：</span>
                <span class="detail-value">{{ merged.unit || "—" }}</span>
              </div>
            </div>
            <div class="detail-row two-col">
              <div class="detail-item">
                <span class="detail-label">所属管理类别：</span>
                <span class="detail-value">{{ merged.cateTitle || "—" }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">用于产品分类：</span>
                <span class="detail-value">{{ merged.productCateTitle || "—" }}</span>
              </div>
            </div>
            <div class="detail-row two-col">
              <div class="detail-item">
                <span class="detail-label">更新时间：</span>
                <span class="detail-value">{{ merged.updated_at || "—" }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 原料详情（富文本，来自接口 content） -->
        <div class="detail-section">
          <div class="detail-section-title">原料详情</div>
          <div class="detail-section-content">
            <div v-if="merged.content" class="detail-html quill-content" v-html="merged.content" />
            <div v-else class="audit-empty">暂无详情说明</div>
          </div>
        </div>

        <!-- 规格与库存 -->
        <div class="detail-section">
          <div class="detail-section-title">规格与库存</div>
          <div class="detail-section-content">
            <el-table
              v-if="inventoryList.length"
              :data="inventoryList"
              border
              size="small"
              class="spec-mini-table"
            >
              <el-table-column prop="keyVals" label="规格值" min-width="160" show-overflow-tooltip />
              <el-table-column prop="sn" label="编码" min-width="120" show-overflow-tooltip />
              <el-table-column prop="batchNo" label="批次" min-width="120" show-overflow-tooltip />
              <el-table-column prop="num" label="库存" width="100" align="right" />
            </el-table>
            <div v-else class="audit-empty">暂无规格数据</div>
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
  name: "MaterialDetailDrawer",

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    /** 原料 id（列表行 id） */
    materialId: {
      type: [String, Number],
      default: null
    },
    /** 列表行数据，用于在接口未返回分类标题等字段时兜底展示 */
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
    /** 接口详情与列表行合并，优先接口字段 */
    merged() {
      const r = this.rowSummary || {};
      const d = this.detail || {};
      return {
        materialNo: d.materialNo ?? r.materialNo,
        title: d.title ?? r.title,
        spec: d.spec ?? r.spec,
        batchNo: d.batchNo ?? r.batchNo,
        storageConditions: d.storageConditions ?? r.storageConditions,
        unit: d.unit ?? r.unit,
        cateTitle: d.cateTitle ?? r.cateTitle,
        productCateTitle: d.productCateTitle ?? r.productCateTitle,
        updated_at: d.updated_at ?? r.updated_at,
        content: d.content ?? ""
      };
    },
    inventoryList() {
      return this.detail && this.detail._inventory ? this.detail._inventory : [];
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
    handleClose() {
      this.$emit("update:visible", false);
      this.$emit("close");
    },
    handleConfirm() {
      this.$emit("update:visible", false);
      this.$emit("confirm");
    },
    parseInventorys(data) {
      const list = data.inventorys || [];
      const arr = Array.isArray(list)
        ? list
        : typeof list === "string"
          ? (() => {
              try {
                return JSON.parse(list);
              } catch (e) {
                return [];
              }
            })()
          : [];
      return arr.map(it => ({
        keyVals: it.keyVals ?? "",
        sn: it.sn ?? "",
        batchNo: it.batchNo ?? "",
        num: it.num != null ? it.num : it.kucun ?? "—"
      }));
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
            const raw = res.data;
            this.detail = {
              ...raw,
              _inventory: this.parseInventorys(raw)
            };
          } else {
            this.$message.error((res && res.msg) || "获取原料详情失败");
          }
        })
        .catch(() => {
          this.$message.error("获取原料详情失败");
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

  &:last-of-type {
    margin-bottom: 0;
  }
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

.detail-section-content {
  padding: 0;
}

.detail-row {
  margin-bottom: 18px;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;

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
  flex: 1 1 auto;

  .detail-label {
    flex: 0 0 auto;
    font-size: 14px;
    color: #333;
    margin-right: 12px;
    white-space: nowrap;
    line-height: 22px;
    text-align: left;
    min-width: 112px;
  }

  .detail-value {
    flex: 1;
    font-size: 14px;
    color: #303133;
    word-break: break-all;
    text-align: left;
    line-height: 22px;
  }
}

.detail-html {
  font-size: 14px;
  color: #303133;
  line-height: 1.6;
  word-break: break-word;

  ::v-deep img {
    max-width: 100%;
    height: auto;
  }

  ::v-deep p {
    margin: 0 0 8px;
  }
}

.audit-empty {
  padding: 16px;
  color: #909399;
  font-size: 14px;
  text-align: center;
}

.spec-mini-table {
  width: 100%;
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
.material-detail-drawer-wrap {
  .el-drawer__body {
    overflow: auto;
    position: relative;
  }
}
</style>
