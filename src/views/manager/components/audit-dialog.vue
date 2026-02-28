<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="审核"
    :close-on-click-modal="false"
    width="480px"
    custom-class="audit-dialog"
    @close="handleClose"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" class="audit-form">
      <el-form-item label="审核状态：" prop="auditStatus">
        <el-radio-group v-model="form.auditStatus">
          <el-radio label="approve">批准</el-radio>
          <el-radio label="reject">拒绝</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="审核备注：" prop="auditRemark">
        <el-input
          v-model="form.auditRemark"
          placeholder="请输入"
          clearable
          maxlength="500"
          show-word-limit
        />
      </el-form-item>
    </el-form>

    <div slot="footer" class="audit-dialog-footer">
      <el-button type="primary" @click="handleSubmit">提交</el-button>
      <el-button @click="handleClose">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'AuditDialog',

  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      form: {
        auditStatus: 'reject',
        auditRemark: ''
      },
      rules: {
        auditStatus: [
          { required: true, message: '请选择审核状态', trigger: 'change' }
        ]
      }
    };
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

  watch: {
    visible(val) {
      if (val) {
        this.form.auditStatus = 'reject';
        this.form.auditRemark = '';
        this.$nextTick(() => {
          this.$refs.formRef && this.$refs.formRef.clearValidate();
        });
      }
    }
  },

  methods: {
    handleClose() {
      this.$emit('update:visible', false);
      this.$emit('cancel');
    },
    handleSubmit() {
      this.$refs.formRef.validate(valid => {
        if (!valid) return;
        this.$emit('confirm', {
          auditStatus: this.form.auditStatus,
          auditRemark: this.form.auditRemark
        });
        this.$emit('update:visible', false);
      });
    }
  }
};
</script>

<style lang="less" scoped>
.audit-form {
  padding: 0 20px 0 0;

  ::v-deep .el-form-item {
    margin-bottom: 20px;
  }

  ::v-deep .el-form-item__label {
    color: #606266;
    font-size: 14px;
  }

  ::v-deep .el-input {
    width: 100%;
  }

  ::v-deep .el-input__inner {
    border-radius: 4px;
  }

  ::v-deep .el-radio-group {
    height: 38px;
    width: 100%;
    display: flex;
    align-items: center;
  }

  ::v-deep .el-radio {
    margin-right: 12px;
    color: #303133;
    font-size: 14px;
  }

  ::v-deep .el-radio__input.is-checked .el-radio__inner {
    background: #2373C8;
    border-color: #2373C8;
  }
  
}

.audit-dialog-footer {
  display: flex;
  align-items: center;
  justify-content: center;

  .el-button {
    min-width: 88px;
  }

  .el-button--default {
    border-color: #dcdfe6;
    color: #606266;
  }

  .el-button--primary {
    margin-right: 12px;
  }
}
</style>

<style lang="less">
.audit-dialog {
  .el-dialog__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 20px 16px;
    border-bottom: 1px solid #ebeef5;
    background: #F7F7F7;

    .el-dialog__title {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
    }

    .el-dialog__headerbtn {
      top: 20px;
      right: 20px;
    }
  }

  .el-dialog__body {
    padding: 24px 20px;
  }

  .el-dialog__footer {
    padding: 16px 20px 20px;
    border-top: 1px solid #ebeef5;
  }
}
</style>
