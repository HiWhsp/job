<template>
  <div class="page">
    <div class="container">
      <top-swiper></top-swiper>
      <report></report>
      <news-insight></news-insight>
      <recent-activities></recent-activities>
    </div>
  </div>
</template>
<script>
//import { Swiper, SwiperOptions, Pagination, Navigation } from "swiper";
//import "swiper/swiper-bundle.min.css";
import newsInsight from '@/components/ellsennComponents/index/newsInsight/index.vue';
import recentActivities from '@/components/ellsennComponents/index/recentActivities/index.vue';
import report from '@/components/ellsennComponents/index/report/index.vue';
import topSwiper from '@/components/ellsennComponents/index/topSwiper/topSwiper.vue';
export default {
  name: 'index',
  components: {
    topSwiper,
    report,
    newsInsight,
    recentActivities
  },
  data() {
    return {};
  },
  computed: {},

  watch: {},
  created() {
    this.setView();
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
      this.showButton = window.scrollY > 200;
    },

    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    },
    setView() {},
  },
};
</script>

<style lang="less">
.el-select-dropdown__item.hover,
.el-select-dropdown__item:hover {
  background: #009f39;
  color: #fff !important;
}

.el-select-dropdown__item.selected {
  color: #009f39;
}
</style>
<style scoped lang="less" src="./index.less"></style>
<style scoped lang="less" src="@/assets/h5css/page/index.less"></style>
<style scoped lang="less" src="@/assets/h5css/mobile/index.less"></style>
