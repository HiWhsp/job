<template>
  <div class="page">
    <!-- 图片预览 -->
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>

    <!-- 提交成功弹框 -->
    <el-dialog
      :visible.sync="submitSuccessVisible"
      custom-class="submit-success-dialog"
      :show-close="true"
      :close-on-click-modal="false"
      width="520px"
    >
      <div class="submit-success">
        <div class="icon-wrap">
          <img src="@/assets/img/product/product-add-success.png" alt />
        </div>
        <div class="title">Submission successful!</div>
        <div class="sub">Thank you for your support!</div>
        <div class="actions">
          <button class="btn btn-home" @click="go_home">HOMEPAGE</button>
          <button class="btn btn-shop" @click="continue_shopping">CONTINUE SHOPPING</button>
        </div>
      </div>
    </el-dialog>

    <div class="main-title">
      <span>My COMMENT</span>
    </div>

    <div class="page-ctx">
      <div class="info-title">
        <div class="date">{{ info.createdTime }}</div>
        <div class="order-code">
          Order No.
          <span class="colon"></span>
          <span>{{ info.orderNo }}</span>
        </div>
      </div>

      <div class="review-list">
        <div class="review-item" v-for="(product_item, index) in products" :key="index">
          <div class="review-left">
            <div class="box-image" @click="mix_to_product(product_item)">
              <img :src="product_item.image" alt />
            </div>
            <div class="box-title" @click="mix_to_product(product_item)">
              <div class="title">{{ product_item.title }}</div>
            </div>
          </div>

          <div class="review-right">
            <div class="form-title">
              <div class="text">Overall review:</div>
              <div class="rate">
                <el-rate v-model="params.star"></el-rate>
              </div>
            </div>

            <div class="input-box">
              <el-input
                type="textarea"
                placeholder="Share shopping tips..."
                v-model="params.content"
                maxlength="500"
                :autosize="{ minRows: 6 }"
                show-word-limit
              />
            </div>

            <div class="upload-row">
              <el-upload
                class="upload-demo"
                list-type="picture-card"
                accept="image/*"
                multiple
                :name="UPLOAD_NAME"
                :action="UPLOAD_ACTION"
                :limit="upload_limit_number"
                :data="mix_upload_data"
                :on-success="upload_on_success"
                :before-upload="upload_before_upload"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
              <div class="upload-tip">Upload up to 6 photos</div>
            </div>
          </div>
        </div>
      </div>

      <div class="submit-box flex-center">
        <button class="btn btn-ripple flex-center" @click="submit_pingjia">PUBLISH COMMENT</button>
      </div>
    </div>
  </div>
</template>

<script>
import { UPLOAD_ACTION, UPLOAD_NAME } from "@/config/env.js";

import { mapState } from "vuex";

export default {
  name: "order-info",
  components: {},
  data() {
    return {
      UPLOAD_ACTION,
      UPLOAD_NAME,
      //
      params: {
        id: this.$route.query.orderId || "", //订单id
        inventoryId: this.$route.query.inventoryId || "", //商品规格
        star: "",
        star1: "",
        star2: "",
        uploadedfile1: "",
        content: ""
      },
      //
      products: [],
      info: {},
      upload_pic_list: [], //评价图片
      upload_limit_number: 6,
      //
      dialogVisible: false,
      dialogImageUrl: "",
      submitSuccessVisible: false
    };
  },
  computed: {
    ...mapState([""])
  },
  watch: {
    upload_pic_list(arr) {
      this.params.uploadedfile1 = this.upload_pic_list.join("|");
    }
  },
  created() {
    this.init_params();
    this.setView();
  },
  methods: {
    init_params() {},
    setView() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "orders_detail",
          id: this.params.id
        }
      }).then(res => {
        let { code, data, msg } = res;
        if (code == 200) {
          this.products = data.products.filter(
            v => v.id == this.params.inventoryId
          );
          this.info = data;
        }
      });
    },

    //提交评价
    submit_pingjia() {
      let { content, star } = this.params;
      if (!star) {
        alertErr("请选择总体评分");
        return;
      }
      if (!content) {
        alertErr("请输入评价内容");
        return;
      }

      // let inventoryId = this.info.products.map((v) => v.id).join();
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "orders_comment",
          ...this.params
        }
      }).then(res => {
        let { code, msg, data } = res;
        if (code == 200) {
          this.submitSuccessVisible = true;
        }
      });
    },

    go_home() {
      this.submitSuccessVisible = false;
      this.$router.push("/");
    },

    continue_shopping() {
      this.submitSuccessVisible = false;
      // 默认跳到热卖列表页（如需其它商品页可再调整）
      this.$router.push("/product-cates");
    },

    //上传相关
    upload_on_success(res, file) {
      //console.log("上传结果", res);
      let { code, data, msg } = res;
      alert(res);
      if (code == 200) {
        // this.form.image = res.data;
        this.upload_pic_list.push(res.data);
      }
    },
    upload_before_upload(file) {
      const isLt2M = file.size / 1024 / 1024 < 20; //文件大小
      return isLt2M;
    }
  }
};
</script>

