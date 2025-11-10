<template>
  <div class="header-wrap">
    <div class="header-inner">
      <div class="brand-box">
        <div class="logo-box">
          <img src="@/assets/img/head-logo.png" />
        </div>
        <div class="title">豫安金属结构 项目数据录入审核系统</div>
      </div>
      <div class="top-right">
        <!-- <div class="notice-box">
					<img src="@/assets/imgs/bell.png" alt="" />
				</div> -->
        <div class="user-info flex" @click="do_user()">
          <div class="avatar-box">
            <img :src="vuex_user.image || defaultAvatar" alt="" />
          </div>
          <div class="user-name">
            <p>员工：{{ vuex_user.real_name }}</p>
            <p>部门：{{ departName || "--" }}</p>
          </div>
        </div>
        <div class="info-line"></div>
        <div class="logout-box flex" @click="do_logout()">
          <img src="@/assets/img/logout.png" />
          <span class="logout-text"> 退出 </span>
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
      let depart = this.vuex_depart_list.find((item) => item.id === departId);
      return depart ? depart.title : "";
    },
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
  background: #3377fe;

  .header-inner {
    padding: 14px 48px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 100px;
    border-radius: 0px 0px 0px 0px;

    .brand-box {
      width: 150px;
      width: fit-content;
      height: 70px;
      display: flex;
      align-items: center;
      justify-content: center;

      .logo-box {
        padding: 3px;

        img {
          width: 90px;
          height: 72px;
          cursor: pointer;
        }
      }

      .title {
        padding-left: 40px;
        letter-spacing: 5px;
        font-family: PingFang SC, PingFang SC;
        font-weight: 800;
        font-size: 32px;
        color: #ffffff;
      }
    }

    .top-right {
      display: flex;
      align-items: center;
      justify-content: flex-end;

      .user-info {
        .avatar-box {
          width: 44px;
          height: 44px;
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
            color: #ffffff;
            font-weight: 400;
          }
        }
      }

      .info-line {
        margin: 0 24px;
        width: 1px;
        height: 16px;
        background: rgba(255, 255, 255, 0.48);
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
          color: #ffffff;
        }
      }
    }
  }
}
</style>
