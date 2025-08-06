<template>
  <div class="modal-container">
    <el-dialog
      title="采购额度详情"
      width="768px"
      custom-class="modal-custom"
      :close-on-click-modal="false"
      :visible.sync="show"
      :before-close="onModalClose"
    >
      <div class="modal-inner">
        <div class="modal-ctx">
          <div class="store-detail">
            <div class="store-detail-content">
              <div>订单号/售后单号：</div>
              <div>{{ info.orderNo }}</div>
            </div>
            <div class="store-detail-content">
              <div>采购/售后时间：</div>
              <div>{{ info.createdTime }}</div>
            </div>
            <div class="store-detail-content">
              <div>审核状态：</div>
              <div>{{ info.shenheStatusName }}</div>
            </div>
            <div class="store-detail-content">
              <div>金额：</div>
              <div>{{ vuex_huobi }}{{ info.price }}</div>
            </div>
            <div class="store-detail-content">
              <div>采购人：</div>
              <div>{{ info.caigou_user.realName }}</div>
            </div>
            <div class="store-detail-content">
              <div>采购商品：</div>
              <div>
                <div>共 {{ info.productNum }} 件</div>
                <div
                  class="store-product-info"
                  v-for="(item, index) in (info, children)"
                  :key="index"
                >
                  <div>品名：{{ item.title }}</div>
                  <div>
                    {{ vuex_huobi }} {{ item.priceSale }}x{{ item.num }}，共{{
                      vuex_huobi
                    }}
                    {{ item.priceTotal }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <button class="btn-ripple fit-text btn-bg" @click="show = false">
          确定
        </button>
      </span>
    </el-dialog>
  </div>
</template>
  
  <script>
import { mapState } from "vuex";

export default {
  name: "reg-type-modal",
  components: {},
  // props: [""],
  data() {
    return {
      show: false,
      remark: "",
      passwdConfirm: "",
      passWarn: "",
      info: {
        caigou_user: {},
        children: [],
      },
    };
  },
  computed: {},
  watch: {},
  methods: {
    init(info) {
      this.show = true;
      this.info = info;
      console.log(info);
    },
    onModalClose() {
      this.show = false;
    },

    onConfirm() {
      this.show = false;
      this.$router.back();
    },

    form_submit() {
      this.$emit("confirm", this.remark);
      this.show = false;
    },
  },
};
</script>
  
  <style scoped lang="less">
/deep/ .modal-custom {
  .modal-inner {
    padding: 0;
  }

  .modal-ctx {
    .store-detail-content {
      display: grid;
      grid-template-columns: 1fr 4fr;
      margin-top: 16px;
      font-size: 16px;
      &:first-child {
        margin-top: 0;
      }
    }
    .store-product-info {
      margin-top: 16px;
      font-size: 16px;
      &:first-child {
        margin-top: 0;
      }
    }
  }
}

/deep/ .el-dialog__header {
  text-align: center;
  padding: 16px 24px;
  border-bottom: 1px solid #eee;
  background: #f7f7f7;

  font-family: Poppins, Poppins;
  font-weight: 600;
  font-size: 18px;
  color: #333333;

  .el-dialog__close {
    font-size: 20px;
  }
}

/deep/ .el-dialog__body {
  padding: 70px 60px;
}

/deep/ .el-dialog__footer {
  text-align: center;
  padding-bottom: 50px;

  button {
    min-width: 120px;
    height: 32px;
    background: #ffffff;
    border-radius: 50px 50px 50px 50px;
    border: 1px solid #F74747;
    font-family: Arial, Arial;
    font-weight: 400;
    font-size: 14px;
    color: #F74747;

    & + button {
      margin-left: 20px;
    }
  }

  .btn-bg {
    background: #F74747;
    color: #ffffff;
  }
}

.btn-send {
  // position: absolute;
  // right: -50px;
  // top: 10px;
  min-width: 90px;
  padding: 0 10px;
  height: 40px;
  background: #fff;
  color: #F74747;
  font-size: 14px;
  margin-left: 15px;
  border-radius: 5px;

  &:disabled {
    background: #eee;
    color: #999;
    cursor: not-allowed;
  }
}
</style>
  
  <style scoped lang="less" src="@/assets/h5css/modals/phone_bind_modal.less"></style>