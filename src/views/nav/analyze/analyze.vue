<script>
import breadcrumb from "@/components/breadcrumb/index.vue";

export default {
  name: "analyze",
  components: {breadcrumb},
  data() {
    return {
      selectItem: {},
      list: [],
      pagination: {
        page: 1,
        limit: 10
      },
      count: 0
    }
  },
  computed: {
    activeMenu() {
      const route = this.$route;
      const {meta, path, query} = route;
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      if (path == '/analyze_list' && query.type) {
        this.menuSelect(query.type);
      }
      return query.type;
    },
  },
  watch: {
    vuexTreeCates() {
      if (this.$route.query.type) {
        this.menuSelect(this.$route.query.type);
      }
    },
  },
  methods: {
    // 选择菜单
    menuSelect(index) {
      if (this.vuexTreeCates.length != 0) {
        this.vuexTreeCates.forEach((item, i) => {
          if (item.id == index) {
            this.selectItem = item;
          } else {
            item.children ? item.children.forEach((it, j) => {
              if (it.id == index) {
                this.selectItem = it;
              }
            }) : ''
          }
        })
        this.$router.push({path: '/analyze_list', query: {type: this.selectItem.id}});
      }
    },
  }
}
</script>

<template>
  <div class="container main">
    <breadcrumb
        :list="[{path: '/', name: '首页'}, { name: '服务内容'}, {path: '/analyze?type=' + selectItem.id, name: selectItem.title}]"></breadcrumb>
    <div class="content">
      <div class="left">
        <div class="title">服务内容</div>
        <div class="menu">
          <el-menu :default-active="activeMenu" :unique-opened="true" @select="menuSelect">
            <template v-for="(item, index) in vuexTreeCates">
              <el-submenu :index="item.id + ''" v-if="item.children">
                <template slot="title">
                  <span>{{ item.title }}</span>
                </template>
                <el-menu-item :index="it.id" v-for="(it, i) in item.children" :key="i">
                  {{ it.title }}
                </el-menu-item>
              </el-submenu>
              <el-menu-item :index="item.id + ''" v-else>
                <span>{{ item.title }}</span>
              </el-menu-item>
            </template>
          </el-menu>
        </div>
      </div>
      <div class="right">
        <router-view :selectItem="selectItem"></router-view>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.container {
  padding-bottom: 90px;
}

.content {
  .flex();
  margin: 80px auto 0 auto;
  align-items: start;
  justify-content: space-between;

  .left {
    width: 260px;
    background: #FFFFFF;
    border-top-left-radius: 20px;

    .title {
      width: 260px;
      height: 56px;
      background: #00479D;
      line-height: 56px;
      padding-left: 23px;
      font-weight: 400;
      font-size: 20px;
      color: #FFFFFF;
    }

    .menu {
      //padding-bottom: 48px;

      /deep/ .el-submenu {
        border-bottom: 1px solid #E7E7E7;
      }

      /deep/ .el-submenu.is-active {
        background: #3399FF;

        .el-submenu__title {
          padding-left: 14px !important;
          height: 41px;
          line-height: 41px;
          background: #3399FF;
          font-weight: 400;
          font-size: 14px;
          color: #FFFFFF;
        }

        .el-submenu__icon-arrow {
          color: #fff;
          font-size: 16px;
        }
      }

      /deep/ .el-submenu__title:hover {
        background: transparent;
      }

      /deep/ .el-menu-item {
        font-size: 16px;
        color: #000000;
        padding: 0 20px !important;
        border-bottom: 1px solid #E7E7E7;

        &:hover {
          background-color: transparent;
        }

        &:last-child {
          border-bottom: none;
        }
      }

      /deep/ .el-menu-item.is-active {
        font-size: 16px;
        color: #fff;
        background: #3399FF;
      }
    }
  }

  .right {
    margin-left: 40px;
    flex: 1;
  }
}
</style>
