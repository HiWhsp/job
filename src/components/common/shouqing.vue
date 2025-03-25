<template>
  <div class="mask-modal" v-if="!kucun">
    <div class="mask-bg"></div>
    <img src="@img/other/shouqing.png" alt="" />
  </div>
</template>

<script>
export default {
  name: "shouqing",
  props: ["kucun",], 
  data() {
    return {

    };
  },
  computed: {

  },
  created() {

  },
  methods: {

  },
};
</script>


<style scoped lang="less">
.mask-modal {
  position: absolute;
  z-index: 10;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  border-radius: 6px;
  overflow: hidden;

  .mask-bg {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
  }
  img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100px;
  }
}
</style>
