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
              <div
                class="lunbo-inner w-1400 flex-between"
                @mouseleave="on_mouseleave"
              >
                <div class="lunbo-left">
                  <!-- 1 -->
                  <!-- <asideChannelNav v-if="1" /> -->
                  <!-- <asideChannelNav2 v-if="2" /> -->
                  <!-- <asideChannelNav3 v-if="3" /> -->
                  <!-- <asideChannelNav4 v-if="4" /> -->

                  <div class="cate-wrap">
                    <div class="cate-group-list">
                      <div
                        class="cate-group"
                        v-for="(group, group_index) in vuex_category_tree"
                        :key="group_index"
                        @mouseover="on_mouseover(group, group_index)"
                      >
                        <div
                          class="cate-v1 flex-between"
                          @click="to_cate_v1(group)"
                        >
                          <div class="v1-icon-box flex-center">
                            <img :src="group.thumb" alt="" />
                          </div>
                          <div class="v1-title">{{ group.title }}</div>
                          <div class="v1-arrow flex-center">
                            <img src="@img/index/cate-arrow.png" alt="" />
                          </div>
                        </div>
                        <div class="cate-v2-wrap">
                          <div class="cate-v2-box ellipsis-3">
                            <span
                              class="v2-title"
                              v-for="(v2, v2_index) in group.channels"
                              :key="v2_index"
                              @click="to_cate_v2(v2)"
                            >
                              {{ v2.title }}
                            </span>
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
                        <div
                          class="v2-group"
                          v-for="(v2, index) in float_category_list"
                          :key="index"
                        >
                          <div class="cate-v2 flex-between">
                            <div class="v2-title" @click="to_cate_v2(v2)">
                              {{ v2.title }}
                            </div>
                          </div>
                          <div class="cate-v3-wrap">
                            <div class="cate-v3-box">
                              <span
                                class="v3-title"
                                v-for="(v3, v3_index) in v2.channels"
                                :key="v3_index"
                                @click="to_cate_v3(v3)"
                              >
                                {{ v3.title }}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="brand-wrap">
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
                    </div>
                  </div>
                </div>

                <div class="lunbo-center">
                  <div class="lunbo-box">
                    <el-carousel trigger="click" :autoplay="true">
                      <el-carousel-item
                        v-for="(item, index) in vuex_index_banners"
                        :key="index"
                        @click.native="do_banner_click(item)"
                      >
                        <img :src="item.image" alt="" />
                      </el-carousel-item>
                    </el-carousel>
                  </div>
                </div>
                <div class="lunbo-right">
                  <div class="right">
                    <div class="user-box">
                      <div
                        class="avatar-box"
                        @click="$router.push('userIndex')"
                      >
                        <template v-if="!vuex_is_login">
                          <img :src="vuex_avatar_default" />
                        </template>
                        <template v-else>
                          <img
                            :src="vuex_user.user_image || vuex_avatar_default"
                          />
                        </template>
                      </div>
                      <div class="tip-box">
                        <template v-if="!vuex_is_login"
                          >Hi，欢迎来到莉东实业</template
                        >
                        <template v-else>Hi，{{ vuex_user.nickname }}</template>
                      </div>
                      <div class="login-box" v-if="!vuex_is_login">
                        <div class="btn btn-ripple" @click="toRoute('/login')">
                          登录
                        </div>
                      </div>
                      <div class="reg-box flex-between" v-if="!vuex_is_login">
                        <!-- <div class="btn btn-ripple" @click="toRegister(2)">
                          企业注册
                        </div> -->
                        <div class="btn btn-ripple" @click="toRegister(1)">
                          会员注册
                        </div>
                      </div>
                      <!-- <div class="operate-box">
                        <el-button @click="$router.push('login')" v-if="!vuex_is_login" class="denglu">登录</el-button>
                        <el-button @click="$router.push('register')" v-if="!vuex_is_login" class="zhuce">注册</el-button>
                        <el-button @click="do_logout()" v-else class="denglu">退出</el-button>
                      </div> -->
                    </div>

                    <div class="tequan-list flex" >
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
                    </div>

                    <div class="news-box">
                      <div class="main-title flex-between">
                        <div class="text">莉东公告</div>
                        <router-link to="/news">更多 ></router-link>
                      </div>
                      <div class="news-list">
                        <div
                          class="news-item hover-color"
                          v-for="(item, index) in news_list"
                          :key="index"
                          @click="to_news(item)"
                        >
                          {{ item.title }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="content-box w-1400">
          <div class="hot-sec">
            <div class="title-box">
              <div class="title-left flex">
                <img
                  class="icon"
                  src="@img/index/jingpin.png"
                  alt=""
                  @click="hotPanelMinus()"
                />
                <div class="sec-title color-0">精品选购</div>
                <div class="sec-desc">精品优选 现货直发</div>
              </div>
            </div>
            <div class="sec-ctx">
              <div class="hot-lunbo">
                <el-carousel
                  ref="hotLunbo"
                  trigger="click"
                  :autoplay="true"
                  :interval="6000"
                >
                  <el-carousel-item
                    v-for="(group, gindex) in jingpin_group"
                    :key="gindex"
                  >
                    <div class="product-list">
                      <div
                        class="product-item hover"
                        v-for="(item, index) in group"
                        :key="index"
                        @click="to_product(item)"
                      >
                        <div class="poster-box scale-box">
                          <img class="scale-img" :src="item.thumb" alt="" />
                        </div>
                        <div class="info-box">
                          <div class="title-box">
                            <div class="title ellipsis-2">
                              {{ item.title }}
                            </div>
                          </div>
                          <div class="price flex-center">
                            <div class="huobi">￥</div>
                            <div class="price-value">
                              {{ item.priceSale }}
                            </div>
                            <div class="unit" v-if="item.unit">
                              /{{ item.unit }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </el-carousel-item>
                </el-carousel>
              </div>
            </div>
          </div>

          <div class="hot-tags">
            <div class="tag-wrap">
              <div class="tag-title">
                <span class="title-1">新品</span>
                <span class="title-2">首发</span>
                <span class="desc">新品速递 好货快享</span>
              </div>
              <div class="tag-box">
                <div class="tag-lunbo">
                  <el-carousel
                    ref="hotLunbo"
                    trigger="click"
                    :autoplay="true"
                    :interval="6000"
                  >
                    <el-carousel-item
                      v-for="(item, gindex) in xinpin_lunbo_list"
                      :key="gindex"
                    >
                      <div class="product-lunbo">
                        <div
                          class="product-item hover"
                          @click="to_product(item)"
                        >
                          <div class="poster-box scale-box">
                            <img class="scale-img" :src="item.thumb" alt="" />
                          </div>
                          <div class="info-box">
                            <div class="title-box">
                              <div class="title ellipsis-2">
                                {{ item.title }}
                              </div>
                            </div>
                            <div class="price flex">
                              <div class="huobi">￥</div>
                              <div class="price-value">
                                {{ item.priceSale }}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </el-carousel-item>
                  </el-carousel>
                </div>
                <div class="product-list">
                  <div
                    class="product-item"
                    v-for="(item, index) in xinpin_product_list"
                    :key="index"
                    @click="to_product(item)"
                  >
                    <div class="poster-box scale-box">
                      <img class="scale-img" :src="item.thumb" alt="" />
                    </div>
                    <div class="info-box">
                      <div class="title-box">
                        <div class="title ellipsis-2">
                          {{ item.title }}
                        </div>
                      </div>
                      <div class="price flex-center">
                        <div class="huobi">￥</div>
                        <div class="price-value">
                          {{ item.priceSale }}
                        </div>
                        <div class="unit" v-if="item.unit">
                          /{{ item.unit }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="tag-wrap">
              <div class="tag-title">
                <span class="title-1">好物</span>
                <span class="title-2">推荐</span>
                <span class="desc">新品速递 好货快享</span>
              </div>
              <div class="haowu-box">
                <div class="haowu-list">
                  <div
                    class="haowu-item"
                    v-for="(item, index) in haowu_product_list"
                    :key="index"
                    @click="to_product(item)"
                  >
                    <div class="poster-box scale-box">
                      <img class="scale-img" :src="item.thumb" alt="" />
                    </div>
                    <div class="info-box">
                      <div class="title-box">
                        <div class="title ellipsis-2">
                          {{ item.title }}
                        </div>
                      </div>
                      <div class="price flex">
                        <div class="huobi">￥</div>
                        <div class="price-value">
                          {{ item.priceSale }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="tag-wrap">
              <div class="tag-title">
                <span class="title-1">大牌</span>
                <span class="title-2">低价</span>
                <span class="desc">新品速递 好货快享</span>
              </div>
              <div class="tag-box">
                <div class="tag-lunbo">
                  <el-carousel
                    ref="hotLunbo"
                    trigger="click"
                    :autoplay="true"
                    :interval="6000"
                  >
                    <el-carousel-item
                      v-for="(item, gindex) in dijia_lunbo_list"
                      :key="gindex"
                    >
                      <div class="product-lunbo">
                        <div
                          class="product-item hover"
                          @click="to_product(item)"
                        >
                          <div class="poster-box scale-box">
                            <img class="scale-img" :src="item.thumb" alt="" />
                          </div>
                          <div class="info-box">
                            <div class="title-box">
                              <div class="title ellipsis-2">
                                {{ item.title }}
                              </div>
                            </div>
                            <div class="price flex">
                              <div class="huobi">￥</div>
                              <div class="price-value">
                                {{ item.priceSale }}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </el-carousel-item>
                  </el-carousel>
                </div>
                <div class="product-list">
                  <div
                    class="product-item"
                    v-for="(item, index) in dijia_product_list"
                    :key="index"
                    @click="to_product(item)"
                  >
                    <div class="poster-box scale-box">
                      <img class="scale-img" :src="item.thumb" alt="" />
                    </div>
                    <div class="info-box">
                      <div class="title-box">
                        <div class="title ellipsis-2">
                          {{ item.title }}
                        </div>
                      </div>
                      <div class="price flex-center">
                        <div class="huobi">￥</div>
                        <div class="price-value">
                          {{ item.priceSale }}
                        </div>
                        <div class="unit" v-if="item.unit">
                          /{{ item.unit }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="sec-item">
            <div class="sec-title-box">
              <div class="title-left">
                <div class="sec-title">精选分类</div>
              </div>
            </div>

            <div class="sec-ctx w-1400">
              <div class="sec-left">
                <div class="bg-box">
                  <img :src="cate_select.thumb" alt="" />
                </div>
                <div class="fix-cate">
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
                </div>
              </div>
              <div class="sec-right">
                <div class="cate-product-wrap">
                  <div class="product-list">
                    <div
                      class="product-item hover"
                      v-for="(item, index) in cate_select.products"
                      :key="index"
                      @click="to_product(item)"
                    >
                      <div class="poster-box scale-box">
                        <img class="scale-img" :src="item.thumb" alt="" />
                      </div>
                      <div class="info-box">
                        <div class="brand">
                          {{ item.brand && item.brand.title }}
                        </div>
                        <div class="title-box">
                          <div class="title ellipsis-2">
                            {{ item.title }}
                          </div>
                        </div>
                        <div class="price">
                          <div class="pirce-num">￥{{ item.priceSale }}</div>
                          <div class="chengjiao" v-if="item.unit">
                            {{ item.unit }}
                          </div>
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
              <img src="@img/index/suggest-left.png" alt="" />
              <span>为你推荐</span>
              <img src="@img/index/suggest-right.png" alt="" />
            </div>
            <div class="suggest-tabs">
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
            </div>
            <div class="suggest-list">
              <div class="product-list">
                <div
                  class="product-item hover"
                  v-for="(item, index) in suggest_products"
                  :key="index"
                  @click="to_product(item)"
                >
                  <div class="poster-box scale-box">
                    <img class="scale-img" :src="item.thumb" alt="" />
                  </div>
                  <div class="info-box">
                    <div class="brand">
                      {{ item.brand && item.brand.title }}
                    </div>
                    <div class="title-box">
                      <div class="title ellipsis-2">
                        {{ item.title }}
                      </div>
                    </div>
                    <div class="price flex">
                      <div class="pirce-num">￥ {{ item.priceSale }}</div>
                      <div class="unit">/{{ item.unit || "把" }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
//import { Swiper, SwiperOptions, Pagination, Navigation } from "swiper";
//import "swiper/swiper-bundle.min.css";
import productList from "@/components/product/productList.vue";
import { mapState } from "vuex";

export default {
  name: "index",
  components: {
    productList,
  },
  data() {
    return {
      show_float: false,
      float_index: "",
      brand_list: [],

      nav_list: [
        {
          title: "会员中心",
          icon: require("@img/index/nav1.png"),
          icon1: require("@img/index/nav1.png"),
          route: "/my-info",
        },
        {
          title: "订单查询",
          icon: require("@img/index/nav2.png"),
          icon1: require("@img/index/nav2.png"),
          route: "/order-list",
        },
        {
          title: "我的询价",
          icon: require("@img/index/nav3.png"),
          icon1: require("@img/index/nav3.png"),
          route: "/batch-xiadan",
        },
      ],
      news_list: [],
      jingpin_group: [],
      jingpin_list: [],
      //
      xinpin_lunbo_list: [],
      xinpin_product_list: [],
      haowu_product_list: [],
      dijia_product_list: [],
      dijia_lunbo_list: [],
      //

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
    };
  },
  computed: {
    ...mapState([
      //
      "vuex_index_banners",
      "index_full_ani",
      "hotSearchWords",
    ]),

    float_category_list() {
      let tree = [];
      if (this.float_index === "") {
      } else {
        tree = this.vuex_category_tree[this.float_index].channels || [];
      }
      return tree;
    },
  },

  watch: {},
  created() {
    this.setView();
    console.log("compiled0401");
  },
  mounted() {},
  methods: {
    setView() {
      this.query_brand();
      this.query_news();
      //
      this.query_jingpin();
      this.query_xinpin();
      this.query_haowu();
      this.query_dijia();
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
          channelId: "",
          page: 1,
          pageNum: 100,
        },
      }).then((res) => {
        if (res.code == 200) {
          this.brand_list = res.data;
        }
      });
    },
    toRegister(mode) {
      this.toRoute({
        path: "/register",
        query: {
          type: mode,
          // nopopup: true,
        },
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
          page: 1,
          pageNum: 16,
        },
      }).then((res) => {
        if (res.code == 200) {
          let list = res.data.list;
          this.jingpin_products = res.data.list;

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

    query_xinpin() {
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
          let list = res.data.list;
          this.xinpin_lunbo_list = list.slice(0, 4);
          this.xinpin_product_list = list.slice(4, 10);
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
    query_dijia() {
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
          let list = res.data.list;
          this.dijia_lunbo_list = list.slice(0, 4);
          this.dijia_product_list = list.slice(4, 10);
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
          pdtNum: 8,
        },
      }).then((res) => {
        console.warn("首页分类产品", res);
        this.cateGroup = res.data;
        this.cate_select = this.cateGroup[0];
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
          pageNum: 16,
        },
      }).then((res) => {
        if (res.code == 200) {
          this.suggest_products = res.data.list;
        }
      });
    },

    to_product(item) {
      this.mix_toRoute({
        path: "/product-detail",
        query: {
          id: item.inventoryId,
        },
      });
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
        this.$router.push(
          "/product-detail/" + (item.skuId || item.inventoryId)
        );
      }
    },

    do_toggle_cate(item) {
      this.cate_select = item;
    },

    to_cate_v1(v1) {
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
    do_logout() {},

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
  },
};
</script>

<style lang="less">
.el-select-dropdown__item.hover,
.el-select-dropdown__item:hover {
  background: #F74747;
  color: #fff !important;
}

.el-select-dropdown__item.selected {
  color: #F74747;
}
</style>

<style scoped lang="less">
.page {
  padding-top: 15px;
  padding-bottom: 95px;
  background: #f3f3f3;

  .inner {
    padding-top: 0;
    margin: 0 auto;
    position: relative;
  }
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

  /deep/ .el-carousel__button {
    border-radius: 50%;
    width: 12px;
    height: 12px;
    background: #fff;
    opacity: 0.58;
  }
  /deep/ .el-carousel__indicator.is-active button {
    width: 40px;
    background: #F74747;
    border-radius: 6px;
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
    .lunbo-left {
    }

    .lunbo-center {
      flex: 1;
      height: 546px;
      margin: 0 17px;
      background: #fff;
    }
  }
}

.lunbo-left {
  position: relative;
  width: 245px;
  height: 546px;
  background: #ffffff;
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
.cate-wrap {
  .cate-group-list {
    .cate-group {
      padding: 15px;
      padding-left: 40px;
      & + .cate-group {
        border-top: 1px solid #e8e8e8;
      }
      .cate-v1 {
        position: relative;
        cursor: pointer;

        &:hover {
          .v1-title {
            color: #F74747;
          }
        }
        .v1-icon-box {
          position: absolute;
          left: -25px;
          img {
            width: 18px;
            height: 18px;
          }
        }
        .v1-title {
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: bold;
          font-size: 14px;
          color: #333333;
        }
        .v1-arrow {
          width: 6.25px;
          height: 11.2px;
          img {
            width: 6.25px;
            height: 11.2px;
          }
        }
      }
      .cate-v2-wrap {
      }
      .cate-v2-box {
        margin-top: 11px;
        .v2-title {
          cursor: pointer;
          margin-right: 10px;
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: 400;
          font-size: 14px;
          color: #666666;
          line-height: 21px;
          cursor: pointer;

          &:hover {
            color: #F74747;
          }
        }
      }
    }
  }
}

.lunbo-float {
  position: absolute;
  z-index: 10;
  left: 245px;
  top: 0;
  right: 0;
  background: #fff;
  height: 546px;
}

.float-cate-wrap {
  display: flex;

  .cate-inner {
    flex: 1;
    padding: 10px 0 20px 0;

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

  .cate-v2-list {
    .v2-group {
      padding-top: 10px;
      display: flex;
      align-items: flex-start;
      .cate-v2 {
        padding-left: 32px;
        width: 170px;
        .v2-title {
          cursor: pointer;
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: bold;
          font-size: 14px;
          color: #333333;

          &:hover {
            color: #F74747;
          }
        }
      }
      .cate-v3-wrap {
        padding-bottom: 25px;
        flex: 1;
        border-bottom: 1px solid #dedede;
        .cate-v3-box {
          .v3-title {
            margin-right: 20px;
            cursor: pointer;
            font-family: MicrosoftYaHei, MicrosoftYaHei;
            font-weight: normal;
            font-size: 13px;
            color: #545454;
            &:hover {
              color: #F74747;
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
      color: #F74747;
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
  width: 280px;

  .right {
    width: 280px;
    height: 546px;
    padding: 14px 13px;
    background: #fff;

    .user-box {
      text-align: center;

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
          height: 34px;
          line-height: 34px;
          background: #E5222B;
          border-radius: 2px 2px 2px 2px;
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: 400;
          font-size: 14px;
          color: #ffffff;
        }
      }

      .reg-box {
        margin-top: 14px;

        .btn {
          width: 100%;
          height: 38px;
          line-height: 38px;
          background: #ffffff;
          border-radius: 2px 2px 2px 2px;
          border: 1px solid #c9cdd4;
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: 400;
          font-size: 14px;
          color: #333333;
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
      border-top: 1px solid #E0E0E0;
      margin: 10px;
      padding: 10px 5px;
      text-align: left;
      margin-top: 24px;

      .main-title {
        padding-top: 10px;
        font-size: 16px;
        font-family: MicrosoftYaHei;
        color: #333;

        .text {
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: bold;
          font-size: 18px;
          color: #3d3d3d;
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
          padding: 8px 0;
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: 400;
          font-size: 14px;
          color: #5e5e5e;
          cursor: pointer;
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
            width: 46px;
            height: 46px;
            &.icon1 {
              display: none;
            }
          }
        }

        .tequan-title {
          margin-top: 10px;
          font-size: 14px;
          color: #333333;
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

.sec-item {
  padding-top: 40px;

  .sec-title {
    margin-bottom: 0;
    text-align: center;
    font-family: Poppins, Poppins;
    font-weight: 600;
    font-size: 40px;
    color: #333333;
  }

  .sec-ctx {
    margin: 0 auto;
  }

  .more-box {
    margin-top: 72px;
    text-align: center;

    a {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      width: 200px;
      height: 50px;
      background: #F74747;
      border-radius: 0px 0px 0px 0px;

      font-family: OPPOSans, OPPOSans;
      font-weight: bold;
      font-size: 18px;
      color: #ffffff;
    }
  }
}

.sec-cate1 {
  margin-top: 70px;
  margin-bottom: 96px;
}

.sec-cate2 {
  margin-top: 0px;
  margin-bottom: 136px;
}

//
.content-box {
  margin: 0 auto;
  padding-top: 35px;

  .sec-item {
    margin-bottom: 40px;

    .sec-title-box {
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .title-left {
        display: flex;
        align-items: flex-end;

        .sec-title {
          font-size: 28px;
          font-family: PingFang SC, PingFang SC;
          font-weight: bold;

          &.color-0 {
            color: #eb0f19;
          }

          &.color-1 {
            color: #e68d1d;
          }

          &.color-2 {
            color: #97563e;
          }

          &.color-3 {
            color: #5868be;
          }

          &.color-4 {
            color: #dd6641;
          }

          &.color-5 {
            color: #8a67c7;
          }

          &.color-6 {
            color: #83be41;
          }

          &.color-7 {
            color: #d6426f;
          }

          &.color-8 {
            color: #b74b4b;
          }

          &.color-9 {
            color: #0cb89d;
          }
        }

        .sec-divider {
          margin: 0 15px;
          font-size: 14px;
          font-family: PingFang SC, PingFang SC;
          font-weight: 500;
          color: #999999;
        }

        .sec-desc {
          font-size: 14px;
          font-family: PingFang SC, PingFang SC;
          font-weight: 500;
          color: #999999;
        }
      }

      .sec-more {
        display: flex;
        align-items: center;

        .text {
          font-size: 14px;
          font-family: PingFang SC, PingFang SC;
          font-weight: 500;
          color: #333333;
        }

        .arrow {
          margin-left: 10px;
          width: 17px;
          height: 17px;
        }
      }
    }
  }
}

.sec-ctx {
  display: flex;
  align-items: flex-start;

  .sec-left {
    position: relative;
    width: 170px;
    height: 628px;
    .bg-box {
      width: 170px;
      height: 628px;
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
          padding: 0 16px;
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
  .sec-right {
    flex: 1;
    overflow: hidden;
    align-self: stretch;
    background: #fff;
    padding: 0 10px;

    .product-list {
      display: flex;
      flex-wrap: wrap;

      .product-item {
        padding: 37px 10px 14px 10px;
        width: 170px;
        .poster-box {
          margin: 0 auto;
          width: 150px;
          height: 150px;

          img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
        }

        .info-box {
          text-align: left;
          padding-top: 24px;

          .brand {
            text-align: center;
            font-family: MicrosoftYaHei, MicrosoftYaHei;
            font-weight: normal;
            font-size: 13px;
            color: #656565;
          }

          .title-box {
            height: 44px;
          }
          .title {
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            font-family: MicrosoftYaHei, MicrosoftYaHei;
            font-weight: normal;
            font-size: 14px;
            color: #3d4248;
            line-height: 22px;
          }

          .price {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 16px;
            font-size: 18px;
            font-family: PingFang SC, PingFang SC;
            font-weight: 500;
            color: #eb0f19;

            .chengjiao {
              color: #777;
              font-size: 14px;
            }
          }
        }
      }
    }
  }
}

.hot-sec {
  background-image: url("~@img/index/jingpin-bg.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  height: 356px;
  padding: 6px;

  .title-box {
    padding: 4px 10px;
    .title-left {
      .icon {
        width: 24.06px;
      }
      .sec-title {
        margin: 0 10px;
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: bold;
        font-size: 24px;
        color: #ffffff;
      }
      .sec-desc {
        align-self: flex-end;
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: 400;
        font-size: 16px;
        color: #ffffff;
      }
    }
  }

  .hot-lunbo {
    margin-top: 4px;
    position: relative;
    width: 100%;
    height: 302px;
    background: #fff;
    border-radius: 8px 8px 8px 8px;

    /deep/ .el-carousel__container {
      height: 302px;
    }

    /deep/ img {
      object-fit: cover;
    }
  }

  .product-list {
    display: flex;
    flex-wrap: wrap;

    .product-item {
      padding: 15px;
      width: 222px;
      height: 302px;
      margin-right: 10px;
      background: #fff;

      &:nth-child(4n) {
        margin-right: 0;
      }

      .poster-box {
        margin: 0 auto;
        width: 170px;
        height: 170px;

        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }

      .info-box {
        text-align: left;
        padding-top: 24px;

        .title-box {
          height: 48px;
        }

        .title {
          font-family: MicrosoftYaHei, MicrosoftYaHei;
          font-weight: normal;
          font-size: 14px;
          color: #3d4248;
          line-height: 22px;
        }

        .price {
          margin-top: 6px;
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: bold;
          font-size: 14px;
          color: #eb0f19;

          .huobi {
            font-size: 14px;
          }

          .price-value {
            font-size: 18px;
          }

          .unit {
            font-size: 14px;
          }
        }
      }
    }
  }
}

.hot-tags {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;

  .tag-wrap {
    margin-right: 18px;
    height: 626px;
    background: #ffffff;
    border-radius: 8px 8px 8px 8px;
    padding: 18px;
    flex: 1;

    .tag-title {
      margin-bottom: 20px;
      .title-1 {
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: bold;
        font-size: 24px;
        color: #F74747;
      }
      .title-2 {
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: bold;
        font-size: 24px;
        color: #333333;
      }
      .desc {
        margin-left: 10px;
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: 400;
        font-size: 16px;
        color: #666666;
      }
    }
    .tag-box {
      /deep/ .el-carousel__container {
        height: 132px;
      }
      /deep/ .el-carousel__button {
        border-radius: 2px;
        width: 6px;
        height: 6px;
        background: #656565;
        opacity: 0.58;
      }
      /deep/ .el-carousel__indicator.is-active button {
        width: 20px;
        background: #ff5f00;
      }

      .tag-lunbo {
        height: 132px;
        background: linear-gradient(180deg, #8da5ff 0%, #ffffff 100%);
        border-radius: 4px 4px 4px 4px;

        .product-lunbo {
          padding: 20px;
          .product-item {
            display: flex;
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
                color: #eb0f19;
                .huobi {
                }
                .price-value {
                }
              }
            }
          }
        }
      }
      .product-list {
        margin-top: 10px;
        display: flex;
        flex-wrap: wrap;
        .product-item {
          width: 121px;
          margin-right: 24px;
          margin-bottom: 16px;

          &:nth-child(3n) {
            margin-right: 0px;
          }
          .poster-box {
            width: 106px;
            height: 106px;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .info-box {
            padding-top: 12px;
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
              margin-top: 6px;
              font-family: Microsoft YaHei, Microsoft YaHei;
              font-weight: 400;
              font-size: 16px;
              color: #eb0f19;

              .huobi {
              }
              .price-value {
              }
            }
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
          color: #eb0f19;
          .huobi {
          }
          .price-value {
          }
        }
      }
    }
  }
}

.suggest-box {
  .suggest-title {
    margin-bottom: 30px;

    span {
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: bold;
      font-size: 24px;
      color: #333333;
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
          background: #FEDADA;
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: bold;
          font-size: 18px;
          color: #F74747;
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
    .product-list {
      display: flex;
      flex-wrap: wrap;

      .product-item {
        cursor: pointer;
        background: #fff;
        padding: 10px 20px;
        width: 264px;
        height: 385px;
        margin-bottom: 20px;
        border-top: 1px solid #eee;
        border-right: 1px solid #eee;
        border-bottom: 1px solid #eee;
        margin-right: 20px;
        border-radius: 8px 8px 8px 8px;

        &:nth-child(5n) {
          margin-right: 0;
        }

        .poster-box {
          margin: 0 auto;
          width: 224px;
          height: 224px;

          img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
        }

        .info-box {
          text-align: left;
          padding-top: 24px;

          .brand {
            text-align: center;
            font-family: MicrosoftYaHei, MicrosoftYaHei;
            font-weight: normal;
            font-size: 13px;
            color: #656565;
          }

          .title-box {
            margin-top: 8px;
            height: 50px;

            .title {
              font-family: MicrosoftYaHei, MicrosoftYaHei;
              font-weight: normal;
              font-size: 14px;
              color: #3d4248;
              line-height: 22px;
            }
          }

          .price {
            margin-top: 13px;
            font-size: 14px;
            font-family: PingFang SC, PingFang SC;
            font-weight: 500;
            color: #eb0f19;

            .unit {
              color: #eb0f19;
              font-size: 14px;
            }
          }
        }
      }
    }
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/page/index.less"></style>
<style scoped lang="less" src="@/assets/h5css/mobile/index.less"></style>
