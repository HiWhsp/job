<template>
  <div class="w-banner-wrap">
    <div class="w-banner-inner">
      <el-carousel trigger="click" :autoplay="true">
        <el-carousel-item v-for="(item, index) in index_banners" :key="index" @click.native="do_banner_click(item)">
          <img :src="item.image" alt="" />
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: {
    config: {
      type: Object,
      default() {
        return {

        }
      },
    }
  },
  data() {
    return {

    };
  },
  computed: {

  },
  created() { },
  methods: {
    do_banner_click() {

    }
  },
};
</script>
<style lang="less" scoped>
.w-banner-wrap {
  .w-banner-inner {
    position: relative;
    width: 100%;
    height: 700px;
    /deep/ .el-carousel__container {
      height: 700px;
    }
    /deep/ img {
      width: 100%;
      height: 700px;
      cursor: pointer;
    }
  }
}
</style>
