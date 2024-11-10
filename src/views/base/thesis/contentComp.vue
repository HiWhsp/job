<template>
    <div class="content main">
        <div class="content-title">论文致谢奖励申请表</div>
        <div class="content-item" v-if="index === 1">

        </div>
    </div>
</template>

<script>
export default {
    name: "content",
    props: ['index'],
    data() {
        return {}
    },
    methods: {}
}
</script>

<style scoped lang="less">
.content {
  background-color: #fff;
  padding: 57px 0 58px;
  .flex();
  flex-direction: column;

  .content-title {
    font-weight: bold;
    font-size: 22px;
    color: #333333;
  }
}
</style>