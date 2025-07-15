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
          title: "Personal Center",
          children: [
            {
              title: "My Personal Center",
              route: "my-info",
            },
            {
              title: "Member Center",
              route: "my-vip",
            },
            {
              title: "Change Password",
              route: "edit-password",
            },
            {
              title: "Messages",
              route: "my-message",
            },
            {
              title: "My Favorites",
              route: "my-follows",
            },
          ],
        },
        {
          title: "Management",
          children: [
            {
              title: "Submit Demand",
              route: "demand-form",
            },
            {
              title: "My Demands",
              route: "demand-list",
            },
          ],
        },
        {
          title: "Work Order Center",
          children: [
            {
              title: "Demand Work Order Management",
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
        { route: "/my-index", title: "User Center", title2: "Personal Center" },
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
