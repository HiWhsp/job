<template>
  <div class="page">
    <!-- 佣金提现 -->
    <modalCommissionWithdraw ref="modalCommissionWithdraw" />

    <div class="main-title">
      <div class="left">我的佣金</div>
    </div>
    <div class="wrap">
      <div class="inner">
        <div class="img-box">
          <img src="@img/my/coin.png" alt />
        </div>
        <div class="text">{{vuex_huobi}}{{ baseInfo.yongjin }}</div>
        <div class="text-2">累积获得{{ baseInfo.yongjin_leiji }}元</div>

        <div class="action-box">
          <button class="btn" @click="$router.push('/myCommissionDetail?type=2')">收入</button>
          <button class="btn" @click="$router.push('/myCommissionDetail?type=1')">支出</button>
        </div>
        <div class="btn-box">
          <!-- <button class="btn-1" @click="$router.push('/yue')">我的余额</button> -->
          <!-- <button class="btn" @click="$router.push('/yue')">立即提现</button> -->
          <button class="btn" @click="open_modal_withdraw">立即提现</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import modalCommissionWithdraw from "@/components/modals/modalCommissionWithdraw.vue"; //新增地址
import { mapState } from "vuex";

export default {
  name: "chongzhijilu",
  components: {
    modalCommissionWithdraw,
  },
  data() {
    return {};
  },
  computed: {
    ...mapState(["baseInfo"]),
  },
  created() {
    this.setView();
  },

  methods: {
    open_modal_withdraw() {
      this.$refs.modalCommissionWithdraw.init();
    },

    setView() {
      this.$store.dispatch("query_user");
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
        width: 132px;
      }
    }
    .text {
      margin-top: 30px;
      font-size: 48px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #212121;
    }

    .text-2 {
      margin-top: 15px;
      font-size: 24px;
      color: #7d7d7d;
    }

    .action-box {
      margin: 30px auto;
      .flex-center();
      .btn {
        cursor: pointer;
        width: 240px;
        height: 60px;
        line-height: 60px;
        text-align: center;
        background: #ffffff;
        border: 1px solid #cccccc;

        font-size: 20px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        color: #333333;

        & + .btn {
          margin-left: 40px;
        }
      }
    }
    .btn-box {
      margin-top: 40px;

      .btn {
        width: 520px;
        height: 60px;
        line-height: 60px;
        background: #4CA5E4;
        border-radius: 0;
        font-size: 20px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        color: #fff;
        border: 1px solid #eeeeee;
      }
    }
  }
}
</style>
