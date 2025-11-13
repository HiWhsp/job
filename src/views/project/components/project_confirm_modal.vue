<template>
  <div class="project-confirm-modal">
    <el-dialog
      title="温馨提示"
      width="500px"
      custom-class="project-confirm-dialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="show_modal"
      :append-to-body="true"
      @closed="on_dialog_closed()"
    >
      <div class="modal-content">
        <div class="confirm-text">{{ message }}</div>
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
  name: "project-confirm-modal",
  data() {
    return {
      show_modal: false,
      message: "是否确认通过当前录入信息",
      index: 0,
      id: null,
    };
  },
  methods: {
    init(message, index, id) {
      this.message = message || "是否确认通过当前录入信息";
      this.index = index;
      this.id = id;
      this.show_modal = true;
    },
    handleCancel() {
      this.show_modal = false;
    },
    handleConfirm() {
      this.$api({
        url: "/stepShenhe",
        method: "post",
        data: {
          id: this.id,
          step: this.index,
          shenheStatus: "2",
        },
      }).then((res) => {
        if (res.code == 200) {
          this.$message.success("通过成功");
          this.$emit("confirm");
          this.show_modal = false;
        }
      });
    },
    on_dialog_closed() {
      this.message = "是否确认通过当前录入信息";
    },
  },
};
</script>

<style scoped lang="less">
.modal-content {
  padding: 40px 20px;
  text-align: center;

  .confirm-text {
    font-size: 16px;
    color: #333;
    line-height: 1.5;
  }
}

.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 10px;
  padding: 0 20px 20px;

  .cancel-btn {
    background-color: #fff;
    border: 1px solid #3377fe;
    color: #3377fe;
    padding: 10px 20px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      background-color: #ecf5ff;
      border-color: #3377fe;
      color: #3377fe;
    }
  }

  .confirm-btn {
    background-color: #3377fe;
    border: 1px solid #3377fe;
    color: #fff;
    padding: 10px 20px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      background-color: #3377fe;
      border-color: #3377fe;
      opacity: 0.9;
    }
  }
}

// 全局样式，用于自定义dialog样式
::v-deep .project-confirm-dialog {
  border-radius: 16px;
  overflow: hidden;

  .el-dialog__header {
    background-color: #3377fe;
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

