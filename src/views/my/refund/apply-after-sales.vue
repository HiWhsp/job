<template>
  <div class="page">
    <div class="main-title">申请售后</div>

    <div class="page-ctx">
      <div class="info-item" v-for="(item, index) in list" :key="index">
        <div class="info-good">
          <div class="list-good">
            <div
              class="item-good flex"
              v-for="(product_item, product_index) in item.products"
              :key="product_index"
            >
              <div
                class="box-image cover"
                @click="mix_to_product(product_item)"
              >
                <!-- <img :src="good.img" alt /> -->
                <el-image :src="product_item.image">
                  <div slot="error" class="image-slot">
                    <img :src="product_item.image" />
                  </div>
                </el-image>
              </div>

              <div class="box-title">
                <div class="goods-title" @click="mix_to_product(product_item)">
                  {{ product_item.title }}
                </div>
                <div class="goods-sku">{{ product_item.keyVals }}</div>
              </div>
              <div class="box-sku">
                <div class="goods-sku">
                  {{ vuex_huobi }}{{ product_item.priceSale }}
                </div>
              </div>
              <div class="box-num">
                {{ product_item.num }}
              </div>
              <div class="box-price">
                {{ vuex_huobi }}
                {{ product_item.priceSale * product_item.num }}.00
              </div>
            </div>
          </div>
        </div>
      </div>

      <template v-if="!hasChooseServeType">
        <div class="select-serve-type">选择服务类型</div>

        <div class="serve-type-wrap">
          <div
            class="serve-type"
            @click="chooseServeType(item, index)"
            v-for="(item, index) in serveTypeList"
            :key="index"
          >
            <div class="img-wrap">
              <img :src="item.img" alt="" />
            </div>
            <div class="title-wrap">
              <div class="title">{{ item.title }}</div>
              <div class="sub-title">{{ item.subTitle }}</div>
            </div>
          </div>
        </div>
      </template>
      <template v-if="hasChooseServeType && status === 0">
        <div class="refund-reason-wrap formItem">
          <div class="refund-reason-label label">
            退款原因：<span style="color: red">*</span>
          </div>
          <el-select
            class="item"
            v-model="refundReason"
            placeholder="请选择"
          ></el-select>
        </div>
        <div class="refund-money-wrap formItem">
          <div class="refund-money-label label">
            退款原因：<span style="color: red">*</span>
          </div>
          <el-input
            class="item refund-money-item"
            v-model="refundMoney"
            placeholder="请选择"
          ></el-input>
        </div>
        <div class="sub-help">最多￥2199.00，含运费￥0.00</div>
        <div class="refund-explanation-wrap formItem">
          <div class="refund-explanation-label label">退款说明：</div>
          <el-input
            type="textarea"
            class="item refund-explanation-item"
            v-model="refundMoney"
            :rows="6"
            placeholder="退款说明"
          ></el-input>
        </div>
        <div class="refund-upload-wrap formItem">
          <div class="refund-upload-label label">上传凭证：</div>
          <div class="upload-img-wrap">
            <img :src="upload" alt="" />
          </div>
        </div>
        <div class="submit-apply-btn-wrap" @click="submitApply">提交申请</div>
      </template>
      <template v-if="hasChooseServeType && status === 1">
        <div class="refund-reason-wrap formItem">
          <div class="refund-reason-label label">
            退货原因：<span style="color: red">*</span>
          </div>
          <el-select
            class="item"
            v-model="refundReason"
            placeholder="请选择"
          ></el-select>
        </div>
        <div class="refund-money-wrap formItem">
          <div class="refund-money-label label">
            退款原因：<span style="color: red">*</span>
          </div>
          <el-input
            disabled
            class="item refund-money-item"
            v-model="refundMoney"
            placeholder="请选择"
          ></el-input>
        </div>
        <div class="sub-help">最多￥2199.00，含运费￥0.00</div>
        <div class="refund-explanation-wrap formItem">
          <div class="refund-explanation-label label">退货说明：</div>
          <el-input
            type="textarea"
            class="item refund-explanation-item"
            v-model="refundGoodsExplanation"
            :rows="6"
            placeholder="退货说明"
          ></el-input>
        </div>
        <div class="refund-upload-wrap formItem">
          <div class="refund-upload-label label">上传凭证：</div>
          <div class="upload-img-wrap">
            <img :src="upload" alt="" />
          </div>
        </div>
        <div class="submit-apply-btn-wrap" @click="submitApply">提交申请</div>
      </template>
      <template v-if="hasChooseServeType && status === 2">
        <div class="refund-reason-wrap formItem">
          <div class="refund-reason-label label">
            退货原因：<span style="color: red">*</span>
          </div>
          <el-select
            class="item"
            v-model="refundReason"
            placeholder="请选择"
          ></el-select>
        </div>
        <div class="refund-explanation-wrap formItem">
          <div class="refund-explanation-label label">换货说明：</div>
          <el-input
            type="textarea"
            class="item refund-explanation-item"
            v-model="refundGoodsExplanation"
            :rows="6"
            placeholder="换货说明"
          ></el-input>
        </div>
        <div class="refund-upload-wrap formItem">
          <div class="refund-upload-label label">上传凭证：</div>
          <div class="upload-img-wrap">
            <img :src="upload" alt="" />
          </div>
        </div>
        <div class="submit-apply-btn-wrap" @click="submitApply">提交申请</div>
      </template>
    </div>
  </div>
