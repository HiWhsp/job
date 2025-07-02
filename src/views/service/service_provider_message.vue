<template>
  <div class="page">
    <div class="main-title">
      <span>消息通知</span>
    </div>

    <div class="page-ctx">
      <div class="tab-box">
        <div class="tab-item" :class="{ active: tabIndex == 0 }" @click="changeTab(0)">
          <span>全部</span>
        </div>
        <div class="tab-item" :class="{ active: tabIndex == 1 }" @click="changeTab(1)">
          <span>账号通知</span>
        </div>
        <div class="tab-item" :class="{ active: tabIndex == 2 }" @click="changeTab(2)">
          <span>工单通知</span>
        </div>
        <div class="tab-item" :class="{ active: tabIndex == 3 }" @click="changeTab(3)">
          <span>留言通知</span>
        </div>
      </div>
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
            <div class="mess-title">{{ item.content }}</div>
            <div class="mess-time">{{ item.created_at }}</div>
          </div>
          <div style="color: #33ae60; margin-right: 16px">
            {{ item.isRead == 0 ? "未读" : "已读" }}
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
      tabIndex: 0,
      messList: [],
      pagination: {
        page: 1,
        pageSize: 10,
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
  mounted() {
    this.setView();
  },
  methods: {
    changeTab(index) {
      this.tabIndex = index;
      this.setView();
    },
    setView() {
      this.$api({
        url: "myMessageList",
        method: "get",
        data: {
          page: this.pagination.page,
          pageSize: this.pagination.pageSize,
          type: this.tabIndex,
        },
      }).then((res) => {
        if (res.code == 200) {
          this.messList = res.data.list.map((item) => {
            return {
              ...item,
              selected: false,
            };
          });
          this.total = res.data.totalCount;
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
          url: "markMessagedelete",
          method: "post",
          data: {
            ids: selectedItems.map((item) => item.id).join(","),
          },
        }).then((res) => {
          if (res.code == 200) {
            this.setView();
            this.$message.success("删除成功");
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
          url: "markMessagedelete",
          method: "post",
          data: { ids: item.id },
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
        url: "markMessageRead",
        method: "post",
        data: { ids: selectedItems.map((item) => item.id).join(","), type: 1 },
      }).then((res) => {
        if (res.code == 200) {
          this.setView();
          this.$message.success("标记已读成功");
        }
      });
    },
  },
};
</script>

<style scoped lang="less" src="./service_provider_message.less"></style>
