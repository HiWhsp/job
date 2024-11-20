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
          index: '/my-home'
        },
        {
          title: '阳光预付',
          tip: '充值赠送',
          index: '/sunPay'
        },
        {
          title: '活动专区',
          tip: '近期活动',
          index: '/activity'
        },
        {
          title: '优惠券',
          tip: '好券定期领',
          index: '/couponCenter'
        },
        {
          title: '致谢返利',
          tip: '返利10%',
          index: '/thesis'
        },
        {
          title: '邀请好友',
          tip: '返利10%',
          index: '/invite'
        },
        {
          title: '个人资料',
          index: '/profile'
        },
        {
          title: '我的订单',
          index: '/order',
          children: [
            {
              title: '正常订单',
              index: '/order'
            }, {
              title: '审批订单',
              index: '/approvalOrder'
            }, {
              title: '积分兑换订单',
              index: '/exchangeOrder'
            }
          ]
        },
        {
          title: '账户资金',
          index: '9',
          children: [
            {
              title: '待付款',
              index: '9-1'
            }
          ]
        },
        {
          title: '我的论坛',
          index: '10',
          children: [
            {
              title: '待付款',
              index: '10-1'
            }
          ]
        },
        {
          title: '我的团体',
          index: '11',
          children: [
            {
              title: '加入团体',
              index: '11-1',
              path: '/joinGroup'
            },
            {
              title: '新建团体',
              index: '11-2'
            }
          ]
        },
        {
          title: '发票管理',
          index: '12',
          children: [
            {
              title: '待付款',
              index: '12-1'
            }
          ]
        },
        {
          title: '报告管理',
          index: '13'
        },
        {
          title: '地址管理',
          index: '14'
        },
        {
          title: '电子邮箱',
          index: '15'
        },
        {
          title: '个人资料',
          index: '16'
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
    }
  }
}
</script>

<template>
  <div class="container main">
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
  padding: 30px 0 90px;
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
    margin-left: 40px;
    flex: 1;

  }
}
</style>
