<template>
  <div class="lunbo-wrap">
    <div class="lunbo-box">
      <el-carousel trigger="click" :autoplay="true" @change="change_banner">
        <el-carousel-item v-for="(item, index) in list" :key="index"  @click.native="onClickBanner(item)">
          <!-- <a :href="item.url"> -->
            <img :src="item.image" />
          <!-- </a> -->
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "common-banner",
  components: {},
  props: ["list"],
  data() {
    return {
      activeBannerIndex: 0,
    };
  },
  computed: {},
  methods: {
    change_banner(index_curr, index_prev) {
      this.activeBannerIndex = index_curr;
    },
    onClickBanner(item) {
      //console.log({ ...item });

      if (item.url) {
        // this.jump_link(item.url);

        location.href = item.url
      } else  {

      }
    },
  },
};
</script>


<style scoped lang="less">
.lunbo-box {
  position: relative;
  width: 100%;
  height: 845px;

  /deep/ .el-carousel__container {
    height: 845px;
  }

  /deep/ img {
    width: 100%;
    height: 845px;
    cursor: pointer;
  }
}
</style>
