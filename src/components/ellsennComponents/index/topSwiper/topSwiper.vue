<template>
  <div class="layout">
    <div class="top-swiper">
      <div class="left">
        <div class="left-list">
          <div
            v-for="(item, index) in dataList"
            :key="index"
            class="list-item"
            @click="goToReportDetail(item)"
          >
            <div class="item-title">{{ item.title }}</div>
            <div class="item-info">
              <span class="item-time">{{ item.release_time }}</span>
              <span class="item-status">{{ item.copyright_type }}</span>
            </div>
          </div>
        </div>
        <el-button class="btn" type="primary" @click="goToReportList">
          查看更多<i class="el-icon-arrow-right"></i
        ></el-button>
      </div>
      <div class="right">
        <el-carousel
          class="right-carousel"
          trigger="click"
          :autoplay="true"
          arrow="always"
        >
          <el-carousel-item
            class="right-img"
            v-for="(item, index) in index_banners"
            :key="index"
            @click.native="do_banner_click(item)"
          >
            <img class="right-img" :src="item.image" alt="" />
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  components: {},
  props: {},
  name: "top-swiper",
  data() {
    return {
      dataList: [],
      imgList: [{ url: "" }],
    };
  },
  computed: {
    ...mapState([
      //
      "index_banners",
    ]),
  },
  created() {
    this.fetchData();
  },
  mounted() {},

  methods: {
    fetchData() {
      this.$api({
        url: "getReportList",
        method: "get",
        data: {
          page: 1,
          limit: 4,
          is_home: 1,
        },
      })
        .then((res) => {
          if (res.code == 200) {
            this.dataList = res.data.list;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    do_banner_click(item) {
      //console.log({ ...item });
      if (item.url) {
        window.open(item.url, "_blank");
      }
    },
    goToReportList() {
      this.$router.push("/researchReport");
    },
    goToReportDetail(item) {
      this.$router.push({
        path: "/reportDetails",
        query: {
          id: item.id,
        },
      });
    },
  },
};
</script>

<style scoped lang="less" src="./topSwiper.less"></style>
