<template>
  <div class="silder-nav-box goTop">
    <div class="silder-nav-item">
      <el-tooltip
        class="item"
        effect="light"
        :content="setting.comKefu"
        placement="left"
      >
        <div slot="content">
          <img class="code-img" :src="setting.shareImg" alt="" />
          <p class="code-text">微信扫码咨询</p>
        </div>
        <div class="silder-nav-icon">
          <img src="../../assets/img/common/slider-icon-zxkf.png" alt="" />
          <p class="text">在线客服</p>
        </div>
      </el-tooltip>
    </div>
    <div
      class="silder-nav-item last-item"
      v-show="showTopBtn"
      @click="goTopFun"
    >
      <div class="silder-nav-icon">
        <img src="../../assets/img/common/slider-icon-hddb.png" alt="" />
      </div>
      <p class="text">回到顶部</p>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "goTop",
  data() {
    return {
      showTopBtn: true,
      isSelect: "",
      setting: {},
    };
  },
  computed: {
    ...mapState([]),
  },
  watch: {
  },
  created() {
    this.get_setting();
  },
  methods: {
    goTopFun() {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth", // 可选，平滑滚动效果
      });
    },
    get_setting() {
      this.$api("index_config", {}).then((res) => {
        let { code, data, message, count } = res;
        if (code == 200) {
          let data = res.data;
          this.setting = data;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.code-img {
  width: 140px;
  height: 140px;
  background: #ffffff;
  border-radius: 0px 0px 0px 0px;
  // border: 1px solid #707070;
}
.code-text {
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: #666666;
  line-height: 20px;
  text-align: center;
}
.goTop {
  position: fixed;
  left: 0.1%;
  top: 80%;
  transform: translateY(-50%);
  width: 70px;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  z-index: 999;
}
.silder-nav-box {
  background: #ffffff;
  box-shadow: 0rem 0.17rem 0.25rem 0.08rem rgba(0, 0, 0, 0.16);
  border-radius: 0.67rem 0.67rem 0.67rem 0.67rem;
  padding: 10px;
  width: 6.67rem;
  .silder-nav-item {
    width: 5.5rem;
    height: 6.67rem;
    border-radius: 0rem 0rem 0rem 0rem;
    text-align: center;
    border-bottom: 1px solid #ddd;
    cursor: pointer;
    .silder-nav-icon {
      text-align: center;
      margin-top: 1.17rem;
      img {
        width: 2.33rem;
        height: 2.33rem;
      }
    }
    .text {
      margin-top: 0.67rem;
      font-family: PingFang SC, PingFang SC;
      font-weight: 500;
      font-size: 1.17rem;
      color: #1e2024;
    }
  }
  .last-item {
    border-bottom: 0 !important;
  }
  .car-icon {
    position: relative;
    span {
      display: block;
      width: 1.5rem;
      height: 1.5rem;
      font-size: 10px;
      line-height: 1.5rem;
      text-align: 1.5rem;
      border-radius: 50%;
      background: red;
      color: #fff;
      position: absolute;
      right: 7px;
      top: -5px;
    }
  }
}
@media screen and (max-width: 1024px) {
  .code-img {
    width: 140px;
    height: 140px;
    background: #ffffff;
    border-radius: 0px 0px 0px 0px;
    // border: 1px solid #707070;
  }
  .code-text {
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #666666;
    line-height: 20px;
    text-align: center;
  }
  .goTop {
    position: fixed;
    right: 0.1%;
    top: 50%;
    transform: translateY(-50%);
    width: 70px;
    height: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: column;
    z-index: 999;
  }
  .silder-nav-box {
    background: #ffffff;
    box-shadow: 0rem 0.17rem 0.25rem 0.08rem rgba(0, 0, 0, 0.16);
    border-radius: 0.67rem 0.67rem 0.67rem 0.67rem;
    padding: 10px;
    width: 3.67rem;
    .silder-nav-item {
      width: 3.5rem;
      height: 3.67rem;
      border-radius: 0rem 0rem 0rem 0rem;
      text-align: center;
      border-bottom: 1px solid #ddd;
      cursor: pointer;
      .silder-nav-icon {
        text-align: center;
        margin-top: 0.5rem;
        img {
          width: 1.33rem;
          height: 1.33rem;
        }
      }
      .text {
        margin-top: 0.27rem;
        font-family: PingFang SC, PingFang SC;
        font-weight: 500;
        font-size: 12px;
        color: #1e2024;
      }
    }
    .last-item {
      border-bottom: 0 !important;
    }
    .car-icon {
      position: relative;
      span {
        display: block;
        width: 1rem;
        height: 1rem;
        font-size: 10px;
        line-height: 1rem;
        text-align: 1rem;
        border-radius: 50%;
        background: red;
        color: #fff;
        position: absolute;
        right: 7px;
        top: -5px;
      }
    }
  }
}
</style>
