<template>
  <div class="kefu-box">
    <div class="qian-kefu"></div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "page-kefu",
  components: {},
  props: [],
  data() {
    return {
      detail: {},
      code: "",
    };
  },
  computed: {
    ...mapState(["webConfig"]),
  },
  watch: {},

  mounted() {
    this.setView();
  },

  methods: {
    setView() {
      this.$api("index_newsDetail", {
        id: 134,
      }).then((res) => {
        let { code, data } = res;
        if (code == 200) {
          this.detail = data.info;
          let codeStr = data.info.jianjie;
          //console.log("代码", codeStr);
          try {
            let start_index = codeStr.match(`\<script\>`).index + 8;
            let end_index = codeStr.match(`\<\/script\>`).index;
            let new_script = codeStr.substring(start_index, end_index);
            //console.log("new_script", new_script);
            eval(new_script);
          } catch (error) {}
        }
      });
    },
  },
};
</script>

<style scoped lang="less"></style>
