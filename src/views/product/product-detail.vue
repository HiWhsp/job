<template>
  <div class="page">
    <!-- <modalLoading ref="modalLoading" /> -->
    <product_add_cart_success_modal ref="product_add_cart_success_modal" :curr="curr" />
    <!-- 邀请好友 -->
    <!-- <modalYaoqing ref="modalYaoqing" /> -->
    <!-- 添加成功提示 -->
    <!-- 右侧优惠券列表 -->
    <!-- <goodsCouponList ref="goodsCouponList" :list="info.yhq_list" /> -->
    <!-- <pageProductTop /> -->

    <div class="page-top">
      <div class="page-bread w-1200">
        <div class="bread-box">
          <img src="@/static/common/product-home.png" alt="" />
          <router-link to="/">首页</router-link>
          <span class="bread-divider">&gt;</span>
          <router-link :to="activeCate.route">产品展示</router-link>
          <span class="bread-divider">&gt;</span>
          <template v-if="activeCate.title">
            <router-link :to="activeCate.route">{{ activeCate.title }}</router-link>
            <span class="bread-divider">&gt;</span>
          </template>
          <a href="javascirpt:void(0);">{{ info.title }}</a>
        </div>
      </div>
    </div>

    <div class="page-box">
      <div class="page-inner w-1200">
        <div class="main-content">
          <div class="ctx-top">
            <div class="ctx-left">
              <!-- 商品预览 -->
              <!-- <carouselComponent :swiperImgs="swiperImgs" /> -->
              <div class="preview-wrap">
                <detailLunbo :imageList="detailImages" />
              </div>

              <!-- <div class="shoucang-box" v-if="false">
                <div class="shoucang-left" @click="favourite_toggle">
                  <img v-if="if_shoucang" src="@img/yishoucang.png" alt="" />
                  <img v-else src="@img/weishoucang.png" alt="" />
                  <span>{{ if_shoucang ? "取消收藏" : "收藏商品" }}</span>
                </div>
                <div class="shoucang-right" @click="show_yaoqing">
                  <img src="@img/fenxiang.png" alt="" />
                  <span>分享</span>
                </div>
              </div> -->
            </div>

            <div class="ctx-right">
              <div class="detail-title">
                <div class="title-text ellipsis-3">
                  {{ info.title }}
                </div>
              </div>
              <div class="detail-desc">
                限量50台
              </div>
              <div class="detail-code">
                货号: K340001
              </div>
              <div class="detail-price">
                ￥298.00
              </div>
              <div class="detail-txt ellipsis-3">
                基於R.Salvadori / C.Shelby駕駛的5號車，該車贏得了1959年勒芒24小時耐力賽。 也可以從該套件中製造出由M.Trintignant /P.Frère駕駛的＃6賽車和由S.Moss / J.Fairman駕駛
                完整詳細的多材料套件，包括鉛錫合金金屬，樹脂，蝕刻，橡膠輪胎的翻折零件
              </div>

              <div class="btn-box">
                <div class="btn-buy">图片一键下载</div>
                <div class="left-articles">
                  <span>分享：</span>
                  <div class="article-item">
                    <a href="/terms?id=100" >
                      <img src="@/assets/image/footer/fackback.png" alt="">
                    </a>
                  </div>
                  <div class="article-item">
                    <a href="/terms?id=100" >
                      <img src="@/assets/image/footer/feishu.png" alt="">
                    </a>
                  </div>
                  <div class="article-item">
                    <a href="/terms?id=100" >
                      <img src="@/assets/image/footer/weibo.png" alt="">
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>



          <div class="ctx-bottom-container">



            <div class="bottom-right">
              <div class="ctx-bottom">
                <div class="ctx-bottom-inner">
                  <!-- v-if="active_panel == '详情'" -->
                  <div class="detail-content-box">
                    <div class="panel-title" data-title="详情">
                      详情说明
                    </div>
                    <div class="panel-title-line"></div>
                    <div class="rich-html" v-html="info.content"></div>
                    <div class="rich-html" v-html="info.cont2"></div>
                    <div class="rich-html" v-html="info.cont3"></div>
                  </div>
                              <div class="bottom-left">
                                <div class="main-title">相关产品</div>

                                <div class="product-list">
                                  <div class="product-item" v-for="(item, index)  in list_goods" :key="index" @click="toDetail(item)">
                                    <div class="poster-box scale-box">
                                      <img :src="item.img" alt="" class="poster scale-img">
                                    </div>
                                    <div class="info-box">
                                      <div class="title ellipsis-2">12323</div>
                                      <div class="pirce-box">
                                        <div class="price-info">
                                          <div class="price-1">￥298.00</div>
                                        </div>
                                        <div class="yishou">
                                          限量50台
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

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import product_add_cart_success_modal from "@/components/product/product_add_cart_success_modal.vue";
import carouselComponent from "@/components/goods/carouselComponent.vue"; //左侧轮播
import review_list from "@/components/review/review_list.vue";
import detailLunbo from "@/components/detail/detailLunbo.vue";

