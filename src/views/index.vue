<template>
  <div class="page">
    <div class="page-ctx">
      <div class="inner">
        <div class="banner-box">
          <div class="lunbo-wrap">
            <!-- <div class="lunbo-box">
              <el-carousel trigger="click" :autoplay="true">
                <el-carousel-item v-for="(item, index) in vuex_index_banners" :key="index"
                  @click.native="do_banner_click(item)">
                  <img :src="item.image" alt="" />
                </el-carousel-item>
              </el-carousel>
            </div> -->
            <div class="lunbo-cont">
              <div class="lunbo-inner w-1400 flex-between" @mouseleave="on_mouseleave">
                <div class="lunbo-left">
                  <!-- 1 -->
                  <!-- <asideChannelNav v-if="1" /> -->
                  <!-- <asideChannelNav2 v-if="2" /> -->
                  <!-- <asideChannelNav3 v-if="3" /> -->
                  <!-- <asideChannelNav4 v-if="4" /> -->

                  <div class="cate-wrap">
                    <div class="cate-group-list">
                      <div class="cate-group" v-for="(group, group_index) in vuex_category_tree" :key="group_index"
                        @mouseover="on_mouseover(group, group_index)">
                        <div class="cate-v1" @click="to_cate_v1(group)">
                          <div class="cate-header">
                            <div class="main-title">{{ group.title }}</div>
                          </div>
                          <div class="cate-v2-wrap">
                            <div class="cate-v2-box">
                              <span class="v2-title" v-for="(v2, v2_index) in group.channels" :key="v2_index"
                                @click.stop="to_cate_v2(v2)">
                                {{ v2.title }}
                              </span>
                            </div>
                            <div class="v1-arrow">
                              <img src="@img/index/cate-arrow.png" alt="" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="lunbo-float" v-if="show_float">
                  <div class="float-cate-wrap">
                    <div class="cate-inner">
                      <div class="cate-v2-list">
                        <div class="v2-group">
                          <div class="menu-row">
                            <div class="first-level-title">
                              {{ vuex_category_tree[float_index]?.title }}
                            </div>
                            <div class="cate-v2-horizontal">
                              <span class="v2-title-horizontal" v-for="(v2, index) in float_category_list" :key="index"
                                @click="to_cate_v2(v2)">
                                {{ v2.title }}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- <div class="brand-wrap">
                      <div class="brand-title flex-center">
                        <img src="@img/index/brand.png" alt="" />
                        品牌推荐
                      </div>
                      <div class="brand-list">
                        <div
                          class="item"
                          v-for="(item, index) in brand_list"
                          :key="index"
                          @click="to_brand(item)"
                        >
                          <img :src="item.thumb" alt="" />
                        </div>
                      </div>
                    </div> -->
                  </div>
                </div>
                <!-- v-if="!show_float" -->
                <div class="lunbo-center">
                  <div class="lunbo-box">
                    <el-carousel trigger="click" :autoplay="true">
                      <el-carousel-item v-for="(item, index) in vuex_index_banners" :key="index"
                        @click.native="do_banner_click(item)">
                        <img :src="item.image" alt="" />
                      </el-carousel-item>
                    </el-carousel>
                  </div>
                </div>
                <div class="lunbo-right">
                  <div class="right">
                    <div class="user-box">
                      <div class="avatar-box" @click="$router.push('/my-info')">
                        <template v-if="!vuex_is_login">
                          <img :src="vuex_avatar_default" />
                        </template>
                        <template v-else>
                          <img :src="vuex_user.image || vuex_avatar_default" />
                        </template>
                      </div>
                      <div class="tip-box">
                        <template v-if="!vuex_is_login">Hi 欢迎来到医买买
                          <!-- {{vuex_config.comTitle}} -->
                        </template>
                        <template v-else>
                          <p>Hi，{{ vuex_user.nickname }}</p>
                          <p>欢迎来到医买买</p>
                        </template>
                      </div>
                      <template v-if="!vuex_is_login">
                        <div class="login-box flex-center">
                          <div class="btn btn-ripple flex-center" @click="$router.push('/login')">
                            登录
                          </div>
                        </div>
                        <div class="reg-box flex-center">
                          <div class="btn btn-ripple flex-center" @click="$router.push('/register')">
                            注册
                          </div>
                        </div>
                      </template>
                      <template v-else>
                        <div class="reg-box flex-center">
                          <div class="btn btn-ripple flex-center" @click="do_logout()">
                            退出
                          </div>
                        </div>
                      </template>
                      <!-- <div class="operate-box">
                        <el-button @click="$router.push('login')" v-if="!vuex_is_login" class="denglu">登录</el-button>
                        <el-button @click="$router.push('register')" v-if="!vuex_is_login" class="zhuce">注册</el-button>
                        <el-button @click="do_logout()" v-else class="denglu">退出</el-button>
                      </div> -->
                    </div>
                    <!-- <div class="tequan-list flex">
                      <div
                        class="tequan-item"
                        v-for="(item, index) in nav_list"
                        :key="index"
                        @click="$router.push(item.route)"
                      >
                        <div class="img-box">
                          <img class="icon" :src="item.icon" alt="" />
                          <img class="icon1" :src="item.icon1" alt="" />
                        </div>
                        <div class="tequan-title">
                          {{ item.title }}
                        </div>
                      </div>
                    </div> -->
                    <div class="news-box">
                      <div class="main-title flex-between">
                        <div class="text">更多服务</div>
                        <!-- <router-link to="/news">更多 ></router-link> -->
                      </div>
                      <div class="news-list">
                        <!-- 使用顶部导航的前三项数据 -->
                        <div class="news-item hover-color flex-center" v-for="(item, index) in topNavItems" :key="index"
                          @click="navigateToItem(item, true)">
                          <img :src="item.thumb" class="ico" />
                          {{ item.title }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="hot-sec flex">
                  <div class="title-box title-boxs">
                    <div class="title-left column-flex-center" @click="hotPanelMinus()">
                      <div class="sec-title color-0">限时秒杀</div>
                      <div class="sec-desc flex-center">
                        立即抢购 <img src="@img/index/right.png" alt="" />
                      </div>
                      <div class="countdown-text">本场距结束还剩</div>
                      <div class="countdown-timer">
                        <div class="time-box">
                          <div class="time-value">{{ countdown.hours }}</div>
                          <div class="time-label">时</div>
                        </div>
                        <div class="time-box">
                          <div class="time-value">{{ countdown.minutes }}</div>
                          <div class="time-label">分</div>
                        </div>
                        <div class="time-box">
                          <div class="time-value">{{ countdown.seconds }}</div>
                          <div class="time-label">秒</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="sec-ctx">
                    <div class="hot-lunbo">
                      <el-carousel ref="hotLunbo" trigger="click" :autoplay="true" :interval="6000">
                        <el-carousel-item v-for="(group, gindex) in jingpin_group" :key="gindex">
                          <div class="product-list">
                            <div class="product-item hover" v-for="(item, index) in group" :key="index"
                              @click="to_product(item)">
                              <div class="poster-box scale-box">
                                <img class="scale-img" :src="item.thumb" alt="" />
                              </div>
                              <div class="info-box">
                                <div class="title-box">
                                  <div class="title ellipsis-1">
                                    {{ item.title }}
                                  </div>
                                </div>
                                <div class="price flex-between">
                                  <div class="flex-center">
                                    <div class="huobi">￥</div>
                                    <div class="price-value">
                                      {{ item.priceUser }}
                                    </div>
                                  </div>

                                  <div class="unit">￥{{ item.priceSale }}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </el-carousel-item>
                      </el-carousel>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="content-box w-1400">
          <div class="group-panel">
            <div class="sec-cate" v-for="(group, gindex) in cateGroup" :key="gindex">
              <div class="sec-title-box">
                <div class="title-left flex">
                  <div class="sec-line">
                    <img src="@img/index/area.png" alt="" />
                  </div>
                  <div class="sec-title">{{ group.title }}</div>
                </div>
                <div class="sec-more">
                  <div class="text">为您推荐</div>
                  <div class="flex-center">
                    <span v-for="(menu, idx) in getSubMenus(group.id).slice(0, 5)" :key="idx"
                      @click="onSubMenuClick(menu, group.id)" class="sub-menu-item">{{ menu.title || menu.name }}</span>
                  </div>
                  <!-- <img class="arrow" src="@img/index/cate-more.png" alt="" /> -->
                </div>
              </div>

              <div class="cate-ctx w-1400">
                <div class="cate-left">
                  <el-carousel class="bg-box" ref="hotLunbo" arrow="never" :autoplay="true" :interval="6000" loop
                    indicator-position="none">
                    <el-carousel-item class="bg-box" v-for="(item, index) in group.images" :key="index">
                      <div class="product-lunbo bg-box">
                        <img :src="item" alt="" />
                      </div>
                    </el-carousel-item>
                  </el-carousel>
                  <!-- <div class="fix-cate">
                  <div class="cate-list">
                    <div
                      class="cate-item flex"
                      v-for="(item, gindex) in cateGroup.slice(0, 10)"
                      :key="gindex"
                      :data-id="item.id"
                      @click="do_toggle_cate(item)"
                      :class="{ active: cate_select.id == item.id }"
                    >
                      {{ item.title }}
                    </div>
                  </div>
                </div> -->
                </div>
                <div class="cate-right">
                  <div class="cate-product-wrap">
                    <div class="product-list">
                      <div class="product-item hover" v-for="(item, index) in group.products" :key="index"
                        @click="to_product(item)">
                        <div class="poster-box scale-box">
                          <img class="scale-img" :src="item.thumb" alt="" />
                        </div>
                        <div class="info-box">
                          <div class="title-box">
                            <div class="title">
                              {{ item.title }}
                            </div>
                          </div>
                          <div class="flex-between">
                            <div>
                              <div class="price">
                                <div class="pirce-num">
                                  ￥{{ item.priceSale }}
                                </div>
                              </div>
                              <div class="market-price">
                                {{ item.priceMarket }}
                              </div>
                            </div>
                            <div class="flex-center">
                              <div class="btn" @click.stop="openQuickBuy(item)">
                                <img src="@img/index/order.png" />
                              </div>
                              <div class="btn" @click.stop="openQuickBuy(item)">
                                <img src="@img/index/cart.png" />
                              </div>
                            </div>
                          </div>
                        </div>
                        <el-tooltip class="item" effect="dark" content="仅限企业用户购买" placement="top">
                          <el-tag class="tag-dom" type="warning" effect="dark" v-if="item.isThird == 1">三类</el-tag>
                        </el-tooltip>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <img class="cate-banner" :src="vuex_map_banners['优惠券广告'][0].image" alt=""
                @click="$router.push(vuex_map_banners['优惠券广告'][0].url)" v-if="gindex == 1" />

              <img class="cate-banner" :src="vuex_map_banners['首页推荐'][0].image" alt=""
                @click="$router.push(vuex_map_banners['首页推荐'][0].url)" v-if="gindex == cateGroup.length - 1" />
            </div>
          </div>

          <div class="suggest-box">
            <div class="suggest-title flex-center">
              <!-- <img src="@img/index/suggest-left.png" alt="" /> -->
              <span class="block">推荐<span style="color: #7853b2">产品</span></span>
              <!-- <img src="@img/index/suggest-right.png" alt="" /> -->
            </div>

            <!-- <div class="suggest-tabs">
              <div class="tab-list flex-center">
                <div
                  class="tab-item"
                  v-for="(item, index) in tab_list"
                  :key="index"
                  @click="do_toggle_tab(item)"
                  :class="{ active: tab_select.value == item.value }"
                >
                  {{ item.title }}
                </div>
              </div>
            </div> -->

            <div class="suggest-list">
              <div class="product-list">
                <div class="product-item hover" v-for="(item, index) in suggest_products" :key="index"
                  @click="to_product(item)">
                  <div class="poster-box scale-box">
                    <img class="scale-img" :src="item.thumb" alt="" />
                  </div>
                  <div class="info-box">
                    <div class="title-box">
                      <div class="title ellipsis-1">
                        {{ item.title }}
                      </div>
                    </div>
                    <!-- <div class="price flex">
                      <div class="pirce-num">￥ {{ item.priceSale }}</div>
                    </div> -->
                    <div class="flex-between">
                      <div>
                        <div class="price">
                          <div class="pirce-num">￥{{ item.priceSale }}</div>
                        </div>
                        <div class="market-price">
                          {{ item.priceMarket }}
                        </div>
                      </div>
                      <div class="flex-center">
                        <div class="btn" @click.stop="openQuickBuy(item)">
                          <img src="@img/index/order.png" />
                        </div>
                        <div class="btn" @click.stop="openQuickBuy(item)">
                          <img src="@img/index/cart.png" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="suggest-box">
            <div class="suggest-title flex-center">
              <span class="block">热门<span style="color: #7853b2">品牌</span></span>
            </div>

            <div class="suggest-list flex-center" style="align-items: flex-start; background-color: #fff">
              <div class="brand-left column-flex-center">
                <p class="num">500+</p>
                <p class="tip">品牌成功入驻</p>
              </div>
              <div class="brand-wrap">
                <div class="brand-list">
                  <div class="brand-item flex-center" v-for="(item, index) in brand_list" :key="index">
                    <div class="img-cov scale-box">
                      <img class="scale-img" :src="item.thumb" alt="" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="back-box" v-if="showButton">
          <router-link to="/cart" class="link bg">
            <div class="btn-box">
              <img src="@img/backtop/cart-back.png" alt="" />
              <span class="cart-num fit-text">{{ vuex_cart_number }}</span>
            </div>
          </router-link>
          <div class="btn-box">
            <img src="@img/backtop/back.png" @click="scrollToTop" />
          </div>
        </div> -->
      </div>
    </div>

    <!-- 企业用户认证弹窗 -->
    <EnterpriseUserModal :visible="showEnterpriseModal" @close="closeEnterpriseModal"
      @confirm="confirmEnterpriseModal" />
    <!-- 快速购买弹窗 -->
    <product_quick_buy_modal ref="product_quick_buy_modal" />

    <product_renzheng_tip ref="product_renzheng_tip" />

  </div>
</template>
<script>
//import { Swiper, SwiperOptions, Pagination, Navigation } from "swiper";
//import "swiper/swiper-bundle.min.css";

import productList from "@/components/product/productList.vue";
import product_quick_buy_modal from "@/components/product/product_quick_buy_modal.vue";
import EnterpriseUserModal from "@/components/modals/enterpriseUserModal.vue";
import { mapState } from "vuex";
import product_renzheng_tip from "@/components/product/product_renzheng_tip.vue";


export default {
  name: "index",
  components: {
    productList,
    EnterpriseUserModal,
    product_quick_buy_modal,
    product_renzheng_tip,

  },
  data() {
    return {
      showButton: false,
      show_float: false,
      float_index: "",
      brand_list: [],
      showEnterpriseModal: false, // 企业用户认证弹窗显示状态

      nav_list: [
        {
          title: "产品注册认证服务",
          icon: require("@img/index/nav1.png"),
          // icon1: require("@img/index/nav1-1.png"),
          route: "/my-info",
        },
        {
          title: "消毒灭菌服务",
          icon: require("@img/index/nav2.png"),
          // icon1: require("@img/index/nav2-1.png"),
          route: "/order-list",
        },
        {
          title: "医院诊所建设服务",
          icon: require("@img/index/nav3.png"),
          // icon1: require("@img/index/nav3-1.png"),
          route: "/batch-xiadan",
        },
      ],
      news_list: [],
      jingpin_group: [],
      jingpin_list: [],
      cateGroup: [],
      cate_select: {},

      tab_select: {
        value: "1",
        title: "推荐商品",
      },
      tab_list: [
        { value: "1", title: "推荐商品" },
        { value: "2", title: "推荐商品" },
        { value: "3", title: "推荐商品" },
        { value: "4", title: "推荐商品" },
        { value: "5", title: "推荐商品" },
      ],

      product_list_1: [],
      product_list_2: [],

      // star_value: 4,
      reviews_group: [],

      suggest_products: [],
      //
      countdown: {
        hours: "00",
        minutes: "00",
        seconds: "00",
      },
      endTime: null,
      countdownInterval: null,
      subMenus: {}, // 存储每个分类的二级菜单数据
      subMenuProducts: {}, // 存储每个二级菜单的产品数据
    };
  },
  computed: {
    ...mapState([
      //
      "vuex_index_banners",
      "index_full_ani",
      "hotSearchWords",
      "vuex_map_banners",
      "vuex_is_login",
      "vuex_user",
      "vuex_news_cates",
      "vuex_config",
    ]),

    float_category_list() {
      let tree = [];
      if (this.float_index === "") {
      } else {
        tree = this.vuex_category_tree[this.float_index].channels || [];
      }
      return tree;
    },

    // 获取顶部导航的前三项数据（首页后的三条数据）
    topNavItems() {
      // 从配置中获取动态导航数据
      let pageNavList = [];
      // 获取首页后的三条数据
      if (this.vuex_news_cates) {
        pageNavList = this.vuex_news_cates.slice(0, 3) || [];
      }

      return pageNavList;
    },
  },

  watch: {
    // 监听 vuex_news_cates 数据变动
    vuex_news_cates: {
      handler(newVal, oldVal) {
        // 当 vuex_news_cates 数据变动时，计算属性会自动重新计算
        console.log("vuex_news_cates 数据已更新:", newVal);
      },
      deep: true,
      immediate: false,
    },
  },
  created() {
    this.setView();
    this.$store.dispatch("appInit")
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
    this.checkEnterpriseUserStatus();
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll);
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  },
  methods: {
    openQuickBuy(item) {
      console.log('this.vuex_user.userType',this.vuex_user.userType)
      if (item.isThird == 1) {
        if (this.vuex_user.userType != 1) {
          this.$refs.product_renzheng_tip.init();
          return
        } else if (this.vuex_user.userType == 1) {
          if (this.vuex_user.license2 || this.vuex_user.license3 || this.vuex_user.license4 | this.vuex_user.license6) {
            console.log('可以购买三类')
          } else {
            this.$refs.product_renzheng_tip.init();
            return
          }
        }
      }






      const inventoryId = item.inventoryId || item.id;
      if (inventoryId && this.$refs.product_quick_buy_modal) {
        this.$refs.product_quick_buy_modal.init(inventoryId);
      }
    },
    handleScroll() {
      this.showButton = window.scrollY > 200;
    },

    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
    setView() {
      this.query_brand();
      // this.query_news();
      //
      this.query_jingpin();

      //
      this.query_cates_add_products();
      this.query_product_suggest();
    },
    query_brand() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "product_brandList",
          //  isHot:1
        },
      }).then((res) => {
        if (res.code == 200) {
          console.log(res.data, "dddd");
          this.brand_list = res.data;
        }
      });
    },
    query_news() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "news_lists",
          channelId: "",
          page: 1,
          pageNum: 5,
        },
      }).then((res) => {
        if (res.code == 200) {
          this.news_list = res.data.list;
        }
      });
    },
    query_jingpin() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "product_plist",
          // ifShowSku: 1,
          // channelId: 792,
          // tags: "精选推荐",
          ifSeckill: 1,
          page: 1,
          pageNum: 16,
        },
      }).then((res) => {
        if (res.code == 200) {
          let list = res.data.list;
          this.jingpin_products = res.data.list;

          // 获取倒计时数据
          if (res.data.timeList && res.data.timeList.length > 0) {
            const activeTime = res.data.timeList.find(
              (item) => item.ifStart === 1
            );
            if (activeTime && activeTime.endTime) {
              this.endTime = new Date(activeTime.endTime);
              this.startCountdown();
            }
          }

          let jingpin_group = [];
          let items_length = 6; //4个一组
          list.forEach((v, i) => {
            let group_index = Math.floor(i / items_length);
            if (!jingpin_group[group_index]) {
              jingpin_group[group_index] = [];
            }
            jingpin_group[group_index].push(v);
          });
          this.jingpin_group = jingpin_group;
        }
      });
    },

    query_haowu() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "product_plist",
          // ifShowSku: 1,
          // channelId: 792,
          page: 1,
          pageNum: 5,
        },
      }).then((res) => {
        if (res.code == 200) {
          let list = res.data.list;
          this.haowu_product_list = list;
        }
      });
    },

    query_cates_add_products() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "product_channelPdts",
          channelNum: 20,
          pdtNum: 10,
          isHot: 1,
        },
      }).then((res) => {
        console.warn("首页分类产品", res);

        this.cateGroup = res.data.map((its) => {
          return {
            ...its,
            images: its.images.split(",") || [],
          };
        });
        this.cate_select = this.cateGroup[0];

        // 为每个分类请求二级菜单数据
        this.cateGroup.forEach((group) => {
          this.querySubMenus(group.id);
        });
      });
    },

    query_product_suggest() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "product_plist",
          // ifShowSku: 1,
          // channelId: 792,
          page: 1,
          pageNum: 10,
        },
      }).then((res) => {
        if (res.code == 200) {
          this.suggest_products = res.data.list;
        }
      });
    },

    to_product(item) {
      window.open('/product-detail?id='+item.inventoryId, '_blank','',false)
      // this.mix_toRoute({
      //   path: "/product-detail",
      //   query: {
      //     id: item.inventoryId,
      //   },
      // });
    },
    to_news(item) {
      this.mix_toRoute({
        path: "/news-detail",
        query: {
          id: item.id,
        },
      });
    },

    do_banner_click(item) {
      //console.log({ ...item });
      if (item.url) {
        window.open(item.url, "_blank");
      } else if (item.inventoryId) {
        // this.$router.push(
        //   "/product-detail?id=" + (item.skuId || item.inventoryId)
        // );
      window.open('/product-detail?id='+(item.skuId || item.inventoryId),'__blank','',false)

      }
    },

    do_toggle_cate(item) {
      this.cate_select = item;
    },
    to_cate_group(item) {
      this.$router.push({
        path: "/product-cates",
        query: {
          ids: item.id,
        },
      });
    },
    to_cate_v1(v1) {
      console.log("页面跳转", v1);
      this.$router.push(v1.route);
    },
    to_cate_v2(v2) {
      this.$router.push(v2.route);
    },
    to_cate_v3(v3) {
      this.$router.push(v3.route);
    },
    to_brand(item) {
      // this.$router.push();
    },

    do_swiper_prev() {
      this.$refs.swiper_review.prev();
    },
    do_swiper_next() {
      this.$refs.swiper_review.next();
    },
    do_toggle_tab(item) {
      this.tab_select = item;
    },
    do_logout() {
      this.$store.commit("remove_vuex_user");
      alertSucc("退出成功");
    },

    on_mouseover(group, group_index) {
      console.log("当前分类", { ...group }, group_index);
      this.float_index = group_index;
      this.show_float = true;
      //获取配置信息
      //判断当前模板是否需要鼠标悬浮显示下拉导航
      // if (this.$route.name != "index") {
      //   this.show_float = true;
      // } else {
      //   this.show_float = false;
      // }
    },
    on_mouseleave() {
      this.show_float = false;
    },

    startCountdown() {
      if (this.endTime) {
        this.updateCountdown();
        this.countdownInterval = setInterval(this.updateCountdown, 1000);
      }
    },

    updateCountdown() {
      if (!this.endTime) return;

      const now = new Date();
      const diff = this.endTime - now;

      if (diff <= 0) {
        this.countdown = {
          hours: "00",
          minutes: "00",
          seconds: "00",
        };
        if (this.countdownInterval) {
          clearInterval(this.countdownInterval);
        }
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      this.countdown = {
        hours: hours.toString().padStart(2, "0"),
        minutes: minutes.toString().padStart(2, "0"),
        seconds: seconds.toString().padStart(2, "0"),
      };
    },

    hotPanelMinus() {
      // 这里可以添加跳转到秒杀页面的逻辑
      console.log("跳转到秒杀页面");
    },

    // 检查企业用户状态
    checkEnterpriseUserStatus() {
      // 如果已登录且用户类型为2（企业用户），显示弹窗

      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "users_userInfo",
        },
      }).then((res) => {
        if (res.code == 200) {
          let { userType, renzheng } = res.data;
          if (renzheng == 0 && (userType == 1 || userType == 2)) {
            //renzheng为0，且用户类型为1或2时，显示弹窗
            this.showEnterpriseModal = true;
          }
        }
      });
    },

    // 关闭企业用户认证弹窗
    closeEnterpriseModal() {
      this.showEnterpriseModal = false;
    },

    // 确认企业用户认证弹窗
    confirmEnterpriseModal() {
      // 可以在这里添加跳转到会员中心的逻辑
      this.$router.push(
        this.vuex_user.userType == 2 ? "/part-time-sales" : "/enterprise-cert"
      );
    },

    // 导航项点击跳转
    navigateToItem(item, hasid = false) {
      console.log(111, item);
      if (item.route) {
        if (item.route.includes("http")) {
          window.open(item.route, "_blank");
        } else {
          // 如果是内容资讯，跳转到 news?id=对应id 格式
          if (hasid && item.id) {
            this.$router.push(`/news?id=${item.id}`);
          } else {
            this.$router.push(item.route);
          }
        }
      }
    },

    // 获取二级菜单数据
    getSubMenus(parentId) {
      return this.subMenus[parentId] || [];
    },

    // 二级菜单点击事件
    onSubMenuClick(menu, parentId) {
      console.log("点击二级菜单:", menu, "父级ID:", parentId);
      this.querySubMenuProducts(menu.id, parentId);
    },

    // 请求二级菜单数据
    querySubMenus(parentId) {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "product_channel",
          parentId: parentId,
        },
      })
        .then((res) => {
          if (res.code == 200) {
            this.$set(this.subMenus, parentId, res.data || []);
            console.log(`获取分类 ${parentId} 的二级菜单:`, res.data);
          }
        })
        .catch((error) => {
          console.error(`获取分类 ${parentId} 的二级菜单失败:`, error);
        });
    },

    // 请求二级菜单的产品数据
    querySubMenuProducts(menuId, parentId) {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "product_plist",
          channelId: menuId,
          page: 1,
          pageNum: 10,
          ifShowSku: 0,
          isRecommend: 1,
        },
      })
        .then((res) => {
          if (res.code == 200) {
            this.$set(this.subMenuProducts, menuId, res.data || []);
            console.log(`获取菜单 ${menuId} 的产品数据:`, res.data);
            // 这里可以添加跳转到产品列表页面的逻辑
            this.$router.push({
              path: "/product-cates",
              query: {
                ids: menuId,
              },
            });
          }
        })
        .catch((error) => {
          console.error(`获取菜单 ${menuId} 的产品数据失败:`, error);
        });
    },
  },
};
</script>

