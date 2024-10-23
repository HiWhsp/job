<template>
    <div class="page-header" :style="{ background: pageHeaderBackground }">
        <div class="main">
            <div class="left">
                <img
                        :src="iconImgSrc"
                        alt="Logo"
                        @click="onRouteTo({ name: 'index' })"
                />
            </div>
            <div class="mid">
                <ul class="nav-list">
                    <li
                            v-for="(item, index) in navLists"
                            :key="index"
                            :class="['li', { active: activeIndex === index }]"
                            @click="onRouteTo({ name: item.path, index })"
                            @mouseenter="mouseenterChat(index)"
                            :style="{ color: color, '--active-color': color }"
                    >
                        {{ item.text }}
                    </li>
                    <img
                            src="../../assets/img/head/icon.png"
                            v-show="activeIndex === 0 && color !== '#fff'"
                            class="icon"
                            alt=""
                    />
                </ul>
            </div>
            <div class="right">
                <div class="img-wrap" @mousedown="showSearchBox = true">
                    <img :src="searchImgSrc" alt="search"/>
                    <transition name="fade">
                        <div
                                class="search-box"
                                v-show="showSearchBox"
                                @mouseleave="showSearchBox = false"
                        >
                            <div class="input-wrap">
                                <el-input v-model="input"></el-input>
                                <div class="icon-wrap" @click="goSearch(input)">
                                    <img
                                            src="../../assets/img/head/search-icon.png"
                                            alt="search-icon"
                                    />
                                </div>
                            </div>
                            <ul class="keyword-list">
                                <li
                                        v-for="(item, index) in keywordList"
                                        :key="index"
                                        class="keyword-li"
                                        @click="goSearch(item)"
                                >
                                    <span class="span">{{ item.title }}</span>
                                </li>
                            </ul>
                            <div class="arrow"></div>
                        </div>
                    </transition>
                </div>
                <div class="img-wrap" @click="onRouteTo({ name: 'productCart' })">
                    <img :src="cartImgSrc" alt="cart"/>
                </div>
                <div class="img-wrap" @mousedown="showUserMenu = true">
                    <img :src="personImgSrc" alt="user"/>
                    <transition name="fade">
                        <div
                                class="user-menu"
                                v-show="isLogin && showUserMenu"
                                @mouseleave="showUserMenu = false"
                        >
                            <div class="user-item" @click="onRouteTo({ name: 'my' })">
                                个人中心
                            </div>
                            <div class="user-item" @click="onRouteTo({ name: 'order-list' })">我的订单</div>
                            <div class="user-item" @click="onRouteTo({ name: 'couponCenter' })">领券中心</div>
                            <div class="user-item" @click="onRouteTo({ name: 'integralWinGoods' })">积分商城</div>
                            <div class="arrow"></div>
                        </div>
                    </transition>
                    <transition name="fade">
                        <div
                                v-show="!isLogin && showUserMenu"
                                class="user-menu"
                                @mouseleave="showUserMenu = false"
                        >
                            <div
                                    class="user-item"
                                    @click="onRouteTo({ name: 'login', query: 'login' })"
                            >
                                会员登录
                            </div>
                            <div
                                    class="user-item"
                                    @click="onRouteTo({ name: 'login', query: 'register' })"
                            >
                                会员注册
                            </div>
                        </div>
                    </transition>
                </div>
            </div>
            <transition name="fade">
                <div
                        class="chat-with-up-pop"
                        v-show="showChatWithUp"
                        @mouseleave="showChatWithUp = false"
                >
                    <div class="chat-list">
                        <div
                                class="chat-item"
                                :class="{ active: chatActiveIndex === index }"
                                v-for="(item, index) in chatList"
                                :key="index"
                                @click="onClickChatItem(item, index)"
                        >
                            <i class="el-icon-arrow-right"></i> {{ item.text }}
                        </div>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
    data() {
        return {
            activeIndex: -1,
            chatActiveIndex: -1,
            showSearchBox: false,
            showChatWithUp: false,
            input: "",
            showUserMenu: false,
            chatList: [],
        };
    },
    computed: {
        ...mapGetters([
            "pageHeaderBackground",
            "iconImgSrc",
            "color",
            "searchImgSrc",
            "cartImgSrc",
            "personImgSrc",
            "isLogin"
        ]),

        keywordList() {
            let reci = this.vuex_config.hotSearch || ''
            let reci_list = []
            if (reci) {
                reci_list = JSON.parse(reci)
            }
            return reci_list
        }
    },
    created() {
        this.navLists = [
            {
                path: "allCommodities",
                text: "全部商品",
            },
            {
                path: "laboratory",
                text: "光电实验室",
            },
            {
                path: "oneClickSelection",
                text: "一键选型",
            },
            {
                path: "service-support",
                text: "服务支持",
            },
            {
                path: "company",
                text: "联系我们",
            },
        ];
    },
    methods: {
        onRouteTo(params) {
            const {index, name, query} = params;
            this.activeIndex = index;
            this.$router.push({name, query: {to: query}});
        },
        mouseenterChat(index) {
            this.showChatWithUp = true;
            if (index === 4) {
                this.chatList = [
                    {
                        path: "company-profile",
                        text: "公司简介",
                    },
                    {
                        path: "company-news",
                        text: "公司新闻",
                    },
                    {
                        path: "exhibition-information",
                        text: "展会信息",
                    },
                    {
                        path: "contact-us",
                        text: "联系我们",
                    }
                ];
            } else if (index == 3) {
                this.chatList = [
                    {
                        path: "light-computing",
                        text: "光电计算",
                        icon: true
                    }, {
                        path: "laser-processing",
                        text: "激光加工",
                        icon: true
                    }, {
                        path: "download-materials",
                        text: "资料下载",
                        icon: true
                    }, {
                        path: "complaints-suggestions",
                        text: "投诉建议",
                        icon: true
                    }, {
                        path: "merchant-cooperation",
                        text: "商家合作",
                        icon: true
                    }, {
                        path: "member-benefits",
                        text: "会员权益",
                        icon: true
                    }, {
                        path: "technical-article",
                        text: "技术文章",
                        icon: true
                    }
                ];
            } else {
                this.showChatWithUp = false;
            }
        },
        onClickChatItem(item, index) {
            this.chatActiveIndex = index;
            console.log("/" + item.path)
            this.$router.push("/" + item.path);
        },

        goSearch(text) {
            this.$router.push({
                path: "/allCommodities",
                query: { keyword: text, hash: Math.random() },
            });
        }
    },
};
</script>

