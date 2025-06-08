<template>
  <div class="page-user-wrap">
    <div class="inner w-1400">
      <page_breadcrumb :option="nav_option" />

      <div class="page-ctx">
        <div class="menu-wrap">
          <div class="left-title">
            <img src="@img/my/avatar.png" alt="" />
            <span>15810593012</span>
          </div>
          <div class="nav-wrap">
            <div
              class="nav-item"
              :class="$route.name == item.route ? 'active' : ''"
              v-for="(item, index) in page_menu"
              :key="index"
            >
              <div class="nav-title main-title" @click="do_toggle_nav(item)">
                {{ item.title }}
              </div>
            </div>
          </div>
        </div>
        <div class="view-wrap">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import page_breadcrumb from "@/components/page/page-breadcrumb.vue";

export default {
  name: "my",
  components: {
    page_breadcrumb,
  },
  data() {
    return {
      //个人中心导航
      all_menu: [
        {
          title: "个人信息",
          route: "my-info",
        },
        {
          title: "会员中心",
          route: "member-center",
        },
        {
          title: "我的收藏",
          route: "my-collection",
        },
        {
          title: "我的评论",
          route: "my-comment",
        },
        {
          title: "我的活动报名",
          route: "my-activity-registration",
        },
        {
          title: "消息中心",
          route: "my-message",
        },
        {
          title: "账号设置",
          route: "account-settings",
        },
      ],
      activeRoute: "",
      openeds: ["order-list"],
    };
  },
  computed: {
    nav_option() {
      let option = [
        { route: "/my-index", title: "用户中心", title2: "Personal Center" },
        {
          route: "",
          title: this.$route.meta.title,
          title: this.$route.meta.title,
        },
      ];
      return option;
    },

    page_menu() {
      let navList = [];
      navList = this.all_menu;
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
    // this.subArr = this.subNavArr[0];
  },

  mounted() {},

  methods: {
    do_toggle_nav(item) {
      if (!item.route) {
      } else {
        this.$router.push("/" + item.route);
      }
    },
  },
};
</script>

<style scoped lang="less">
.page-user-wrap {
  background: #f9fafc;
  padding-top: 20px;

  .inner {
    margin: 0 auto;
    min-height: 70vh;

    .page-ctx {
      padding-top: 20px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .menu-wrap {
      width: 260px;
      min-width: 220px;
      margin-bottom: 50px;
      background: #f9f9f9;
      background: #fff;
      padding-bottom: 20px;

      .left-title {
        padding: 18px 0;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 10px;
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: 400;
        font-size: 18px;
        color: #333333;
        img {
          width: 80px;
          height: 80px;
          border-radius: 50%;
        }
        span {
          margin-top: 20px;
          font-size: 22px;
          font-weight: bold;
        }
      }

      .nav-wrap {
        .nav-item {
          width: 260px;
          height: 52px;
          line-height: 52px;
          background: #fff;
          color: #202b32;
          border-top: 1px solid #f0f0f0;
          .nav-title {
            cursor: pointer;
            padding-left: 60px;
            text-align: left;

            font-size: 16px;
          }
          &:hover {
            background: #005aac;
            color: #fff;
          }
          &.active {
            background: #005aac;
            color: #fff;
          }
        }
      }
    }

    .view-wrap {
      flex: 1;
      margin-left: 24px;
      min-height: 50vh;
      padding-bottom: 50px;
    }
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/user/index.less"></style>
