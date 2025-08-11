<template>
  <div class="page">
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
            <div class="text text-2 active">2核对结果</div>
            <div class="text text-3">3生成报价单/立刻下单</div>
          </div>
          <div class="step-box">
            <div class="step-item active">
              <div class="dot-box"></div>
            </div>
            <div class="step-item active">
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
    <div class="inner w-1400">
      <div class="page-ctx">
        <div class="result-wrap">
          <div class="result-top">
            <div class="result-left">
              <div class="left-title">原始文件列</div>
              <div class="data-list">
                <div
                  class="data-item"
                  v-for="(item, index) in info"
                  :key="index"
                >
                  <div class="check-box">
                    <input
                      type="checkbox"
                      :value="item.id"
                      v-model="checkedItem"
                    />
                  </div>
                  <div class="info-box">
                    <div class="xuhao">{{ index }}</div>
                    <div class="title">
                      编号 {{ item.brand }} 名称：{{
                        item.product_name || "空"
                      }}
                    </div>
                    <div class="num">数量：{{ item.num }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="result-right">
              <div class="right-title">匹配结果列：</div>
              <div class="match-list">
                <div
                  class="match-item-loop"
                  v-for="(item, index) in info"
                  :key="index"
                >
                  <div
                    class="match-item"
                    v-if="item.product && item.product.title"
                  >
                    <div class="poster-box">
                      <img :src="item.product.thumb" alt="" />
                    </div>
                    <div class="title-box">
                      <div class="title">
                        {{ item.product.title }}
                      </div>
                      <div class="price-box">
                        单价：<span class="price"
                          >{{ vuex_huobi }}{{ item.product.price }}</span
                        >
                      </div>
                    </div>
                    <div class="brand-box">
                      <div class="brand">
                        品牌：<span v-if="item.product.brand"
                          >{{ item.product.brand.title }}，</span
                        >
                      </div>
                      <div class="sku">规格：{{ item.guige }}</div>
                    </div>
                    <div class="num-box">
                      <el-input-number
                        v-model="item.num"
                        @change="handleChange"
                        :min="1"
                        label="描述文字"
                      ></el-input-number>
                    </div>
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
                    <span class="value">{{ info.length }}件</span>
                  </div>
                  <div class="num-item">
                    <span class="label">已报价：</span>
                    <span class="value">{{ info.length }}件</span>
                  </div>
                  <div class="num-item">
                    <span class="label">待报价：</span>
                    <span class="value">{{ 0 }}件</span>
                  </div>
                </div>
              </div>
              <div class="right-acts flex">
                <div class="total-number">
                  已选中：
                  <b>{{ checkedItem.length }}</b>
                </div>

                <button
                  :disabled="jiesuanDisabled"
                  class="btn-ripple btn-sc"
                  @click="doConfirm()"
                >
                去询价
                </button>
                <button
                  :disabled="jiesuanDisabled"
                  class="btn-ripple btn-cart"
                  @click="toCart()"
                >
                  加入购物车
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <batch_xunjia_popupVue
      name="popup"
      ref="popup"
      @confirm="doConfirm"
    ></batch_xunjia_popupVue>
  </div>
</template>
<script>
import { mapState } from "vuex";

import batch_xunjia_popupVue from "@/components/batch/batch_xunjia_popup.vue";
export default {
  name: "category",
  components: {
    batch_xunjia_popupVue,
  },
  data() {
    return {
      banner_list: [],
      banner_poster: "",
      info: [],
      fullInfo: {},
      list: [],
      count_shopcart_checked: "",
      jiesuanDisabled: false,
      checked_all: false,
      // 设置选项复选框初始状态为未选中,由于是一个数组,所以值为[],即为空
      checkedItem: [],
      // 设置选中全选复选框后重新给选项复选框赋值,即选中所有的选项复选框
      checkedAttr: [],
      url: "",
    };
  },
  computed: {
    ...mapState([""]),
  },
  watch: {},
  created() {
    let name = this.$route.query.fileName;
    let url = this.$route.query.filePath;
    console.log(url);
    this.query_banner();
    this.batchConfirm(url, name);
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
    generateReport() {
      if (this.checkedItem.length === 0) {
        alert("请选择需求");
      } else {
        let chosen = [];
        for (let i = 0; i < this.checkedItem.length; i++) {
          for (let j = 0; j < this.info.length; j++) {
            if ((this.info[j].id = this.checkedItem[i])) {
              chosen.push(this.info[j]);
              break;
            }
          }
        }
        this.$refs.popup.init(chosen);
      }
    },
    batchConfirm(link, name) {
      link = link.substring(link.lastIndexOf("/upload") + 8);
      console.log(link);
      this.$api({
        url: "/service.php",
        method: "post",
        data: {
          action: "product_createXunjia",
          filename: name,
          filepath: link,
        },
      }).then((res) => {
        alert(res);
        if (res.code == 200) {
          this.getBatchInfo(res.data.xunjiaId);
          this.url = link;
        }
      });
    },
    doConfirm() {
      this.$api({
        url: "/service.php",
        method: "post",
        data: {
          action: "product_submitXunjia",
          filepath: this.url,
          id: this.fullInfo.id,
        },
      }).then((res) => {
        alert(res);
        this.toRoute({
          path: "/batch-xunjia-result",
          query: {
            id: this.fullInfo.id,
          },
        });
      });
      // console.log(params);
      // let infos = params;
      // infos.xunjiaid = this.fullInfo.id;
      // this.$api({
      //   url: "/service.php",
      //   method: "post",
      //   data: {
      //     ...infos,
      //   },
      // }).then((res) => {
      //   alert(res);
      //   if (res.code == 200) {
      //     this.toCart();
      //     this.toRoute({
      //       path: "/batch-xunjia-result",
      //       query: {
      //         id: res.data.id,
      //       },
      //     });
      //   }
      // });
    },
    getBatchInfo(id) {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "product_xunjiaDetail",
          id: id,
        },
      }).then((res) => {
        alert(res);
        if (res.code == 200) {
          this.info = res.data.xunjiaDetail;
          this.fullInfo = res.data;
          console.log(this.fullInfo);
          console.log(this.info);
          for (let i = 0; i < this.info.length; i++) {
            this.checkedAttr.push(this.info[i].id);
          }
          // this.generateAll();
        }
      });
    },
    generateAll() {
      this.$refs.popup.init(this.info);
    },
    handleChange() {},
    getProductInfo(id) {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "product_detail",
          inventoryId: id,
        },
      }).then((res) => {
        console.log(res);
        if (res.code == 200) {
          this.list.push(res.data);
        }
      });
    },
    on_change_checked_all() {
      // 判断全选复选框是否选中
      if (this.checked_all) {
        // 如果全选复选框被选中,则重新给选项复选框赋值,即选中所有的选项复选框
        this.checkedItem = this.checkedAttr;
      } else {
        // 如果全选复未选框被选中,则设置为空值,即未选中所有的选项复选框
        this.checkedItem = [];
      }
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
    async do_cart_remove_select_tip() {
      if (this.checkedItem.length === 0) {
        alert("请选择需求");
      } else {
        if ((this.checkedItem, length === this.checkedAttr.length)) {
          alert("需要至少一条需求");
        } else {
          for (let i = 0; i < this.checkedItem.length; i++) {
            for (let j = 0; j < this.info.length; j++) {
              if ((this.info[j].id = this.checkedItem[i])) {
                this.info.splice(j, 1);
                break;
              }
            }
          }
          alert("删除成功");
        }
      }
    },
    to_pay() {
      this.toRoute("/batch-xunjia-result");
    },
    toCartSub(id, num) {
      this.$api({
        url: "/service.php",
        method: "post",
        data: {
          action: "gouwuche_add",
          inventoryId: id,
          num: num,
        },
      }).then((res) => {
        alert(res);
      });
    },
    async toCart() {
      if (this.checkedItem.length === 0) {
        alert("请选择需求");
      } else {
        for (let i = 0; i < this.checkedItem.length; i++) {
          for (let j = 0; j < this.info.length; j++) {
            if (this.info[j].id === this.checkedItem[i]) {
              setTimeout(() => {
                this.toCartSub(this.info[j].inventory.id, this.info[j].num);
              }, 100 + 100 * i);
            }
          }
        }
        // alert("操作已成功完成");
      }
    },
  },
};
</script>

