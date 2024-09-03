<template>
  <div class="page">
    <!--    操作区-->
    <div class="index-box-first-content flex">
      <div class="CategoryLayout">
        <ul class="category-wrapper">
          <li class="category-list" v-for="(item, index) in filterList" :key="index">
            <a :title="item.title" class="link pointer">
              <span>{{ item.title }}</span>
              <img src="../static/home/right-row.png" alt="">
            </a>
            <div class="category-list-submenu active">
              <div class="submenu-item">
                <div class="submenu-item-name">{{ item.title }}</div>
                <div class="submenu-item-content">
                  <a :title="it.title" class="submenu-item-content__a pointer" v-for="(it, i) in item.children" :key="i">
                    <span>{{ it.title }}</span>
                  </a></div>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <div class="banner">
        <el-carousel height="100%">
          <el-carousel-item v-for="item in 4" :key="item">
            <img src="../static/home/banner.png" alt="banner">
          </el-carousel-item>
        </el-carousel>
      </div>

      <div class="info-panel">
        <div class="info-box">
          <p>Hi 欢迎来到富俊商城</p>
          <div class="info-btn flex flex-between">
            <div class="login-btn pointer">登录</div>
            <div class="register-btn pointer">注册</div>
          </div>
        </div>
        <div class="my-serve">
          <div class="title flex flex-between">
            <div class="name">我的订单</div>
            <div class="more flex">
              <span>更多</span>
              <img src="../static/home/right.png" alt="right">
            </div>
          </div>
          <div class="list">
            <div class="item" v-for="(item, index) in orderNav" :key="index">
              <img :src="item.imgUrl" alt="">
              <span>{{ item.name }}</span>
            </div>
          </div>
        </div>
        <div class="notice">
          <div class="title flex flex-between">
            <div class="name flex">
              <p class="tip pointer" :class="{'active': noticeType == 1}">公告</p>
              <div class="col"></div>
              <p class="tip pointer" :class="{'active': noticeType == 2}">新闻</p>
            </div>
            <div class="more flex ">
              <span>全部</span>
              <img src="../static/home/right.png" alt="right">
            </div>
          </div>
          <div class="list">
            <div class="item flex">
              <div class="hot">最新</div>
              <p class="text ellipsis-1">安装直线滑轨时直线滑轨采用</p>
            </div>
            <div class="item flex">
              <div class="hot">最新</div>
              <p class="text ellipsis-1">安装直线滑轨时直线滑轨采用</p>
            </div>
            <div class="item flex">
              <div class="hot">最新</div>
              <p class="text ellipsis-1">安装直线滑轨时直线滑轨采用</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--    推荐产品-->
    <div class="promation-area flex">
      <div class="ordinary-desc pointer">
        <div class="title">
          <p>推荐产品</p>
          <img src="../static/home/area-right.png" alt="area-right">
        </div>
      </div>
      <div class="promation-product-box">
        <el-carousel :interval="5000" arrow="always" height="100%">
          <el-carousel-item v-for="item in 4" :key="item">
            <div class="item-wrap flex">
              <template v-for="it in 5">
                <div class="item pointer">
                  <img src="../static/home/promation-img.png" alt="">
                  <div class="pointer">
                    <p class="title">FUHS-30</p>
                    <p class="money">￥21.115</p>
                  </div>
                </div>
                <div class="col" v-if="item < 5"></div>
              </template>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>
    <!--    精选产品-->
    <div class="recommend-area">
      <div class="title flex flex-between">
        <div class="left flex">
          <img src="../static/home/37454.png" alt="">
          <p class="tip">精选产品</p>
          <p class="desc">爆款精选 价格优越</p>
        </div>
        <div class="more flex pointer">
          <p>更多</p>
          <img src="../static/home/right-row.png" alt="">
        </div>
      </div>
      <div class="list flex flex-between">
        <div class="item pointer" v-for="item in 10" :key="item">
          <img src="../static/home/promation-img.png" alt="">
          <p class="tit">FUHS-30</p>
          <p class="money">￥21.115</p>
        </div>
      </div>
    </div>
    <!--    定制组件-->
    <div class="DIY-area">
      <div class="title flex flex-center">
        <img src="../static/home/19655.png" alt="">
        <p>DIY定制组件</p>
        <img src="../static/home/19656.png" alt="">
      </div>
      <div class="list flex flex-between">
        <div class="item pointer" v-for="item in 15" :key="item">
          <img src="../static/home/promation-img.png" alt="">
          <p class="tit">FUHS-30</p>
          <p class="money">￥21.115</p>
        </div>
      </div>
    </div>

    <pageAside></pageAside>
  </div>
