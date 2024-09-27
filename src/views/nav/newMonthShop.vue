<script>
export default {
  name: "discountShop",
  data() {
    return {
      count: 0,
      navIndex: 1,
      navList: [
        {
          title: '单轴模组',
          id: 1
        },
        {
          title: '多轴模组',
          id: 2
        },
        {
          title: '单轴组件',
          id: 3
        },
        {
          title: '多轴组件',
          id: 4
        },
        {
          title: '电动直线滑台',
          id: 5
        },
        {
          title: '对位平台',
          id: 6
        },
        {
          title: '模组配件',
          id: 7
        }
      ],
      dataList: [],
      pagination: {
        page: 1,
        pagenum: 10
      },
    }
  },
  mounted() {
    this.getList();
  },
  methods: {
    // 导航条点击
    navClick(item) {
      this.navIndex = item.id;
    },
    changePage() {
      this.getList();
    },
    // 获取列表
    getList() {
      this.$api("product_plist", {
        ...this.pagination,
        channelId: 0,
        orderType: 0,
      }).then(res => {
        if (res.code == 200) {
          this.dataList = res.data.list;
          this.count = res.data.count;
        }
      })
    },
    goDetail(item) {
      this.$router.push(`/productDetail?id=${item.inventoryId}`)
    },
  }
}
</script>

<template>
  <div class="page">
    <div class="wrap">
      <div class="top-img">
        <img src="../../static/prod/newMonthShop_back.png" alt="">
      </div>
      <div class="center-img">
        <!--        <img src="../../static/prod/discount.png" alt="">-->
        <p>每月新款</p>
      </div>
      <div class="commodity-list">
        <!--        <div class="nav-bar">-->
        <!--          <div class="item" :class="{'active': item.id == navIndex}" v-for="(item) in navList" @click="navClick(item)"-->
        <!--               :key="item.id">{{-->
        <!--              item.title-->
        <!--            }}-->
        <!--          </div>-->
        <!--        </div>-->
        <div class="list flex">
          <div class="item" v-for="(item, index) in dataList" :key="index">
            <img :src="item.thumb" alt="">
            <div class="info">
              <p class="title">{{ item.title }}</p>
              <p class="desc ellipsis-1">型号：{{ item.keyVals }}</p>
              <p class="money">促销价：￥{{ item.priceSale }}</p>
            </div>
            <div class="btn">
              <span class="residue">剩余:{{ item.kucun > 99 ? '99+' : item.kucun }}PCS</span>
              <div class="submit" @click="goDetail(item)">立即抢购</div>
            </div>
          </div>
        </div>
        <el-empty v-if="!count" description="暂无数据..."></el-empty>

        <div class="pagination-box" v-if="count" style="margin-top: 50px;">
          <el-pagination background layout="prev, pager, next" :total="count" :current-page="pagination.page"
                         :page-size="pagination.pagenum" @current-change="changePage"></el-pagination>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped lang="less">
.page {
  width: 100%;
  background-color: #F8C268;
  padding: 0 0 51px 0;
}

.top-img {
  width: 100%;

  img {
    width: 100%;
    height: 457.34px;
  }
}

.center-img {
  width: 435px;
  height: 143px;
  background-image: url("../../static/prod/discount.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  position: absolute;
  left: 50%;
  margin-left: -215.25px;
  top: 650px;

  p {
    margin-top: 8px;
    font-family: Roboto, Roboto;
    font-weight: 400;
    font-size: 36px;
    color: #FFFFFF;
    font-style: normal;
    text-transform: none;
    text-align: center;
    line-height: 143px;
    z-index: 2;
  }
}

.commodity-list {
  width: 1200px;
  margin: 76px auto;
  background: #FFFFFF;
  border-radius: 20px 20px 20px 20px;
  padding: 108px 28px 32px 28px;

  .nav-bar {
    height: 48px;
    background-color: #FEE7D1;
    border-radius: 30px;
    margin-bottom: 30px;
    overflow: hidden;
    .flex();

    .item {
      height: 100%;
      line-height: 48px;
      flex: 1;
      text-align: center;
      cursor: pointer;
      color: #333;
    }

    .item.active {
      background: #FF6821;
      color: #fff;
    }
  }

  .list {
    flex-wrap: wrap;

    .item {
      padding: 15px 13px 24px;
      margin-right: 14px;
      width: 217px;
      height: 354px;
      background: #FFFFFF;
      box-shadow: 0px 0px 6px 1px rgba(0, 0, 0, 0.08);
      border-radius: 8px 8px 8px 8px;
      margin-bottom: 30px;

      img {
        margin: 0 15px 8px;
        width: 160px;
        height: 160px;
        border-radius: 0px 0px 0px 0px;
      }

      .info {
        margin-bottom: 22px;

        .title {
          font-family: Roboto, Roboto;
          font-weight: 400;
          font-size: 16px;
          color: #3D4248;
          font-style: normal;
          text-transform: none;
          margin-bottom: 8px;
        }

        .desc {
          font-family: Roboto, Roboto;
          font-weight: 400;
          font-size: 14px;
          color: #77797B;
          font-style: normal;
          text-transform: none;
          margin-bottom: 8px;
        }

        .money {
          font-family: Roboto, Roboto;
          font-weight: 400;
          font-size: 18px;
          color: #FF4000;
          font-style: normal;
          text-transform: none;
        }
      }

      .btn {
        width: 189px;
        height: 42px;
        background: #FFF1EB;
        border-radius: 21px 21px 21px 21px;
        border: 1px solid #FFBAA3;
        line-height: 42px;
        .flex();
        justify-content: space-between;

        .residue {
          flex: 1;
          text-align: center;
          font-family: Roboto, Roboto;
          font-weight: 400;
          font-size: 14px;
          color: #FF6821;
          font-style: normal;
          text-transform: none;
        }

        .submit {
          width: 85px;
          height: 42px;
          background: linear-gradient(94deg, #FD5345 0%, #FF7F57 100%);
          border-radius: 21px 21px 21px 21px;
          border: 1px solid #FFBAA3;
          text-align: center;
          color: #fff;
          cursor: pointer;
        }
      }
    }

    .item:nth-child(5n) {
      margin-right: 0;
    }
  }
}
</style>
