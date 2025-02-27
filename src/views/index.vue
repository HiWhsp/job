<template>
  <div class="page">
    <div class="page-ctx">
      <!-- 轮播图 element -->
      <el-carousel :interval="4000" height="600px">
        <el-carousel-item v-for="(item, index) in index_banners" :key="index">
          <img :src="item.image" alt="" />
        </el-carousel-item>
      </el-carousel>
      <!-- 轮播图 end -->

      <!-- 产品列表 start -->
      <div class="product-list w-1200">
        <h2 class="title">公司介绍</h2>
        <p>{{  vuex_config.comDesc}}</p>
      </div>
      <!-- 产品列表 end -->
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "index",
  data() {
    return {};
  },
  computed: {
    ...mapState(['index_banners'])
  },
  mounted() {
    this.setView();

  },
  methods: {
    setView() {
    },
  },
};
</script>

<style scoped lang="less">
.page {
  padding-top: 0;
  padding-bottom: 80px;
  background: #000;

  .inner {
    padding-top: 0;
    margin: 0 auto;
    position: relative;
  }

  .product-list {
    margin-top: 48px;
    color: #fff;
    h2 {
      font-size: 44px;
      color: #fff;
      font-weight: 600;
      margin-bottom: 24px;
    }
    p {
      line-height: 28px;
    }
  }

  // 轮播图高度600px
  .el-carousel__container {
    height: 600px;
  }

  .el-carousel__item {
    height: 600px;
  }

  .el-carousel__item img {
    width: 100%;
    height: 100%;
  }
}
</style>
