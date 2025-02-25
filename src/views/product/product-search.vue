<template>
  <div class="page">
    <div class="inner">

      <div class="search-title w-1400">
        <p>所有产品 > <span>搜索 "{{ keyword }}"</span></p>
        <span class="count">检索到 <span>{{ count }}</span> 条结果</span></div>
      <div class="page-ctx w-1400 flex">
        <div class="prod-wrap">
          <div class="product-wrap">
            <div class="product-list flex">
              <div class="product-item" v-for="(item, index) in product_list" :key="index">
                <div class="product-item-info">
                  <div class="img-box" @click="to_product(item)">
                    <img :src="item.thumb" class="product-img"/>
                    <!-- <shouqing :kucun="goods.kucun" /> -->
                  </div>
                  <div class="info-box">
                    <div class="title ellipsis-2">
                      {{ item.title }}
                      <div class="hot">限量50台</div>
                      <div class="hot">限购2台</div>
                    </div>

                    <div class="price-box">
                      <div class="sale">
                        <span class="huobi">CN {{ vuex_huobi }} </span>
                        <span class="value"> {{ item.priceSale }} </span>
                      </div>
                      <div class="market">
                        <img src="@/assets/image/product/like.png" alt="">
                        <img src="@/assets/image/product/cartAdd.png" alt="">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="pagination-box" v-if="count" style="margin-top: 50px;">
            <el-pagination background layout="prev, pager, next" :total="count" :current-page="pagination.page"
                           :page-size="pagination.pageNum" @current-change="mix_current_change"></el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import pageBreadcrumb from '@/components/page/page-breadcrumb.vue'
import productList from "@/components/product/productList.vue"; //

import {mapState} from "vuex";

export default {
  name: "category",
  components: {
    pageBreadcrumb,
    productList
  },
  data() {
    return {
      keyword: '',
      defaultActive: '',
      product_list: [],
      pagination: {
        page: 1,
        pageNum: 16,
      },
      count: 0,

      //
      id: this.$route.query.id || "",
      useCache: false, // 是否使用缓存

      select_level_1: {}, //所选1级分类
      list_channel: [],
      list_goods: [],
      pages: 1,

      //排序方向 填写 desc 或者 asc 排序字段 填写 字段名称 比如时间就是createTime  阅读量就是 hits
      isAsc: "", //升asc 降序desc
      orderByColumn: "ordering", //选择的排序方式
      sortList: [
        {title: "销量", ziduan: "orders"},
        {title: "价格", ziduan: "priceSale"},
        {title: "综合", ziduan: "ordering"},
      ],
    };
  },
  computed: {
    ...mapState(["vuexFlatCates"]),
    nav_option() {
      let channelId_arr = this.$route.query.ids ? this.$route.query.ids.split('-') : []
      let channelId = channelId_arr.pop()
      console.log(channelId)

      let cate_info = this.vuexFlatCates.find(v => v.id == channelId) || {}

      let option = [
        {route: '/product-cates', title: '产品展示'},
        {route: '', title: cate_info.title || ''}
      ]
      return option
    },
  },

  watch: {
    '$route'() {
      this.pagination.page = 1;
      this.setView()
    }
  },
  created() {
    this.setView();
  },
  methods: {
    async setView() {
      this.keyword = this.$route.query.keyword;
      this.defaultActive = this.$route.fullPath
      this.query_product();
    },
    query_product() {
      let channelId_arr = this.$route.query.ids ? this.$route.query.ids.split('-') : []
      let channelId = channelId_arr.pop()
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "product_plist",
          ifShowSku: 1,
          channelId: channelId,
          keyword: this.keyword,
          // page: 1,
          // pageNum: 8,
          ...this.pagination
        },
      }).then((res) => {
        let {code, data, count} = res;
        if (code == 200) {
          let {list, count, pages} = data;
          this.product_list = list;
          this.count = count;
        }
      });
    },

    toDetail(item) {
      this.$router.push(`/product-detail?id=${item.inventoryId}`)
    },

    changePage(page) {
      this.pagination.page = page;
      this.query_product();
    },

    to_product(item) {
      this.$router.push({
        path: "/product-detail",
        query: {
          id: item.inventoryId,
        },
      });
    },
    do_toggle_check(item) {
      this.$emit('toggle_check', item)
    }
  },
};
</script>

<style scoped lang="less">
.page {
  background: #FFFFFF;
  text-align: left;

  .inner {
    padding-bottom: 100px;

    .search-title {
      display: flex;
      justify-content: space-between;
      margin-top: 40px;
      padding: 0 26px;
      height: 42px;
      line-height: 42px;
      background: #F4F4F4;

      p {
        font-size: 20px;
        color: #838383;

        span {
          color: #000;
        }
      }

      .count {
        font-weight: 400;
        font-size: 12px;
        color: #000000;
      }
    }

    .page-ctx {
      padding-top: 30px;
      align-items: start;

      .aside {
        width: 260px;
        margin-right: 32px;
        height: 100%;

        .el-menu {
          background-color: #000000;
          border: none;
          padding-bottom: 10px;

          /deep/ .el-submenu__title {
            color: #fff;
          }

          /deep/ .el-submenu__title:hover {
            background-color: #000000;
          }

          /deep/ .el-menu-item {
            color: #fff;
            border-top: 1px dashed #ffffff;
          }

          /deep/ .el-menu-item:last-child {
            border-bottom: 1px dashed #ffffff;
          }

          /deep/ .el-menu-item.is-active {
            color: #FF2727;
            background-color: #000000;
          }

          /deep/ .el-menu-item:hover {
            background-color: #000000;
          }

          .menu-item-one {
            padding-left: 0 !important;

            /deep/ .el-submenu__title {
              padding-left: 0px !important;
            }
          }

          .menu-item-one, .menu-item-one.is-active {
            border: none;
          }

          .menu-item-one:last-child {
            border-bottom: none;
          }
        }

        .search {
          margin-bottom: 25px;

          p {
            font-weight: 500;
            font-size: 16px;
            color: #FFFFFF;
            line-height: 18px;
            text-align: left;
            font-style: normal;
            text-transform: none;
            margin-bottom: 10px;
          }

          /deep/ .el-input__inner {
            background: #666666;
            border-color: #666666;
          }

          /deep/ .el-button {
            width: 58px;
            height: 40px;
            background: #DF1626;
            border-radius: 0px 0px 0px 0px;
            color: #fff;
          }

          /deep/ .el-input-group__append {
            border: none;
          }
        }
      }

      .prod-wrap {
        flex: 1;
      }
    }
  }
}

