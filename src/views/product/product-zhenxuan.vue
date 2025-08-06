<template>
  <div class="page">
    <div class="inner">
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
          <div class="info-left">MRO工业品全品类超市</div>
        </div>
      </div>
      <div class="page-ctx w-1400">
        <div class="hot-sec">
          <div class="hot-title flex-center">
            <img src="@img/index/suggest-left.png" alt="" />
            <span>爆款热卖</span>
            <img src="@img/index/suggest-right.png" alt="" />
          </div>

          <div class="sec-ctx">
            <div class="hot-lunbo">
              <el-carousel ref="hotLunbo" trigger="click" :autoplay="true">
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
                          <div class="pirce-num">￥ {{ item.priceSale }}</div>
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

        <div class="suggest-box">
          <div class="suggest-title flex-center">
            <img src="@img/index/suggest-left.png" alt="" />
            <span>莉东精选</span>
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

      jingpin_group: [],
      jingpin_list: [],
      suggest_products: [],
    };
  },
  computed: {
    ...mapState([""]),
  },
  watch: {},
  created() {
    this.query_banner();
    this.query_jingpin();
    this.query_product_suggest();
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
            this.banner_list = res.data.filter((v) => v.id == 180)[0].images;
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
        this.$router.push(
          "/product-detail/" + (item.skuId || item.inventoryId)
        );
      }
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
  },
};
</script>

<style scoped lang="less">
.page {
  background: #ffffff;
  background: #f3f3f3;
  text-align: left;

  .inner {
    margin: 0 auto;
    padding-bottom: 100px;
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
    height: 340px;
    object-fit: cover;
  }
}
.poster-info {
  width: 1400px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%);

  .info-left {
    width: 100%;
    font-family: Microsoft YaHei, Microsoft YaHei;
    font-weight: bold;
    font-size: 40px;
    color: #ffffff;
  }
}

.hot-sec {
  background-image: url("~@img/product/remai-bg.png");
  height: 509px;
  padding: 0px 0;
  margin-top: 36px;
  .hot-title {
    height: 80px;

    span {
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: bold;
      font-size: 24px;
      color: #fff;
    }

    img {
      margin: 0 10px;
      width: 22.46px;
    }
  }

  .hot-lunbo {
    margin-top: 4px;
    position: relative;
    width: 100%;
    height: 385px;
    background: transparent;
    border-radius: 8px 8px 8px 8px;

    /deep/ .el-carousel__container {
      height: 385px;
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
      width: 264px;
      height: 385px;
      margin-right: 20px;
      background: #fff;
      border-radius: 8px 8px 8px 8px;
      &:nth-child(5n) {
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

        .title {
          font-family: MicrosoftYaHei, MicrosoftYaHei;
          font-weight: normal;
          font-size: 14px;
          color: #3d4248;
          line-height: 22px;
        }

        .price {
          margin-top: 16px;
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: bold;
          font-size: 14px;
          color: #eb0f19;

          .unit {
            font-family: Microsoft YaHei, Microsoft YaHei;
            font-weight: bold;
            font-size: 14px;
            color: #eb0f19;
          }
        }
      }
    }
  }
}

.suggest-box {
  margin-top: 30px;
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
          background: rgba(247, 71, 71, 0.2);
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