</template>

<script>
import serveType1 from "@/assets/img/refund/serve-type-1.png";
import serveType2 from "@/assets/img/refund/serve-type-2.png";
import serveType3 from "@/assets/img/refund/serve-type-3.png";
import upload from "@/assets/img/refund/upload.png";

export default {
  name: "servicePage",
  components: {},
  data() {
    return {
      list: [
        {
          createdTime: "2022-10-21 12:24:30",
          orderNo: "154545456456456",
          orderStatus: "-5",
          products: [
            {
              image: "",
              title: "激光平面窗口 Φ5.0mm 厚度=2.0mm",
              keyVals: "GCL-010158",
              num: 1,
              priceSale: "5000.00",
            },
          ],
          count_goods: 2,
          price: "10000.00",
          ifPay: 1,
        },
      ],
      serveTypeList: [
        {
          title: "仅退款",
          subTitle: "与卖家协商同意不用退货只退款",
          img: serveType1,
        },
        {
          title: "退货退款",
          subTitle: "退还收到的货物，并退款",
          img: serveType2,
        },
        {
          title: "换货",
          subTitle: "买家退货后商家补发新货",
          img: serveType3,
        },
      ],
      hasChooseServeType: false,
      refundReason: "",
      refundMoney: "￥2199.00",
      upload,
      status: -1,
      refundGoodsExplanation: "",
    };
  },

  computed: {},

  created() {},

  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    applyAfterSale() {
      this.$router.push({
        path: "apply-after-sale",
      });
    },
    chooseServeType(item, index) {
      this.hasChooseServeType = true;
      this.status = index;
    },
    submitApply() {
      this.$router.push({
        path: "apply-result",
        query: {
          status: this.status,
        },
      });
    },
  },
};
</script>


<style scoped lang="less">
.page {
  padding: 0;

  .main-title {
    margin-bottom: 20px;
    padding: 0 32px;
    text-align: left;
    height: 56px;
    font-weight: bold;
    line-height: 56px;
    background: #ffffff;
    font-size: 16px;
    font-family: Microsoft YaHei-Bold, Microsoft YaHei;
    color: #333333;
  }

  .page-ctx {
    padding: 24px 32px;
    background: #fff;
  }
}

.info-item {
  border: 1px solid #f5f5f5;
  margin-bottom: 30px;
}

.info-title {
  .flex-between();
  height: 48px;
  padding: 0 24px;
  background: #f9f9f9;
  border-bottom: 1px solid #f5f5f5;

  font-size: 14px;
  font-family: Microsoft YaHei-Bold, Microsoft YaHei;
  font-weight: bold;
  color: #333333;

  .order-code {
    flex: 2;
    text-align: left;
    padding-left: 20px;
  }
}

