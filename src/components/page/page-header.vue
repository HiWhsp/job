<template>
  <div class="page-header">
    <div class="top-box">
      <div class="content flex flex-between">
        <div class="l-box flex">
          <span class="name">富俊机械运动组件采购商城</span>
          <div class="tools-btn flex">
            <div class="login pointer">登录</div>
            <div class="col"></div>
            <div class="register pointer">注册</div>
          </div>
        </div>
        <div class="r-box flex pointer">
          <div class="color-a6 flex">
            <img src="../../static/home/phone.png" alt="dianhua" class="img-1">400-085-7709
          </div>
          <div class="col"></div>
          <div class="flex">我的消息<span class="color-a6">({{ numList.message }})</span><img
              src="../../static/home/down.png" class="img-2"></div>
          <div class="col"></div>
          <div>我的订单<span class="color-a6">({{ numList.message }})</span></div>
          <div class="col"></div>
          <div>积分商城<span class="color-a6">({{ numList.message }})</span></div>
          <div class="col"></div>
          <div>关于富俊</div>
          <div class="col"></div>
          <div>帮助中心</div>
        </div>
      </div>
    </div>
    <div class="info-box">
      <div class="content flex flex-between">
        <div class="l-box">
          <img src="../../static/home/logo.png" alt="logo" class="img-1">
          <span>运动组件采购商城</span>
        </div>
        <div class="m-box">
          <div class="search flex">
            <el-input v-model="searchInput" placeholder="可直接搜索同行型号 获取低成本替代"></el-input>
            <el-button type="primary" icon="el-icon-search">搜索</el-button>
          </div>
          <div class="search-hot">
            <a class="hot">简易丝杆模组</a>
            <a class="hot">两轴模组</a>
            <a class="hot">丝杆组件</a>
            <a class="hot">两轴组件</a>
            <a class="hot">多轴模组</a>
          </div>
        </div>
        <div class="r-box">
          <div class="flex">
            <div class="tools-btn pointer flex"><img class="img-2" src="../../static/home/gouwuche.png" alt="">购物车
            </div>
            <div class="tools-btn pointer flex"><img class="img-3" src="../../static/home/wexin.png" alt="">微信公众号
            </div>
          </div>
          <div class="hot">
          </div>
        </div>
      </div>
    </div>
    <div class="nav-box">
      <div class="content flex">
        <div class="nav flex" v-for="(item, index) in navList" :key="index">
          <img class="img-0" :src="item.icon" alt="" v-if="item.position == 'l'">
          <span class="name">{{ item.title }}</span>
          <img class="img-1" :src="item.icon" alt="" v-if="item.position == 'r'">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchInput: '', // 搜索条件
      // 头部导航列表
      navList: [
        {
          title: '全部商品分类', // 名称
          icon: require('../../static/home/down_all.png'),
          position: 'r'
        },
        {
          title: '特惠商城', // 名称
          icon: require('../../static/home/hot-shop.png'),
          position: 'l'
        },
        {
          title: '低价爆款专区', // 名称
          icon: null,
          position: null
        }, {
          title: '每月新款专区', // 名称
          icon: require('../../static/home/hot-new.png'),
          position: 'l'
        }, {
          title: '定制组件专区', // 名称
          icon: null,
          position: null
        }, {
          title: 'DIY 组件专区', // 名称
          icon: null,
          position: null
        }, {
          title: '非标定制', // 名称
          icon: null,
          position: null
        }, {
          title: '快速报价', // 名称
          icon: null,
          position: null
        }],
      // 小标数据
      numList: {
        orderIndex: 0,
        integral: 0,
        message: 0,
        shop: 0
      }
    }
  }
}
</script>

<style lang="less" scoped>
.content {
  width: 1200px;
  margin: 0 auto;
}

.col {
  width: 0px;
  height: 12px;
  border: 1px solid #C6CACD;
  margin: 0 10px;
}

.color-a6 {
  color: #A66600;
}

.page-header {
  width: 100%;

  .top-box {
    background: #F1F1F1;
    border-radius: 0px 0px 0px 0px;

    .l-box {
      .name {
        margin-right: 21px;
      }
    }

    .r-box {
      color: #77797B;

      .img-1 {
        width: 16px;
        height: 16px;
        margin-right: 5px;
      }

      .img-2 {
        width: 9.01px;
        height: 5.22px;
        margin-left: 5px;
        margin-top: 3px;
      }
    }

    .content {
      height: 37px;
      color: #77797B;
      font-size: 12px;
    }
  }

  .info-box {
    width: 100%;
    height: 99px;
    background: #FFFFFF;

    .l-box {
      .img-1 {
        width: 261px;
        height: 29px;
        margin-right: 10px;
      }

      font-weight: bold;
      font-size: 16px;
      color: #959491;
      text-align: left;
      font-style: normal;
      text-transform: none;
    }

    .m-box {
      .search {
        .el-input {
          width: 383px;

          /deep/ .el-input__inner {
            border: 3px solid #A66600;
            border-radius: 4px 0px 0px 4px;
          }
        }

        .el-button--primary {
          background-color: #A66600;
          border-color: #A66600;
          border-radius: 0px 4px 4px 0px;
        }
      }

      .search-hot {
        margin-top: 7px;
        font-size: 12px;
        .hot {
          margin-right: 16px;
          color: #86888A;
        }
      }
    }

    .r-box {
      .tools-btn {
        padding: 10px;
        background: #FFFFFF;
        border-radius: 4px;
        border: 1px solid #E9EBEE;
        margin-right: 15px;
        font-size: 16px;
      }

      .hot {
        height: 20px;
      }

      .img-2 {
        width: 21.9px;
        height: 17.45px;
        margin-right: 10px;
      }

      .img-3 {
        width: 22.13px;
        height: 17.84px;
        margin-right: 10px;
      }
    }

    .content {
      height: 99px;
    }
  }

  .nav-box {
    .nav {
      margin-right: 60px;
      .name {
        font-family: Roboto, Roboto;
        font-weight: bold;
        font-size: 16px;
        color: #000000;
        text-align: left;
        font-style: normal;
        text-transform: none;
      }
    }
    .nav:last-child {
      margin-right: 0;
    }
    .img-0 {
      width: 21.7px;
      height: 21.68px;
      margin-right: 5px;
    }

    .img-1 {
      width: 9.45px;
      height: 6.69px;
      margin-left: 5px;
    }

    .content {
      height: 42px;
    }
  }

}
</style>
