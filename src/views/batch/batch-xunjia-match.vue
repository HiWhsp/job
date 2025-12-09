<template>
  <div class="page">
    <div class="banner-box">
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
                  :class="{ folded: !item.fold }"
                  v-for="(item, index) in info.origin_list"
                  :key="index"
                >
                  <div class="check-box">
                    <el-checkbox
                      v-model="item.selected"
                      @change="handleChange(item, index)"
                    ></el-checkbox>
                  </div>
                  <div class="info-box">
                    <div class="xuhao">{{ item.serialNo }}</div>
                    <div class="item_box">
                      <div>
                        <img :src="item.image" alt="" />
                      </div>
                      <div class="info-box-right">
                        <div class="num ellipsis-1">
                          名称：{{ item.productName || "空" }}
                        </div>
                        <div class="num ellipsis-1">
                          品牌：{{ item.brandName || "空" }}
                        </div>
                        <div class="num">制造商型号：{{ item.sn || "--" }}</div>
                        <div class="num ellipsis-1">
                          数量：{{ item.requireNum || "--" }}
                        </div>
                      </div>
                    </div>
                    <div class="fold-box-container" v-show="item.fold">
                      <div class="fold-box-item ellipsis-1">
                        需求日期：{{ item.requireDate || "--" }}
                      </div>
                      <div class="fold-box-item ellipsis-1">
                        需求描述：{{ item.description || "--" }}
                      </div>
                      <div class="fold-box-item ellipsis-1">
                        备注：{{ item.note || "--" }}
                      </div>
                    </div>
                    <div class="fold-box" @click="toggleFold(item, index)">
                      <div class="fold-box-text">
                        {{ item.fold ? "收起" : "展开" }}
                      </div>
                      <img
                        :src="
                          item.fold
                            ? require('@/assets/img/batch/fold.png')
                            : require('@/assets/img/batch/unfold.png')
                        "
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="result-right">
              <div class="right-title">匹配结果列：</div>
              <div class="match-list">
                <div
                  class="match-item-loop"
                  v-for="(item, index) in selectedProductList"
                  :key="index"
                  :class="{ folded: item && item.length > 0 && item[0].fold }"
                >
                  <div
                    class="match-item"
                    v-for="(itLoop, index) in item || []"
                    :key="index"
                  >
                    <div class="poster-box">
                      <img :src="itLoop.thumb" alt="" />
                    </div>
                    <div class="title-box">
                      <div class="title ellipsis-1">
                        {{ itLoop.title }}
                      </div>
                      <div class="price-box">
                        单价：<span class="price"
                          >{{ vuex_huobi }}{{ itLoop.price }}</span
                        >
                      </div>
                    </div>
                    <div class="brand-box">
                      <div class="brand">
                        品牌：<span>{{ itLoop.brandName }}</span>
                      </div>
                      <div class="sku">
                        制造商型号：{{ itLoop.inventory.sn || "--" }}
                      </div>
                    </div>
                    <div class="num-box">
                      <el-input-number
                        v-model="itLoop.num"
                        size="mini"
                        :min="1"
                      ></el-input-number>
                      <div class="num-box-tip">
                        <el-checkbox
                          v-model="itLoop.selected"
                          @change="handleChangeSelected(itLoop, index, item)"
                        ></el-checkbox>

                        <div
                          class="fold-box"
                          v-if="item.length > 1 && index == 0"
                          @click="toggleFold(itLoop, index)"
                        >
                          <div class="fold-box-text">
                            {{ itLoop.fold ? "收起" : "更换其它" }}
                          </div>
                          <img
                            :src="
                              itLoop.fold
                                ? require('@/assets/img/batch/fold.png')
                                : require('@/assets/img/batch/unfold.png')
                            "
                            alt=""
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-if="!item || item.length == 0" class="no-match-item">
                    <div class="no-match-item-text-title">暂无此商品</div>
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
                    <span class="value"
                      >{{ (info.origin_list || []).length }}件</span
                    >
                  </div>
                  <div class="num-item">
                    <span class="label">已报价：</span>
                    <span class="value"
                      >{{
                        (
                          info.product_list.filter((item) => item.length > 0) ||
                          []
                        ).length
                      }}种</span
                    >
                  </div>
                  <div class="num-item">
                    <span class="label">待报价：</span>
                    <span class="value"
                      >{{
                        (
                          info.product_list.filter(
                            (item) => item.length == 0
                          ) || []
                        ).length
                      }}种</span
                    >
                  </div>
                </div>
              </div>
              <div class="right-acts flex">
                <div class="total-number">
                  已选中：
                  <b
                    >{{
                      info.origin_list.filter((item) => item.selected).length
                    }}件</b
                  >
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
  </div>