import { mapState } from "vuex";
import { Loading } from "element-ui";

export default {
  name: "goods-detail",
  components: {
    product_add_cart_success_modal,
    carouselComponent,
    review_list,
    detailLunbo,
  },
  data() {
    return {
      info: {},
      is_fav: false,
      reviews: [],
      pagination: {
        page: 1,
        pageNum: 10,
      },
      //
      //
      //
      //

      is_prod: process.env.NODE_ENV == "production",

      detailImages: [],

      Loading,
      loadingInstance: null,

      query_wenxian_done: false,
      activeCate: {
        route: "/",
      },

      list_goods: [],
      product_list: [],
      group_list_wenxian: [],
      list_wenxian: [],
      count_wenxian: 0,
      query_field_done: false, //参数字段
      field_list: [],
      param_list: [],
      all_field: [],

      id: this.$route.query.id || "", //规格id
      product_id: "", //产品id

      //规格数量
      sku_mode: "单规格",
      sku_select: {}, //选择的规格
      selected_num: 1, //商品数量
      sku_list: [], //规格列表
      show_sku: false,
      //拆分状态下选择的商品属性
      select_shuxing_list: [],

      //优惠券
      list_coupon: [],
      show_coupon: false,

      // 其他
      active_panel: "详情", //详情


      pagination_relative: {
        page: 1,
        pageNum: 5,
      },

      select_inventoryId: "",

      timer: null, //促销计算
      remaining: "", //促销剩余时间

      coupons: [], //可用的优惠券
      isFavourite: false, //未收藏

      selectedSkuComb: {}, //选择的商品规格信息 立即购买需要金额
      show_sku: false,
      curr: {}, //产品
      detail: {}, //产品
      current: 0, //轮播图指示器
      swiperImgs: [], //轮播图
      activeSwipeIndex: 0, //轮播图指示器
    };
  },

  computed: {
    ...mapState(["kefu_qq"]),

    //预览信息
    view_info() {
      let view_info = this.curr;
      if (this.sku_select.inventoryId) {
        view_info = this.sku_select;
      }
      return view_info;
    },

    poster() {
      let ret = "";
      if (this.info.images && this.info.images.length) {
        ret = this.info.images[0];
      }
      return ret;
    },

    huoqi_text() {
      let text = "现货";
      if (this.info.skuDay) {
        let num = parseInt(this.info.skuDay);
        if (num) {
          text = "货期" + num + "天";
        }
      }
      return text;
    },
  },

  watch: {
    param_list(val) {
      //console.log(" ******** 产品参数 ******** ", val);
    },
  },

  beforeRouteUpdate(to, from, next) {
    //console.log("组件复用");
    //console.log(to, from);

    next(to.query);
    this.id = this.$route.query.id || ""; //规格id
    this.setView();
  },

  created() {
    this.setView();
  },

  beforeDestroy() {
    //console.log("销毁详情页 handleScrollEvent");

    document.removeEventListener("scroll", this.handleScrollEvent);
  },

  methods: {
    toDetail(item) {
      this.$router.push(`/product-detail?id=${item.inventoryId}`)
    },

    setView() {
      this.query_product_detail()
    },

    query_product_detail() {
      this.showLoading();
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "product_detail",
          inventoryId: this.id,
          ifShowSku: 1, //是否展示全部规格skus：0-不需要展示 1-需要展示（规格以组合形式展示，即规格1,规格2 组合一起的）
        },
      }).then((res) => {
        //console.log("商品详情", res);
        let { code, data, msg } = res;
        if (res.code == 200) {
          this.info = data;
          this.add_history_record()
          // this.reviews = data.commentList;
          this.query_reviews(); //评论



          this.curr = data;
          this.detail = data;
          this.swiperImgs = data.images;
          this.detailImages = data.images.map((v, i) => ({
            index: i,
            image: v
          }));

          this.posterSrc = data.images[0];
          this.set_sku(data);
        } else {
          if (message == "商品不存在或已下架") {
            this.$router.push("/");
          }
        }
        this.hideLoading();
      });
    },



    showLoading() {
      this.loadingInstance = Loading.service({
        lock: true,
        text: "数据查询中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      // if (this.$refs.modalLoading) {
      //   this.$refs.modalLoading.init();
      // }
    },
    hideLoading() {
      this.loadingInstance.close();

      // this.$refs.modalLoading.close();

      // this.loadingInstance = Loading.service({
      //   lock: true,
      //   text: "数据查询中...",
      //   spinner: "el-icon-loading",
      //   background: "rgba(0, 0, 0, 0.7)",
      // });
    },


    //查询评论列表
    query_reviews() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "product_comments",
          productId: this.info.productId,
          ...this.pagination
        },
      }).then((res) => {
        let { code, data, count } = res;
        if (code == 200) {
          this.reviews = data.list;
        }
      });
    },


    add_history_record() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "product_operate",
          productId: this.info.productId,
          operateType: 2,//1-关注 2-足迹
          operateSence: 0,//0-关注（添加记录） 1-取消关注（删除记录）
        },
      }).then((res) => {

      });
    },

    do_add_fav() {
      if (!this.mix_get_login_status()) {
        return
      }

      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "product_operate",
          productId: this.info.productId,
          operateType: 1,//1-关注 2-足迹
          operateSence: 0,//0-关注（添加记录） 1-取消关注（删除记录）
        },
      }).then((res) => {
        alert(res)
        if (res.code == 200) {
          this.is_fav = !this.is_fav
        }
      });
    },




    //商品sku 属性选择
    onSelectShuXing(item) {
      //console.log("商品属性选择", { ...item });

      //当前属性对应商品库存不足
      if (this.if_out_stock(item)) {
        return;
      }

      let key = item.key;
      let index = this.select_shuxing_list.findIndex((v) => v.id == item.id);
      if (index < 0) {
        //已选的属性不包含当前属性
        //需要查询是否已选过当前属性其他属性值
        let prev_item = this.select_shuxing_list.find((v) => v.key == key);
        let prev_item_index = this.select_shuxing_list.findIndex((v) => v.key == key);
        if (prev_item) {
          this.select_shuxing_list.splice(prev_item_index, 1, item);
        } else {
          this.select_shuxing_list.push(item);
        }
      } else {
        this.select_shuxing_list.splice(index, 1, {
          key: key,
        });
      }

      this.set_sku_select();
    },

    //设置商品选择的规格
    set_sku_select() {
      if (Object.keys(this.info.skus).length == this.select_shuxing_list.length) {
        let key_ids = this.select_shuxing_list.map((v) => v.id).join("-");
        this.sku_select =
          this.sku_list.find((v) => v.key_ids == key_ids) || {};
      }

      //console.log("已选的商品属性值 select_shuxing_list", this.select_shuxing_list);
      //console.log("商品规格 sku_select", { ...this.sku_select });
    },

    //是否已选择当亲属性
    if_shuxing_list_contain(item) {
      return !!this.select_shuxing_list.find((v) => v.id == item.id);
    },

    //当前属性商品库存是否不足
    if_out_stock(item) {
      //拼接目标规格的属性集合
      //比对目标属性是否库存不足
      let key = item.key;
      let id_arr = [];
      this.select_shuxing_list.forEach((v) => {
        if (v.id && key != v.key) {
          id_arr.push(v.id);
        } else if (key == v.key) {
          id_arr.push(item.id);
        }
      });

      //从所有规格中过滤出符合目标属性的规格
      let list_filter = this.sku_list.filter((v) => {
        let has_pipei = id_arr.every((id) => v.key_ids.includes(id));

        return has_pipei;
      });

      let ret = false;

      if (list_filter.length > 1) {
        ret = false;
      } else if (list_filter.length == 1) {
        let obj = list_filter[0];
        if (+obj.kucun) {
          ret = false;
        } else {
          ret = true;
        }
      } else {
        ret = true;
      }

      return ret;
    },

    //处理产品图片
    handleProductImage(image_list) {
      //处理产品图片
      // //console.log("产品列表数据 image_list", image_list);
      var promise_arr = [];
      image_list.forEach((src, index) => {
        var promise = this.loadImageAsync(src);
        promise_arr.push(promise);
      });
      Promise.all(promise_arr).then((resAll) => {
        // //console.log("图片全部加载完成 resAll", resAll);

        //设置产品图片
        this.product_list.forEach((v, index) => {
          if (!resAll[index]) {
            v.img = v.default_img;
          }
        });
      });
      //产品图片处理完成
    },

    //设置分类 面包屑导航需要
    setActiveCate() {
      if (this.product_cates_all && this.product_cates_all.length) {
        //实验耗材
        var cate_id = this.info.channelId;
        this.activeCate = this.product_cates_all.find((v) => v.id == cate_id) || {};

        //console.log("activeCate", { ...this.activeCate });

        // this.queryCateParams();
        this.queryFilterParams();
      } else {
        setTimeout(() => {
          this.setActiveCate();
        }, 100);
      }
    },

    //设置规格
    set_sku(data) {
      //规格列表组
      let sku_list = [];
      if (data.inventorys && data.inventorys.length) {
        data.inventorys.forEach((v) => {
          sku_list.push({
            ...v,
            kucun: +v.kucun,
            key_vals: v.key_vals,
          });
        });
      } else {
        sku_list = [
          {
            status: this.info.product_status,
            image: this.info.images[0],
            inventoryId: this.info.inventoryId,
            key_vals: this.info.key_vals == "无" ? "默认" : this.info.key_vals,
            kucun: +this.info.kucun,
            priceMarket: this.info.priceMarket,
            priceSale: this.info.priceSale,
            priceSale2: this.info.priceSale2,
            priceSale3: this.info.priceSale3,
            nums1: this.info.nums1,
            nums2: this.info.nums2,
          },
        ];
      }

      //单规格商品 默认勾选
      if (sku_list.length == 1) {
        this.sku_select = sku_list[0];
      } else {
        // this.sku_select = {};
        this.sku_select =
          sku_list.find((v) => v.inventoryId == this.id) || {};
      }
      this.sku_list = sku_list;

      //规格拆分
      let skus = data.skus || {};
      if (skus && Object.keys(skus).length) {
        this.sku_mode = "多规格";
        let select_shuxing_list = [];
        Object.keys(skus).forEach((v) => {
          select_shuxing_list.push({
            key: skus[v].key,
          });
        });

        //console.log("商品规格默认 select_shuxing_list", select_shuxing_list);

        this.select_shuxing_list = select_shuxing_list;
      } else {
        this.sku_mode = "单规格";
      }
    },

    //切换规格
    toggle_sku(item) {
      if (item.kucun) {
        this.sku_select = item;
        if (this.selected_num > item.kucun) {
          this.selected_num = item.kucun;
        }
      }
    },



    //商品是否选择规格检测
    checkedSelected() {
      //console.log("检测是否选择了商品", this.sku_select);

      if (!this.sku_select.inventoryId) {
        alertErr("请选择商品规格");
        return false;
      }

      if (this.sku_select.kucun < this.selected_num) {
        alertErr("该商品库存不足,无法购买");
        return false;
      }

      return true;
    },

    //处理购物车列表数据
    handlePiPrice(item) {
      let v = item;
      let { nums1, nums2 } = v;
      let num = this.selected_num;
      let priceSale = 0;
      if (+nums2 && +nums1) {
        if (+num > +(+nums2)) {
          priceSale = v.priceSale3;
        } else if (+num >= +nums1) {
          priceSale = v.priceSale2;
        } else {
          priceSale = v.price_origin;
        }
      }

      return priceSale;
    },

    //立即购买
    do_pay_now() {
      if (!this.mix_get_login_status()) {
        return
      }
      var isSelect = this.checkedSelected();
      if (!isSelect) {
        return;
      }


      let info = this.info;
      let sku_item = this.sku_select;
      let data_format = [{
        title: info.title,
        image: sku_item.image || info.thumb,
        inventoryId: sku_item.inventoryId,
        productId: info.productId,
        keyVals: sku_item.keyVals,
        num: this.selected_num,
        priceSale: sku_item.priceSale,
        priceMarket: sku_item.priceMarket,
      }];
      let str_data = JSON.stringify(data_format);
      this.$store.commit('set_cache_payment_products',str_data)
      this.$router.push({
        path: "/order-submit",
      });
    },

    onBlur_selected_num() {
      //console.log(this.selected_num + "");

      this.selected_num = parseInt(this.selected_num) || 1;
    },

    //购车添加商品
    do_add_cart() {
      if (!this.mix_get_login_status()) {
        return
      }


      //console.log("shopcart_add 加入购物车");
      if (!this.sku_select.inventoryId) {
        alertErr("请选择商品规格！");
        return;
      }
      if (this.selected_num > this.sku_select.kucun) {
        alertErr("当前商品库存不足！");
        return;
      }

      if (this.sku_select.status == -1) {
        alertErr("当前商品已下架！");
        return;
      }

      // debugger
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "gouwuche_add",
          inventoryId: this.sku_select.inventoryId,
          num: this.selected_num,
        },
      }).then((res) => {
        alert(res)
        let { code, data, msg } = res;
        if (code == 200) {
          this.$refs.product_add_cart_success_modal.init({
            num: this.selected_num,
            ...this.sku_select,
          });

          this.$store.commit('set_vuex_cart_number', data.count)
        }
      });
    },


    //商品评价页面
    go_comments() {
      this.$router.push({
        path: "/comments",
        query: {
          pid: this.productId,
        },
      });
    },


    //预览图片
    previewImage(src, index, swiperImgs) {
      ImagePreview({
        images: swiperImgs,
        startPosition: index,
        closeable: true,
      });
    },

    //商品详情 内含图片
    imageEnlargement(e) {
      if (e.target.nodeName == "IMG") {
        //判断点击富文本内容为img图片
        ImagePreview({
          images: [e.target.currentSrc], //获取当前图片src
          showIndex: false,
          loop: false,
        });
      } else {
        //console.log("点击内容不为img");
      }
    },



    //
    togglePanel(name) {
      // return;
      this.active_panel = name;
      if (name == "详情") {
        this.scrollToTarget(".detail-content-box");
      } else if (name == "评价") {
        this.scrollToTarget(".comment-box");
      }
    },



    //商品评价分页
    changePage_comment(page) {
      this.pagination.page = page;
      this.query_comments();
    },


    //滚动到指定位置
    scrollToTarget(clsName) {
      // var element = document.querySelector(".wenxian-box");
      var element = document.querySelector(clsName);
      element.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
    },
  },
};
</script>

