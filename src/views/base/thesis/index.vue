<template>
  <div class="container">
    <div class="top-img">
      <img alt="" src="@/assets/img/base/thesis_bg.png">
      <span>论文致谢</span>
    </div>
    <div class="nav-wrap main">
      <div v-for="(item, index) in navList" :class="{'active': item.id === navIndex}" class="item pointer"
           @click="navClick(item)">
        {{ item.title }}
      </div>
    </div>
    <contentComp :index="navIndex" :content="protocol" @check="navClick"></contentComp>
  </div>
</template>

<script>
import contentComp from './contentComp.vue';

export default {
  name: "index",
  components: {
    contentComp
  },
  data() {
    return {
      navIndex: 1,
      protocol: '',
      navList: [
        {
          title: '申请致谢奖励',
          id: 1
        }, {
          title: '论文致谢说明',
          id: 2
        }, {
          title: '用户致谢论文',
          id: 3
        }, {
          title: '致谢奖励记录',
          id: 4
        }
      ]
    }
  },
  methods: {
    navClick(item) {
      this.navIndex = item.id;
      if (item.id === 1) {

      } else if (item.id === 2) {
        this.$api({
          url: 'page_content',
          method: 'post',
          data: {
            id: 42
          },
        }).then(res => {
          if (res.code === 200) {
            this.protocol = res.data
          }
        })
      } else if (item.id === 3) {
        this.$api({
          url: 'my_paper',
          method: 'post'
        }).then(res => {
          if (res.code === 200) {
            this.protocol = res.data
          }
        })
      } else if (item.id === 4) {
        this.$api({
          url: 'my_paper_reward',
          method: 'post'
        }).then(res => {
          if (res.code === 200) {
            this.protocol = res.data
          }
        })
      }

    }
  }
}
</script>

<style lang="less" scoped>
.container {
  padding-bottom: 70px;

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

  .nav-wrap {
    margin-top: 67px;
    margin-bottom: 39px;
    .flex();
    justify-content: center;

    .item {
      width: 150px;
      height: 34px;
      border: 1px solid #00479D;
      font-weight: 400;
      font-size: 14px;
      color: #00479D;
      text-align: center;
      line-height: 34px;
      margin-right: 10px;

      &.active {
        background: #00479D;
        color: #fff;
      }
    }
  }
}
</style>
