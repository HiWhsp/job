<template>
  <div class="page">
    <cart ref="add-cart"></cart>
    <!-- <modalLoading ref="modalLoading" /> -->
    <!-- 邀请好友 -->
    <!-- <modalYaoqing ref="modalYaoqing" /> -->
    <!-- 添加成功提示 -->
    <!-- 右侧优惠券列表 -->
    <!-- <goodsCouponList ref="goodsCouponList" :list="info.yhq_list" /> -->
    <!-- <pageProductTop /> -->

    <div class="page-box">
      <div class="page-inner w-1400">
        <div class="main-content">
          <div class="ctx-top">
            <div class="ctx-left">
              <!-- 商品预览 -->
              <!-- <carouselComponent :swiperImgs="swiperImgs" /> -->
              <div class="preview-wrap">
                <detailLunbo :imageList="detailImages"/>
              </div>
            </div>

            <div class="ctx-right">
              <div class="detail-title">
                <div class="title-text ellipsis-3">
                  {{ info.title }}
                  <div class="hot">限量50台</div>
                  <div class="hot">限购2台</div>
                </div>
              </div>
              <!--              <div class="detail-desc">-->
              <!--                限量50台-->
              <!--              </div>-->
              <div class="detail-code">
                官方指导价
              </div>
              <div class="detail-price">
                CN ￥298.00
              </div>
              <div class="detail-txt ellipsis-3">
                基於R.Salvadori / C.Shelby駕駛的5號車，該車贏得了1959年勒芒24小時耐力賽。 也可以從該套件中製造出由M.Trintignant
                /P.Frère駕駛的＃6賽車和由S.Moss / J.Fairman駕駛
                完整詳細的多材料套件，包括鉛錫合金金屬，樹脂，蝕刻，橡膠輪胎的翻折零件
              </div>

              <div class="btn-box">
                <el-input-number :min="1" :max="view_info.kucun" v-model="selected_num"></el-input-number>
                <div class="btn-buy" @click="do_add_cart"><img src="@/assets/image/product/cart.png" alt="">添加到购物车</div>
                <div class="like">
                  <img src="@/assets/image/product/like.png" alt="">
                </div>
              </div>
              <div class="left-articles">
                <span>分享：</span>
                <div class="article-item">
                  <a href="/terms?id=100">
                    <img src="@/assets/image/product/article1.png" alt="">
                  </a>
                </div>
                <div class="article-item">
                  <a href="/terms?id=100">
                    <img src="@/assets/image/product/article2.png" alt="">
                  </a>
                </div>
              </div>
              <div class="down-btn-buy"><img src="@/assets/image/product/down.png" alt="">图片高清下载</div>
            </div>
          </div>

          <div class="ctx-bottom-container">
            <div class="bottom-right">
              <div class="ctx-bottom-inner">
                <div class="ctx-bottom">
                  <div class="ctx-bottom-inner">
                    <div class="bottom-nav flex">
                      <div class="nav-item" @click="togglePanel('型号说明')"
                           :class="active_panel == '型号说明' ? 'active' : ''">
                        型号说明
                      </div>

                      <div class="nav-item" @click="togglePanel('车辆描述')"
                           :class="active_panel == '车辆描述' ? 'active' : ''">
                        车辆描述
                      </div>
                    </div>

                    <div class="detail-content-box" v-if="active_panel == '型号说明'">
                      <div class="rich-html" v-html="detail.content"></div>
                    </div>
                    <div class="comment-box" v-if="active_panel == '车辆描述'">
                      <div class="rich-html" v-html="detail.cont2"></div>
                    </div>
                  </div>
                </div>
                <div class="bottom-left">
                  <div class="main-title">相关产品</div>

                  <div class="product-list">
                    <div class="product-item" v-for="(item, index) in list_goods" :key="index">
                      <div class="product-item-info">
                        <div class="img-box" @click="toDetail(item)">
                          <img :src="item.thumb" class="product-img" />
                          <!-- <shouqing :kucun="goods.kucun" /> -->
                        </div>
                        <div class="info-box">
                          <div class="title ellipsis-2">
                            {{ item.title }}
                            <div class="hot">限量50台</div>
                            <div class="hot">限购2台</div>
                          </div>

                          <div class="price-box">
                            <div class="sale">
                              <span class="huobi">CN {{ vuex_huobi }} </span>
                              <span class="value"> {{ item.priceSale }} </span>
                            </div>
                            <div class="market">
                              <img src="@/assets/image/product/like.png" alt="">
                              <img src="@/assets/image/product/cartAdd.png" alt="">
                            </div>
                          </div>
                        </div>
                        <div class="act-info" v-if="is_show_check">
                          <div class="img-check-box flex-center" @click.stop="do_toggle_check(item)">
                            <img v-if="item.checked" src="@/static/common/check1.png" alt="" class="img-check check-1" />
                            <!-- <img v-else src="@/static/common/check0.png" alt="" class="img-check check-0" /> -->
                            <img v-else src="@/static/common/check00.png" alt="" class="img-check check-0" />
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
import carouselComponent from "@/components/goods/carouselComponent.vue"; //左侧轮播
import review_list from "@/components/review/review_list.vue";
import detailLunbo from "@/components/detail/detailLunbo.vue";
import cart from '@/components/product/cart.vue';

