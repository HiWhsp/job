<template>
  <div>
    <div class="title-wrap">
      <breadcrumb :list="['首页', '公司新闻']"> </breadcrumb>
      <div class="title">
        荣誉 | 华日激光Femto-1000 工业级飞秒激光器”斩获金耀奖新产品金奖！
      </div>
      <div class="time-wrap">
        <div class="time">发布时间：2022-10-10</div>
        <div>来源：华锐科仪</div>
      </div>
    </div>
    <div class="content-wrap">
      <div class="content"></div>
    </div>
    <div class="step-wrap">
      <div class="last">上一条：液态透镜技术在工业镜头中的应用</div>
      <div class="next">下一条：液态透镜技术在工业镜头中的应用</div>
    </div>

    <div class="wrap">
      <div class="related-news">相关新闻</div>
      <div class="sub-related-news">用激光工具改变生活</div>

      <div class="list-wrap">
        <div class="card-item" v-for="(item, index) in cardList" :key="index">
          <div class="card-img-wrap">
            <img :src="item.cardImg" alt="" class="card-img" />
          </div>
          <div class="card-text">{{ item.cardText }}</div>
          <div class="card-bottom">
            <div class="bottom-left">
              <div class="time-img-wrap">
                <img
                  class="time"
                  src="@/assets/img/productDetail/time.png"
                  alt=""
                />
              </div>
              <div class="time-text">2024-05-07</div>
            </div>
            <div class="bottom-right">
              <div class="arrow-text" :class="{ active: index === 0 }">
                了解详情
              </div>
              <div class="arrow-wrap">
                <img
                  class="arrow"
                  src="@/assets/img/productDetail/arrow.png"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bottom-btn-wrap">
        <div class="pic-readmore">
          <div class="readmore">查看更多</div>
          <div class="arrow">
            <img src="@/static/home/pic/right_arrow.png" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import breadcrumb from "@/components/breadcrumb";
import card1 from "@/assets/img/productDetail/card1.png";
import card2 from "@/assets/img/productDetail/card2.png";
import card3 from "@/assets/img/productDetail/card3.png";

export default {
  components: {
    breadcrumb,
  },
  data() {
    return {};
  },
  created() {
    this.cardList = [
      {
        cardImg: card1,
        cardText: "现场直击 | 华日激光亮相上海慕尼黑光博会！",
      },
      {
        cardImg: card2,
        cardText: "现场直击 | 华日激光亮相上海慕尼黑光博会！",
      },
      {
        cardImg: card3,
        cardText: "现场直击 | 华日激光亮相上海慕尼黑光博会！",
      },
    ];
  },
  methods: {},
};
</script>

<style lang="less" scoped>
.title-wrap {
  padding: 0 260px 57px;
  background: #f4f4f6;
  .title {
    margin-top: 42px;
    font-size: 32px;
    color: #333333;
  }
  .time-wrap {
    margin-top: 22px;
    display: flex;
    .time {
      margin-right: 19px;
      font-size: 14px;
      color: #333333;
    }
  }
}

.content-wrap {
  background: #fff;
  padding: 48px 260px 0;
  .content {
    padding-bottom: 53px;
    border-bottom: 1px solid #c9c9c9;
  }
}

.step-wrap {
  margin: 45px 260px 0;
  padding-bottom: 72px;
  font-size: 14px;
  color: #000000;
  line-height: 28px;
  .last {
    cursor: pointer;
    margin-bottom: 26px;
  }
  .next {
    cursor: pointer;
  }
}

.wrap {
  padding: 64px 260px;
  background: #f4f4f6;
}

.related-news {
  margin-top: 55px;
  text-align: center;
  font-weight: bold;
  font-size: 36px;
  color: #333333;
}

.sub-related-news {
  margin-top: 14px;
  font-size: 16px;
  color: #52565a;
  text-align: center;
}

.list-wrap {
  display: flex;
  gap: 44px;
  margin-top: 26px;

  .card-item {
    width: 416px;
    height: 417px;
    background: #ffffff;
    border-radius: 10px 0px 10px 10px;
    border: 1px solid #e4e4e4;

    .card-img-wrap {
      width: 416px;
      height: 279px;

      .card-img {
        width: 100%;
        height: 100%;
      }
    }

    .card-text {
      height: 80px;
      font-weight: 400;
      font-size: 18px;
      color: #333333;
      line-height: 36px;
      padding: 28px 12px 28px 20px;
    }

    .card-bottom {
      height: 58px;
      display: flex;
      align-items: center;
      border-top: 1px solid #e5e5e5;

      .bottom-left {
        height: 100%;
        display: flex;
        align-items: center;
        margin-right: 158px;

        .time-img-wrap {
          width: 15px;
          height: 15px;
          margin: 0 9px 0 20px;

          .time {
            width: 100%;
            height: 100%;
          }
        }

        .time-text {
          font-size: 16px;
          color: #757575;
          line-height: 37px;
        }
      }

      .bottom-right {
        height: 100%;
        display: flex;
        align-items: center;
        cursor: pointer;
        .arrow-text {
          margin-right: 14px;
          font-size: 18px;
          color: #757575;
          line-height: 25px;

          &.active {
            color: #27417c;
          }
        }

        .arrow-wrap {
          width: 20px;
          height: 16px;

          .arrow {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
}

.bottom-btn-wrap {
  display: flex;
  justify-content: center;
  margin: 33px 0 0 0;
  .pic-readmore {
    height: 56px;
    width: 187px;
    font-weight: lighter;
    color: white;
    font-size: 18px;
    background-color: #27417c;
    display: flex;
    border-top-right-radius: 20px;
    border-bottom-left-radius: 20px;
    cursor: pointer;

    .readmore {
      height: 24px;
      width: 72px;
      margin-right: 14px;
      margin: 16px 14px 16px 41px;
    }

    .arrow {
      height: 16.35px;
      width: 20.33px;
      margin: 20px 0px 20px 0px;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
