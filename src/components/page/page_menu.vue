<template>
  <div class="menu-wrap">
    <div class="menu-group-box">
      <div
        class="menu-group"
        v-for="(group, gindex) in auth_role_menu"
        :key="gindex"
        :class="{ is_no_expand: !group.is_expand, is_expand: group.is_expand }"
      >
        <div
          class="group-title-box"
          @click="do_toggle_nav_group(group)"
          :class="{
            select: group.route == $route.path,
            sub_select: route_group_map[$route.path] == group.title,
          }"
        >
          <div class="group-title">
            {{ group.title }}
          </div>
          <div class="red-number" v-if="group.red_number > 0">
            {{ group.red_number }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { system_menus } from "@/config/system-menu.js";

import { mapState } from "vuex";

export default {
  name: "page-menu",
  components: {},
  data() {
    return {
      is_test: true, //是否测试场景

      all_menu: system_menus,
      auth_role_menu: system_menus || [],

      route_group_map: {},
    };
  },
  computed: {
    ...mapState(["vuex_role", "vuex_red_number"]),
  },
  watch: {
    vuex_role: {
      handler(newVal) {
        this.setViewMenu();
      },
      deep: true,
    },
    vuex_red_number: {
      handler(newVal) {
        this.setViewMenu();
      },
      deep: true,
    },
  },
  mounted() {
    this.setViewMenu();
  },
  methods: {
    setViewMenu() {
      // 根据角色权限设置显示菜单
      this.auth_role_menu = this.all_menu.filter((item) => {
        // 需要权限的菜单
        if (item.is_permission) {
          return this.vuex_role.includes("shenhe");
        }
        if (item.title == "项目管理") {
          
          item.red_number = this.vuex_red_number;
        }
        // 不需要权限的菜单
        return true;
      });
    },
    do_toggle_nav_group(item) {
      // this.$log("group导航切换", item);

      this.$router.push(item.route);
    },
  },
};
</script>

<style scoped lang="less">
.menu-wrap {
  width: 100%;
  background: #fff;
  padding-bottom: 20px;

  .menu-group {
    width: 68px;
    margin-bottom: 12px;
    cursor: pointer;

    &::after {
      // content: "";
      // display: inline-block;
      // margin: 0 auto;
      // width: 266px;
      // height: 1px;
      // background: #f0f0f0;
    }

    &:last-child {
      &::after {
        display: none;
      }
    }

    .group-title-box {
      width: 68px;
      background: #ffffff;
      position: relative;
      .red-number {
        position: absolute;
        top: 0;
        right: 0;
        width: 16px;
        height: 16px;
        background: #FF0000;
        font-size: 10px;
        color: #fff;
        text-align: center;
        line-height: 16px;
        border-radius: 50%;
      }

      &.select {
        box-shadow: 3px 0px 8px 1px rgba(0, 0, 0, 0.12);
        border-radius: 0px 12px 12px 0px;

        .group-title {
          color: #3377fe !important;
        }
      }

      .group-title {
        cursor: pointer;
        margin: 0 auto;
        height: 130px;
        letter-spacing: 2px;
        border-radius: 0px 12px 12px 0px;
        font-family: PingFang SC, PingFang SC;
        font-weight: bold;
        font-size: 16px;
        color: #000000;
        writing-mode: vertical-rl; /* 从右到左垂直排列 */
      }
    }
  }

  .menu-group.is_no_expand {
    .arrow-box {
      transform: rotate(180deg);
    }
    .sub-child {
      display: none;
    }
  }
}
</style>
