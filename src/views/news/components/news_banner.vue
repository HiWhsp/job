<template>
  <div class="news-banner-wrap">
    <div class="page-top">
      <div class="page-top-banner">
        <img :src="banner_list[0].image" alt="" />
      </div>
      <!-- <div class="page-top-text-wrap w-1400">
        <div class="page-top-text-inner">
          <div class="main-title">新闻动态</div>
          <div class="btn btn-ripple fit-text">NEWS</div>
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
    };
  },
  computed: {
    ...mapState(["vuex_map_banners"]),
    banner_list() {
      return this.vuex_map_banners["新闻动态"];
    },
  },
  mounted() {
    let banner_list = this.banner_list;
    console.log(banner_list);
  },

  methods: {},
};
</script>

<style scoped lang="less">
.page-top {
  position: relative;

  .page-top-banner {
    img {
      width: 100%;
      height: 560px;
      object-fit: cover;
    }
  }

  .page-top-text-wrap {
    margin: 0 auto;

    .page-top-text-inner {
      position: absolute;
      text-align: center;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      .main-title {
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: bold;
        font-size: 60px;
        color: #ffffff;
      }

      .btn {
        margin-top: 10px;
        padding: 0 24px;
        width: fit-content;
        height: 61px;
        border-radius: 0px 0px 0px 0px;

        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: 400;
        font-size: 30px;
        color: #ffffff;
      }
    }
  }
}
</style>
