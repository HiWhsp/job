<template>
  <div class="page">
    <div class="main-title">
      <span>消息中心</span>
    </div>

    <div class="page-ctx">
      <!-- 顶部标签选择区域 -->
      <div class="tab-header">
        <div class="tab-buttons">
          <div class="select-area">
            <input
              type="checkbox"
              id="selectAll"
              v-model="isAllSelected"
              @change="toggleSelectAll"
              class="select-checkbox"
            />
            <label for="selectAll" class="select-label">全选</label>
          </div>
          <button class="tab-btn" @click="batchDelete">批量删除</button>
          <button class="tab-btn active" @click="batchRead">标记已读</button>
        </div>
      </div>

      <div class="mess-list">
        <div class="mess-item" v-for="(item, index) in messList" :key="index">
          <!-- 左侧选择框 -->
          <div class="mess-checkbox">
            <input
              type="checkbox"
              :id="`msg-${index}`"
              v-model="item.selected"
              @change="handleItemSelect"
              class="item-checkbox"
            />
            <label :for="`msg-${index}`" class="checkbox-label"></label>
          </div>

          <!-- 左侧音频图标 -->
          <div class="mess-icon">
            <img src="@img/my/message.png" alt="" />
          </div>

          <!-- 消息内容区域 -->
          <div class="mess-content">
            <div class="mess-title">{{ item.title }}</div>
            <div class="mess-time">{{ item.created_at }}</div>
          </div>
          <div style="color: #005aac; margin-right: 16px">
            {{ item.is_read == 0 ? "未读" : "已读" }}
          </div>

          <!-- 右侧删除按钮 -->
          <div class="mess-action">
            <button class="delete-btn" @click="deleteMessage(item)">删除</button>
          </div>
        </div>
        <el-pagination
          style="margin-top: 20px; text-align: center"
          v-if="total > 0"
          :total="total"
          layout="prev, pager, next"
          :current-page="pagination.page"
          @current-change="handleCurrentChange"
        />
        <el-empty description="暂无数据" v-if="messList.length === 0" />
      </div>
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
        limit: 10,
      },
      total: 0,
    };
  },
  computed: {
    ...mapState([""]),
    // 计算是否全选
    isAllSelected: {
      get() {
        return this.messList.length > 0 && this.messList.every((item) => item.selected);
      },
      set(value) {
        // 这里不需要处理，在toggleSelectAll方法中处理
      },
    },
    // 获取选中的消息
    selectedMessages() {
      return this.messList.filter((item) => item.selected);
    },
  },
  watch: {},
  created() {
    this.setView();
  },
  methods: {
    setView() {
      this.$api({
        url: "mynotice",
        method: "get",
        data: this.pagination,
      }).then((res) => {
        if (res.code == 200) {
          this.messList = res.data.list.map((item) => {
            return {
              ...item,
              selected: false,
            };
          });
          this.total = res.data.count;
        }
      });
    },
    // 切换全选状态
    toggleSelectAll() {
      const shouldSelectAll = !this.isAllSelected;
      this.messList.forEach((item) => {
        item.selected = shouldSelectAll;
      });
    },
    // 处理单个消息选择
    handleItemSelect() {
      // 这个方法会在每次单个checkbox状态变化时触发
      // 用于更新全选状态的显示
      this.$forceUpdate();
    },
    // 获取选中的消息数量
    getSelectedCount() {
      return this.selectedMessages.length;
    },
    // 批量删除选中的消息
    batchDelete() {
      const selectedItems = this.selectedMessages;
      if (selectedItems.length === 0) {
        this.$message.warning("请选择要删除的消息");
        return;
      }
      this.$confirm("确定删除选中的消息吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$api({
          url: "changenotice",
          method: "post",
          data: {
            ids: selectedItems.map((item) => item.id).join(","),
            type: 2,
          },
        }).then((res) => {
          if (res.code == 200) {
            this.setView();
          }
        });
      });
    },
    deleteMessage(item) {
      this.$confirm("确定删除该消息吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$api({
          url: "changenotice",
          method: "post",
          data: { ids: item.id, type: 2 },
        }).then((res) => {
          if (res.code == 200) {
            this.setView();
          }
        });
      });
    },
    handleCurrentChange(page) {
      this.pagination.page = page;
      this.setView();
    },
    batchRead() {
      const selectedItems = this.selectedMessages;
      if (selectedItems.length === 0) {
        this.$message.warning("请选择要标记已读的消息");
        return;
      }
      this.$api({
        url: "changenotice",
        method: "post",
        data: { ids: selectedItems.map((item) => item.id).join(","), type: 1 },
      }).then((res) => {
        if (res.code == 200) {
          this.setView();
        }
      });
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
    margin-top: 14px;
    padding: 0;
    background: #fff;
  }
}

.tab-header {
  padding: 20px 32px;
  border-bottom: 1px solid #f0f0f0;

  .tab-buttons {
    display: flex;
    gap: 24px;
    align-items: center;

    .select-area {
      display: flex;
      align-items: center;
      gap: 8px;

      .select-checkbox {
        width: 16px;
        height: 16px;
        cursor: pointer;
      }

      .select-label {
        font-size: 14px;
        color: #3d3d3d;
        cursor: pointer;
      }
    }

    .tab-btn {
      border: none;
      font-size: 14px;
      color: #3d3d3d;
      border: 1px solid rgba(0, 0, 0, 0.06);
      cursor: pointer;
      padding: 8px 20px;
      border-radius: 5px;
      position: relative;

      &.active {
        border: 1px solid #005aac;
        color: #005aac;
      }
    }
  }
}

.mess-list {
  padding: 0 32px;

  .mess-item {
    display: flex;
    align-items: center;
    padding: 20px 0;
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }

    .mess-checkbox {
      margin-right: 16px;
      flex-shrink: 0;

      .item-checkbox {
        width: 16px;
        height: 16px;
        cursor: pointer;
        margin: 0;
      }

      .checkbox-label {
        cursor: pointer;
      }
    }

    .mess-icon {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: #005aac;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 16px;
      flex-shrink: 0;
      img {
        width: 16px;
        height: 16px;
      }
    }

    .mess-content {
      flex: 1;
      min-width: 0;

      .mess-title {
        font-size: 14px;
        color: #333333;
        line-height: 20px;
        margin-bottom: 8px;
        font-weight: 400;
      }

      .mess-time {
        font-size: 12px;
        color: #999999;
        line-height: 16px;
      }
    }

    .mess-action {
      flex-shrink: 0;

      .delete-btn {
        font-size: 14px;
        color: #3d3d3d;
        cursor: pointer;
      }
    }
  }
}

.page {
  .page-ctx {
    padding-bottom: 80px;
  }
}
</style>
