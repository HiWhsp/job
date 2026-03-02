<template>
  <div class="page">
    <div class="page-ctx">
      <div class="inner">
        <div class="banner-box">
          <div class="lunbo-wrap">
            <div class="lunbo-box">
              <el-carousel trigger="click" :autoplay="true">
                <el-carousel-item
                  v-for="(item, index) in vuex_index_banners"
                  :key="index"
                  @click.native="do_banner_click(item)"
                >
                  <img :src="item.image" alt />
                </el-carousel-item>
              </el-carousel>
            </div>
          </div>
        </div>

        <div class="content-box w-1400">
          <!-- 推荐模块 -->
          <div class="recommend-box">
            <div class="recommend-list">
              <!-- 服务卡片1 -->
              <div
                class="recommend-card service-card"
                v-for="item in news_list"
                :key="item.id"
                @click="to_news(item)"
              >
                <div class="card-content">
                  <h3 class="card-title">{{ item.title }}</h3>
                  <div class="card-desc">{{ item.description || '--' }}</div>
                </div>
                <div class="card-icon">
                  <div class="card-more">
                    <span>MORE</span>
                    <i class="el-icon-right"></i>
                  </div>
                  <div class="icon-placeholder">
                    <el-image :src="item.thumb" fit="cover"></el-image>
                  </div>
                </div>
              </div>

              <!-- 优惠券卡片 -->
              <div class="recommend-card coupon-card" @click="to_url('/coupon-center')">
                <div class="coupon-content">
                  <h3 class="coupon-title">Coupon Center</h3>
                  <div class="coupon-desc">Get coupons for better prices!</div>
                  <div class="coupon-arrow">
                    <img src="@img/index/coupon-arrow.png" alt />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 秒杀模块 -->
          <div class="hot-sec flex">
            <div class="sec-left">
              <p class="sec-left-title">SAFE AND RELIABLE</p>
              <img src="@img/index/sec-left-icon.png" class="sec-left-icon" alt />
              <p class="sec-left-desc">
                Clearance sale for some products, lowest prices available, come
                and buy now
              </p>
              <img class="sec-left-btn" src="@img/index/sec-left-btn.png" alt />
            </div>
            <div class="sec-right">
              <div class="sec-right-header">
                <div class="limited-offer-banner">
                  <img src="~@img/index/sec-right-icon.png" alt />
                  <span>LIMITED-TIME OFFER</span>
                </div>
                <div class="countdown-display">
                  <div class="countdown-timer-new">
                    <span class="time-value">{{ countdown.hours }}</span>
                    <span class="time-separator">:</span>
                    <span class="time-value">{{ countdown.minutes }}</span>
                    <span class="time-separator">:</span>
                    <span class="time-value">{{ countdown.seconds }}</span>
                  </div>
                </div>
                <div class="sold-progress">
                  <div class="sold-text">{{ seckillProgressText }}</div>
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: seckillProgressPercent + '%' }"></div>
                  </div>
                </div>
              </div>
              <div class="sec-ctx">
                <div class="hot-lunbo">
                  <el-carousel
                    v-if="jingpin_group.length > 0"
                    ref="hotLunbo"
                    trigger="click"
                    :autoplay="true"
                    :interval="6000"
                    arrow="always"
                  >
                    <el-carousel-item v-for="(group, gindex) in jingpin_group" :key="gindex">
                      <div class="product-list">
                        <div
                          class="product-item hover"
                          v-for="(item, index) in group"
                          :key="index"
                          @click="to_product(item)"
                        >
                          <div class="poster-box scale-box">
                            <img class="scale-img" :src="item.thumb" alt />
                            <div class="hover-actions">
                              <div class="action-btn favorite-btn" @click.stop="do_add_fav(item)"></div>
                              <div class="action-btn cart-btn" @click.stop="addToCart(item)"></div>
                            </div>
                          </div>
                          <div class="info-box">
                            <div class="title-box">
                              <div class="title ellipsis-2">{{ item.title }}</div>
                            </div>
                            <div class="price-new">US${{ item.priceUser || item.priceSale }}</div>
                            <div class="certifications">
                              <span class="cert-badge">FDA</span>
                              <span class="cert-badge">CE</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </el-carousel-item>
                  </el-carousel>
                  <el-empty description="No data" v-if="jingpin_group.length === 0" />
                </div>
              </div>
            </div>
          </div>

          <div class="group-panel">
            <div class="sec-cate" v-for="(group, gindex) in cateGroup" :key="gindex">
              <div class="sec-title-box">
                <div class="title-left flex">
                  <div class="sec-line">
                    <img src="@img/index/area.png" alt />
                  </div>
                  <div class="sec-title">{{ group.title }}</div>
                </div>
              </div>

              <div class="cate-ctx w-1400">
                <div class="cate-right">
                  <div class="cate-product-wrap">
                    <div class="product-list">
                      <div
                        class="product-item hover"
                        v-for="(item, index) in group.products"
                        :key="index"
                        @click="to_product(item)"
                      >
                        <div class="poster-box scale-box">
                          <img class="scale-img" :src="item.thumb" alt />
                          <div class="hover-actions">
                            <div class="action-btn favorite-btn" @click.stop="do_add_fav(item)"></div>
                            <div class="action-btn cart-btn" @click.stop="addToCart(item)"></div>
                          </div>
                        </div>
                        <div class="info-box">
                          <div class="title-box">
                            <div class="title">{{ item.title }}</div>
                          </div>
                          <div class="price-box">
                            <div class="price">
                              <div class="pirce-num">US${{ item.priceSale }}</div>
                            </div>
                            <div class="market-price">US${{ item.priceMarket }}</div>
                          </div>
                          <div class="btn-box">
                            <div class="btn" @click.stop="openQuickBuy(item)">FDA</div>
                            <div class="btn" @click.stop="openQuickBuy(item)">ISO13485</div>
                          </div>
                        </div>
                        <!-- <el-tooltip class="item" effect="dark" content="仅限企业用户购买" placement="top"> -->
                          <el-tag
                            class="tag-dom"
                            type="warning"
                            effect="dark"
                            v-if="item.isThird == 1"
                          >510K</el-tag>
                        <!-- </el-tooltip> -->
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="cate-banner-box" v-if="gindex == 0">
                <div
                  class="cate-banner-item"
                  v-for="(item, index) in vuex_map_banners['首页推荐'][0]"
                  :key="index"
                  :style="{ backgroundImage: `url(${item.image})` }"
                >
                  <div class="cate-banner-item-content" :class="`content-0-${index}`">
                    <div class="cate-banner-item-title ellipsis-2">{{ item.product_info.title }}</div>
                    <div class="cate-banner-item-desc">${{ item.product_info.priceSale }}</div>
                    <div class="cate-banner-item-btn">
                      <button
                        class="btn btn-primary"
                        @click="openQuickBuy(item.product_info)"
                      >SHOW NOW</button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="cate-banner-box2" v-if="gindex == 1">
                <div
                  class="cate-banner-item content-1-0"
                  v-for="(item, index) in vuex_map_banners['首页推荐'][1]"
                  :key="index"
                  :style="{ backgroundImage: `url(${item.image})` }"
                >
                  <div class="cate-banner-item-content" :class="`content-1-${index}`">
                    <div class="cate-banner-item-title ellipsis-3">{{ item.product_info.title }}</div>
                    <div class="cate-banner-item-desc">${{ item.product_info.priceSale }}</div>
                    <div class="cate-banner-item-btn">
                      <button class="btn btn-primary" @click="openQuickBuy(item.product_info)">
                        <i class="el-icon-caret-right"></i>
                        Go to purchase
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="cate-banner-box3" v-if="gindex == 2">
                <div
                  class="cate-banner-item"
                  v-for="(item, index) in vuex_map_banners['首页推荐'][2]"
                  :key="index"
                  :style="{ backgroundImage: `url(${item.image})` }"
                >
                  <div class="cate-banner-item-content" :class="`content-2-${index}`">
                    <div class="cate-banner-item-title ellipsis-3">{{ item.product_info.title }}</div>
                    <div class="cate-banner-item-desc">${{ item.product_info.priceSale }}</div>
                    <div class="cate-banner-item-btn">
                      <button
                        class="btn btn-primary"
                        @click="openQuickBuy(item.product_info)"
                      >SHOW NOW</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="suggest-box">
            <div class="suggest-title flex-center">
              <img src="@img/index/area.png" alt />
              <span class="sec-title">RECOMMENDED PRODUCTS</span>
            </div>

            <div class="suggest-list">
              <div class="suggest-grid">
                <!-- 第一行：4个产品 -->
                <div class="suggest-row suggest-row-top">
                  <div class="suggest-item hover suggest-item-1"></div>
                  <div class="suggest-item hover suggest-item-2"></div>
                  <div class="suggest-row-right">
                    <div class="suggest-item hover suggest-item-3"></div>
                    <div class="suggest-item hover suggest-item-4"></div>
                  </div>
                </div>

                <!-- 第二行：2个产品 -->
                <div class="suggest-row suggest-row-bottom">
                  <div class="suggest-item hover suggest-item-5"></div>
                  <div class="suggest-item hover suggest-item-6"></div>
                </div>
              </div>
            </div>
          </div>
          <!-- 合作伙伴 -->
          <div class="brand-box">
            <div class="brand-wrap">
              <div class="brand-list-container">
                <div class="brand-list brand-list-1">
                  <div
                    class="brand-item flex-center"
                    v-for="(item, index) in brand_list"
                    :key="'brand-' + index"
                  >
                    <div class="img-cov">
                      <img class="scale-img" :src="item.thumb" alt />
                    </div>
                  </div>
                </div>
                <div class="brand-list brand-list-2">
                  <div
                    class="brand-item flex-center"
                    v-for="(item, index) in brand_list"
                    :key="'brand-dup-' + index"
                  >
                    <div class="img-cov">
                      <img class="scale-img" :src="item.thumb" alt />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 企业用户认证弹窗 -->
    <EnterpriseUserModal
      :visible="showEnterpriseModal"
      @close="closeEnterpriseModal"
      @confirm="confirmEnterpriseModal"
    />
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
    product_renzheng_tip
  },
  data() {
    return {
      showButton: false,
      show_float: false,
      float_index: "",
      brand_list: [],
      showEnterpriseModal: false, // 企业用户认证弹窗显示状态

      news_list: [],
      jingpin_group: [],
      jingpin_list: [],
      cateGroup: [],
      cate_select: {},

      tab_select: {
        value: "1",
        title: "推荐商品"
      },
      tab_list: [
        { value: "1", title: "推荐商品" },
        { value: "2", title: "推荐商品" },
        { value: "3", title: "推荐商品" },
        { value: "4", title: "推荐商品" },
        { value: "5", title: "推荐商品" }
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
        seconds: "00"
      },
      endTime: null,
      startTime: null, // 秒杀开始时间
      seckillTotalHours: 24, // 秒杀总时长（小时）
      countdownInterval: null,
      subMenus: {}, // 存储每个分类的二级菜单数据
      subMenuProducts: {}, // 存储每个二级菜单的产品数据
      seckillProgress: {
        total: 0, // 总库存
        sold: 0 // 已售数量
      }
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
      "vuex_config"
    ]),

    float_category_list() {
      let tree = [];
      if (this.float_index === "") {
      } else {
        tree = this.vuex_category_tree[this.float_index].channels || [];
      }
      return tree;
    },

    // 秒杀进度百分比（基于倒计时时间，24小时为100%）
    seckillProgressPercent() {
      if (!this.endTime) {
        return 0;
      }

      // 依赖 countdown 对象，确保每次倒计时更新时进度也更新
      const hours = parseInt(this.countdown.hours) || 0;
      const minutes = parseInt(this.countdown.minutes) || 0;
      const seconds = parseInt(this.countdown.seconds) || 0;

      // 计算剩余时间（小时）
      const remainingHours = hours + minutes / 60 + seconds / 3600;

      // 总时长（小时），默认24小时
      const totalHours = this.seckillTotalHours;

      // 如果剩余时间大于总时长，说明还没开始，进度为0
      if (remainingHours > totalHours) {
        return 0;
      }

      // 计算已过时间（小时）
      const elapsedHours = totalHours - remainingHours;

      // 计算进度百分比：已过时间 / 总时长 * 100%
      const percent = Math.round((elapsedHours / totalHours) * 100);
      return Math.min(Math.max(percent, 0), 100); // 确保在0-100%之间
    },

    // 秒杀进度文本
    seckillProgressText() {
      return `Sold ${this.seckillProgressPercent}%`;
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
    }
  },

  watch: {
    // 监听 vuex_news_cates 数据变动
    vuex_news_cates: {
      handler(newVal, oldVal) {
        // 当 vuex_news_cates 数据变动时，计算属性会自动重新计算
        console.log("vuex_news_cates 数据已更新:", newVal);
      },
      deep: true,
      immediate: false
    }
  },
  created() {
    this.setView();
    this.$store.dispatch("appInit");
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
    to_url(url) {
      window.open(url, "_blank");
    },
    // 获取卡片背景色
    getCardBgColor(index, column) {
      const colorMap = {
        top: ["#E0E2E6", "#E3F2FD", "#FF6B35", "#F5F5DC"], // 第一行4个：浅灰、浅蓝、橙色、米色
        bottom: ["#E0E2E6", "#1A237E"] // 第二行2个：浅灰、深蓝
      };
      return colorMap[column] ? colorMap[column][index] : "#ffffff";
    },
    // 获取卡片文字颜色
    getCardTextColor(index, column) {
      const colorMap = {
        top: ["#000000", "#000000", "#FFFFFF", "#000000"], // 第一行：黑、黑、白、黑
        bottom: ["#000000", "#FFFFFF"] // 第二行：黑、白
      };
      return colorMap[column] ? colorMap[column][index] : "#000000";
    },
    openQuickBuy(item) {
      this.$router.push(`/product-detail?id=${item.id}`);
    },
    handleScroll() {
      this.showButton = window.scrollY > 200;
    },

    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    },
    setView() {
      this.query_brand();
      this.query_news();
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
          action: "product_brandList"
          //  isHot:1
        }
      }).then(res => {
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
          action: "news_channel",
          channelId: "65"
        }
      }).then(res => {
        if (res.code == 200) {
          this.news_list = res.data;
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
          pageNum: 16
        }
      }).then(res => {
        if (res.code == 200) {
          let list = res.data.list;
          // 获取倒计时数据
          if (res.data.timeList && res.data.timeList.length > 0) {
            const activeTime = res.data.timeList.find(
              item => item.ifStart === 1
            );
            if (activeTime) {
              // 设置结束时间
              if (activeTime.endTime) {
                this.endTime = new Date(activeTime.endTime);
              }
              // 设置开始时间
              if (activeTime.startTime) {
                this.startTime = new Date(activeTime.startTime);
              } else if (this.endTime) {
                // 如果没有开始时间，根据结束时间和总时长计算开始时间
                this.startTime = new Date(
                  this.endTime.getTime() -
                    this.seckillTotalHours * 60 * 60 * 1000
                );
              }
              // 如果接口返回了总时长，使用接口的值
              if (activeTime.totalHours) {
                this.seckillTotalHours = activeTime.totalHours;
              }
              this.startCountdown();
            }
          }

          // 秒杀进度现在基于倒计时时间计算，不再需要库存数据

          let jingpin_group = [];
          let items_length = 4; //4个一组
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
          pageNum: 5
        }
      }).then(res => {
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
          isHot: 1
        }
      }).then(res => {
        console.warn("首页分类产品", res);

        this.cateGroup = res.data.map(its => {
          return {
            ...its,
            images: its.images.split(",") || []
          };
        });
        this.cate_select = this.cateGroup[0];

        // 为每个分类请求二级菜单数据
        this.cateGroup.forEach(group => {
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
          pageNum: 10
        }
      }).then(res => {
        if (res.code == 200) {
          this.suggest_products = res.data.list;
        }
      });
    },

    to_product(item) {
      window.open(
        "/product-detail?id=" + item.inventoryId,
        "_blank",
        "",
        false
      );
      // this.mix_toRoute({
      //   path: "/product-detail",
      //   query: {
      //     id: item.inventoryId,
      //   },
      // });
    },
    to_news(item) {
      this.$router.push(`/news?id=${item.id}`);
    },

    do_banner_click(item) {
      //console.log({ ...item });
      if (item.url) {
        window.open(item.url, "_blank");
      } else if (item.inventoryId) {
        // this.$router.push(
        //   "/product-detail?id=" + (item.skuId || item.inventoryId)
        // );
        window.open(
          "/product-detail?id=" + (item.skuId || item.inventoryId),
          "__blank",
          "",
          false
        );
      }
    },

    do_toggle_cate(item) {
      this.cate_select = item;
    },
    to_cate_group(item) {
      this.$router.push({
        path: "/product-cates",
        query: {
          ids: item.id
        }
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
          seconds: "00"
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
        seconds: seconds.toString().padStart(2, "0")
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
          action: "users_userInfo"
        }
      }).then(res => {
        if (res.code == 200) {
          let { userType, renzheng } = res.data;
          // if (renzheng == 0 && (userType == 1 || userType == 2)) {
          //   //renzheng为0，且用户类型为1或2时，显示弹窗
          //   this.showEnterpriseModal = true;
          // }
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
          parentId: parentId
        }
      })
        .then(res => {
          if (res.code == 200) {
            this.$set(this.subMenus, parentId, res.data || []);
            console.log(`获取分类 ${parentId} 的二级菜单:`, res.data);
          }
        })
        .catch(error => {
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
          isRecommend: 1
        }
      })
        .then(res => {
          if (res.code == 200) {
            this.$set(this.subMenuProducts, menuId, res.data || []);
            console.log(`获取菜单 ${menuId} 的产品数据:`, res.data);
            // 这里可以添加跳转到产品列表页面的逻辑
            this.$router.push({
              path: "/product-cates",
              query: {
                ids: menuId
              }
            });
          }
        })
        .catch(error => {
          console.error(`获取菜单 ${menuId} 的产品数据失败:`, error);
        });
    },

    // 添加收藏
    do_add_fav(item) {
      if (!this.mix_get_login_status()) {
        return;
      }
      const productId = item.productId || item.id;
      if (!productId) {
        alertErr("商品信息不完整");
        return;
      }
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "product_operate",
          productId: productId,
          operateType: 1, //1-关注 2-足迹
          operateSence: 0 //0-关注（添加记录） 1-取消关注（删除记录）
        }
      }).then(res => {
        alert(res);
        if (res.code == 200) {
          // 可以在这里更新UI状态
        }
      });
    },

    // 加入购物车
    addToCart(item) {
      if (typeof this.mix_get_login_status === "function") {
        if (!this.mix_get_login_status()) return;
      }
      const inventoryId = item.inventoryId || item.id;
      if (!inventoryId) {
        alertErr("商品信息不完整，无法加入购物车");
        return;
      }
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "gouwuche_add",
          inventoryId,
          num: 1
        }
      }).then(res => {
        if (res.code == 200) {
          const totalCount = (res.data && res.data.count) || 0;
          if (this.$store && this.$store.commit) {
            this.$store.commit("set_vuex_cart_number", totalCount);
          }
          alertSucc("已加入购物车");
        }
      });
    }
  }
};
</script>

