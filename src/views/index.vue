<template>
  <div class="page">
    <div class="page-ctx">
      <div class="inner">
        <div class="banner-box">
          <div class="lunbo-wrap">
            <div class="lunbo-box">
              <el-carousel trigger="click" :autoplay="true">
                <el-carousel-item v-for="(item, index) in index_banners" :key="index"
                  @click.native="do_banner_click(item)">
                  <img :src="item.image" alt="" />
                </el-carousel-item>
              </el-carousel>
            </div>
          </div>
        </div>

        <div class="sec-item  sec-cate1">
          <div class="sec-title">
            Cream Charger
          </div>
          <div class="sec-ctx">
            <div class="product-wrap">
              <productList :list="product_list_1" />
            </div>
          </div>
          <div class="more-box">
            <router-link to="/cate" class="btn-ripple">View More ></router-link>
          </div>
        </div>

        <div class="sec-item  sec-cate2">
          <div class="sec-title">
            Cream Dispenser
          </div>
          <div class="sec-ctx">
            <div class="product-wrap">
              <productList :list="product_list_2" />
            </div>
          </div>
          <div class="more-box">
            <router-link to="/cate" class="btn-ripple">View More ></router-link>
          </div>
        </div>

        <div class="review-box">
          <div class="arrow-box arrow-left flex-center" @click="do_swiper_prev()">
            <i class="el-icon-arrow-left"></i>
          </div>
          <div class="arrow-box arrow-right flex-center" @click="do_swiper_next()">
            <i class="el-icon-arrow-right"></i>
          </div>

          <div class="review-swiper">
            <el-carousel ref="swiper_review" trigger="click" arrow="never" :autoplay="true">
              <el-carousel-item v-for="(items, index) in reviews_group" :key="index"
                @click.native="do_banner_click(item)">
                <div class="review-list flex">
                  <div class="review-item" v-for="(item, index) in items">
                    <div class="user-box flex">
                      <div class="avatar-box">
                        <img :src="item.image || avatar_default" alt="">
                      </div>
                      <div class="user-info">
                        <div class="user-name">
                          {{ item.nickname }}
                        </div>
                        <div class="date">
                          <!-- October 26.23 -->
                          {{ item.createdTime }}
                        </div>
                      </div>
                    </div>
                    <div class="star-box">
                      <el-rate v-model="item.star" disabled text-color="#F7BB04">
                      </el-rate>
                      <!-- <div class="star-item" v-for="(starItem,starIndex) in item.starItems" :key="starIndex">
                  <img  v-if="starItem.value == 0"  src="@/static/index/avatar.png" alt="">
                  <img  v-if="starItem.value == 1"  src="@/static/index/avatar.png" alt="">
                </div> -->
                    </div>
                    <div class="desc">
                      {{ item.content }}
                    </div>
                  </div>
                </div>
              </el-carousel-item>
            </el-carousel>
          </div>
        </div>

      </div>
    </div>


    <order_manjian_modal ref="order_manjian_modal" />
  </div>
</template>
<script>
//import { Swiper, SwiperOptions, Pagination, Navigation } from "swiper";
//import "swiper/swiper-bundle.min.css";
import productList from "@/components/product/productList.vue";
import order_manjian_modal from "@/components/activity/order_manjian_modal.vue";

import { mapState } from "vuex";

import dayjs from 'dayjs'