.info-good {
  .list-good {
    .item {
      border-bottom: 1px solid #f5f5f5;

      &:last-child {
        border-bottom: none;
      }
    }

    .item-good {
      padding: 20px;
      border-bottom: 1px dashed #f5f5f5;

      &:last-child {
        border: none;
      }

      .box-image {
        width: 100px;
        height: 100px;
        cursor: pointer;
        border: 1px solid #f5f5f5;

        /deep/ img {
          width: 100px;
          height: 100px;
          object-fit: contain;
          object-fit: cover;
        }

        img {
          width: 100px;
          height: 100px;
          object-fit: contain;
          object-fit: cover;
        }
      }

      .box-title {
        flex: 1;
        text-align: left;
        padding-left: 40px;

        .title {
          width: fit-content;
          cursor: pointer;

          &:hover {
            color: #4ca5e4;
          }
        }

        .goods-title {
          width: 300px;
          height: 38px;
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: 400;
          font-size: 16px;
          color: #333333;
          line-height: 18px;
          text-align: left;
          font-style: normal;
          text-transform: none;
        }

        .goods-sku {
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: 400;
          font-size: 14px;
          color: #999999;
          line-height: 16px;
          text-align: left;
          font-style: normal;
          text-transform: none;
        }
      }

      .box-sku {
        text-align: center;
        min-width: 200px;
      }

      .box-num {
        text-align: center;
        min-width: 200px;
      }

      .box-price {
        text-align: center;
        min-width: 200px;

        font-family: OPPOSans, OPPOSans;
        font-weight: bold;
        font-size: 14px;
        color: #333;
      }
    }

    .goods-action {
      .flex();
      justify-content: flex-end;
      padding: 10px;

      .btn-goods-action {
        padding-left: 10px;
        padding-right: 10px;
        margin-left: 10px;
        min-width: 96px;
        height: 30px;
        background: #4ca5e4;
        font-size: 14px;
        font-family: Microsoft YaHei;
        color: #ffffff;
        // border-radius: 14px;
        transition: 0.3s;
        border-radius: 4px;

        &:hover {
          opacity: 0.8;
        }

        &.disabled {
          background: #e5e5e5;
        }
      }
    }
  }
}

.select-serve-type {
  margin: 27px 0 21px 0;
  font-family: Microsoft YaHei, Microsoft YaHei;
  font-weight: 400;
  font-size: 16px;
  color: #333333;
  line-height: 30px;
  text-align: left;
  font-style: normal;
  text-transform: none;
}

.serve-type-wrap {
  display: flex;
  gap: 16px;
  .serve-type {
    width: 360px;
    height: 120px;
    display: flex;
    gap: 17px;
    padding-left: 19px;
    align-items: center;
    background: #ffffff;
    border-radius: 4px 4px 4px 4px;
    cursor: pointer;
    border: 1px solid #eeeeee;
    &.active {
      border: 1px solid #27417c;
    }
    .img-wrap {
      width: 46px;
      height: 48px;
      img {
        width: 46px;
        height: 48px;
      }
    }
    .title-wrap {
      .title {
        height: 21px;
        margin-bottom: 12px;
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: bold;
        font-size: 16px;
        color: #333333;
        line-height: 19px;
        text-align: left;
        font-style: normal;
        text-transform: none;
      }
      .sub-title {
        width: 196px;
        height: 19px;
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: 400;
        font-size: 14px;
        color: #9f9f9f;
        line-height: 19px;
        text-align: left;
        font-style: normal;
        text-transform: none;
      }
    }
  }
}

.refund-reason-wrap {
  margin-top: 40px;
}

.refund-money-item {
  ::v-deep .el-input__inner {
    color: #ff3d00;
  }
}

.sub-help {
  margin: 20px 0 0 90px;
  font-family: Microsoft YaHei, Microsoft YaHei;
  font-weight: 400;
  font-size: 12px;
  color: #999999;
  line-height: 14px;
  text-align: left;
  font-style: normal;
  text-transform: none;
}

.refund-explanation-wrap {
  height: 132px;
}

.upload-img-wrap {
  width: 90px;
  height: 90px;
  img {
    width: 90px;
    height: 90px;
  }
}

.formItem {
  margin-top: 20px;
  display: flex;
  gap: 14px;
  .label {
    width: 77px;
    height: 19px;
    line-height: 19px;
    flex-shrink: 0;
    font-weight: 400;
    font-size: 14px;
    line-height: 30px;
    text-align: left;
    font-style: normal;
    text-transform: none;
  }
  .item {
    width: 469px;
    height: 34px;
    background: #ffffff;
    border-radius: 4px 4px 4px 4px;
    border: 1px solid #e2e2e2;
  }

  .refund-explanation-item {
  }
}

.submit-apply-btn-wrap {
  margin: 22px 0 0 90px;
  width: 240px;
  height: 34px;
  background: #27417c;
  border-radius: 4px 4px 4px 4px;
  font-family: Microsoft YaHei, Microsoft YaHei;
  font-weight: 400;
  font-size: 16px;
  color: #ffffff;
  line-height: 34px;
  text-align: center;
  font-style: normal;
  text-transform: none;
  cursor: pointer;
}
</style>