<style lang="less">
.el-select-dropdown__item.hover,
.el-select-dropdown__item:hover {
  background: #ec6a2b;
  color: #fff !important;
}

.el-select-dropdown__item.selected {
  color: #ec6a2b;
}
</style>

<style scoped lang="less">
.page {
  background: #fff;

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
  height: 690;

  /deep/ .el-carousel__container {
    height: 690px;
  }

  /deep/ img {
    width: 100%;
    height: 690px;
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

      & + .cate-group {
        // border-top: 1px solid #f0f0f0;
      }

      &:hover {
        background-color: #f8f9fa;

        .cate-header {
          .main-title {
            color: #00306B;
          }
        }

        .v1-arrow {
          transform: translateX(3px);
          opacity: 1;
        }

        .cate-v2-wrap {
          .v2-title {
            color: #00306B;
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
            color: #1f1f1f;
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
          color: #1f1f1f;
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
            color: #1f1f1f;
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
}

.brand-box {
  margin-top: 100px;
  background: #e0e2e6;
  width: 100vw;
  height: 312px;
  margin-left: -160px;

  .brand-wrap {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .brand-list-container {
    display: flex;
    width: fit-content;
    height: 312px;
    animation: scroll-left 30s linear infinite;

    .brand-list {
      height: 312px;
      display: flex;
      align-items: center;
      flex-wrap: nowrap;
      gap: 143px;
      flex-shrink: 0;

      .brand-item {
        flex-shrink: 0;

        .img-cov {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }
  }

  @keyframes scroll-left {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-50%);
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
          background: #00306B;
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
          border: 1px solid #00306B;
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: 400;
          font-size: 16px;
          color: #00306B;
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
          color: #00306B;
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
          color: #1f1f1f;
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
          color: #1f1f1f;
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
  padding-top: 32px;

  // 推荐模块
  .recommend-box {
    margin-bottom: 100px;

    .recommend-list {
      display: flex;
      justify-content: space-between;

      .recommend-card {
        border-radius: 12px;
        position: relative;
        overflow: hidden;
        cursor: pointer;
        transition: transform 0.3s ease, box-shadow 0.3s ease;

        &:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        }
      }

      // 服务卡片样式
      .service-card {
        flex: 1;
        background: #feeedd;
        padding: 20px;
        height: 330px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-right: 17px;

        &:hover {
          .card-content .card-title {
            color: #ec6a2b;
          }
        }

        .card-content {
          flex: 1;

          .card-title {
            margin: 0 0 16px 0;
            position: relative;
            padding-bottom: 12px;

            font-family: Poppins, Poppins;
            font-weight: bold;
            font-size: 24px;
            color: #1e262e;
            line-height: 34px;

            &::after {
              content: "";
              position: absolute;
              bottom: 0;
              left: 0;
              width: 40px;
              height: 3px;
              background: #ec6a2b;
            }
          }

          .card-desc {
            font-family: Poppins, Poppins;
            font-weight: 400;
            font-size: 18px;
            color: #1e262e;
            line-height: 30px;
            height: 115px;
          }

          .card-more {
            display: flex;
            align-items: center;
            gap: 8px;
            font-family: Microsoft YaHei, Microsoft YaHei;
            font-size: 14px;
            color: #ff7600;
            font-weight: 500;

            .more-icon {
              display: inline-block;
              width: 16px;
              height: 16px;
              background: #d0d0d0;
              border-radius: 2px;
              position: relative;

              &::before,
              &::after {
                content: "";
                position: absolute;
                background: #fff;
                width: 2px;
                height: 8px;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
              }

              &::after {
                transform: translate(-50%, -50%) rotate(90deg);
              }
            }
          }
        }

        .card-icon {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .card-more {
            font-family: Poppins, Poppins;
            font-weight: bold;
            font-size: 18px;
            color: #ec6a2b;
            line-height: 25px;
            i {
              font-size: 18px;
              color: #ec6a2b;
              margin-left: 15px;
            }
          }
          .icon-placeholder {
            width: 70px;
            height: 70px;
            img {
              width: 100%;
              height: 100%;
            }
          }
        }
      }

      // 优惠券卡片样式
      .coupon-card {
        flex: 1;
        background-image: url("~@img/index/coupon-bg.png");
        background-size: 100% 100%;
        background-repeat: no-repeat;
        padding: 30px 24px;
        height: 330px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        color: #fff;

        .coupon-content {
          flex: 1;
          z-index: 2;
          position: relative;

          .coupon-title {
            font-family: Microsoft YaHei, Microsoft YaHei;
            font-weight: bold;
            font-size: 40px;
            color: #fff;
            margin: 0 0 22px 0;
          }

          .coupon-desc {
            width: 250px;
            height: 123px;
            font-family: Microsoft YaHei, Microsoft YaHei;
            font-size: 30px;
            color: #fff;
            margin-bottom: 24px;
            line-height: 40px;
          }

          .coupon-arrow {
            width: 46px;
            height: 46px;
            img {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }
  }

  .sec-cate {
    margin-bottom: 60px;

    .sec-title-box {
      margin-bottom: 18px;
      display: flex;
      justify-content: center;
      align-items: center;

      .title-left {
        display: flex;

        .sec-line {
          img {
            width: 38px;
            margin-right: 12px;
          }
        }

        .sec-title {
          font-family: Poppins, Poppins;
          font-weight: bold;
          font-size: 40px;
          color: #00306b;
          line-height: 56px;
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

  .cate-right {
    flex: 1;
    overflow: hidden;
    align-self: stretch;
    background: #fff;

    .product-list {
      display: flex;
      flex-wrap: wrap;
      gap: 36px;

      .product-item {
        margin-bottom: 50px;
        position: relative;

        .tag-dom {
          cursor: pointer;
          position: absolute;
          left: 0;
          top: 0;
          text-align: center;
          font-size: 22px;
          line-height: 37px;
          width: 82px;
          height: 37px;
          background: linear-gradient(90deg, #ec6a2b 0%, #ff9524 100%);
          border-radius: 24px 0px 24px 0px;
        }

        .poster-box {
          margin: 0 auto;
          width: 373px;
          height: 373px;
          border-radius: 24px;
          position: relative;
          overflow: hidden;

          img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            border-radius: 24px;
          }

          .hover-actions {
            position: absolute;
            right: 15px;
            bottom: 15px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: 10;
          }

          &:hover .hover-actions {
            opacity: 1;
          }

          .action-btn {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: transform 0.2s ease;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

            &:hover {
              transform: scale(1.1);
            }
          }

          .favorite-btn {
            background-image: url("~@img/my-index/favorite.png");
            background-size: 100% 100%;
            background-repeat: no-repeat;
          }

          .cart-btn {
            background-image: url("~@img/my-index/cart.png");
            background-size: 100% 100%;
            background-repeat: no-repeat;
          }
        }

        .info-box {
          text-align: left;
          padding-top: 15px;
          width: 373px;

          .price-box {
            display: flex;
            align-items: end;
            gap: 10px;
            .price {
              display: flex;
              align-items: center;
              justify-content: space-between;
              font-size: 30px;
              color: #ec6a2b;
              font-family: Microsoft YaHei, Microsoft YaHei;
              font-weight: bold;
            }

            .market-price {
              color: #5e5e5e;
              font-size: 20px;
            }
          }

          .title-box {
            height: 85px;

            .title {
              height: 80px;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 3;
              overflow: hidden;
              text-overflow: ellipsis;
              font-family: MicrosoftYaHei, MicrosoftYaHei;
              font-weight: normal;
              font-size: 20px;
              color: #1e262e;
              line-height: 26px;
            }
          }
          .btn-box {
            margin-top: 22px;
            display: flex;
            gap: 12px;
            .btn {
              height: 30px;
              text-align: center;
              border-radius: 5px;
              border: 1px solid #00306b;
              padding: 0 10px;
              font-family: Poppins, Poppins;
              font-weight: 600;
              font-size: 22px;
              color: #00306b;
              line-height: 31px;
            }
          }
        }
      }
    }
  }
}

.cate-banner-box {
  display: flex;
  gap: 20px;
  .cate-banner {
    width: 790px;
    height: 275px;
    cursor: pointer;
  }
  .cate-banner-item {
    width: 790px;
    height: 275px;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    cursor: pointer;
    .cate-banner-item-content {
      padding: 40px;
      color: #fff;

      &.content-0-1 {
        padding-left: 440px;
      }
      .cate-banner-item-title {
        width: 320px;
        height: 65px;
        line-height: 30px;
        font-size: 24px;
        font-weight: 400;
      }
      .cate-banner-item-desc {
        font-family: Poppins, Poppins;
        font-weight: 600;
        font-size: 30px;
        color: #ffffff;
        line-height: 43px;
        text-align: left;
      }
      .cate-banner-item-btn {
        margin-top: 20px;
        width: 171px;
        height: 51px;
        border-radius: 26px 26px 26px 26px;
        border: 1px solid #ffffff;

        .btn {
          font-family: Poppins, Poppins;
          font-weight: 300;
          font-size: 20px;
          color: #ffffff;
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}

.cate-banner-box2 {
  width: 100vw;
  margin-left: -160px;
  .cate-banner-item {
    display: flex;
    align-items: center;
    padding-left: 245px;
  }
  .cate-banner-item {
    width: 100vw;
    height: 663px;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    cursor: pointer;
    .cate-banner-item-content {
      padding: 40px;
      color: #fff;
      &.content-1-1 {
        padding-left: 440px;
      }
    }
    .cate-banner-item-title {
      width: 737px;
      max-height: 152px;
      line-height: 40px;
      font-size: 34px;
      font-weight: 400;
    }
    .cate-banner-item-desc {
      font-family: Poppins, Poppins;
      font-weight: 600;
      font-size: 50px;
      color: #ec6a2b;
      line-height: 71px;
    }
    .cate-banner-item-btn {
      margin-top: 80px;
      width: 252px;
      height: 72px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 42px 42px 42px 42px;
      border: 1px solid #ffffff;
    }
    .btn {
      font-family: Poppins, Poppins;
      font-weight: 600;
      font-size: 18px;
      color: #ffffff;
    }
    i {
      font-size: 20px;
      color: #ffffff;
      margin-right: 10px;
    }
  }
}

.cate-banner-box3 {
  display: flex;
  gap: 20px;
  .cate-banner {
    width: 790px;
    height: 275px;
    cursor: pointer;
  }
  .cate-banner-item {
    width: 790px;
    height: 275px;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    cursor: pointer;
    .cate-banner-item-content {
      padding: 40px;
      color: #fff;

      &.content-0-1 {
        padding-left: 440px;
      }
      .cate-banner-item-title {
        width: 320px;
        height: 65px;
        line-height: 30px;
        font-size: 24px;
        font-weight: 400;
      }
      .cate-banner-item-desc {
        font-family: Poppins, Poppins;
        font-weight: 600;
        font-size: 30px;
        color: #FFC208;
        line-height: 43px;
        text-align: left;
      }
      .cate-banner-item-btn {
        margin-top: 20px;
        width: 171px;
        height: 51px;
        border-radius: 26px 26px 26px 26px;
        border: 1px solid #ffffff;

        .btn {
          font-family: Poppins, Poppins;
          font-weight: 300;
          font-size: 20px;
          color: #ffffff;
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
.hot-sec {
  height: 541px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 17px;
  .sec-left {
    position: relative;
    width: 354px;
    height: 100%;
    background-image: url("~@img/index/sec-left-bg.png");
    background-size: 100%;
    background-repeat: no-repeat;
    padding: 30px;
    .sec-left-title {
      font-size: 30px;
      color: #fff;
      font-weight: 400;
      margin-bottom: 10px;
    }
    .sec-left-icon {
      width: 55px;
      height: 55px;
      margin-bottom: 18px;
    }
    .sec-left-desc {
      font-size: 24px;
      color: #ffffff;
      line-height: 30px;
    }
    .sec-left-btn {
      position: absolute;
      bottom: 40px;
      right: 40px;
      width: 41px;
      height: 41px;
      cursor: pointer;
    }
  }
  .sec-right {
    flex: 1;
    border: 2px solid #ec6a2b;
    border-radius: 24px;
    height: 100%;
    .sec-right-header {
      display: flex;
      align-items: center;
      gap: 20px;
      height: 93px;
      border-bottom: 1px solid #f0f0f0;
      padding-right: 47px;

      .limited-offer-banner {
        width: 480px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        background: #ec6a2b;
        color: #fff;
        font-weight: bold;
        font-size: 30px;
        border-bottom-right-radius: 200px;
        border-top-left-radius: 40px;
        img {
          width: 48px;
        }
      }

      .countdown-display {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;

        .countdown-timer-new {
          display: flex;
          align-items: center;
          gap: 4px;

          .time-value {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 64px;
            height: 64px;
            background: #1a237e;
            color: #ffffff;
            border-radius: 10px;
            font-family: Arial, sans-serif;
            font-weight: bold;
            font-size: 40px;
            padding: 0 8px;
          }

          .time-separator {
            color: #1a237e;
            font-size: 40px;
            font-weight: bold;
            margin: 0 2px;
            line-height: 64px;
          }
        }
      }

      .sold-progress {
        display: flex;
        flex-direction: column;
        gap: 6px;
        width: 389px;

        .sold-text {
          font-family: Poppins, Poppins;
          font-weight: 400;
          font-size: 18px;
          color: #1e262e;
          line-height: 25px;
        }

        .progress-bar {
          width: 100%;
          height: 22px;
          background: #f5e6d3;
          border-radius: 11px;
          overflow: hidden;

          .progress-fill {
            height: 100%;
            background: #ff7600;
            border-radius: 11px;
            transition: width 0.3s ease;
            min-width: 0;
          }
        }
      }
    }

    .sec-ctx {
      width: 100%;
      height: 448px;
      padding: 20px 40px;
    }

    .hot-lunbo {
      position: relative;
      width: 100%;
      height: 100%;
      background: transparent;

      /deep/ .el-carousel__container {
        height: 407px;
      }

      /deep/ .el-carousel__arrow {
        width: 40px;
        height: 40px;
        background: #f5f5f5;
        border: none;
        border-radius: 4px;
        color: #666;
        font-size: 18px;

        &:hover {
          background: #e0e0e0;
        }

        &::before {
          font-size: 18px;
        }
      }

      /deep/ .el-carousel__arrow--left {
        left: -20px;
      }

      /deep/ .el-carousel__arrow--right {
        right: -20px;
      }

      /deep/ img {
        object-fit: contain;
      }
    }

    .product-list {
      display: flex;
      height: 100%;
      gap: 27px;

      .product-item {
        width: 265px;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        flex-direction: column;
        align-items: center;

        .poster-box {
          width: 265px;
          height: 265px;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 20px;
          border: 1px solid #e5e2e5;
          position: relative;
          overflow: hidden;

          img {
            width: 100%;
            height: 100%;
          }

          .hover-actions {
            position: absolute;
            right: 12px;
            top: 12px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: 10;
          }

          &:hover .hover-actions {
            opacity: 1;
          }

          .action-btn {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: transform 0.2s ease;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

            &:hover {
              transform: scale(1.1);
            }
          }

          .favorite-btn {
            background-image: url("~@img/my-index/favorite.png");
            background-size: 100% 100%;
            background-repeat: no-repeat;
          }

          .cart-btn {
            background-image: url("~@img/my-index/cart.png");
            background-size: 100% 100%;
            background-repeat: no-repeat;
          }
        }

        .info-box {
          width: 100%;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;

          .title-box {
            width: 100%;
            text-align: left;
          }

          .title {
            height: 48px;
            font-family: Poppins, Poppins;
            font-weight: 600;
            font-size: 18px;
            color: #1e262e;
            line-height: 24px;
          }

          .price-new {
            width: 100%;
            height: 36px;
            font-family: Poppins, Poppins;
            font-weight: 600;
            font-size: 26px;
            color: #ec6a2b;
            text-align: left;
          }

          .certifications {
            width: 100%;
            display: flex;
            align-items: start;
            gap: 8px;

            .cert-badge {
              padding: 0px 10px;
              border: 1px solid #00306b;
              border-radius: 4px;
              color: #00306b;
              font-size: 22px;
              font-weight: bold;
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
          color: #5b339a;
        }
      }
    }
  }
}

.suggest-box {
  margin-top: 40px;

  .suggest-title {
    margin-bottom: 30px;
    img {
      width: 38px;
      margin-right: 12px;
    }

    .sec-title {
      font-family: Poppins, Poppins;
      font-weight: bold;
      font-size: 40px;
      color: #00306b;
      line-height: 56px;
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
    margin-top: 40px;

    .suggest-grid {
      display: flex;
      flex-direction: column;
      gap: 35px;
      width: 100%;
    }

    .suggest-row {
      display: flex;
      gap: 30px;
      width: 100%;
    }

    .suggest-row-right {
      display: flex;
      flex-direction: column;
      gap: 35px;
    }

    .suggest-item {
      cursor: pointer;
      border-radius: 24px;
      display: flex;
      flex-direction: column;
      position: relative;
      overflow: hidden;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      background-color: #000;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
      }

      &.suggest-item-1 {
        width: 505px;
        height: 694px;
        background: url("~@/assets/img/index/suggest/1.png") no-repeat center
          center / 100% 100%;
      }

      &.suggest-item-2 {
        width: 505px;
        height: 694px;
        background: url("~@/assets/img/index/suggest/2.png") no-repeat center
          center / 100% 100%;
      }

      &.suggest-item-3 {
        width: 524px;
        height: 328px;
        background: url("~@/assets/img/index/suggest/3.png") no-repeat center
          center / 100% 100%;
      }

      &.suggest-item-4 {
        width: 524px;
        height: 328px;
        // background: url('~@/assets/img/index/suggest/4.png') no-repeat center center / 100% 100%;
      }

      &.suggest-item-5 {
        width: 505px;
        height: 328px;
        background: url("~@/assets/img/index/suggest/5.png") no-repeat center
          center / 100% 100%;
      }

      &.suggest-item-6 {
        flex: 1;
        height: 328px;
        background: url("~@/assets/img/index/suggest/6.png") no-repeat center
          center / 100% 100%;
      }
    }

    // 价格默认左对齐
    .suggest-item .suggest-price {
      justify-content: flex-start;
    }

    // 兼容旧样式
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
              color: #1f1f1f;
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
              background: #00306B;
            }

            &:last-child {
              background: #fcb000;
              margin-left: 7px;
            }
          }

          .price {
            font-family: Microsoft YaHei, Microsoft YaHei;
            font-weight: bold;
            font-size: 20px;
            color: #00306B;
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
