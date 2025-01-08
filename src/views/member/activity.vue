
<script>
export default {
  name: "activity",
  data() {
    return {
      count: 0,
      list: [],
      pagination: {
        page: 1,
        limit: 10
      }
    }
  },
  mounted() {
    this.setView();
  },
  methods: {
    setView() {
      this.$api({
        url: 'promotion_product_list',
        method: 'post'
      }).then(res => {
        if (res.code === 200) {
          this.list = res.data;
          this.count = res.count;
        }
      })
    },
    goUrl(url) {
      this.$router.push({path: url})
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
      <div class="product-card" v-for="(item, index) in list" :key="index" @click="goUrl">
        <!-- 左侧图片 -->
        <div class="product-image">
          <img :src="item.product.thumb" alt=""/>
        </div>
        <!-- 中间商品信息 -->
        <div class="product-info">
          <h3 class="product-title">{{ item.product.title }}</h3>
          <p class="product-description">{{ item.product.description }}</p>
          <div class="product-stats flex">
            <p v-html="item.product.period"></p>
            <p style="margin-left: 5px;">好评率 <span>{{ item.product.comments }}</span></p>
          </div>
          <div class="product-date">活动时间：{{ item.start_time }}至{{ item.end_time }}</div>
        </div>

        <!-- 右侧价格与按钮 -->
        <div class="product-action">
          <div class="price">
            <span class="current-price">¥{{ item.product.price }}</span>
            <span class="original-price">¥{{ item.price }}</span>
          </div>
          <div class="buy-btn" @click="goUrl(`/analyze_detail?id=${item.product.id}&inventoryId=${item.inventoryId}`)">
            立即预约
          </div>
        </div>
      </div>
      <div v-if="count" class="pagination-box" style="margin-top: 40px; text-align: center">
        <el-pagination
            background
            layout="total, prev, pager, next"
            @current-change="changePage"
            :current-page.sync="pagination.page"
            :page-size="pagination.limit"
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

          span {
            color: #f56c6c;
            font-weight: bold;
          }
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
