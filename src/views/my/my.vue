<template>
  <div class="page-user-wrap">
    <div class="inner">
      <div class="page-ctx">
        <div class="user-left">
          <div class="profile">
            <div class="profile-info">
              <img alt="" src="@/static/prod/avatar.png">
              <div class="info">
                <div class="name">张洪玲</div>
                <div class="level">
                  <p><span>角</span><span>色</span></p>
                  <span>:</span>
                  <p>教师</p>
                </div>
                <div class="phone">
                  <p>手机号</p>
                  <span>:</span>
                  <p>15810593012</p>
                </div>
              </div>
            </div>
            <div class="login-out">退出登录</div>
          </div>
          <div v-for="(it, i) in filter_userMenu" :key="i" class="nav-wrap">
            <div class="title">
              <img :src="it.icon" alt="">
            </div>
          </div>
        </div>
        <div class="user-right">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {SHOP_TYPE} from '@/config/env.js'

export default {
  name: "my",
  components: {},
  data() {
    return {
      //个人中心导航
      userMenu: [
        {
          title: "个人设置",
          icon: require("@/static/prod/user.png"),
          children: [
            {
              title: "个人信息",
              route: "my-info",
            },
            {
              title: "修改密码",
              route: "change-password",
            }
          ]
        },
        {
          title: "我的课程",
          icon: require("@/static/prod/user.png"),
          children: [
            {
              title: "我观看过的课程",
              route: "my-info",
            },
            {
              title: "我收藏的课程",
              route: "change-password",
            }
          ]
        },
        {
          title: "我的考试",
          children: [
            {
              title: "个人信息",
              route: "my-info",
            },
            {
              title: "修改密码",
              route: "change-password",
            }
          ]
        },
        {
          title: "我的消息",
        }
      ],
      activeRoute: "",
      openeds: [
        "order-list",
      ],
    };
  },
  computed: {
    nav_option() {
      let option = [
        {route: '/my-index', title: '用户中心'},
        {route: '', title: this.$route.meta.title}
      ]
      return option
    },

    filter_userMenu() {
      let navList = [];
      navList = this.userMenu
      return navList;
    },
  },

  //导航激活
  beforeRouteUpdate(to, from, next) {
    next();
    this.activeRoute = to.path.replace("/", "");
  },

  watch: {},
  created() {
  },

  mounted() {
  },

  methods: {
    do_toggle_nav(item) {
      if (!item.route || item.route === 'my-index') {
        // let route = item.sub[0].route;
        // this.$router.push("/" + route);
      } else if (item.title === '退出登录') {
        this.$store.commit("clear_loginInfo");
        this.$router.push("/login");
      } else {
        this.$router.push("/" + item.route);
      }
    },


  },
};
</script>

<style lang="less" scoped>
.page-user-wrap {
  background-color: #F5F6F6;

  .inner {
    width: @width;
    margin: 0 auto;
    min-height: 70vh;
    padding-bottom: 50px;

    .page-ctx {
      padding-top: 30px;
      display: flex;
      justify-content: space-between;
    }

    .user-left {
      width: 260px;
      margin-bottom: 50px;

      .profile {
        padding: 26px;
        width: 260px;
        background: #FFFFFF;
        border-radius: 0px;
        border: 1px solid rgba(0, 0, 0, 0.08);
        margin-bottom: 20px;

        .profile-info {
          display: flex;

          img {
            width: 66px;
            height: 66px;
          }

          .info {
            margin-left: 10px;

            .name {
              font-family: Microsoft YaHei, Microsoft YaHei;
              font-weight: 700;
              font-size: 18px;
              color: #1F253B;
              margin-bottom: 10px;
            }

            .level, .phone {
              display: flex;
              font-family: Microsoft YaHei, Microsoft YaHei;
              font-weight: 400;
              font-size: 12px;
              color: #6F6F6F;

              p {
                width: 36px;
                display: flex;
                justify-content: space-between;

                span {
                  margin: 0;
                }
              }

              span {
                display: inline-block;
                margin: 0 5px;
              }
            }
          }
        }

        .login-out {
          cursor: pointer;
          margin-top: 30px;
          width: 208px;
          height: 34px;
          line-height: 34px;
          text-align: center;
          background: #FFFFFF;
          border-radius: 6px 6px 6px 6px;
          border: 1px solid rgba(0, 0, 0, 0.16);
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: 400;
          font-size: 16px;
          color: #969696;
        }
      }

      .nav-wrap {
        background: #fff;
        padding-bottom: 20px;
        padding-top: 15px;

        .nav-item {
          overflow: hidden;

          .nav-title {
            position: relative;
            cursor: pointer;
            padding-left: 40px;
            text-align: left;

            font-family: Roboto, Roboto;
            font-weight: 400;
            font-size: 12px;
            color: #808080;

            img {
              width: 24px;
              height: 24px;
            }

            &.link {
              margin-bottom: 4px;
              height: 32px;
              line-height: 32px;
              font-family: Roboto, Roboto;
              font-weight: 400;
              font-size: 14px;
              color: #808080;
              font-style: normal;
              text-transform: none;

              &:hover {
                color: @theme;
              }
            }

            &.main-title {
              margin-bottom: 14px;
              cursor: pointer;
              padding-left: 25px;
              user-select: none;
              font-weight: 400;

              font-family: Roboto, Roboto;
              font-weight: 400;
              font-size: 16px;
              color: #333333;
              font-style: normal;
              text-transform: none;
            }

            &.active {
              background: #FCFAF7;
              color: @theme;

              &:before {
                content: "";
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                width: 4px;
                background-color: @theme;
              }
            }

            &[data-hide="hide"] {
              display: none;
            }
          }

          &:first-child {
            .main-title {
              margin-top: 0;
            }
          }
        }
      }
    }

    .user-right {
      flex: 1;
      margin-left: 20px;
      min-height: 50vh;

      .page {
        width: 100%;
      }
    }
  }
}
</style>

<style lang="less" scoped src="@/assets/h5css/user/index.less"></style>
