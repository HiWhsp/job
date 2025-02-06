<template>
  <div class="wrap">
    <!-- 侧边 -->
    <asideUtilModel2 />

    <topHeaderInfoModel2 v-if="!this.$route.meta.hide_topHeaderInfo" />
    <topHeaderSearchModel2 v-if="!this.$route.meta.hide_topHeaderSearch" />

    <!-- 导航 -->
    <topNavModel3 v-if="!this.$route.meta.hide_topNav"/>


    <!-- 视图 -->
    <!-- <router-view></router-view> -->


    <!-- 底部 -->
    <!-- <footerModel2 /> -->
  </div>
</template>
<script>
import topHeaderInfoModel2 from "@/components/common/topHeaderInfoModel2.vue";
import topHeaderSearchModel2 from "@/components/common/topHeaderSearchModel2.vue";
import topNavModel3 from "@/components/common/topNavModel3.vue";
import footerModel2 from "@/components/common/FooterModel2.vue";
import asideUtilModel2 from "@/components/common/asideUtilModel2.vue";

export default {
  components: {
    topHeaderInfoModel2,
    topHeaderSearchModel2,
    topNavModel3,
    footerModel2,
    asideUtilModel2,
  },
  data() {
    return {
      
    };
  },
  computed: {
    // ...mapState([""]),
  },

  methods: {
    
  },
};
</script>

