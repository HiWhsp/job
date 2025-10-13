<template>
  <div class="wrap" v-if="vuex_config.loadDone">
    <webHeaderModel1 v-if="vuex_config.moban == 1 || vuex_config.moban == 3" />
    <webHeaderModel3 v-if="vuex_config.moban == 4 || vuex_config.moban == 5" />
    <webHeaderModel2 v-if="vuex_config.moban == '' || vuex_config.moban == 2 || vuex_config.moban == 6 || vuex_config.moban == 7" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import webHeaderModel1 from "@/components/common/webHeaderModel1.vue";
import webHeaderModel2 from "@/components/common/webHeaderModel2.vue";
import webHeaderModel3 from "@/components/common/webHeaderModel3.vue";
export default {
  components: {
    webHeaderModel1,
    webHeaderModel2,
    webHeaderModel3,
  },
  data() {
    return {
      
    };
  },
  computed: {
    ...mapState([""]),
  },

  methods: {
    
  },
};
</script>