<style scoped lang="less">
.page {
  background: #ffffff;
  background: #f3f3f3;
  text-align: left;
  position: relative;
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
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
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
    height: 352px;
    object-fit: cover;
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
        color: #F74747;
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
        background: #F74747;
        .dot-box {
          background: #F74747;
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
  margin-top: 100px;
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
        border-top: 1px solid #F74747;
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
            color: #F74747;
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
      border-top: 1px solid #F74747;

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
            color: #F74747;
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
  padding-left: 16px;
  .all-select {
    cursor: pointer;
    min-width: 120px;
    width: fit-content;
    font-family: OPPOSans, OPPOSans;
    font-weight: 400;
    font-size: 14px;
    color: #666666;
  }

  .delete-box {
    cursor: pointer;
    width: fit-content;
    margin-right: 16px;
    span {
      font-family: OPPOSans, OPPOSans;
      font-weight: 400;
      font-size: 14px;
      color: #666666;

      &:hover {
        color: #F74747;
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
      color: #666666;

      &:hover {
        color: #F74747;
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
        color: #666666;
      }
      .value {
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: 400;
        font-size: 12px;
        color: #F74747;
      }
    }
  }

  .total-number {
    width: fit-content;
    font-family: OPPOSans, OPPOSans;
    font-weight: 400;
    font-size: 14px;
    color: #666666;

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
    color: #666666;

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
    background: #ff9900;

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
    background: #F74747;

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

