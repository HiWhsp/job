<template>
  <div class="page">
    <div class="main-title">申请售后</div>

    <div class="step-box step-1">
      <div class="step-item">
        <div class="text-box">① 买家申请仅退款</div>
        <div class="right-arrow"></div>
      </div>
      <div class="step-item">
        <div class="text-box">② 卖家处理退款申请</div>
        <div class="right-arrow"></div>
      </div>
      <div class="step-item">
        <div class="text-box">③ 退款完毕</div>
        <div class="right-arrow"></div>
      </div>
    </div>

    <div class="refund-info">
      <div class="center">
        <orderInfo :order="orderObj" />
      </div>

      <div class="comment-box">
        <div class="form-box">
          <div class="label">申请原因</div>
          <div class="input-box">
            <el-input type="textarea" placeholder="请输入内容" v-model="reason" maxlength="1000" />
          </div>
          <div class="label">详细说明</div>
          <div class="input-box">
            <el-input type="textarea" placeholder="请输入内容" v-model="remark" maxlength="1000" />
          </div>

          <div class="label">图片上传</div>

          <div class="upload-box">
            <el-upload class="upload-demo" list-type="picture-card" multiple accept="image/*" :name="upload_col_name" :action="uploadAction" :on-success="uploadSuccess_pingjia" :before-upload="beforeUpload_pingjia" :data="uploadExtraData">
              <!-- <i class="el-icon-upload"></i> -->
              上传图片
              <!-- <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div> -->
            </el-upload>
          </div>
        </div>

        <div class="submit-box">
          <button @click="summit_refund">提交申请</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import order from "@/shop-actions/order";
import refund from "@/shop-actions/refund";

import orderInfo from "@/components/order/orderInfo.vue"; //
import { mapState } from "vuex";

export default {
  name: "servicePage",
  components: {
    orderInfo,
  },
  data() {
    return {
      order_id: this.$route.query.order_id,
      type: this.$route.query.type,
      orderObj: {}, //

      images: [], //评价图片
      reason: "",
      remark: "",

      //图片预览
      dialogVisible: false,
      dialogImageUrl: "",
    };
  },
  computed: {
    ...mapState(["defaultAvatar"]),
  },
  created() {
    this.setView();
  },
  methods: {
    setView() {
      this.orders_detail(); //获取订单详情
    },

    //获取订单详情
    orders_detail() {
      order.orders_detail({
        params: {
          id: this.order_id,
        },
        success: (data) => {
          //console.log("orders_detail", data);
          this.orderObj = data;
        },
      });
    },

    //提交评价
    summit_refund() {
      let { remark } = this;

      if (!remark) {
        alertErr("请输入售后说明");
        return;
      }

      let urlArrStr = "";
      if (this.images) {
        urlArrStr = this.images.join("|");
      }

      let product_info = "";
      if (this.type == 3) {
        product_info = this.orderObj.products.map((v) => ({
          inventoryId: v.id,
          num: v.num,
        }));
      }

      let formData = {
        order_id: this.order_id,
        type: this.type,
        reason: this.reason,
        remark: this.remark,
        product_info: product_info, // [{"inventoryId":3739,"num":1}] 换货(type=3)时传，退款不用传
        uploadedfile1: urlArrStr,
      };
      //console.log("要提交的信息", formData);
      // return;

      refund.refund_add({
        params: {
          ...formData,
        },
        success: (data) => {
          this.$router.push("/order-list");
        },
      });
    },

    //上传相关
    //作品相关
    uploadSuccess_pingjia(res, file) {
      //console.log("上传结果", res);
      let { code, image, message } = res;

      if (code == 200) {
        this.images.push(image);
      }
    },

    beforeUpload_pingjia(file) {
      const isLt2M = file.size / 1024 / 1024 < 20; //文件大小
      return isLt2M;
    },
  },
};
</script>


<style scoped lang="less">
/deep/ .order-list-wrap {
  margin-top: 30px;
}
/deep/ .info-heji {
  display: none !important;
}

.page {
  padding-bottom: 80px;
  .main-title {
    margin-bottom: 20px;
    text-align: left;

    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    line-height: 20px;
    color: #333333;
  }
}

.step-box {
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  line-height: 20px;
  color: #9f9f9f;

  .flex();

  .step-item {
    flex: 1;
    height: 48px;
    line-height: 48px;
    position: relative;
    background: #eee;

    .right-arrow {
      position: absolute;
      z-index: 100;
      right: -48px;
      top: 0;
      width: 30px;
      height: 100%;

      border: 24px solid transparent;
      border-left-color: #e5e5e5;
    }

    &:nth-child(3) {
      .right-arrow {
        display: none;
      }
    }
  }

  &.step-1 {
    .step-item {
      &:nth-child(1) {
        background: @theme;
        color: #fff;

        .right-arrow {
          border-left-color: @theme;
        }
      }
    }
  }
  &.step-2 {
    .step-item {
      &:nth-child(2) {
        background: @theme;
        color: #fff;

        .right-arrow {
          border-left-color: @theme;
        }
      }
    }
  }
  &.step-3 {
    .step-item {
      &:nth-child(3) {
        background: @theme;
        color: #fff;

        .right-arrow {
          border-left-color: @theme;
        }
      }
    }
  }
}

.refund-info {
  padding: 20px 20px;
  min-height: 746px;
  background: #ffffff;
  border: 1px solid #cccccc;
  border-top: none;
}

.comment-box {
  text-align: left;

  .label {
    margin: 20px 0;
  }

  .submit-box {
    margin-top: 40px;
    button {
      width: 240px;
      height: 60px;
      line-height: 60px;
      background: #ff3d00;
      font-size: 20px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: #ffffff;
    }
  }
}
</style>
