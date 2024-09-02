<template>
  <div class="wrap-yhq-box">
    <div class="wrap-yhq" v-show="showModal">
      <div class="title">
        <img src="@img/goods/yhq.png" class="img-1" />
        <div class="text">优惠券</div>
        <img src="@img/goods/close.png" class="img-2" @click="hide_yhq" />
      </div>

      <div class="list-title">
        <img src="@img/goods/line-left.png" class="img-1" />
        <div class="text">先领券再购物</div>
        <img src="@img/goods/line-right.png" class="img-2" />
      </div>

      <div class="list-yhq">
        <div class="item" v-for="(yhq, index) in list" :key="index">
          <div class="price">{{yhq.money}}</div>
          <div class="desc">{{yhq.title}}</div>
          <div class="action" @click="coupon_pick(yhq.id)">立即领取</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import coupon from "@/shop-actions/coupon";

export default {
  name: "goods-yhq",
  components: {},
  props: ["list"],
  data() {
    return {
      showModal: false,
    };
  },
  computed: {},
  methods: {
    hide_yhq() {
      this.showModal = false;
    },

    coupon_pick(id) {
      coupon.pick({
         params: {
          id: id,
        },
        success: (data) => {
          // this.list_yhq = data;
        },
      });
    },
  },
};
</script>


<style scoped lang="less">
.wrap-yhq {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  width: 270px;
  height: 100vh;
  background: #f5f5f5;
  border-left: 1px solid #ddd;
  padding: 15px;

  .title {
    .flex();
    .text {
      flex: 2;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      line-height: 45px;
      color: #6c6c6c;
    }

    .img-1 {
      width: 20px;
    }
    .img-2 {
      width: 15px;
      cursor: pointer;
    }
  }
  .list-title {
    .flex();
    .text {
      flex: 2;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      line-height: 45px;
      color: #ff3d00;
    }

    img {
      width: 50px;
    }
  }
  .list-yhq {
    overflow-y: auto;
    height: calc(100vh - 100px);
    .item {
      width: 100%;
      height: 130px;
      cursor: pointer;
      margin-bottom: 20px;
      padding: 20px;

      .price {
        font-size: 30px;
        font-weight: bold;
        color: #ffffff;
      }
      .desc {
        font-size: 22px;
        color: #ffffff;
      }
      .action {
        margin-top: 15px;
        font-size: 16px;
        color: #f13533;
      }

      &:hover {
      }
    }
  }
}
</style>