<style lang="less">
.el-select-dropdown__item.hover,
.el-select-dropdown__item:hover {
  background: #5b339a;
  color: #fff !important;
}

.el-select-dropdown__item.selected {
  color: #5b339a;
}
</style>

<style scoped lang="less">
.page {
  padding-top: 15px;
  padding-bottom: 95px;
  background: #f5f7fa;

  .inner {
    padding-top: 0;
    margin: 0 auto;
    position: relative;
  }
}

/deep/.el-carousel__arrow {
  width: 25px;
  height: 50px;
  background: #000000;
  opacity: 0.4;
}

/deep/.el-carousel__arrow--left {
  border-radius: 0px 3px 3px 0px;
  left: 0;
}

/deep/.el-carousel__arrow--right {
  border-radius: 3px 0px 0px 3px;
  right: 0;
}

/deep/ .el-rate__icon {
  font-size: 20px;
  margin-right: 0;
}

.banner-box {
  position: relative;
}

.banner-box .lunbo-box {
  position: relative;
  width: 100%;
  height: 546px;

  /deep/ .el-carousel__container {
    height: 546px;
  }

  /deep/ img {
    width: 100%;
    height: 546px;
    cursor: pointer;
  }
}

.lunbo-cont {
  // position: absolute;
  // z-index: 2;
  // left: 0;
  // top: 0;
  // right: 0;
  // bottom: 0;

  .lunbo-inner {
    position: relative;
    align-items: flex-start;

    .lunbo-left {}

    .lunbo-center {
      flex: 1;
      height: 544px;
      margin: 0 10px;
      background: #fff;
    }
  }
}