<style lang="less">
.pop-kefu-inner {
  padding: 25px;

  .kefu-tip {
    margin-bottom: 20px;
  }
}

.detail-qrcode {
  .flex-center();
  text-align: center;

  img {
    width: 150px;
    height: 150px;
  }
}
</style>

<style scoped lang="less">
.page-top {
  padding: 24px 0;
  position: relative;
  border-top: 1px solid #313131;
  border-bottom: 1px solid #313131;

  .page-top-banner {
    img {
      width: 100%;
    }
  }

  .page-bread {

    margin: 0 auto;
    height: auto;
    // background: #f5f5f5;
    padding: 0 0;

    .bread-box {
      height: auto;
      display: flex;
      align-items: center;

      img {
        width: 15px;
        margin-right: 10px;
      }

      .bread-divider {
        margin: 0 10px;
        font-size: 14px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        font-weight: 400;
        color: #999999;
      }

      a {
        font-size: 14px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        font-weight: 400;
        color: #999999;

        &:hover {
          color: #F74747;
        }
      }
    }
  }
}

.pop-kefu {
  .pop-kefu-inner {
    text-align: center;

    .kefu-tip {
      text-align: center;
      font-size: 14px;
    }

    .kefu-code {}

    .erweima {}
  }
}

.phone-tip-inner {
    display: flex;
  align-items: center;
  cursor: pointer;
}

