<template>
  <div class="page">
    <div class="main-title">
      <div class="left">我的余额</div>
    </div>
    <div class="wrap">
      <div class="inner">
        <div class="img-box">
          <img :src="icon" alt />
        </div>
        <div class="text">充值成功！</div>
        <div class="btn-box">
          <button class="btn-1" @click="$router.push('/yue')">我的余额</button>
          <button class="btn-2" @click="$router.push('/')">去购物</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";

export default {
  name: "chongzhijilu",
  components: {},
  data() {
    return {
      icon: require("@img/yue/yue-chenggong.png"),
      list: [2, 2, 3],
    };
  },
  computed: {
    ...mapState(["baseInfo"]),
  },
  created() {
    this.setView();
  },

  methods: {
    setView() {
      this.$api("orders_detail", {
        id: this.order_id,
      }).then((res) => {
        let { code, data, message } = res.data;
        if (code == 200) {
          this.list = data;
        }
      });
    },
    onClickLeft() {
      this.$router.back();
    },
  },
};
</script>


<style scoped lang="less">
.page {
  .main-title {
    .flex-between();
    margin-bottom: 20px;
    text-align: left;
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    line-height: 20px;
    color: #333333;

    .left {
    }
    .right {
      .flex();
      img {
        margin-right: 15px;
        width: 16px;
      }
      span {
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 24px;
        color: #222222;
      }
    }
  }
}

.wrap {
  .inner {
    padding: 0;

    .img-box {
      margin-top: 50px;
      img {
        width: 150px;
      }
    }
    .text {
      margin-top: 30px;
      font-size: 18px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      line-height: 17px;
      color: #212121;
    }
    .btn-box {
      margin-top: 40px;

      .btn-1 {
        width: 170px;
        height: 40px;
        background: #fff;
        border-radius: 45px;
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #7d7d7d;
        border: 1px solid #eeeeee;
      }

      .btn-2 {
        margin-left: 20px;
        width: 170px;
        height: 40px;
        background: linear-gradient(90deg, #ff9312 0%, #eb5d53 100%);
        border-radius: 45px;
        font-size: 16px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #ffffff;
      }
    }
  }
}
</style>
