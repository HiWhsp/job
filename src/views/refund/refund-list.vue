<template>
  <div class="page">
    <div class="page-title">After-Sale Service</div>

    <div class="page-ctx">
      <div class="tab-box">
        <div class="tab-list">
          <div
            v-for="(item, index) in tab_list"
            :key="index"
            class="tab-item"
            :class="{ active: tab_select.value == item.value }"
            @click="do_toggle_tab(item)"
          >
            {{ item.title }}
            <span class="number" v-if="number_info[item.number_key]">{{
              number_info[item.number_key]
            }}</span>
          </div>
        </div>
        <!-- <div class="search-box">
        <input type="text" placeholder="输入商品名称、订单号" v-model="keyword" />
        <button @click="do_search()">搜索</button>
      </div> -->
      </div>

      <div class="page-sec">
        <div class="allow-wrap" data-title="可申请售后列表" v-if="tab_select.value == -10">
          <div class="allow-inner">
            <div class="order-list">
              <div class="order-item" v-for="(order, index) in allow_refund_order_list" :key="index">
                <div class="base-box flex-between">
                  <div class="date">{{ order.createdTime }}</div>
                  <div class="order-code">
                    Order No. <span>{{ order.orderNo }}</span>
                  </div>
                </div>
                <div class="product-box">
                  <div class="product-list">
                    <div class="product-item flex">
                      <div class="box-pic">
                        <div class="img-box">
                          <img :src="order.products.image" alt />
                        </div>
                      </div>
                      <div class="box-title">
                        <div class="title">{{ order.products.title }}</div>
                        <div class="sku">{{ order.products.keyVals }}</div>
                      </div>
                      <div class="box-price">
                        <div class="price">{{ vuex_huobi }}{{ order.products.priceSale }}<span class="unit">/pack</span></div>
                      </div>
                      <div class="box-num">
                        <div class="num">x{{ order.products.num }}</div>
                      </div>
                      <div class="box-xiaoji">
                        <div class="price">
                          {{ vuex_huobi }}{{ (order.products.priceSale * order.products.num).toFixed(2) }}
                        </div>
                      </div>
                      <div class="box-action">
                        <span class="refund-link" @click="to_refund_type(order)">Return/Refund</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="pagi-box" v-if="allow_refund_count">
              <el-pagination @current-change="on_current_change_allow" :current-page.sync="allow_pagination.page"
                :page-size="allow_pagination.pageNum" layout="total, prev, pager, next" :total="allow_refund_count"></el-pagination>
            </div>
            <el-empty v-if="!allow_refund_count" description="No data found..."></el-empty>
          </div>
        </div>


        <div class="service-wrap" data-title="售后申请列表" v-else>
          <div class="service-inner">
            <div class="service-list">
              <div class="service-item" v-for="(order, index) in refund_service_list" :key="index">
                <div class="base-box flex-between">
                  <!-- <div class="refund-type">
                    {{ order.statusInfo }}
                  </div> -->
                  <div class="date">{{ order.createdTime }}</div>
                  <div class="order-code">
                    Order No. <span>{{ order.sn }}</span>
                  </div>
                </div>
                <div class="product-box">
                  <div class="product-list">
                    <div class="product-item flex">
                      <div class="box-pic">
                        <div class="img-box">
                          <img :src="order.products.image" alt />
                        </div>
                      </div>
                      <div class="box-title">
                        <div class="title">{{ order.products.title }}</div>
                        <div class="sku">{{ order.products.keyVals }}</div>
                      </div>
                      <div class="box-price">
                        <div class="price">
                          {{ vuex_huobi }}{{ order.products.priceSale }}<span class="unit">/pack</span>
                        </div>
                      </div>
                      <div class="box-num">
                        <div class="num">x{{ order.products.num }}</div>
                      </div>
                      <div class="box-xiaoji">
                        <div class="price">{{ vuex_huobi }}{{ (order.products.priceSale * order.products.num).toFixed(2) }}</div>
                      </div>
                      <div class="box-action">
                        <span class="refund-link" @click="to_service(order)">Return/Refund</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="pagi-box" v-if="refund_service_count">
            <el-pagination @current-change="on_current_change_service" :current-page.sync="service_pagination.page"
              :page-size="service_pagination.pageNum" layout="total, prev, pager, next" :total="refund_service_count"></el-pagination>
          </div>
          <el-empty v-if="!refund_service_count" description="暂无数据..."></el-empty>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "page-refund-list",
  components: {

  },
  data() {
    return {
      tab_list: [
        { value: -10, title: "After-Sale Service" },
        { value: 0, title: "Processing", number_key: "orderRefundNum" },
        { value: 1, title: "Completed", number_key: "orderRefundFinishNum" },
      ],
      tab_select: {
        value: -10, title: "After-Sale Service"
      },


      //
      allow_pagination: {
        page: 1,
        pageNum: 10,
      },
      allow_refund_count: 0,
      allow_refund_order_list: [],//允许售后的订单列表
      //
      service_pagination: {
        page: 1,
        pageNum: 10,
      },
      refund_service_count: 0,
      refund_service_list: [],//售后申请服务列表
      //
      keyword: "",
      number_info:{

      }
    };
  },

  computed: {

  },
  created() {
    this.setView();
    this.query_userIndex()
  },
  methods: {
    setView() {
      if (this.tab_select.title == '全部') {
        this.query_allow_refund_order(); //可申请订单列表
      } else {
        this.query_refund_service_list(); //售后申请列表
      }
    },
        //用户主页数据
        query_userIndex() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "users_userInfo",
        },
      }).then((res) => {
        if (res.code == 200) {
          let data = res.data;
          this.number_info = {
            orderRefundNum: data.orderRefundNum || 0,
            orderRefundFinishNum: data.orderRefundFinishNum || 0,
          };
        }
      });
    },

    //售后列表
    query_allow_refund_order() {
      this.$api({
        url: '/service.php',
        method: 'get',
        data: {
          action: 'refund_afterSaleList',
          ...this.pagination,
        },
      }).then((res) => {
        if (res.code == 200) {
          this.allow_refund_order_list = res.data.list;
          this.allow_refund_count = res.data.count;
        }
      });
    },

    //已申请售后列表
    query_refund_service_list() {
      this.$api({
        url: '/service.php',
        method: 'get',
        data: {
          action: 'refund_lists',
          ...this.pagination,
          status: this.refund_status, //(0待处理  1已完成  -1无效)
        },
      }).then((res) => {
        if (res.code == 200) {
          res.data.list.forEach((v) => {
            v.is_jifen = v.products.jifen ? 1 : 0;
          });
          this.refund_service_list = res.data.list;
          this.refund_service_count = res.data.count;
        }
      });
    },
    
    do_toggle_tab(item) {
      this.refund_status=item.value
      this.tab_select = item;
      this.setView()
    },

    to_refund_type(item) {
      this.mix_toRoute({
        path: '/refund-type',
        query: {
          orderId: item.orderId,
          inventoryId: item.inventoryId,
        }
      })
    },
    to_service(item) {
      this.mix_toRoute({
        path: '/refund-service-detail',
        query: {
          id: item.id,
        }
      })
    },

    on_current_change_allow(value) {
      this.allow_pagination.page = value
      this.setView();
    },
    on_current_change_service(value) {
      this.service_pagination.page = value
      this.setView();
    },


    do_search() {

    },
    
    updateView() {
      this.setView();
    },

    //申请售后
    onApplyRefund(item) {
      this.$router.push({
        path: "/orderRefund", //refund-type
        query: {
          id: item.id,
        },
      });
    },

    //售后进度
    to_detail(refund) {
      this.$router.push({
        path: "/refundDetail",
        query: {
          id: refund.id,
        },
      });
    },

    //订单详情
    refund_detail(item) {
      this.$router.push({
        // path: "/refundDetail",
        path: "/refundProgress",
        query: {
          refund_id: item.id,
        },
      });
    },

    onClickLeft() {
      this.$router.push({
        path: "/user",
      });
    },

    //售后申请
    refund_apply(item) {
      //console.log({ ...item });
      this.$router.push(`/refund-type?order_id=${item.order_id}&inventoryId=${item.inventoryId}`);
    },
  },
};
</script>


