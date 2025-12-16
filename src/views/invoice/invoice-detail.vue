<template>
  <div class="page">
    <div class="page-title">
      <span>开票详情</span>
    </div>

    <div class="page-ctx">
      <div class="description-card">
        <div class="head">商品信息</div>
        <div class="body">
          <section>
            <div
              class="goods-warp"
              v-for="item in invoicesDetail.info"
              :key="item.id"
            >
              <div class="left">
                <div class="image-warp">
                  <el-image
                    class="elImg"
                    :src="item.image"
                    fit="cover"
                  ></el-image>
                </div>
                <div class="info-warp">
                  <div class="title">{{ item.title }}</div>
                  <div class="sku">{{ item.keyVals }}</div>
                </div>
              </div>
              <div class="goods-item-info">{{ item.priceSale }}</div>
              <div class="goods-item-info">× {{ item.num }}</div>
              <div class="goods-item-info">
                {{ (item.priceSale * item.num).toFixed(2) }}元
              </div>
            </div>
            <div class="item-info-box">
              <div class="item-info">
                <label class="label">商品总价：</label>
                <div class="val">￥{{ payInfo.goods }}</div>
              </div>
              <div class="item-info">
                <label class="label">邮费：</label>
                <div class="val">
                  ￥{{ order_yunfei ? order_yunfei : "0.00" }}
                </div>
              </div>
              <div class="item-info">
                <label class="label">优惠：</label>
                <div class="val">￥{{ order_coupon_price }}</div>
              </div>
              <div class="item-info">
                <label class="label">合计应付：</label>
                <div class="val">￥{{ order_info.price }}</div>
              </div>
              <div class="item-info">
                <label class="label">订单号：</label>
                <div class="val">{{ order_info.orderNo }}</div>
              </div>
              <div class="item-info">
                <label class="label">下单时间：</label>
                <div class="val">{{ order_info.createdTime }}</div>
              </div>
            </div>
          </section>
        </div>
      </div>
      <div class="description-card">
        <div class="head">开票信息</div>
        <div class="body">
          <section>
            <div class="item-info-box">
              <div class="item-info">
                <label class="label">发票类型：</label>
                <div class="val">
                  {{ info.invoiceType == 1 ? "普通发票" : "专用发票" }}
                </div>
              </div>
              <div class="item-info">
                <label class="label">发票抬头类型：</label>
                <div class="val">
                  {{ info.titleType == 1 ? "个人" : "公司" }}
                </div>
              </div>
              <div class="item-info">
                <label class="label">发票抬头：</label>
                <div class="val">{{ info.title }}</div>
              </div>
              <!-- <div class="item-info">
                                <label class="label">单位名称：</label>
                                <div class="val">￥399.00</div>
                            </div> -->
              <div class="item-info" v-if="info['shibiema']">
                <label class="label">纳税人识别码：</label>
                <div class="val">{{ info["shibiema"] }}</div>
              </div>
              <div class="item-info" v-if="info['companyAddress']">
                <label class="label">注册地址：</label>
                <div class="val">{{ info.companyAddress }}</div>
              </div>
              <div class="item-info" v-if="info.companyPhone">
                <label class="label">注册电话：</label>
                <div class="val">{{ info.companyPhone }}</div>
              </div>
              <div class="item-info" v-if="info.bankName">
                <label class="label">开户银行：</label>
                <div class="val">{{ info.bankName }}</div>
              </div>
              <div class="item-info" v-if="info.bankNo">
                <label class="label">银行账户：</label>
                <div class="val">{{ info.bankNo }}</div>
              </div>

              <div class="item-info" v-if="info.invoiceUrl">
                <label class="label">开票信息：</label>
                <div class="val">
                  <div class="pic-info" v-if="fapiao_is_image">
                    <div class="pic-list flex">
                      <div
                        class="pic-item"
                        v-for="(pic, index) in pic_list"
                        :key="index"
                        alt
                      >
                        <el-image
                          style="width: 120px; height: 120px"
                          :src="pic"
                          :preview-src-list="pic_list"
                        >
                        </el-image>
                      </div>
                    </div>
                  </div>
                  <div class="file-info" v-else>
                    <a :href="info.invoiceUrl"> 下载附件 </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      <div class="btns" style="text-align: center; margin: 30px">
        <button class="red">下载发票</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "invoiceDetails",
  components: {},
  data() {
    return {
      invoiceId: "",
      orderId: "",
      info: {},

      order_info: {},
      payInfo: {},
      order_yunfei: 0, // 运费
      order_coupon_price: 0, // 优惠
      fapiao_is_image: true,

      invoicesDetail: {},

      pic_list: [],
    };
  },
  computed: {},
  mounted() {
    this.invoiceId = this.$route.query.invoiceId;
    this.orderId = this.$route.query.orderId;
    this.query_invoice();
    this.query_order();
  },
  methods: {
    query_invoice() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "invoices_detail",
          id: this.invoiceId,
        },
      }).then((res) => {
        if (res.code == 200) {
          let data = res.data;
          data.info = JSON.parse(data.info);
          this.invoicesDetail = data;

          this.info = data;
          this.fapiao_is_image = this.isImageUrl(data.invoiceUrl || "");
          if (this.fapiao_is_image) {
            this.pic_list = data.invoiceUrl.split(",");
          }
        }
      });
    },

    isImageUrl(url = "") {
      // 定义一个包含图片扩展名的数组
      const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "svg"];

      // 获取URL的最后一个部分（通常是文件名），然后检查其扩展名是否在数组中
      const extension = url.split(".").pop().toLowerCase();
      return imageExtensions.includes(extension);
    },

    query_order() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "orders_detail",
          id: this.orderId,
        },
      }).then((res) => {
        if (res.code == 200) {
          let data = res.data;
          this.order_info = data;
          this.payInfo = data.payInfo;
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
.page {
  padding-bottom: 50px;

  .page-title {
    padding: 0 32px;
    text-align: left;
    height: 56px;
    line-height: 56px;
    background: #ffffff;
    font-size: 16px;
    font-family: Microsoft YaHei-Bold, Microsoft YaHei;
    font-weight: bold;
    color: #333333;
  }

  .page-ctx {
    margin-top: 14px;
    padding: 24px 32px;
    background: #fff;
  }
}

.pic-list {
  flex-wrap: wrap;

  .pic-item {
    margin-right: 20px;
  }
}

.file-info {
  a {
    font-size: 14px;
    color: #f00;
  }
}

.page {
  .description-card + .description-card {
    margin-top: 35px;
  }

  .description-card {
    background: #ffffff;
    border: 1px solid #cccccc;

    .head {
      font-weight: 400;
      font-size: 16px;
      color: #333333;
      line-height: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 48px;
      padding: 0 20px;
      background: #f5f5f5;
      border-bottom: 1px solid #cccccc;
    }

    .body {
      section {
        // padding: 30px;
        // border-bottom: 1px solid #eee;
      }

      section + section {
        border-top: 1px solid #eee;
      }

      .description-action {
        display: flex;
        padding-left: 110px;
        padding-bottom: 50px;

        button + button {
          margin-left: 20px;
        }
      }

      .goods-warp {
        display: flex;
        font-weight: 400;
        font-size: 14px;
        color: #333333;
        line-height: 18px;
        padding: 30px;
        border-bottom: 1px solid #e5e5e5;

        .left {
          display: flex;
          align-items: center;
          justify-content: flex-end;

          .image-warp {
            width: 100px;
            height: 100px;
            // border: 1px solid #9f9f9f;
            display: flex;
            align-items: center;
            justify-content: center;

            .elImg {
              width: 100px;
              height: 100px;
            }
          }

          .info-warp {
            margin-left: 24px;

            p {
              margin-bottom: 10px;
            }

            .sku {
              margin-top: 12px;
              color: #999;
            }
          }
        }

        .goods-item-info {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }
      }

      .item-info-box {
        padding: 30px;

        .item-info {
          display: flex;
          margin-bottom: 10px;
          font-weight: 400;
          font-size: 14px;
          color: #333333;
          line-height: 30px;

          .label {
            display: inline-block;
            min-width: 110px;
            padding-right: 10px;
            line-height: 30px;
          }

          .address {
            p {
              .copy {
                width: 30px;
                height: 30px;
                margin-left: 5px;
                transition: 0.2s all;
                cursor: pointer;

                &:hover {
                  opacity: 0.7;
                }
              }
            }
          }

          .image-list {
            display: flex;
            flex-wrap: wrap;

            img {
              width: 101px;
              height: 101px;
              margin-right: 15px;
              margin-bottom: 15px;
            }
          }

          .val {
            .goods-warp {
              display: flex;

              .image-warp {
                width: 104px;
                height: 104px;
                border: 1px solid #eee;

                img {
                  width: 100%;
                  height: 100%;
                }
              }

              .info-warp {
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                margin-left: 16px;

                .num {
                }

                .price {
                }

                .title {
                }
              }
            }
          }
        }
      }
    }
  }

  .btns {
    .red {
      width: 240px;
      height: 32px;
      background: #f74747;
      border-radius: 4px;
      color: #fff;
      font-size: 14px;
      font-weight: 400;
    }
  }
}
</style>
<!-- <style scoped lang="less" src="@/assets/h5css/shop/myOrder.less"></style> -->
