<template>
  <div class="page-top">
    <div class="page-top-banner">
      <img :src="config.banner" alt="" />
    </div>

    <div class="page-top-text-wrap">
      <div class="page-top-text-inner">
        <div class="main-title">{{ config.title }}</div>
        <div class="main-title-en">{{ config.title_en }}</div>
        <div class="title-line"></div>
        <div class="bread-box">
          <img src="@/static/common/bread-home.png" alt="" />
          <router-link to="/">首页</router-link>

          <template v-if="list_bread[0]">
            <span class="bread-divider">&gt;</span>
            <a href="javascript:void(0)" @click="toBread(list_bread[0].route)">{{ list_bread[0].title }}</a>
          </template>
          <template v-if="list_bread[1]">
            <span class="bread-divider">&gt;</span>
            <a href="javascript:void(0)" @click="toBread(list_bread[1].route)">{{ list_bread[1].title }}</a>
          </template>

          <!-- <span class="bread-divider">&gt;</span>
          <a href="javascript:void(0)">{{ $route.meta.title }}</a> -->
        </div>
      </div>
    </div>

    <!-- 子级导航 -->
    <div class="child-nav-wrap" v-if="config.nav_list">
      <div class="child-nav-inner">
        <router-link :to="item.route" class="child-item" :class="checkClass(item)"
          v-for="(item, index) in config.nav_list" :key="index">
          {{ item.title }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  props: {
    config: {
      type: Object,
      default() {
        return {
          banner: '',
          title: '饮食文化',
          title_en: '',
          list_bread: [
            {
              title: '饮食与文化',
              route: '',
            }
          ]
        }
      },
    }
  },
  data() {
    return {

    };
  },
  computed: {
    ...mapState([""]),
    list_bread() {
      return this.config.list_bread || []
    }

  },
  created() { },
  methods: {
    toBread(route) {
      if (route) {
        this.$route.push(route)
      }
    },

    // 判断当前是哪个页面 切换页面显示active
    checkClass(item) {
      let obj = {}
      if (this.$route.name == 'activities') {
        obj = {
          active: this.$route.query.id == item.id,
        };
      } else if(this.$route.name == 'activitiesDetail') {
        obj = {
          active: this.$route.query.cid == item.id,
        };
      } else {
        obj = {
          active: item.route == this.$route.path,
        };
      }

      console.warn('obj',obj)
      return obj;
    },
  },
};
</script>

<style lang="less" scoped>
.page-top {
  position: relative;

  .page-top-banner {
    img {
      width: 100%;
      height: 400px;
      object-fit: cover;
    }
  }

  .page-top-text-wrap {
    width: @width;
    margin: 0 auto;

    .page-top-text-inner {
      position: absolute;
      top: 136px;
      text-align: left;

      .main-title {
        font-family: SourceHanSansSC-Bold, SourceHanSansSC-Bold;
        font-weight: normal;
        font-size: 46px;
        color: #FFFFFF;
      }

      .main-title-en {

        margin-top: 10px;
        font-family: SourceHanSansSC-Bold, SourceHanSansSC-Bold;
        font-weight: normal;
        font-size: 56px;
        color: #FFFFFF;
      }

      .title-line {
        margin: 20px 0 20px;
        width: 640px;
        height: 1px;
        background: #CCC;
      }

      .bread-box {
        display: flex;
        align-items: center;

        img {
          width: 15px;
          margin-right: 10px;
        }

        .bread-divider {
          margin: 0 6px;
          font-size: 18px;
          font-family: MicrosoftYaHei-, MicrosoftYaHei;
          font-weight: normal;
          color: #ffffff;
        }

        a {
          font-weight: normal;
          font-size: 18px;
          color: #FFFFFF;
        }
      }
    }
  }

  .child-nav-wrap {
    width: 100%;
    border-bottom: 1px solid #e6e6e6;

    .child-nav-inner {
      width: @width;
      margin: 0 auto;

      height: 71px;
      display: flex;
      justify-content: center;
      // justify-content: flex-start;
      align-items: center;

      .child-item {
        min-width: 80px;
        position: relative;
        margin-right: 70px;
        height: 71px;
        line-height: 71px;
        // flex: 1;
        font-size: 14px;
        font-family: MicrosoftYaHei-, MicrosoftYaHei;
        font-weight: normal;
        color: #333333;
        text-align: center;

        &:last-child {
          margin-right: 0;
        }

        // &.router-link-active,
        &.active {
          font-size: 14px;
          font-family: Microsoft YaHei-Bold, Microsoft YaHei;
          font-weight: bold;
          color: #4CA5E4;

          &::after {
            content: "";
            position: absolute;
            left: 50%;
            bottom: 0;
            transform: translate(-50%, 0);
            width: 100%;
            height: 3px;
            background: #4CA5E4;
          }
        }
      }
    }
  }
}
</style>



