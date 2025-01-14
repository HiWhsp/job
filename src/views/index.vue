<template>
  <div class="container">
    <!--    轮播-->
    <div class="banner">
      <el-carousel height="450px" arrow="always">
        <el-carousel-item v-for="(item, index) in bannerList" :key="item.id">
          <img :src="item.image" :alt="item.title">
        </el-carousel-item>
      </el-carousel>
    </div>

    <div class="p-item">
      <div class="tit-content flex">
        <div class="item flex pointer" v-for="(item, index) in titList" :key="index" @click="goUrl(item)">
          <div class="cont">
            <div class="title">{{ item.title }}</div>
            <div class="content">{{ item.content }}</div>
          </div>
          <div class="img">
            <img :src="item.img" alt="">
          </div>
        </div>
      </div>
    </div>

    <div class="e_container">
      <div class="p-item">
        <div class="c_box">
          <p class="title">您最好的研发伙伴</p>
          <p class="content">及时、准确、定制、解析</p>
          <div class="c_container flex">
            <div class="c_item" v-for="(item, index) in moduleList" :key="item.id">
              <img :src="item.icon1" alt="">
              <div class="info">
                <p class="title">{{ item.text1 }}</p>
                <p class="content ellipsis-3">{{ item.desc }}</p>
                <div class="tip">
                  <ul>
                    <li v-for="(i, ix) in item.desc2" :key="ix">
                      <i class="el-icon-check"></i><span>{{ i }}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="e-container2">
      <div class="p-item">
        <div class="info">
          <p class="title">部分用户致谢论文 <span>（合计共<i>4650</i>条）</span></p>
          <p class="content">论文致谢，最高奖励5000元红包。</p>
        </div>
      </div>
    </div>

    <div class="client">
      <div class="p-item">
        <div class="c_box">
          <p class="title">服务客户</p>
          <div class="list">
            <div class="item" v-for="(item, index) in friendList" :key="item.id">
              <img :src="item.thumb" alt="">
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="connect">
      <div class="p-item flex flex-between flex-center">
        <div class="text">Best R&D Partner</div>
        <div class="fa_morelink" @click="goUrl({url:'/contactUs'})">
          <span>立即联系我们</span>
          <i></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      titList: [
        {
          id: 1,
          title: '注册会员',
          content: '注册立得10元',
          img: require('@/assets/img/base/01/banner1.png'),
          url: '/invite'
        }, {
          id: 1,
          title: '阳光预付',
          content: '先存后用最高赠送13%',
          img: require('@/assets/img/base/01/banner2.png'),
          url: '/sunPay'
        }, {
          id: 1,
          title: '团队管理',
          content: '这里是二级文案',
          img: require('@/assets/img/base/01/banner6.png'),
          url: '/groupManage'
        }, {
          id: 1,
          title: '论文致谢',
          content: '最高奖励5000元',
          img: require('@/assets/img/base/01/banner6.png'),
          url: '/thesis'
        }, {
          id: 1,
          title: '邀请好友赚现金',
          content: '注册立得10元，下单10%返利',
          img: require('@/assets/img/base/01/banner6.png'),
          url: '/invite'
        }, {
          id: 1,
          title: '优惠券天天领',
          content: '不定期发放优惠券',
          img: require('@/assets/img/base/01/banner6.png'),
          url: '/couponCenter'
        }
      ],
      bannerList: [], // 轮播
      moduleList: [], // 研发伙伴
      friendList: [], // 合作好友
    }
  },
  mounted() {
    this.setView();
  },
  methods: {
    setView() {
      this.getBanner();
      this.getModule();
      this.getFriendList();
    },
    getBanner() {
      this.$api({
        url: 'banners',
        method: 'post',
        data: {
          position: '首页轮播图'
        }
      }).then(res => {
        if (res.code === 200) {
          this.bannerList = res.data;
        }
      })
    },
    getModule() {
      this.$api({
        url: 'module_content',
        method: 'post',
        data: {
          id: 18
        }
      }).then(res => {
        if (res.code === 200) {
          this.moduleList = res.data.content;
        }
      })
    },
    getFriendList() {
      this.$api({
        url: 'friend_list',
        method: 'post',
        data: {
          type: 2
        }
      }).then(res => {
        if (res.code === 200) {
          this.friendList = res.data;
        }
      })
    },
    goUrl(item) {
      this.$router.push({
        path: item.url
      })
    },
  }
}
</script>

<style lang="less" scoped>
.container {
  background: #fff;
}

.banner {
  /deep/ .el-carousel__arrow {
    background-color: #fff;
    color: @theme;
    font-size: 14px;
    font-weight: bold;
  }
}

.p-item {
  width: 1400px;
  margin: 0 auto;
}

