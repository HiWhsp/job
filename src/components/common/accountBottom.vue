<template>
    <div class="bottom">
      <p>{{vuex_config.com_address}}</p>

      <p>
        {{vuex_config.banquan}}
        <a
          v-if="vuex_config.icplianjie"
          class="beian-link  beian-link-black"
          :href="vuex_config.icplianjie"
        >{{vuex_config.icpinfo}}</a>
        <a v-else href="https://beian.miit.gov.cn/" class="beian-link">冀ICP备2021008105号-1</a>
      </p>
    </div>
</template>

<script>
// import QRCode from "qrcodejs2";
import { mapState } from "vuex";

export default {
  name: "commonShare",
  components: {},
  props: [],
  data() {
    return {
     
    };
  },
  computed: {
    // ...mapState(["", ])
  },
  watch: {},

  mounted() {},

};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .bottom {
    display: flex;
    justify-content: center;
    flex-direction: column;
    font-size: 14px;
    line-height: 26px;
    color: #333333;
    padding: 50px 0;
  }
</style>
