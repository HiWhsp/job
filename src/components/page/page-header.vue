<template>
    <div class="page-header">
        <div class="top-box">
            <div class="content flex flex-between">
                <div class="l-box flex">
                    <span class="name">富俊机械运动组件采购商城</span>
                    <div class="tools-btn flex" v-if="!userInfo.id">
                        <div class="login pointer" @click="goUrl({url: '/login'})">登录</div>
                        <div class="col"></div>
                        <div class="register pointer" @click="goUrl({url: '/register'})">注册</div>
                    </div>
                    <div class="tools-btn flex" v-else>
                        <div class="hello">{{ userInfo.realName }}</div>
                        <div class="register-btn pointer" @click="onunload">退出登录</div>
                    </div>
                </div>
                <div class="r-box flex pointer">
                    <div class="color-a6 flex">
                        <img src="../../static/home/phone.png" alt="dianhua" class="img-1">400-085-7709
                    </div>
                    <div class="col"></div>
                    <!--          <el-popover-->
                    <!--              placement="bottom"-->
                    <!--              width="650"-->
                    <!--              trigger="click"-->
                    <!--          >-->
                    <!--            <div class="InfomationPopover">-->
                    <!--              <div class="InfomationPopover-title">我的未读消息</div>-->
                    <!--              <div class="InfomationPopover-content">-->
                    <!--                <div class="content-item">-->
                    <!--                  <span class="ellipsis-1">您的报价单FAQP2405088242在报价有效期内未完成订购，报价已失效，点击查看</span>-->
                    <!--                  <span class="item-time">2024-06-07 15:39</span>-->
                    <!--                </div>-->
                    <!--              </div>-->
                    <!--              <div class="InfomationPopover-bottom"><span>可前往消息中心，</span>-->
                    <!--                <span class="msg-more pointer" @click="goUrl({url: '/message'})">查看更多</span>-->
                    <!--                <img src="../../static/home/right-back.png" alt="">-->
                    <!--              </div>-->
                    <!--            </div>-->
                    <!--            <div class="flex" slot="reference">-->
                    <!--              我的消息<span class="color-a6">({{ numList.message }})</span>-->
                    <!--              <img src="../../static/home/down.png" class="img-2">-->
                    <!--            </div>-->
                    <!--          </el-popover>-->
                    <div class="flex" slot="reference" @click="goUrl({url: '/message'})">
                        我的消息<span class="color-a6">({{ userInfo.msgNum }})</span>
                        <img src="../../static/home/down.png" class="img-2">
                    </div>
                    <div class="col"></div>
                    <div @click="goUrl({url: '/order-list'})">我的订单<span class="color-a6">({{
                        userInfo.orderNum
                        }})</span></div>
                    <div class="col"></div>
                    <div @click="goUrl({url: '/pointsMall'})">积分商城</div>
                    <div class="col"></div>
                    <div @click="goUrl({url: '/about'})">关于富俊</div>
                    <div class="col"></div>
                    <div @click="goUrl({url: '/help'})">帮助中心</div>
                </div>
            </div>
        </div>
        <div class="info-box">
            <div class="content flex flex-between">
                <div class="l-box">
                    <img src="../../static/home/logo.png" alt="logo" class="img-1 pointer" @click="goUrl({url: '/'})">
                    <span>运动组件采购商城</span>
                </div>
                <div class="m-box">
                    <div class="search flex">
                        <el-input v-model="searchInput" placeholder="可直接搜索同行型号 获取低成本替代"></el-input>
                        <el-button type="primary" icon="el-icon-search"
                                   @click="goUrl({url: `/productCategories?keyword=${searchInput}`})">搜索
                        </el-button>
                    </div>
                    <div class="search-hot">
                        <a class="hot pointer" v-for="(item, index) in searchHot" :key="index"
                           @click="goUrl({url: `/productCategories?keyword=${item.title}`})">{{ item.title }}</a>
                    </div>
                </div>
                <div class="r-box">
                    <div class="flex">
                        <div class="tools-btn pointer flex" @click="goUrl({url: '/cart'})">
                            <img class="img-2" src="../../static/home/gouwuche.png" alt="">购物车
                        </div>
                        <div class="tools-btn pointer flex">
                            <img class="img-3" src="../../static/home/wexin.png" alt="">微信公众号
                        </div>
                    </div>
                    <div class="hot">
                    </div>
                </div>
            </div>
        </div>
        <div class="nav-box">
            <div class="content flex">
                <div class="nav flex pointer" v-for="(item, index) in navList" :key="index" @click="goUrl(item)">
                    <img class="img-0" :src="item.icon" alt="" v-if="item.position == 'l'">
                    <span class="name">{{ item.title }}</span>
                    <img class="img-1" :src="item.icon" alt="" v-if="item.position == 'r'">
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
                    title: '全部商品分类', // 名称
                    icon: require('../../static/home/down_all.png'),
                    position: 'r',
                    url: '/productCategories',
                },
                {
                    title: '特惠商城', // 名称
                    icon: require('../../static/home/hot-shop.png'),
                    position: 'l',
                    url: '/discountShop'
                },
                {
                    title: '低价爆款专区', // 名称
                    icon: null,
                    position: null,
                    url: '/lowPriceShop'
                },
                {
                    title: '每月新款专区', // 名称
                    icon: require('../../static/home/hot-new.png'),
                    position: 'l',
                    url: '/newMonthShop'
                },
                {
                    title: '定制组件专区', // 名称
                    icon: null,
                    position: null,
                    url: '/customization'
                },
                {
                    title: 'DIY 组件专区', // 名称
                    icon: null,
                    position: null,
                    url: '/diy'
                },
                {
                    title: '非标定制', // 名称
                    icon: null,
                    position: null,
                    url: '/nonstandard'
                },
                {
                    title: '快速报价', // 名称
                    icon: null,
                    position: null,
                    url: '/fastQuotation'
                }],
            // 小标数据
            numList: {
                orderIndex: 0,
                integral: 0,
                message: 0,
                shop: 0
            },
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
    border-bottom: 4px solid @theme;;

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
