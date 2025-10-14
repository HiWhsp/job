<template>
  <el-dialog
    title="颜色定制"
    :visible.sync="visible"
    width="400px"
    :before-close="handleClose"
    custom-class="color-custom-dialog"
  >
    <!-- 颜色输入区域 -->
    <div class="dialog-content">
      <!-- 潘通色号 -->
      <div class="input-group">
        <label class="input-label">潘通色号</label>
        <el-input
          v-model="formData.pantone"
          placeholder="请输入潘通色号"
          class="color-input"
        ></el-input>
      </div>

      <!-- 劳尔色号 -->
      <div class="input-group">
        <label class="input-label">劳尔色号</label>
        <el-input
          v-model="formData.ral"
          placeholder="请输入劳尔色号"
          class="color-input"
        ></el-input>
      </div>

      <!-- RGBA色彩 -->
      <div class="input-group">
        <label class="input-label">RGBA色彩</label>
        <el-input
          v-model="formData.rgba"
          placeholder="请输入RGBA色彩"
          class="color-input"
        ></el-input>
      </div>
    </div>

    <!-- 底部按钮 -->
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit">提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "ColorCustomDialog",
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      formData: {
        pantone: "",
        ral: "",
        rgba: "",
      },
    };
  },
  computed: {
    visible: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
  },
  methods: {
    handleClose() {
      this.visible = false;
      this.resetForm();
    },
    handleSubmit() {
      const submitData = this.formData;

      this.$emit("submit", submitData);
      this.handleClose();
    },
    resetForm() {
      this.formData = {
        pantone: "",
        ral: "",
        rgba: "",
      };
    },
    setFormData(data) {
      this.formData = data.notes || {};
    },
  },
};
</script>

<style lang="less" scoped>
.color-custom-dialog {
  .dialog-content {
    .input-group {
      margin-bottom: 20px;
      display: flex;
      background: #e5e5e5;
      border-radius: 8px;
      height: 50px;

      .input-label {
        font-family: Microsoft JhengHei UI, Microsoft JhengHei UI;
        display: block;
        color: #303030;
        font-size: 18px;
        font-weight: bold;
        width: 170px;
        text-align: center;
        line-height: 50px;
      }

      .color-input {
        /deep/ .el-input__inner {
          background-color: #fff;
          border: 1px solid #dcdfe6;
          border-radius: 6px;
          color: #303133;
          font-size: 14px;
          height: 50px;
          line-height: 50px;

          &:focus {
            outline: none;
          }

          &::placeholder {
            color: #c0c4cc;
          }
        }
      }
    }
  }

  .dialog-footer {
    text-align: center;

    .el-button {
      padding: 10px 30px;
      border-radius: 6px;
      font-size: 14px;
      min-width: 80px;

      &:hover {
        background-color: #fff;
        border-color: #fff;
        color: #37b182;
      }
    }

    .el-button--primary {
      background-color: #37b182;
      border-color: #37b182;

      &:hover {
        background-color: #37b182;
        border-color: #37b182;
        color: #fff;
      }
    }
  }
}

// 全局样式覆盖
:deep(.el-dialog) {
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  background-color: #303030;
}

:deep(.el-dialog__header) {
  padding: 20px 20px 10px;
  border-bottom: none;
}

:deep(.el-dialog__title) {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
}

:deep(.el-dialog__body) {
  padding: 20px;
}

:deep(.el-dialog__footer) {
  padding: 10px 20px 20px;
  border-top: none;
}

:deep(.el-dialog__headerbtn) {
  top: 15px;
  right: 15px;

  .el-dialog__close {
    color: #fff;
    font-size: 18px;

    &:hover {
      color: #c0c4cc;
    }
  }
}
</style>