.page {
  background: #000;
  // padding-top: 32px;
  min-height: 50vh;
  font-size: 14px;

  .page-box {
    padding-top: 32px;
  }

  .page-inner {
    // overflow: hidden;
    margin: 0 auto;
    margin-top: 0;
    margin-bottom: 0;
    padding-bottom: 50px;

    .main-content {
      // background-color: #fff;

      .ctx-top {
        display: flex;
        align-items: flex-start;
      }


      .ctx-top {
        padding: 0;
        display: flex;
        justify-content: space-between;

        .ctx-left {
          width: 582px;
          position: relative;

          .promotion-box {
            position: absolute;
            bottom: 0;
            width: 100%;

            .limit-end-box {
              font-size: 0.3rem;
              color: #F74747;
              font-weight: bold;
              text-align: center;
              padding-bottom: 0.5rem;
            }
          }

          .shoucang-box {
            margin-top: 20px;
              display: flex;
  align-items: center;
  justify-content: space-between;
            width: 100%;

            .yes {
              color: #f00;
            }

            .no {
              color: #000;
            }

            .shoucang-left {
              cursor: pointer;
                display: flex;
  align-items: center;

              img {
                width: 20px;
                margin-right: 15px;
              }

              span {
                font-size: 16px;
                font-family: PingFang SC;
                font-weight: 400;
                line-height: 36px;
                color: #333333;
              }
            }

            .shoucang-right {
              cursor: pointer;
                display: flex;
  align-items: center;

              img {
                width: 20px;
                margin-right: 15px;
              }

              span {
                font-size: 16px;
                font-family: PingFang SC;
                font-weight: 400;
                line-height: 36px;
                color: #333333;
              }
            }
          }
        }

        .ctx-right {
          width: 572px;
          margin-left: 46px;
          text-align: left;

          .detail-title {
            .title-text {
              font-weight: 500;
              font-size: 24px;
              color: #FFFFFF;
            }
          }

          .detail-desc {
            width: 75px;
            height: 24px;
            color: #fff;
            text-align: center;
            line-height: 24px;
            background: #1F1C1F;
            border: 1px solid #7B7B7B;
          }
          .detail-code {
            color: #fff;
            margin: 20px 0;
          }
          .detail-price {
            font-weight: bold;
            font-size: 26px;
            color: #FFFFFF;
            margin-bottom: 20px;
          }
          .detail-txt {
            font-weight: 400;
            font-size: 14px;
            line-height: 24px;
            color: #fff;
          }

          .info-box {
            padding: 25px 20px;
            background: #f7f7f7;
            background-repeat: no-repeat;
            background-size: 100% 100%;

            .list {
              .item {
                  display: flex;
                  align-items: center;

                .label {
                  width: 80px;
                  font-size: 16px;
                  font-family: PingFang SC, PingFang SC;
                  font-weight: 500;
                  color: #353535;
                }

                .vals {
                    display: flex;
  align-items: center;
                  flex: 1;

                  font-size: 16px;
                  font-family: PingFang SC, PingFang SC;
                  font-weight: 500;
                  color: #353535;

                  &.vals-price {
                    font-size: 24px;
                    font-family: PingFang SC, PingFang SC;
                    font-weight: bold;
                    color: #eb0611;
                  }

                  .val {
                    flex: 1;
                  }
                }
              }
            }

            .price {
                display: flex;
  align-items: center;

              .number {
                font-size: 28px;
                font-family: Microsoft YaHei-Bold, Microsoft YaHei;
                font-weight: bold;
                color: #ea3200;
              }
            }
          }


          .info-texts {
              display: flex;
  align-items: center;
  justify-content: space-between;
            padding: 0 32px;
            height: 45px;
            background: #F8F8F8;

            .text-item {
                display: flex;
  align-items: center;

              .label {
                font-size: 14px;
                color: #6A6A6A;
              }

              .text {
                margin-left: 6px;
                font-size: 16px;
                color: #E1251B;
              }
            }

            .shoucang-box {
              cursor: pointer;

              img {
                width: 18px;
              }

              .text {
                font-size: 13px;
                color: #747474;
              }

            }
          }

          .sku-box {
            margin-top: 35px;
            display: flex;
            align-items: flex-start;

            .sku-label {
              margin-top: 8px;
              min-width: 84px;
            }
          }

          .sku-list {
            flex: 1;
              display: flex;
  align-items: center;
            flex-wrap: wrap;

            .sku-item {
              // .flex-center();
              margin-bottom: 10px;
              padding: 0 6px;
              margin-right: 20px;
              text-align: center;
              line-height: 36px;
              min-width: 108px;
              height: 36px;
              background: #ffffff;
              border-radius: 0px 0px 0px 0px;
              border: 1px solid #dddddd;
              font-size: 14px;
              font-family: PingFang SC, PingFang SC;
              font-weight: 500;
              color: #333333;



              &:disabled {
                cursor: not-allowed;
                opacity: 0.6;
                color: #ccc;
              }

              &.active {
                border: 1px solid #F74747;
                color: #eb0611;

                .img-box {
                  img {
                    visibility: visible !important;
                  }
                }

                .text {
                  color: #F74747;
                }

                .price {
                  color: #F74747;
                }
              }

              .text {
                text-align: center;
                flex: 1;
                font-size: 14px;
                font-family: Microsoft YaHei-Regular, Microsoft YaHei;
                font-weight: 400;
                color: #333333;
              }
            }
          }

          .phone-tip {
            margin-top: 16px;
            display: flex;
            justify-content: flex-end;

            font-size: 14px;
            font-family: Microsoft YaHei-Regular, Microsoft YaHei;
            font-weight: 400;
            color: #808080;

            img {
              margin-left: 10px;
              width: 24px;
            }
          }



          .shuliang-box {
            margin-top: 0px;
              display: flex;
  align-items: center;

            .sel-num-title {
              min-width: 84px;
              font-family: Arial, Arial;
              font-size: 16px;
              color: #333333;
            }

            .shuliang {
              min-width: 105px;
                display: flex;
  align-items: center;

              div {
                width: 30px;
                height: 30px;
                cursor: pointer;
                user-select: none;

                &:hover {
                  opacity: 0.8;
                }

                img {
                  width: 30px;
                  height: 30px;
                  vertical-align: middle;
                }
              }

              .minus {}

              input {
                outline: none;
                margin: 0 10px;
                display: inline-block;
                border: 1px solid #ccc;

                width: 40px;
                height: 30px;
                line-height: 30px;
                text-align: center;

                font-size: 20px;
                font-family: Arial;
                font-weight: 400;
                color: #4a4a4a;
              }

              input::-webkit-outer-spin-button,
              input::-webkit-inner-spin-button {
                -webkit-appearance: none !important;
              }

              /* chrome */
              input[type="number"] {
                -moz-appearance: textfield;
                /* firefox */
              }

              .plus {}
            }
          }

          .sel-num-title {
            margin: 20px 0;
          }

          .btn-box {
            margin-top: 20px;
            display: flex;
            align-items: end;
            justify-content: space-between;


            .btn-buy {
              cursor: pointer;
              width: 256px;
              height: 48px;
              background: #DF1626;
              text-align: center;
              line-height: 48px;
              color: #fff;
            }
            .left-articles {
              display: flex;
              flex-direction: row;
              color: #E6E6E6;
              .article-item {
                a {
                  color: #666;
                  font-size: 14px;
                  img {
                    width: 24px;
                    height: 24px;
                    margin-right: 16px;
                  }
                }
              }
            }
          }
        }
      }



      .ctx-bottom-container {
        margin-top: 16px;
        display: flex;
        justify-content: space-between;

        .bottom-left {
          width: 100%;
          font-weight: 400;
          font-size: 16px;
          color: #fff;
        }

        .bottom-right {
          width: 1200px;
        }
      }

      .ctx-bottom {
        margin-top: 50px;
      }

      .ctx-bottom-inner {
        width: 100%;
        text-align: left;

        .panel-title {
          margin-bottom: 15px;
          font-family: Poppins, Poppins;
          font-weight: bold;
          font-size: 25px;
          color: #fff;
        }

        .panel-title-line {
          position: relative;
          border-bottom: 1px solid #696969;
          line-height: 45px;
          padding-left: 16px;
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: 400;
          font-size: 16px;
          color: #333333;
          margin-bottom: 20px;

          &::after {
            position: absolute;
            content: '';
            background: #fff;
            bottom: 0;
            width: 96px;
            left: 0px;
            height: 2px;
          }
        }
      }
    }
  }
}

