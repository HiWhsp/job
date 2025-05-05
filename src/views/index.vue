<template>
  <div style="padding-bottom: 50px;">
    <!--    操作区-->
    <div class="index-box-first-content flex">
      <div class="banner">
        <el-carousel height="100%">
          <el-carousel-item v-for="(it, i) in index_banners" :key="i">
            <img :src="it.image" alt="banner"/>
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>

    <!--    最近学习-->
    <div class="card main">
      <div class="title">
        <h2>最近学习</h2>
        <img src="@/static/home/card-img.png" alt="">
      </div>
      <div class="content">
        <div class="item" v-for="(item, index) in product_list" :key="index" @click="toProduct(item)">
          <div class="left">
            <div class="tit">
              <img src="@/static/home/file1.png" alt="">
              <span>师德师风建设，强化职业道德</span>
            </div>
            <div class="progress">
              <el-progress :percentage="50" :format="format"></el-progress>
            </div>
            <div class="desc">
              学习历史：第一节 标题标题名称标题标题名称标题标题名称
            </div>
          </div>
          <div class="right">继续学习</div>
        </div>
      </div>
    </div>

    <!--    文档类课程-->
    <div class="card main">
      <div class="title">
        <h2>文档类课程</h2>
        <img src="@/static/home/card-img.png" alt="">
      </div>
      <div class="content">
        <div class="item2">
          <div class="left">
            <div class="tit">
              <span>课程推荐</span>
            </div>
            <div class="text">现代教育技术应用，提高教学效果现代教育技术应用，提高教学效果</div>
            <div class="desc">
              课程简介详情，课程简介详情，课程简介详情，课程简介详情课程简介详情，课程简介详情，课程简介详情，课程简介详情课程简介详情，课程简介详情，课程简介详情，课程简介详情课程简介详...
            </div>
            <div class="btn">立即学习</div>
          </div>
          <div class="right">
            <div class="li-item">
              <img src="@/static/home/file2.png" alt="">
              <div class="info">
                <p class="text">师德师风建设，强化职业道德</p>
                <p class="desc ellipsis-1">
                  课程简介详情，课程简介详情，课程简介详情，课程简介详情，课程简介详情，课程123213123123</p>
              </div>
            </div>
            <div class="li-item">
              <img src="@/static/home/file2.png" alt="">
              <div class="info">
                <p class="text">师德师风建设，强化职业道德</p>
                <p class="desc ellipsis-1">
                  课程简介详情，课程简介详情，课程简介详情，课程简介详情，课程简介详情，课程123213123123</p>
              </div>
            </div>
            <div class="li-item">
              <img src="@/static/home/file2.png" alt="">
              <div class="info">
                <p class="text">师德师风建设，强化职业道德</p>
                <p class="desc ellipsis-1">
                  课程简介详情，课程简介详情，课程简介详情，课程简介详情，课程简介详情，课程123213123123</p>
              </div>
            </div>
            <div class="li-item">
              <img src="@/static/home/file2.png" alt="">
              <div class="info">
                <p class="text">师德师风建设，强化职业道德</p>
                <p class="desc ellipsis-1">
                  课程简介详情，课程简介详情，课程简介详情，课程简介详情，课程简介详情，课程123213123123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--    视频类课程-->
    <div class="card main">
      <div class="title">
        <h2>视频类课程</h2>
        <img src="@/static/home/card-img.png" alt="">
      </div>
      <div class="content">
        <div class="item3">
          <div class="left">
            <img src="@/static/home/file1.png" alt="">
            <div class="info">
              <div class="tit">
                <span>教育技术学导论</span>
              </div>
              <div class="desc ellipsis-3">
                课程简介详情，课程简介详情，课程简介详情，课程简介详情，课程简介详情，课程简介详情，课程简介详情，课程简介详情，课程简介详情，课程简介详情。
              </div>
            </div>
          </div>
          <div class="right">
            <div class="li-item">
              <div class="info">
                <p class="text">师德师风建设，强化职业道德</p>
                <p class="desc ellipsis-1">
                  课程简介详情，课程简介详情，课程简介详情，课程简介详情，课程简介详情，课程</p>
              </div>
              <img src="@/static/home/file2.png" alt="">
            </div>
            <div class="li-item">
              <div class="info">
                <p class="text">师德师风建设，强化职业道德</p>
                <p class="desc ellipsis-1">
                  课程简介详情，课程简介详情，课程简介详情，课程简介详情，课程简介详情，课程</p>
              </div>
              <img src="@/static/home/file2.png" alt="">
            </div>
            <div class="li-item">
              <div class="info">
                <p class="text">师德师风建设，强化职业道德</p>
                <p class="desc ellipsis-1">
                  课程简介详情，课程简介详情，课程简介详情，课程简介详情，课程简介详情，课程</p>
              </div>
              <img src="@/static/home/file2.png" alt="">
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
  name: "index",
  data() {
    return {
      keyword: "",
      // 首屏展示类型
      product_list: [1, 2],
    };
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo,
      filterList: state => state.vuexTreeCates,
      index_banners: state => state.index_banners
    }),
  },
  mounted() {
    this.setView();
  },
  methods: {
    setView() {
      // this.query_product_cate()
    },
    format(percentage) {
      return `已学习${percentage}%`;
    },
    // 获取商品列表
    query_product_cate() {
      this.$api({
        url: "index",
        method: "post",
        data: {
          page: 1,
          pageSize: 10,
          keyword: this.keyword
        },
      }).then((res) => {
        let {code, data} = res;
        if (code == 200) {
          let {list, count} = data;
          this.product_list = list;
          this.count = count;
        }
      });
    },
    // 跳转链接
    goUrl(item) {
      this.$router.push(item.url);
    },
    // 跳转商品
    toProduct(item) {
      // this.$router.push(`/productCategories?ids=${item.user_id}&type_id=${this.selectedCategory.id}`);
    }
  },
}