export default {
  name: "index",
  components: {
    productList,
    order_manjian_modal,
  },
  data() {
    return {
      todayHasPlayAni: true, //不需要展示动画


      product_list_1: [],
      product_list_2: [],

      // star_value: 4,
      reviews_group: []
      //
    };
  },
  computed: {
    ...mapState([
      //
      "index_banners",
      "index_full_ani",
      "hotSearchWords",
    ]),

  },

  watch: {},
  created() {
    this.get_cache_date()

    this.setView();
  },
  mounted() {
    this.handleAni()
  },
  methods: {
    get_cache_date() {
      let todayHasPlayAni = false;
      let date_play_str = localStorage.getItem("playAniDate") || "";
      let date_curr = dayjs().format('YYYY-MM-DD');

      console.log('date_play_str', date_play_str)
      if (date_play_str) {
        let date_play = date_play_str;
        if (date_play == date_curr) {
          //如果今天有播放当前动画  则不再播放
          todayHasPlayAni = true;
          // todayHasPlayAni = false;

          console.warn('todayHasPlayAni', todayHasPlayAni)
        }
      }

      this.todayHasPlayAni = todayHasPlayAni;

    },
    handleAni() {
      if (!this.todayHasPlayAni) {
        this.todayHasPlayAni = true;
        localStorage.setItem(
          "playAniDate",
          dayjs().format('YYYY-MM-DD')
        );
        this.$nextTick(() => {
          this.$refs.order_manjian_modal.init()
        })
      }
    },

    setView() {
      this.query_product_cate1()
      this.query_product_cate2()
      this.query_reviews()
    },

    query_product_cate1() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "product_plist",
          ifShowSku: 1,
          channelId: 780,
          page: 1,
          pageNum: 8,
        },
      }).then((res) => {
        let { code, data, count } = res;
        if (code == 200) {
          let { list, count, pages } = data;
          this.product_list_1 = list;
          // this.count = count;
        }
      });
    },
    query_product_cate2() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "product_plist",
          ifShowSku: 1,
          channelId: 792,
          page: 1,
          pageNum: 8,
        },
      }).then((res) => {
        let { code, data, count } = res;
        if (code == 200) {
          let { list, count, pages } = data;
          this.product_list_2 = list;
          // this.count = count;
        }
      });
    },

    query_reviews() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "product_comments",
          page: 1,
          pageNum: 12,
          productId: 0,
          ifIndex: 1,
        },
      }).then((res) => {
        let { code, data, count } = res;
        if (code == 200) {
          let { list, count, pages } = data;
          this.reviews = list;


          let reviews_group = [];
          let items_length = 4;//4个一组
          list.forEach((v, i) => {
            let group_index = Math.floor(i / items_length);
            if (!reviews_group[group_index]) {
              reviews_group[group_index] = [];
            }
            reviews_group[group_index].push(v);
          });
          this.reviews_group = reviews_group;
        }
      });
    },

    do_banner_click(item) {
      //console.log({ ...item });
      if (item.url) {
        window.open(item.url, "_blank");
      } else if (item.inventoryId) {
        this.$router.push("/product-detail/" + (item.skuId || item.inventoryId));
      }
    },

    do_swiper_prev() {
      this.$refs.swiper_review.prev()
    },
    do_swiper_next() {
      this.$refs.swiper_review.next()
    },
  },
};
</script>


<style lang="less">
.el-select-dropdown__item.hover,
.el-select-dropdown__item:hover {
  background: #4CA5E4;
  color: #fff !important;
}

.el-select-dropdown__item.selected {
  color: #4CA5E4;
}
</style>

<style scoped lang="less">
/deep/ .el-rate__icon {
  font-size: 20px;
  margin-right: 0;
}


.banner-box .lunbo-box {
  position: relative;
  width: 100%;
  height: 800px;

  /deep/ .el-carousel__container {
    height: 800px;
  }

  /deep/ img {
    width: 100%;
    height: 800px;
    cursor: pointer;
  }
}


.page {
  background: #FFFFFF;
  padding-top: 0;
  padding-bottom: 95px;

  // background: #fff;
  .inner {
    padding-top: 0;
    // width: @width;
    margin: 0 auto;
    position: relative;
  }
}


.sec-item {
  padding-top: 40px;

  .sec-title {
    margin-bottom: 73px;
    text-align: center;
    font-family: Poppins, Poppins;
    font-weight: 600;
    font-size: 40px;
    color: #333333;
  }

  .sec-ctx {
    width: @width;
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
      background: #4CA5E4;
      border-radius: 0px 0px 0px 0px;

      font-family: OPPOSans, OPPOSans;
      font-weight: bold;
      font-size: 18px;
      color: #FFFFFF;
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

.review-box {
  width: 1520px;
  margin: 0 auto;
  position: relative;

  .arrow-left {
    position: absolute;
    left: -80px;
    top: 50%;
    transform: translate(0, -50%);
    cursor: pointer;
    width: 40px;
    height: 40px;

    i {
      font-size: 40px
    }
  }

  .arrow-right {
    position: absolute;
    right: -80px;
    top: 50%;
    transform: translate(0, -50%);
    cursor: pointer;
    width: 40px;
    height: 40px;

    i {
      font-size: 40px
    }
  }


  .review-list {

    .review-item {
      margin-right: 26px;
      width: 360px;
      height: 280px;
      background: #FAFAFA;
      padding: 42px 50px;

      &:nth-child(4n) {
        margin-right: 0;
      }

      .user-box {
        .avatar-box {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          overflow: hidden;

          img {
            width: 64px;
            height: 64px;
            object-fit: cover;
          }
        }

        .user-info {
          padding-left: 24px;

          .user-name {
            font-family: Arial, Arial;
            font-weight: bold;
            font-size: 14px;
            color: #333333;
          }

          .date {
            margin-top: 10px;
            font-family: Arial, Arial;
            font-weight: 400;
            font-size: 12px;
            color: #999999;
          }
        }
      }

      .star-box {
        margin: 26px 0;
      }

      .desc {
        font-family: OPPOSans, OPPOSans;
        font-weight: 400;
        font-size: 12px;
        color: #555555;
        line-height: 22px;
      }
    }
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/page/index.less"></style>

<style scoped lang="less" src="@/assets/h5css/mobile/index.less"></style>
