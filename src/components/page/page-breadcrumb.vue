<template>
  <div class="bread-box">
    <div class="bread-inner flex w-1200">
      <router-link to="/">
         <img src="@/static/common/home.png" alt="" />
        首页
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
  height: 60px;
  line-height: 60px;
  border-top: 1px solid #313131;
  border-bottom: 1px solid #313131;

  .bread-inner {
    margin: 0 auto;
    // width: 95%;

    a {
      display: inline-flex;
      align-items: center;

      font-family: OPPOSans, OPPOSans;
      // font-weight: bold;
      font-size: 15px;
      color: #fff;

      img {
        margin-right: 10px;
      }
    }

    .link {
      font-family: OPPOSans, OPPOSans;
      // font-weight: bold;
      font-size: 15px;
      color: #fff;
    }

    .route-link {
      font-family: OPPOSans, OPPOSans;
      // font-weight: bold;
      font-size: 15px;
      color: #fff;
    }

    .arrow {
      margin: 0 6px;
      color: #aeaeae;
    }

    >*:last-child {
      font-family: OPPOSans, OPPOSans;
      // font-weight: bold;
      font-size: 15px;
      color: #fff;
    }
  }
}
</style>


<style scoped lang="less" src="@/assets/h5css/mobile/bread.less"></style>
