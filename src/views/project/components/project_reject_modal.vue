<template>
  <div class="project-content-modal">
    <el-dialog
      title="驳回原因"
      width="600px"
      custom-class="project-content-dialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="show_modal"
      :append-to-body="true"
      @closed="on_dialog_closed()"
    >
      <div class="modal-content">
        <el-input
          v-model="rejectReason"
          type="textarea"
          :rows="6"
          placeholder="请填写驳回原因"
          class="reason-input"
        ></el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="cancel-btn" @click="handleCancel">取消</el-button>
        <el-button class="confirm-btn" @click="handleConfirm">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "project-content-modal",
  data() {
    return {
      show_modal: false,
      rejectReason: "",
      index: 0,
      id: null,
    };
  },
  methods: {
    init(title, index, id) {
      this.title = title;
      this.rejectReason = "";
      this.index = index;
      this.id = id;
      this.show_modal = true;
    },
    handleCancel() {
      this.show_modal = false;
      this.rejectReason = "";
    },
    handleConfirm() {
      if (!this.rejectReason.trim()) {
        this.$message.warning("请输入驳回原因");
        return;
      }
      this.$api({
        url: "/stepShenhe",
        method: "post",
        data: {
          id: this.id,
          step: this.index,
          shenheStatus: '-2',
          reason: this.rejectReason
        },
      }).then((res) => {
        if (res.code == 200) {
          this.$message.success("驳回成功");
          this.show_modal = false;
          this.$emit("confirm", this.rejectReason);
        }
      });
    },
    on_dialog_closed() {
      this.title = "";
      this.rejectReason = "";
    },
  },
};
</script>

<style scoped lang="less">
.modal-content {
  padding: 20px;
  max-height: 500px;
  overflow-y: auto;

  .reason-input {
    width: 100%;

    ::v-deep .el-textarea__inner {
      border: none;
      border-radius: 4px;
      font-size: 14px;
      color: #333;
      padding: 10px 15px;
      line-height: 1.5;
      background-color: #f8f8f8;

      &::placeholder {
        color: #c0c4cc;
      }

      &:focus {
        border: none;
      }
    }
  }

  .content-text {
    line-height: 1.8;
    color: #333;
    white-space: pre-wrap;
    word-break: break-word;
  }
}

.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 10px;
  padding: 0 20px 20px;

  .cancel-btn {
    background-color: #fff;
    border: 1px solid #3377FE;
    color: #409eff;
    padding: 10px 20px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      background-color: #ecf5ff;
      border-color: #3377FE;
      color: #3377FE;
    }
  }

  .confirm-btn {
    background-color: #3377FE;
    border: 1px solid #3377FE;
    color: #fff;
    padding: 10px 20px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      background-color: #3377FE;
      border-color: #3377FE;
    }
  }
}

// 全局样式，用于自定义dialog样式
::v-deep .project-content-dialog {
  border-radius: 16px;
  overflow: hidden;

  .el-dialog__header {
    background-color: #409eff;
    padding: 15px 20px;
    border-radius: 0;
    margin: 0;

    .el-dialog__title {
      color: #fff;
      font-size: 16px;
      font-weight: 500;
    }

    .el-dialog__close {
      color: #fff;
      font-size: 18px;

      &:hover {
        color: #fff;
        opacity: 0.8;
      }
    }
  }

  .el-dialog__body {
    padding: 0;
    background-color: #fff;
  }

  .el-dialog__footer {
    padding: 0;
    border-top: none;
  }
}
</style>
