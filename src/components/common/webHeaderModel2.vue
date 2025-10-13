<template>
  <div class="wrap">
    <asideUtilModel2 />
    <!--  -->
    <topHeaderInfoModel2 v-if="!this.$route.meta.hide_topHeaderInfo" />
    <!--  -->
    <topHeaderSearchModel2 v-if="!this.$route.meta.hide_topHeaderSearch" />
    <!--  -->
    <topNavModel2 v-if="!this.$route.meta.hide_topNav" />
    <!--  -->
    <!-- <router-view></router-view> -->
    <!--  -->
    <!-- <footerModel2 /> -->
  </div>
</template>
<script>
import topHeaderInfoModel2 from "@/components/common/topHeaderInfoModel2.vue";
import topHeaderSearchModel2 from "@/components/common/topHeaderSearchModel2.vue";
import topNavModel2 from "@/components/common/topNavModel2.vue";
import footerModel2 from "@/components/common/FooterModel2.vue";
import asideUtilModel2 from "@/components/common/asideUtilModel2.vue";

export default {
  components: {
    topHeaderInfoModel2,
    topHeaderSearchModel2,
    topNavModel2,
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

