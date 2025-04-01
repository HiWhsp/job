<template>
  <div class="page-header">
    <div class="top-box">
      <div class="content flex flex-between">
        <div class="l-box flex">
          <span class="name">欢迎来到奉新县砂轮行业协会-砂轮原辅材料交易采购平台！</span>
        </div>
        <div class="r-box flex pointer">
          <div class="tit" @click="goUrl({url: '/about'})">采购会员中心</div>
          <div class="col"></div>
          <div class="tit" @click="goUrl({url: '/help'})">我是供应商</div>
        </div>
      </div>
    </div>
    <div class="info-box">
      <div class="content flex flex-between">
        <div class="l-box">
          <img src="../../static/home/logo.png" alt="logo" class="img-1 pointer" @click="goUrl({url: '/'})">
          <span>奉新县砂轮行业协会</span>
        </div>
        <div class="m-box">
          <div class="search flex">
            <el-input v-model="searchInput" placeholder="请输入您要搜索的产品"></el-input>
            <el-button type="primary" icon="el-icon-search"
                       @click="searchClick({url: `/productCategories?keyword=${searchInput}`})">搜索
            </el-button>
          </div>
        </div>
        <div class="r-box">
          <div class="flex">
            <div class="tools-btn pointer flex" @click="goUrl({url: '/cart'})">
              <img class="img-2" src="../../static/home/gouwuche.png" alt="">购物车
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="nav-box">
      <div class="content flex">
        <div class="nav flex pointer" v-for="(item, index) in navList" :key="index" @click="goUrl(item)">
          <span class="name" :class="{'active': item.url == $route.path}">{{ item.title }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from "vuex";

export default {
  data() {
    return {
      searchInput: '', // 搜索条件
      // 头部导航列表
      navList: [
        {
          title: '首页', // 名称
          icon: null,
          position: 'l',
          url: '/discountShop'
        },
        {
          title: '意见反馈', // 名称
          icon: null,
          position: null,
          url: '/lowPriceShop'
        },
        {
          title: '联系我们', // 名称
          icon: null,
          position: 'l',
          url: '/newMonthShop'
        }
      ],
      // 热门搜索
      searchHot: []
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo,
      configInfo: state => state.configInfo
    })
  },
  watch: {
    configInfo(val) {
      this.searchHot = JSON.parse(val.hotSearch);
    }
  },
  methods: {
    // 跳转链接
    goUrl(item) {
      this.$router.push(item.url);
    },
    searchClick(item) {
      this.$router.push(item.url + `&hash=${Math.random()}`);
    },
    // 退出登录
    onunload() {
      this.$store.commit("clear_loginInfo");
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
  color: @theme;
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

      .register-btn {
        margin-left: 10px;
      }
    }

    .r-box {
      color: #77797B;

      .tit:hover {
        color: @theme !important;
      }

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
      display: flex;
      align-items: center;
      margin-right: 200px;

      .img-1 {
        width: 108px;
        height: 80px;
        margin-right: 10px;
      }

      font-weight: bold;
      font-size: 28px;
      color: #000;
      text-align: left;
      font-style: normal;
      text-transform: none;
    }

    .m-box {
      .search {
        .el-input {
          width: 383px;

          /deep/ .el-input__inner {
            border: 3px solid @theme;
            border-radius: 4px 0px 0px 4px;
          }
        }

        .el-button--primary {
          background-color: @theme;
          border-color: @theme;
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
    background: @theme;

    .nav {
      margin-right: 60px;

      .name {
        position: relative;
        font-family: Roboto, Roboto;
        font-weight: bold;
        font-size: 16px;
        color: #fff;
        text-align: left;
        font-style: normal;
        text-transform: none;
        border-bottom: 4px solid @theme;
        &:after {
          top: 29px;
          position: absolute;
          content: '';
          display: block;
          width: 100%;
          height: 4px;
          background: @theme;
          border-radius: 4px 4px 0px 0px;
        }
      }
      .active:after {
        background: #fff;
      }

      &:hover > .name:after {
        background: #fff;
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

.InfomationPopover {
  padding: 10px;
  color: #77797b;

  .InfomationPopover-title {
    height: 30px;
    color: #1c2023;
    font-size: 14px;
    font-weight: 700;
    border-bottom: 1px solid #e6e9ea;
  }

  .InfomationPopover-content {
    max-height: 180px;
    margin-top: 15px;
    overflow-y: scroll;
    font-size: 14px;
    color: #77797B;

    .content-item {
      display: flex;
      height: 20px;
      line-height: 20px;
      cursor: pointer;

      .content-item:last-child {
        margin-bottom: 0;
      }

      .content-item:last-child {
        margin-bottom: 0;
      }

      .item-title {
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-right: 10px
      }

      .item-time {
        width: 110px;
        font-size: 12px;
        flex-shrink: 0;
      }
    }

  }

  .InfomationPopover-content::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    background-color: #fff;
  }

  .InfomationPopover-bottom {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    margin-top: 12px;

    img {
      width: 5.28px;
      height: 9.46px;
    }

    .msg-more {
      color: @theme;
      margin-right: 5px;
    }
  }
}
</style>