.bottom-nav {
  background: #F9F9F9;
  position: relative;
  border-bottom: 1px solid #ddd;
  display: flex;
  height: 48px;
  /*no */
  line-height: 48px;
  /*no */

  .count-num {
    color: #F74747;
  }

  .nav-item {
    min-width: 100px;
    text-align: center;
    cursor: pointer;
    text-align: center;
    margin-right: 10px;
    // background: #fff;
    font-size: 14px;
    font-family: Microsoft YaHei-Regular, Microsoft YaHei;
    font-weight: 400;
    color: #000000;

    &:last-child {
      margin-right: 0;
    }

    &.active {

      font-weight: bold;
      position: relative;
      background: #333333;
      color: #FFFFFF;

      // &::after {
      //   content: "";
      //   position: absolute;
      //   left: 50%;
      //   transform: translate(-50%);
      //   bottom: 0;
      //   width: 40px;
      //   height: 4px;
      //   background: #eb0611;
      //   border-radius: 50px 50px 50px 50px;
      // }

      .count-num {
        color: #fff;
      }
    }
  }

  button {
    position: absolute;
    right: 0;
    top: 8px;
    /*no */
    right: 8px;
    /*no */
    min-width: 126px;
    /*no */
    height: 32px;
    /*no */

    &.contact {
      background: #F74747;
      .flex-center();
      right: 20px;

      &:hover {
        opacity: 0.8;
      }

      img {
        width: 20px;
        margin-right: 10px;
        vertical-align: middle;
      }

      span {
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 20px;
        color: #ffffff;
      }
    }
  }
}

