<template>
  <div class="page">
    <!-- 图片预览 -->
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt/>
    </el-dialog>

    <div class="main-title">
      <span>评价</span>
      <button class="btn-ripple" @click="$router.back()">返回</button>
    </div>

    <div class="page-ctx">
      <div class="order-product">
        <div class="info-title">
          <div class="date">{{ info.createdTime }}</div>
          <div class="order-code">
            订单号：
            <span>{{ info.orderNo }}</span>
          </div>
          <div class="order-state">{{ info.statusInfo }}</div>
        </div>
        <div class="info-good">
          <div class="list-good">
            <div class="item" v-for="(product_item, index) in products" :key="index">
              <div class="item-good flex" @click="mix_to_product(product_item)">
                <div class="box-image">
                  <img :src="product_item.image" alt/>
                </div>
                <div class="box-title">
                  <div class="title" @click="mix_to_product(product_item)">
                    {{ product_item.title }}
                  </div>
                </div>
                <div class="box-sku">
                  <div class="goods-sku">{{ product_item.keyVals }}</div>
                </div>
                <div class="box-num">x {{ product_item.num }}</div>
                <div class="box-price">{{ vuex_huobi }} {{ product_item.priceSale }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="comment-box">
        <div class="form-box">
          <div class="title">
            <div class="text">总体评分</div>
            <div>
              <el-rate v-model="params.star"></el-rate>
            </div>
          </div>
          <div class="input-box">
            <el-input type="textarea" placeholder="分享购物心得..." v-model="params.content" maxlength="500"
                      :autosize="{ minRows: 8 }" show-word-limit/>
          </div>

          <div class="upload-box">
            <el-upload class="upload-demo" list-type="picture-card" accept="image/*" multiple :name="UPLOAD_NAME"
                       :action="UPLOAD_ACTION" :limit="upload_limit_number" :data="mix_upload_data"
                       :on-success="upload_on_success" :before-upload="upload_before_upload">
              <i class="el-icon-plus"></i>

              <div class="el-upload__tip" slot="tip">
                <div class="tip-text-1">添加图片</div>
                <div class="tip-text-2">
                  最多
                  <b class="number">6</b>
                  张
                </div>
              </div>
            </el-upload>
          </div>
        </div>
        <div class="submit-box flex-center">
          <button class="btn btn-ripple flex-center" @click="submit_pingjia">发表评价</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {UPLOAD_ACTION, UPLOAD_NAME} from '@/config/env.js'


import {mapState} from "vuex";

export default {
  name: "order-info",
  components: {},
  data() {
    return {
      UPLOAD_ACTION,
      UPLOAD_NAME,
      //
      params: {
        id: this.$route.query.orderId || "",//订单id
        star: '',
        star1: '',
        star2: '',
        uploadedfile1: '',
        content: '',
      },
      //
      products: [],
      info: {},
      upload_pic_list: [], //评价图片
      upload_limit_number: 6,
      //
      dialogVisible: false,
      dialogImageUrl: "",
    };
  },
  computed: {
    ...mapState([""]),
  },
  watch: {
    upload_pic_list(arr) {
      this.params.uploadedfile1 = this.upload_pic_list.join('|')
    }
  },
  created() {
    this.setView();
  },
  methods: {
    setView() {
      this.$api({
        url: '/service.php',
        method: 'get',
        data: {
          action: 'orders_detail',
          id: this.params.id
        },
      }).then((res) => {
        let {code, data, msg} = res;
        if (code == 200) {
          this.products = data.products;
          this.info = data;
        }
      });
    },

    //提交评价
    submit_pingjia() {
      let {content, star} = this.params;
      if (!star) {
        alertErr("请选择总体评分");
        return;
      }
      if (!content) {
        alertErr("请输入评价内容");
        return;
      }

      this.$api({
        url: '/service.php',
        method: 'get',
        data: {
          action: 'orders_comment',
          ...this.params
        },
      }).then((res) => {
        alert(res)
        let {code, msg, data} = res;
        if (code == 200) {
          this.$router.back();
        }
      });
    },

    //上传相关
    upload_on_success(res, file) {
      //console.log("上传结果", res);
      let {code, data, msg} = res;
      alert(res);
      if (code == 200) {
        // this.form.image = res.data;
        this.upload_pic_list.push(res.data)
      }
    },
    upload_before_upload(file) {
      const isLt2M = file.size / 1024 / 1024 < 20; //文件大小
      return isLt2M;
    },

  },
};
</script>

<style scoped lang="less">
/deep/ .el-rate__icon {
  color: @theme !important;
}

/deep/ .el-upload--picture-card {
  width: 100px;
  height: 100px;
  line-height: 100px;
}


.page {
  padding: 0;

  .main-title {
    .flex-between();
    padding: 0 32px;
    text-align: left;
    height: 56px;
    line-height: 56px;
    background: #ffffff;
    font-size: 16px;
    font-family: Microsoft YaHei-Bold, Microsoft YaHei;
    font-weight: bold;
    color: #333333;

    button {
      min-width: 96px;
      height: 30px;
      line-height: 30px;
      background: @theme;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }
  }
}

.page-ctx {
  margin-top: 24px;
  padding: 40px 60px;
  background: #fff;
}

/deep/ .btn-box {
  display: none;
}


.el-upload__tip {
  margin-top: 0;
  height: 100px;
  padding-left: 20px;
  display: inline-flex;
  // align-items: center;
  justify-content: center;
  flex-direction: column;

  .tip-text-1 {
    font-size: 16px;
    color: #777;
  }

  .tip-text-2 {
    margin-top: 20px;
    font-size: 14px;
    color: #888888;

    .number {
      color: #e6170b;
    }
  }
}

.order-product {
  border: 1px solid #e5e5e5;
  margin-bottom: 25px;

  .info-title {
    .flex-between();
    height: 48px;
    padding: 0 15px;
    background: #f5f5f5;
    border-bottom: 1px solid #e5e5e5;

    font-size: 14px;
    font-family: Microsoft YaHei-Bold, Microsoft YaHei;
    font-weight: bold;
    color: #333333;

    .date {
    }

    .order-code {
      flex: 2;
      text-align: left;
      padding-left: 20px;

      span {
      }
    }

    .order-state {
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      line-height: 20px;
      color: #999999;
    }
  }

  .info-good {
    .list-good {


      .item-good {
        padding: 20px;
        border-bottom: 1px dashed #F5F5F5;

        &:last-child {
          border: none;
        }


        .box-image {
          width: 100px;
          height: 100px;
          cursor: pointer;
          border: 1px solid #F5F5F5;


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
              color: @theme;
            }
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
          font-weight: 400;
          font-size: 14px;
          color: #FF0000;
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
          background: @theme;
          font-size: 14px;
          font-family: Microsoft YaHei;
          color: #ffffff;
          border-radius: 14px;
          transition: 0.3s;

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
}

.comment-box {
  .form-box {
    min-height: 327px;
    background: #ffffff;
    border: 1px solid #e5e5e5;

    .title {
      .flex();
      height: 48px;
      padding-left: 20px;
      background: #f5f5f5;
      border-bottom: 1px solid #e5e5e5;

      .text {
        margin-right: 20px;
      }
    }

    .input-box {
      /deep/ textarea {
        border: none;
        border-bottom: 1px solid #e5e5e5;
        padding-top: 20px;
        font-size: 14px;

        &:focus {
          border-color: #e5e5e5 !important;
        }
      }
    }
  }

  .submit-box {
    margin-top: 40px;
    padding-bottom: 20px;

    .btn {
      width: 250px;
      height: 48px;
      background: @theme;
      border-radius: 100px 100px 100px 100px;
      font-family: OPPOSans, OPPOSans;
      font-weight: 400;
      font-size: 16px;
      color: #FFFFFF;


      &:hover {
        opacity: 0.75;
      }
    }
  }
}

.upload-box {
  padding: 20px 20px;
  text-align: left;
}
</style>

<style scoped lang="less" src="@/assets/h5css/shop/order-review-submit.less"></style>