.lunbo-left {
  position: relative;
  width: 334px;
  height: 863px;
  background: #ffffff;
  overflow-y: auto;
  border-radius: 4px 4px 4px 4px;

  &::-webkit-scrollbar-thumb {
    border-radius: 3px;
    border: 5px solid #e0e0e0;
    background: #c0c0c0;
  }

  &::-webkit-scrollbar {
    width: 5px;
    height: 0px;
  }
}

.cate-wrap {
  background: #ffffff;
  border-radius: 4px;

  .cate-group-list {
    .cate-group {
      padding: 5px 24px 5px 29px;
      transition: all 0.3s ease;
      position: relative;
      cursor: pointer;

      &+.cate-group {
        // border-top: 1px solid #f0f0f0;
      }

      &:hover {
        background-color: #f8f9fa;

        .cate-header {
          .main-title {
            color: #7853b2;
          }
        }

        .v1-arrow {
          transform: translateX(3px);
          opacity: 1;
        }

        .cate-v2-wrap {
          .v2-title {
            color: #7853b2;
          }
        }
      }

      .cate-v1 {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        width: 100%;

        .cate-header {
          display: flex;
          align-items: center;
          margin-bottom: 0;
          flex-shrink: 0;
          min-width: 0;

          .main-title {
            font-family: Microsoft YaHei, Microsoft YaHei;
            font-weight: 600;
            font-size: 16px;
            color: #1F1F1F;
            line-height: 1.4;
            position: relative;
            padding-left: 0;
            flex-shrink: 0;
            // max-width: 100px;
            // overflow: hidden;
            // text-overflow: ellipsis;
            white-space: nowrap;

            &::before {
              content: "";
              position: absolute;
              left: 0;
              top: 50%;
              transform: translateY(-50%);
              width: 4px;
              height: 4px;
              background-color: #5b339a;
              border-radius: 50%;
              opacity: 0;
              transition: opacity 0.3s ease;
            }
          }
        }
      }

      &:hover .cate-header .main-title::before {
        opacity: 1;
      }

      .cate-v2-wrap {
        margin-top: 0;
        padding-left: 0;
        flex: 1;
        margin-left: 15px;
        overflow: hidden;
        min-width: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .cate-v2-box {
        display: flex;
        flex-wrap: nowrap;
        gap: 6px;
        overflow: hidden;
        flex: 1;
        min-width: 0;

        .v2-title {
          cursor: pointer;
          padding: 4px 8px;
          background-color: transparent;
          border-radius: 0;
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: 400;
          font-size: 14px;
          color: #1F1F1F;
          line-height: 1.3;
          transition: all 0.3s ease;
          border: none;
          white-space: nowrap;
          flex-shrink: 0;
          max-width: 100px;
          overflow: hidden;
          text-overflow: ellipsis;

          &:hover {
            color: #5b339a;
            background-color: transparent;
            border-color: transparent;
            transform: none;
            box-shadow: none;
          }
        }
      }

      .v1-arrow {
        width: 18px;
        height: 18px;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0.7;
        flex-shrink: 0;
        margin-left: 8px;

        img {
          width: 6px;
          height: 10px;
        }
      }
    }
  }
}

.lunbo-float {
  position: absolute;
  z-index: 10;
  left: 334px;
  top: 0;
  right: 300px;
  background: #fff;
  max-height: 546px;
}

.float-cate-wrap {
  display: flex;

  .cate-inner {
    flex: 1;
    padding: 10px 0 20px 0;
    max-height: 530px;
    overflow-y: auto;

    &::-webkit-scrollbar-thumb {
      border-radius: 3px;
      border: 5px solid #bbb;
      background: #fff;
    }

    &::-webkit-scrollbar {
      width: 5px;
      height: 0px;
    }
  }

  // ::-webkit-scrollbar {
  //   width: 0 !important;
  // }

  // ::-webkit-scrollbar {
  //   width: 0 !important;
  //   height: 0;
  // }
  .cate-v2-list {
    max-height: 530px;
    overflow: auto;
    padding: 20px 40px 20px 32px;

    .v2-group {
      .menu-row {
        display: flex;
        align-items: center;
        gap: 20px;
        flex-wrap: wrap;

        .first-level-title {
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: bold;
          font-size: 18px;
          color: #5b339a;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .cate-v2-horizontal {
          display: flex;
          flex-wrap: wrap;
          gap: 15px 20px;
          flex: 1;

          .v2-title-horizontal {
            cursor: pointer;
            font-family: Microsoft YaHei, Microsoft YaHei;
            font-weight: normal;
            font-size: 14px;
            color: #1F1F1F;
            padding: 6px 12px;
            transition: all 0.3s ease;
            white-space: nowrap;

            &:hover {
              color: #5b339a;
            }
          }
        }
      }
    }
  }

  .brand-wrap {
    width: 300px;
    padding-left: 14px;
    padding-right: 19px;

    .brand-title {
      padding: 16px 0;
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: bold;
      font-size: 18px;
      color: #5b339a;

      img {
        margin-right: 4px;
        width: 18.44px;
      }
    }

    .brand-list {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;

      .item {
        margin-bottom: 10px;
        cursor: pointer;
        width: 127px;
        height: 54px;
        background: #ffffff;
        border-radius: 8px 8px 8px 8px;
        border: 1px solid #f3f3f3;
        overflow: hidden;

        img {
          width: 127px;
          height: 54px;
          object-fit: contain;
        }
      }
    }
  }
}

.lunbo-right {
  width: 302px;
  overflow: hidden;

  .right {
    width: 302px;
    // padding: 28px 24px;

    .user-box {
      border-radius: 4px 4px 4px 4px;
      background: #fff;
      padding-bottom: 33px;
      text-align: center;
      padding-top: 28px;

      .avatar-box {
        cursor: pointer;
        display: inline-block;
        width: 62px;
        height: 62px;
        border-radius: 50%;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .tip-box {
        color: #333;
        font-size: 14px;
        margin-top: 10px;
      }

      .login-box {
        margin-top: 20px;

        .btn {
          width: 210px;
          height: 40px;
          background: #7853b2;
          border-radius: 4px 4px 4px 4px;
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: 400;
          font-size: 16px;
          color: #ffffff;
        }
      }

      .reg-box {
        margin-top: 10px;

        .btn {
          width: 210px;
          height: 40px;
          background: #ffffff;
          border-radius: 4px 4px 4px 4px;
          border: 1px solid #7853b2;
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: 400;
          font-size: 16px;
          color: #7853b2;
        }
      }

      .operate-box {
        margin-top: 15px;

        button {
          font-size: 12px;
          padding: 0;
          min-width: 57px;
          height: 25px;
          line-height: 25px;
          background: #f00;
          opacity: 1;
          border-radius: 4px;
          border: none;

          &.denglu {
            background: #f00;
            color: #fff;
          }

          &.zhuce {
            background: #fff;
            color: #f00;
          }
        }
      }
    }

    .news-box {
      border-radius: 4px 4px 4px 4px;
      background: #fff;
      padding: 14px 24px;
      margin-top: 10px;
      text-align: left;

      .main-title {
        margin-bottom: 31px;
        font-size: 16px;
        font-family: MicrosoftYaHei;

        padding-bottom: 14px;
        border-bottom: 1px solid #e8e8e8;

        .text {
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: bold;
          font-size: 18px;
          color: #7853b2;
        }

        a {
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: 400;
          font-size: 14px;
          color: #5e5e5e;
        }
      }

      .news-list {
        .news-item {
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: bold;
          font-size: 18px;
          color: #1F1F1F;
          margin-bottom: 25px;
          justify-content: flex-start;
          cursor: pointer;

          .ico {
            width: 30px;
            height: 33px;
            max-height: 33px;
            object-fit: contain;
            margin-right: 20px;
          }

          &:last-child {
            margin-bottom: 0;
            padding-bottom: 16px;
          }
        }
      }
    }

    .tequan-wrap-title {
      padding-left: 18px;
      padding-bottom: 10px;
      text-align: left;
      font-size: 14px;
      color: #333333;
    }

    .tequan-list {
      margin-top: 24px;
      flex-wrap: wrap;
      padding: 0 6px;

      .tequan-item {
        width: 33.33%;
        margin-top: 15px;
        text-align: center;
        cursor: pointer;

        &:nth-child(-n + 3) {
          margin-top: 0;
        }

        &:hover {
          .img-box {
            img {
              &.icon {
                display: none;
              }

              &.icon1 {
                display: inline-block;
              }
            }
          }
        }

        .img-box {
          img {
            width: 34px;
            height: 34px;

            &.icon1 {
              display: none;
            }
          }
        }

        .tequan-title {
          margin-top: 10px;
          font-size: 12px;
          color: #1F1F1F;
        }
      }
    }

    .showMore {
      text-align: right;
      margin-right: 20px;
      margin-top: 15px;

      a {
        font-size: 13px;
        font-family: MicrosoftYaHei;
        line-height: 30px;
        color: #333;

        &:hover {
          color: #f00;
        }
      }
    }
  }
}

.group-panel {
  margin-top: 50px;
}

//
.content-box {
  margin: 0 auto;
  padding-top: 10px;

  .sec-cate {
    margin-bottom: 60px;

    .sec-title-box {
      margin-bottom: 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .title-left {
        display: flex;

        .sec-line {
          img {
            width: 24px;
            margin-right: 12px;
          }
        }

        .sec-title {
          font-size: 24px;
          color: #1F1F1F;
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: bold;
        }

        .sec-divider {
          margin: 0 15px;
          font-size: 14px;
          font-family: PingFang SC, PingFang SC;
          font-weight: 500;
          color: #505050;
        }

        .sec-desc {
          font-size: 14px;
          font-family: PingFang SC, PingFang SC;
          font-weight: 500;
          color: #505050;
        }
      }

      .sec-more {
        display: flex;
        align-items: center;
        cursor: pointer;

        .text {
          font-family: MicrosoftYaHei, MicrosoftYaHei;
          font-weight: normal;
          font-size: 16px;
          font-weight: bold;
          color: #1F1F1F;
          margin-right: 20px;
        }

        .arrow {
          margin-left: 10px;
          width: 17px;
          height: 17px;
        }

        span {
          padding: 0 10px;

          &:hover {
            color: #5b339a;
          }
        }

        .sub-menu-item {
          padding: 0 10px;
          cursor: pointer;
          transition: color 0.3s ease;

          &:hover {
            color: #5b339a;
          }
        }
      }
    }
  }
}

.cate-banner {
  width: 100%;
  margin-top: 65px;
  cursor: pointer;
}

.cate-ctx {
  display: flex;
  align-items: flex-start;

  .cate-left {
    position: relative;
    width: 255px;
    height: 685px;
    border-radius: 32px 0 0 0;
    overflow: hidden;

    .bg-box {
      width: 255px;
      height: 685px;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .fix-cate {
      position: absolute;
      width: 143px;
      right: 0;
      top: 0;
      bottom: 0;
      padding: 28px 0;

      .cate-list {
        .cate-item {
          cursor: pointer;
          justify-content: flex-end;
          text-align: right;
          padding: 0 24px;
          width: 143px;
          height: 42px;
          margin-bottom: 9px;
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: bold;
          font-size: 18px;
          color: #0c0a0a;

          &.active {
            background: url("~@img/index/cate-bg.png");
            font-weight: bold;
            font-size: 18px;
            color: #ffffff;
          }
        }
      }
    }
  }

  .cate-right {
    flex: 1;
    overflow: hidden;
    align-self: stretch;
    background: #fff;
    // padding: 0 10px;

    .product-list {
      display: flex;
      flex-wrap: wrap;

      .product-item {
        .tag-dom {
          position: absolute;
          right: 0;
          top: 0;
          width: 40px;
          height: 25px;
          line-height: 25px;
        }

        border-right: 1px solid #e6e6e6;
        border-bottom: 1px solid #e6e6e6;
        padding: 21px 37px 15px;
        position: relative;

        &:nth-child(5n) {
          border-right: 0;
        }

        &:nth-child(n + 6) {
          border-bottom: 0;
        }

        .poster-box {
          margin: 0 auto;
          width: 194px;
          height: 194px;

          img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
        }

        .info-box {
          text-align: left;
          padding-top: 4px;
          width: 194px;

          .brand {
            text-align: center;
            font-family: MicrosoftYaHei, MicrosoftYaHei;
            font-weight: normal;
            font-size: 13px;
            color: #656565;
          }

          .title-box {
            height: 48px;
          }

          .title {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            text-overflow: ellipsis;
            font-family: MicrosoftYaHei, MicrosoftYaHei;
            font-weight: normal;
            font-size: 14px;
            color: #1F1F1F;
            line-height: 20px;
            word-break: break-word;
          }

          .price {
            margin-top: 12px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 20px;
            color: #7853b2;
            font-family: Microsoft YaHei, Microsoft YaHei;
            font-weight: bold;

            .chengjiao {
              color: #777;
              font-size: 14px;
            }
          }

          .market-price {
            text-decoration-line: line-through;
            color: #505050;
            font-size: 14px;
          }

          .btn {
            width: 32px;
            height: 32px;
            text-align: center;
            border-radius: 50%;

            img {
              margin-top: 6px;
              width: 19px;
            }

            &:first-child {
              background: #7853b2;
            }

            &:last-child {
              background: #FCB000;
              margin-left: 7px;
            }
          }
        }
      }
    }
  }
}

.hot-sec {
  border-radius: 12px 12px 12px 12px;
  background: linear-gradient(180deg, #ffa408 0%, #ffc209 100%);
  height: 309px;
  padding: 10px 12px 10px 18px;
  position: absolute;
  left: 344px;
  top: 554px;
  width: 1255px;

  .title-boxs {
    width: 206px;
    background-image: url("~@img/index/jingpin.png");
    background-size: 100%;
    background-repeat: no-repeat;
    height: 100%;
  }

  .title-box {
    .title-left {
      text-align: center;

      .lightning-icon {
        font-size: 40px;
        margin-bottom: 10px;
        filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.8));
      }

      .sec-title {
        margin: 15px 10px;
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: bold;
        font-size: 24px;
        color: #ffffff;
      }

      .sec-desc {
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: 400;
        font-size: 20px;
        font-weight: 500;
        color: #ffffff;

        img {
          width: 18px;
          margin-left: 5px;
        }
      }

      .countdown-text {
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: 400;
        font-size: 12px;
        color: #ffffff;
        margin-bottom: 29px;
        margin-top: 103px;
      }

      .countdown-timer {
        display: flex;
        justify-content: center;
        gap: 8px;

        .time-box {
          display: flex;
          flex-direction: column;
          align-items: center;

          .time-value {
            width: 35px;
            height: 41px;
            background: #000000;
            color: #ffffff;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: Arial, Arial;
            font-size: 22px;
          }

          .time-label {
            font-family: Arial, Arial;
            font-weight: 400;
            font-size: 12px;
            color: #ffffff;
          }
        }
      }
    }
  }

  .sec-ctx {
    width: calc(100% - 224px);
    margin-left: 18px;
  }

  .hot-lunbo {
    position: relative;
    width: 100%;
    height: 286px;
    background: #fff;
    border-radius: 8px 8px 8px 8px;

    /deep/ .el-carousel__container {
      height: 286px;
    }

    /deep/ img {
      object-fit: cover;
    }
  }

  .product-list {
    display: flex;
    flex-wrap: wrap;
    height: 253px;
    border-radius: 8px 8px 8px 8px;
    overflow: hidden;

    .product-item {
      margin-top: 18px;

      // padding-top: 14px;
      // margin: 0 24px;
      padding: 14px 23px;
      // margin-right: 10px;
      background: #fff;
      border-right: 1px solid #d4d4d4;

      &:nth-child(5n) {
        border-right: none;
        padding-right: 10px;
      }

      .poster-box {
        margin: 0 auto;
        width: 152px;
        height: 152px;

        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }

      .info-box {
        text-align: left;
        padding-top: 7px;

        .title-box {
          // height: 48px;
          padding: 0;
        }

        .title {
          font-family: MicrosoftYaHei, MicrosoftYaHei;
          font-weight: normal;
          font-size: 14px;
          color: #1F1F1F;
        }

        .price {
          background-image: url("~@img/index/jingpinbtn.png");
          background-size: 100%;
          background-repeat: no-repeat;
          width: 152px;
          height: 32px;
          margin-top: 6px;
          color: #ffffff;
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: normal;
          padding: 0 10px;

          .huobi {
            font-size: 14px;
          }

          .price-value {
            font-size: 18px;
          }

          .unit {
            text-decoration-line: line-through;
            color: #505050;
            font-size: 12px;
          }
        }
      }
    }
  }
}

.haowu-box {
  padding-top: 15px;

  .haowu-list {
    .haowu-item {
      display: flex;
      margin-bottom: 12px;
      cursor: pointer;

      .poster-box {
        width: 93px;
        height: 93px;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .info-box {
        flex: 1;
        padding-left: 24px;
        text-align: left;

        .title-box {
          height: 44px;

          .title {
            font-family: MicrosoftYaHei, MicrosoftYaHei;
            font-weight: normal;
            font-size: 14px;
            color: #3d4248;
            line-height: 22px;
          }
        }

        .price {
          margin-top: 16px;
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: 400;
          font-size: 16px;
          color: #5b339a;

          .huobi {}

          .price-value {}
        }
      }
    }
  }
}

.suggest-box {
  margin-top: 40px;

  .suggest-title {
    margin-bottom: 30px;

    .block {
      position: relative;
      z-index: 1;

      &::after {
        z-index: -1;
        position: absolute;
        left: -4px;
        bottom: 0;
        content: "";
        width: 128px;
        height: 10px;
        background: #FCB000;
        border-radius: 0px 0px 0px 0px;
      }
    }

    span {
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: bold;
      font-size: 30px;
      color: #1F1F1F;
    }

    img {
      margin: 0 10px;
      width: 22.46px;
    }
  }

  .suggest-tabs {
    padding: 16px;
    background: #ffffff;
    border-radius: 8px 8px 8px 8px;

    .tab-list {
      .tab-item {
        position: relative;
        text-align: center;
        margin: 0 27px;
        padding: 0 6px;
        min-width: 124px;
        height: 45px;
        line-height: 45px;
        background: #ffffff;
        border-radius: 8px 8px 8px 8px;

        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: bold;
        font-size: 18px;
        color: #333333;

        &.active {
          background: rgba(247, 71, 71, 0.2);
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: bold;
          font-size: 18px;
          color: #5b339a;
        }

        &:not(:first-child) {
          &::before {
            content: "";
            position: absolute;
            width: 1px;
            height: 34px;
            background: #707070;
            left: -27px;
            top: 6px;
          }
        }
      }
    }
  }

  .suggest-list {
    .brand-left {
      width: 333px;
      height: 331px;
      background: linear-gradient(138deg, #41e1af 0%, #00acbe 100%);
      color: #ffffff;
      font-weight: bold;

      .num {
        font-size: 60px;
      }

      .tip {
        font-size: 30px;
      }
    }

    .brand-wrap {
      width: calc(100% - 330px);
    }

    .brand-list {
      flex-wrap: wrap;
      display: flex;

      .brand-item {
        width: calc(100% / 5);
        height: 108px;
        background: #ffffff;
        border-right: 1px solid #d4d4d4;
        border-bottom: 1px solid #d4d4d4;

        .img-cov {
          width: 192px;
          height: 88px;
        }

        &:nth-child(5n) {
          // border-right: 0;
        }

        &:nth-child(-n + 5) {
          border-top: 1px solid #d4d4d4;
        }
      }
    }

    .product-list {
      display: flex;
      flex-wrap: wrap;

      .product-item {
        cursor: pointer;
        background: #fff;
        width: 301px;
        height: 384px;
        margin-bottom: 30px;
        padding: 22px 24px 17px;
        margin-right: 23px;
        border-radius: 8px 8px 8px 8px;

        &:nth-child(5n) {
          margin-right: 0;
        }

        .poster-box {
          margin: 0 auto;
          width: 256px;
          height: 256px;

          img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
        }

        .info-box {
          text-align: left;
          padding-top: 14px;

          .title-box {
            height: 22px;
            margin-bottom: 16px;

            .title {
              font-family: MicrosoftYaHei, MicrosoftYaHei;
              font-weight: normal;
              font-size: 16px;
              color: #1F1F1F;
              line-height: 22px;
            }
          }

          .market-price {
            text-decoration-line: line-through;
            color: #505050;
            font-size: 14px;
          }

          .btn {
            width: 32px;
            height: 32px;
            text-align: center;
            border-radius: 50%;

            img {
              margin-top: 6px;
              width: 19px;
            }

            &:first-child {
              background: #7853b2;
            }

            &:last-child {
              background: #FCB000;
              margin-left: 7px;
            }
          }

          .price {
            font-family: Microsoft YaHei, Microsoft YaHei;
            font-weight: bold;
            font-size: 20px;
            color: #7853b2;
          }
        }
      }
    }
  }
}

.back-box {
  position: fixed;
  bottom: 50px;
  right: 30px;

  .btn-box {
    margin: 5px auto;
    border-radius: 30px;
    width: 60px;
    height: 60px;
    background: #fff;
    border: 1px solid #dddddd;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  img {
    width: 30px;
    cursor: pointer;
  }

  .text {
    font-family: MicrosoftYaHei, MicrosoftYaHei;
    font-weight: normal;
    font-size: 16px;
    color: #ffffff;
  }

  .cart-num {
    position: absolute;
    right: 7px;
    top: 4px;
    width: 24px;
    height: 24px;
    background: #ff7600;
    border-radius: 12px;

    font-family: MicrosoftYaHei, MicrosoftYaHei;
    font-weight: normal;
    font-size: 12px;
    color: #ffffff;
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/page/index.less"></style>
<style scoped lang="less" src="@/assets/h5css/mobile/index.less"></style>
<style scoped lang="less" src="@/assets/h5css/page/shipei.less"></style>