<style scoped lang="less">
/deep/ .el-rate__icon {
  color: #ffc208 !important;
}

/deep/ .el-upload--picture-card {
  width: 100px;
  height: 100px;
  line-height: 100px;
}

.page {
  padding-bottom: 80px;

  .main-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 32px;
    text-align: left;
    height: 70px;
    line-height: 70px;
    background: #ffffff;
    font-size: 20px;
    font-family: Microsoft YaHei-Bold, Microsoft YaHei;
    font-weight: bold;
    color: #1e262e;

    button {
      min-width: 96px;
      height: 30px;
      line-height: 30px;
      background: #00306B;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }
  }
}

.page-ctx {
  margin-top: 24px;
  padding: 30px;
  background: #fff;
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

/deep/.btn-box {
  display: none;
}

.info-title {
  display: flex;
  align-items: center;
  height: 65px;
  padding: 0 15px;
  background: #f5f5f5;
  border: 1px solid #e5e5e5;
  border-bottom: none;
  gap: 20px;

  font-size: 20px;
  font-family: Microsoft YaHei-Bold, Microsoft YaHei;
  font-weight: bold;
  color: #333333;

  .order-code {
    text-align: right;

    .colon {
      display: inline-block;
      width: 6px;
    }
  }
}

.review-list {
  border: 1px solid #e5e5e5;
  border-top: none;
  background: #fff;
}

.review-item {
  display: flex;
  align-items: stretch;
  border-top: 1px solid #f0f0f0;

  &:first-child {
    border-top: none;
  }
}

.review-left {
  width: 260px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  .box-image {
    width: 200px;
    height: 200px;
    cursor: pointer;
    border: 1px solid #f5f5f5;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .box-title {
    cursor: pointer;
    text-align: left;

    .title {
      line-height: 20px;
      font-size: 14px;
      color: #333;

      &:hover {
        color: #00306B;
      }
    }
  }
}

.review-right {
  flex: 1;
  padding: 16px 20px 20px;
}

.form-title {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 40px;
  color: #333;

  .text {
    font-size: 14px;
    font-family: Microsoft YaHei-Bold, Microsoft YaHei;
    font-weight: bold;
  }
}

.input-box {
  margin-top: 8px;

  /deep/ textarea {
    border: 1px solid #e5e5e5;
    border-radius: 2px;
    font-size: 14px;
    padding: 12px;

    &:focus {
      border-color: #d7d7d7 !important;
    }
  }
}

.upload-row {
  margin-top: 12px;
  display: flex;
  align-items: flex-start;
  gap: 18px;
}

.upload-tip {
  color: #888;
  font-size: 14px;
  line-height: 100px;
  white-space: nowrap;
}

.submit-box {
  margin-top: 40px;
  padding-bottom: 20px;

  .btn {
    width: 250px;
    height: 48px;
    background: #f07a2c;
    border-radius: 4px;
    font-family: OPPOSans, OPPOSans;
    font-weight: 600;
    font-size: 16px;
    color: #ffffff;
    text-transform: uppercase;

    &:hover {
      opacity: 0.85;
    }
  }
}

/* 提交成功弹窗 */
/deep/ .submit-success-dialog {
  border-radius: 6px;
  overflow: hidden;

  .el-dialog__header {
    padding: 12px 16px;
  }

  .el-dialog__body {
    padding: 26px 28px 30px;
  }
}

.submit-success {
  text-align: center;

  .icon-wrap {
    width: 50px;
    height: 50px;
    margin: 0 auto 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .title {
    font-size: 22px;
    font-weight: 700;
    color: #1e262e;
    line-height: 28px;
  }

  .sub {
    margin-top: 6px;
    font-size: 18px;
    font-weight: 600;
    color: #1e262e;
    line-height: 26px;
  }

  .actions {
    margin-top: 22px;
    display: flex;
    justify-content: center;
    gap: 16px;
    flex-wrap: wrap;

    .btn {
      min-width: 170px;
      height: 42px;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 700;
      color: #fff;
      padding: 0 18px;
      transition: 0.2s;

      &:hover {
        opacity: 0.9;
      }
    }

    .btn-home {
      background: #ec6a2b;
    }

    .btn-shop {
      background: #00306B;
    }
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/shop/order-review-submit.less"></style>
