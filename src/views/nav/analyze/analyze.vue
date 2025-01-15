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
      defaultProps: {
        children: "children",
        label: "title",
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
  mounted() {
    const route = this.$route;
    const {meta, path, query} = route;
    if (meta.activeMenu) {
      return meta.activeMenu;
    }
    if (path == '/analyze_list' && query.type) {
      this.menuSelect(query.type);
    }
  },
  methods: {
    // 选择菜单
    menuSelect(index) {
      if (this.vuexTreeCates.length != 0) {
        // 判断是数字还是对象
        if(typeof index == 'object') {
          this.selectItem = index;
        }else {
          // 递归循环vuexTreeCates 通过index找到指定内容
          this.selectItem = findById(this.vuexTreeCates, +index);
          this.$refs.tree.setCurrentNode(this.selectItem);
        }
        function findById(data, id) {
          for (const item of data) {
            if (item.id === id) {
              return item; // 找到目标内容，直接返回
            }
            if (item.children && item.children.length > 0) {
              const result = findById(item.children, id); // 递归查找子节点
              if (result) {
                return result; // 如果在子节点中找到，返回结果
              }
            }
          }
          return null; // 如果没有找到，返回 null
        }
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
          <el-tree
              v-if="selectItem.id"
              ref="tree"
              :data="vuexTreeCates"
              :props="defaultProps"
              node-key="id"
              highlight-current
              accordion
              @node-click="menuSelect"
          >
            <span slot-scope="{ node, data }">
              <span style="font-size: 16px;">{{ data.title }}</span>
            </span>
          </el-tree>
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
      /deep/ .el-tree-node__content {
        height: 56px;
      }
    }
  }

  .right {
    margin-left: 40px;
    flex: 1;
  }
}
</style>
