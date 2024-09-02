<template>
  <div class="modal-container">
    <el-dialog title="满减提示" width="580px" custom-class="cus-modal-wrap" :close-on-click-modal="true"
      :visible.sync="show_modal" :before-close="onbeforeclose" @closed="onclosed">
      <div class="modal-inner">
        <div class="icon-box">
          <img src="@/static/index/manjian.png" alt="">
        </div>
        <div class="text-box">
          Over $500- $20，Over $1000- $50
          Over $2000- $100
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <button class="btn btn-ripple fit-text btn-1 btn-bg" @click="to_daili()">Distributor</button>
        <button class="btn btn-ripple fit-text btn-2" @click="to_cate1()">{{ vuex_product_cate_1.title }}</button>
        <button class="btn btn-ripple fit-text btn-3" @click="to_cate2()">{{ vuex_product_cate_2.title }}</button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "order-tip-modal",
  components: {},
  // props: [""],
  data() {
    return {
      show_modal: false,
      info: {},
    };
  },
  computed: {
    ...mapState(["vuex_product_cate_1", 'vuex_product_cate_2']),
  },
  watch: {},
  created() {
   
  },
  methods: {
    init() {
      this.show_modal = true;
    },
    onbeforeclose() {
      this.show_modal = false;
    },
    onclosed() {
      // this.show_modal = false;
    },
    to_daili() {
      this.$router.push('/contact?apply=1')
    },
    to_cate1() {
      this.$router.push(this.vuex_product_cate_1.route)
    },
    to_cate2() {
      this.$router.push(this.vuex_product_cate_2.route)
    },
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
  padding: 34px 40px 53px;
}

/deep/ .el-dialog__footer {
  text-align: center;
  padding-bottom: 60px;

  button {
    width: 150px;
height: 45px;
border-radius: 0px 0px 0px 0px;
border: 1px solid #4CA5E4;
font-family: Arial, Arial;
font-weight: 400;
font-size: 17px;
color: #4CA5E4;


    &+button {
      margin-left: 16px;
    }
  }

  .btn-1 {}

  .btn-2 {}

  .btn-bg {
    background: #4CA5E4;
    color: #ffffff;
  }
}

.cus-modal-wrap {
  .modal-inner {
    padding: 0 0; 
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

    .icon-box {
      img {
        width: 61px;
      }
    }

    .text-box {
      margin-top: 20px;
      font-family: Arial, Arial;
      font-weight: 400;
      font-size: 22px;
      color: #000000;
    }
  }
}
</style>
