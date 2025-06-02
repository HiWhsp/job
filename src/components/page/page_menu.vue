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
          class="group-title-box flex"
          @click="do_toggle_nav_group(group)"
          :class="{
            select: group.route == $route.path,
            sub_select: route_group_map[$route.path] == group.title,
          }"
        >
          <div class="icon-box">
            <!-- <img class="icon" :src="group.icon" alt="" /> -->
            <img class="icon" :src="icon_default_map[group.title]" alt="" />
          </div>
          <div class="group-title">
            {{ group.title }}
            <!-- - {{ group.route }} -->
          </div>
          <div class="arrow-box" v-if="group.child && group.child.length">
            <img class="arrow" src="@/assets/menu/arrow-up.png" alt="" />
          </div>
        </div>
        <div class="sub-child" v-if="group.child && group.child.length">
          <div
            class="sub-item"
            v-for="(item, index) in group.child"
            :key="index"
            @click="do_toggle_nav_child(item)"
            :class="{ select: item.route == $route.path }"
          >
            <div class="sub-title">
              {{ item.title }}
              <!-- - {{ item.route }} -->
            </div>
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
      all_menu: system_menus,
      auth_role_menu: [],
      api_role_menu_list: [],

      api_tree_menu_options: [],

      icon_default_map: {
        产品管理: require("@/assets/menu/icons/product.png"),
        企业管理: require("@/assets/menu/icons/company.png"),
        采购员管理: require("@/assets/menu/icons/buyer.png"),
        业务员管理: require("@/assets/menu/icons/sales.png"),
        订单管理: require("@/assets/menu/icons/order.png"),
        退款管理: require("@/assets/menu/icons/refund.png"),
        营销活动: require("@/assets/menu/icons/market.png"),
        授信额度: require("@/assets/menu/icons/credit.png"),
        账期支付管理: require("@/assets/menu/icons/period.png"),
        余额管理: require("@/assets/menu/icons/credit.png"),
        数据统计: require("@/assets/menu/icons/statistics.png"),
        广告位管理: require("@/assets/menu/icons/banner.png"),
        文章管理: require("@/assets/menu/icons/article.png"),
        系统设置: require("@/assets/menu/icons/system.png"),
        数据字典: require("@/assets/menu/icons/dict.png"),
        权限设置: require("@/assets/menu/icons/dict.png"),
      },

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
  computed: {
    // page_menu() {
    // 	let navList = [];
    // 	// navList = this.all_menu;
    // 	navList = this.auth_role_menu;
    // 	return navList;
    // },
  },
  watch: {},
  created() {
    this.init_menu();
    this.query_system_menu();
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

    //根据路由id 展示对应路由
    // set_current_role_menus() {
    // 	let all_menu = this.all_menu;
    // 	let api_role_menu_list = this.api_role_menu_list;//['10','20'] 菜单id
    // 	let api_role_menu_map = {};
    // 	//
    // 	api_role_menu_list.forEach((menu_key) => {
    // 		api_role_menu_map[menu_key] = 1;
    // 	});

    // 	this.$log("当前登录用户菜单权限 all_menu", all_menu);
    // 	this.$log("当前登录用户菜单权限 api_role_menu_map", api_role_menu_map);

    // 	//筛选出当前登录用户允许访问的菜单
    // 	let auth_role_menu = [];
    // 	all_menu.forEach((v1_menu_item) => {
    // 		// let is_open_child_check = true; //父级子级需要同时勾选 权限才生效
    // 		let filter_child = [];
    // 		if (v1_menu_item.child && v1_menu_item.child.length) {
    // 			filter_child = v1_menu_item.child.filter(
    // 				(v2_menu_item) => api_role_menu_map[v2_menu_item.id]
    // 			);
    // 		}
    // 		v1_menu_item.child = filter_child;
    // 		let menu_key = v1_menu_item.id;
    // 		if (api_role_menu_map[menu_key]) {
    // 			auth_role_menu.push(v1_menu_item);
    // 		}
    // 	});

    // 	//最终渲染路由
    // 	this.auth_role_menu = auth_role_menu; //根据权限筛选
    // 	// this.auth_role_menu = real_menus;//固定权限
    // },

    do_toggle_nav_group(item) {
      this.$log("group导航切换", item);
      // if (!item.route) {
      item.is_expand = !item.is_expand;
      let index = this.auth_role_menu.findIndex((v) => v.route == item.route);
      this.auth_role_menu.splice(index, 1, item);
      // } else {
      // 	this.$router.push(item.route);
      // }

      this.$log("this.all_menu", this.all_menu);
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
      height: 60px;
      padding: 0px 0px;
      cursor: pointer;
      // background: #fff;

      &:hover {
        background: #eee;
      }

      &.sub_select {
        // background: rgba(64, 158, 255, 0.4);
      }

      .icon-box {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        width: 62px;
        height: 22px;
        padding-left: 20px;

        .icon {
          width: 20px;
          height: 20px;
        }
      }

      .group-title {
        flex: 1;
        font-family: Microsoft YaHei, Microsoft YaHei;
        // font-weight: bold;
        font-size: 14px;
        color: #333333;
        text-align: left;
      }

      .arrow-box {
        transition: 0.3s;
        margin-right: 20px;

        .arrow {
          height: 14.22px;
        }
      }
    }

    .sub-child {
      .sub-item {
        padding: 16px 0px;
        cursor: pointer;
        padding-left: 60px;

        background: #fff;

        &:hover {
          background: #eee;
        }

        &.select {
          background: #409eff;

          .sub-title {
            color: #fff;
          }
        }

        .sub-title {
          text-align: left;
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: 400;
          font-size: 14px;
          color: #666666;

          &.active {
            color: #009f39;
          }
        }
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
