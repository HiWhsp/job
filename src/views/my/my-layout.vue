<template>
  <div class="page-user-wrap">
    <div class="inner w-1400">
      <div class="page-ctx">
        <div class="menu-wrap">
          <div class="nav-wrap" v-for="(item, index) in page_menu" :key="index">
            <div class="nav-wrap-title">{{ item.title }}</div>
            <div
              class="nav-item"
              :class="$route.name == item.route ? 'active' : ''"
              v-for="(item, index) in item.children"
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
          title: "个人中心",
          children: [
            {
              title: "我的个人中心",
              route: "my-info",
            },
            {
              title: "会员中心",
              route: "my-vip",
            },
            {
              title: "修改密码",
              route: "edit-password",
            },
            {
              title: "消息",
              route: "my-message",
            },
            {
              title: "我的关注",
              route: "my-follows",
            },
          ],
        },
        {
          title: "需求管理",
          children: [
            {
              title: "填报需求",
              route: "demand-form",
            },
            {
              title: "我的需求",
              route: "demand-list",
            },
          ],
        },
        {
          title: "工单中心",
          children: [
            {
              title: "需求工单管理",
              route: "service-list",
            },
          ],
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

<style scoped lang="less" src="./my-layout.less"></style>

<style scoped lang="less" src="@/assets/h5css/user/index.less"></style>
