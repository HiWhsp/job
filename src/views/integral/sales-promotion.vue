<template>
    <div class="body">
        <div class="header">
        </div>
        <div class="box">
            <div class="box-above">
                <img src="../../static/integral/roll_up.png"/>
            </div>

            <div class="roll-up">
                <div class="roll" v-for="(item, index) in couponList" :key="index" v-if="couponList.length">
                    <div class="roll-coupon">{{ item.jian }}</div>
                    <div class="roll-title">满{{ item.man }}可用</div>
                    <div class="roll-price">
                        <span style="font-size: 36px;">￥</span>
                        <span style="font-size: 76px; font-weight: 800;">{{ item.money }}</span>
                    </div>
                    <div class="roll-get" @click="add_coupon(item)">立即领取</div>
                </div>
                <el-empty v-if="!couponList.length" description="暂无优惠券..."></el-empty>
            </div>
            <div class="box-goods">
                <div class="box-discount">
                    <img src="../../static/integral/discount.png"/>
                </div>

                <div class="box-body">
                    <div class="goods" v-for="item in goodsList" :key="item.id">
                        <div class="goods-img">
                            <img :src="item.thumb" alt="积分"/>
                        </div>
                        <div class="goods-name ellipsis-1">
                            {{ item.title }}
                        </div>
                        <div class="goods-price">
                            ￥{{ item.priceSale }}
                        </div>
                        <div class="goods-integral">
                            剩余:{{ item.kucun > 99 ? '99+' : item.kucun }}PCS
                            <div class="get-now" @click="goDetail(item)">
                                立即抢购
                            </div>
                        </div>

                    </div>
                </div>

                <!--                <div class="box-arrow">-->
                <!--                    <div class="arrow">-->
                <!--                        <img src="../../static/integral/arrow_left.png"/>-->
                <!--                    </div>-->
                <!--                    <div class="arrow">-->
                <!--                        <img src="../../static/integral/arrow_right.png"/>-->
                <!--                    </div>-->
                <!--                </div>-->
            </div>
        </div>
        <div class="bottom" @click="goUrl('/integralWinGoods')">
        </div>
    </div>

</template>

<script>
import goodsImg from "../../static/integral/goods.png";

export default {
    data() {
        return {
            goodsList: [],
            couponList: [],
        };
    },
    mounted() {
        this.setView();
    },
    methods: {
        setView() {
            this.$api({
                url: "/service.php",
                method: "get",
                data: {
                    action: "yhq_list",
                    scene: 1,
                    page: 1,
                    pageSize: 5
                }
            }).then((res) => {
                this.couponList = res.data;
            });

            this.$api({
                url: "/service.php",
                method: "get",
                data: {
                    action: "product_plist",
                    scene: 1,
                    page: 1,
                    pageSize: 10
                }
            }).then((res) => {
                this.goodsList = res.data.list;
            });
        },
        add_coupon(item) {
            this.$api({
                url: "/service.php",
                method: "get",
                data: {
                    action: "yhq_lingQu",
                    id: item.id
                }
            }).then((res) => {
                if (res.code == 200) {
                    this.$message.success("领取成功");
                    this.setView();
                }
            });
        },
        goUrl(url) {
            this.$router.push(url);
        },
        goDetail(item) {
            this.$router.push({
                path: "/productDetail",
                query: {
                    id: item.inventoryId
                }
            });
        }
    }
};


</script>

<style lang="less" scoped>

.body {
  background: #FEF6EC;

  .header {
    width: 100%;
    height: 545px;
    background-image: url("../../static/integral/sales_promotion.png");
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;


  }

  .bottom {
    width: 100%;
    height: 633px;
    background-image: url("../../static/integral/shop_buttom.png");
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
  }

  .box {
    width: 1400px;
    margin: 0 auto;
    position: relative;
    padding-bottom: 50px;


    .box-above {
      width: 100%;
      display: flex;
      justify-content: center;
      margin-top: 40px;
      margin-bottom: 32px;

    }

    .roll-up {
      display: flex;
      justify-content: space-between;
      margin-bottom: 73px;

      .roll {
        width: 260px;
        height: 299px;
        //border: 1px solid red;
        background-image: url("../../static/integral/coupon.png");
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        display: flex;
        flex-direction: column;
        align-items: center;

        .roll-coupon {
          font-weight: bold;
          font-size: 29px;
          color: #FFFAEA;
          line-height: 31px;
          padding-top: 18px;
        }

        .roll-title {
          font-weight: bold;
          font-size: 20px;
          color: #B88B51;
          line-height: 31px;
          padding-top: 35px;
        }

        .roll-price {
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: 400;
          color: #FF4000;
          //line-height: 44px;

        }

        .roll-get {
          font-weight: bold;
          font-size: 20px;
          color: #E73630;
          width: 174px;
          height: 45px;
          background: linear-gradient(90deg, #FFF6E8 0%, #FFBE77 100%);
          border-radius: 23px 23px 23px 23px;
          margin-top: 35px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }

    }


    .box-goods {
      width: 1400px;
      height: 850px;
      background: #FFFFFF;;

      .box-discount {
        display: flex;
        justify-content: center;
        width: 1400px;
        margin: 9px 0 7px 0;
      }

      .box-body {
        // display: flex;
        // justify-content: space-between;
        padding: 0 20px 0 33px;

        .goods {
          width: 253px;
          height: 350px;
          display: flex;
          flex-direction: column; /* 子元素垂直堆叠 */
          align-items: center;
          float: left;
          box-shadow: 0px 0px 6px 1px rgba(0, 0, 0, 0.08);
          border-radius: 8px 8px 8px 8px;
          margin-right: 14px;
          margin-bottom: 23px;

          .goods-img {
            margin: 18px 0 9px 0;
            width: 187px;
            height: 186px;

            img {
              width: 100%;
              height: 100%;
            }
          }

          .goods-name {
            width: 100%;
            font-size: 16px;
            color: #3D4248;
            padding: 0 20px;
          }

          .goods-price {
            width: 100%;
            font-weight: bold;
            font-size: 18px;
            color: #ED2920;
            line-height: 26px;
            margin-top: 9px;
            padding-left: 20px;
          }

          .goods-integral {
            width: 189px;
            height: 42px;
            background: #FFF1EB;
            border-radius: 21px 21px 21px 21px;
            margin-top: 19px;
            color: #FF6821;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-left: 14px;

            .get-now {
              width: 85px;
              height: 42px;
              background: linear-gradient(94deg, #FD5345 0%, #FF7F57 100%);
              border-radius: 21px 21px 21px 21px;
              border: 1px solid #FFBAA3;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              cursor: pointer;
            }
          }
        }
      }


      .box-arrow {
        width: 100%;
        display: flex;
        justify-content: center;
        padding-top: 23px;

        .arrow {
          width: 56px;
          height: 56px;
          align-items: center;
          margin-right: 24px;
          cursor: pointer;

          .img {
            width: 100%;
            height: 100%;
          }
        }
      }

    }


  }


}
</style>
  