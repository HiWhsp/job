<template>
  <div class="menu-wrap">
    <div class="menu-logo">
      <img src="@/assets/logo.png" alt />
    </div>
    <div class="menu-group-box">
      <!-- 只展示一级路由的 children，保持父子结构 -->
      <template v-for="(route, index) in menuRoutes">
        <!-- 有子路由的菜单项 -->
        <div
          v-if="route.children && route.children.length > 0"
          :key="`parent-${index}-${route.name}`"
          class="menu-group"
          :class="{ 'is_expand': expandedMenus.includes(route.name) }"
        >
          <div
            class="group-title-box"
            :class="{ 'select': isRouteActive(route) }"
            @click="toggleExpand(route.name)"
          >
            <div class="menu-item">
              <div class="menu-icon">
                <img :src="getMenuIcon(route)" alt />
              </div>
              <div class="group-title">{{ route.meta.title }}</div>
              <div class="arrow-box">
                <i
                  class="arrow"
                  :class="expandedMenus.includes(route.name) ? 'el-icon-arrow-down' : 'el-icon-arrow-right'"
                ></i>
              </div>
            </div>
          </div>
          <!-- 子菜单 -->
          <div class="sub-child" v-show="expandedMenus.includes(route.name)">
            <div
              v-for="(child, childIndex) in route.children"
              :key="`child-${childIndex}-${child.name}`"
              class="menu-item-child"
              :class="{ 'active': isChildRouteActive(child) }"
              @click="navigateToRoute(child)"
            >
              <div class="menu-icon">
                <img :src="getMenuIcon(child)" alt />
              </div>
              <div class="child-title">{{ child.meta.title }}</div>
              <div class="arrow-box">
                <i class="el-icon-arrow-right"></i>
              </div>
            </div>
          </div>
        </div>
        <!-- 没有子路由的菜单项 -->
        <div
          v-else
          :key="`single-${index}-${route.name}`"
          class="menu-group"
          :class="{ 'select': isRouteActive(route) }"
          @click="navigateToRoute(route)"
        >
          <div class="group-title-box">
            <div class="menu-item">
              <div class="menu-icon">
                <img :src="getMenuIcon(route)" alt />
              </div>
              <div class="group-title">{{ route.meta.title }}</div>
              <div class="arrow-box">
                <i class="arrow el-icon-arrow-right"></i>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { getRoutesByRole } from "@/router/role-routes.js";

export default {
  name: "page-menu",
  components: {},
  data() {
    return {
      expandedMenus: [] // 展开的菜单项
    };
  },
  computed: {
    ...mapState(["vuex_role"]),
    // 根据角色获取菜单路由（只返回一级路由的 children 作为菜单项，不展示 layout 本身）
    // meta.hidden 为 false 的不展示（与 index.js 中不添加该路由一致），为 true 或未设置时展示
    menuRoutes() {
      if (!this.vuex_role) {
        return [];
      }
      const routes = getRoutesByRole(this.vuex_role);

      const childrenRoutes = [];
      routes.forEach(route => {
        if (route.meta && route.meta.hidden === false) return;
        if (route.children && route.children.length > 0) {
          // 只取二级路由作为菜单项（客户管理、产品管理等），并过滤 hidden: false
          const filteredChildren = route.children
            .filter(child => !(child.meta && child.meta.hidden === false))
            .map(child => {
              if (child.children && child.children.length > 0) {
                return {
                  ...child,
                  children: child.children.filter(
                    c => !(c.meta && c.meta.hidden === false)
                  )
                };
              }
              return child;
            });
          childrenRoutes.push(...filteredChildren);
        } else {
          childrenRoutes.push(route);
        }
      });
      return childrenRoutes;
    }
  },
  watch: {
    // 监听路由变化，自动展开包含当前路由的菜单
    $route(to) {
      this.autoExpandMenu(to);
    }
  },
  mounted() {
    // 初始化时展开包含当前路由的菜单
    this.autoExpandMenu(this.$route);
  },
  methods: {
    // 切换菜单展开/收起
    toggleExpand(routeName) {
      const index = this.expandedMenus.indexOf(routeName);
      if (index > -1) {
        this.expandedMenus.splice(index, 1);
      } else {
        this.expandedMenus.push(routeName);
      }
    },

    // 导航到路由
    navigateToRoute(route) {
      if (route.name) {
        this.$router.push({ name: route.name });
      } else if (route.path) {
        this.$router.push(route.path);
      }
    },

    /** 当前路由匹配链中是否包含该 name（含父级、隐藏的子级等） */
    isNameInMatched(name) {
      if (!name || !this.$route.matched || !this.$route.matched.length) {
        return false;
      }
      return this.$route.matched.some(record => record.name === name);
    },

    // 判断路由是否激活（父路由）
    isRouteActive(route) {
      if (!route.name) {
        return false;
      }
      // 当前页在该菜单项对应的路由树下（含仅能通过 redirect/跳转进入的隐藏子路由）
      if (this.isNameInMatched(route.name)) {
        return true;
      }
      if (route.children && route.children.length > 0) {
        return route.children.some(
          child =>
            child.name === this.$route.name || this.isNameInMatched(child.name)
        );
      }
      return this.$route.name === route.name;
    },

    // 判断子路由是否激活（含该菜单项下更深层的子页面）
    isChildRouteActive(child) {
      if (!child.name) {
        return false;
      }
      return (
        this.$route.name === child.name || this.isNameInMatched(child.name)
      );
    },

    // 自动展开包含当前路由的菜单
    autoExpandMenu(route) {
      this.menuRoutes.forEach(parentRoute => {
        if (!(parentRoute.children && parentRoute.children.length > 0)) {
          return;
        }
        const activeUnderParent =
          this.isNameInMatched(parentRoute.name) ||
          parentRoute.children.some(
            child =>
              child.name === route.name || this.isNameInMatched(child.name)
          );
        if (
          activeUnderParent &&
          !this.expandedMenus.includes(parentRoute.name)
        ) {
          this.expandedMenus.push(parentRoute.name);
        }
      });
    },

    // 获取菜单图标（可以根据路由配置返回不同的图标）
    getMenuIcon(route) {
      // 如果路由配置了图标，使用配置的图标
      if (route.meta?.icon) {
        return route.meta.icon;
      }
      // 根据路由名称或路径返回不同的图标
      const routeName = route.name || route.path;
      const iconMap = {
        customer: require("@/assets/menu/icons/buyer.png")
        // 可以根据需要添加更多图标映射
      };
      // 默认图标
      return iconMap[routeName] || require("@/assets/menu/menu.png");
    }
  }
};
</script>

