<template>
  <div class="page">
    <div class="page-title">我的订单</div>

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
        <!-- <div class="search-box">
            <input v-model="keyword" type="text" placeholder="输入商品名称、订单号" />
            <button @click="do_search()">搜索</button>
            <button @click="do_reset()">重置</button>
          </div> -->
      </div>

      <div class="page-sec">
        <div class="invoice-wrap">
          <div
            class="info-item"
            v-for="(item, index) in fapiao_list"
            :key="index"
          >
            <div class="base-box flex-between">
              <div class="date">{{ item.dtTime }}</div>
              <div class="order-code">
                订单号：
                <span>{{ item.orderId }}</span>
              </div>
              <div class="order-state">
                {{ item.cus_status }}
              </div>
            </div>

            <div class="product-box">
              <div class="product-list">
                <div
                  class="product-item flex"
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
                      class="product-title"
                      @click="mix_to_product(product_item)"
                    >
                      {{ product_item.title }}
                    </div>
                    <div class="product-sku">{{ product_item.keyVals }}</div>
                  </div>
                  <!-- <div class="box-sku">
                      <div class="product-sku">{{ product_item.keyVals }}</div>
                    </div> -->
                  <div class="box-price">
                    {{ vuex_huobi }} {{ product_item.priceSale }}
                  </div>
                  <div class="box-num">x {{ product_item.num }}</div>
                  <div class="box-subtotal">
                    {{ vuex_huobi }} {{ product_item.priceSale }}
                  </div>
                </div>
              </div>
            </div>

            <div class="info-heji">
              <div class="heji">
                <!-- <div class="heji-num">
                                    共 <b>{{ item.count_goods }}</b> 个商品
                                </div>
                                <div class="heji-money">
                                    合计金额： <b>{{ item.price }} 元</b>
                                </div> -->
              </div>

              <div class="btn-actions">
                <button class="btn-ripple fit-text" @click="to_detail(item)">
                  开票详情
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="count"
          class="pagination-box"
          style="margin-top: 40px; text-align: right"
        >
          <el-pagination
            background
            layout="total, prev, pager, next"
            @current-change="on_current_change"
            :current-page.sync="pagination.page"
            :page-size="pagination.pageNum"
            :total="count"
          ></el-pagination>
        </div>

        <el-empty v-if="!count" description="没有查询到订单信息..."></el-empty>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "invoice-list",
  components: {},
  data() {
    return {
      tabSelect: {
        title: "全部",
        value: 0,
      },
      tabList: [
        {
          title: "全部",
          value: 0,
        },
        {
          title: "待开票",
          value: 1,
        },
        {
          title: "已开票",
          value: 2,
        },
        // {
        // 	title: '已作废',
        // 	value: -1,
        // },
      ],
      status_map: {
        1: "待开票",
        2: "已开票",
        "-1": "已作废",
      },
      //
      fapiao_list: [],
      pagination: {
        page: 1,
        pageNum: 10,
      },
      count: 0,
      keyword: "",
      user_index: {},
    };
  },
  computed: {
    ...mapState([""]),
  },
  created() {
    this.setView();
  },

  methods: {
    setView() {
      this.query_userIndex();
      this.query_list();
    },

    //用户主页数据
    query_userIndex() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "users_index",
          ...this.pagination,
          scene: this.tabSelect.value,
          // keyword: this.keyword,
        },
      }).then((res) => {
        if (res.code == 200) {
          this.user_index = res.data;
        }
      });
    },

    //订单列表
    query_list() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "invoices_getList",
          ...this.pagination,
          isTitle: "", //1 过滤重复识别码
          status: this.tabSelect.value, //0 全部 1- 待开票 2 已开票 -1 已作废
        },
      }).then((res) => {
        if (res.code == 200) {
          let data = res.data;
          data.list.forEach((v) => {
            v.cus_status = this.status_map[v.status];
            try {
              v.products = JSON.parse(v.info);
            } catch (error) {
              v.products = [];
            }
          });
          this.fapiao_list = data.list;
          this.count = data.count;
        }
      });
    },

    do_toggle_tab(item) {
      this.tabSelect = item;
      this.pagination.page = 1;
      this.query_list();
    },
    on_current_change(value) {
      this.pagination.page = value;
      this.query_list();
    },
    do_search() {
      this.pagination.page = 1;
      this.query_list();
    },
    do_reset() {
      this.keyword = "";
      this.pagination.page = 1;
      this.query_list();
    },
    to_detail(item) {
      this.toRoute({
        path: "/invoice-detail",
        query: {
          invoiceId: item.id,
          orderId: item.typeId,
        },
      });
    },
  },
};
</script>

