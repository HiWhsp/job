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
      <div class="page-bread">
        <div class="bread-box">
          <img src="@/static/common/product-home.png" alt="" />
          <router-link to="/">Home</router-link>
          <span class="bread-divider">&gt;</span>
          <!-- <router-link to="/products">产品中心</router-link>
          <span class="bread-divider">&gt;</span> -->
          <router-link :to="activeCate.route">产品类型</router-link>
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
      <div class="page-inner">
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
              <div class="detail-title flex">
                <div class="title-text">
                  {{ info.title }}
                </div>
                <div class="price-box">
                  {{ vuex_huobi }} {{ info.priceSale }}
                </div>
              </div>
              <div class="detail-desc" v-if="info.subtitle">
                {{ info.subtitle }}
              </div>
              <div class="detail-desc" v-if="info.jianjie">
                {{ info.jianjie }}
              </div>

              <!-- <div class="info-box">
                <div class="list">
                  <div class="item" style="margin-bottom: 10px">
                    <div class="label">销售价</div>
                    <div class="vals vals-price">
                      <div class="val">{{vuex_huobi}} {{ view_info.priceSale }}</div>
                    </div>
                  </div>
                  <div class="item">
                    <div class="label">市场价</div>
                    <div class="vals">
                      <div class="val " style="text-decoration: line-through; color:#B5B5B5; ">{{vuex_huobi}} {{
                        view_info.priceMarket
                      }}</div>
                    </div>
                  </div>
                </div>
              </div> -->

              <!-- <div class="info-texts">
                <div class="text-item">
                  <div class="label">总销量</div>
                  <div class="text">{{ info.orders }}</div>
                </div>
                <div class="text-item">
                  <div class="label">累计评价</div>
                  <div class="text">{{ info.comment_num }}</div>
                </div>
                <div class="text-item shoucang-box" @click="favourite_toggle()">
                  <div class="label">
                    <div class="shoucang-box">
                      <img v-if="if_shoucang" src="@img/detail-fav-1.png" alt="" />
                      <img v-else src="@img/detail-fav-0.png" alt="" />
                    </div>
                  </div>
                  <div class="text"> <span>{{ if_shoucang ? "取消收藏" : "收藏商品" }}</span></div>
                </div>
              </div> -->


              <div class="other-box">
                <div class="sku-box">
                  <div class="sku-label">选择规格</div>
                  <div class="sku-list">
                    <button class="sku-item" :disabled="!item.kucun || item.status == -1"
                      v-for="(item, index) in sku_list" :key="index" :class="{
                        active: item.inventoryId == sku_select.inventoryId,
                      }" @click="toggle_sku(item)">
                      <div class="text">
                        {{ item.keyVals | f_guige }}
                      </div>
                    </button>
                  </div>
                </div>

                <!-- <div class="shuliang-box">
                  <div class="sel-num-title">数量</div>

                  <div class="shuliang">
                    <div class="minus" @click="selected_num > 1 ? selected_num-- : (selected_num = 1)">
                      <img src="@img/shuliang-minus.png" alt="" />
                    </div>
                    <input type="number" v-model="selected_num" @blur="onBlur_selected_num" />
                    <div class="plus" @click="selected_num++">
                      <img src="@img/shuliang-plus.png" alt="" />
                    </div>
                  </div>
                  <span style="margin-left: 30px"> 库存： {{ view_info.kucun }} </span>
                </div> -->

                <div class="btn-box flex">
                  <button class="btn-ripple flex-center btn-buy " @click="do_pay_now()">立即购买</button>
                  <button class="btn-ripple flex-center btn-add-cart " @click="do_add_cart()">
                    <!-- <img src="@img/detail-cart.png" alt="" class="cart"> -->
                    加入购物车
                  </button>
                  <button class="btn-ripple flex-center btn-add-fav " @click="do_add_fav()">
                    {{ is_fav ? '取消收藏' : '添加收藏' }}
                  </button>
                </div>
              </div>
            </div>
          </div>



          <div class="ctx-bottom-container">

            <!-- <div class="bottom-left">
              <div class="main-title">相关产品推荐</div>

              <div class="product-list">
                <div class="product-item" v-for="(item, index)  in list_goods" :key="index" @click="toDetail(item)">
                  <div class="poster-box scale-box">
                    <img :src="item.img" alt="" class="poster scale-img">
                  </div>
                  <div class="info-box">
                    <div class="title">{{ item.title }}</div>
                    <div class="pirce-box">
                      <div class="price-info">
                        <div class="price-1">{{ item.priceSale }}</div>
                        <div class="price-2">{{ item.priceMarket }}</div>
                      </div>
                      <div class="yishou">
                        已售{{ item.orders }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div> -->

            <div class="bottom-right">
              <div class="ctx-bottom">
                <div class="ctx-bottom-inner">
                  <div class="bottom-nav" v-if="false">
                    <div class="nav-item" @click="togglePanel('详情')" :class="active_panel == '详情' ? 'active' : ''">
                      商品详情
                    </div>

                    <div class="nav-item" @click="togglePanel('评价')" :class="active_panel == '评价' ? 'active' : ''">
                      累计评价
                      <!-- <span class="count-num">{{ count_comments }}</span> -->
                    </div>

                    <!-- <el-popover placement="bottom" trigger="click">
                  <div class="pop-kefu">
                    <div class="pop-kefu-inner">
                      <div class="kefu-tip">请微信扫描下方二维码</div>
                      <img class="kefu-code" :src="webConfig.kefu_code" />
                    </div>
                  </div>
                  <button class="contact" slot="reference">
                    <img src="@img/other/goods-detail-kefu.png" alt />
                    <span>联系客服</span>
                  </button>
                </el-popover> -->
                    <!-- <button class="contact" slot="reference" @click="shopcart_add">
                  <img src="@img/icon-cart-trans.png" alt />
                  <span>加入购物车</span>
                </button> -->
                  </div>


                  <!-- v-if="active_panel == '详情'" -->
                  <div class="detail-content-box">
                    <div class="panel-title" data-title="详情">
                      Product Details
                    </div>
                    <div class="panel-title-line"></div>
                    <div class="rich-html" v-html="info.content"></div>
                    <div class="rich-html" v-html="info.cont2"></div>
                    <div class="rich-html" v-html="info.cont3"></div>
                  </div>

                  <!-- v-if="active_panel == '评价'" -->
                  <div class="comment-box">
                    <div class="panel-title" data-title="评论">
                      Evaluate ({{ info.commentNum }})
                    </div>
                    <div class="panel-title-line"></div>

                    <review_list :list="reviews" />

                    <div class="pagination-box" style="margin-top: 80px" v-if="info.commentNum">
                      <el-pagination background layout="total, prev, pager, next" @current-change="changePage_comment"
                        :current-page.sync="pagination.page" :page-size="pagination.pageNum"
                        :total="info.commentNum"></el-pagination>
                    </div>

                    <div class="detail-empty" v-else>
                      <el-empty description="没有查询到评论信息..."></el-empty>
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
// import { Swiper, SwiperOptions, Pagination, Navigation } from "swiper";
// import "swiper/swiper-bundle.min.css";

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
    // QRCode,
    // modalLoading,
    // modalYaoqing,
    // goodsCouponList,
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
    border: 1px solid #ddd;
    width: 150px;
    height: 150px;
  }
}
</style>

