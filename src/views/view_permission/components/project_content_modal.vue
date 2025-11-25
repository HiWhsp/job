<template>
  <div class="project-content-modal">
    <el-dialog
      :title="title"
      width="600px"
      custom-class="project-content-dialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="show_modal"
      :append-to-body="true"
      @closed="on_dialog_closed()"
    >
      <div class="modal-content">
        <div class="content-text" v-html="content"></div>
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
      content: "",
      title: "",
    };
  },
  methods: {
    init(content, title) {
      this.content = content || `暂无${title}`;
      this.title = title;
      this.show_modal = true;
    },
    on_dialog_closed() {
      this.title = "";
      this.content = "";
    },
  },
};
</script>

<style scoped lang="less">
.modal-content {
  padding: 37px 20px;
  max-height: 500px;
  overflow-y: auto;

  .content-text {
    line-height: 1.8;
    color: #333;
    white-space: pre-wrap;
    word-break: break-word;
  }
}

// 全局样式，用于自定义dialog样式
::v-deep .project-content-dialog {
  border-radius: 16px;
  .el-dialog__header {
    background-color: #3377fe;
    padding: 15px 20px;
    border-radius: 16px 16px 0 0;

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
      }
    }
  }

  .el-dialog__body {
    padding: 0;
  }

  .el-dialog__footer {
    padding: 15px 20px;
    border-top: 1px solid #e4e7ed;
  }
}
</style>
