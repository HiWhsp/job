import Vue from "vue";
import VueRouter from "vue-router";

// 解决报错
const originalPush = VueRouter.prototype.push;
const originalReplace = VueRouter.prototype.replace;
// push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch((err) => err);
};
// replace
VueRouter.prototype.replace = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalReplace.call(this, location, onResolve, onReject);
  return originalReplace.call(this, location).catch((err) => err);
};
Vue.use(VueRouter);

// 角色路由配置
import { getRoutesByRole } from "./role-routes.js";


const layout = () => import("@/views/layout.vue"); // 布局
const login = () => import("@/views/login/login.vue"); // 登录

// 基础路由（不需要权限验证）
const constantRoutes = [
  {
    path: "/",
    name: "index",
    component: login,
    meta: {
      title: "网站概览",
      deep: 1,
    },
  },
  {
    path: "/login",
    name: "login",
    component: login,
    meta: {
      title: "登录",
    },
  },
  {
    path: "*",
    redirect: "/",
  },
];

// 动态路由（根据角色加载）
let dynamicRoutes = [];

const scrollBehavior = (to, from, savedPosition) => {
  return {
    x: 0,
    y: 0,
  };
};

const router = new VueRouter({
  routes: constantRoutes,
  base: "/",
  // base: "/admin",
  mode: "history",
  scrollBehavior,
});

// 存储已添加的路由名称，避免重复添加
const addedRouteNames = new Set();

/**
 * 根据 meta.hidden 过滤路由树：用于获取「在菜单展示」的路由（如登录后默认跳转的第一项）
 * meta.hidden === false 的项不展示在菜单，但路由仍会注册，可通过 this.$router.push 跳转
 * @param {Array} routes - 路由配置数组
 * @returns {Array} 过滤后的新路由树（不修改原对象）
 */
function filterRoutesByHidden(routes) {
  if (!routes || !Array.isArray(routes)) return [];
  return routes
    .filter(route => !(route.meta && route.meta.hidden === false))
    .map(route => {
      const copy = { ...route };
      if (copy.meta) copy.meta = { ...copy.meta };
      if (copy.children && copy.children.length > 0) {
        copy.children = filterRoutesByHidden(copy.children);
      }
      return copy;
    });
}

/**
 * 根据角色动态添加路由（所有路由都会注册，含 meta.hidden 为 false 的）
 * meta.hidden 仅控制是否在侧边栏菜单展示，不影响路由注册，可通过 this.$router.push 跳转
 * @param {string|Array} role - 用户角色
 * @returns {Array} 添加的路由数组
 */
export function addRoleRoutes(role) {
  const routes = getRoutesByRole(role) || [];

  if (routes.length > 0) {
    const newlyAdded = routes.filter(r => !addedRouteNames.has(r.name));
    newlyAdded.forEach(route => {
      router.addRoute(route);
      addedRouteNames.add(route.name);
    });
    dynamicRoutes = [...dynamicRoutes, ...newlyAdded];
  }
  return routes;
}

/**
 * 获取角色的第一个路由路径（仅考虑 meta.hidden 不为 false 的路由）
 * @param {string|Array} role - 用户角色
 * @returns {string|null} 第一个路由的完整路径
 */
export function getFirstRouteByRole(role) {
  const routes = filterRoutesByHidden(getRoutesByRole(role) || []);
  if (routes.length === 0) {
    return null;
  }

  const firstRoute = routes[0];
  
  // 如果有子路由，返回第一个子路由的完整路径
  if (firstRoute.children && firstRoute.children.length > 0) {
    const firstChild = firstRoute.children[0];
    // 构建完整路径：父路径 + 子路径
    const parentPath = firstRoute.path;
    // 子路径如果以 / 开头，是绝对路径；否则是相对路径，需要拼接
    if (firstChild.path.startsWith('/')) {
      // 绝对路径，直接返回
      return firstChild.path;
    } else {
      // 相对路径，拼接父路径
      return `${parentPath}/${firstChild.path}`;
    }
  }
  
  // 如果没有子路由，返回父路由路径
  return firstRoute.path;
}

/**
 * 获取角色的第一个路由对象（用于通过名称跳转，仅考虑 meta.hidden 不为 false 的路由）
 * @param {string|Array} role - 用户角色
 * @returns {Object|null} 第一个路由对象，包含 name 和 path
 */
