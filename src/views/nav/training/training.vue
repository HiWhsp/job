<script>
import breadcrumb from "@/components/breadcrumb/index.vue";

export default {
  name: "training",
  components: {breadcrumb},
  data() {
    return {
      selectItem: {},
      form: {},
      menuList: [
        {
          title: '公司简介',
          index: '1',
        }, {
          title: '新闻动态',
          index: '2',
        }, {
          title: '技术快递',
          index: '3',
          path: '/technologyExpress'
        }, {
          title: '资料下载',
          index: '4',
        }, {
          title: '活动信息',
          index: '5',
        }, {
          title: '专家团队',
          index: '6',
          path: '/expertTeam'
        }, {
          title: '联系我们',
          index: '7',
        }
      ]
    }
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
        }
      })
      this.$router.push({path: this.selectItem.path})
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
        <div class="title">公司信息</div>
        <div class="menu">
          <el-menu default-active="1-1" :unique-opened="true" @select="menuSelect">
            <el-menu-item :index="item.index" v-for="(item, index) in menuList" :key="index">
              <template slot="title">
                <span>{{ item.title }}</span>
              </template>
            </el-menu-item>
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
  margin: 40px auto 0 auto;
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
        padding: 0 20px !important;
        border-bottom: 1px solid #E7E7E7;

        &:hover {
          background-color: #3399FF;
          color: #fff;
        }

        &:last-child {
          border-bottom: none;
        }
      }

      /deep/ .el-menu-item.is-active {
        font-size: 16px;
        color: #fff;
        background-color: #3399FF;
      }
    }
  }

  .right {
    margin-left: 40px;
    flex: 1;

    .title {
      font-weight: bold;
      font-size: 20px;
      color: #00479D;
    }

    .tip {
      margin-top: 21px;
      font-weight: 400;
      font-size: 16px;
      color: #333333;
    }

    .list {
      margin-top: 30px;
      .flex();
      flex-wrap: wrap;

      .list-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 260px;
        background: #FFFFFF;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        border-radius: 10px;
        padding: 14px 20px 20px 20px;
        box-sizing: border-box;
        margin-right: 18px;
        margin-bottom: 15px;

        &:nth-child(4n) {
          margin-right: 0;
        }

        img {
          width: 100%;
          height: 200px;
        }

        .title {
          width: 100%;
          margin-top: 10px;
          font-weight: 500;
          font-size: 16px;
          color: #333333;
          text-align: center;
        }

        .desc {
          width: 100%;
          margin-top: 5px;
          font-weight: 400;
          font-size: 14px;
          color: #666666;
        }

        .btn {
          margin-top: 20px;
          width: 100px;
          height: 40px;
          line-height: 40px;
          background: #00479D;
          border-radius: 20px;
          text-align: center;
          font-weight: 400;
          font-size: 16px;
          color: #FFFFFF;
          cursor: pointer;
        }

        .tip {
          margin-top: 15px;
          font-weight: 400;
          font-size: 12px;
          color: #999999;

          p {
            text-align: center;
            line-height: 21px;

            span {
              color: #FF8000;
            }
          }
        }
      }
    }
  }
}
</style>
