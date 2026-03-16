<template>
  <el-drawer title="查看详情" :visible.sync="drawerVisible" direction="rtl" size="800px"
    custom-class="customer-detail-drawer" @close="handleClose">
    <div class="detail-drawer-body" v-if="detailRow">
      <!-- 基础信息 -->
      <div class="detail-section">
        <div class="detail-section-title">基础信息</div>
        <div class="detail-section-content">
          <div class="detail-row two-col">
            <div class="detail-item">
              <span class="detail-label">客户编号：</span>
              <span class="detail-value">{{ detailRow.code || '—' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">客户名称：</span>
              <span class="detail-value">{{ detailRow.name || '—' }}</span>
            </div>
          </div>
          <div class="detail-row two-col">
            <div class="detail-item">
              <span class="detail-label">客户属地：</span>
              <span class="detail-value">{{ detailRow.territory || '—' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">客户区域：</span>
              <span class="detail-value">{{ detailRow.region || '—' }}</span>
            </div>
          </div>
          <div class="detail-row two-col">
            <div class="detail-item">
              <span class="detail-label">客户属性A：</span>
              <span class="detail-value">{{ detailRow.attrA || '—' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">客户属性B：</span>
              <span class="detail-value">{{ detailRow.attrB || '—' }}</span>
            </div>
          </div>
          <div class="detail-row two-col">
            <div class="detail-item">
              <span class="detail-label">客户直接联系人：</span>
              <span class="detail-value">{{ detailRow.contactPerson || '—' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">客户联系电话：</span>
              <span class="detail-value">{{ detailRow.contactPhone || '—' }}</span>
            </div>
          </div>
          <div class="detail-row two-col">
            <div class="detail-item">
              <span class="detail-label">公司电话：</span>
              <span class="detail-value">{{ detailRow.companyPhone || '—' }}</span>
            </div>
          </div>
          <div class="detail-row two-col">
            <div class="detail-item full has-block-label">
              <span class="detail-label">营业执照：</span>
              <div class="detail-image-wrap">
                <div class="detail-image-placeholder" v-if="!detailRow.businessLicense">
                  <span>暂无图片</span>
                </div>
                <img v-else :src="detailRow.businessLicense" class="detail-image" alt="营业执照" />
              </div>
            </div>
          </div>
          <div class="detail-row">
            <div class="detail-item full has-block-label">
              <span class="detail-label">医疗器械相关许可证：</span>
              <div class="detail-image-group">
                <div class="detail-image-placeholder" v-if="!detailRow.medicalLicense1">
                  <span>暂无</span>
                </div>
                <img v-else :src="detailRow.medicalLicense1" class="detail-image" alt="许可证1" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 对公收款信息 -->
      <div class="detail-section">
        <div class="detail-section-title">对公收款信息</div>
        <div class="detail-section-content">
          <div class="detail-row">
            <div class="detail-item">
              <span class="detail-label">户名：</span>
              <span class="detail-value">{{ detailRow.accountName || '—' }}</span>
            </div>
          </div>
          <div class="detail-row">
            <div class="detail-item">
              <span class="detail-label">账号：</span>
              <span class="detail-value">{{ detailRow.accountNo || '—' }}</span>
            </div>
          </div>
          <div class="detail-row">
            <div class="detail-item">
              <span class="detail-label">开户行：</span>
              <span class="detail-value">{{ detailRow.bankName || '—' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 客户收货信息 -->
      <div class="detail-section">
        <div class="detail-section-title">客户收货信息</div>
        <div class="detail-section-content">
          <div class="detail-row">
            <div class="detail-item full">
              <span class="detail-label">收货地址：</span>
              <span class="detail-value">{{ detailRow.address || '—' }}</span>
            </div>
          </div>
          <div class="detail-row">
            <div class="detail-item full">
              <span class="detail-label">收货人：</span>
              <span class="detail-value">{{ detailRow.receiver || '—' }}</span>
            </div>
          </div>
          <div class="detail-row">
            <div class="detail-item full">
              <span class="detail-label">收货人联系方式：</span>
              <span class="detail-value">{{ detailRow.receiverPhone || '—' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 其他信息 -->
      <div class="detail-section">
        <div class="detail-section-title">其他信息</div>
        <div class="detail-section-content">
          <div class="detail-row">
            <div class="detail-item">
              <span class="detail-label">客户引入人：</span>
              <span class="detail-value">{{ detailRow.introducer || '—' }}</span>
            </div>
          </div>
          <div class="detail-row">
            <div class="detail-item">
              <span class="detail-label">客户负责人：</span>
              <span class="detail-value">{{ detailRow.manager || '—' }}</span>
            </div>
          </div>
          <div class="detail-row">
            <div class="detail-item full">
              <span class="detail-label">其他：</span>
              <span class="detail-value">{{ detailRow.other || '—' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 审核（仅审核页查看详情时展示） -->
      <div v-if="showAuditSection" class="detail-section">
        <div class="detail-section-title">审核</div>
        <div class="detail-section-content">
          <div class="audit-table">
            <div class="audit-table-header">
              <span class="audit-th">审核时间</span>
              <span class="audit-th">审核状态</span>
              <span class="audit-th">审核备注</span>
            </div>
            <div class="audit-table-body">
              <span class="audit-td">{{ detailRow.auditTime || '—' }}</span>
              <span class="audit-td">
                <el-tag v-if="detailRow.auditStatus === 'pending'" type="info" size="small">待审核</el-tag>
                <el-tag v-else-if="detailRow.auditStatus === 'rejected'" type="danger" size="small">审核未通过</el-tag>
                <el-tag v-else-if="detailRow.auditStatus === 'audited'" type="success" size="small">已审核</el-tag>
                <span v-else>—</span>
              </span>
              <span class="audit-td">{{ detailRow.auditRemark || '—' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部按钮 -->
      <div class="detail-drawer-footer">
        <el-button type="primary" @click="handleConfirm">确定</el-button>
        <el-button @click="handleClose">取消</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
export default {
  name: 'DetailDrawer',

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    detailRow: {
      type: Object,
      default: null
    },
    /** 是否展示审核区块（审核页查看详情时为 true） */
    showAuditSection: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    drawerVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit('update:visible', val);
      }
    }
  },

  methods: {
    handleClose() {
      this.$emit('update:visible', false);
      this.$emit('close');
    },
    handleConfirm() {
      this.$emit('update:visible', false);
      this.$emit('confirm');
    }
  }
};
</script>

<style lang="less" scoped>
::v-deep .el-drawer__header {
  padding: 0 24px;
  height: 57px;
  border-bottom: 1px solid #EDF0F6;

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
  color: #2373C8;
  text-align: left;
  padding-bottom: 12px;
  border-bottom: 1px solid #E5E5E5;

  &::before {
    position: absolute;
    content: '';
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

/* 审核区块：表头 + 一行数据 */
.audit-table {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  overflow: hidden;
}

.audit-table-header {
  display: grid;
  grid-template-columns: 180px 120px 1fr;
  background: #f5f7fa;
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}

.audit-th {
  padding: 12px 16px;
  border-bottom: 1px solid #ebeef5;
}

.audit-table-body {
  display: grid;
  grid-template-columns: 180px 120px 1fr;
  font-size: 14px;
  color: #303133;
}

.audit-td {
  padding: 12px 16px;
  word-break: break-all;
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

/* 带图片的项：标签单独一行，内容在下方 */
.detail-item.has-block-label {
  flex-direction: row;
  align-items: start;

  .detail-label {
    min-width: 112px;
  }

  .detail-value {
    text-align: left;
  }
}

.detail-image-wrap,
.detail-image-group {
  margin-top: 0;
}

/* 营业执照：一大块，略宽于高 */
.detail-image-placeholder {
  font-size: 14px;
  color: #303133;
  word-break: break-all;
  text-align: left;
  line-height: 22px;
}

.detail-image {
  width: 122px;
  height: 104px;
  object-fit: contain;
}

.detail-image-group {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.detail-drawer-footer {
  padding: 16px 24px;
  background: #fff;
  border-top: 1px solid #ebeef5;
  text-align: right;

  .el-button {
    width: 91px;
    height: 38px;
    background: #2373C8;
    border-radius: 4px;

    &+.el-button {
      margin-left: 12px;
    }
  }

  .el-button--default {
    background: #FFFFFF;
    border: 1px solid #B8B8B8;
    color: #6A6A6A;
  }
}
</style>

<style lang="less">
.customer-detail-drawer {
  .el-drawer__body {
    overflow: auto;
    position: relative;
  }
}
</style>
