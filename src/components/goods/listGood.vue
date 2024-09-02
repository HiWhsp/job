<template>
  <div class="section-list">
    <div class="item" v-for="(goods, index) in list_goods" :key="index">
      <router-link :to="`/product-detail?id=${goods.inventoryId}`">
        <div class="img-box">
          <img :src="goods.img" class="product-img" />
          <!-- <shouqing :kucun="goods.kucun" /> -->
        </div>

        <div class="info-box">
          <div class="title">
            {{ goods.title }}
          </div>
          <!-- <div class="baozhiqi">保质期：{{ goods.safe_time || "-" }}</div> -->
          <div class="price">
            <div class="sale">
              <b>{{vuex_huobi}}</b>
              {{ goods.priceSale }}
            </div>
            <!-- <div class="market">{{vuex_huobi}}{{ goods.priceMarket }}</div> -->
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
import shouqing from "@/components/common/shouqing.vue";

export default {
  name: "list-goods",
  components: {
    shouqing,
  },
  props: ["list_goods"],
  data() {
    return {};
  },
  computed: {
    title1() {
      return this.arrTitle[0] || "";
    },
    title2() {
      return this.arrTitle[1] || "";
    },
  },
  methods: {
    click_goods(item) {
      return;
      this.$router.push({
        path: "/product-detail",
        query: {
          id: item.inventoryId,
        },
      });
    },
  },
};
</script>

<style scoped lang="less">
.section-list {
  .flex();
  flex-wrap: wrap;
  .item {
    margin-right: 32px;
    margin-top: 32px;
    text-align: center;
    border: 1px solid #e5e5e5;
    overflow: hidden;

    &:nth-child(4n) {
      margin-right: 0;
    }
    &:nth-child(-n + 4) {
      margin-top: 0;
    }

    &:hover {
      .img-box {
        img {
          transform: scale(1.1);
        }
      }
    }

    .img-box {
      // width: 228px;
      // height: 228px;
      overflow: hidden;
      position: relative;
      img {
        width: 249px;
        height: 249px;
        object-fit: cover;
        transition: 0.3s;
      }
    }

    .info-box {
      width: 249px;
      background: #fff;
      // border: 1px solid #e5e5e5;
      // border-top: none;
      padding: 15px;
    }
    .title {
      text-align: left;
      width: 100%;
      .ellipsis-1();

      min-height: 40px;
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #222222;
    }
    .baozhiqi {
      margin-top: 10px;
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #ea5959;
    }
    .price {
      margin-top: 10px;
      .flex();
      .sale {
        color: #4CA5E4;
        font-size: 20px;
        font-family: PingFang SC;
        font-weight: bold;
        line-height: 24px;

        b {
          font-size: 14px;
        }
      }
      .market {
        margin-left: 10px;
        text-decoration: line-through;
        font-size: 12px;
        font-family: PingFang SC;
        font-weight: 400;
        line-height: 24px;
        color: #a4a4a4;
      }
    }
  }
}
</style>

<style scoped lang="less">
@media screen and (max-width: 1199px) {
  .section-list {
    .flex();
    flex-wrap: wrap;
    justify-content: space-between;
    .item {
      width: calc((100% - 15px) / 2);
      margin: 0;
      margin-right: 0;
      margin-top: 0;
      margin-bottom: 15px;

      text-align: center;
      border: 1px solid #e5e5e5;
      overflow: hidden;

      &:nth-child(4n) {
        margin-right: 0;
      }
      &:nth-child(-n + 4) {
        margin-top: 0;
      }

      &:hover {
        .img-box {
          img {
            transform: scale(1.1);
          }
        }
      }

      .img-box {
        // width: 228px;
        // height: 228px;
        overflow: hidden;
        position: relative;
        img {
          width: 100%;
          height: auto;
          object-fit: cover;
          transition: 0.3s;
        }
      }

      .info-box {
        width: 100%;
        background: #fff;
        // border: 1px solid #e5e5e5;
        // border-top: none;
        padding: 10px;
      }
      .title {
        text-align: left;
        width: 100%;
        .ellipsis-2();

        font-size: 12px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #222222;
        white-space: normal;
      }
      .baozhiqi {
        margin-top: 10px;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #ea5959;
      }
      .price {
        margin-top: 10px;
        .flex();
        .sale {
          color: #4CA5E4;
          font-size: 14px;
          font-family: PingFang SC;
          font-weight: bold;
          line-height: 1.5;

          b {
            font-size: 14px;
          }
        }
        .market {
          margin-left: 10px;
          text-decoration: line-through;
          font-size: 12px;
          font-family: PingFang SC;
          font-weight: 400;
          line-height: 24px;
          color: #a4a4a4;
        }
      }
    }
  }
}
</style>
