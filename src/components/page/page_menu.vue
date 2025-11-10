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
      api_role_menu_list: [],

      api_tree_menu_options: [],

      route_group_map: {
        // 'product-list': '产品管理',
        // 'product-cate': '产品管理',
      },

      //
      is_query_all_menu: false,
      is_query_own_menu: false,
      my_own_menu_id_array: [],
      tree_flat_menuIds_options: [],
    };
  },
  computed: {},
  watch: {},
  created() {
    if (!this.is_test) {
      this.init_menu();
      this.query_system_menu();
    }
  },
  mounted() {},
  methods: {
    init_menu() {
      let route_group_map = {};
      this.all_menu.forEach((v1) => {
        v1.is_expand = false;
        v1.child.forEach((v2) => {
          route_group_map[v2.route] = v1.title;
        });
      });
      this.route_group_map = route_group_map;
      this.$log("all_menu", this.all_menu);

      this.$api({
        url: "/getInfo",
        method: "get",
        data: {},
      }).then((res) => {
        if (res.code == 200) {
          this.$store.commit("set_vuex_user", res);

          let roleId = res.user.roles[0].roleId;
          this.$log("获取用户信息 getInfo", res);
          if (roleId == 1) {
            //超级管理员
            this.auth_role_menu = this.all_menu;
            this.set_expand_item();
          } else {
            // this.query_rolo_info(roleId);
            this.set_expand_item();
            this.query_current_role_menu_config(roleId);
          }
        } else {
          alert(res);
          this.$router.push({ path: "/login" });
        }
      });
    },

    query_rolo_info(roleId) {
      this.$api({
        url: `/system/role/${roleId}`,
        method: "get",
        data: {},
      }).then((res) => {
        if (res.code == 200) {
          let data = res.data;
          // let roleInfo = data.roleInfo || {};
          // this.api_role_menu_list = roleInfo.roles || [];
          this.$log("menu 获取登录用户信息", data);

          let is_test = true;
          if (is_test || data.roleId == 1 || data.roleName == "超级管理员") {
            //总管理员
            this.auth_role_menu = this.all_menu;
          } else {
            // this.set_current_role_menus()
          }
          //固定角色的项目类型
          // let platform = '测试';
          // if (platform == "总管理") {
          // 	this.auth_role_menu = this.all_menu;
          // } else if (platform == "子账号") {
          // 	this.auth_role_menu = this.level_1_menus; //固定权限
          // }
          this.set_expand_item();

          this.$log(
            "当前登录用户的展示菜单 this.auth_role_menu",
            this.auth_role_menu
          );
        }
      });
    },

    // 全部的 系统菜单
    query_system_menu() {
      this.$api({
        url: "/system/menu/treeselect",
        method: "get",
        data: {
          pageNum: 1,
          pageSize: 100,
        },
      }).then((res) => {
        if (res.code == 200) {
          let list = res.data;
          // this.mix_format_list_id(list, 'id')
          this.menuIds_options = list;

          //
          this.format_tree_options(list);

          this.is_query_all_menu = true;
          this.set_render_menus();
        }
      });
    },

    // 角色配置
    query_current_role_menu_config(roleId) {
      this.$api({
        url: `/system/menu/roleMenuTreeselect/${roleId}`,
        method: "get",
        data: {},
      }).then((res) => {
        if (res.code == 200) {
          let id_array = res.checkedKeys || [];
          console.warn("获取当前角色菜单配置 id_array", id_array);
          this.my_own_menu_id_array = id_array;
          this.is_query_own_menu = true;

          this.set_render_menus();
        }
      });
    },

    //
    set_render_menus() {
      if (this.is_query_own_menu && this.is_query_all_menu) {
        this.$log(
          "接口菜单选项 tree_flat_menuIds_options",
          this.tree_flat_menuIds_options
        );
        this.$log(
          "用户菜单权限 my_own_menu_id_array",
          this.my_own_menu_id_array
        );

        let own_options = this.tree_flat_menuIds_options;
        let own_map = {};
        own_options.forEach((v) => {
          own_map[v.label] = true;
        });

        //
        let auth_role_menu = [];
        this.all_menu.forEach((v1_menu_item) => {
          let title = v1_menu_item.title;
          if (own_map[title]) {
            //如果接口包含当前菜单权限
            // v1_menu_item.is_expand = true;
            auth_role_menu.push(v1_menu_item);
          }
        });
        this.auth_role_menu = auth_role_menu;
        this.$log("用户菜单权限 own_map", own_map);
        this.$log("用户菜单权限 auth_role_menu", this.auth_role_menu);

        //如果当前页面路由不包含在当前角色的菜单权限中 则跳转到首页
        let is_route_in_menu = false;
        if (is_route_in_menu == false) {
          // this.$router.push({ path: "/index" });
        }
        // this.set_current_role_menus();
      }
    },

    //根据接口返回的路由id 筛选对应的路由菜单
    set_current_role_menus() {
      let menu_tree_cates = this.api_tree_menu_options; //接口返回的
      let menu_flat_cates = this.getFlatFromTree(menu_tree_cates);
      let all_menu_id_map = {}; //所有接口id
      menu_flat_cates.forEach((v) => {
        let key =
          v.routeAddress[0] != "/" ? "/" + v.routeAddress : v.routeAddress;
        all_menu_id_map[key] = v.id;
      });

      //
      this.$log("接口菜单数据 menu_tree_cates", menu_tree_cates);
      this.$log("接口菜单数据 menu_flat_cates", menu_flat_cates);
      this.$log("本地配置 all_menu", this.all_menu);
      this.$log("本地配置 api_role_menu_list", this.api_role_menu_list);
      this.$log("本地配置 all_menu_id_map", all_menu_id_map);

      //处理权限
      let api_role_menu_list = this.api_role_menu_list; //['10','20'] 菜单id
      let api_role_menu_map = {};
      //
      api_role_menu_list.forEach((menu_id) => {
        api_role_menu_map[menu_id] = 1;
      });
      this.$log("当前登录用户菜单权限 api_role_menu_map", api_role_menu_map);

      //筛选出当前登录用户允许访问的菜单
      //遍历系统所有菜单栏目
      //当前菜单被包含在用户的权限组中访客查看该栏目
      let auth_role_menu = [];
      this.all_menu.forEach((v1_menu_item) => {
        let menu_id = all_menu_id_map[v1_menu_item.route];
        // if(v1_menu_item.title == '订单管理') {
        // 	debugger
        // }

        // debugger
        let auth_v1_child = []; //可访问的二级栏目
        if (v1_menu_item.child && v1_menu_item.child.length) {
          v1_menu_item.child.forEach((v2_menu_item) => {
            let menu_id = all_menu_id_map[v2_menu_item.route];
            if (api_role_menu_map[menu_id]) {
              //如果接口包含当前菜单权限
              auth_v1_child.push(v2_menu_item);
            }
          });
        }

        if (api_role_menu_map[menu_id]) {
          //一级权限控制  如果接口包含当前菜单权限
          //如果没有勾选任何一个次级分类 则开放整个1级分类下的所有子菜单
          //只要勾选了任意一个子菜单 则只开放所勾选的子菜单权限
          if (auth_v1_child.length) {
            v1_menu_item.child = auth_v1_child;
          }
          auth_role_menu.push(v1_menu_item);
        } else {
          if (auth_v1_child.length) {
            //二级权限控制
            v1_menu_item.child = auth_v1_child;
            auth_role_menu.push(v1_menu_item);
          }
        }
      });

      //最终渲染路由
      this.auth_role_menu = auth_role_menu; //根据权限筛选

      this.$log("当前登录用户菜单权限 auth_role_menu", this.auth_role_menu);
    },

    // 格式化树形数据
    format_tree_options(tree_options) {
      let tree_flat_menuIds_options = [];
      this.handle_tree_options(
        {
          tree: tree_options,
          deep: 1,
          parent_item: null,
        },
        tree_flat_menuIds_options
      );
      this.tree_flat_menuIds_options = tree_flat_menuIds_options;
      this.$log("tree-flat 树形数据", this.tree_flat_menuIds_options);
    },

    handle_tree_options(option, flat_options) {
      let tree = option.tree || [];
      let deep = option.deep || 1;
      let parent_item = option.parent_item || "";

      // 循环生成 ids_string
      // 循环生成 ids_array

      tree.forEach((son) => {
        let ids_array = parent_item
          ? [...parent_item.ids_array, son.id]
          : [son.id];
        son.ids_string = ids_array.join("-");
        son.ids_array = ids_array;
        son.deep = deep;

        flat_options.push(son);

        if (son && son.children) {
          this.handle_tree_options(
            {
              tree: son.children,
              deep: deep + 1,
              parent_item: son,
            },
            flat_options
          );
        }
      });
    },

    getFlatFromTree(treeList, flat_list = [], parent_id_path = []) {
      treeList.forEach((v) => {
        v.id_path = [...parent_id_path, v.id];
        flat_list.push(v);
        if (v.child && v.child.length) {
          // flat_list.push(...v.child)
          this.getFlatFromTree(v.child, flat_list, v.id_path);
        }
      });

      return flat_list;
    },

    set_expand_item() {
      console.log("当前路由", this.$route);

      let path = this.$route.path;
      //遍历1级分类
      let expand_item_index = this.auth_role_menu.findIndex(
        (v) => v.route == path
      );

      //遍历二级子分类
      if (expand_item_index < 0) {
        this.auth_role_menu.forEach((v1, v1_index) => {
          if (v1.child && v1.child.length) {
            if (v1.child.some((v) => v.route == path)) {
              expand_item_index = v1_index;
            }
          }
        });
      }

      //当前展开项目
      if (expand_item_index >= 0) {
        let expand_item = this.auth_role_menu[expand_item_index];
        expand_item.is_expand = true;
        this.auth_role_menu.splice(expand_item_index, 1, expand_item);

        //滚动到指定位置
        this.$nextTick(() => {
          console.log(document.querySelector(".menu-group.is_expand"));
          document.querySelector(".menu-group.is_expand").scrollIntoView({
            block: "center",
            inline: "center",
            behavior: "smooth",
          });
        });
      }
      console.log("expand_item_index = ", expand_item_index);
    },

    do_toggle_nav_group(item) {
      this.$log("group导航切换", item);

      this.$router.push(item.route);
    },

    do_toggle_nav_child(item) {
      this.$log("child导航切换", item);
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
      &:hover {
      }

      &.select {
        box-shadow: 3px 0px 8px 1px rgba(0,0,0,0.12);
        border-radius: 0px 12px 12px 0px;

        .group-title { 
          color: #3377FE !important;
        }
      }
      &.sub_select {
        // background: rgba(64, 158, 255, 0.4);
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