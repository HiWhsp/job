/**
 * 管理端 `/manager` 与总经理端「管理员」菜单 `/general-manager/admin` 共用页面时的路径前缀。
 * @param {import('vue').default} vm 需可访问 `this.$route.path`
 * @returns {string}
 */
export function adminRootPath(vm) {
  const p = (vm && vm.$route && vm.$route.path) || "";
  if (p.startsWith("/general-manager/admin")) {
    return "/general-manager/admin";
  }
  return "/manager";
}

/**
 * @param {import('vue').default} vm
 * @param {string} rel 以 `/` 开头的相对路径，如 `/customer/list`
 */
export function adminPath(vm, rel) {
  const r = rel.startsWith("/") ? rel : `/${rel}`;
  return `${adminRootPath(vm)}${r}`;
}