<style scoped lang="less">
.page {
  padding-bottom: 50px;

  .page-title {
    padding: 0 32px;
    text-align: left;
    height: 56px;
    line-height: 56px;
    background: #ffffff;
    font-size: 16px;
    font-family: Microsoft YaHei-Bold, Microsoft YaHei;
    font-weight: bold;
    color: #333333;
  }

  .page-ctx {
    margin-top: 14px;
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

      .number {
        color: #F74747;
      }

      &.active {
        // background: #F74747;
        // color: #fff;
        font-weight: bold;
        color: #F74747;

        &::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: #F74747;
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

.goods-sku {
  margin: 15px 0;
}

.check-url {
  // margin: 15px 0;

  span {
    cursor: pointer;
    display: inlin-block;
    padding: 2px 4px;
    background: coral;
    color: #fff;
  }
}

.page-sec {
  margin-top: 24px;
}

.invoice-wrap {
  .info-item {
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
      padding: 3px 6px;
      // border: 1px solid #ccc;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      line-height: 20px;
      color: #999999;
      color: #F74747;

      // 待付款
      &.state--5 {
        // background: #ff4c29;
        // border-color: #ff4c29;
        // color: #fff;
      }

      &.state-2 {
        color: #F74747;
        border-color: #F74747;
      }
    }
  }

  .product-box {
    .product-list {
      .product-item {
        padding: 20px;
        border-bottom: 1px dashed #ccc;

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

          .product-title {
            width: fit-content;
            cursor: pointer;

            &:hover {
              color: #F74747;
            }
          }

          .product-sku {
            margin-top: 20px;
            min-width: 200px;
            color: #777;
          }
        }

        .box-sku {
          text-align: center;
          min-width: 200px;
        }

        .box-num {
          text-align: center;
          min-width: 150px;
        }

        .box-price {
          text-align: center;
          min-width: 150px;

          font-family: OPPOSans, OPPOSans;
          font-weight: 400;
          font-size: 14px;
          color: #777;
        }

        .box-subtotal {
          text-align: center;
          min-width: 150px;

          font-family: OPPOSans, OPPOSans;
          font-weight: 400;
          font-size: 14px;
          color: #777;
        }

        .box-refund {
          .refund-act {
            text-align: center;
            min-width: 150px;

            font-family: OPPOSans, OPPOSans;
            font-weight: 400;
            font-size: 14px;
            color: #ff0000;
          }
        }
      }
    }
  }

  .info-heji {
    padding: 5px 24px;
    border-top: 1px solid #e5e5e5;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: 20px;
    color: #7d7d7d;
    background: #f5f5f5;

    .heji {
      display: flex;
      align-items: center;
      font-size: 14px;
      font-family: sans-serif;
      font-weight: 400;
      color: #333333;

      .heji-num {
        margin-right: 30px;

        b {
          color: #F74747;
        }
      }

      .heji-money {
        b {
          color: #F74747;
        }
      }
    }

    .btn-actions {
      button {
        transition: 0.3s;
        min-width: 120px;
        height: 32px;
        background: #ffffff;
        border-radius: 50px 50px 50px 50px;
        border-radius: 4px;
        border: 1px solid #F74747;
        font-family: Arial, Arial;
        font-weight: 400;
        font-size: 14px;
        color: #F74747;

        & + button {
          margin-left: 20px;
        }

        &:hover {
          opacity: 0.7;
        }

        &.btn-bg {
          background: #F74747;
          color: #ffffff;
        }
      }
    }
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/shop/order-list.less"></style>

<style scoped lang="less" src="@/assets/h5css/shop/orderList.less"></style>