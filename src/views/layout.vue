<template>
  <div id="root">
    <div class="root-inner">
      <div class="root-left">
        <page_menu />
      </div>
      <div class="root-right">
        <div class="root-right-header">
          <page_header />
        </div>
        <div class="root-right-inner">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import page_header from "@/components/page/page_header.vue";
import page_menu from "@/components/page/page_menu.vue";
import { addRoleRoutes } from "@/router/index.js";

export default {
  components: {
    page_header,
    page_menu
  },
  data() {
    return {};
  },
  mounted() {
    this.$store.dispatch("appInit");
    // 确保路由已加载
    this.loadRoleRoutes();
  },

  methods: {
    loadRoleRoutes() {
      // 从 store 获取用户角色
      const role = this.$store.state.vuex_role;
      if (role) {
        addRoleRoutes(role);
      }
    }
  }
};
</script>


<style lang="less">
#root {
  text-align: center;
  color: #2c3e50;
  background: #f8f8f8;

  &.root-login {
    padding-top: 0 !important;
  }
}
</style>

<style lang="less" scoped>
.root-inner {
  height: 100vh;
  display: flex;
  flex-direction: row;
}

.root-left {
  width: 233px;
  height: 100vh;
  background: #304156;
  box-shadow: 0px 3px 6px 1px rgba(0, 0, 0, 0.16);
}

.root-right {
  flex: 1;
  position: relative;
  overflow: hidden;

  .root-right-header {
    height: 83px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 5px;
    border: 8px solid #409eff;
    background: #fff;
  }

  &::-webkit-scrollbar {
    width: 8px;
    height: 0px;
  }

  .root-right-inner {
    height: calc(100vh - 83px);
    padding: 20px 27px;
    overflow-y: auto;
  }
}
</style>