/deep/ .el-menu {
  background-color: #000000;
  border: none;
}

.filter-box {
  border: 1px solid #ddd;

  .filter-item {
    display: flex;
    align-items: flex-start;
    border-bottom: 1px solid #ddd;

    &:last-child {
      border-bottom: none;
    }

    .label {
      background: #F8F8F8;
      width: 164px;
      height: 46px;
      line-height: 46px;
      padding-right: 30px;
      text-align: right;
    }

    .val {
      flex: 1;
      min-height: 46px;
      background: #fff;
      padding: 3px 24px;
      display: flex;
      align-items: center;
    }
  }


  .cate-box {
    display: flex;

    .cate-item {
      margin-right: 20px;
      font-weight: 400;
      font-size: 14px;
      color: #545454;
      border-radius: 2px 2px 2px 2px;
      padding: 2px 12px;
      font-size: 14px;
      color: #545454;
      cursor: pointer;

      &.active {
        background: #A76737;
        color: #fff;
      }

    }
  }


  .sort-box {
    height: 40px;
    height: auto;

    display: flex;
    font-size: 14px;
    font-family: Microsoft YaHei;
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
        // background: #F74747;
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
            border-bottom-color: #F74747;
          }
        }

        .bottom {
          margin-top: 2px;
          border: 5px solid;
          border-color: transparent;
          border-top-color: #AAA;

          &.active {
            border-top-color: #F74747;
          }
        }
      }
    }
  }
}

.page-title {
  margin-top: 20px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 42px;
  padding: 0 20px;
  background: #fff;

  .title-text {
    font-size: 16px;
    color: #333333;
  }

  .title-act {
    display: flex;
    align-items: center;

    .text-1 {
      font-size: 14px;
      color: #333333;

      .num {
        color: #A76737
      }
    }

    .pagi-box {
      margin-left: 20px;
      margin-right: 10px;
      font-size: 14px;
      color: #333333;

      .num {
        color: #A76737
      }
    }

    .arrow-box {
      display: flex;
      align-items: center;
      cursor: pointer;

      img {
        width: 24px;
      }
    }
  }
}

.product-list {
  flex-wrap: wrap;

  .product-item {
    position: relative;
    width: 326px;
    height: 346px;
    margin-right: 32px;
    margin-bottom: 22px;
    text-align: center;
    overflow: hidden;
    cursor: pointer;
    border: 1px solid rgba(0, 0, 0, 0.1);
    background: #FFFFFF;

    &:nth-child(4n) {
      margin-right: 0;
    }


    &:hover {
      .img-box {
        img {
          transform: scale(1.1);
        }
      }
    }

    .img-box {
      width: 100%;
      height: 217px;
      padding-bottom: 23px;
      margin: 0 auto;
      overflow: hidden;
      position: relative;

      img {
        width: 100%;
        height: 296px;
        object-fit: cover;
        transition: 0.3s;
      }
    }

    .info-box {
      width: 100%;
      height: 120px;
      padding: 15px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .title {
        text-align: left;
        width: 100%;
        font-family: Poppins, Poppins;
        font-weight: 600;
        font-size: 16px;
        color: #000;

        .hot {
          text-align: center;
          background-image: url("~@/assets/image/product/hot.png");
          background-repeat: no-repeat;
          background-size: 100% 100%;
          width: 63px;
          height: 18px;
          line-height: 18px;
          display: inline-block;
          font-size: 12px;
          color: #fff;
          font-weight: 400;
        }
      }


      .price-box {
        margin-top: 5px;
        display: flex;
        justify-content: space-between;

        .sale {
          span {
            font-family: OPPOSans, OPPOSans;
            font-weight: bold;
            font-size: 18px;
            color: #000;
          }

        }

        .market {
          img {
            width: 21px;
          }

          img:first-child {
            margin-right: 30px;
          }
        }
      }

      .sku-box {
        min-height: 50px;
        margin-top: 8px;
        flex-wrap: wrap;

        .sku-item {
          position: relative;
          padding: 4px 0;
          width: 50%;
          text-align: center;
          font-family: Arial, Arial;
          font-weight: 400;
          font-size: 12px;
          color: #444444;

          &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            width: 0px;
            height: 1px;
            transform: translate(-50%);
            background: #ccc;
          }

          &:hover {
            &::after {
              width: 40px;
            }
          }
        }
      }

      .btn-box {
        margin-top: 20px;

        .btn-cart {
          width: 226px;
          width: 100%;
          height: 27px;
          border-radius: 0px 0px 0px 0px;
          border: 1px solid #F74747;
          font-family: OPPOSans, OPPOSans;
          font-weight: bold;
          font-size: 12px;
          color: #F74747;

          &:hover {
            background: #F74747;
            color: #fff;
          }
        }
      }
    }
  }
}
</style>
<style scoped lang="less" src="@/assets/h5css/mobile/product-cates.less"></style>
