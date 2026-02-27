<template>
  <div class="header-wrap">
    <div class="header-inner">
      <div class="brand-box">
        <div class="logo-box">
          <i class="el-icon-s-unfold"></i>
        </div>
      </div>
      <div class="top-right">
        <div class="user-info flex" @click="do_user()">
          <div class="avatar-box">
            <img :src="vuex_user.image || defaultAvatar" alt />
          </div>
          <div class="user-name">
            <p>{{ vuex_user.real_name }}</p>
          </div>
        </div>
        <div class="logout-box flex" @click="do_logout()">
          <span class="logout-text">密码修改</span>
          <div class="info-line"></div>
          <span class="logout-text">退出登录</span>
        </div>
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
    ...mapState(["vuex_depart_list"]),
    departName() {
      let departId = this.vuex_user.departId;
      let depart = this.vuex_depart_list.find(item => item.id === departId);
      return depart ? depart.title : "";
    }
  },
  created() {},

  methods: {
    do_user() {
      this.$log("vuex_user", this.vuex_user);
    },
    do_logout() {
      this.$store.commit("clearAdminInfo");
      this.$router.push("/login");
    }
  }
};
</script>

<style scoped lang="less">

.header-wrap {
  background: #fff;
  box-shadow: 0px 2px 8px 1px rgba(0,0,0,0.05);

  .header-inner {
    padding: 14px 31px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 83px;
    border-radius: 0px 0px 0px 0px;

    .brand-box {
      width: 150px;
      width: fit-content;
      height: 70px;
      display: flex;
      align-items: center;
      justify-content: center;

      .logo-box {
        font-size: 24px;
        color: #333;
        cursor: pointer;
      }

      .title {
        padding-left: 40px;
        letter-spacing: 5px;
        font-family: PingFang SC, PingFang SC;
        font-weight: 800;
        font-size: 32px;
        color: #333;
      }
    }

    .top-right {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 24px;

      .user-info {
        .avatar-box {
          width: 27px;
          height: 27px;
          border-radius: 50%;
          overflow: hidden;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }

        .user-name {
          margin-left: 12px;
          font-family: PingFang SC, PingFang SC;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          gap: 5px;
          p {
            text-align: left;
            font-size: 14px;
            color: #333;
            font-weight: 400;
          }
        }
      }

      .info-line {
        margin: 0 10px;
        width: 1px;
        height: 16px;
        background: #333;
        border-radius: 2px 2px 2px 2px;
      }

      .logout-box {
        cursor: pointer;
        font-size: 14px;
        font-weight: bold;
        align-items: center;
        justify-content: center;

        img {
          width: 24px;
          margin-right: 12px;
        }
        .logout-text {
          font-family: PingFang SC, PingFang SC;
          font-weight: 400;
          font-size: 14px;
          color: #333;
        }
      }
    }
  }
}
</style>
