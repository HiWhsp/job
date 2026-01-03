<template>
  <div class="page">
    <div class="main-title">
      <div class="left">兑换商品</div>
    </div>

    <div class="page-ctx">
      <div class="wrap">
        <div class="inner">
          <div class="bottom-info">
            <div class="list-wrap">
              <div class="jilu-list">
                <div
                  class="goods-item flex-between"
                  v-for="(item, index) in list_jilu"
                  :key="index"
                >
                  <div class="img-box">
                    <img :src="item.thumb" alt="" />
                  </div>
                  <div class="title">{{ item.title }}</div>
                  <div class="price flex">
                    <div class="huobi">￥</div>
                    <div class="price-value">{{ item.priceSale }}</div>
                    <div class="unit" v-if="item.unit">/{{ item.unit }}</div>
                  </div>
                  <div class="action">
                    <div class="shuliang">
                    <div
                      class="btn minus"
                      @click="
                        item.num > 1 ? item.num-- : (item.num = 1)
                      "
                    >
                      <img src="@img/product/num-minus.png" alt="" />
                    </div>
                    <input
                      type="number"
                      v-model="item.num"
                      disabled
                    />
                    <div class="btn plus" @click="onBlur_selected_num(item)">
                      <img src="@img/product/num-plus.png" alt="" />
                    </div>
                  </div>
                    <button class="btn btn-dh" @click="doBuy(item)">立即兑换</button>
                  </div>
                </div>
              </div>

              <div class="pagination-box" v-if="count">
                <el-pagination
                  background
                  layout="total, prev, pager, next"
                  :total="count"
                  :current-page="pagination.page"
                  :page-size="pagination.pageNum"
                  @current-change="mix_current_change"
                >
                </el-pagination>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <address_model
      ref="address_model"
      data-type="地址"
    />
  </div>
</template>
<script>
import { mapState } from "vuex";
import address_model from "./components/address_model.vue"; //取消
export default {
  name: "jifen-jilu",
  components: {
    address_model
  },
  data() {
    return {
      list_jilu: [],

      pagination: {
        page: 1,
        pageNum: 10,
      },
      count: 0,
      
    };
  },
  computed: {
    // ...mapState([""]),
  },
  watch: {},
  created() {
    this.setView();
  },
  methods: {
    setView() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "product_change",
          ...this.pagination,
          cardId:this.$route.query.id
        },
      }).then((res) => {
        console.log(res);

        if (res.code == 200) {
          let data = res.data;
          let list =JSON.parse(JSON.stringify(data.list));
          list.forEach(item=>{
            item.num=1
          })
          this.list_jilu = list
          this.count = data.count;
        }
      });
    },
    doBuy(v){
      v.cardId=this.$route.query.id
      v.productId=v.id
      this.$refs.address_model.init(v);
    },
  
    onBlur_selected_num(val) {
      val.num++
      if(Number(val.num)>this.$route.query.num){
        alert('最大兑换数:'+this.$route.query.num)
        val.num=this.$route.query.num
        return
      }
    },
  },
};
</script>

<style scoped lang="less">
.page {
  text-align: left;
  padding-bottom: 80px;
  .main-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 32px;
    text-align: left;
    height: 56px;
    line-height: 56px;
    background: #ffffff;
    font-size: 16px;
    font-family: Microsoft YaHei-Bold, Microsoft YaHei;
    font-weight: bold;
    color: #333333;

    button {
      min-width: 96px;
      height: 30px;
      line-height: 30px;
      background: #009f39;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }
  }

  .page-ctx {
    margin-top: 24px;
    padding: 32px 32px 55px 32px;
    background: #fff;
  }
}

.bottom-info {
  margin-top: 20px;
  margin-bottom: 50px;
}
.jilu-list {
  margin-bottom: 30px;
  display: grid;
  grid-template-columns: repeat(auto-fill, 258px);
  gap: 20px;
  .goods-item {
    flex-direction: column;
    width: 258px;
    height: 390px;
    padding: 10px 20px 24px 20px;
    background: #ffffff;
    border-radius: 8px 8px 8px 8px;
    border: 1px solid #dfdfdf;
    .img-box {
      width: 224px;
      height: 224px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .price {
      width: 100%;
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: bold;
      font-size: 14px;
      color: #f74747;

      .huobi {
        font-size: 14px;
      }

      .price-value {
        font-size: 18px;
      }

      .unit {
        font-size: 14px;
      }
    }
    .action{
      width: 100%;
      display: flex;
      justify-content: space-between;
      .shuliang {
              min-width: 105px;
              display: flex;
              align-items: center;

              .btn {
                display: flex;
                justify-content: center;
                align-items: center;

                border: 1px solid #d5d8de;
                width: 24px;
                height: 24px;
                cursor: pointer;
                user-select: none;

                &:hover {
                  opacity: 0.8;
                }

                img {
                  width: 10px;
                  height: 10px;
                  vertical-align: bottom;
                }
              }

              .minus {
              }

              input {
                outline: none;
                margin: 0 0;
                display: inline-block;
                border: 1px solid #ccc;
                border-left: none;
                border-right: none;

                width: 40px;
                height: 30px;
                height: 24px;
                line-height: 30px;
                text-align: center;

                font-size: 16px;
                font-family: Arial;
                font-weight: 400;
                color: #4a4a4a;
              }

              input::-webkit-outer-spin-button,
              input::-webkit-inner-spin-button {
                -webkit-appearance: none !important;
              }

              /* chrome */
              input[type="number"] {
                -moz-appearance: textfield;
                /* firefox */
              }

              .plus {
              }
            }
      .btn-dh{
        width: 88px;
        height: 28px;
        color: #ffffff;
        background: #FF7600;
        border-radius: 2px 2px 2px 2px;
      }
    }
  }
}
</style>

<style
  scoped
  lang="less"
  src="@/assets/h5css/huodong/pointsDetail.less"
></style>
