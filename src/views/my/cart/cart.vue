<template>
    <div class="page">
      <div class="main-title">售后订单</div>

      <div class="page-ctx">
        <div class="tab-box">
          <div class="tab-list">
            <div
              v-for="(item, index) in tabList"
              :key="index"
              class="tab-item"
              :class="tabSelect.value == item.value ? 'active' : ''"
              @click="do_toggle_tab(item)"
            >
              {{ item.title }}
              <span class="number" v-if="item.num">{{ item.num }}</span>
            </div>
          </div>
          <div class="search-box">
            <input v-model="keyword" type="text" placeholder="输入名称、订单号" />
            <div class="search-wrap">
              <img src="@/static/order/search.png" alt="" />
            </div>
          </div>
        </div>

        <div class="order-list-wrap">
          <div class="info-item" v-for="(item, index) in list" :key="index">
            <div class="info-title">
              <div class="order-code">
                售后单号：
                <span>{{ item.orderNo }}</span>
              </div>
              <div class="order-state" :class="'state-' + item.orderStatus">
                <img src="@/assets/img/refund/return.png" alt="" />退货退款
              </div>
            </div>
            <div class="info-good">
              <div class="list-good">
                <div
                  class="item-good flex"
                  v-for="(product_item, product_index) in item.products"
                  :key="product_index"
                >
                  <div
                    class="box-image cover"
                    @click="mix_to_product(product_item)"
                  >
                    <!-- <img :src="good.img" alt /> -->
                    <el-image :src="product_item.image">
                      <div slot="error" class="image-slot">
                        <img :src="product_item.image" />
                      </div>
                    </el-image>
                  </div>

                  <div class="box-title">
                    <div
                      class="goods-title"
                      @click="mix_to_product(product_item)"
                    >
                      {{ product_item.title }}
                    </div>
                    <div class="goods-sku">{{ product_item.keyVals }}</div>
                  </div>
                  <div class="box-sku">
                    <div class="goods-sku">
                      {{ vuex_huobi }}{{ product_item.priceSale }}
                    </div>
                  </div>
                  <div class="box-num">
                    {{ product_item.num }}
                  </div>
                  <div class="box-price">
                    {{ vuex_huobi }}
                    {{ product_item.priceSale * product_item.num }}
                  </div>
                </div>
              </div>
            </div>
            <div class="desc-wrap">
              <div class="desc">处理中</div>
              <div class="sub-desc">待平台确认收货 7天后自动收货</div>
              <div
                class="cancel-after-sale"
                @click="onRouteTo('after-sale-refund-detail')"
              >
                取消售后
              </div>
            </div>
          </div>
        </div>

        <div
          class="pagination-box"
          style="margin-top: 40px; text-align: right; text-align: center"
        >
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage4"
            :page-sizes="[100, 200, 300, 400]"
            :page-size="100"
            layout="total, sizes, prev, pager, next, jumper"
            :total="400"
          >
          </el-pagination>
        </div>
      </div>
    </div>
  </template>

  <script>
  export default {
    name: "servicePage",
    components: {},
    data() {
      return {
        tabSelect: {
          title: "全部",
          value: 0,
        },
        keyword: "",
        user_index: {},
        list: [],
        pagination: {
          page: 1,
          pageNum: 10,
        },
        currentPage4: 1,
      };
    },

    computed: {
      tabList() {
        //scene
        //筛选状态：0-全部 1-待支付 2-待发货 3-待收货 4-待核销 5-已完成 6-待评价 7-已取消
        //orderStatus
        //订单状态：-5-待支付  -1-已取消  2-待发货  3-待收货  4-待自提  5-已完成
        let user_index = {} || this.user_index;
        let tabList = [
          { value: 0, title: "售后申请" },
          { value: 1, title: "处理中", num: user_index.order_num_1 || 1 },
          { value: 2, title: "已完成", num: user_index.order_num_4 || 1 },
          { value: 3, title: "已取消", num: user_index.order_num_4 || 1 },
        ];
        return tabList;
      },
    },

    created() {},

    methods: {
      do_toggle_tab(item) {
        this.tabSelect = item;
        this.pagination.page = 1;
        this.query_order();
      },
      query_order() {
        this.$api({
          url: "/service.php",
          method: "get",
          data: {
            action: "orders_lists",
            ...this.pagination,
            scene: this.tabSelect.value,
            // keyword: this.keyword,
          },
        }).then((res) => {
          let { code, data } = res;
          if (code == 200) {
            let list = data.list;

            list.forEach((order) => {
              order.isPay = order.value >= 0;
              order.actions = this.getOrderActions({
                ...order,
              });

              let count_goods = 0;
              order.products.forEach((product) => {
                count_goods = count_goods + +product.num;
              });
              order.count_goods = count_goods;
            });

            this.orders = list;
            this.count = data.count;
          }
        });
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },
      onRouteTo(path) {
        this.$router.push({
          name: path,
          query: {
            status: "return-refund-success",
          },
        });
      },
    },
  };
  </script>


  <style scoped lang="less">
  .page {
    padding: 0;

    .main-title {
      margin-bottom: 13px;
      padding: 0 32px;
      text-align: left;
      height: 56px;
      font-weight: bold;
      line-height: 56px;
      background: #ffffff;
      font-size: 16px;
      font-family: Microsoft YaHei-Bold, Microsoft YaHei;
      color: #333333;
    }

    .page-ctx {
      padding: 24px 32px;
      background: #fff;
    }
  }

  .tab-box {
    padding-right: 20px;
    .flex-between();
    background: #ffffff;
    // border: 1px solid #cccccc;

    .tab-list {
      .flex();
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      line-height: 20px;
      color: #7d7d7d;

      .tab-item {
        position: relative;
        // min-width: 96px;
        height: 48px;
        line-height: 48px;
        cursor: pointer;
        margin-right: 40px;

        .number {
          color: @theme;
        }

        &.active {
          // background: @theme;
          // color: #fff;
          font-weight: bold;
          color: @theme;

          &::after {
            content: "";
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: @theme;
          }
        }
      }
    }

    .search-box {
      .flex();
      min-width: 260px;
      height: 32px;
      background: #fff;

      input {
        background: #fff;
        flex: 2;
        height: 100%;
        border: 1px solid #b8c4d1;
        outline: none;
        padding-left: 10px;
        font-size: 12px;
      }

      button {
        width: 50px;
        height: 32px;
        background: #ffffff;
        border: 1px solid #e2e2e2;
        color: #7d7d7d;

        &:last-child {
          border-left: 0;
        }
      }
    }
  }

  .order-list-wrap {
    margin-top: 34px;
    .info-item {
      border: 1px solid #e5e5e5;
      margin-bottom: 30px;
    }

    .info-title {
      .flex-between();
      height: 48px;
      padding: 0 15px;
      background: #f5f5f5;
      border-bottom: 1px solid #e5e5e5;

      .date {
        font-size: 14px;
        font-family: Microsoft YaHei-Bold, Microsoft YaHei;
        font-weight: bold;
        color: #333333;
      }

      .order-code {
        flex: 2;
        text-align: left;
        padding-left: 20px;

        font-size: 14px;
        font-family: Microsoft YaHei-Bold, Microsoft YaHei;
        font-weight: bold;
        color: #333333;

        span {
          color: #333333;
        }
      }

      .order-state {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        color: #27417c;
        padding: 3px 6px;
        font-size: 14px;
        font-weight: 400;
      }
    }

    .info-good {
      .list-good {
        .item-good {
          padding: 20px;
          border-bottom: 1px solid #e5e5e5;

          font-family: OPPOSans, OPPOSans;
          font-weight: 400;
          font-size: 14px;
          color: #333333;

          &:last-child {
            border: none;
          }

          .box-image {
            width: 100px;
            height: 100px;
            cursor: pointer;
            border: 1px solid #f5f5f5;

            /deep/ img {
              width: 100px;
              height: 100px;
              object-fit: contain;
              object-fit: cover;
            }

            img {
              width: 100px;
              height: 100px;
              object-fit: contain;
              object-fit: cover;
            }
          }

          .box-title {
            flex: 1;
            text-align: left;
            padding-left: 40px;

            .goods-title {
              width: fit-content;
              cursor: pointer;

              &:hover {
                color: @theme;
              }
            }
          }

          .box-sku {
            text-align: center;
            min-width: 200px;
          }

          .box-num {
            text-align: center;
            min-width: 200px;
          }

          .box-price {
            text-align: center;
            min-width: 200px;

            font-family: OPPOSans, OPPOSans;
            font-weight: bold;
            font-size: 14px;
            color: #333;
          }
        }
      }
    }

    .info-heji {
      padding: 15px;
      border-top: 1px solid #e5e5e5;
      .flex-between();
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      line-height: 20px;
      color: #7d7d7d;

      .heji {
        .flex();
        font-size: 14px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        font-weight: 400;
        color: #333333;

        .heji-num {
          margin-right: 30px;

          b {
            color: #ea3200;
          }
        }

        .heji-money {
          b {
            color: #ea3200;
          }
        }
      }

      .btn-actions {
        button {
          transition: 0.3s;
          min-width: 120px;
          height: 32px;
          background: #ffffff;
          border-radius: 4px;
          border: 1px solid @theme;
          font-family: Arial, Arial;
          font-weight: 400;
          font-size: 14px;
          color: @theme;

          & + button {
            margin-left: 20px;
          }

          &:hover {
            opacity: 0.7;
          }

          &.btn-bg {
            background: @theme;
            color: #ffffff;
          }
        }
      }
    }
  }

  .desc-wrap {
    position: relative;
    height: 40px;
    display: flex;
    align-items: center;
    gap: 39px;
    padding-left: 29px;
    background: #f5f5f5;
    .desc {
      width: 56px;
      height: 19px;
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: 400;
      font-size: 14px;
      color: #333333;
      text-align: left;
      font-style: normal;
      text-transform: none;
    }
    .sub-desc {
      height: 19px;
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: 400;
      font-size: 14px;
      color: #888888;
      text-align: left;
      font-style: normal;
      text-transform: none;
    }
    .cancel-after-sale {
      position: absolute;
      right: 17px;
      width: 104px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #ffffff;
      border-radius: 4px 4px 4px 4px;
      border: 1px solid #27417c;
      font-size: 14px;
      color: #27417c;
      line-height: 20px;
      text-align: center;
      cursor: pointer;
    }
  }
  </style>

  <style lang="less" scoped>
  .goods-sku {
    margin: 15px 0;
  }

  .search-box {
    position: relative;
  }

  .search-wrap {
    position: absolute;
    right: 13px;
    top: 7px;
  }
</style>
