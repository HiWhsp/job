<template>
  <div class="page">
    <div class="inner w-1400">
      <div class="banner-box">
        <!-- <div class="lunbo-box">
          <el-carousel trigger="click" :autoplay="true">
            <el-carousel-item
              v-for="(item, index) in banner_list"
              :key="index"
              @click.native="do_banner_click(item)"
            >
              <img :src="item.image" alt="" />
            </el-carousel-item>
          </el-carousel>
        </div> -->

        <div class="poster-box">
          <img :src="banner_poster" alt="" />
        </div>
        <div class="poster-info flex">
          <div class="info-left">快速报价</div>
          <div class="info-right">
            <div class="text-box">
              <div class="text text-1 active">1上传文件</div>
              <div class="text text-2">2核对结果</div>
              <div class="text text-3">3生成报价单/立刻下单</div>
            </div>
            <div class="step-box">
              <div class="step-item active">
                <div class="dot-box"></div>
              </div>
              <div class="step-item">
                <div class="dot-box"></div>
              </div>
              <div class="step-item">
                <div class="dot-box"></div>
              </div>
              <div class="step-item"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="page-ctx">
        <div class="result-wrap">
          <div class="result-top">
            <div class="result-left">
              <div class="left-title">原始文件列</div>
              <div class="data-list">
                <div class="data-item" v-for="(item, index) in 10" :key="index">
                  <div class="check-box">
                    <el-checkbox v-model="item.is_check"></el-checkbox>
                  </div>
                  <div class="info-box">
                    <div class="xuhao">001</div>
                    <div class="title">编号 名称：xxx</div>
                    <div class="num">数量：10</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="result-right">
              <div class="right-title">匹配结果列：</div>
              <div class="match-list">
                <div
                  class="match-item"
                  v-for="(item, index) in 10 || match_list"
                  :key="index"
                >
                  <div class="poster-box">
                    <img :src="demo" alt="" />
                  </div>
                  <div class="title-box">
                    <div class="title">
                      RA20020大鼠白细胞介素1β（IL-1β） Rat I
                    </div>
                    <div class="price-box">
                      单价：<span class="price">¥332.00</span>
                    </div>
                  </div>
                  <div class="brand-box">
                    <div class="brand">品牌：品牌1，品牌2</div>
                    <div class="sku">规格：7837</div>
                  </div>
                  <div class="num-box">
                    <el-input-number
                      v-model="num"
                      @change="handleChange"
                      :min="1"
                      :max="10"
                      label="描述文字"
                    ></el-input-number>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="result-bottom">
            <div class="bottom-action-box">
              <div class="left-acts flex">
                <div class="all-select">
                  <el-checkbox
                    v-model="checked_all"
                    @change="on_change_checked_all"
                    >{{ checked_all ? "反选" : "全选" }}</el-checkbox
                  >
                </div>
                <div class="delete-box">
                  <span
                    data-fn="do_cart_remove_select"
                    @click="do_cart_remove_select_tip()"
                    >删除选中</span
                  >
                </div>
                <div class="num-box flex">
                  <div class="num-item">
                    <span class="label">总需求数：</span>
                    <span class="value">60件</span>
                  </div>
                  <div class="num-item">
                    <span class="label">已报价：</span>
                    <span class="value">60件</span>
                  </div>
                  <div class="num-item">
                    <span class="label">待报价：</span>
                    <span class="value">60件</span>
                  </div>
                </div>
              </div>
              <div class="right-acts flex">
                <div class="total-number">
                  已选中：
                  <b>{{ count_shopcart_checked }}</b>
                  
                </div>

                <button
                  :disabled="jiesuanDisabled"
                  class="btn-ripple btn-sc"
                  @click="to_pay()"
                >
                  生成报价单
                </button>
                <button
                  :disabled="jiesuanDisabled"
                  class="btn-ripple btn-cart"
                  @click="to_pay()"
                >
                  加入购物车
                </button>
              </div>
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
  name: "category",
  components: {},
  data() {
    return {
      banner_list: [],
      banner_poster: "",
    };
  },
  computed: {
    ...mapState([""]),
  },
  watch: {},
  created() {
    this.query_banner();
  },
  methods: {
    query_banner() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "banner_index",
          position: 0,
        },
      }).then((res) => {
        if (res.code == 200) {
          if (res.data[0]) {
            this.banner_list = res.data[3].images;
            this.$log("banner_list", this.banner_list);
            this.banner_poster = this.banner_list[0].image;
          }
        }
      });
    },
    do_banner_click(item) {
      //console.log({ ...item });
      if (item.url) {
        window.open(item.url, "_blank");
      } else if (item.inventoryId) {
        // this.$router.push(
        //   "/product-detail/" + (item.skuId || item.inventoryId)
        // );
      window.open('/product-detail?id='+(item.skuId || item.inventoryId),'__blank','',false)

      }
    },


    to_pay() {
      this.toRoute('/batch-xunjia-result')
    }
  },
};
</script>

