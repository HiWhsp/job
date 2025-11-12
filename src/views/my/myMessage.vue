<template>
  <div class="page">
    <div class="main-title">
      <span>系统消息</span>
    </div>

    <div class="page-ctx">
      <div class="action-buttons">
        <el-button size="small" @click="markAsRead">标为已读</el-button>
        <el-button size="small" @click="deleteMessages">删除</el-button>
      </div>
      <div class="title-box">
        <div class="title-item">
          <span class="title-item-text">消息内容</span>
          <span class="title-item-text">时间</span>
        </div>
      </div>
      <el-collapse v-model="activeNames" class="mess-list">
        <el-collapse-item
          v-for="(item, index) in messList"
          :key="index"
          :name="index"
          class="mess-item"
        >
          <template slot="title">
            <div class="collapse-title">
              <el-checkbox
                :value="selectedMessages.includes(item.id)"
                @input="handleCheckboxChange(item.id, $event)"
                @click.native.stop
                class="mess-checkbox"
              ></el-checkbox>
              <div class="mess-content">
                <span
                  class="mess-text"
                  :class="{ selected: item.status == 1 }"
                  >{{ item.title || "消息标题" }}</span
                >
              </div>
              <div class="mess-time">{{ item.createdTime || "--" }}</div>
            </div>
          </template>
          <div class="mess-detail">
            <div class="detail-header">
              <div class="detail-greeting">尊敬的信田科技用户:</div>
            </div>
            <div class="detail-content">
              {{
                item.content ||
                "感谢您对我们的关注与支持,为了更高效地整合服务资源,我们将于2024年6月14日 下架虚拟直播服务,包括官网页面、说明文档及控制台服务,非常感谢您过去的理解与支持。如需帮助可提交工单联系我们。由此给您带来的不便,敬请谅解!"
              }}
            </div>
            <div class="detail-footer">
              <div class="detail-sender">信田科技</div>
              <div class="detail-date">
                {{ item.date || item.dtTime || "2025年5月14日" }}
              </div>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "servicePage",
  components: {},
  data() {
    return {
      messList: [],
      pagination: {
        page: 1,
        pageNum: 8,
      },
      total: 0,
      activeNames: [], // 展开的面板
      selectedMessages: [], // 选中的消息索引
    };
  },
  computed: {
    ...mapState([""]),
  },
  watch: {},
  created() {
    this.setView();
  },
  methods: {
    setView() {
      this.$api({
        url: "/ service.php",
        data: {
          action: "serve_tasks",
          ...this.pagination,
        },
      }).then((res) => {
        this.messList = res.data.list;
        this.total = res.data.count;
      });
    },
    // 处理复选框变化
    handleCheckboxChange(index, checked) {
      if (checked) {
        if (!this.selectedMessages.includes(index)) {
          this.selectedMessages.push(index);
        }
      } else {
        const idx = this.selectedMessages.indexOf(index);
        if (idx > -1) {
          this.selectedMessages.splice(idx, 1);
        }
      }
    },
    // 标为已读
    markAsRead() {
      if (this.selectedMessages.length === 0) {
        this.$message.warning("请先选择要标记的消息");
        return;
      }
      this.$api({
        url: "/service.php",
        data: {
          action: "serve_taskOp",
          op: "read",
          id: this.selectedMessages.join(","),
        },
      }).then(() => {
        this.$message.success("标记成功");
        this.selectedMessages = [];
        this.setView();
      });
    },
    // 删除消息
    deleteMessages() {
      if (this.selectedMessages.length === 0) {
        this.$message.warning("请先选择要删除的消息");
        return;
      }
      this.$confirm("确定要删除选中的消息吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$api({
            url: "/service.php",
            data: {
              action: "serve_taskOp",
              op: "del",
              id: this.selectedMessages.join(","),
            },
          }).then(() => {
            this.selectedMessages = [];
            this.setView();
            this.$message.success("删除成功");
          });
        })
        .catch(() => {});
    },
  },
};
</script>

<style scoped lang="less">
.page {
  text-align: left;
  padding-bottom: 80px;

  .main-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 32px;
    text-align: left;
    height: 56px;
    line-height: 56px;
    background: #ffffff;
    font-size: 16px;
    font-family: Microsoft YaHei-Bold, Microsoft YaHei;
    font-weight: bold;
    color: #333333;
  }

  .page-ctx {
    min-height: 400px;
    margin-top: 24px;
    padding: 24px;
    background: #fff;
  }
}

.action-buttons {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;

  .el-button {
    height: 30px;
    line-height: 30px;
    padding: 0 13px;
    background: #eff3fb;
    color: #2e4c87;
    font-size: 14px;
    font-weight: bold;
    border: none;
    border: 1px solid #9eaecc;

    &:hover {
      background: #2e4c87;
      color: #eff3fb;
    }
  }
}

.title-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 25px;
  text-align: left;
  height: 44px;
  line-height: 44px;
  background: #f5f5f5;

  font-family: Arial, Arial;
  font-weight: 400;
  font-size: 14px;
  color: #333333;
  .title-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    .title-item-text:first-child {
      flex: 1;
    }
    .title-item-text:last-child {
      margin-right: 280px;
    }
  }
}

.mess-list {
  border: none;

  .mess-item {
    border-bottom: 1px solid #e4e7ed;
    margin-bottom: 0;

    &:last-child {
      border-bottom: none;
    }

    /deep/ .el-collapse-item__header {
      padding: 16px 0;
      height: auto;
      line-height: normal;
      border-bottom: none;
    }

    /deep/ .el-collapse-item__wrap {
      border-bottom: none;
    }

    /deep/ .el-collapse-item__content {
      padding: 0 0 20px 0;
    }

    .collapse-title {
      display: flex;
      align-items: center;
      width: 100%;
      padding-right: 20px;

      .mess-checkbox {
        margin-right: 12px;
      }

      .mess-content {
        flex: 1;
        overflow: hidden;

        .mess-text {
          font-size: 14px;
          color: #333333;
          display: block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          &.selected {
            color: #a5a5a5;
          }
          &:not(:selected) {
            color: #000;
          }
        }
      }

      .mess-time {
        font-size: 14px;
        color: #999999;
        margin-right: 200px;
        white-space: nowrap;
      }
    }

    .mess-detail {
      padding: 20px;
      background: #f5f7fa;
      border-radius: 4px;

      .detail-header {
        margin-bottom: 16px;

        .detail-greeting {
          font-size: 14px;
          color: #333333;
          margin-bottom: 12px;
        }
      }

      .detail-content {
        font-size: 14px;
        color: #666666;
        line-height: 1.8;
        margin-bottom: 16px;
      }

      .detail-footer {
        display: flex;
        flex-direction: column;

        .detail-sender {
          font-size: 14px;
          color: #333333;
        }

        .detail-date {
          font-size: 14px;
          color: #999999;
        }
      }
    }
  }
}
</style>
