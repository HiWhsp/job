<template>
  <div v-html="payGateWay" v-show="false">{{ payGateWay }}</div>
</template>

<script>
export default {
  name: "payGateWay",
  data() {
    return {
      payGateWay: "",
    };
  },
  mounted() {
    let form = this.$route.query.htmlData;
    //console.log("表单信息", form);
    this.payGateWay = form;
    this.$nextTick(() => {
      document.getElementById("alipaysubmit").submit();
    });
  },
};
</script>
