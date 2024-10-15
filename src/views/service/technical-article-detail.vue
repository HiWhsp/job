<template>
  <div class="page">
    <div class="title-wrap">
      <breadcrumb :list="['首页', '技术文章']"> </breadcrumb>
      <div class="title">液态透镜技术在工业镜头中的应用</div>
      <div class="sub-title">
        <div class="time">发布时间：2022-10-10</div>
        <img src="@/assets/img/service/icon1.png" alt="" />
        <div class="text">原理及产品介绍</div>
      </div>
    </div>

    <div class="content-wrap"></div>

    <div class="step-wrap">
      <div class="last">上一条：液态透镜技术在工业镜头中的应用</div>
      <div class="next">下一条：液态透镜技术在工业镜头中的应用</div>
    </div>

    <div class="related-wrap">
      <div class="related-title">相关文章</div>
      <div class="related-sub-title">
        技术文章内容包括产品参数说明、原理说明，以及产品的应用等
      </div>
      <div class="article-list">
        <div class="article-item" v-for="(item, index) in 3" :key="index">
          <div class="article-img" @click="toDetail(item)">
            <img src="" alt="" />
          </div>
          <div class="article-title-wrap">
            <div class="article-title">液态透镜技术在工业镜头中的应用</div>
            <div class="article-sub-title">
              <div class="article-sub-title-img-wrap">
                <img src="@/assets/img/service/icon1.png" alt="" />
              </div>
              <div>原理及产品介绍</div>
            </div>
          </div>
        </div>
      </div>
      <div class="btn-wrap">
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
export default {
  components: {
    breadcrumb,
  },
  data() {
    return {};
  },
  created() {},
  methods: {},
};
</script>

<style lang="less" scoped>
.title-wrap {
  height: 239px;
  padding: 23px 260px 0;
  background: #f4f4f6;
  .title {
    margin-top: 55px;
    font-size: 32px;
    color: #333333;
  }
  .sub-title {
    margin-top: 22px;
    display: flex;
    align-items: center;
    font-size: 16px;
    color: #333333;
    .time {
      margin-right: 24px;
    }
    img {
      width: 13px;
      height: 13px;
      margin-right: 9px;
    }
    .text {
      font-size: 14px;
      color: #27417c;
      line-height: 36px;
    }
  }
}

.content-wrap {
  min-height: 200px;
  margin: 48px 260px 20px;
  border-bottom: 1px solid #c9c9c9;
}

.step-wrap {
  margin: 45px 260px 0;
  padding-bottom: 80px;
  font-size: 14px;
  color: #000000;
  line-height: 28px;
  .last {
    margin-bottom: 26px;
  }
}

.related-wrap {
  padding: 46px 260px 59px;
  background: #f4f4f6;
  .related-title {
    font-weight: bold;
    font-size: 36px;
    color: #333333;
    text-align: center;
  }
  .related-sub-title {
    margin-top: 14px;
    font-size: 16px;
    color: #52565a;
    text-align: center;
  }
  .article-list {
    display: flex;
    gap: 46px;
    margin-top: 59px;
    .article-item {
      width: 436px;
      background: #ffffff;
      border-radius: 10px 0px 10px 10px;
      .article-img {
        width: 100%;
        height: 292px;
        cursor: pointer;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .article-title-wrap {
        height: 110px;
      }
      .article-title {
        padding: 24px 0 0 26px;
        font-weight: 400;
        font-size: 20px;
        color: #333333;
        line-height: 26px;
      }
      .article-sub-title {
        padding: 21px 0 0 26px;
        display: flex;
        gap: 9px;
        font-size: 14px;
        color: #27417c;
        line-height: 19px;
        .article-sub-title-img-wrap {
          width: 13px;
          height: 13px;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
  .btn-wrap {
    margin-top: 40px;
    display: flex;
    justify-content: center;
    .pic-readmore {
      height: 56px;
      width: 187px;
      top: 242px;
      left: 96px;
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
}
</style>
