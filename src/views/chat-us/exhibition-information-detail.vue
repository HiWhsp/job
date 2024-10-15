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
      <div class="related-news">相关展会</div>
      <div class="sub-related-news">用激光工具改变生活</div>

      <div class="list-wrap">
        <div class="list-item" v-for="(item, index) in 3" :key="index">
          <div class="top" @click="toDetail(item)">
            <div class="list-img-wrap">
              <img src="" alt="" />
            </div>
            <div class="title">现场直击 | 华日激光亮相上海慕尼黑...</div>
            <div class="sub-title">
              3月20日~22日，备受期待的2024年慕尼黑上海光博会在上海新国际博览中心盛大开幕。华日激光携创新技术的重磅新品和解决方案亮相W3-3410展位，为激光行业发展注入更多的动力。
              华日激光覆盖了从超快激光光源到子系统，为脆性材料、消费电子、新能源、科仪等行业领域提供最新的研究成果和高效的解决方案。
              为玻璃深加工行业提供激光工具
            </div>
          </div>
          <div class="desc-wrap">
            <div class="desc-item">
              <div class="icon-wrap">
                <img src="@/assets/img/chat-us/icon2.png" alt="" />
              </div>
              展位号：W3-3410
            </div>
            <div class="desc-item">
              <div class="icon-wrap">
                <img src="@/assets/img/chat-us/icon3.png" alt="" />
              </div>
              展会地址：慕尼黑上海光博会在上海新国际博览中心
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
  flex-wrap: wrap;
  column-gap: 20px;
  row-gap: 29px;
  .list-item {
    width: 447px;
    height: 515px;
    background: #ffffff;
    border-radius: 8px 8px 8px 8px;
    .top {
      padding: 15px 12px 27px 15px;
      border-bottom: 1px solid #707070;
      cursor: pointer;
      .list-img-wrap {
        width: 420px;
        height: 280px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .title {
        margin-top: 17px;
        font-weight: bold;
        font-size: 24px;
        color: #27417c;
        line-height: 28px;
      }
      .sub-title {
        margin-top: 20px;
        font-size: 16px;
        color: #707070;
        line-height: 28px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }
    }
    .desc-wrap {
      display: flex;
      flex-direction: column;
      gap: 18px;
      padding: 24px 0 24px 17px;
      border-radius: 10px 10px 10px 10px;
      .desc-item {
        display: flex;
        gap: 12px;
        align-items: center;
        font-size: 14px;
        color: #808080;
        .icon-wrap {
          width: 16px;
          height: 17px;
          img {
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
