<script>
import detailLunbo from "@/components/detail/detailLunbo.vue"; // 滚动图
import {Loading} from "element-ui";
import modalJIfenDuihuan from "@/components/jifen/modalJIfenDuihuan.vue";

export default {
  name: "detail",
  components: {
    modalJIfenDuihuan,
    detailLunbo,
  },
  data() {
    return {
      detailImages: [],
      Loading,
      loadingInstance: null,
      view_info: {},
      activeCate: {
        route: "/",
      },

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
      select_specifications: {}, //选择的规格
      selected_num: 1, //商品数量
      list_specifications: [], //规格列表
      show_sku: false,
      //拆分状态下选择的商品属性
      select_shuxing_list: [],

      //优惠券
      list_coupon: [],
      show_coupon: false,

      // 其他
      active_panel: "详情", //详情

      pagination: {
        page: 1,
        pagenum: 10,
      },
      pagination_relative: {
        page: 1,
        pagenum: 5,
      },

      select_inventory_id: "",

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


      if_shoucang: false,
    };
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
    document.removeEventListener("scroll", this.handleScrollEvent);
  },

  methods: {
    // 初始化
    setView() {
      //查询商品信息
      this.$api("jiFen_pdtInfo", {inventoryId: this.id}).then((res) => {
        let {code, data, message} = res;

        if (code == 200) {
          this.curr = data;
          this.detail = data;
          this.if_shoucang = data.if_shoucang || 0;
          this.swiperImgs = data.images;
          this.detailImages = data.images.map((v, i) => ({
            index: i,
            image: v
          }));

          this.posterSrc = data.images[0];

        } else {
          if (message == "商品不存在或已下架") {
            this.$router.push("/");
          }
        }

      });
    },
    //立即购买
    payNow(item) {
      this.$refs.modalJIfenDuihuan.init(item);
    },

    togglePanel(name) {
      // return;
      this.active_panel = name;
      if (name == "详情") {
        this.scrollToTarget(".detail-content-box");
      }
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

<template>
  <div class="page">
    <!--  导航  -->
    <div class="nav-bar">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item><a href="/pointsMall">积分商城</a></el-breadcrumb-item>
        <el-breadcrumb-item><a>FUS-U30系列28电机 本体宽30mm</a></el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="page-box">
      <div class="page-inner">
        <div class="main-content">
          <div class="ctx-top">
            <!--      商品图片轮播      -->
            <div class="ctx-left">
              <div class="preview-wrap">
                <detailLunbo :imageList="detailImages"/>
              </div>
            </div>
            <!--            规格-->
            <div class="ctx-right">
              <div class="detail-title">
                {{ detail.title }}
              </div>
              <div class="detail-price">
                积分价格 <span>{{ detail.jifen }}积分</span>
              </div>
              <!--              汇总-->
              <div class="other-box">
                <div class="btn-box">
                  <button class="btn-ripple flex-center btn-buy" @click="payNow(detail)">
                    <img src="@/static/order/jifen.png" alt="">立即购买
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!--细节-->
          <div class="ctx-bottom-container">
            <div class="bottom-right">
              <div class="ctx-bottom">
                <div class="ctx-bottom-inner">
                  <div class="bottom-nav flex">
                    <div class="nav-item" @click="togglePanel('详情')"
                         :class="active_panel == '详情' ? 'active' : ''">
                      规格表
                    </div>
                  </div>

                  <div class="detail-content-box" v-if="active_panel == '详情'">
                    <!-- <div class="section-title" data-title="详情">产品信息</div> -->
                    <div class="rich-html" v-html="detail.content"></div>
                    <div class="rich-html" v-html="detail.cont2"></div>
                    <div class="rich-html" v-html="detail.cont3"></div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>

    <modalJIfenDuihuan ref="modalJIfenDuihuan"></modalJIfenDuihuan>
  </div>
</template>

<style scoped lang="less">
.page-inner {
  padding-top: 25px;

  .main-content {
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
              color: @theme;
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
              background: @theme;
              color: #fff;
              border-color: @theme;
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
      padding: 15px 25px;
      display: flex;
      justify-content: space-between;
      background: #fff;
      min-height: 627px;

      .ctx-left {
        width: 355px;
        position: relative;

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
        flex: 1;
        margin-left: 33px;
        text-align: left;
        padding-bottom: 20px;
        color: #999;

        .detail-title {
          font-family: Roboto, Roboto;
          font-weight: 400;
          font-size: 20px;
          color: #000000;
          font-style: normal;
          text-transform: none;
        }

        .detail-price {
          font-size: 14px;
          margin-top: 35px;

          span {
            margin-left: 15px;
            color: #FF0000;
          }
        }

        .info-box {
          width: 762px;
          height: 178px;
          background: #FFFFFF;
          border-radius: 4px 4px 4px 4px;
          border: 1px solid #E6E4E1;
          padding: 10px;
          margin-top: 20px;
          .flex();

          .label {
            height: 100%;
            font-family: Roboto, Roboto;
            font-weight: 400;
            font-size: 14px;
            color: #333333;
            font-style: normal;
            text-transform: none;
          }

          .list {
            height: 100%;
            overflow-y: auto;
            margin-left: 30px;
            padding-right: 200px;

            .item {
              max-width: 430px;
              padding: 0 5px;
              height: 26px;
              line-height: 26px;
              border: 1px solid #fff;
              border-radius: 4px 4px 4px 4px;
              font-family: Roboto, Roboto;
              font-weight: 400;
              font-size: 14px;
              color: #000;
              font-style: normal;
              text-transform: none;
            }

            .item.active {
              background: rgba(166, 102, 0, 0.07);
              border: 1px solid @theme;
              color: @theme;
            }
          }
        }

        .info-texts {
          width: 762px;
          background: #FFFFFF;
          border-radius: 4px 4px 4px 4px;
          border: 1px solid #E6E4E1;
          padding: 10px 12px;
          margin-top: 11px;

          .title {
            font-family: Roboto, Roboto;
            font-weight: 400;
            font-size: 14px;
            color: #333333;
            font-style: normal;
            text-transform: none;
          }

          .list-item {
            margin-top: 14px;

            .item {
              height: 32px;
              background: #fff;
              border-radius: 2px 2px 2px 2px;

              p {
                font-family: Roboto, Roboto;
                font-weight: 400;
                font-size: 14px;
                color: #333333;
                font-style: normal;
                text-transform: none;
                line-height: 32px;
                line-height: 32px;
              }

              p.price {
                color: #FF0000;
              }
            }

            .item:nth-child(odd) {
              background: #F1F1F1;
              border-radius: 2px 2px 2px 2px;
            }
          }
        }

        .other-box {
          margin-top: 60px;

          .btn-box {
            margin-top: 18px;
            .flex();

            .label {
              width: 80px;
            }

            .content {
              .el-input-number {
                width: 123px;
                border-radius: 3px 3px 3px 3px;
                border: 1px solid #E6E6E6;
                margin-right: 11px;
              }

              .tip {
                font-family: Roboto, Roboto;
                font-weight: 400;
                font-size: 14px;
                color: #333333;
                font-style: normal;
                text-transform: none;
                margin-right: 10px;
              }

              .desc {
                font-family: Roboto, Roboto;
                font-weight: 400;
                font-size: 14px;
                color: #77797B;
                font-style: normal;
                text-transform: none;
              }

              .price {
                font-family: Roboto, Roboto;
                font-weight: 400;
                font-size: 18px;
                color: #FF0000;
                font-style: normal;
                text-transform: none;
              }

              p {
                font-family: Roboto, Roboto;
                font-weight: 400;
                font-size: 14px;
                color: #333333;
                font-style: normal;
                text-transform: none;
                margin-bottom: 10px;

                span {
                  font-family: Roboto, Roboto;
                  font-weight: 400;
                  font-size: 14px;
                  color: #77797B;
                  font-style: normal;
                  text-transform: none;
                }
              }
            }

            button {
              margin-right: 20px;
              font-size: 16px;
              transition: 0.3s;

              &:hover {
                opacity: 0.8;
              }
            }

            .btn-buy {
              width: 142px;
              height: 48px;
              background: @theme;
              border-radius: 4px 4px 4px 4px;
              border: 1px solid @theme;
              font-family: Roboto, Roboto;
              font-weight: bold;
              font-size: 16px;
              color: #FFFFFF;
              font-style: normal;
              text-transform: none;

              img {
                width: 22px;
                height: 24px;
                margin-right: 10px;
              }
            }

            .btn-add-cart {
              width: 142px;
              height: 48px;
              background: #FFFFFF;
              border-radius: 4px 4px 4px 4px;
              border: 1px solid @theme;
              font-family: Roboto, Roboto;
              font-weight: bold;
              font-size: 16px;
              color: @theme;
              font-style: normal;
              text-transform: none;

              img {
                width: 22.6px;
                height: 22.6px;
                margin-right: 8px;
              }
            }
          }
        }

      }
    }


    .ctx-bottom-container {
      .flex();
      padding: 0 25px 25px;
      background-color: #fff;

      .bottom-left {
        width: 220px;
        background: #FFF;
        font-weight: 400;
        font-size: 16px;
        color: #333333;

      }

      .bottom-right {
        width: 1164px;
        background: #FFF;
      }

      .ctx-bottom-inner {
        width: 100%;
        text-align: left;

        .detail-content-box {
          margin-top: 10px;
        }

        .bottom-nav {
          height: 38px;
          background: #F9F9F9;
          border-radius: 4px 4px 4px 4px;
          border: 1px solid #E6E6E6;

          .nav-item {
            cursor: pointer;
            width: 124px;
            height: 38px;
            border-radius: 4px 0px 0px 4px;
            text-align: center;
            font-family: Roboto, Roboto;
            font-weight: 400;
            font-size: 14px;
            color: #7D7D7D;
            font-style: normal;
            text-transform: none;
            line-height: 38px;

          }

          .nav-item.active {
            text-align: center;
            background: @theme;
            font-family: Roboto, Roboto;
            font-weight: bold;
            font-size: 14px;
            color: #FFFFFF;
            font-style: normal;
            text-transform: none;
          }
        }

        .section-title {
          margin-top: 40px;
          margin-bottom: 24px;
          font-size: 16px;
          font-family: Microsoft YaHei-Bold, Microsoft YaHei;
          font-weight: bold;
          color: #333333;
        }
      }
    }
  }
}
</style>
