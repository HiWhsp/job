<template>
  <div class="page">
    <div class="nav-box">
      <div class="title flex">
        <p class="tit">关于富俊</p>
        <p class="desc">运动组件采购商城</p>
      </div>
      <div class="nav flex">
        <div class="item pointer" :class="{'active': current === 1}" @click="itemClick(1)">公司简介</div>
        <div class="col"></div>
        <div class="item pointer" :class="{'active': current === 2}" @click="itemClick(2)">新闻资讯</div>
        <div class="col"></div>
        <div class="item pointer" :class="{'active': current === 3}" @click="itemClick(3)">联系我们</div>
      </div>
    </div>
    <jianjie v-if="current === 1"></jianjie>
    <xinwen v-if="current === 2"></xinwen>
    <lianxi v-if="current === 3"></lianxi>
  </div>
</template>

<script>
import jianjie from './jianjie.vue'
import xinwen from './xinwen.vue'
import lianxi from './lianxi.vue'

export default {
  name: 'companyProfile',
  components: {
    jianjie,
    xinwen,
    lianxi
  },
  data() {
    return {
      current: 1,
      dataList: [],
      params: {
        channelId: 50,
        page: 1,
        pageNum: 10,
        isIndex: 0,
        orderType: 0
      }
    }
  },
  mounted() {
    this.itemClick(this.current)
  },
  methods: {
    itemClick(val) {
      this.current = val;
    }
  }
}
</script>

<style lang="less" scoped>
.page {
  width: 100%;
  background-color: #fff;
  padding: 0;

  .nav-box {
    position: relative;
    height: 550px;
    background-image: url("../../static/about/about-top.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;

    .title {
      flex-direction: column;
      justify-content: center;
      text-align: center;
      height: 100%;

      .tit {
        font-family: Roboto, Roboto;
        font-weight: bold;
        font-size: 28px;
        color: #FFFFFF;
      }

      .desc {
        font-family: Roboto, Roboto;
        font-weight: 400;
        font-size: 18px;
        color: #C2BEB9;
      }
    }

    .nav {
      position: absolute;
      bottom: 0;
      width: 1200px;
      height: 75px;
      background: rgba(0, 0, 0, 0.5);
      border-radius: 0px 0px 0px 0px;
      margin-left: -600px;
      left: 50%;
      justify-content: center;

      .item {
        position: relative;
        color: #fff;
        font-family: Roboto, Roboto;
        font-weight: bold;
        font-size: 18px;
      }

      .item.active {
        color: #F4A116;
      }

      .item.active::after {
        content: "";
        position: absolute;
        width: 68px;
        height: 3px;
        background: #F4A116;
        bottom: -20px;
        left: 3px;
      }

      .col {
        width: 0px;
        height: 17px;
        border: 1px solid #FFFFFF;
        opacity: 0.5;
        margin: 0 62px;
      }
    }
  }

  .content {
    width: 100%;
  }
}
</style>
