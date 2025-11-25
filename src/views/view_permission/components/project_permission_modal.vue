<template>
  <div class="project-permission-modal">
    <el-dialog
      title="项目流程查看权限"
      width="600px"
      custom-class="project-permission-dialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="show_modal"
      :append-to-body="true"
      @closed="on_dialog_closed()"
    >
      <div class="modal-content">
        <div class="permission-list">
          <div
            class="permission-item"
            v-for="(item, index) in row"
            :key="index"
          >
            <div class="permission-name">{{ permissionList[index].name }}</div>
            <div class="permission-buttons">
              <button
                class="permission-btn viewable-btn"
                :class="{ active: item.status == 1 }"
                @click="handlePermissionChange(index, 1)"
              >
                可查看
              </button>
              <button
                v-if="index !== permissionList.length - 1"
                class="permission-btn not-viewable-btn"
                :class="{ active: item.status == 0 }"
                @click="handlePermissionChange(index, 0)"
              >
                无法查看
              </button>
            </div>
          </div>
        </div>
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
  name: "project-permission-modal",
  data() {
    return {
      show_modal: false,
      projectId: '',
      permissionList: [
        {
          name: "深化设计、排版套料",
        },
        {
          name: "物资检验",
        },
        {
          name: "下料",
        },
        {
          name: "装配",
        },
        {
          name: "焊清",
        },
        {
          name: "校正",
        },
        {
          name: "总装",
        },
        {
          name: "涂装",
        },
        {
          name: "检验出厂",
        },
      ],
      row: {},
    };
  },
  methods: {
    init(row, projectId) {
      this.projectId = projectId;
      this.row = row;
      // 这里可以调用接口获取已有的权限设置
      // 暂时使用默认值
      this.show_modal = true;
    },
    handlePermissionChange(index, permission) {
      this.row[index].status = permission;
    },
    handleCancel() {
      this.show_modal = false;
    },
    handleConfirm() {
      // 这里调用接口保存权限设置
      const permissions = this.row.map((item, index) => ({
        step: index + 1,
        see: item.status,
      }));
      this.$api({
        url: "/stepPermission",
        method: "post",
        data: {
          id: this.projectId,
          seeInfo: permissions,
        },
      }).then((res) => {
        if (res.code == 200) {
          this.$message.success("权限设置成功");
          this.$emit("confirm");
          this.show_modal = false;
        }
      });
    },
    on_dialog_closed() {
      // 重置权限列表
      this.permissionList.forEach((item) => {
        item.permission = 1;
      });
      this.row = {};
    },
  },
};
</script>

<style scoped lang="less">
.modal-content {
  padding: 20px;
  min-height: 200px;
  max-height: 500px;
  overflow-y: auto;

  .permission-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    .permission-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
      line-height: 40px;
      padding: 0px 20px;
      background-color: #f5f7fa;
      border-radius: 8px;
      transition: all 0.3s;

      &:hover {
        background-color: #ecf5ff;
      }

      .permission-name {
        font-size: 14px;
        color: #333;
        font-weight: 500;
        flex: 1;
      }

      .permission-buttons {
        display: flex;
        gap: 10px;

        .permission-btn { 
          height: 32px;
          line-height: 32px;
          padding: 0px 20px;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
          outline: none;

          &.viewable-btn {
            background-color: #e6f2ff;
            color: #3377fe;
            border: 1px solid #3377fe;

            &.active {
              background-color: #3377fe;
              color: #fff;
            }

            &:hover {
              opacity: 0.9;
            }
          }

          &.not-viewable-btn {
            background-color: #fff;
            color: #f56c6c;
            border: 1px solid #f56c6c;

            &.active {
              background-color: #f56c6c;
              color: #fff;
            }

            &:hover {
              opacity: 0.9;
            }
          }
        }
      }
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 10px;
  padding: 15px 20px;
  button {
    width: 120px;
    height: 40px;
  }

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
::v-deep .project-permission-dialog {
  border-radius: 16px;
  overflow: hidden;

  .el-dialog__header {
    background-color: #3377fe;
    padding: 15px 20px;
    border-radius: 16px 16px 0 0;
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

