<template>
  <el-menu
      :default-active="defaultActive"
      class="el-menu-vertical-demo custom-menu"
      background-color="linear-gradient( 180deg, #452F86 0%, #A92B83 31%, #D14F8D 67%, #E38179 100%)"
      text-color="#fff"
      :unique-opened="true"
      router
  >
    <el-submenu v-for="menu in menus" :key="menu.index" :index="menu.index">
      <template #title>
        <span
            class="icon-placeholder"
            :style="{
            backgroundImage: menu.icon ? 'url(' + menu.icon + ')' : '',
          }"
        ></span>
        <span>{{ menu.title }}</span>
      </template>
      <el-menu-item
          v-for="item in menu.children"
          :key="item.index"
          :index="item.index"
      >
        {{ item.title }}
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  name: "ViewMenu",
  data() {
    return {
      menus: [
        {
          index: "1",
          title: "合计报价单管理",
          icon: require("@/assets/menu/icons/file.png"),
          children: [
            {index: "baojiadan-list", title: "合计报价单列表"},
            {index: "baojiadan-form", title: "创建合计报价单"},
          ],
        },
        {
          index: "2",
          title: "阶梯报价单管理",
          icon: require("@/assets/menu/icons/file.png"),
          children: [
            {index: "jietibaojiadan-list", title: "阶梯报价单列表"},
            {index: "jietibaojiadan-form", title: "创建阶梯报价单"},
          ],
        },
        {
          index: "3",
          title: "销售合同管理",
          icon: require("@/assets/menu/icons/file.png"),
          children: [
            {index: "xiaoshouhetong-list", title: "销售合同列表"},
            {index: "xiaoshouhetong-form", title: "创建销售合同"},
          ],
        },
        {
          index: "4",
          title: "采购合同管理",
          icon: require("@/assets/menu/icons/file.png"),
          children: [
            {index: "caigouhetong-list", title: "采购合同列表"},
            {index: "caigouhetong-form", title: "创建采购合同"},
          ],
        },
        {
          index: "5",
          title: "未税销售合同管理",
          icon: require("@/assets/menu/icons/file.png"),
          children: [
            {index: "weishuixiaoshouhetong-list", title: "未税销售合同列表"},
            {index: "weishuixiaoshouhetong-form", title: "创建未税销售合同"},
          ],
        },
        {
          index: "6",
          title: "未税采购合同管理",
          icon: require("@/assets/menu/icons/file.png"),
          children: [
            {index: "weishuicaigouhetong-list", title: "未税采购合同列表"},
            {index: "weishuicaigouhetong-form", title: "创建未税采购合同"},
          ],
        },
        {
          index: "7",
          title: "个人设置",
          icon: require("@/assets/menu/icons/setting.png"),
          children: [
            {index: "my-info", title: "个人信息"},
            {index: "my-password", title: "修改密码"},
          ],
        },
      ],
    };
  },
  computed: {
    defaultActive() {
      return this.$route.name;
    },
  }
};
</script>

<style scoped lang="less">
.custom-menu {
  width: 224px;
  min-height: calc(100vh - 70px);
  background: linear-gradient(to bottom, #7b2ff2, #f357a8);
}

.icon-placeholder {
  display: inline-block;
  width: 18px;
  height: 18px;
  margin-right: 8px;
  vertical-align: middle;
  background-size: cover;
  background-position: center;
}

/deep/ .el-menu {
  background-color: transparent !important;
}

.el-menu-item {
  background: transparent !important;

  &.is-active {
    background: linear-gradient(90deg,
    #a4458b 0%,
    #d14f8d 35%,
    #e38179 100%) !important;
    color: #fff !important;
  }
}

/deep/ .el-submenu__title {
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: start;
  background: #572d86 !important;

  i {
    color: #fff;
  }
}
</style>
