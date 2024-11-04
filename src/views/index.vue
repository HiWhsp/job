<template>
  <div class="container">
    <!--    轮播-->
    <div class="banner">
      <el-carousel height="450px">
        <el-carousel-item v-for="(item, index) in 2" :key="item">
          <img :src="require(`@/assets/img/base/banner/${index + 1}.jpg`)" alt="">
        </el-carousel-item>
      </el-carousel>
    </div>

    <div class="p-item">
      <div class="tit-content flex">
        <div class="item flex" v-for="(item, index) in titList" :key="index">
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
            <div class="c_item" v-for="(item, index) in 8" :key="index">
              <img src="" alt="">
              <div class="info">
                <p class="title">材料分析测试</p>
                <p class="content ellipsis-3">
                  可以对各类材料的成分、结构、热学和电学等进行原位、非原位和工况性能进行表征。</p>
                <div class="tip">
                  <ul>
                    <li>
                      <i class="el-icon-check"></i><span>成分分析</span></li>
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
            <div class="item" v-for="(item, index) in 24" :key="index">
              <img :src="require(`@/assets/img/base/client/${index + 1}.jpg`)" alt="">
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="connect">
      <div class="p-item">
        <div class="text">Best R&D Partner</div>
        <div class="fa_morelink">
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
          img: require('@/assets/img/base/01/banner1.png')
        }, {
          id: 1,
          title: '阳光预付',
          content: '先存后用最高赠送13%',
          img: require('@/assets/img/base/01/banner2.png')
        }, {
          id: 1,
          title: '团队管理',
          content: '这里是二级文案',
          img: require('@/assets/img/base/01/banner6.png')
        }, {
          id: 1,
          title: '论文致谢',
          content: '最高奖励5000元',
          img: require('@/assets/img/base/01/banner6.png')
        }, {
          id: 1,
          title: '邀请好友赚现金',
          content: '注册立得10元，下单10%返利',
          img: require('@/assets/img/base/01/banner6.png')
        }, {
          id: 1,
          title: '优惠券天天领',
          content: '不定期发放优惠券',
          img: require('@/assets/img/base/01/banner6.png')
        }
      ]
    }
  },
  methods: {}
}
</script>

<style lang="less" scoped>
.container {
  background: #fff;
}

.p-item {
  width: 1400px;
  margin: 0 auto;
}

.tit-content {
  justify-content: space-between;
  margin-top: 45px;
  height: 130px;
  background: #FFFFFF;
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
          //transform: translate(-50%, -50%);
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
              li {
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
        bottom: 0;
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
        bottom: 0;
        left: 0;
        width: 100%;
        height: 1px;
        background: #10233e;
        transition: all 0.5s;
        transform: translateX(-100%);
      }

      &:hover {
        span {
          color: #00479d;
        }
        &:before {
          transform: translateX(100%);
          transition-delay: 0s;
        }
        &:after {
          transform: translateX(0%);
          transition-delay: 0.2s;
        }
      }
    }

  }
}

</style>
