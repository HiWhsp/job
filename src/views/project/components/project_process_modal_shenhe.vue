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
            <div
              class="process-action"
              :class="getActionClass(item.status)"
              v-if="item.isStepRole"
              @click="handleView(item.status, index)"
            >
              {{
                !item.status
                  ? "未录入"
                  : item.status % 10 == 5
                  ? "已通过"
                  : item.status % 10 == 2
                  ? "已驳回"
                  : "待审核"
              }}
            </div>
          </div>
        </div>
        <div v-else class="empty-content">
          <el-empty description="暂无流程信息"></el-empty>
        </div>
      </div>
    </el-dialog>

    <!-- 流程资料详情弹框 -->
    <project_process_detail_modal_shenhe ref="process_detail_modal_shenhe" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import project_process_detail_modal_shenhe from "./project_process_detail_modal_shenhe.vue";

export default {
  name: "project-process-modal",
  components: {
    project_process_detail_modal_shenhe,
  },
  data() {
    return {
      show_modal: false,
      processList: [
        {
          name: "深化设计、排版套料",
          status: "",
        },
        {
          name: "物资检验",
          status: "",
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

      //10-步骤1提交,15-步骤1通过,20-步骤2提交待审,25-步骤2通过,30-步骤3提交待审,35-步骤3通过,
      //40-步骤4提交待审,45-步骤4通过,50-步骤5提交待审,55-步骤5通过,60-步骤6提交待审,65-步骤6通过,
      //70-步骤7提交待审,75-步骤7通过,80-步骤8提交待审,85-步骤8通过,90-步骤9提交待审,100-完成

      // 获取步骤状态
      this.getStepStatus();
      this.show_modal = true;
    },

    // 获取步骤状态
    getStepStatus() {
      const currentStatus = this.row.status;
      if (!currentStatus) {
        // 如果没有状态，所有步骤都为空
        this.processList.forEach((item) => {
          item.status = "";
        });
        return;
      }

      // 定义状态映射：每个步骤的提交、驳回、通过状态
      const stepStatusMap = [
        { submit: 10, reject: 12, pass: 15 }, // 步骤1
        { submit: 20, reject: 22, pass: 25 }, // 步骤2
        { submit: 30, reject: 32, pass: 35 }, // 步骤3
        { submit: 40, reject: 42, pass: 45 }, // 步骤4
        { submit: 50, reject: 52, pass: 55 }, // 步骤5
        { submit: 60, reject: 62, pass: 65 }, // 步骤6
        { submit: 70, reject: 72, pass: 75 }, // 步骤7
        { submit: 80, reject: 82, pass: 85 }, // 步骤8
        { submit: 90, reject: 92, pass: 95 }, // 步骤9
        { submit: 100, reject: null, pass: null }, // 完成
      ];

      // 初始化所有步骤状态为空
      this.processList.forEach((item) => {
        item.status = "";
      });

      // 确定当前状态所在的步骤索引
      let currentStepIndex = -1;
      for (let i = 0; i < stepStatusMap.length; i++) {
        const step = stepStatusMap[i];
        if (
          currentStatus === step.submit ||
          currentStatus === step.reject ||
          currentStatus === step.pass ||
          currentStatus === 100
        ) {
          currentStepIndex = i;
          break;
        }
      }

      // 如果找到了当前步骤
      if (currentStepIndex >= 0) {
        // 设置当前步骤的状态
        this.processList[currentStepIndex].status = currentStatus;

        // 设置之前所有步骤为通过状态
        for (let i = 0; i < currentStepIndex; i++) {
          this.processList[i].status = stepStatusMap[i].pass;
        }
      } else {
        // 如果状态不在映射中，可能是中间状态，尝试找到最接近的步骤
        // 例如状态值在某个范围内
        for (let i = 0; i < stepStatusMap.length; i++) {
          const step = stepStatusMap[i];
          if (
            currentStatus >= step.submit &&
            currentStatus < (stepStatusMap[i + 1]?.submit || 1000)
          ) {
            // 设置当前步骤的状态
            this.processList[i].status = currentStatus;
            // 设置之前所有步骤为通过状态
            for (let j = 0; j < i; j++) {
              this.processList[j].status = stepStatusMap[j].pass;
            }
            break;
          }
        }
      }
    },

    // 获取操作按钮的样式类
    getActionClass(status) {
      if ((status && status % 10 == 5) || status == 1) {
        return "action-active";
      } else if (status && status % 10 == 0) {
        return "action-submit";
      } else if (status && status % 10 == 2) {
        return "action-reject";
      } else {
        return "action-inactive";
      }
    },

    // 处理查看资料
    handleView(status, index) {
      if (!status) {
        this.$message.warning("请先录入资料");
        return;
      }
      let statusText = this.getStatusText(status);
      this.$api({
        url: "/getStepInfo",
        method: "get",
        data: {
          id: this.row.id,
          step: index + 1,
        },
      }).then((res) => {
        if (res.code == 200) {
          this.$refs.process_detail_modal_shenhe.init(res.data, this.processList[index].name, statusText);
        }
      });
    },
    getStatusText(status) {
      if (!status) {
        return "未录入";
      } else if (status % 10 == 5) {
        return "已通过";
      } else if (status % 10 == 2) {
        return "已驳回";
      } else {
        return "待审核";
      }
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
          color: #1fb168;
          font-weight: 500;
        }

        &.action-inactive {
          color: #909399;
        }

        &.action-submit {
          color: #3377fe;
          font-weight: 500;
        }

        &.action-reject {
          color: #ff0000;
          font-weight: 500;
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