export function getFirstRouteObjectByRole(role) {
  const routes = filterRoutesByHidden(getRoutesByRole(role) || []);
  if (routes.length === 0) {
    return null;
  }

  const firstRoute = routes[0];
  
  // 如果有子路由，返回第一个子路由
  if (firstRoute.children && firstRoute.children.length > 0) {
    const firstChild = firstRoute.children[0];
    return {
      name: firstChild.name,
      path: firstChild.path.startsWith('/') 
        ? firstChild.path 
        : `${firstRoute.path}/${firstChild.path}`
    };
  }
  
  // 如果没有子路由，返回父路由
  return {
    name: firstRoute.name,
    path: firstRoute.path
  };
}

/**
 * 重置路由（退出登录时调用）
 */
export function resetRoutes() {
  // 移除所有动态路由
  dynamicRoutes.forEach(route => {
    router.removeRoute(route.name);
    addedRouteNames.delete(route.name);
  });
  dynamicRoutes = [];
}

// 获取用户角色的辅助函数
function getUserRole() {
  let userRole = null;
  const roleStr = localStorage.getItem("vuex_role");
  if (roleStr) {
    try {
      // 尝试解析 JSON
      userRole = JSON.parse(roleStr);
    } catch (e) {
      // 如果不是 JSON，直接使用字符串
      userRole = roleStr;
    }
  }
  
  // 如果 localStorage 中没有，尝试从 store 获取
  if (!userRole) {
    const app = router.app;
    if (app && app.$store) {
      userRole = app.$store.state.vuex_role;
    }
  }
  
  return userRole;
}

