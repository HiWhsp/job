<template>
  <div class="page">
    <div class="container">
      <!-- 顶部导航 -->
      <div class="top-nav">
        <!-- 左侧导航菜单 -->
        <div class="top-nav-left">
          <div class="nav-item" @click="toNav({ route: '/demand-form' })">
            <i class="icon">
              <img src="@/assets/image/icon/home1.png" alt="" />
            </i>
            After-sales Service
            <span class="el-icon-arrow-right"></span>
          </div>
          <div class="nav-item" @click="toNav({ route: '/demand-form' })">
            <i class="icon">
              <img src="@/assets/image/icon/home2.png" alt="" />
            </i>
            Project Product
            <span class="el-icon-arrow-right"></span>
          </div>
          <div class="nav-item" @click="toNav({ route: '/demand-form' })">
            <i class="icon">
              <img src="@/assets/image/icon/home3.png" alt="" />
            </i>
            Project Financing
            <span class="el-icon-arrow-right"></span>
          </div>
          <div class="nav-item" @click="toNav({ route: '/demand-form' })">
            <i class="icon">
              <img src="@/assets/image/icon/home4.png" alt="" />
            </i>
            Project Transfer
            <span class="el-icon-arrow-right"></span>
          </div>
          <div class="nav-item" @click="toNav({ route: '/demand-form' })">
            <i class="icon">
              <img src="@/assets/image/icon/home4.png" alt="" />
            </i>
            Product Recycling
            <span class="el-icon-arrow-right"></span>
          </div>
        </div>

        <!-- 中间横幅区域 -->
        <div class="top-nav-center">
          <div class="banner-area">
            <div class="banner-content">
              <el-carousel height="374px">
                <el-carousel-item v-for="item in vuex_config.mainBanners" :key="item.id">
                  <img :src="item.image" alt="" @click="toUrl(item.url)" />
                </el-carousel-item>
              </el-carousel>
            </div>
          </div>
        </div>

        <!-- 右侧登录区域 -->
        <div class="top-nav-right">
          <div class="top-nav-right-top" v-if="!baseInfo.id">
            <div class="greeting">Hello, please login/register</div>
            <div class="login-box">
              <div class="login-btn" @click="showLogin">Login</div>
              <div class="register-btn" @click="showRegister">Register</div>
            </div>
          </div>
          <div class="top-nav-right-top" v-else>
            <div class="item1">
              <div class="item1-left">
                <p>Hello, member</p>
                <p>{{ baseInfo.realname }}</p>
              </div>
              <div class="item1-right">
                <img
                  :src="vuex_config.file_url_pre + baseInfo.avatar"
                  alt=""
                  v-if="baseInfo.avatar"
                />
                <img src="@img/my/avatar.png" alt="" v-else />
                <div class="item1-right-img">
                  <img src="@img/my/no-vip.png" alt="" />
                  <p>{{ levelName }}</p>
                </div>
              </div>
            </div>
            <div class="item2">
              <div
                class="item2-item"
                @click="
                  toNav({
                    route:
                      baseInfo.serviceType == 1
                        ? '/service-list'
                        : '/service-provider-list',
                  })
                "
              >
                <img src="@/assets/image/icon/gd.png" alt="" />
                <p>My Orders</p>
              </div>
              <div
                class="item2-item"
                @click="toNav({ route: '/demand-list' })"
                v-if="baseInfo.serviceType == 1"
              >
                <img src="@/assets/image/icon/yq.png" alt="" />
                <p>My Demands</p>
              </div>
            </div>
          </div>

          <!-- 通知公告区域 -->
          <div class="notice-area">
            <div class="notice-title">
              <div class="notice-title-left">
                <i class="notice-icon"></i>
                <span>Notices</span>
              </div>
              <span class="more" @click="toNav({ route: '/article-detail' })"
                >View More <i class="el-icon-arrow-right"></i
              ></span>
            </div>
            <div class="notice-list">
              <div
                class="notice-item ellipsis"
                v-for="item in (vuex_config.newsList || []).slice(0, 4)"
                :key="item.id"
                @click="toNav({ route: '/article-detail', query: { id: item.id } })"
              >
                {{ item.title }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="top-nav-right-bottom">
        <img
          :src="vuex_config.mainAdBanner ? vuex_config.mainAdBanner[0].image : ''"
          alt=""
          @click="toUrl(vuex_config.mainAdBanner[0].url)"
        />
      </div>

      <!-- 系统厂商区域 -->
      <div class="system-ads-section">
        <div class="section-header">
          <h2>System Manufacturers</h2>
          <span
            class="more-link"
            @click="
              toNav({
                route: '/system-manufacturer-list',
                query: { companyType: 1 },
              })
            "
            >View More <i class="el-icon-arrow-right"></i
          ></span>
        </div>
        <div class="ads-grid">
          <div
            class="ad-card"
            v-for="item in system_list"
            :key="item.id"
            @click="
              toNav({ route: '/manufacturer-detail', query: { id: item.id } }, item)
            "
          >
            <div class="ad-logo-placeholder">
              <img :src="item.adLogo_full" alt="" />
            </div>
            <div class="ad-content">
              <h3 class="ellipsis">{{ item.companyName }}</h3>
            </div>
          </div>
        </div>
      </div>

      <!-- 配套厂商区域 -->
      <div class="config-ads-section">
        <div class="section-header">
          <h2>Supporting Manufacturers</h2>
          <span
            class="more-link"
            @click="
              toNav({
                route: '/system-manufacturer-list',
                query: { companyType: 2 },
              })
            "
            >View More <i class="el-icon-arrow-right"></i
          ></span>
        </div>
        <div class="ads-grid">
          <div
            class="ad-card"
            v-for="item in config_list"
            :key="item.id"
            @click="
              toNav({ route: '/manufacturer-detail', query: { id: item.id } }, item)
            "
          >
            <div class="ad-logo-placeholder">
              <img :src="item.adLogo_full" alt="" />
            </div>
            <div class="ad-content">
              <h3 class="ellipsis">{{ item.companyName }}</h3>
            </div>
          </div>
        </div>
      </div>

      <!-- 线上线下服务网络区域 -->
      <div class="service-network-section">
        <div class="section-header">
          <h2>Online Orders, Offline Service Guarantee</h2>
        </div>
        <div class="network-content">
          <div class="network-content-left">
            <div class="service-points">
              <div class="service-category">
                <h3>Global After-sales Service Network</h3>
                <div class="service-locations">
                  <div class="location-group">
                    <h4>international</h4>
                    <div class="scroll-box">
                      <div
                        class="location-item"
                        v-for="item in vuex_config.wangdian_list"
                        :key="item.name"
                      >
                        <div class="location-item-content">
                          <p class="location-item-title ellipsis-1">
                            {{ item.name }}
                          </p>
                          <!-- <p class="location-item-address ellipsis-3">
                            {{ item.address }}
                          </p> -->
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="world-map">
              <div class="map-container">
                <div class="map-placeholder">
                  <!-- 世界地图区域 -->
                  <img :src="vuex_config.wangdian_photo" alt="" />
                </div>
              </div>
            </div>
          </div>

          <div class="contact-section">
            <div class="service-stats">
              <h3>Dedicated Service Team</h3>
              <h4>Thousand-level Service Team for Precision Support</h4>
              <div class="stats-list">
                <div class="stat-item">
                  <span class="icon">🌍</span>
                  <span>1-on-1 Professional Quotation by Service Staff</span>
                </div>
                <div class="stat-item">
                  <span class="icon">⚡</span>
                  <span>Door-to-door Business Coordination by Sales Staff</span>
                </div>
                <div class="stat-item">
                  <span class="icon">📞</span>
                  <span>Technical Support by Certified Engineers</span>
                </div>
              </div>
              <div class="contact-btn" @click="toNav({ route: '/demand-form' })">
                <span>Submit Service</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 合作品牌区域 -->
      <div class="partner-brands-section">
        <div class="section-header">
          <h2>Partner Brands</h2>
        </div>
        <div class="brands-grid">
          <div
            class="brand-item"
            v-for="item in vuex_config.hezuo_brand"
            :key="item.brand_name"
          >
            <div class="brand-logo">
              <img :src="item.url" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "index",
  data() {
    return {
      // 系统厂商
      system_list: [],
      // 配套厂商
      config_list: [],
    };
  },
  computed: {
    ...mapState(["vuex_config", "baseInfo"]),
    levelName() {
      switch (this.baseInfo.userLevel) {
        case 1:
          return "Gold";
        case 2:
          return "Diamond";
        case 3:
          return "Union";
        default:
          return "Individual";
      }
    },
  },

  watch: {
    $route(to, from) {
      if (to.query.is_register) {
        // 完善信息弹框
        this.$nextTick(() => {
          this.showProfileComplete();
        });
      }
    },
  },
  mounted() {
    this.setView();
    // 判断是否是注册后跳转
    setTimeout(() => {
      if (this.$route.query.is_register && !this.baseInfo.id) {
        this.showProfileComplete();
      }
    }, 500);
    // 判断是否是完善信息后跳转
    if (localStorage.getItem("needFinish") == "true") {
      this.$showProfileComplete({
        onSubmitSuccess: (data) => {
          localStorage.removeItem("needFinish");
          location.reload();
        },
      });
    }
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
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
      this.$api({
        url: "companyList",
        method: "get",
        data: {
          page: 1,
          pageSize: 7,
          companyType: 1, // 1:系统厂商 2:配套厂商
        },
      }).then((res) => {
        if (res.code == 200) {
          this.system_list = res.data.list || [];
        }
      });
      this.$api({
        url: "companyList",
        method: "get",
        data: {
          page: 1,
          pageSize: 14,
          companyType: 2, // 1:系统厂商 2:配套厂商
        },
      }).then((res) => {
        if (res.code == 200) {
          this.config_list = res.data.list;
        }
      });
    },

    showLogin() {
      this.$showLogin({
        onLoginSuccess: (data) => {
          console.log(data);
          this.$store.commit("set_baseInfo", data);
          localStorage.setItem("needFinish", data.needFinish);
          location.reload();
        },
      });
    },

    showProfileComplete() {
      this.$showLogin({
        onLoginSuccess: (data) => {
          this.$store.commit("set_baseInfo", data);
          localStorage.setItem("needFinish", data.needFinish);
          location.reload();
        },
      });
    },

    toNav(route, item) {
      if (item && !item.can_show_detail) {
        return;
      } else {
        this.$router.push({
          path: route.route,
          query: {
            ...route.query,
          },
        });
      }
    },
    toUrl(url) {
      window.open(url, "_blank");
    },
    showRegister() {
      this.$router.push("/register");
    },
  },
};
</script>

<style lang="less">
.el-select-dropdown__item.hover,
.el-select-dropdown__item:hover {
  background: #009f39;
  color: #fff !important;
}

.el-select-dropdown__item.selected {
  color: #009f39;
}
</style>
<style scoped lang="less" src="./index.less"></style>
<style scoped lang="less" src="@/assets/h5css/page/index.less"></style>
<style scoped lang="less" src="@/assets/h5css/mobile/index.less"></style>