<style scoped lang="less">
.menu-wrap {
  height: 100vh;
  overflow-y: auto;

  .menu-logo {
    width: 100%;
    margin: 13px auto 24px;
    text-align: center;
    img {
      width: 156px;
      height: 73px;
    }
  }

  .menu-group-box {
    padding: 0;
  }

  .menu-group {
    cursor: pointer;

    .group-title-box {
      position: relative;
      transition: all 0.3s;

      .red-number {
        position: absolute;
        top: 8px;
        right: 8px;
        width: 16px;
        height: 16px;
        background: #ff0000;
        font-size: 10px;
        color: #fff;
        text-align: center;
        line-height: 16px;
        border-radius: 50%;
        z-index: 1;
      }

      .menu-item {
        display: flex;
        align-items: center;
        padding: 10px 24px;
        position: relative;

        .menu-icon {
          width: 24px;
          height: 24px;
          margin-right: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;

          img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
        }

        .group-title {
          flex: 1;
          font-family: PingFang SC, PingFang SC;
          font-weight: 500;
          font-size: 16px;
          color: #969eb8;
          text-align: left;
          writing-mode: horizontal-tb; /* 水平排列 */
          letter-spacing: 0;
        }

        .arrow-box {
          width: 16px;
          height: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;

          .arrow {
            font-size: 16px;
            color: #969eb8;
          }
        }
      }
    }

    // 子菜单
    .sub-child {
      animation: slideDown 0.3s ease;

      .menu-item-child {
        display: flex;
        align-items: center;
        padding: 10px 24px 10px 40px;
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
          background: #2373c8;
          .child-title {
            color: #ffffff !important;
          }
          .menu-icon img {
            filter: brightness(0) invert(1);
          }
          .arrow-box {
            i {
              color: #ffffff;
            }
          }
        }

        &.active {
          background: #2373c8;

          .child-title {
            color: #ffffff !important;
          }
          .menu-icon img {
            filter: brightness(0) invert(1);
          }
          .arrow-box {
            i {
              color: #ffffff !important;
            }
          }
        }

        .menu-icon {
          width: 20px;
          height: 20px;
          margin-right: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;

          img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
        }

        .child-title {
          flex: 1;
          font-family: PingFang SC, PingFang SC;
          font-weight: 400;
          font-size: 16px;
          color: #969eb8;
          text-align: left;
        }

        .arrow-box {
          width: 14px;
          height: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          i {
            color: #969eb8;
          }

          .arrow {
            width: 0;
            height: 0;
            border-style: solid;
          }

          .arrow-right {
            border-width: 4px 0 4px 6px;
            border-color: transparent transparent transparent #999999;
          }
        }
      }
    }

    &.select {
      background: #2373c8;

      .menu-item {
        .group-title {
          color: #ffffff !important;
        }
        .menu-icon img {
          // filter: brightness(0) invert(1);
        }
        .arrow {
          border-color: #ffffff;
        }
      }
    }
  }

  .menu-group.is_expand {
    .arrow-box .arrow-down {
      transform: rotate(0deg);
    }
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
