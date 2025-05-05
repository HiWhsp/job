<script>
import commonMap from '@/components/map/commonMap.vue'

export default {
  name: "lianxi",
  components: {
    commonMap
  },
  data() {
    return {
      list: [{
        title: '业务咨询',
        desc: '<span style="font-size: 24px;">欢迎您联系我们</span><span style="margin-top: 10px;">0595-1234567</span><span style="margin-top: 10px;">周一至周五 09:00-18:00</span>',
        imgUrl: require('@/static/about/phone.png')
      }, {
        title: '商务合作',
        desc: '<span style="font-size: 24px;">欢迎您联系我们</span><span style="margin-top: 10px;">0595-1234567</span><span style="margin-top: 10px;">周一至周五 09:00-18:00</span>',
        imgUrl: require('@/static/about/emil.png')
      }, {
        title: '人才招聘',
        desc: '<span style="font-size: 24px;">简历请投递至</span><span style="margin-top: 10px;">CRYSTOCK@hotmail.com</span><span style="margin-top: 10px;">我们会尽快联系您</span>',
        imgUrl: require('@/static/about/map.png')
      }],
    }
  },
  mounted() {
    this.$refs.commonMap.init({longitude: this.vuex_config.site_lng, latitude: this.vuex_config.site_lat})
  },
  methods: {}
}
</script>

<template>
  <div class="content">
    <div class="nav-bar">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item><img src="@/static/home/home.png" alt="">当前位置</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>联系我们</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="item-wrap">
      <!--      <div class="title">山东奉新县砂轮行业协会科技有限公司</div>-->
      <div class="flex flex-between">
        <div class="item" v-for="(item, index) in list" :key="index">
          <img :src="item.imgUrl" alt="">
          <p class="tit">{{ item.title }}</p>
          <p class="desc" v-html="item.desc"></p>
        </div>
      </div>
      <div class="map">
        <commonMap ref="commonMap"></commonMap>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.content {
  padding: 20px 0 56px;
  width: 1400px;
  margin: 0 auto;

  .nav-bar {
    margin-bottom: 20px;

    img {
      width: 14px;
      margin-right: 10px;
    }
  }

  .item-wrap {
    width: 1400px;
    background: #fff;
    padding: 70px 40px 50px;

    .title {
      font-family: Roboto, Roboto;
      font-weight: bold;
      font-size: 36px;
      color: #383635;
      text-align: center;
    }

    .item {
      width: 300px;
      display: flex;
      flex-direction: column;
      align-items: center;

      img {
        width: 84px;
        height: 112px;
        padding-bottom: 28px;
        border-bottom: 3px solid #044FA0;
        z-index: 2;
      }

      .tit {
        margin-top: -2px;
        font-family: Roboto, Roboto;
        font-weight: bold;
        font-size: 18px;
        color: #333333;
        padding-top: 28px;
        border-top: 3px solid #d5d5d5;
      }

      .desc {
        text-align: center;
        font-family: Roboto, Roboto;
        font-weight: 400;
        font-size: 18px;
        color: #8D8D8D;
        margin-top: 37px;
        display: flex;
        flex-direction: column;
      }
    }

    .map {
      width: 100%;
      height: 400px;
      margin-top: 50px;
    }
  }
}
</style>