<style scoped lang="less">
.page-top {
  padding: 24px 0;
  position: relative;

  .page-top-banner {
    img {
      width: 100%;
    }
  }

  .page-bread {
    width: @width;
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
          color: #4CA5E4;
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
  .flex();
  cursor: pointer;
}

.page {
  background: #FFFFFF;
  // padding-top: 32px;
  min-height: 50vh;
  font-size: 14px;

  .page-box {
    padding-top: 0;
  }

  .page-inner {
    // overflow: hidden;
    max-width: @width;
    margin: 0 auto;
    margin-top: 0;
    margin-bottom: 0;
    padding-bottom: 50px;

    .main-content {
      // background-color: #fff;

      .ctx-top {
        background: #fff;
        display: flex;
        align-items: flex-start;
      }


      .top-info {
        .product-title {
          text-align: left;
          font-size: 20px;
          font-family: Microsoft YaHei-Bold, Microsoft YaHei;
          font-weight: bold;
          color: #333333;

          .state-xiajia {
            margin-left: 20px;
            font-weight: normal;
            font-size: 14px;
            color: #999;
            color: #ea3200;
          }
        }

        .product-other-action {
          padding: 25px 0;
          .flex();

          .action-item {
            .flex();
            margin-right: 30px;
            cursor: pointer;

            &:hover {
              span {
                color: #4CA5E4;
              }
            }

            img {
              margin-right: 5px;
              max-width: 20px;
              max-height: 20px;
            }

            span {
              font-size: 12px;
              font-family: Microsoft YaHei-Regular, Microsoft YaHei;
              font-weight: 400;
              color: #666666;

              font-size: 16px;
            }
          }
        }

        .product-filter {
          .flex-between();
          padding: 15px 0;
          padding-bottom: 0;
          border: 1px solid #d5d8de;
          border-left: none;
          border-right: none;

          .text {
            margin-bottom: 15px;
          }

          .tabs {
            flex: 1;
            .flex();
            flex-wrap: wrap;

            .tab-item {
              margin-right: 15px;
              margin-bottom: 15px;
              min-width: 32px;
              padding: 0 5px;
              height: 24px;
              line-height: 24px;
              background: #ffffff;
              border-radius: 3px 3px 3px 3px;
              border: 1px solid #a6a6a6;

              font-size: 12px;
              font-family: Microsoft YaHei-Regular, Microsoft YaHei;
              font-weight: 400;
              color: #999999;
              font-size: 16px;

              &.active {
                background: #4CA5E4;
                color: #fff;
                border-color: #4CA5E4;
              }
            }
          }

          .fuli {
            img {
              height: 24px;
            }
          }
        }
      }

      .ctx-top {
        padding: 0;
        display: flex;
        justify-content: space-between;

        .ctx-left {
          width: 550px;
          position: relative;

          .promotion-box {
            position: absolute;
            bottom: 0;
            width: 100%;

            .limit-end-box {
              font-size: 0.3rem;
              color: #4CA5E4;
              font-weight: bold;
              text-align: center;
              padding-bottom: 0.5rem;
            }
          }

          .shoucang-box {
            margin-top: 20px;
            .flex-between();
            width: 100%;

            .yes {
              color: #f00;
            }

            .no {
              color: #000;
            }

            .shoucang-left {
              cursor: pointer;
              .flex();

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
              .flex();

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
          flex: 2;
          min-height: 364px;
          margin-left: 100px;
          text-align: left;

          .detail-title {
            .title-text {
              flex: 1;
              font-family: Poppins, Poppins;
              font-weight: bold;
              font-size: 30px;
              color: #000000;
            }

            .price-box {
              margin-left: 100px;
              font-family: Arial, Arial;
              font-weight: bold;
              font-size: 30px;
              color: #FF0000;
            }
          }

          .detail-desc {
            margin-top: 30px;
            margin-bottom: 40px;
            font-family: OPPOSans, OPPOSans;
            // font-weight: bold;
            font-size: 16px;
            color: #555555;
            line-height: 30px;
          }

          .info-box {
            padding: 25px 20px;
            background: #f7f7f7;
            background-repeat: no-repeat;
            background-size: 100% 100%;

            .list {
              .item {
                .flex();

                .label {
                  width: 80px;
                  font-size: 16px;
                  font-family: PingFang SC, PingFang SC;
                  font-weight: 500;
                  color: #353535;
                }

                .vals {
                  .flex();
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
              .flex();

              .number {
                font-size: 28px;
                font-family: Microsoft YaHei-Bold, Microsoft YaHei;
                font-weight: bold;
                color: #ea3200;
              }
            }
          }


          .info-texts {
            .flex-between();
            padding: 0 32px;
            height: 45px;
            background: #F8F8F8;

            .text-item {
              .flex();

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
            .flex();
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
                border: 1px solid #4CA5E4;
                color: #eb0611;

                .img-box {
                  img {
                    visibility: visible !important;
                  }
                }

                .text {
                  color: #4CA5E4;
                }

                .price {
                  color: #4CA5E4;
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
            .flex();

            .sel-num-title {
              min-width: 84px;
              font-family: Arial, Arial;
              font-size: 16px;
              color: #333333;
            }

            .shuliang {
              min-width: 105px;
              .flex();

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
                  vertical-align: bottom;
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
            margin-top: 100px;


            button {
              margin-right: 20px;
              font-size: 16px;
              transition: 0.3s;

              &:hover {
                opacity: 0.8;
              }
            }

            .btn-buy {
              width: 200px;
              height: 50px;
              background: #4CA5E4;
              border-radius: 0px 0px 0px 0px;
              font-family: OPPOSans, OPPOSans;
              // font-weight: bold;
              font-size: 18px;
              color: #FFFFFF;
            }

            .btn-add-cart {
              width: 200px;
              height: 50px;
              background: #FFFFFF;
              border-radius: 0px 0px 0px 0px;
              border: 1px solid #4CA5E4;
              font-family: OPPOSans, OPPOSans;
              // font-weight: bold;
              font-size: 18px;
              color: #4CA5E4;
            }

            .btn-add-fav {
              width: 200px;
              height: 50px;
              background: #FFFFFF;
              border-radius: 0px 0px 0px 0px;
              border: 1px solid #4CA5E4;
              font-family: OPPOSans, OPPOSans;
              // font-weight: bold;
              font-size: 18px;
              color: #4CA5E4;
            }
          }
        }
      }



      .ctx-bottom-container {
        margin-top: 16px;
        display: flex;
        justify-content: space-between;

        .bottom-left {
          width: 220px;
          background: #FFF;
          font-weight: 400;
          font-size: 16px;
          color: #333333;

        }

        .bottom-right {
          width: 1164px;
          width: 100%;
          background: #FFF;
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
          color: #4CA5E4;
        }

        .panel-title-line {
          margin-bottom: 64px;
          width: 100%;
          height: 7px;
          background: #4CA5E4;
          border-radius: 0px 0px 0px 0px;
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
    color: #4CA5E4;
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
      background: #4CA5E4;
      .flex-center();
      right: 20px;

      &:hover {
        opacity: 0.8;
      }

      img {
        width: 20px;
        margin-right: 10px;
        vertical-align: bottom;
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
  padding: 20px;
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
        .flex();
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

.pagation-box {
  margin-top: 20px;
  margin-bottom: 20px;
}

.comment-box {
  min-height: 10vh;
  padding: 20px;
  // margin-top: 20px;

  .comment-title {
    display: flex;
    background-color: #eee;
    align-items: center;
    color: #fff;
    width: 100%;

    color: #000;

    .comment-title-text {
      padding: 5px 30px;
      margin-right: 20px;
      background-color: #4CA5E4;
      color: #fff;
    }
  }

  label {
    width: 70px;

    input {
      margin-right: 10px;
    }
  }

  .comment-list {
    margin-top: 20px;
    font-size: 14px;
    color: #000;
    text-align: left;

    .comment-item {
      background-color: #eee;
      padding: 20px;
      min-height: 50px;
      margin-bottom: 20px;

      .comment-bottom {
        margin-top: 10px;
        display: flex;
        align-items: center;

        .left {
          flex: 3;

          .img-list {
            display: flex;

            .img-item {
              padding: 10px;
            }

            img {
              width: 80px;
              height: 80px;
              padding: 10px;
              background-color: #fff;
              margin-right: 10px;
            }
          }
        }

        .right {
          flex: 1;
        }
      }
    }
  }
}



.bottom-left {
  .main-title {
    position: relative;
    border-bottom: 1px solid #EEEEEE;
    line-height: 45px;
    padding-left: 16px;
    font-family: Microsoft YaHei, Microsoft YaHei;
    font-weight: 400;
    font-size: 16px;
    color: #333333;

    &::after {
      position: absolute;
      content: '';
      background: #333;
      bottom: 0;
      width: 96px;
      left: 16px;
      height: 2px;
    }
  }
}

.product-list {
  margin-top: 12px;

  .product-item {

    margin-bottom: 10px;
    margin-right: 16px;
    margin-top: 16px;
    width: 220px;
    // height: 349px;
    background: #FFFFFF;
    cursor: pointer;

    &:nth-child(6n) {
      margin-right: 0;
    }

    &:nth-child(-n + 6) {
      margin-top: 0;
    }

    &:hover {
      .title {
        color: #4CA5E4 !important;
      }

    }

    .poster-box {
      width: 220px;
      height: 220px;

      .poster {
        width: 220px;
        height: 220px;
      }
    }

    .info-box {
      padding: 13px 15px 0;

      .title {
        .ellipsis-1();
        font-weight: 400;
        font-size: 14px;
        color: #333333;
      }

      .pirce-box {
        margin-top: 15px;
        .flex-between();

        .price-info {
          .flex();

          .price-1 {
            margin-right: 10px;
            font-family: Arial, Arial;
            font-weight: 400;
            font-size: 16px;
            color: #FF3A30;
          }

          .price-2 {
            text-decoration: line-through;
            font-family: PingFang SC, PingFang SC;
            font-weight: 400;
            font-size: 14px;
            color: #999999;
          }
        }

        .yishou {
          font-weight: 400;
          font-size: 12px;
          color: #999999;
        }
      }


      .act-box {
        margin-top: 15px;
        border-top: 1px solid #ddd;
        padding-top: 5px;
        .flex-between();

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
