<template>
  <div class="bread-wrap flex">
    <div class="bread-box">
      <router-link to="">
        <img src="@/assets/menu/icons/home.png" alt="首页" />
        首页
      </router-link>
      <span class="bread-divider">></span>
      <!-- <template v-if="$route.meta.root">
        <a href="javascript:void(0)">
          {{ $route.meta.root }}
        </a>
        <span class="bread-divider">></span>
      </template> -->
      <router-link to="">
        {{ $route.meta.title || "" }}
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "bread-wrap",
  components: {},
  data() {
    return {};
  },
  created() {},
  methods: {},
};
</script>

<style scoped lang="less">
.bread-wrap {
  text-align: left;
  border-radius: 6px;
  font-size: 14px;
  color: #606266;
  .bread-box {
    display: flex;
    align-items: center;
  }

  a {
    font-size: 14px;
    color: #606266;
    display: flex;
    align-items: center;
  }
  img {
    width: 14px;
    height: 14px;
    margin-right: 5px;
  }
}

.bread-divider {
  margin: 0 5px;
}
</style>