<style scoped lang="less">
.page {
  background: #ffffff;
  background: #f3f3f3;
  text-align: left;

  .inner {
    width: 1400px;
    margin: 0 auto;
    padding-top: 35px;
    padding-bottom: 100px;

    .page-ctx {
      padding-top: 45px;
    }
  }
}

.banner-box {
  position: relative;
}

.banner-box .lunbo-box {
  position: relative;
  width: 100%;
  height: 318px;

  /deep/ .el-carousel__container {
    height: 318px;
  }

  /deep/ img {
    width: 100%;
    height: 318px;
    cursor: pointer;
  }
}

.poster-box {
  img {
    width: 100%;
  }
}
.poster-info {
  position: absolute;
  top: 64px;
  left: 50%;
  transform: translate(-50%);

  .info-left {
    width: 180px;
    font-family: Microsoft YaHei, Microsoft YaHei;
    font-weight: bold;
    font-size: 40px;
    color: #ffffff;
  }

  .info-right {
    margin-left: 82px;
    position: relative;
  }

  .text-box {
    width: 940px;
    height: 40px;
    position: relative;

    .text {
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: 400;
      font-size: 30px;
      color: #ffffff;

      &.text-1 {
        position: absolute;
        left: 38px;
      }
      &.text-2 {
        position: absolute;
        left: 310px;
      }
      &.text-3 {
        position: absolute;
        left: 580px;
      }

      &.active {
        color: #7853B2;
      }
    }
  }

  .step-box {
    margin-top: 20px;
    display: flex;
    height: 3px;
    width: 940px;

    .step-item {
      position: relative;
      height: 3px;
      background: #fff;
      &:nth-child(1) {
        width: 48px;
      }
      &:nth-child(2) {
        width: 272px;
      }
      &:nth-child(3) {
        width: 272px;
      }
      &:nth-child(4) {
        width: 352px;
      }

      &.active {
        background: #7853B2;
        .dot-box {
          background: #7853B2;
        }
      }

      .dot-box {
        position: absolute;
        z-index: 2;
        right: 0;
        top: 0;
        transform: translate(50%, -50%);
        border-radius: 50%;
        width: 18px;
        height: 18px;
        background: #fff;
      }
    }
  }
}

.result-wrap {
  position: relative;
  z-index: 2;
  margin-top: -100px;
  width: 1400px;
  // height: 299px;
  background: #ffffff;
  padding: 32px;
  padding-top: 32px;
  padding-bottom: 70px;
}