import {mapState} from "vuex";
import {Loading} from "element-ui";

export default {
  name: "goods-detail",
  components: {
    cart,
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
      active_panel: "型号说明", //详情


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
        let {code, data, msg} = res;
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
        let {code, data, count} = res;
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
      let {nums1, nums2} = v;
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
      this.$store.commit('set_cache_payment_products', str_data)
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
        let {code, data, msg} = res;
        if (code == 200) {
          this.$refs["add-cart"].init();
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
      element.scrollIntoView({behavior: "smooth", block: "center", inline: "center"});
    },
  },
};
</script>

<style lang="less">
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

    .kefu-code {
    }

    .erweima {
    }
  }
}

.phone-tip-inner {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.page {
  background: #fff;
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
          flex: 1;
          width: 572px;
          margin-left: 38px;
          text-align: left;

          .detail-title {
            .title-text {
              font-weight: 500;
              font-size: 24px;
              color: #000;

              .hot {
                text-align: center;
                background-image: url("~@/assets/image/product/hot.png");
                background-repeat: no-repeat;
                background-size: 100% 100%;
                width: 63px;
                height: 18px;
                line-height: 18px;
                display: inline-block;
                font-size: 12px;
                color: #fff;
                font-weight: 400;
              }
            }
          }

          .detail-desc {
            width: 75px;
            height: 24px;
            color: #000;
            text-align: center;
            line-height: 24px;
            background: #1F1C1F;
            border: 1px solid #7B7B7B;
            margin-top: 10px;
          }

          .detail-code {
            color: #666;
            margin: 10px 0;
          }

          .detail-price {
            font-weight: bold;
            font-size: 26px;
            color: #000;
            margin-bottom: 20px;
          }

          .detail-txt {
            font-weight: 400;
            font-size: 14px;
            line-height: 24px;
            padding-bottom: 30px;
            border-bottom: 1px solid #EEEEEE;
            color: #000;
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

              .minus {
              }

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

              .plus {
              }
            }
          }

          .sel-num-title {
            margin: 20px 0;
          }

          .btn-box {
            margin-top: 20px;
            display: flex;
            align-items: center;

            .btn-buy {
              margin: 0 10px;
              cursor: pointer;
              width: 252px;
              height: 52px;
              background: #D41C17;
              text-align: center;
              line-height: 52px;
              color: #fff;
              font-size: 14px;

              img {
                width: 20px;
                margin-right: 10px;
              }
            }

            .like {
              cursor: pointer;
              border-radius: 50%;
              border: 1px solid #DEDEDE;
              width: 50px;
              height: 50px;
              display: flex;
              align-items: center;
              justify-content: center;

              img {
                width: 25px;
              }
            }
          }

          .left-articles {
            display: flex;
            flex-direction: row;
            align-items: center;
            color: #666;
            margin-top: 26px;

            .article-item {
              a {
                color: #666;
                font-size: 14px;

                img {
                  width: 34px;
                  margin-right: 5px;
                }
              }
            }
          }

          .down-btn-buy {
            margin-top: 20px;
            cursor: pointer;
            width: 169px;
            height: 36px;
            background: #000000;
            text-align: center;
            line-height: 36px;
            color: #fff;
            font-size: 14px;

            img {
              width: 14px;
              margin-right: 10px;
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
          color: #000;
        }

        .bottom-right {
          width: 1400px;
        }
      }

      .ctx-bottom {
        margin-top: 20px;
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
  position: relative;
  border-bottom: 1px solid #ddd;
  display: flex;
  height: 48px;
  line-height: 48px;
  margin-bottom: 20px;

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
      color: #000;

      &::after {
        content: "";
        position: absolute;
        left: 50%;
        transform: translate(-50%);
        bottom: 0;
        width: 100%;
        height: 2px;
        background: #000;
        border-radius: 50px 50px 50px 50px;
      }

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
    font-size: 20px;
    color: #000;

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
    position: relative;
    width: 322px;
    height: 346px;
    margin-right: 20px;
    margin-top: 20px;
    text-align: center;
    overflow: hidden;
    cursor: pointer;
    border: 1px solid rgba(0,0,0,0.1);
    background: #FFFFFF;

    &:nth-child(4n) {
      margin-right: 0;
    }

    &:nth-child(-n + 4) {
      margin-top: 0;
    }

    &:hover {
      .img-box {
        img {
          transform: scale(1.1);
        }
      }
    }

    .img-box {
      width: 100%;
      height: 217px;
      padding-bottom: 23px;
      margin: 0 auto;
      overflow: hidden;
      position: relative;

      img {
        width: 100%;
        height: 296px;
        object-fit: cover;
        transition: 0.3s;
      }
    }

    .info-box {
      width: 100%;
      height: 120px;
      padding: 15px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .title {
        text-align: left;
        width: 100%;
        font-family: Poppins, Poppins;
        font-weight: 600;
        font-size: 16px;
        color: #000;

        .hot {
          text-align: center;
          background-image: url("~@/assets/image/product/hot.png");
          background-repeat: no-repeat;
          background-size: 100% 100%;
          width: 63px;
          height: 18px;
          line-height: 18px;
          display: inline-block;
          font-size: 12px;
          color: #fff;
          font-weight: 400;
        }
      }


      .price-box {
        margin-top: 5px;
        display: flex;
        justify-content: space-between;
        .sale {
          span {
            font-family: OPPOSans, OPPOSans;
            font-weight: bold;
            font-size: 18px;
            color: #000;
          }

        }

        .market {
          img {
            width: 21px;
          }
          img:first-child {
            margin-right: 30px;
          }
        }
      }

      .sku-box {
        min-height: 50px;
        margin-top: 8px;
        flex-wrap: wrap;

        .sku-item {
          position: relative;
          padding: 4px 0;
          width: 50%;
          text-align: center;
          font-family: Arial, Arial;
          font-weight: 400;
          font-size: 12px;
          color: #444444;

          &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            width: 0px;
            height: 1px;
            transform: translate(-50%);
            background: #ccc;
          }

          &:hover {
            &::after {
              width: 40px;
            }
          }
        }
      }

      .btn-box {
        margin-top: 20px;

        .btn-cart {
          width: 226px;
          width: 100%;
          height: 27px;
          border-radius: 0px 0px 0px 0px;
          border: 1px solid #F74747;
          font-family: OPPOSans, OPPOSans;
          font-weight: bold;
          font-size: 12px;
          color: #F74747;

          &:hover {
            background: #F74747;
            color: #fff;
          }
        }
      }
    }
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/page/product-detail.less"></style>

<style scoped lang="less" src="@/assets/h5css/mobile/product-detail.less"></style>
