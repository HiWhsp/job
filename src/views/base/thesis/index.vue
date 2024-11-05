<template>
    <div class="container">
        <div class="top-img">
            <img src="@/assets/img/base/thesis_bg.png" alt="">
            <span>论文致谢</span>
        </div>
        <div class="nav-wrap">
            <div class="item" :class="{'active': item.id === navIndex}" v-for="(item, index) in navList">
                {{ item.title }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "index",
    data() {
        return {
            navIndex: 1,
            navList: [
                {
                    title: '申请致谢奖励',
                    id: 1
                }, {
                    title: '论文致谢说明',
                    id: 1
                }, {
                    title: '用户致谢论文',
                    id: 1
                }, {
                    title: '致谢奖励记录',
                    id: 1
                }
            ]
        }
    },
    methods: {}
}
</script>

<style scoped lang="less">
.container {
  .top-img {
    position: relative;
    text-align: center;
    height: 350px;

    img {
      width: 100%;
      height: 350px;
    }

    span {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      font-weight: 800;
      font-size: 50px;
      color: #FFFFFF;
    }
  }
}
</style>