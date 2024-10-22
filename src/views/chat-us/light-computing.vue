<script>
export default {
    data() {
        return {
            selectItem: {title: '波长-频率-波数-光子能量换算', index: '1-1'},
            menuList: [
                {
                    title: '超快激光常用换算',
                    index: '1',
                    children: [{
                        title: '波长-频率-波数-光子能量换算',
                        index: '1-1'
                    }, {
                        title: '已知波长和波长带宽求波数带宽',
                        index: '1-2'
                    }, {
                        title: '光谱/脉宽数据读取',
                        index: '1-3'
                    }, {
                        title: '不同脉冲宽度下的损伤阈值换算',
                        index: '1-4'
                    }, {
                        title: '对数比例和线性比例换算',
                        index: '1-5'
                    }, {
                        title: '波长带宽/频率带宽换算',
                        index: '1-6'
                    }, {
                        title: '菲涅尔反射/透射',
                        index: '1-7'
                    }, {
                        title: '高斯脉冲的峰值功率和能量密度',
                        index: '1-8'
                    }, {
                        title: '光斑在反射上的投影计算',
                        index: '1-9'
                    }, {
                        title: 'Yb:YAG晶体吸收系数和吸收率',
                        index: '1-10'
                    }, {
                        title: 'Yb:YAG晶体吸收系数和吸收率',
                        index: '1-11'
                    }]
                },
                {
                    title: '色散管理',
                    index: '2',
                    children: [{
                        title: '超快激光常用换算',
                        index: '2-1'
                    }]
                }, {
                    title: '空间特性和空间转换',
                    index: '3',
                    children: [{
                        title: '超快激光常用换算',
                        index: '3-1'
                    }]
                }, {
                    title: '非线性光学过程',
                    index: '4',
                    children: [{
                        title: '超快激光常用换算',
                        index: '4-1'
                    }]
                }
            ]
        }
    },
    methods: {
        menuSelect(index) {
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
            console.log(this.selectItem);
        }
    }
}
</script>

<template>
    <div class="page">
        <div class="top-img">
            <img src="@/assets/img/chat-us/light-img.png" alt="">
        </div>
        <div class="content">
            <div class="left">
                <div class="title">光电计算</div>
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
                <div class="title">{{ selectItem.title }}</div>
                <div class="sub_content">
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="less">
.page {
  padding-bottom: 50px;
}

.top-img {
  width: 100%;
  height: 500px;

  img {
    width: 100%;
    height: 100%;
  }
}

.content {
  width: 1400px;
  margin: 40px auto 0 auto;
  .flex();
  align-items: start;
  justify-content: space-between;

  .left {
    width: 270px;
    background: #FFFFFF;
    border-top-left-radius: 20px;

    .title {
      width: 270px;
      height: 73px;
      background: #27417C;
      border-top-left-radius: 20px;
      line-height: 73px;
      padding-left: 46px;
      font-weight: bold;
      font-size: 24px;
      color: #FFFFFF;
    }

    .menu {
      margin-top: 14px;
      padding-bottom: 48px;

      /deep/ .el-submenu {
        border-bottom: 1px solid #E7E7E7;
      }

      /deep/ .el-submenu.is-active {
        background: #27417C;

        .el-submenu__title {
          font-weight: bold;
          font-size: 18px;
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
    display: flex;
    flex-direction: column;
    width: 1103px;
    height: 853px;
    background: #FFFFFF;
    border-radius: 0px 20px 0px 20px;
    padding: 24px;

    .title {
      font-weight: bold;
      font-size: 18px;
      color: #27417C;
      padding-bottom: 17px;
      border-bottom: 1px solid #E7E7E7;
    }

    .sub_content {
      padding: 25px;
    }
  }
}
</style>