</template>

<script>
import pageAside from "@/components/page/page-aside.vue";
import {mapState} from "vuex";
import dayjs from 'dayjs'

export default {
  name: "index",
  components: {
    pageAside
  },
  data() {
    return {
      // 首屏展示类型
      noticeType: 1,
      // 商品分类
      filterList: [
        {
          title: '简易丝杆模组',
          children: [{
            title: '平键'
          }]
        },
        {
          title: '简易丝杆模组',
          children: [{
            title: '平键'
          }]
        },
        {
          title: '简易丝杆模组',
          children: [{
            title: '平键'
          }]
        },
        {
          title: '简易丝杆模组',
          children: [{
            title: '平键'
          }]
        },
        {
          title: '简易丝杆模组',
          children: [{
            title: '平键'
          }]
        },
        {
          title: '简易丝杆模组',
          children: [{
            title: '平键'
          }]
        },
        {
          title: '简易丝杆模组',
          children: [{
            title: '平键'
          }]
        },
        {
          title: '简易丝杆模组',
          children: [{
            title: '平键'
          }]
        },
        {
          title: '简易丝杆模组',
          children: [{
            title: '平键'
          }]
        },
        {
          title: '简易丝杆模组',
          children: [{
            title: '平键'
          }]
        }
      ],
      // 订单选项菜单
      orderNav: [{
        name: '待报价',
        imgUrl: require('../static/home/daibaojia.png'),
        router: ''
      }, {
        name: '已报价',
        imgUrl: require('../static/home/yibaojia.png'),
        router: ''
      }, {
        name: '待付款',
        imgUrl: require('../static/home/daifukuan.png'),
        router: ''
      }, {
        name: '代发货',
        imgUrl: require('../static/home/daifahuo.png'),
        router: ''
      }, {
        name: '待收货',
        imgUrl: require('../static/home/daishouhuo.png'),
        router: ''
      }, {
        name: '待开票',
        imgUrl: require('../static/home/daikaipiao.png'),
        router: ''
      }],
      todayHasPlayAni: true, //不需要展示动画
      product_list_1: [],
      product_list_2: [],
      reviews_group: []
    };
  },
  computed: {
    ...mapState([
      "index_banners",
      "index_full_ani",
      "hotSearchWords",
    ]),

  },
  mounted() {
    this.handleAni()
  },
  methods: {
    handleAni() {
      if (!this.todayHasPlayAni) {
        this.todayHasPlayAni = true;
        localStorage.setItem(
            "playAniDate",
            dayjs().format('YYYY-MM-DD')
        );
        this.$nextTick(() => {
          this.$refs.order_manjian_modal.init()
        })
      }
    },

    setView() {
      this.query_product_cate1()
      this.query_product_cate2()
      this.query_reviews()
    },

    query_product_cate1() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "product_plist",
          ifShowSku: 1,
          channelId: 780,
          page: 1,
          pageNum: 8,
        },
      }).then((res) => {
        let {code, data, count} = res;
        if (code == 200) {
          let {list, count, pages} = data;
          this.product_list_1 = list;
          // this.count = count;
        }
      });
    },
    query_product_cate2() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "product_plist",
          ifShowSku: 1,
          channelId: 792,
          page: 1,
          pageNum: 8,
        },
      }).then((res) => {
        let {code, data, count} = res;
        if (code == 200) {
          let {list, count, pages} = data;
          this.product_list_2 = list;
          // this.count = count;
        }
      });
    },
    query_reviews() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "product_comments",
          page: 1,
          pageNum: 12,
          productId: 0,
          ifIndex: 1,
        },
      }).then((res) => {
        let {code, data, count} = res;
        if (code == 200) {
          let {list, count, pages} = data;
          this.reviews = list;


          let reviews_group = [];
          let items_length = 4;//4个一组
          list.forEach((v, i) => {
            let group_index = Math.floor(i / items_length);
            if (!reviews_group[group_index]) {
              reviews_group[group_index] = [];
            }
            reviews_group[group_index].push(v);
          });
          this.reviews_group = reviews_group;
        }
      });
    },
  },
}