router.beforeEach((to, from, next) => {
  let token = localStorage.getItem("token");
  // 只要有 token 就认为已登录
  let is_login_curr = !!token;

  // 判断是否是刷新页面（from.name 为 null 或 undefined，且 from.path 与 to.path 相同）
  // 或者 from.path 为空字符串（浏览器刷新）
  const isPageRefresh = (!from.name && from.path === to.path) || (from.path === '' && to.path !== '/login' && to.path !== '/');

  // 如果是登录页或首页
  if (to.path === '/login' || to.path === '/') {
    // 如果已登录，应该跳转到保存的路由或角色首页
    if (is_login_curr) {
      const userRole = getUserRole();
      if (userRole) {
        // 确保路由已加载
        if (addedRouteNames.size === 0) {
          addRoleRoutes(userRole);
        }
        // 检查是否有保存的路由（刷新页面时）
        if (isPageRefresh) {
          const savedRoute = localStorage.getItem("last_route");
          if (savedRoute) {
            try {
              const routeInfo = JSON.parse(savedRoute);
              const query = routeInfo.query && typeof routeInfo.query === 'object' && Object.keys(routeInfo.query).length ? routeInfo.query : undefined;
              const params = routeInfo.params && typeof routeInfo.params === 'object' && Object.keys(routeInfo.params).length ? routeInfo.params : undefined;
              // 尝试跳转到保存的路由（含 query、params）
              if (routeInfo.name) {
                next({ name: routeInfo.name, query, params, replace: true });
                return;
              } else if (routeInfo.path) {
                next({ path: routeInfo.path, query, params, replace: true });
                return;
              }
            } catch (e) {
              // 如果解析失败，使用默认路由
            }
          }
        }
        
        // 如果没有保存的路由，跳转到角色首页
        const firstRoute = getFirstRouteObjectByRole(userRole);
        if (firstRoute && firstRoute.name) {
          next({ name: firstRoute.name, replace: true });
          return;
        }
      } else {
        // 如果已登录但没有角色，尝试从 store 获取
        const app = router.app;
        if (app && app.$store) {
          const storeRole = app.$store.state.vuex_role;
          if (storeRole) {
            if (addedRouteNames.size === 0) {
              addRoleRoutes(storeRole);
            }
            
            // 检查是否有保存的路由
            if (isPageRefresh) {
              const savedRoute = localStorage.getItem("last_route");
              if (savedRoute) {
                try {
                  const routeInfo = JSON.parse(savedRoute);
                  const query = routeInfo.query && typeof routeInfo.query === 'object' && Object.keys(routeInfo.query).length ? routeInfo.query : undefined;
                  const params = routeInfo.params && typeof routeInfo.params === 'object' && Object.keys(routeInfo.params).length ? routeInfo.params : undefined;
                  if (routeInfo.name) {
                    next({ name: routeInfo.name, query, params, replace: true });
                    return;
                  } else if (routeInfo.path) {
                    next({ path: routeInfo.path, query, params, replace: true });
                    return;
                  }
                } catch (e) {}
              }
            }
            
            const firstRoute = getFirstRouteObjectByRole(storeRole);
            if (firstRoute && firstRoute.name) {
              next({ name: firstRoute.name, replace: true });
              return;
            }
          }
        }
      }
    }
    // 未登录时才显示登录页
    next();
    return;
  }

  // 如果已登录，优先加载角色路由（刷新页面时必须先加载路由）
  if (is_login_curr) {
    const userRole = getUserRole();
    
    // 如果路由还没加载，必须先加载路由
    if (addedRouteNames.size === 0) {
      if (userRole) {
        addRoleRoutes(userRole);
        
        // 如果是刷新页面，尝试恢复保存的路由
        if (isPageRefresh) {
          const savedRoute = localStorage.getItem("last_route");
          if (savedRoute) {
            try {
              const routeInfo = JSON.parse(savedRoute);
              const query = routeInfo.query && typeof routeInfo.query === 'object' && Object.keys(routeInfo.query).length ? routeInfo.query : undefined;
              const params = routeInfo.params && typeof routeInfo.params === 'object' && Object.keys(routeInfo.params).length ? routeInfo.params : undefined;
              if (routeInfo.name) {
                next({ name: routeInfo.name, query, params, replace: true });
                return;
              } else if (routeInfo.path) {
                next({ path: routeInfo.path, query, params, replace: true });
                return;
              }
            } catch (e) {
              // 如果解析失败，继续使用当前路由
            }
          }
        }
        
        // 路由添加后，需要重新匹配当前路由
        next({ ...to, replace: true });
        return;
      } else {
        // 如果已登录但没有角色信息，尝试从 store 获取
        const app = router.app;
        if (app && app.$store) {
          const storeRole = app.$store.state.vuex_role;
          if (storeRole) {
            addRoleRoutes(storeRole);
            
            // 如果是刷新页面，尝试恢复保存的路由
            if (isPageRefresh) {
              const savedRoute = localStorage.getItem("last_route");
              if (savedRoute) {
                try {
                  const routeInfo = JSON.parse(savedRoute);
                  const query = routeInfo.query && typeof routeInfo.query === 'object' && Object.keys(routeInfo.query).length ? routeInfo.query : undefined;
                  const params = routeInfo.params && typeof routeInfo.params === 'object' && Object.keys(routeInfo.params).length ? routeInfo.params : undefined;
                  if (routeInfo.name) {
                    next({ name: routeInfo.name, query, params, replace: true });
                    return;
                  } else if (routeInfo.path) {
                    next({ path: routeInfo.path, query, params, replace: true });
                    return;
                  }
                } catch (e) {}
              }
            }
            
            next({ ...to, replace: true });
            return;
          }
        }
        // 如果还是没有角色，可能是数据异常，但不应该跳转到登录页
        console.warn("已登录但无法获取角色信息");
      }
    } else {
      // 路由已加载，检查当前路由是否存在
      if (to.matched.length === 0) {
        // 路由不存在，可能是动态路由丢失，重新加载
        if (userRole) {
          addRoleRoutes(userRole);
          
          // 如果是刷新页面，尝试恢复保存的路由
          if (isPageRefresh) {
            const savedRoute = localStorage.getItem("last_route");
            if (savedRoute) {
              try {
                const routeInfo = JSON.parse(savedRoute);
                const query = routeInfo.query && typeof routeInfo.query === 'object' && Object.keys(routeInfo.query).length ? routeInfo.query : undefined;
                const params = routeInfo.params && typeof routeInfo.params === 'object' && Object.keys(routeInfo.params).length ? routeInfo.params : undefined;
                if (routeInfo.name) {
                  next({ name: routeInfo.name, query, params, replace: true });
                  return;
                } else if (routeInfo.path) {
                  next({ path: routeInfo.path, query, params, replace: true });
                  return;
                }
              } catch (e) {}
            }
          }
          
          next({ ...to, replace: true });
          return;
        }
      }
    }
  }

  // 只有在未登录且需要权限验证时才跳转到登录页
  // 注意：这里要确保不是动态路由未加载的情况
  if (!is_login_curr) {
    // 检查是否是基础路由（不需要权限）
    const isConstantRoute = constantRoutes.some(route => {
      if (route.path === to.path) return true;
      if (route.path === '*' && to.path !== '/login') return true;
      return false;
    });
    
    // 如果不是基础路由且需要权限，跳转到登录页
    if (!isConstantRoute && to.meta && to.meta.requireAuth) {
      next("/login");
      return;
    }
  }

  next();
});

router.afterEach((to, from) => {
  // 保存当前路由信息到 localStorage（排除登录页和首页）
  if (to.path !== '/login' && to.path !== '/') {
    const routeInfo = {
      name: to.name,
      path: to.path,
      params: to.params,
      query: to.query
    };
    localStorage.setItem("last_route", JSON.stringify(routeInfo));
  }
});

export default router;
