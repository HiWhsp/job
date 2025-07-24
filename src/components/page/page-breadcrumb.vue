<template>
  <div class="bread-box">
    <div class="bread-inner flex w-1400">
      <router-link to="/">
        <!-- <img src="@img/common/home.png" alt="" /> -->
        Home
        <!-- Home -->
      </router-link>

      <template v-if="level1.title">
        <span class="arrow">&gt;</span>
        <a v-if="!level1.route" class="link" href="javascript: void(0)">{{
          level1.title
        }}</a>
        <router-link v-else :to="level1.route" class="route-link">{{
          level1.title
        }}</router-link>
      </template>

      <template v-if="level2.title">
        <span class="arrow">&gt;</span>
        <!-- <a href="javascript: void(0)">{{ level2.title }}</a> -->

        <a v-if="!level2.route" class="link" href="javascript: void(0)">{{
          level2.title
        }}</a>
        <router-link v-else :to="level2.route" class="route-link">{{
          level2.title
        }}</router-link>
      </template>

      <template v-if="level3.title">
        <span class="arrow">&gt;</span>
        <a href="javascript: void(0)">{{ level3.title }}</a>
      </template>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "page-bread",
  components: {},
  props: {
    option: {
      required: false,
      default() {
        return [];
      },
    },
  },
  data() {
    return {};
  },
  computed: {
    level1() {
      return this.option[0] || { title: this.$route.meta.title };
    },
    level2() {
      return this.option[1] || { title: "" };
    },
    level3() {
      return this.option[2] || { title: "" };
    },
  },
  methods: {},
};
</script>

<style scoped lang="less">
.bread-box {
  padding: 0px 0;

  .bread-inner {
    margin: 0 auto;
    // width: 95%;

    a {
      display: inline-flex;
      align-items: center;

      font-family: OPPOSans, OPPOSans;
      // font-weight: bold;
      font-size: 15px;
      color: #999999;

      img {
        margin-right: 10px;
      }
    }

    .link {
      font-family: OPPOSans, OPPOSans;
      // font-weight: bold;
      font-size: 15px;
      color: #999999;
    }

    .route-link {
      font-family: OPPOSans, OPPOSans;
      // font-weight: bold;
      font-size: 15px;
      color: #999999;
    }

    .arrow {
      margin: 0 6px;
      color: #aeaeae;
    }

    > *:last-child {
      font-family: OPPOSans, OPPOSans;
      // font-weight: bold;
      font-size: 15px;
      color: #33ae60;
    }
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/mobile/bread.less"></style>
