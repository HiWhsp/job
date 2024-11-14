<template>
  <div class="breadcrumb">
    <i class="el-icon-s-home"></i>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: item.path }" v-for="(item, index) in list" :key="index">
        {{ item.name }}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  name: "breadcrumb",
  props: ["list"],
};
</script>

<style lang="less" scoped>
.breadcrumb {
  padding: 23px 0 13px;
  color: #757575;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: end;
  i {
    margin-right: 5px;
  }
}
</style>
