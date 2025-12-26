<template>
  <div class="member-center">
    <div class="w-1600">
      <div class="member-layout">
        <!-- 左侧菜单 -->
        <div class="member-sidebar">
          <h2 class="sidebar-title">会员中心</h2>
          <ul class="sidebar-menu">
            <li
              class="menu-item"
              v-for="item in menuList"
              :key="item.path"
              :class="{ active: currentPath === item.path }"
              @click="handleMenuClick(item)"
            >
              {{ item.title }}
            </li>
          </ul>
        </div>

        <!-- 右侧内容区域 -->
        <div class="member-content">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MemberCenter",
  data() {
    return {
      menuList: [
        {
          title: "我的订单",
          path: "/my/orders",
        },
        {
          title: "下载记录",
          path: "/my/downloads",
        },
        {
          title: "个人资料",
          path: "/my/profile",
        },
        {
          title: "修改密码",
          path: "/my/password",
        },
      ],
    };
  },
  computed: {
    currentPath() {
      return this.$route.path;
    },
  },
  methods: {
    handleMenuClick(item) {
      this.$router.push(item.path);
    },
  },
};
</script>

<style lang="less" scoped>
.member-center {
  margin-top: 114px;
  padding: 40px 0;
  min-height: calc(100vh - 114px);
  background: #f4f4f6;
}

.member-layout {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

// 左侧菜单
.member-sidebar {
  width: 240px;
  flex-shrink: 0;
  background: #fff;
  border-radius: 8px;
  padding: 30px 0;

  .sidebar-title {
    font-size: 20px;
    font-weight: bold;
    color: #333;
    margin: 0 0 30px 0;
    padding: 0 30px;
  }

  .sidebar-menu {
    list-style: none;
    padding: 0;
    margin: 0;

    .menu-item {
      padding: 16px 30px;
      font-size: 16px;
      color: #666;
      cursor: pointer;
      transition: all 0.3s ease;
      border-left: 3px solid transparent;

      &:hover {
        background: #f5f5f5;
        color: #0081ff;
      }

      &.active {
        background: #f0f7ff;
        color: #0081ff;
        border-left-color: #0081ff;
        font-weight: 500;
      }
    }
  }
}

// 右侧内容区域
.member-content {
  flex: 1;
  min-height: 600px;
}
</style>
<style lang="less" scoped src="./style/h5-myIndex.less"></style>
