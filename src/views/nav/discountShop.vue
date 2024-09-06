<script>
export default {
  name: "discountShop",
  data() {
    return {
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
      dataList: [1,2,3,1,1,1,1,1,1,1,1],
    }
  },
  methods: {
    // 导航条点击
    navClick(item) {
      this.navIndex = item.id;
    }
  }
}
</script>

<template>
  <div class="page">
    <div class="wrap">
      <div class="top-img">
        <img src="../../static/prod/discountShop_back.png" alt="">
      </div>
      <div class="center-img">
        <!--        <img src="../../static/prod/discount.png" alt="">-->
        <p>特惠商城</p>
      </div>
      <div class="commodity-list">
        <div class="nav-bar">
          <div class="item" :class="{'active': item.id == navIndex}" v-for="(item) in navList" @click="navClick(item)"
               :key="item.id">{{
              item.title
            }}
          </div>
        </div>
        <div class="list flex">
          <div class="item" v-for="(item, index) in dataList" :key="index">
            <img src="../../static/home/promation-img.png" alt="">
            <div class="info">
              <p class="title">FUHS-30</p>
              <p class="desc ellipsis-1">型号：FUS-U30-28-L08-2-50</p>
              <p class="money">促销价：￥21.115</p>
            </div>
            <div class="btn">
              <span class="residue">剩余:156PCS</span>
              <div class="submit">立即抢购</div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped lang="less">
.page {
  width: 100%;
  background-color: #FFD0A2;
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
