<template>
  <div class="wrap-section-title">
    <div class="section-title">
      <div class="text-box">
        <span class="link" @click="jump_link">
          <b>{{title1}}</b>
          <span>{{title2}}</span>
        </span>
      </div>
      <div class="line-box">
        <span></span>
      </div>
    </div>
  </div>
</template>

<script>
// import QRCode from "qrcodejs2";
import { mapState } from "vuex";

export default {
  name: "commonShare",
  components: {},
  props: ["arrTitle"],
  data() {
    return {};
  },
  computed: {
    title1() {
      return this.arrTitle[0] || "";
    },
    title2() {
      return this.arrTitle[1] || "";
    },
  },
  methods: {
    jump_link() {
      let title = this.arrTitle.join('')
      console.log(title)
      if(title == '合作店铺区') {
        this.$router.push('/hezuodianpu')
      }
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.wrap-section-title {
  .section-title {
    .text-box {
      font-size: 26px;
      color: var(--main_color);
      b {
      }
      span {
      }

      .link {
        cursor: pointer;
      }
    }
    .line-box {
      span {
        display: inline-block;
        width: 50px;
        height: 2px;
        background: var(--main_color);
      }
    }
  }
}
</style>
