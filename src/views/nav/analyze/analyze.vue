<script>
import breadcrumb from "@/components/breadcrumb/index.vue";

export default {
  name: "analyze",
  components: {breadcrumb},
  data() {
    return {
      selectItem: {},
      form: {},
      menuList: [
        {
          title: '超快激光常用换算',
          index: '1',
          children: [{
            title: '光谱分析',
            index: '1-1'
          }]
        }
      ]
    }
  },
  mounted() {
    this.selectItem = this.menuList[0].children[0];
    this.form = {type: ''};
  },
  methods: {
    // 选择菜单
    menuSelect(index) {
      this.form = {type: ''};
      this.menuList.forEach((item, i) => {
        if (item.index === index) {
          this.selectItem = item;
        } else {
          item.children.forEach((it, j) => {
            if (it.index === index) {
              this.selectItem = it;
            }
          })
        }
      })
    }
  }
}
</script>

<template>
  <div class="container main">
    <breadcrumb
        :list="[{path: '/', name: '首页'}, { name: '服务内容'}, {path: '/analyze', name: '分析测试'}]"></breadcrumb>
    <div class="content">
      <div class="left">
        <div class="title">服务内容</div>
        <div class="menu">
          <el-menu default-active="1-1" :unique-opened="true" @select="menuSelect">
            <el-submenu :index="item.index" v-for="(item, index) in menuList" :key="index">
              <template slot="title">
                <span>{{ item.title }}</span>
              </template>
              <el-menu-item :index="it.index" v-for="(it, i) in item.children" :key="i">
                {{ it.title }}
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </div>
      </div>
      <div class="right">
        <router-view></router-view>
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
        padding: 0 !important;
        margin: 0 20px !important;
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
        color: #27417C;
        background-color: transparent;
      }
    }
  }

  .right {
    margin-left: 40px;
    flex: 1;

  }
}
</style>
