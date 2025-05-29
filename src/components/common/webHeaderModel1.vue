<template>
  <div class="wrap">
    <!-- <asideUtilModel1 /> -->
    <topHeaderInfoModel1 v-if="!this.$route.meta.hide_topHeaderInfo" />
    <topHeaderSearchModel1 v-if="!this.$route.meta.hide_topHeaderSearch" />
    <topNavModel1 v-if="!this.$route.meta.hide_topNav" />
    <!-- <router-view></router-view> -->
    <!-- <footerModel1 /> -->
  </div>
</template>
<script>
import topHeaderInfoModel1 from "@/components/common/topHeaderInfoModel1.vue";
import topHeaderSearchModel1 from "@/components/common/topHeaderSearchModel1.vue";
import topNavModel1 from "@/components/common/topNavModel1.vue";
import footerModel1 from "@/components/common/FooterModel1.vue";
import asideUtilModel1 from "@/components/common/asideUtilModel1.vue";

export default {
  components: {
    topHeaderInfoModel1,
    topHeaderSearchModel1,
    topNavModel1,
    footerModel1,
    asideUtilModel1,
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

