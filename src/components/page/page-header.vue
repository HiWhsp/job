<template>
  <div class="page-header">
    <div class="info-box">
      <div class="content flex flex-between">
        <div class="l-box">
          <img alt="logo" class="img-1 pointer" src="../../static/home/logo.png" @click="goUrl({url: '/'})">
        </div>
        <div class="m-box">
          <div class="nav-box">
            <div class="flex">
              <div v-for="(item, index) in navList" :key="index" class="nav flex pointer" @click="goUrl(item)">
                <span :class="{'active': item.url == $route.path}" class="name">{{ item.title }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="r-box">
          <div class="flex">
            <div class="tools-btn pointer flex" @click="goUrl({url: '/my-info'})">
              <span>学员名称/姓名</span>
              <img alt="" class="img-2" src="../../static/prod/avatar.png">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from "vuex";

export default {
  data() {
    return {
      searchInput: '', // 搜索条件
      // 头部导航列表
      navList: [
        {
          title: '首页', // 名称
          icon: null,
          position: 'l',
          url: '/'
        },
        {
          title: '全部课程', // 名称
          icon: null,
          position: null,
          url: '/course-list'
        },
        {
          title: '我的考试', // 名称
          icon: null,
          position: null,
          url: '/my-exam'
        }
      ],
      // 热门搜索
      searchHot: []
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo,
    })
  },
  methods: {
    // 跳转链接
    goUrl(item) {
      this.$router.push(item.url);
    },
    ToUrl(item) {
      if (this.userInfo.type == item.type) {
        this.$router.push(item.url);
      } else {
        this.$router.push("/login");
      }
    },
    searchClick(item) {
      this.$router.push(item.url + `&hash=${Math.random()}`);
    },
    // 退出登录
    onunload() {
      this.$store.commit("clear_loginInfo");
    }
  }
}
</script>

<style lang="less" scoped>
.content {
  width: 1200px;
  margin: 0 auto;
}

.col {
  width: 0px;
  height: 12px;
  border: 1px solid #C6CACD;
  margin: 0 10px;
}

.color-a6 {
  color: @theme;
}

.page-header {
  position: fixed;
  top: 0;
  z-index: 99;
  width: 100%;
  box-shadow: 0px 4px 10px 0px rgba(8,58,34,0.12);

  .info-box {
    width: 100%;
    height: 80px;
    background: #FFFFFF;

    .l-box {
      display: flex;
      align-items: center;
      margin-right: 200px;

      .img-1 {
        width: 168px;
        height: 50px;
        margin-right: 10px;
      }
    }

    .m-box {
    }

    .r-box {
      .tools-btn {
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: 400;
        font-size: 16px;
        color: #262626;
      }

      .img-2 {
        margin-left: 15px;
        width: 46px;
        height: 46px;
      }
    }

    .content {
      height: 80px;
    }
  }

  .nav-box {

    .nav {
      margin-right: 60px;

      .name {
        position: relative;
        font-family: Roboto, Roboto;
        font-size: 18px;
        color: #4D555D;
        text-align: left;
        font-style: normal;
        text-transform: none;

        &:after {
          top: 29px;
          position: absolute;
          content: '';
          display: block;
          width: 100%;
          height: 2px;
          background: #fff;
          border-radius: 4px 4px 0px 0px;
        }
      }

      .active:after {
        background: @theme;
      }
      .active.name {
        color: @theme;
        font-weight: bold;
      }

      &:hover > .name:after {
        background: @theme;
      }
    }

    .nav:last-child {
      margin-right: 0;
    }

    .img-0 {
      width: 21.7px;
      height: 21.68px;
      margin-right: 5px;
    }

    .img-1 {
      width: 9.45px;
      height: 6.69px;
      margin-left: 5px;
    }

    .content {
      height: 42px;
    }
  }
}
</style>
