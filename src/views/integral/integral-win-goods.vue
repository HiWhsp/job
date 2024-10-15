<template>
    <div class="body">
        <div class="header">
            <!-- <img src=""/> -->
        </div>
        <div class="box">
            <div class="above-wrap">
                <div class="box-above">
                    <div class="above-integral">
                        6685
                    </div>
                    <div class="above-show">
                        <div class="show-left">
                            当前积分
                        </div>

                        <div class="show-right">
                            积分明细 | 积分规则
                        </div>
                    </div>
                </div>
            </div>
            <div class="box-goods">
                <div class="goods" v-for="item in goodsList" :key="item.id">
                    <div class="goods-img">
                        <img :src="item.image" alt="积分" />
                    </div>
                    <div class="goods-name">
                        {{ item.name }}
                    </div>
                    <div class="goods-integral" @click="clickGoods(item)">
                        {{ item.integral }} 积分·兑换
                    </div>

                </div>
            </div>
        </div>
    </div>

</template>

<script>
import goodsImg from "../../static/integral/goods.png";

export default {
    data() {
        return {
            goodsList: Array.from({ length: 40 }, (_, i) => ({
                id: i + 1,
                image: goodsImg,
                name: '激光平面窗口 Ф5.0mm 厚',
                integral: 100
            }))
        };
    },

    created() {
    },
    methods: {
        clickGoods(item) {
            this.$router.push({
                path: "/pointsMallDetail",
                query: {
                    id: item.id
                }
            })
        }
    }
};


</script>

<style lang="less" scoped>
.body {
    padding-bottom: 41px;
    background: #FFF8F2;

    .header {
        width: 100%;
        height: 545px;
        background-image: url("../../static/integral/integral_win_goods.png");
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        z-index: 1;
    }

    .box {
        margin-top: -182px;
        left: 50%;
        transform: translateX(-50%);
        width: 1200px;
        height: 2770px;
        position: relative;
        flex-direction: column;
        justify-content: flex-start;

        .above-wrap {
            padding: 10px 30px 0;
            background: linear-gradient(transparent 60%, #fff);
        }

        .box-above {
            width: 1140px;
            height: 104px;
            margin-top: 28px;
            background: #FEE7D1;
            border-radius: 8px;
            padding: 17px 26px 0 31px;

            .above-integral {
                color: #FC1D18;
                font-size: 36px;
                font-weight: bold;
            }

            .above-show {
                color: #3D4248;
                font-size: 16px;
                display: flex;
                justify-content: space-between;

                .show-left {
                    text-align: left;
                }

                .show-right {
                    text-align: right;
                }
            }

        }

        .box-goods {
            width: 1200px;
            height: calc(100% - 132px);
            /* 剩余高度 */
            padding: 27px;
            background: #FFFFFF;

            .goods {
                width: 217px;
                height: 292px;
                display: flex;
                flex-direction: column;
                /* 子元素垂直堆叠 */
                align-items: center;
                float: left;
                box-shadow: 0px 0px 6px 1px rgba(0, 0, 0, 0.08);
                border-radius: 8px 8px 8px 8px;
                margin-right: 11.5px;
                margin-bottom: 34px;

                .goods-img {
                    padding: 15px 28px 8px 29px;

                    img {
                        width: 100%;
                        height: 100%;
                    }
                }

                .goods-name {
                    padding: 0 14px 0 14px;
                    color: #3D4248;
                    font-size: 16px;
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
                    justify-content: center;
                    cursor: pointer;
                }
            }
        }
    }


}
</style>