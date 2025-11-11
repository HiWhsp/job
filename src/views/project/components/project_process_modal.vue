<template>
  <div class="project-process-modal">
    <el-dialog
      title="项目流程"
      width="800px"
      custom-class="project-process-dialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="show_modal"
      :append-to-body="true"
      @closed="on_dialog_closed()"
    >
      <div class="modal-content">
        <div class="process-list" v-if="processList && processList.length > 0">
          <div
            class="process-item"
            v-for="(item, index) in processList"
            :key="index"
          >
            <div class="process-name">
              {{ item.name }}
            </div>
            <div class="process-action" :class="getActionClass(item.status)">
              <span
                v-if="item.status === 'view'"
                @click="handleView(item.name, index)"
                >查看资料</span
              >
              <span
                v-else-if="item.status === 'input'"
                @click="handleInput(item, index)"
                >资料录入</span
              >
              <span v-else>未录入</span>
            </div>
          </div>
        </div>
        <div v-else class="empty-content">
          <el-empty description="暂无流程信息"></el-empty>
        </div>
      </div>
    </el-dialog>

    <!-- 流程资料详情弹框 -->
    <project_process_detail_modal ref="process_detail_modal" />
    
    <!-- 资料录入弹框 -->
    <project_process_input_modal ref="process_input_modal" @confirm="handleInputConfirm" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import project_process_detail_modal from "./project_process_detail_modal.vue";
import project_process_input_modal from "./project_process_input_modal.vue";

export default {
  name: "project-process-modal",
  components: {
    project_process_detail_modal,
    project_process_input_modal,
  },
  data() {
    return {
      show_modal: false,
      processList: [
        {
          name: "深化设计、排版套料",
          status: "view",
          isStepRole: false,
        },
        {
          name: "物资检验",
          status: "input",
          isStepRole: false,
        },
        {
          name: "下料",
          status: "",
        },
        {
          name: "装配",
          status: "",
        },
        {
          name: "焊清",
          status: "",
        },
        {
          name: "校正",
          status: "",
        },
        {
          name: "总装",
          status: "",
        },
        {
          name: "涂装",
          status: "",
        },
        {
          name: "检验出厂",
          status: "",
        },
      ],
      row: {},
    };
  },
  computed: {
    ...mapState(["vuex_user"]),
  },
  methods: {
    init(row) {
      if (row) {
        this.row = row;
      }
      this.processList.forEach((item, index) => {
        item.isStepRole =
          this.vuex_user.stepRole &&
          this.vuex_user.stepRole[index] &&
          this.vuex_user.stepRole[index].status == 1;
      });
      console.log(this.processList);
      this.show_modal = true;
    },

    // 获取操作按钮的样式类
    getActionClass(status) {
      if (status === "input") {
        return "action-active";
      }
      return "action-inactive";
    },

    // 处理查看资料
    handleView(name, index) {
      this.$refs.process_detail_modal.init(name, {});
      return;
      this.$api({
        url: "/getStepInfo",
        method: "get",
        data: {
          id: this.row.id,
          step: index + 1,
        },
      }).then((res) => {
        if (res.code == 200) {
          this.$refs.process_detail_modal.init(res.data);
        }
      });
    },

    // 处理资料录入
    handleInput(item, index) {
      // 打开资料录入弹框
      const projectId = this.row.id || this.row.projectId;
      this.$refs.process_input_modal.init(item.name, index, projectId);
    },
    
    // 资料录入确认后的回调
    handleInputConfirm() {
      // 可以在这里刷新流程列表或执行其他操作
      console.log("资料录入成功");
    },

    on_dialog_closed() {
      this.row = {};
    },
  },
};
</script>

<style scoped lang="less">
.modal-content {
  padding: 20px;
  min-height: 200px;
  max-height: 600px;
  overflow-y: auto;

  .process-list {
    .process-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
      height: 40px;
      margin-bottom: 10px;
      background-color: #f5f7fa;
      border-radius: 8px;
      transition: all 0.3s;

      &:hover {
        background-color: #ecf5ff;
      }

      .process-name {
        font-size: 14px;
        color: #000;
        font-weight: bold;
      }

      .process-action {
        font-size: 14px;
        cursor: pointer;

        &.action-active {
          color: #409eff;
          font-weight: 500;
        }

        &.action-inactive {
          color: #909399;
        }
      }
    }
  }

  .empty-content {
    padding: 40px 0;
  }
}

// 全局样式，用于自定义dialog样式
::v-deep .project-process-dialog {
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