</template>
<script>
export default {
  name: "category",
  data() {
    return {
      banner_list: [],
      banner_poster: "",
      info: [],
      fullInfo: {},
      list: [],
      selectedProductList: [],
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
  computed: {},
  watch: {},
  mounted() {
    this.query_banner();
    this.batchConfirm();
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
            this.banner_list = res.data[7].images;
            this.$log("banner_list", this.banner_list);
            this.banner_poster = this.banner_list[0].image;
          }
        }
      });
    },
    batchConfirm() {
      const data = localStorage.getItem("batchData");
      this.info = JSON.parse(data);
      // 初始化每个item的fold状态
      if (this.info && this.info.origin_list) {
        this.info.origin_list.forEach((item, index) => {
          this.$set(item, "index", index);
          this.$set(item, "selected", false);
          if (item.fold === undefined) {
            this.$set(item, "fold", false);
          }
        });
      }
      if (this.info && this.info.product_list) {
        this.info.product_list.forEach((item, index) => {
          item.forEach((itLoop) => {
            this.$set(itLoop, "num", this.info.origin_list[index].requireNum);
            this.$set(itLoop, "selected", false);
            this.$set(itLoop, "fold", false);
          });
        });
      }
    },
    toggleFold(item, index) {
      this.$set(item, "fold", !item.fold);
    },
    doConfirm() {
      const data = [];
      this.selectedProductList.forEach((item) => {
        item.forEach((itLoop) => {
          if (itLoop.selected) {
            data.push({
              serialNo: itLoop.inventoryId,
              requireDate: itLoop.dtTime,
              productName: itLoop.title,
              brandName: itLoop.brandName,
              manufacturerNo: itLoop.inventory.sn,
              image: itLoop.thumb,
              description: itLoop.description,
              requireNum: itLoop.num,
              note: itLoop.note,
              productId: itLoop.inventory.productId,
              productNum: itLoop.num,
              inventoryId: itLoop.inventory.id,
            });
          }
        });
      });
      // this.info.origin_list.forEach((item, index) => {
      //   if(item.selected) {
      //     data.push(item);
      //   }
      // });
      this.$api({
        url: "/service.php",
        method: "post",
        data: {
          action: "Inquiry_createInquiryOrder",
          data,
        },
      }).then((res) => {
        this.selectedProductList.forEach((item) => {
          item.forEach((itLoop) => {
            if (itLoop.selected) {
              this.$api({
                url: "/service.php",
                method: "post",
                data: {
                  action: "gouwuche_add",
                  inventoryId: itLoop.inventoryId,
                  num: itLoop.num,
                },
              });
            }
          });
        });
        this.toRoute({
          path: "/batch-xunjia-result",
          query: {
            id: res.data.id,
          },
        });
      });
    },
    on_change_checked_all() {
      // 判断全选复选框是否选中
      if (this.checked_all) {
        // 如果全选复选框被选中,则重新给选项复选框赋值,即选中所有的选项复选框
        this.info.origin_list.forEach((item, index) => {
          this.$set(item, "selected", true);
          this.info.product_list[index].forEach((itLoop, i) => {
            this.$set(itLoop, "selected", true);
          });
          this.selectedProductList[index] = this.info.product_list[index];
        });
      } else {
        // 如果全选复未选框未被选中,则选中所有的选项复选框
        this.info.origin_list.forEach((item, index) => {
          this.$set(item, "selected", false);
          this.selectedProductList[index] = [];
        });
        this.checkedItem = [];
      }
    },
    async do_cart_remove_select_tip() {
      // 删除info.origin_list中selected为true的
      this.info.origin_list.forEach((item, index) => {
        if (item.selected) {
          this.info.origin_list.splice(index, 1);
          this.info.product_list.splice(index, 1);
        }
      });
      localStorage.setItem("batchData", JSON.stringify(this.info));
    },
    async toCart() {
      if (this.checkedItem.length === 0) {
        alert("请选择商品");
      } else {
        for (let i = 0; i < this.checkedItem.length; i++) {
          for (let j = 0; j < this.selectedProductList.length; j++) {
            if (
              !this.selectedProductList[j] ||
              this.selectedProductList[j].length === 0
            ) {
              continue;
            }
            for (let k = 0; k < this.selectedProductList[j].length; k++) {
              if (
                this.selectedProductList[j][k].inventoryId ===
                this.checkedItem[i]
              ) {
                setTimeout(() => {
                  this.toCartSub(
                    this.selectedProductList[j][k].inventoryId,
                    this.selectedProductList[j][k].num
                  );
                }, 100 + 100 * i);
              }
            }
          }
        }
        this.$message.success("加入购物车成功");
      }
    },
    toCartSub(inventoryId, num) {
      this.$api({
        url: "/service.php",
        method: "post",
        data: {
          action: "gouwuche_add",
          inventoryId: inventoryId,
          num: num,
        },
      });
    },

    handleChange(item, index) {
      if (item.selected) {
        this.info.product_list[index].forEach((itLoop, i) => {
          this.$set(itLoop, "selected", true);
        });
        this.selectedProductList[index] = this.info.product_list[index];
      } else {
        this.selectedProductList[index] = [];
      }
    },
    handleChangeSelected(itLoop, index, item) {
      this.checkedItem.push(itLoop.inventoryId);
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
        color: #f74747;
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
        background: #f74747;
        .dot-box {
          background: #f74747;
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
        padding: 10px 10px 17px 10px;
        padding-bottom: 0;
        display: flex;
        align-items: flex-start;
        height: 190px;
        border-top: 1px solid #f74747;
        transition: height 0.3s ease;
        overflow: hidden;
        &.folded {
          height: 125px;
        }
        .check-box {
          width: 35px;
          text-align: center;
          line-height: 22px;
        }
        .info-box {
          flex: 1;
          position: relative;
          .fold-box {
            cursor: pointer;
            position: absolute;
            right: 0;
            top: 80px;
            padding: 4px 8px;
            background: #fafafa;
            border-radius: 4px 4px 4px 4px;
            border: 1px solid #dee1e7;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .fold-box-text {
              font-family: Microsoft YaHei, Microsoft YaHei;
            }
            img {
              margin-left: 8px;
              width: 8px;
              height: 8px;
            }
          }
          .item_box {
            display: flex;
            align-items: center;
            .info-box-right {
              margin-left: 10px;
              width: 168px;
            }
            img {
              width: 80px;
              height: 80px;
              img {
                width: 80px;
                height: 80px;
              }
            }
          }
          .xuhao {
            font-family: Microsoft YaHei, Microsoft YaHei;
            font-weight: 400;
            font-size: 12px;
            color: #f74747;
            margin-bottom: 5px;
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

          .fold-box-container {
            margin-top: 10px;
            .fold-box-item {
              font-family: Microsoft YaHei, Microsoft YaHei;
              font-weight: 400;
              font-size: 12px;
              color: #333333;
              margin-bottom: 5px;
            }
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

    .no-match-item {
      margin-bottom: 0;
      background: #fff;
      width: 100%;
      padding: 20px 0;
      display: flex;
      align-items: center;
      height: 147px;
      justify-content: center;
      border-top: 1px solid #f74747;
    }

    .match-item-loop {
      height: 147px;
      overflow: hidden;
    }
    .folded {
      height: auto;
    }

    .match-item {
      margin-bottom: 0;
      background: #fff;
      width: 100%;
      padding: 30px 0;
      display: flex;
      align-items: flex-start;
      height: 147px;
      border-top: 1px solid #f74747;

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
        width: 370px;
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
            color: #f74747;
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
      .num-box {
        .num-box-tip {
          margin-top: 30px;
          display: flex;
          justify-content: space-between;

          .fold-box {
            cursor: pointer;
            padding: 4px 8px;
            background: #fafafa;
            border-radius: 4px 4px 4px 4px;
            border: 1px solid #dee1e7;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .fold-box-text {
              font-family: Microsoft YaHei, Microsoft YaHei;
            }
            img {
              margin-left: 8px;
              width: 8px;
              height: 8px;
            }
          }
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
        color: #f74747;
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
        color: #f74747;
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
        color: #f74747;
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
    background: #f74747;

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
