<template>
  <div class="page">
    <!-- <div class="bread-box">
      <router-link to="/">首页</router-link>
      <template v-if="list_bread[0]">
        <span class="bread-divider">&gt;</span>
        <a href="javascript:void(0)" @click="toBread(list_bread[0].route)">{{ list_bread[0].title }}</a>
      </template>
<template v-if="list_bread[1]">
        <span class="bread-divider">&gt;</span>
        <a href="javascript:void(0)" @click="toBread(list_bread[1].route)">{{ list_bread[1].title }}</a>
      </template>
</div> -->
    <div class="inner">
      <pageBreadcrumb :option="nav_option" />
      <!-- <div class="category-box filter-box">
        <div class="filter-item">
          <div class="label">
            石磨坊产品
          </div>
          <div class="val">
            <div class="cate-box">
              <div class="cate-item" v-for="(item, index) in vuexTreeCates" :key="index"
                :class="{ active: item.id == $route.query.ids }" @click="toCate(item)">{{ item.title }}</div>
            </div>
          </div>
        </div>
        <div class="filter-item">
          <div class="label">
            价格
          </div>
          <div class="val">
            <div class="cate-box">
              <div class="cate-item" v-for="(item, index) in list_price" :key="index"
                :class="{ active: item.id == select_level_1.id }" @click="toggleLevel(item)">{{ item.title }}</div>
            </div>
          </div>
        </div>
        <div class="filter-item">
          <div class="label">
            产品排序
          </div>
          <div class="val">
            <div class="sort-box">
              <div class="item" v-for="(item, index) in sortList" :key="index"
                :class="orderByColumn == item.ziduan ? 'active' : ''" @click="onClickSort(item)">
                <div class="text">{{ item.title }}</div>
                <div class="sanjiao-box" v-if="item.title != '综合'">
                  <div class="top" :class="orderByColumn == item.ziduan && isAsc == 'asc' ? 'active' : ''"></div>
                  <div class="bottom" :class="orderByColumn == item.ziduan && isAsc == 'desc' ? 'active' : ''"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> -->
      <!-- <div class="page-title">
        <div class="title-text">产品列表</div>
        <div class="title-act">
          <div class="text-1">
            共 <span class="num"> {{ count }}</span> 件商品
          </div>
          <div class="pagi-box">
            <span class="num">{{ pagination.page }}</span>/ {{ pages }}
          </div>
          <div class="arrow-box">
            <div class="arrow-left" @click="doPagePrev()">
              <img src="@img/arrow-left.png" alt="">
            </div>
            <div class="arrow-right" @click="doPageNext()">
              <img src="@img/arrow-right.png" alt="">
            </div>
          </div>
        </div>
      </div> -->
      <div class="page-ctx w-1400 flex">
        <div class="aside">
          <!-- 侧边栏 -->
          <div class="search">
            <p>搜索</p>
            <el-input placeholder="Search Here" v-model="keyword" class="input-with-select">
              <el-button slot="append" icon="el-icon-search" @click="doSearch()"></el-button>
            </el-input>
          </div>
          <el-aside width="260px" class="sidebar">
            <el-menu :default-active="defaultActive" :router="true">
              <template v-for="(item, index) in vuexFlatCates">
                <el-submenu :index="item.route" v-if="item.channels.length" class="menu-item-one">
                  <template #title>{{ item.title }}</template>
                  <el-menu-item :index="it.route" v-for="(it, i) in item.channels" :key="i">{{ it.title }}</el-menu-item>
                </el-submenu>
                <el-menu-item :index="item.route" v-else class="menu-item-one">
                  <span slot="title">{{ item.title }}</span>
                </el-menu-item>
              </template>
            </el-menu>
          </el-aside>
        </div>
        <div class="prod-wrap">
          <div class="product-wrap">
            <productList :list="product_list" />
          </div>

          <div class="pagination-box" v-if="count" style="margin-top: 50px;">
            <el-pagination background layout="prev, pager, next" :total="count" :current-page="pagination.page"
                           :page-size="pagination.pageNum" @current-change="mix_current_change"> </el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import pageBreadcrumb from '@/components/page/page-breadcrumb.vue'
