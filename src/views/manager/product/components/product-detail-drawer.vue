<template>
  <el-drawer
    title="产品详情"
    :visible.sync="drawerVisible"
    direction="rtl"
    size="800px"
    custom-class="product-detail-drawer-wrap"
    @close="handleClose"
  >
    <div class="detail-drawer-body">
      <div v-if="loading" class="detail-loading-wrap">
        <span>加载中...</span>
      </div>
      <template v-else-if="detail">
        <!-- 基础信息 -->
        <div class="detail-section">
          <div class="detail-section-title">基础信息</div>
          <div class="detail-section-content">
            <div class="detail-row two-col">
              <div class="detail-item">
                <span class="detail-label">产品编码：</span>
                <span class="detail-value">{{ detail.productNo || "—" }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">产品名称：</span>
                <span class="detail-value">{{ detail.title || "—" }}</span>
              </div>
            </div>
            <div class="detail-row two-col">
              <div class="detail-item">
                <span class="detail-label">所属分类：</span>
                <span class="detail-value">{{ detail.cateTitle || "—" }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">单位：</span>
                <span class="detail-value">{{ detail.unit || "—" }}</span>
              </div>
            </div>
            <div class="detail-row two-col">
              <div class="detail-item">
                <span class="detail-label">产品效期：</span>
                <span class="detail-value">{{ detail.validity || "—" }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">注册证编码：</span>
                <span class="detail-value">{{ detail.registerNo || "—" }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 证件图片 -->
        <div class="detail-section">
          <div class="detail-section-title">证件附件</div>
          <div class="detail-section-content">
            <div class="detail-row two-col">
              <div class="detail-item full has-block-label">
                <span class="detail-label">注册证附件：</span>
                <div class="detail-image-wrap">
                  <div v-if="!detail.registerImage" class="detail-image-placeholder">
                    <span>暂无图片</span>
                  </div>
                  <img v-else :src="detail.registerImage" class="detail-image" alt="注册证" />
                </div>
              </div>
              <div class="detail-item full has-block-label">
                <span class="detail-label">生产许可证：</span>
                <div class="detail-image-wrap">
                  <div v-if="!detail.licenseImage" class="detail-image-placeholder">
                    <span>暂无图片</span>
                  </div>
                  <img v-else :src="detail.licenseImage" class="detail-image" alt="生产许可证" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 产品详情 -->
        <div v-if="detail.content" class="detail-section">
          <div class="detail-section-title">产品详情</div>
          <div class="detail-section-content">
            <div class="detail-html quill-content" v-html="detail.content" />
          </div>
        </div>

        <!-- 规格列表 -->
        <div class="detail-section">
          <div class="detail-section-title">规格与库存</div>
          <div class="detail-section-content">
            <el-table v-if="inventoryList.length" :data="inventoryList" border size="small" class="spec-mini-table">
              <el-table-column prop="keyVals" label="规格值" min-width="160" show-overflow-tooltip />
              <el-table-column prop="sn" label="编码" min-width="120" show-overflow-tooltip />
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
  name: "ProductDetailDrawer",

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    productId: {
      type: [String, Number],
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
    inventoryList() {
      const d = this.detail;
      if (!d || !d._inventory) return [];
      return d._inventory;
    }
  },

  watch: {
    visible(val) {
      if (val && this.productId != null && this.productId !== "") {
        this.loadDetail();
      }
      if (!val) {
        this.detail = null;
      }
    },
    productId() {
      if (this.visible && this.productId != null && this.productId !== "") {
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
      const list = data.inventorys || data.list || data.inventoryList || [];
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
        num: it.num != null ? it.num : it.kucun ?? "—"
      }));
    },
    loadDetail() {
      const id = this.productId;
      if (id == null || id === "") return;
      this.loading = true;
      this.detail = null;
      this.$api({
        url: "/getProductInfo",
        method: "post",
        data: { id: String(id) }
      })
        .then(res => {
          if (res && res.code === 200 && res.data) {
            const raw = res.data;
            this.detail = {
              ...raw,
              _inventory: this.parseInventorys(raw)
            };
          } else {
            this.$message.error((res && res.msg) || "获取产品详情失败");
          }
        })
        .catch(() => {
          this.$message.error("获取产品详情失败");
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

  &.full {
    width: 100%;
  }

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

.detail-item.has-block-label {
  flex-direction: row;
  align-items: flex-start;

  .detail-label {
    min-width: 112px;
  }
}

.detail-image-wrap {
  margin-top: 0;
}

.detail-image-placeholder {
  font-size: 14px;
  color: #909399;
}

.detail-image {
  max-width: 200px;
  max-height: 160px;
  object-fit: contain;
  border-radius: 4px;
  border: 1px solid #ebeef5;
}

.detail-html {
  font-size: 14px;
  color: #303133;
  line-height: 1.6;
  word-break: break-word;
}

.quill-content ::v-deep img {
  max-width: 100%;
  height: auto;
}

.spec-mini-table {
  width: 100%;
}

.audit-empty {
  padding: 16px;
  color: #909399;
  font-size: 14px;
  text-align: center;
}

.detail-drawer-footer {
  padding: 16px 0 0;
  margin-top: 8px;
  border-top: 1px solid #ebeef5;
  text-align: right;

  .el-button {
    min-width: 88px;
    height: 38px;
  }

  .el-button--primary {
    background: #2373c8;
    border-color: #2373c8;
  }
}
</style>

<style lang="less">
.product-detail-drawer-wrap {
  .el-drawer__body {
    overflow: auto;
    position: relative;
  }
}
</style>
