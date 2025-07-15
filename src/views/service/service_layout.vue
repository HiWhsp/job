<template>
  <div class="service-layout">
    <div class="service-layout-left">
      <div class="service-layout-left-header">
        <img src="@/assets/image/home/logo.png" alt="" />
      </div>
      <div class="service-layout-left-content">
        <!-- 菜单 -->
        <el-menu
          :default-active="activeMenuItem"
          :default-openeds="['personal', 'service']"
          class="service-menu"
          :router="true"
        >
          <!-- 个人中心分组 -->
          <el-submenu index="personal">
            <template slot="title">
              <i class="el-icon-user"></i>
              <span>Personal Center</span>
            </template>
            <el-menu-item index="service-provider_info"> My Personal Center </el-menu-item>
            <!-- <el-menu-item index="service-provider-vip"> Member Center </el-menu-item> -->
            <el-menu-item index="service-provider-change-password">
              Change Password
            </el-menu-item>
            <el-menu-item index="service-provider-follow"> My Follows </el-menu-item>
            <el-menu-item index="service-provider-message"> Messages </el-menu-item>
          </el-submenu>

          <!-- 工单中心分组 -->
          <el-submenu index="service">
            <template slot="title">
              <i class="el-icon-document"></i>
              <span>Service Center</span>
            </template>
            <el-menu-item index="service-provider-list"> Service Order Management </el-menu-item>
          </el-submenu>
        </el-menu>
      </div>
    </div>
    <div class="service-layout-right">
      <div class="service-layout-right-header">
        <div class="item" @click="handleMessage">
          <i class="el-icon-bell"></i>
        </div>
        <div class="item">
          <el-dropdown trigger="hover" @command="handleCommand">
            <span class="el-dropdown-link">
              <img :src="vuex_config.file_url_pre + baseInfo.avatar" alt="" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="home">Home</el-dropdown-item>
              <el-dropdown-item command="logout">Logout</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="service-layout-right-content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "service_layout",
  data() {
    return {
      activeMenuItem: "service-management", // 默认选中服务工单管理
    };
  },
  computed: {
    ...mapState(["baseInfo"]),
  },
  methods: {
    handleMessage() {
      this.$router.push("/service-provider-message");
    },
    handleCommand(command) {
      if (command === "logout") {
        this.$store.commit("clear_loginInfo");
        this.$router.push("/");
      } else {
        this.$router.push("/");
      }
    },
  },
  watch: {
    $route(to, from) {
      this.activeMenuItem = to.name;
    },
  },
  mounted() {
    this.activeMenuItem = this.$route.name;
  },
};
</script>

<style lang="less" scoped>
.service-layout {
  display: flex;
  height: 100vh;
  background: #f6f6f6;
  .service-layout-left {
    width: 260px;
    background-color: #fff;
    .service-layout-left-header {
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 165px;
        height: 48px;
      }
    }
    .service-layout-left-content {
      padding: 0;
    }
  }
  .service-layout-right {
    display: flex;
    flex-direction: column;
    flex: 1;
    .service-layout-right-header {
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      background-color: #fff;
      padding: 0 30px;
      gap: 40px;
      .item {
        width: 40px;
        cursor: pointer;
        i {
          font-size: 28px;
          color: #000;
        }
        img {
          width: 36px;
          height: 36px;
        }
      }
    }
    .service-layout-right-content {
      flex: 1;
      overflow: auto;
      padding: 20px;
    }
  }
}

// 使用/deep/修改el-menu组件样式
/deep/ .service-menu {
  border: none;

  .el-submenu {
    .el-submenu__title {
      height: 50px;
      line-height: 50px;
      padding: 0 20px !important;
      color: #262626;
      font-size: 16px;
      font-weight: 500;

      i {
        margin-right: 8px;
        font-size: 16px;
        color: #666;
      }

      .el-submenu__icon-arrow {
        right: 20px;
        margin-top: -3px;
        color: #999;
      }

      &:hover {
        background-color: #fff;
      }
    }

    .el-menu {
      background-color: #fff;
    }

    .el-menu-item {
      height: 48px;
      line-height: 48px;
      padding: 0 40px !important;
      color: #262626;
      font-size: 14px;
      background-color: #fff;
      margin: 0 15px;

      &:hover {
        background-color: #f2f3f5 !important;
        color: #33ae60;
      }

      &.is-active {
        background-color: #f2f3f5 !important;
        color: #33ae60 !important;
        font-weight: 500;
        position: relative;
      }
    }
  }
}
</style>
