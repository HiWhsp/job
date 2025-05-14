<template>
  <div class="page-user-wrap">
    <div class="inner">
      <div class="page-ctx">
        <div class="user-left">
          <div class="profile">
            <div class="profile-info">
              <img alt="" :src="baseInfo.image">
              <div class="info">
                <div class="name">{{  baseInfo.name }}</div>
                <div class="level">
                  <p><span>角</span><span>色</span></p>
                  <span>:</span>
                  <p>{{  baseInfo.identity_name }}</p>
                </div>
                <div class="phone">
                  <p>手机号</p>
                  <span>:</span>
                  <p>{{ baseInfo.mobile }}</p>
                </div>
              </div>
            </div>
            <div class="login-out" @click="do_toggle_nav({title: '退出登录'})">退出登录</div>
          </div>
          <div v-for="(it, i) in filter_userMenu" :key="i" class="nav-wrap">
            <div class="title" :class="{'active': activeRoute == it.route}" @click="do_toggle_nav(it)">
              <img :src="it.icon" alt="">
              <span>{{ it.title }}</span>
            </div>
            <div class="item-list">
              <div class="item" :class="{'active': activeRoute == item.route}" @click="do_toggle_nav(item)"
                   v-for="(item, index) in it.children"
                   :key="index">
                <span>{{ item.title }}</span>
              </div>
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
              route: "my-password",
            }
          ]
        },
        {
          title: "我的课程",
          icon: require("@/static/prod/kecheng.png"),
          children: [
            {
              title: "我观看过的课程",
              route: "my-course-record",
            },
            {
              title: "我收藏的课程",
              route: "my-course-fav",
            }
          ]
        },
        {
          title: "我的考试",
          icon: require("@/static/prod/kaoshi.png"),
          route: "my-exam",
        },
        {
          title: "我的消息",
          icon: require("@/static/prod/tongzhi.png"),
          route: 'my-message'
        }
      ],
      activeRoute: "my-info"
    };
  },
  computed: {
    filter_userMenu() {
      let navList = [];
      navList = this.userMenu
      return navList;
    },
  },

  mounted() {
    this.activeRoute = this.$route.path.split("/")[1];
  },

  methods: {
    do_toggle_nav(item) {
      if (item.route) {
        this.activeRoute = item.route;
        this.$router.push("/" + item.route);
      } else if (item.title === '退出登录') {
        this.$store.commit("clear_loginInfo");
        this.$router.push("/login");
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
        padding: 25px 25px 0;
        cursor: pointer;

        .title {
          width: 208px;
          height: 44px;
          display: flex;
          align-items: center;
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: 400;
          font-size: 16px;
          color: #000;
          padding-left: 18px;

          img {
            width: 20px;
            height: 20px;
            margin-right: 17px;
          }

          &.active {
            color: @theme;
            background: #F2F9F5;
          }
        }

        .item-list {
          .item {
            width: 208px;
            height: 44px;
            line-height: 44px;
            padding-left: 55px;
            background: #fff;
            border-radius: 4px;
            font-family: Microsoft YaHei, Microsoft YaHei;
            font-weight: 400;
            font-size: 16px;
            color: #000;

            img {
              width: 20px;
              height: 20px;
              margin-right: 17px;
            }

            &:hover {
              background: #F2F9F5;
              color: @theme;
            }

            &.active {
              background: #F2F9F5;
              color: @theme;
            }
          }
        }

        &:last-child {
          padding-bottom: 25px;
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
