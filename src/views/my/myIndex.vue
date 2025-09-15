<template>
  <div class="user-profile-page">
    <!-- 用户信息头部区域 -->
    <div class="user-profile-header">
      <div class="header-background">
        <!-- 背景装饰图案 -->
        <div class="background-pattern"></div>
      </div>

      <div class="user-info-container">
        <div class="user-avatar">
          <img :src="vuex_user.image" alt="用户头像" />
        </div>

        <div class="user-details">
          <div class="username">用户名: {{ vuex_user.username }}</div>

          <div class="action-buttons">
            <button class="action-btn modify-info-btn" @click="openModifyModal">
              修改个人信息
            </button>
            <button
              class="action-btn change-password-btn"
              @click="openChangePasswordModal"
            >
              修改密码
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部导航区域 -->
    <div class="user-profile-nav">
      <div class="nav-container">
        <div
          class="nav-item"
          :class="{ active: currentTab == '1' }"
          @click="switchTab('1')"
        >
          我的订单
        </div>
        <div
          class="nav-item"
          :class="{ active: currentTab == '2' }"
          @click="switchTab('2')"
        >
          我的下载
        </div>
        <div
          class="nav-item"
          :class="{ active: currentTab == '3' }"
          @click="switchTab('3')"
        >
          我的收藏
        </div>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content-area w-1600">
      <component :is="currentComponent" />
    </div>

    <!-- 修改个人信息弹框 -->
    <ModifyUserInfoModal
      :visible="showModifyModal"
      :user-info="vuex_user"
      @close="closeModifyModal"
      @confirm="handleModifyConfirm"
      @change-avatar="handleChangeAvatar"
    />

    <!-- 修改密码弹框 -->
    <ChangePasswordModal
      :visible="showChangePasswordModal"
      @close="closeChangePasswordModal"
      @confirm="handleChangePasswordConfirm"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";
import MyOrders from "./order.vue";
import MyDownloads from "./down.vue";
import MyFavorites from "./collect.vue";
import ModifyUserInfoModal from "@/components/ModifyUserInfoModal.vue";
import ChangePasswordModal from "@/components/ChangePasswordModal.vue";

export default {
  name: "UserProfile",
  components: {
    MyOrders,
    MyDownloads,
    MyFavorites,
    ModifyUserInfoModal,
    ChangePasswordModal,
  },
  data() {
    return {
      currentTab: "downloads", // 默认选中"我的下载"
      showModifyModal: false, // 控制修改个人信息弹框显示
      showChangePasswordModal: false, // 控制修改密码弹框显示
    };
  },
  computed: {
    ...mapState(["vuex_user"]),
    currentComponent() {
      const components = {
        1: "MyOrders",
        2: "MyDownloads",
        3: "MyFavorites",
      };
      return components[this.currentTab];
    },
  },
  mounted() {
    this.currentTab = this.$route.query.tab || "1";
  },
  methods: {
    switchTab(tab) {
      this.currentTab = tab;
      this.$router.push({
        query: {
          tab: tab,
        },
      });
    },
    // 打开修改个人信息弹框
    openModifyModal() {
      this.showModifyModal = true;
    },
    // 关闭修改个人信息弹框
    closeModifyModal() {
      this.showModifyModal = false;
    },
    // 处理修改确认
    handleModifyConfirm(formData) {
      console.log("修改个人信息:", formData);
      // 调用API保存用户信息
      this.$api({
        url: "updateUser",
        method: "post",
        data: formData,
      })
        .then((res) => {
          if (res.code == 200) {
            this.$message?.success("个人信息修改成功");
            this.closeModifyModal();
            this.$store.dispatch("getUserInfo");
          } else {
            this.$message?.error(res.message);
          }
        })
        .catch((err) => {});
    },
    // 处理更换头像
    handleChangeAvatar() {
      console.log("更换头像");
      // 这里可以添加更换头像的逻辑
      // 比如打开文件选择器
    },
    // 打开修改密码弹框
    openChangePasswordModal() {
      this.showChangePasswordModal = true;
    },
    // 关闭修改密码弹框
    closeChangePasswordModal() {
      this.showChangePasswordModal = false;
    },
    // 处理修改密码确认
    handleChangePasswordConfirm(formData) {
      console.log("修改密码:", formData);
      // 这里可以调用API修改密码
      this.$api({
        url: "updatePassword",
        method: "post",
        data: formData,
      })
        .then((res) => {
          if (res.code == 200) {
            this.$message?.success("密码修改成功");
            this.closeChangePasswordModal();
          } else {
            this.$message?.error(res.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style lang="less" scoped>
.user-profile-page {
  margin-top: 80px;
  min-height: 100vh;
  background-color: #f4f6fa;
  padding-bottom: 70px;
}

// 用户信息头部区域
.user-profile-header {
  position: relative;
  height: 165px;
  background: url("../../assets/img/index/myBack.jpg") no-repeat;
  background-size: 100% 100%;
  overflow: hidden;

  .header-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    .background-pattern {
      position: absolute;
      top: -50px;
      right: -50px;
      width: 300px;
      height: 300px;
      background: linear-gradient(
        45deg,
        rgba(79, 87, 217, 0.1) 0%,
        rgba(81, 157, 255, 0.1) 100%
      );
      border-radius: 50%;

      &::before {
        content: "";
        position: absolute;
        top: 50px;
        left: 50px;
        width: 200px;
        height: 200px;
        background: linear-gradient(
          45deg,
          rgba(79, 87, 217, 0.05) 0%,
          rgba(81, 157, 255, 0.05) 100%
        );
        border-radius: 50%;
      }

      &::after {
        content: "";
        position: absolute;
        top: 100px;
        left: 100px;
        width: 100px;
        height: 100px;
        background: linear-gradient(
          45deg,
          rgba(79, 87, 217, 0.03) 0%,
          rgba(81, 157, 255, 0.03) 100%
        );
        border-radius: 50%;
      }
    }
  }

  .user-info-container {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    padding: 40px 90px;
    max-width: 1600px;
    margin: 0 auto;

    .user-avatar {
      width: 85px;
      height: 85px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 40px;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
      }
    }

    .user-details {
      flex: 1;

      .username {
        font-size: 16px;
        font-weight: 600;
        color: #363130;
        margin-bottom: 20px;
      }

      .action-buttons {
        display: flex;
        gap: 15px;

        .action-btn {
          padding: 6px 12px;
          border: none;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          background: linear-gradient(90deg, #4e57d9 0%, #519dff 100%);
          color: white;

          &:hover {
            transform: translateY(-2px);
          }
        }
      }
    }
  }
}

// 底部导航区域
.user-profile-nav {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  .nav-container {
    max-width: 1600px;
    margin: 0 auto;
    display: flex;
    padding: 0 90px;
    gap: 140px;

    .nav-item {
      width: 86px;
      padding: 23px 0;
      font-size: 16px;
      font-weight: 500;
      color: #363130;
      text-align: center;
      cursor: pointer;
      position: relative;
      transition: all 0.3s ease;

      &:hover {
        color: #4e57d9;
      }

      &.active {
        color: #4e57d9;

        &::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          height: 3px;
          background: #4e57d9;
          border-radius: 2px;
        }
      }
    }
  }
}

// 内容区域
.content-area {
  margin-top: 18px;
  background-color: #fff;
  padding: 38px 45px 67px 45px;
  border-radius: 8px;
}
</style>