</script>

<style scoped lang="less">
.el-carousel {
  height: 100%;
}

.index-box-first-content {
  // 左侧分类
  .CategoryLayout {
    position: relative;
    width: 192px;
    min-height: 466px;
    background: #fff;
    border-radius: 4px;

    .category-wrapper {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow-y: auto;

      .category-list {
        height: 46px;
        font-size: 14px;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #eee;

        .link {
          display: flex;
          align-items: center;
          width: 100%;
          height: 100%;
          text-decoration-line: none;
          color: #000;
          padding: 0 17px 0 11px;

          span {
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          img {
            width: 6.3px;
            height: 11.28px;
          }
        }

        .link:hover span {
          color: #A66600;
        }
      }

      .category-list:last-child {
        border: none;
      }

      .category-list:hover .active {
        display: block !important;
      }

      .category-list-submenu {
        display: none;
        position: absolute;
        top: 0;
        left: 190px;
        z-index: 98;
        box-sizing: border-box;
        width: 808px;
        height: 100%;
        padding: 15px 30px 8px;
        background: #fff;
        border-radius: 0 8px 8px 0;
        box-shadow: 0 2px 16px 0 rgba(1, 66, 104, .2);

        .submenu-item {
          padding-bottom: 16px;
          border-bottom: .5px solid #e6e9ea;
        }

        .submenu-item:last-child {
          border-bottom: none;
        }

        .submenu-item-name {
          font-weight: 600;
          color: #000;
        }

        .submenu-item-content {
          box-sizing: border-box;
          display: flex;
          flex-wrap: wrap;
          margin-top: 8px;
        }

        .submenu-item-content__a:hover {
          color: #A66600;
        }

        .submenu-item-content__a span {
          display: flex;
          align-items: center;
          flex: 1;
        }

      }
    }
  }

  // 轮播图
  .banner {
    width: 796px;
    height: 466px;
    border-radius: 4px 4px 4px 4px;
    background-color: #C4005B;
    margin: 0 10px;

    img {
      width: 100%;
      height: 100%;
    }

    /deep/ .is-active {
      .el-carousel__button {
        background: #F8C268;
      }
    }

    /deep/ .el-carousel__button {
      width: 20px;
      height: 6px;
      background: #FFFFFF;
      border-radius: 0px 0px 0px 0px;
      opacity: 0.7;
    }
  }

  //右侧操作
  .info-panel {
    width: 192px;
    height: 466px;
    background: #FFFFFF;
    border-radius: 4px 4px 4px 4px;
    padding: 17px 10px 11px;

    .info-box {
      p {
        font-family: Roboto, Roboto;
        font-weight: 400;
        font-size: 16px;
        color: #333333;
        font-style: normal;
        text-transform: none;
      }

      .info-btn {
        padding: 21px 0 23px 0;
        border-bottom: 1px solid #eee;

        .login-btn {
          width: 82px;
          height: 29px;
          background: #A66600;
          border-radius: 20px 20px 20px 20px;
          border: 1px solid #A66600;

          font-family: Roboto, Roboto;
          font-weight: 400;
          font-size: 14px;
          text-align: center;
          line-height: 29px;
          color: #FFFFFF;
          font-style: normal;
          text-transform: none;
        }

        .register-btn {
          width: 81px;
          height: 29px;
          background: #F8C268;
          border-radius: 20px 20px 20px 20px;
          font-family: Roboto, Roboto;
          font-weight: 400;
          text-align: center;
          line-height: 29px;
          font-size: 14px;
          color: #FFFFFF;
          font-style: normal;
          text-transform: none;
        }
      }
    }

    .my-serve {
      margin-top: 10px;
      border-bottom: 1px solid #eee;

      .title {
        margin-bottom: 17px;

        .name {
          font-family: Roboto, Roboto;
          font-weight: bold;
          font-size: 16px;
          color: #333333;
          font-style: normal;
          text-transform: none;
        }

        .more {
          cursor: pointer;

          img {
            width: 5.28px;
            height: 9.46px;
          }

          span {
            font-family: Roboto, Roboto;
            font-weight: 400;
            font-size: 12px;
            color: #5E5E5E;
            font-style: normal;
            text-transform: none;
            margin-right: 5px;
          }
        }
      }

      .list {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;

        .item {
          width: 53px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          margin-bottom: 17px;
          cursor: pointer;

          img {
            width: 24px;
            height: 24px;
          }

          span {
            font-family: Roboto, Roboto;
            font-weight: 400;
            font-size: 14px;
            color: #333333;
            font-style: normal;
            text-transform: none;
            margin-top: 5px;
            margin-top: 5px;
          }
        }
      }
    }

    .notice {
      margin-top: 16px;

      .title {
        margin-bottom: 17px;

        .name {
          .tip {
            font-family: Roboto, Roboto;
            font-size: 16px;
            color: #333333;
            font-style: normal;
            text-transform: none;
          }

          .col {
            width: 0px;
            height: 14px;
            border: 1px solid #707070;
            margin: 0 8px;
          }

          .tip.active {
            font-weight: bold;
          }
        }

        .more {
          cursor: pointer;

          img {
            width: 5.28px;
            height: 9.46px;
          }

          span {
            font-family: Roboto, Roboto;
            font-weight: 400;
            font-size: 12px;
            color: #5E5E5E;
            font-style: normal;
            text-transform: none;
            margin-right: 5px;
          }
        }
      }

      .list {
        height: 112px;
        overflow-y: auto;

        .item {
          margin-bottom: 10px;

          .hot {
            width: 28px;
            height: 16px;
            font-family: Roboto, Roboto;
            font-weight: 400;
            font-size: 12px;
            color: #A66600;
            line-height: 16px;
            text-align: center;
            font-style: normal;
            text-transform: none;

            background: #EDE0CC;
            border-radius: 2px 2px 2px 2px;
          }

          .text {
            margin-left: 8px;
            width: 130px;
            font-family: Roboto, Roboto;
            font-weight: 400;
            font-size: 14px;
            color: #5E5E5E;
            font-style: normal;
            text-transform: none;
          }
        }
      }
    }
  }
}

.promation-area {
  margin-top: 21px;

  .ordinary-desc {
    width: 192px;
    height: 261px;
    background-image: url("../static/home/ordinary.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    padding: 20px 24px;

    .title {
      display: flex;
      align-items: center;

      p {
        font-family: Roboto, Roboto;
        font-weight: bold;
        font-size: 20px;
        color: #000000;
        font-style: normal;
        text-transform: none;
        margin-right: 11px;
      }

      img {
        width: 17px;
        height: 17px;
      }
    }
  }

  .promation-product-box {
    width: 1008px;
    height: 261px;
    background-color: #fff;

    .col {
      width: 1px;
      height: 238px;
      border: 1px solid #EFECEC;
      margin: 0 31px;
    }

    .item {
      img {
        width: 146px;
        height: 146px;
      }

      .pointer {
        margin-top: 8px;

        .title {
          font-family: Roboto, Roboto;
          font-weight: 400;
          font-size: 16px;
          color: #3D4248;
          font-style: normal;
          text-transform: none;
        }

        .money {
          margin-top: 20px;
          font-family: Roboto, Roboto;
          font-weight: 400;
          font-size: 18px;
          color: #FF4000;
          font-style: normal;
          text-transform: none;
        }
      }
    }

    .el-carousel__item {
      padding: 17px 15.5px;
    }

    /deep/ .el-carousel__arrow--left {
      width: 45px;
      height: 49px;
      background-image: url("../static/home/back-left.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      background-color: #fff;
      left: -7px;

      .el-icon-arrow-left {
        display: none;
      }
    }

    .el-carousel__arrow:hover {
      background-color: #fff;
    }

    /deep/ .el-carousel__arrow--right {
      background-image: url("../static/home/back-right.png");
      width: 45px;
      height: 49px;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      background-color: #fff;
      right: -7px;

      .el-icon-arrow-right {
        display: none;
      }
    }
  }
}

.recommend-area {
  margin-top: 35px;
  height: 648px;
  background-image: url("../static/home/19648.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  border-radius: 8px;


  .title {
    .left {
      width: 1054px;
      height: 54px;
      background: linear-gradient(90deg, #F8C268 0%, rgba(248, 194, 104, 0) 100%);
      border-radius: 8px 0px 0px 0px;
      padding: 7px 23px;

      img {
        width: 35.13px;
        height: 38px;
      }

      .tip {
        font-family: Roboto, Roboto;
        font-weight: bold;
        font-size: 24px;
        color: #000000;
        font-style: normal;
        text-transform: none;
        margin-left: 17px;
      }

      .desc {
        height: 13px;
        font-family: Roboto, Roboto;
        font-weight: 400;
        font-size: 16px;
        color: #000000;
        font-style: normal;
        text-transform: none;
        margin-left: 11px;
      }
    }

    .more {
      height: 54px;
      padding: 7px 23px;

      img {
        width: 6.35px;
        height: 11.38px;
        margin-left: 8px;
      }
    }
  }

  .list {
    padding: 25px;
    flex-wrap: wrap;

    .item {
      width: 217px;
      height: 256px;
      background: #FFFFFF;
      border-radius: 8px 8px 8px 8px;
      padding: 15px;
      margin-bottom: 20px;

      img {
        width: 160px;
        height: 160px;
        border-radius: 0px 0px 0px 0px;
        margin: 0 16px;
      }

      .tit {
        font-family: Roboto, Roboto;
        font-weight: 400;
        font-size: 16px;
        color: #3D4248;
        font-style: normal;
        text-transform: none;
      }

      .money {
        margin-top: 15px;
        font-family: Roboto, Roboto;
        font-weight: 400;
        font-size: 18px;
        color: #FF4000;
        font-style: normal;
        text-transform: none;
      }
    }

  }
}

.DIY-area {
  width: 1200px;
  height: 935px;
  background: #FFFFFF;
  border-radius: 8px;
  margin-top: 30px;
  padding: 30px;

  .title {
    height: 37px;

    img {
      width: 31px;
      height: 22px;
    }

    p {
      font-family: Roboto, Roboto;
      font-weight: bold;
      font-size: 28px;
      color: #000000;
      font-style: normal;
      text-transform: none;
      margin: 0 15px;
    }
  }

  .list {
    padding: 25px;
    flex-wrap: wrap;

    .item {
      width: 217px;
      height: 256px;
      background: #FFFFFF;
      border-radius: 8px 8px 8px 8px;
      padding: 15px;
      margin-bottom: 20px;

      img {
        width: 160px;
        height: 160px;
        border-radius: 0px 0px 0px 0px;
        margin: 0 16px;
      }

      .tit {
        font-family: Roboto, Roboto;
        font-weight: 400;
        font-size: 16px;
        color: #3D4248;
        font-style: normal;
        text-transform: none;
      }

      .money {
        margin-top: 15px;
        font-family: Roboto, Roboto;
        font-weight: 400;
        font-size: 18px;
        color: #FF4000;
        font-style: normal;
        text-transform: none;
      }
    }
  }
}
</style>
