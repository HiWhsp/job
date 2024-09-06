<template>
  <div class="page">
    <div class="nav-bar">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item><a href="/">活动管理</a></el-breadcrumb-item>
        <el-breadcrumb-item>活动列表</el-breadcrumb-item>
        <el-breadcrumb-item>活动详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!--    条件筛选-->
    <div class="condition-filter">
      <p class="title">条件筛选</p>
      <div class="filter flex">
        <p class="name">种类</p>
        <div class="item-wrap flex">
          <div class="item pointer" :class="{ 'active': activeIndex === item.id }" v-for="(item, index) in filterItem"
               :key="index"
               @click="itemNav(item)">
            {{ item.title }}
          </div>
        </div>
      </div>
    </div>
    <!--    商品列表-->
    <div class="page-list">
      <div class="filter-item">
        <div class="label">
          <p>共<span>{{ count }}</span>条</p>
        </div>
        <div class="val">
          <div class="sort-box">
            <div class="item" v-for="(item, index) in sortList" :key="index"
                 :class="orderByColumn == item.ziduan ? 'active' : ''" @click="onClickSort(item)">
              <div class="text">{{ item.title }}</div>
              <div class="sanjiao-box" v-if="item.title != '综合排序'">
                <div class="top" :class="orderByColumn == item.ziduan && isAsc == 'asc' ? 'active' : ''"></div>
                <div class="bottom" :class="orderByColumn == item.ziduan && isAsc == 'desc' ? 'active' : ''"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="goods-wrap">
        <div class="product-list flex">
          <div class="product-item flex" v-for="(item, index)  in list_goods" :key="index" @click="toDetail(item)">
            <div class="poster-box scale-box">
              <img :src="item.thumb" alt="" class="poster scale-img">
            </div>
            <div class="info-box">
              <div class="title">{{ item.title }}</div>
              <div class="pirce-box flex flex-between">
                <div class="price-info">
                  <div class="price-1">￥{{ item.priceSale }}</div>
                </div>
                <div class="cart-box" @click.stop="doCart(item)">
                  <img src="../../static/prod/goods-cart.png" alt="" class="cart">
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="pagination-box" v-if="count" style="margin-top: 50px;">
          <el-pagination background layout="prev, pager, next" :total="count" :current-page="pagination.page"
                         :page-size="pagination.pagenum" @current-change="changePage"></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {createLogger} from "vuex";

export default {
  name: '',
  data() {
    return {
      activeIndex: '',
      count: 0, // 总和
      pages: 1,

      // 筛选分类
      filterItem: [
        {
          title: '全封闭同步带模组',
          id: 1
        }, {
          title: '全封闭同步带模组',
          id: 2
        }, {
          title: '全封闭同步带模组',
          id: 3
        }, {
          title: '全封闭同步带模组',
          id: 4
        }, {
          title: '全封闭同步带模组',
          id: 5
        }, {
          title: '全封闭同步带模组',
          id: 6
        }, {
          title: '全封闭同步带模组',
          id: 7
        }, {
          title: '全封闭同步带模组',
          id: 8
        }, {
          title: '全封闭同步带模组',
          id: 9
        }, {
          title: '全封闭同步带模组',
          id: 10
        }
      ],
      isAsc: "", //升asc 降序desc
      orderByColumn: "ordering", //选择的排序方式
      sortList: [
        {title: "综合排序", ziduan: "ordering"},
        {title: "单价", ziduan: "price_sale"},
        {title: "库存", ziduan: "orders"}
      ],
      pagination: {
        page: 1,
        pagenum: 18,
      },
      // 商品列表
      list_goods: [],
    }
  },
  created() {
    this.setView();
  },
  methods: {
    setView() {
      this.queryGoods();
    },
    // 条件点击
    itemNav(item) {
      this.activeIndex = item.id
    },
    //排序方式
    onClickSort(item) {
      if (item.ziduan == this.orderByColumn) {
        this.isAsc = this.isAsc == "asc" ? "desc" : "asc";
      } else {
        this.isAsc = "asc";
      }
      this.orderByColumn = item.ziduan;

      let sortParams = {
        order1: this.orderByColumn,
        order2: this.orderByColumn != 'ordering' ? this.isAsc : '',
      };
    },
    //商品查询
    queryGoods() {
      this.$api("product_plist", {
        channelId: 0 || "",
        ...this.pagination,
      }).then((res) => {
        let data = res.data;
        this.list_goods = data.list;
        this.count = data.count;
        this.pages = data.pages;

      });
    },
    // 加入购物车
    doCart(item) {
      this.$api("gouwuche_add", {
        inventoryId: item.inventoryId,
        num: 1,
        _no_tip: 1,
      }).then((res) => {
        let {code, count} = res;
        alert(res)
        if (code == 1) {
          // this.$refs.modalAddSuccess.init({
          //   num: this.selected_num,
          //   ...this.select_specifications,
          // });
          this.mix_shopcart_update_count(count);
        }
      });
    },
    // 跳转详情页
    toDetail(item) {
      this.$router.push(`/productDetail?id=${item.inventoryId}`)
    },
  }

}
</script>

