<template>
  <div class="company-select-wrap">
    <el-button type="primary" @click="do_open_lib()">从图片库选择</el-button>
    <image_lib_modal data-title="图片库" ref="image_lib_modal" />
  </div>
</template>

<script>
import image_lib_modal from "@/components/lib/image_lib_modal.vue";

import { mapState } from "vuex";
export default {
  components: {
    image_lib_modal,
  },
  props: {
    search_params: {
      type: Object,
      default: function () {
        return {};
      },
      required: false,
    },
  },
  data() {
    return {

    };
  },
  computed: {},
  watch: {},
  created() {

  },
  mounted() {},
  methods: {
    do_open_lib() {
      this.$refs.image_lib_modal.init();
    },
  },
};
</script>

<style scoped lang="less">
</style>