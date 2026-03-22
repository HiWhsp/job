<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="420px"
    custom-class="delete-confirm-dialog"
    @close="handleClose"
  >
    <span slot="title" class="dialog-title-hidden" />

    <div class="delete-dialog-body">
      <p class="delete-dialog-main">{{ mainText }}</p>
      <p class="delete-dialog-tip">{{ tipText }}</p>
    </div>

    <div slot="footer" class="delete-dialog-footer">
      <el-button type="primary" @click="handleConfirm">确定</el-button>
      <el-button @click="handleClose">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'DeleteDialog',

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    mainText: {
      type: String,
      default: "确定要删除这个客户信息吗?"
    },
    tipText: {
      type: String,
      default: "删除后将不能恢复"
    }
  },

  computed: {
    dialogVisible: {
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
      this.$emit('cancel');
    },
    handleConfirm() {
      this.$emit('confirm');
      this.$emit('update:visible', false);
    }
  }
};
</script>

<style lang="less" scoped>
::v-deep .delete-confirm-dialog {
  border-radius: 8px;
  padding-top: 24px;

  .el-dialog__header {
    padding: 0;
    height: 0;
  }

  .el-dialog__body {
    padding: 0 24px 24px;
  }

  .el-dialog__footer {
    padding: 0 24px 24px;
  }
}

.dialog-title-hidden {
  display: none;
}

.dialog-close {
  position: absolute;
  top: 16px;
  right: 16px;
  font-size: 18px;
  color: #909399;
  cursor: pointer;

  &:hover {
    color: #606266;
  }
}

.delete-dialog-body {
  text-align: center;
  padding: 8px 0 20px;

  .delete-dialog-main {
    font-size: 16px;
    color: #303133;
    margin: 0 0 12px;
    line-height: 1.5;
  }

  .delete-dialog-tip {
    font-size: 14px;
    color: #909399;
    margin: 0;
    line-height: 1.5;
  }
}

.delete-dialog-footer {
  text-align: center;

  .el-button {
    min-width: 80px;

    & + .el-button {
      margin-left: 16px;
    }
  }

  .el-button--default {
    border-color: #dcdfe6;
    color: #606266;
  }
}
</style>

<!-- 弹框挂载到 body 时需单独样式 -->
<style lang="less">
.delete-confirm-dialog {
  border-radius: 8px;
  padding-top: 24px;

  .el-dialog__header {
    padding: 0;
    height: 0;
    min-height: 0;
  }

  .el-dialog__body {
    padding: 0 24px 24px;
  }

  .el-dialog__footer {
    padding: 0 24px 24px;
  }
}
</style>
