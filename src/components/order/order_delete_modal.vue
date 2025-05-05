<template>
  <div class="modal-container">
    <el-dialog title="操作提示" width="580px" custom-class="cus-modal-wrap" :close-on-click-modal="true"
      :visible.sync="show_modal" :before-close="onbeforeclose" @closed="onclosed">
      <div class="modal-inner">
        <!-- <div class="img-list flex-center">
          <div class="img-box" v-for="(item, index) in imgs" :key="index">
            <img :src="item" alt />
          </div>
        </div> -->
        <div class="text-box">
          确认删除当前订单?
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <button class="btn btn-ripple fit-text btn-1" @click="show_modal = false">取消</button>
        <el-button class="btn btn-ripple fit-text btn-2 btn-bg" @click="throttle_do_confirm()"  :loading="loading">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "order-cancel-modal",
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
    this.throttle_do_confirm = this.mix_throttle(this.do_confirm, 1500)
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
    throttle_do_confirm() {

    },
    do_confirm() {
      this.loading = true;
      this.$api({
        url: '/service.php',
        method: 'get',
        data: {
          action: 'orders_del',
          id: this.info.id
        },
      }).then((res) => {
        alert(res).then(() => {
          this.loading = false;
        });
        if (res.code == 200) {
          this.$emit('confirm')
          this.show_modal  = false;
        }
      });
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

    & + button {
      margin-left: 16px;
    }
  }

  .btn-1 {

  }

  .btn-2 {

  }

  .btn-bg {
    background: @theme;
    color: #ffffff;
  }
}

.cus-modal-wrap {
  .modal-inner {
    padding: 0;
    text-align: center;

    .img-list {
      .img-box {
        margin: 0 10px;
        width: 120px;
        height: 120px;

        img {
          width: 120px;
          height: 120px;
          object-fit: cover;
        }
      }
    }

    .text-box {
      margin-top: 20px;
      flex: 2;
      text-align: center;
      font-size: 16px;
      font-family: Microsoft YaHei;
      // font-weight: bold;
      line-height: 20px;
      color: #333333;

      img {
        width: 25px;
        margin-right: 10px;
      }
    }
  }
}
</style>
