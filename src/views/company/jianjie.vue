<script>
export default {
    name: "jianjie",
    data() {
        return {}
    },
    methods: {}
}
</script>

<template>
    <div class="content">
        <div class="top-box">
            <div class="title">公司简介</div>
            <div class="desc flex">
                <div class="img-wrap">
                    <img src="@/static/about/1.png" alt="">
                </div>
                <div class="text">
                    <p>山东富俊机械科技有限公司</p>
                    <p>
                        富俊科技致力于医疗器械领域配件，组件，解决方案，用优质的产品，服务于客户。公司深耕医疗器械行业，以此为应用场景，整合标准零部件+定制零部件，整合标准运动模块+定制运动模块，并最终以解决方案方式交付客户。
                        在数字化和信息化为行业赋能的今天，富俊布局和建立高质量的基础制造能力，并以此为核心，优化供应链体系中的位置，拉近制造体系与需求端的距离，从而实现标准化和信息化的产业链，最终推动效率提升和技术进步。</p>
                </div>
            </div>
            <div class="line flex">
                <div class="it">
                    <p>2015<span>年</span></p>
                    <p>公司成立于</p>
                </div>
                <div class="it">
                    <p>10+</p>
                    <p>行业经验</p>
                </div>
                <div class="it">
                    <p>1000+</p>
                    <p>合作客户</p>
                </div>
            </div>
        </div>
        <div class="swiper-box">
            <div class="promation-product-box">
                <el-carousel :interval="5000" arrow="always" height="100%">
                    <el-carousel-item v-for="item in 4" :key="item">
                        <div class="item-wrap">
                            <img src="@/static/about/2.png" alt="">
                            <img src="@/static/about/3.png" alt="">
                            <img src="@/static/about/4.png" alt="">
                            <img src="@/static/about/5.png" alt="">
                        </div>
                    </el-carousel-item>
                </el-carousel>
                <el-carousel :interval="5000" arrow="always" height="100%" style="margin-top: 44px">
                    <el-carousel-item v-for="item in 4" :key="item">
                        <div class="item-wrap">
                            <img src="@/static/about/6.png" alt="">
                            <img src="@/static/about/7.png" alt="">
                            <img src="@/static/about/8.png" alt="">
                            <img src="@/static/about/9.png" alt="">
                        </div>
                    </el-carousel-item>
                </el-carousel>
            </div>
        </div>
    </div>
</template>

<style scoped lang="less">
.content {
  height: 100%;

  .top-box {
    padding: 52px 0;
    height: 776px;
    background-image: url("~@/static/about/top-back.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    .flex();
    flex-direction: column;

    .title {
      font-family: Roboto, Roboto;
      font-weight: bold;
      font-size: 36px;
      color: #383635;
      position: relative;
      margin-bottom: 86px;
    }

    .title::after {
      content: "";
      width: 90px;
      height: 4px;
      background: #F4A116;
      border-radius: 10px;
      position: absolute;
      bottom: -22px;
      left: 45px;
      margin-left: -22px;
    }

    .desc {
      width: 1200px;
      .flex();
      justify-content: space-between;

      .img-wrap {
        width: 504px;
        height: 350px;
        background: #F4A116;
        position: relative;

        img {
          position: absolute;
          width: 560px;
          height: 366px;
          left: 15px;
          bottom: 15px;
        }
      }

      .text {
        width: 575px;
        font-family: Roboto, Roboto;
        font-weight: 400;
        font-size: 16px;
        color: #333333;
        line-height: 32px;

        p:first-child {
          font-size: 24px;
          margin-bottom: 35px;
        }
      }
    }

    .line {
      margin-top: 63px;
      width: 1200px;
      padding: 0 77px;
      .flex();
      justify-content: space-between;

      .it {
        p:first-child {
          font-family: Roboto, Roboto;
          font-weight: bold;
          font-size: 56px;
          color: #F4A116;
        }

        p:first-child {
          span {
            font-family: Roboto, Roboto;
            font-weight: 400;
            font-size: 18px;
            color: #7D7D7D;
          }
        }

        p:last-child {
          margin-top: 15px;
          font-family: Roboto, Roboto;
          font-weight: 400;
          font-size: 18px;
          color: #7D7D7D;
        }
      }
    }
  }

  .swiper-box {
    height: 541px;
    .flex();
    justify-content: center;
    align-items: start;

    .promation-product-box {
      margin-top: 54px;
      width: 1182px;
      height: 191px;

      .item-wrap {
        img {
          width: 287px;
          height: 191px;
        }

        img {
          margin-right: 11px;
        }

        img:last-child {
          margin: 0;
        }
      }

      .el-carousel {
        height: 100%;
      }


      /deep/ .el-carousel__arrow--left {
        width: 45px;
        height: 49px;
        background-image: url("~@/static/home/back-left.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-color: transparent;
        left: -8px;

        .el-icon-arrow-left {
          display: none;
        }
      }

      .el-carousel__arrow:hover {
        background-color: transparent;
      }

      /deep/ .el-carousel__arrow--right {
        background-image: url("~@/static/home/back-right.png");
        width: 45px;
        height: 49px;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-color: transparent;
        right: -8px;

        .el-icon-arrow-right {
          display: none;
        }
      }
    }
  }
}

</style>