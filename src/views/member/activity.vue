<script>
export default {
  name: "activity",
  data() {
    return {
      count: 0,
      pagination: {
        page: 1,
        pageNum: 10
      }
    }
  },
  methods: {
    goUrl() {
      this.$router.push({path: '/analyze_detail'})
    }
  }
}
</script>

<template>
  <div class="container">
    <div class="top-img">
      <p>活动专区</p>
    </div>
    <div class="content main">
      <div class="product-card" v-for="i in 3">
        <!-- 左侧图片 -->
        <div class="product-image">
          <img src="https://via.placeholder.com/150" alt="商品图片"/>
        </div>
        <!-- 中间商品信息 -->
        <div class="product-info">
          <h3 class="product-title">双束聚焦电子显微镜</h3>
          <p class="product-description">
            双束聚焦显微镜，是基于SEM, 提供了更精确的粒子分析。能够输出3D工具、TEM研究的辅助特性。
          </p>
          <p class="product-stats">
            已完成 <span class="highlight">11967</span>次，收到好评率高达 <span class="highlight">99.1%</span>。
          </p>
          <div class="product-date">活动时间：2024-08-10至2024-08-31</div>
        </div>

        <!-- 右侧价格与按钮 -->
        <div class="product-action">
          <div class="price">
            <span class="current-price">¥800.00</span>
            <span class="original-price">¥1000.00</span>
          </div>
          <div class="buy-btn" @click="goUrl">立即预约</div>
        </div>
      </div>
      <div v-if="count" class="pagination-box" style="margin-top: 40px; text-align: center">
        <el-pagination
            background
            layout="total, prev, pager, next"
            @current-change="changePage"
            :current-page.sync="pagination.page"
            :page-size="pagination.pageNum"
            :total="count"
        ></el-pagination>
      </div>

      <!--      <el-empty v-if="!count" description="没有查询到订单信息..."></el-empty>-->
    </div>
  </div>
</template>

<style scoped lang="less">
.container {
  padding-bottom: 50px;

  .top-img {
    position: relative;
    height: 345px;
    background-image: url("~@/assets/img/member/activity-bg.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;

    p {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      font-family: Source Han Sans CN, Source Han Sans CN;
      font-weight: 800;
      font-size: 50px;
      color: #FFFFFF;
      line-height: 20px;
      text-shadow: 0px 3px 6px #00479D;
    }
  }

  .content {
    margin-top: 90px;

    .product-card {
      background-color: #fff;
      padding: 25px 55px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;

      .product-image img {
        width: 204px;
        height: 169px;
        border-radius: 8px;
      }

      .product-info {
        flex: 1;
        padding-left: 20px;
        padding-right: 90px;

        .product-title {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 10px;
        }

        .product-description {
          font-size: 14px;
          color: #666;
          margin-bottom: 10px;
        }

        .product-stats {
          font-size: 14px;
          color: #999;
        }

        .product-stats .highlight {
          color: #f56c6c;
          font-weight: bold;
        }

        .product-date {
          font-weight: 400;
          font-size: 13px;
          color: #B4B2B2;
          text-align: right;
        }
      }
    }

    .product-action {
      text-align: right;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-end;

      .price {
        margin-bottom: 10px;
      }

      .current-price {
        font-size: 20px;
        color: #00479D;
        font-weight: bold;
      }

      .original-price {
        font-size: 14px;
        text-decoration: line-through;
        color: #ccc;
        margin-left: 10px;
      }

      .buy-btn {
        width: 114px;
        height: 34px;
        background: #00479D;
        color: #fff;
        font-size: 14px;
        line-height: 34px;
        text-align: center;
        cursor: pointer;
      }
    }


  }
}
</style>