.detail-content {
  margin-top: 30px;

  .big-img-list {
    .big-img-item {
      margin-bottom: 10px;
      padding: 30px;
      margin: 10px auto;

      img {
        width: 400px;
        height: 300px;
      }
    }
  }
}

.detail-content-box {
  min-height: 10vh;
  // padding: 0;
  text-align: left;

  /deep/ img {
    display: block;
    max-width: 100%;
    margin: 0 auto;
  }

  .params-html {
    margin-bottom: 32px;

    .params-box {
      .params-item {
          display: flex;
  align-items: center;
        border: 1px solid #ccc;
        border-bottom: none;

        &:last-child {
          border-bottom: 1px solid #ccc;
        }

        &[data-key="target_backmsg"] {
          display: none;
        }

        .params-label {
          display: flex;
          align-items: center;
          align-self: stretch;
          background: #f7f7f7;
          min-height: 50px;
          line-height: 50px;
          width: 300px;
          padding: 0 24px;
          font-size: 14px;
          font-family: Microsoft YaHei-Bold, Microsoft YaHei;
          font-weight: bold;
          color: #666666;

          font-size: 16px;
        }

        .params-val {
          flex: 1;
          min-height: 50px;
          line-height: 50px;
          padding: 0 24px;
          font-size: 14px;
          font-family: Microsoft YaHei-Bold, Microsoft YaHei;
          font-weight: bold;
          color: #666666;

          font-size: 16px;
        }
      }
    }
  }
}

