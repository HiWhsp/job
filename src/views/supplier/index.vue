<script>
export default {
  name: "index",
  data() {
    return {
      selectItem: {},
      form: {},
      menuList: [
        {
          title: '首页',
          index: '/supplier-home'
        },
        {
          title: '订单管理',
          index: '/order',
          children: [
            {
              title: '全部订单',
              index: '/supplier-order'
            }, {
              title: '已分派订单',
              index: '/assign-order'
            }, {
              title: '运输中订单',
              index: '/transit-order'
            }, {
              title: '待上传结果订单',
              index: '/waitUploadResult-order'
            }, {
              title: '报告审核订单',
              index: '/reportAudit-order'
            }, {
              title: '已完成订单',
              index: '/finish-order'
            }, {
              title: '复测订单',
              index: '/retest-order'
            }, {
              title: '待结算订单',
              index: '/waitSettlement-order'
            }, {
              title: '样品回收订单',
              index: '/sampleRecovery-order'
            }, {
              title: '差评/异议订单',
              index: '/objection-order'
            }, {
              title: '超期/即将超期订单',
              index: '/overdue-order'
            }
          ]
        },
        {
          title: '报告管理',
          index: '/supplier-reportManage'
        },
        {
          title: '设备管理',
          index: '/profile'
        },
        {
          title: '历史结算',
          index: '/profile'
        },
        {
          title: '个人资料',
          index: '/profile'
        },
        {
          title: '平台协议',
          index: '/profile'
        },
        {
          title: '退出登录',
          index: '17'
        }
      ]
    }
  },
  computed: {
    activeMenu() {
      const route = this.$route;
      const {meta, path} = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      console.log(path)
      return path;
    },
  },
  mounted() {
    this.selectItem = this.menuList[0];
    this.form = {type: ''};
  },
  methods: {
    // 选择菜单
    menuSelect(index) {
      if (index === 17) {
        this.logout();
      }
      this.form = {type: ''};
      this.menuList.forEach((item, i) => {
        if (item.index === index) {
          this.selectItem = item;
        } else if (item.children) {
          item.children.forEach((it, j) => {
            if (it.index === index) {
              this.selectItem = it;
            }
          })
        }
      })
      this.$router.push({path: this.selectItem.index})
    },
    logout() {
      this.$store.commit("clear_loginInfo");
      // debugger
      if (this.$route.meta.requireAuth) {
        this.$router.push("/");
      }
    },
  }
}
</script>

<template>
  <div class="container">
    <div class="content">
      <div class="left">
        <div class="title">会员中心</div>
        <div class="menu">
          <el-menu :default-active="activeMenu" :unique-opened="true" @select="menuSelect">
            <template v-for="(item, index) in menuList">
              <el-submenu :index="item.index" v-if="item.children">
                <template slot="title">
                  <span>{{ item.title }}</span>
                </template>
                <el-menu-item :index="it.index" v-for="(it, i) in item.children" :key="i">
                  {{ it.title }}
                </el-menu-item>
              </el-submenu>
              <el-menu-item :index="item.index" v-else>
                <span>{{ item.title }}</span>
                <span class="tip" v-if="item.tip">{{ item.tip }}</span>
              </el-menu-item>

            </template>
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
  padding: 0 0 90px;
}

.content {
  .flex();
  align-items: start;
  justify-content: space-between;

  .left {
    width: 200px;
    background: #FFFFFF;
    border-top-left-radius: 20px;

    .title {
      width: 200px;
      height: 56px;
      background: #00479D;
      line-height: 56px;
      padding-left: 23px;
      font-weight: 400;
      font-size: 20px;
      color: #FFFFFF;
    }

    .menu {

      /deep/ .el-submenu {
        border-bottom: 1px solid #E7E7E7;
        min-height: 45px;
        line-height: 45px;

        .el-submenu__title {
          height: 45px;
          line-height: 45px;
          font-size: 14px;
          border-bottom: 1px solid #E7E7E7;
        }

        .el-submenu__icon-arrow {
          color: #272636;
          font-weight: bold;
          font-size: 16px;
        }

        .el-menu-item {
          padding-left: 30px !important;
        }
      }

      /deep/ .el-menu-item {
        height: 45px;
        line-height: 45px;
        font-size: 14px;
        color: #333333;
        padding: 0 20px !important;
        border-bottom: 1px solid #E7E7E7;

        span {
          display: inline-block;

          &:first-child {
            width: 70px;
          }

          &:nth-child(2) {
            height: 20px;
            padding: 0 8px;
            line-height: 20px;
            background: linear-gradient(180deg, #FFE7C0 0%, #FFBD57 100%);
            border-radius: 3px 3px 3px 3px;
            font-weight: 400;
            font-size: 12px;
            color: #482E00;
          }
        }

        &:hover {
          background-color: transparent;
        }

        &:last-child {
          border-bottom: none;
        }
      }

      /deep/ .el-menu-item.is-active {
        color: #00479D;
        background-color: transparent;

        &:before {
          content: '';
          position: absolute;
          top: 8px;
          left: 0;
          width: 4px;
          height: 27px;
          background-color: #27417C;
        }
      }

      /deep/ .el-submenu__title:hover {
        background: transparent;
      }
    }
  }

  .right {
    margin-left: 20px;
    margin-right: 20px;
    margin-top: 30px;
    flex: 1;
    background: #FFFFFF;
  }
}
</style>