<style scoped lang="less">
.page {
  padding-bottom: 50px;

  .page-title {
    margin-bottom: 20px;
    padding: 0 32px;
    text-align: left;
    height: 70px;
    line-height: 70px;
    background: #ffffff;
    font-size: 20px;
    font-family: Microsoft YaHei-Bold, Microsoft YaHei;
    font-weight: bold;
    color: #333333;
  }

  .page-ctx {
    padding: 24px 32px;
    background: #fff;
  }
}


.tab-box {
  padding-right: 20px;
    display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  // border: 1px solid #cccccc;

  .tab-list {
      display: flex;
  align-items: center;
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
      font-size: 20px;

      .number {
        color: #f74747;
        font-size: 20px;
      }

      &.active {
        // background: #7853B2;
        // color: #fff;
        font-weight: bold;
        color: #ec6a2b;

        &::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: #ec6a2b;
        }
      }
    }
  }

  .search-box {
      display: flex;
  align-items: center;
    min-width: 260px;
    height: 32px;
    background: #f9f9f9;

    input {
      background: #f9f9f9;
      flex: 2;
      height: 100%;
      border: 1px solid #e2e2e2;
      border-right: none;
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


.page-sec {
  margin-top: 30px;
}

.pagi-box {
  margin-top: 30px;
}


.allow-wrap {
  .order-list {
    .order-item {
      border: 1px solid #e5e5e5;
      margin-bottom: 30px;
    }

    .base-box {
      height: 48px;
      padding: 0 15px;
      background: #f5f5f5;
      border-bottom: 1px solid #e5e5e5;

      .date {
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 20px;
        color: #7d7d7d;
      }

      .order-code {
        flex: 2;
        text-align: left;
        padding-left: 20px;

        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 20px;
        color: #7d7d7d;

        span {
          color: #333333;
        }
      }
    }

    .product-box {
      .product-list {
        .product-item {
          padding: 22px 20px;
          border-bottom: 1px solid #eeeeee;


          &:last-child {
            border: none;
          }

          .box-pic {
            width: 96px;

            .img-box {
              width: 96px;
              height: 96px;
              border: 1px solid #eeeeee;
              display: flex;
              align-items: center;
              justify-content: center;

              img {
                width: 80px;
                height: 80px;
                object-fit: cover;
              }
            }
          }

          .box-title {
            flex: 1;
            padding-left: 20px;

            .title {
              text-align: left;
              font-size: 14px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              line-height: 20px;
              color: #1f1f1f;
              width: 360px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }

            .sku {
              margin-top: 10px;
              text-align: left;
              font-size: 12px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              line-height: 18px;
              color: #777;
              width: 360px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }

          .box-price {
            min-width: 160px;
            text-align: center;

            .price {
              font-size: 14px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              line-height: 20px;
              color: #333333;
              .unit {
                font-size: 12px;
                font-weight: 600;
              }
            }
          }


          .box-num {
            width: 80px;
            text-align: center;

            .num {

              font-size: 16px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              line-height: 20px;
              color: #505050;
            }
          }

          .box-xiaoji {
            min-width: 120px;
            text-align: center;

            .price {
              font-size: 14px;
              font-family: Microsoft YaHei;
              font-weight: 600;
              line-height: 20px;
              color: #333333;
            }
          }

          .box-action {
            width: 140px;
            text-align: right;
            padding-right: 6px;
          }

          .refund-link {
            cursor: pointer;
            color: #ec6a2b;
            font-size: 12px;
            font-weight: 700;
            user-select: none;

            &:hover {
              opacity: 0.9;
              text-decoration: underline;
            }
          }




        }
      }
    }

    .actions-box {
      text-align: right;
      padding: 15px;
      border-top: 1px solid #ccc;
      justify-content: flex-end;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      line-height: 20px;
      color: #7d7d7d;

      .btn {
        min-width: 96px;
        height: 30px;
        background: #7853B2;
        border: 1px solid #7853B2;
        font-size: 14px;
        color: #fff;
        transition: 0.3s;

        &:hover {
          opacity: 0.8;
        }
      }
    }
  }
}



.service-wrap {


  .service-list {

    .service-item {
      border: 1px solid #e5e5e5;
      margin-bottom: 30px;
    }

    .base-box {
      height: 48px;
      padding: 0 15px;
      background: #f5f5f5;
      border-bottom: 1px solid #e5e5e5;

      .refund-type {
        min-width: 80px;
        text-align: left;
        color: #7853B2;
      }

      .date {
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 20px;
        color: #7d7d7d;
      }

      .order-code {
        flex: 2;
        text-align: left;
        padding-left: 20px;

        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 20px;
        color: #7d7d7d;

        span {
          color: #333333;
        }
      }

      .order-state {
        padding: 3px 6px;
        border: 1px solid #ccc;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 20px;
        color: #505050;

        &.state2 {
          color: #7853B2;
          border-color: #7853B2;
        }
      }
    }

    .product-box {
      .product-list {
        .product-item {
          padding: 22px 20px;
          border-bottom: 1px solid #eeeeee;


          &:last-child {
            border: none;
          }

          .box-pic {
            width: 96px;

            .img-box {
              width: 96px;
              height: 96px;
              border: 1px solid #eeeeee;
              display: flex;
              align-items: center;
              justify-content: center;

              img {
                width: 80px;
                height: 80px;
                object-fit: cover;
              }
            }
          }

          .box-title {
            flex: 1;
            padding-left: 20px;

            .title {
              text-align: left;
              font-size: 14px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              line-height: 20px;
              color: #1f1f1f;
              width: 360px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }

            .sku {
              margin-top: 10px;
              text-align: left;
              font-size: 12px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              line-height: 18px;
              color: #777;
              width: 360px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }

          .box-price {
            min-width: 160px;
            text-align: center;

            .price {
              font-size: 14px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              line-height: 20px;
              color: #333333;
              .unit {
                font-size: 12px;
                font-weight: 600;
              }
            }
          }


          .box-num {
            width: 80px;
            text-align: center;

            .num {

              font-size: 16px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              line-height: 20px;
              color: #505050;
            }
          }

          .box-xiaoji {
            min-width: 120px;
            text-align: center;

            .price {
              font-size: 14px;
              font-family: Microsoft YaHei;
              font-weight: 600;
              line-height: 20px;
              color: #333333;
            }
          }

          .box-action {
            width: 140px;
            text-align: right;
            padding-right: 6px;
          }

          .refund-link {
            cursor: pointer;
            color: #ec6a2b;
            font-size: 12px;
            font-weight: 700;
            user-select: none;

            &:hover {
              opacity: 0.9;
              text-decoration: underline;
            }
          }




        }
      }
    }


    .actions-box {
      text-align: right;
      padding: 15px;
      border-top: 1px solid #ccc;
      justify-content: flex-end;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      line-height: 20px;
      color: #7d7d7d;

      .btn {
        min-width: 96px;
        height: 30px;
        background: #7853B2;
        border: 1px solid #7853B2;
        font-size: 14px;
        color: #fff;
        transition: 0.3s;

        &:hover {
          opacity: 0.8;
        }
      }
    }
  }

}
</style>

<style scoped lang="less" src="@/assets/h5css/page/shipei3.less"></style>
<style scoped lang="less" src="@/assets/h5css/modals/refundList.less"></style>
