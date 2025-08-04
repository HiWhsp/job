<template>
  <div class="aside">
    <div class="inner">
      <div class="list" v-if="showToTop">
        <!-- <div class="item" @click="toTop()">
          <div class="item-inner"></div>
        </div> -->
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
  props: [],
  data() {
    return {
      hoverIndex: "",
      showToTop: false,
    };
  },
  computed: {},
  watch: {},

  mounted() {
    let that = this;
    document.addEventListener("scroll", function () {
      that.scrollInit();
    });
  },

  methods: {
    scrollInit() {
      let ret = false;
      if (document && document.documentElement.scrollTop) {
        if (document.documentElement.scrollTop > 900) {
          ret = true;
        }
      }
      this.showToTop = ret;
      // return ret
    },

    toTop() {
      document.documentElement.scrollTop = 0;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.aside {
  position: fixed;
  right: 173px;
  bottom: 150px;
  width: 49px;
  height: 51px;
  border-radius: 5px;

  .inner {
    .list {
      background: #cccccc;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .item {
        width: calc(100%);
        padding: 10px 10px;

        cursor: pointer;

        .item-inner {
          height: 32px;
          background-size: contain;
          background-repeat: no-repeat;
        }

        &:nth-child(1) {
          .item-inner {
            background-image: url("~@pro/common/top-white.png");

            &.yishoucang {
              background-image: url("~@pro/common/top-white.png");
            }
          }
        }

        &:hover {
          background-color: #f00;
        }
      }
    }
  }
}
</style>
