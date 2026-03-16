<template>
  <div class="news-banner-wrap">
    <div class="page-top">
      <div class="page-top-banner">
        <img :src="banners[0].image" alt="" />
      </div>
      <!-- <div class="page-top-text-wrap w-1400">
        <div class="page-top-text-inner">
          <div class="main-title">内容资讯</div>
          <div class="btn btn-ripple fit-text">了解更多行业资讯</div>
        </div>
      </div> -->
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";

export default {
  name: "index",
  components: {},
  data() {
    return {
   
      //
    };
  },
  computed: {
    ...mapState(["vuex_map_banners"]),
    banners() {
      return this.vuex_map_banners['新闻中心'] || []
    },
  },
  watch: {},
  created() {

  },

  methods: {
 
  },
};
</script>

<style scoped lang="less">
.page-top {
  position: relative;

  .page-top-banner {
    img {
      width: 100%;
      height: 400px;
      object-fit: cover;
    }
  }

  .page-top-text-wrap {
    margin: 0 auto;

    .page-top-text-inner {
      position: absolute;
      top: 67px;
      text-align: left;
      padding-left: 60px;

      .main-title {
        font-family: Poppins, Poppins;
        font-weight: bold;
        font-size: 60px;
        color: #ffffff;
      }

      .btn {
        margin-top: 37px;
        padding: 0 24px;
        width: fit-content;
        height: 61px;
        background: #009f39;
        border-radius: 0px 0px 0px 0px;

        font-family: Poppins, Poppins;
        font-weight: 400;
        font-size: 30px;
        color: #ffffff;
      }
    }
  }
}
</style>
