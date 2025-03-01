<template>
  <div class="page">
    <div class="page-ctx">
      <!-- 轮播图 element -->
      <el-carousel :interval="4000" height="638px">
        <el-carousel-item v-for="item in this.index_banners" :key="item.id">
          <img :src="item.image" alt="" />
        </el-carousel-item>
      </el-carousel>
      <!-- 轮播图 end -->

      <!-- 产品列表 start -->
      <div class="product-list w-1400">
        <h2 class="title">公司介绍</h2>
        <p v-html="content"></p>
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
    return {
      content: ''
    };
  },

  computed: {
    ...mapState(["index_banners"]),
  },
  created() {
    this.setView();
  },
  mounted() {
  },
  methods: {
    setView() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "news_detail",
          id: 95
        },
      }).then((res) => {
        this.content = res.data.info.content
      })
    },
  },
};
</script>

<style scoped lang="less">
.page {
  width: 1400px;
  margin: 0 auto;
  padding-top: 20px;
  padding-bottom: 80px;

  .inner {
    padding-top: 0;
    margin: 0 auto;
    position: relative;
  }

  .product-list {
    color: #414851;
    h2 {
      font-size: 44px;
      color: #000;
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