.result-top {
  display: flex;
  align-items: flex-start;

  .result-left {
    .left-title {
      margin-bottom: 26px;
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: 400;
      font-size: 14px;
      color: #333333;
    }
    .data-list {
      .data-item {
        margin-bottom: 20px;
        background: #f7f7f7;
        width: 315px;
        padding: 10px;
        display: flex;
        align-items: flex-start;
        height: 113px;
        border-top: 1px solid #7853B2;
        .check-box {
          width: 35px;
          text-align: center;
        }
        .info-box {
          flex: 1;
          .xuhao {
            font-family: Microsoft YaHei, Microsoft YaHei;
            font-weight: 400;
            font-size: 12px;
            color: #7853B2;
          }
          .title {
            margin: 10px 0;
            font-family: Microsoft YaHei, Microsoft YaHei;
            font-weight: 400;
            font-size: 12px;
            color: #333333;
          }
          .num {
            font-family: Microsoft YaHei, Microsoft YaHei;
            font-weight: 400;
            font-size: 12px;
            color: #333333;
          }
        }
      }
    }
  }
  .result-right {
    margin-left: 47px;
    flex: 1;
    .right-title {
      margin-bottom: 26px;
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: 400;
      font-size: 14px;
      color: #333333;
    }

    .match-item {
      margin-bottom: 0;
      background: #fff;
      width: 100%;
      padding: 20px 0;
      display: flex;
      align-items: flex-start;
      height: 133px;
      border-top: 1px solid #7853B2;

      .poster-box {
        width: 80px;
        height: 80px;
        img {
          width: 80px;
          height: 80px;
        }
      }
      .title-box {
        margin-left: 18px;
        flex: 1;
        .title {
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: 400;
          font-size: 16px;
          color: #333333;
        }
        .price-box {
          margin-top: 10px;
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: 400;
          font-size: 16px;
          color: #333333;
          .price {
            font-family: Microsoft YaHei, Microsoft YaHei;
            font-weight: 400;
            font-size: 16px;
            color: #7853B2;
          }
        }
      }
      .brand-box {
        margin-left: 18px;
        width: 300px;
        .brand {
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: 400;
          font-size: 16px;
          color: #333333;
        }
        .sku {
          margin-top: 10px;
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: 400;
          font-size: 16px;
          color: #333333;
        }
      }
    }
  }
}

.bottom-action-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 40px;
  height: 86px;
  background: #fafbfc;
  // border: 1px solid #eeeeee;
  // box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.08);
  opacity: 1;
  margin-top: 40px;

  .all-select {
    cursor: pointer;
    min-width: 120px;
    width: fit-content;
    font-family: OPPOSans, OPPOSans;
    font-weight: 400;
    font-size: 14px;
    color: #1F1F1F;
  }

  .delete-box {
    cursor: pointer;
    width: fit-content;

    span {
      font-family: OPPOSans, OPPOSans;
      font-weight: 400;
      font-size: 14px;
      color: #1F1F1F;

      &:hover {
        color: #7853B2;
      }
    }
  }

  .clear-box {
    cursor: pointer;
    margin-left: 64px;
    flex: 2;
    text-align: left;

    span {
      font-family: OPPOSans, OPPOSans;
      font-weight: 400;
      font-size: 14px;
      color: #1F1F1F;

      &:hover {
        color: #7853B2;
      }
    }
  }

  .num-box {
    .num-item {
      margin-right: 30px;
      .label {
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: 400;
        font-size: 12px;
        color: #1F1F1F;
      }
      .value {
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: 400;
        font-size: 12px;
        color: #7853B2;
      }
    }
  }

  .total-number {
    width: fit-content;
    font-family: OPPOSans, OPPOSans;
    font-weight: 400;
    font-size: 14px;
    color: #1F1F1F;

    b {
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      line-height: 20px;
      color: #f13f17;
    }
  }

  .total-price {
    margin-left: 60px;
    margin-right: 60px;
    width: fit-content;

    font-family: OPPOSans, OPPOSans;
    font-weight: 400;
    font-size: 14px;
    color: #1F1F1F;

    b {
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      line-height: 20px;
      color: #f13f17;
    }
  }


  .btn-sc {
    margin-left: 20px;
    cursor: pointer;
    width: 191px;
    height: 46px;
    background: #FF9900;

    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: #ffffff;
    transition: 0.3s;
    user-select: none;

    &:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
  }

  .btn-cart {
    margin-left: 20px;
    cursor: pointer;
    width: 191px;
    height: 46px;
    background: #7853B2;

    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: #ffffff;
    transition: 0.3s;
    user-select: none;

    &:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
  }
}
</style>