<style lang="less" scoped>
.page-header {
  position: relative;
  height: 114px;
  width: 100%;
  z-index: 10;

  .main {
    height: 100%;
    //padding: 0 260px 0;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;

    .left {
      width: 409px;
      cursor: pointer;

      img {
        width: 232px;
        height: 55px;
      }
    }

    .mid {
      height: 100%;
      flex: 1;
      font-size: 20px;

      .nav-list {
        position: relative;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .li {
          position: relative;
          cursor: pointer;
          font-weight: bold;
          padding-bottom: 11px;

          &.active::after {
            content: "";
            position: absolute;
            left: 0;
            top: 35px;
            width: 100%;
            height: 3px;
            background: var(--active-color);
          }

          &:hover::after {
            content: "";
            position: absolute;
            left: 0;
            top: 35px;
            width: 100%;
            height: 3px;
            background: var(--active-color);
          }
        }

        .icon {
          position: absolute;
          left: 91px;
          width: 10px;
          height: 7px;
        }
      }
    }

    .right {
      width: 296px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 27px;

      .img-wrap {
        position: relative;
        width: 18px;
        height: 20px;
        cursor: pointer;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .search-box {
        padding: 16px 15px 19px 23px;
        width: 508px;
        position: absolute;
        top: 36px;
        right: 0;
        background-color: #fff;
        border: 1px solid #ccc;
        border-radius: 4px;

        .input-wrap {
          position: relative;
          display: flex;

          ::v-deep .el-input__inner {
            padding-right: 20%;
          }

          .icon-wrap {
            position: absolute;
            right: 4px;
            top: 4px;
            width: 66px;
            height: 31px;
            display: flex;
            justify-content: center;
            align-items: center;
            background: #27417c;
            border-radius: 3px;

            img {
              width: 22px;
              height: 24px;
            }
          }
        }

        .keyword-list {
          display: flex;
          gap: 5px;
          font-size: 13px;
          color: #5e5e5e;
          cursor: default;

          .keyword-li {
            cursor: pointer;
            padding: 5px 0;

            .span {
              cursor: pointer;
            }
          }
        }

        .arrow {
          position: absolute;
          right: 6px;
          top: -10px;
          width: 0;
          height: 0;
          border: 5px solid transparent;
          border-bottom: 5px solid #fff;
        }
      }

      .user-menu {
        position: absolute;
        top: 36px;
        left: -58.5px;
        width: 117px;
        background: #fff;
        border: 1px solid #ccc;
        font-size: 14px;
        color: #5e5e5e;
        border-radius: 4px;

        .user-item {
          height: 41px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-bottom: 1px solid rgba(112, 112, 112, 0.2);
        }

        .arrow {
          position: absolute;
          left: 58.5px;
          right: 6px;
          top: -10px;
          width: 0;
          height: 0;
          border: 5px solid transparent;
          border-bottom: 5px solid #fff;
        }
      }
    }
  }
}

.chat-with-up-pop {
  position: absolute;
  top: 114px;
  left: 0;
  width: 100%;
  min-height: 152px;
  background: #fff;

  .chat-list {
    width: 1400px;
    margin: 48px auto 0 auto;
    flex-wrap: wrap;
    display: flex;
    font-size: 18px;
    color: #333333;
    line-height: 30px;

    .chat-item {
      cursor: pointer;
      width: 287px;
      font-size: 18px;
      margin-right: 84px;
      margin-bottom: 20px;
      padding-bottom: 18px;
      border-bottom: 1px solid #E8E8E8;

      i {
        color: #77797B;
      }

      &:nth-child(4n) {
        margin-right: 0;
      }

      &.active {
        color: #27417c;
        font-weight: bold;

        i {
          color: #27417c;
        }
      }

      &:hover {
        color: #27417c;
        font-weight: bold;

        i {
          color: #27417c;
        }
      }
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