.rich-html {
  line-height: 2;
  // overflow-x: auto;

  /deep/ table {
    width: 100%;
    margin: 0 auto;
    table-layout: auto;

    td {
      border: 1px solid #aaa;
      border-bottom: none;
      border-right: none;
      min-height: 3.6rem;
      height: auto !important;
      line-height: 3rem;

      p,
      span,
      strong,
      i {
        font-size: 1.2rem;
      }
    }

    tr {
      height: auto !important;

      &.firstRow {
        td {

          p,
          span,
          strong,
          i {
            font-size: 1.4rem;
          }
        }
      }
    }

    tr td:last-child {
      border-right: 1px solid #aaa;
    }

    tr:last-child {
      td {
        border-bottom: 1px solid #aaa;
      }
    }
  }
}

.bottom-left {
  margin-top: 50px;
  .main-title {
    position: relative;
    border-bottom: 1px solid #696969;
    line-height: 45px;
    font-weight: 400;
    font-size: 24px;
    color: #fff;

    &::after {
      position: absolute;
      content: '';
      background: #fff;
      bottom: 0;
      width: 96px;
      left: 0px;
      height: 2px;
    }
  }
}

.product-list {
  margin-top: 12px;
  display: flex;

  .product-item {

    margin-bottom: 10px;
    margin-right: 16px;
    margin-top: 16px;
    width: 285px;
    background: #1F1C1F;
    cursor: pointer;

    &:nth-child(4n) {
      margin-right: 0;
    }

    &:nth-child(-n + 4) {
      margin-top: 0;
    }

    &:hover {
      .title {
        color: #F74747 !important;
      }
    }

    .poster-box {
      width: 285px;
      height: 190px;

      .poster {
        width: 285px;
        height: 190px;
      }
    }

    .info-box {
      height: 113px;
      padding: 13px 15px 15px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .title {
        font-weight: 400;
        font-size: 16px;
        color: #fff;
      }

      .pirce-box {
        margin-top: 15px;
          display: flex;
  align-items: center;
  justify-content: space-between;

        .price-info {
          display: flex;
          align-items: center;

          .price-1 {
            font-weight: 400;
            font-size: 18px;
            color: #fff;
          }
        }

        .yishou {
          width: 75px;
          height: 24px;
          background: #1F1C1F;
          border: 1px solid #7B7B7B;
          font-size: 12px;
          text-align: center;
          line-height: 24px;
        }
      }


      .act-box {
        margin-top: 15px;
        border-top: 1px solid #ddd;
        padding-top: 5px;
          display: flex;
  align-items: center;
  justify-content: space-between;

        .fav-box {
          .flex-center();
          width: fit-content;
          height: 32px;

          img {
            margin-right: 5px;
            width: 18px;
            height: 18px;
          }
        }

        .cart-box {
          .flex-center();
          width: 32px;
          height: 32px;

          img {
            width: 32px;
            height: 32px;
          }
        }
      }
    }
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/page/product-detail.less"></style>

<style scoped lang="less" src="@/assets/h5css/mobile/product-detail.less"></style>
