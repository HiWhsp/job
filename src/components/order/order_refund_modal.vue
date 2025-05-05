<template>
  <div class="modal-container">
    <el-dialog title="售后提示" width="580px" custom-class="cus-modal-wrap" :close-on-click-modal="true"
      :visible.sync="show_modal" :before-close="onbeforeclose" @closed="onclosed">
      <div class="modal-inner">
        <div class="success-box">
          <img src="@/static/common/success.png" alt="">
        </div>
        <div class="text-1">
          {{ vuex_config.comEmail }}
        </div>
        <div class="text-2">
          Please send the after-sales requirements to this email address
        </div>
      </div>
      <!-- <span slot="footer" class="dialog-footer">
        <button class="btn btn-ripple fit-text btn-1" @click="show_modal = false">取消</button>
        <el-button class="btn btn-ripple fit-text btn-2 btn-bg" @click="do_cancel()" :loading="loading">确认</el-button>
      </span> -->
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "order-refund-modal",
  components: {},
  // props: [""],
  data() {
    return {
      show_modal: false,
      info: {},
      loading: false,
    };
  },
  computed: {
    ...mapState([""]),
    // imgs() {
    //   let imgs = [];
    //   if (this.info && this.info.products) {
    //     imgs = this.info.products.map(v => v.image);
    //   }
    //   return imgs;
    // }
  },
  watch: {},
  created() {
    // this.throttle_do_cancel = this.mix_throttle(this.do_cancel, 1500)
  },
  methods: {
    init(info) {
      this.info = info;
      this.show_modal = true;
    },
    onbeforeclose() {
      this.show_modal = false;
    },
    onclosed() {
      // this.show_modal = false;
    },
    throttle_do_cancel() {

    },
    do_cancel() {
      // this.loading = true;
      // this.$api({
      //   url: '/service.php',
      //   method: 'get',
      //   data: {
      //     action: 'orders_detail',
      //     id: this.id
      //   },
      // }).then((res) => {
      //   alert(res).then(() => {
      //     this.loading = false;
      //   });
      //   if (res.code == 200) {
      //     this.$emit('confirm')
      //   }
      // });
    }
  }
};
</script>


<style scoped lang="less">
/deep/ .el-dialog__header {
  padding: 16px 24px;
  border-bottom: 1px solid #eee;
  background: #F7F7F7;

  font-family: Poppins, Poppins;
  // font-weight: 600;
  font-size: 18px;
  color: #333333;

  .el-dialog__close {
    font-size: 20px;
  }
}

/deep/ .el-dialog__body {
  padding: 34px 60px 53px;
}

/deep/ .el-dialog__footer {
  text-align: center;
  padding-bottom: 60px;

  button {
    width: 120px;
    height: 32px;
    background: #FFFFFF;
    border-radius: 50px 50px 50px 50px;
    border: 1px solid @theme;

    font-family: Arial, Arial;
    font-weight: 400;
    font-size: 14px;
    color: @theme;

    &+button {
      margin-left: 16px;
    }
  }

  .btn-1 {}

  .btn-2 {}

  .btn-bg {
    background: @theme;
    color: #ffffff;
  }
}

.cus-modal-wrap {
  .modal-inner {
    padding: 0;
    text-align: center;


    .success-box {
      width: 71px;
      height: 71px;
      margin: 0 auto;
      img {
        width: 71px;
        height: 71px;
      }
    }

    .text-1 {
      margin-top: 20px;
      font-family: Arial, Arial;
      font-weight: 400;
      font-size: 22px;
      color: #000000;
    }

    .text-2 {
      margin-top: 15px;
      font-family: Arial, Arial;
      font-weight: 400;
      font-size: 14px;
      color: #999999;
    }
  }
}
</style>
