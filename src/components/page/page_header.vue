<template>
  <div class="header-wrap">
    <div class="header-inner">
      <div class="brand-box">
        <div class="logo-box">
          <img src="@/assets/logo.png" />
        </div>
        <div class="menu-name">
          <img src="@/assets/menu/menu.png" alt="" />
        </div>
      </div>
      <div class="top-right">
        <el-dropdown>
          <div class="user-info flex" @click="do_user()">
            <div class="avatar-box">
              <img src="@/assets/avatar.png" alt="" />
            </div>
            <div class="user-name">{{ vuex_user.userName || "管理员" }}</div>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <div class="logout" style="padding: 0 10px" @click="do_logout()">
              <el-button type="text">退出登录</el-button>
            </div>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "page-header",
  components: {
    //
  },
  data() {
    return {};
  },
  computed: {
    ...mapState([]),
  },
  created() {},

  methods: {
    do_user() {
      this.$log("vuex_user", this.vuex_user);
    },
    do_logout() {
      this.$store.commit("clearAdminInfo");
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped lang="less">
@keyframes ani_rotate {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.header-wrap {
  box-shadow: 0 2px 10px rgba(7, 0, 72, 0.1);

  .header-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 70px;
    background: #fff;

    .brand-box {
      position: relative;
      width: 224px;
      height: 70px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 18px 30px;
      background: #262b87;

      .logo-box {
        padding: 3px;
        width: 100%;
        height: 100%;
        img {
          width: 100%;
          height: 100%;
          cursor: pointer;
        }
      }
      .menu-name {
        position: absolute;
        width: 16px;
        height: 14px;
        right: -42px;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }

    .top-right {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 32px;

      .user-info {
        .avatar-box {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          overflow: hidden;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }

        .user-name {
          margin: 0 10px;
        }
      }

      .logout {
        cursor: pointer;
        font-size: 14px;
        font-weight: bold;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
</style>
