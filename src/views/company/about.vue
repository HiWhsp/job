<template>
  <div class="page">
    <div class="page-ctx">
      <!-- 轮播图 element -->
      <el-carousel :interval="4000" height="638px">
        <el-carousel-item v-for="item in 4" :key="item">
          <img src="@/assets/image/home/banner.png" alt="" />
        </el-carousel-item>
      </el-carousel>
      <!-- 轮播图 end -->

      <!-- 产品列表 start -->
      <div class="product-list w-1400">
        <h2 class="title">公司介绍</h2>
        <p>
          “我们希望我们的模型的完美能给全世界的收藏家带来惊喜，这样他们也能体验到拥有一件独一无二的物品的难以置信的情感。”“我们对汽车和细节的热情，服务于最苛刻和最成熟的收藏家的热情。”通过传统与创新之间的微妙平衡，我们努力在我们的模型中表达意大利制造的所有优雅，风格和创造力。
          对细节的最准确的关注，优质的材料和生产技术的不断发展，确保了TOPART已成为公认的点
          供大型汽车制造商和汽车爱好者参考。
        </p>
      </div>
      <!-- 产品列表 end -->
    </div>
  </div>
</template>
<script>
export default {
  name: "index",
  data() {
    return {};
  },

  watch: {},
  created() {
    this.setView();
  },
  mounted() {},
  methods: {
    setView() {},
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
    margin-top: 48px;
    color: #414851;
    h2 {
      font-size: 44px;
      color: #000;
      font-weight: 600;
      margin-bottom: 24px;
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
