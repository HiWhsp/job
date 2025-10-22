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
      <!-- 颜色类型选择 -->
      <div class="input-group">
        <el-select
          v-model="formData.colorType"
          placeholder="请选择颜色类型"
          class="color-select"
          @change="handleColorTypeChange"
        >
          <el-option label="潘通色号" value="pantone"></el-option>
          <el-option label="劳尔色号" value="ral"></el-option>
          <el-option label="RGBA色彩" value="rgba"></el-option>
        </el-select>
      </div>

      <!-- 颜色值输入 -->
      <div class="input-group" v-if="formData.colorType">
        <el-input
          v-model="formData.colorValue"
          :placeholder="getPlaceholder"
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
        colorType: "",
        colorValue: "",
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
    getPlaceholder() {
      const placeholderMap = {
        pantone: "请输入潘通色号：例 2337C",
        ral: "请输入劳尔色号：例 RAL 5012",
        rgba: "请输入RGBA色彩：例 #FFFFFF",
      };
      return placeholderMap[this.formData.colorType] || "请输入颜色值";
    },
  },
  methods: {
    handleClose() {
      this.visible = false;
      this.resetForm();
    },
    handleSubmit() {
      const submitData = this.formData;

      this.$emit("submit", {
        pantone:
          submitData.colorType === "pantone" ? submitData.colorValue : null,
        ral: submitData.colorType === "ral" ? submitData.colorValue : null,
        rgba: submitData.colorType === "rgba" ? submitData.colorValue : null,
      });
      this.handleClose();
    },
    resetForm() {
      this.formData = {
        colorType: "",
        colorValue: "",
      };
    },
    setFormData(data) {
      if (data.notes && (data.notes.pantone || data.notes.ral || data.notes.rgba)) {
        this.formData = {
          colorType: data.notes.pantone
            ? "pantone"
            : data.notes.ral
            ? "ral"
            : data.notes.rgba
            ? "rgba"
            : "",
          colorValue: data.notes.pantone
            ? data.notes.pantone
            : data.notes.ral
            ? data.notes.ral
            : data.notes.rgba
            ? data.notes.rgba
            : "",
        };
      } else {
        this.formData = {
          colorType: "",
          colorValue: "",
        };
      }
    },
    handleColorTypeChange(value) {
      this.formData.colorValue = "";
    },
  },
};
</script>

<style lang="less" scoped>
.color-custom-dialog {
  .dialog-content {
    .input-group {
      margin-bottom: 20px;

      .color-select {
        width: 100%;

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

      .color-input {
        width: 100%;

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