<style lang="less" scoped>
.condition-filter {
  margin-top: 21px;
  height: 152px;
  background: #FFFFFF;
  border-radius: 8px 8px 8px 8px;
  padding: 15px 18px;

  .title {
    font-family: Roboto, Roboto;
    font-weight: bold;
    font-size: 16px;
    color: #000000;
    font-style: normal;
    text-transform: none;
  }

  .filter {
    margin-top: 28px;
    align-items: start;

    .name {
      width: 140px;
      font-family: Roboto, Roboto;
      font-weight: 400;
      font-size: 14px;
      color: #333333;
      font-style: normal;
      text-transform: none;
    }

    .item-wrap {
      flex-wrap: wrap;
      flex: 1;

      .item {
        width: 123px;
        height: 29px;
        line-height: 29px;
        border-radius: 2px 2px 2px 2px;
        font-family: Roboto, Roboto;
        font-weight: 400;
        font-size: 14px;
        color: #333;
        font-style: normal;
        text-transform: none;
        margin: 0 60px 20px 0;
        border: 1px solid #fff;
        text-align: center;
      }

      .item.active {
        border: 1px solid #A66600;
        color: #A66600;
      }
    }
  }
}

.page-list {
  margin-top: 20px;

  .filter-item {
    display: flex;
    align-items: flex-start;
    padding: 16px 18px 0 18px;
    background-color: #fff;

    &:last-child {
      border-bottom: none;
    }

    .label {
      font-size: 14px;
      height: 46px;
      line-height: 46px;
      text-align: right;

      span {
        color: @theme;
        margin: 0 5px;
      }
    }

    .val {
      flex: 1;
      min-height: 46px;
      background: #fff;
      padding: 3px 0;
      display: flex;
      align-items: center;
    }

    .sort-box {
      height: 40px;
      height: auto;

      display: flex;
      font-size: 14px;
      font-family: Roboto, Roboto;
      font-size: 14px;
      color: #545454;

      .item {
        .flex-center();
        padding: 2px 12px;
        width: fit-content;
        text-align: center;
        cursor: pointer;

        -webkit-user-select: none;
        -moz-user-select: none;
        -o-user-select: none;
        user-select: none;

        &.active {
          // background: @theme;
          // color: #fff;
          color: #A76737;
        }

        .text {
        }

        .sanjiao-box {
          margin-left: 5px;

          .top {
            border: 5px solid;
            border-color: transparent;
            border-bottom-color: #AAA;

            &.active {
              border-bottom-color: @theme;
            }
          }

          .bottom {
            margin-top: 2px;
            border: 5px solid;
            border-color: transparent;
            border-top-color: #AAA;

            &.active {
              border-top-color: @theme;
            }
          }
        }
      }
    }
  }

  .goods-wrap {
    padding: 15px 29px 29px 29px;
    background-color: #fff;
  }

  .product-list {
    flex-wrap: wrap;

    .product-item {
      width: 217px;
      height: 299px;
      background: #FFFFFF;
      border-radius: 8px 8px 8px 8px;
      border: 1px solid #EBEBEB;
      cursor: pointer;
      flex-direction: column;
      padding: 15px;
      margin-bottom: 20px;
      margin-right: 14px;

      &:hover {
        .title {
          color: @theme !important;
        }
      }

      .poster-box {
        width: 160px;
        height: 160px;

        .poster {
          width: 160px;
          height: 160px;
        }
      }

      .info-box {
        width: 160px;
        margin-top: 10px;

        .title {
          font-family: Roboto, Roboto;
          font-weight: 400;
          font-size: 16px;
          color: #3D4248;
          font-style: normal;
          text-transform: none;
        }

        .pirce-box {
          margin-top: 15px;

          .price-info {
            .price-1 {
              font-family: Roboto, Roboto;
              font-weight: 400;
              font-size: 14px;
              color: #FF4000;
            }
          }

          .cart-box {
            width: 32px;
            height: 32px;

            img {
              width: 32px;
              height: 32px;
            }
          }
        }
      }
    }

    .product-item:nth-child(5n) {
      margin-right: 0;
    }
  }
}
</style>