import productList from "@/components/product/productList.vue"; //

import { mapState } from "vuex";

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
        { title: "销量", ziduan: "orders" },
        { title: "价格", ziduan: "priceSale" },
        { title: "综合", ziduan: "ordering" },
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
        { route : '/product-cates', title: '产品展示'},
        { route: '', title: cate_info.title || '' }
      ]
      console.log(option)
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
          // page: 1,
          // pageNum: 8,
          ...this.pagination
        },
      }).then((res) => {
        let { code, data, count } = res;
        if (code == 200) {
          let { list, count, pages } = data;
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

    doSearch() {

    },

    toCate(item) {
      this.$router.push(item.route)
    },

    //切换一级分类
    toggleLevel(item) {
      this.pagination.page = 1;

      this.select_level_1 = item;
      this.query_product();
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
        // orderByColumn: this.orderByColumn,
        // isAsc: this.isAsc,

        order1: this.orderByColumn,
        order2: this.orderByColumn != 'ordering' ? this.isAsc : '',
      };
      //console.log("排序参数", sortParams);

      this.$parent.set_sortParams(sortParams);
    },

    doPagePrev() {
      if (this.pagination.page > 1) {
        this.pagination.page--

        this.query_product();
      }
    },
    doPageNext() {
      if (this.pagination.page < this.pages) {
        this.pagination.page++
        this.query_product();
      }
    },

  },
};
</script>

<style scoped lang="less">
.page {
  background: #FFFFFF;
  text-align: left;

  .inner {
    padding-bottom: 100px;
    background-color: #000000;

    .page-ctx {
      padding-top: 32px;
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
            padding-left: 0!important;
            /deep/ .el-submenu__title {
              padding-left: 0px!important;
            }
          }
          .menu-item-one,.menu-item-one.is-active {
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

      .text {}

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
  display: flex;
  flex-wrap: wrap;

  .product-item {
    margin-right: 16px;
    margin-top: 16px;
    width: 220px;
    height: 349px;
    background: #FFFFFF;
    cursor: pointer;

    &:nth-child(6n) {
      margin-right: 0;
    }

    &:nth-child(-n + 6) {
      margin-top: 0;
    }

    &:hover {
      .title {
        color: #F74747 !important;
      }

    }

    .poster-box {
      width: 220px;
      height: 220px;

      .poster {
        width: 220px;
        height: 220px;
      }
    }

    .info-box {
      padding: 13px 15px 0;

      .title {
         white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
        font-weight: 400;
        font-size: 14px;
        color: #333333;
      }

      .pirce-box {
        margin-top: 15px;
          display: flex;
  align-items: center;
  justify-content: space-between;

        .price-info {
            display: flex;
  align-items: center;

          .price-1 {
            margin-right: 10px;
            font-family: Arial, Arial;
            font-weight: 400;
            font-size: 16px;
            color: #FF3A30;
          }

          .price-2 {
            text-decoration: line-through;
            font-family: PingFang SC, PingFang SC;
            font-weight: 400;
            font-size: 14px;
            color: #999999;
          }
        }

        .yishou {
          font-weight: 400;
          font-size: 12px;
          color: #999999;
        }
      }


      .act-box {
        margin-top: 15px;
        border-top: 1px solid #ddd;
        padding-top: 5px;
          display: flex;
  align-items: center;
  justify-content: space-between;

        .fav-box {
          .flex-center();
          width: fit-content;
          height: 32px;

          img {
            margin-right: 5px;
            width: 18px;
            height: 18px;
          }
        }

        .cart-box {
          .flex-center();
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
}
</style>


<style scoped lang="less" src="@/assets/h5css/mobile/product-cates.less"></style>