</script>

<style scoped lang="less">
.el-carousel {
  height: 100%;
}

.main {
  width: 1200px;
  margin: 0 auto;
}

.index-box-first-content {
  // 轮播图
  .banner {
    width: 100%;
    height: 550px;
    border-radius: 4px 4px 4px 4px;
    background-color: #C4005B;

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
}

.card {
  margin-top: 86px;

  .title {
    display: flex;
    flex-direction: column;
    align-items: center;

    h2 {
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: 400;
      font-size: 34px;
      color: #1C1F21;
      margin-bottom: 10px;
    }

    img {
      width: 375px;
      height: 12px;
    }
  }

  .content {
    margin-top: 60px;

    .item {
      height: 161px;
      background: #F7F7F7;
      padding: 30px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;

      .left {
        width: 600px;

        .tit {
          display: flex;
          align-items: center;

          img {
            width: 24px;
            height: 24px;
          }

          span {
            font-family: Microsoft YaHei, Microsoft YaHei;
            font-weight: 400;
            font-size: 18px;
            color: #1F253B;
            margin-left: 8px;
          }
        }

        .progress {
          display: flex;
          margin: 25px 0;

          .el-progress {
            width: 100%;
            display: flex;
            align-items: center;
          }

          /deep/ .el-progress__text {
            width: 100px;
            color: @theme !important;
          }

          /deep/ .el-progress-bar__inner {
            background-color: @theme;
          }
        }

        .desc {
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: 400;
          font-size: 14px;
          color: #929AA2;
        }
      }

      .right {
        width: 142px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        background: #FFFFFF;
        border: 1px solid #175E3D;
        cursor: pointer;
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: 400;
        font-size: 16px;
        color: #175E3D;
      }
    }

    .item2 {
      display: flex;

      .left {
        padding: 50px;
        width: 516px;
        background: #F3FDF9;

        .tit {
          span {
            color: #929AA2;
            font-size: 14px;
            border-bottom: 1px solid @theme;
          }
        }

        .text {
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: 400;
          font-size: 24px;
          color: #1F253B;
          margin: 20px 0;
        }

        .desc {
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: 400;
          font-size: 14px;
          color: #929AA2;
        }

        .btn {
          cursor: pointer;
          color: #fff;
          font-size: 16px;
          text-align: center;
          line-height: 48px;
          width: 138px;
          height: 48px;
          background: #175E3D;
          margin-top: 75px;
        }
      }

      .right {
        width: 684px;

        .li-item {
          display: flex;
          padding: 29px 40px;
          height: 104px;
          background-color: #fff;
          cursor: pointer;

          &:hover {
            background: #F7F7F7;
          }

          img {
            width: 46px;
            height: 46px;
          }

          .info {
            margin-left: 26px;

            .text {
              font-family: Microsoft YaHei, Microsoft YaHei;
              font-weight: 400;
              font-size: 18px;
              color: #000000;
            }

            .desc {
              width: 532px;
              margin-top: 4px;
              font-family: Microsoft YaHei, Microsoft YaHei;
              font-weight: 400;
              font-size: 14px;
              color: #929AA2;
            }
          }

        }
      }
    }

    .item3 {
      display: flex;

      .left {
        width: 516px;

        img {
          width: 100%;
          height: 344px;
        }

        .info {
          background-color: #F7F7F7;
          height: 153px;
          padding: 25px;
        }

        .tit {
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: 400;
          font-size: 22px;
          color: #000000;
        }

        .desc {
          margin-top: 12px;
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: 400;
          font-size: 14px;
          color: #929AA2;
          height: 60px;
        }
      }

      .right {
        width: 684px;

        .li-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 34px;
          margin-left: 40px;
          padding-bottom: 34px;
          border-bottom: 1px solid #EBEBEB;

          &:first-child {
            margin-top: 0;
          }

          img {
            width: 162px;
            height: 108px;
          }

          .info {
            width: 390px;
            .text {
              font-family: Microsoft YaHei, Microsoft YaHei;
              font-weight: 400;
              font-size: 18px;
              color: #000000;
            }
            .desc {
              margin-top: 10px;
              font-family: Microsoft YaHei, Microsoft YaHei;
              font-weight: 400;
              font-size: 14px;
              color: #929AA2;
            }
          }
        }
      }
    }
  }
}
</style>