.tit-content {
  justify-content: space-between;
  margin-top: 45px;
  height: 130px;
  background-image: url("~@/assets/img/base/tab_bg.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  box-shadow: 0px 3px 6px 1px rgba(0, 71, 157, 0.2);
  border-radius: 13px 13px 13px 13px;
  padding: 28px 30px;

  .item {
    margin-left: 23px;

    &:first-child {
      margin-left: 0;
    }

    .cont {
      display: flex;
      flex-direction: column;
      margin-right: 13px;

      .title {
        font-weight: bold;
        font-size: 18px;
        color: #333333;
      }

      .content {
        text-wrap: none;
        font-weight: 400;
        font-size: 14px;
        color: #333333;
      }
    }
  }

  .img {
    width: 70px;
    height: 70px;

    img {
      width: 100%;
      height: 100%;
    }
  }
}

.e_container {
  padding: 150px 0 70px;

  .c_box {
    .title {
      text-align: center;
      line-height: normal;
      font-size: 36px;
      color: #10233e;
      font-weight: 500;
    }

    .content {
      text-align: center;
      line-height: normal;
      font-size: 16px;
      color: #666;
      margin-top: 10px;
    }

    .c_container {
      flex-wrap: wrap;
      margin-top: 40px;

      .c_item {
        display: flex;
        padding: 19px;
        border-right: 1px solid #eee;
        border-bottom: 1px solid #eee;

        img {
          width: 80px;
          height: 80px;
          left: 50%;
          top: 50%;
          transition: all 0.5s;
        }

        .info {
          flex: 1;
          width: 230px;
          padding-left: 20px;

          .title {
            text-align: left;
            font-size: 18px;
            color: #10233e;
            font-weight: 500;
          }

          .content {
            text-align: left;
            font-size: 14px;
            color: #666;
            font-weight: 400;
            margin-top: 10px;
          }

          .tip {
            margin-top: 20px;

            ul {
              width: 100%;

              li {
                width: 100%;
                display: inline-block;
                margin-right: 20px;

                i {
                  font-size: 14px;
                  color: @theme;
                }

                span {
                  margin-left: 8px;
                  font-size: 14px;
                  color: #666;
                  font-weight: 400;
                }
              }
            }
          }
        }

        &:nth-child(4n) {
          border-right: 0;
        }

        &:nth-child(n + 5) {
          border-bottom: 0;
        }
      }
    }
  }
}

.e-container2 {
  text-align: center;
  height: 400px;
  padding: 60px 0 80px;
  background-color: rgba(244, 251, 248, 1);

  .info {
    .title {
      font-size: 28px;
      color: #333;
      line-height: 1;

      span {
        font-size: 16px;
        color: #000000a6;

        i {
          color: #32D693;
        }
      }
    }

    .content {
      cursor: pointer;
      font-size: 14px;
      color: inherit;
      margin-top: 15px;

      &:hover {
        color: #32D693;
      }
    }
  }

}

.client {
  padding: 70px 0 90px;
  background-color: rgba(242, 246, 250, 1);

  .c_box {
    .title {
      font-size: 36px;
      color: #10233e;
      font-weight: 500;
      text-align: center;
    }

    .list {
      display: flex;
      flex-wrap: wrap;
      margin-top: 40px;

      .item {
        display: flex;
        background: #fff;
        border: #ddd solid 1px;
        width: 216px;
        height: 100px;
        padding: 10px;
        align-items: center;
        margin: 0 20px 20px 0;

        img {
          width: 100%;
          height: 100%;
        }

        &:nth-child(6n) {
          margin-right: 0;
        }
      }
    }
  }
}

.connect {
  height: 180px;
  .flex();
  background-image: url("~@/assets/img/base/connect_bg.jpg");
  background-repeat: no-repeat;
  background-size: 100% 100%;

  .text {
    font-size: 36px;
    font-weight: bold;
    color: #10233e;
  }

  .fa_morelink {
    position: relative;
    cursor: pointer;

    i {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: #00479d;
      color: #fff;
      border-radius: 50%;
      font-size: 20px;
      position: relative;
      overflow: hidden;
      vertical-align: middle;
      transition: all 0.5s;

      &:before {
        content: "\e6e7";
        position: absolute;
        color: #fff;
        font-family: element-icons !important;
        left: 50%;
        top: 50%;
        transition: all 0.5s;
        transform: translate(-50%, -50%);
        transition-delay: 0.2s;
      }

      &:after {
        content: "\e6e7";
        position: absolute;
        color: #fff;
        font-family: element-icons !important;
        left: 50%;
        top: 56%;
        transition: all 0.5s;
        transform: translate(-150%, 50%);
        box-sizing: border-box;
      }
    }


    span {
      display: inline-block;
      margin: 0 10px;
      color: #10233e;
      font-size: 18px;
      position: relative;
      padding-bottom: 8px;
      overflow: hidden;
      transition: all 0.5s;
      vertical-align: middle;
      transition-delay: 0.2s;

      &:before {
        content: "";
        position: absolute;
        bottom: 1px;
        left: 0;
        width: 100%;
        height: 1px;
        background: #10233e;
        transition: all 0.5s;
        transition-delay: 0.2s;
      }

      &:after {
        content: "";
        position: absolute;
        bottom: 1px;
        left: 0;
        width: 100%;
        height: 1px;
        background: #10233e;
        transition: all 0.5s;
        transform: translateX(-100%);
      }
    }

    &:hover {
      span {
        color: #00479d;

        &:before {
          transform: translateX(100%);
          transition-delay: 0s;
        }

        &:after {
          transform: translateX(0%);
          transition-delay: 0.2s;
        }
      }


      i {
        background: #0c8d5b;

        &:before {
          transform: translate(50%, -150%);
          transition-delay: 0s;
        }

        &:after {
          transform: translate(-50%, -50%);
          transition-delay: 0.2s;
        }
      }
    }

  }
}

</style>
