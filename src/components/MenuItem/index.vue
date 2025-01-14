<template>
  <template v-for="item in menu">
    <!-- 判断是否有子菜单 -->
    <el-sub-menu v-if="item.children && item.children.length" :key="item.id" :index="item.id.toString()">
      <template #title>
        <span>{{ item.title }}</span>
      </template>
      <!-- 递归调用自身 -->
      <menu-item :menu="item.children" />
    </el-sub-menu>
    <!-- 渲染叶子节点 -->
    <el-menu-item v-else :index="item.id.toString()">
      {{ item.title }}
    </el-menu-item>
  </template>
</template>

<script>
export default {
  name: "MenuItem",
  props: {
    menu: {
      type: Array,
      required: true,
    },
  },
};
</script>
