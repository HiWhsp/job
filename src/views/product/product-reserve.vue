<template>
  <div class="page">
    <div class="top-banner">
      <div class="title">预约商品</div>
      <div class="box">
        <div class="item" v-for="item in vuexTreeCates[2].channels" :key="item.id">
          <div class="text">{{ item.title }}</div>
          <div class="desc">{{ item.num }} 产品</div>
        </div>
      </div>
    </div>
    <div class="inner">
      <pageBreadcrumb :option="nav_option" />
      <div class="page-ctx w-1200 flex">
        <div class="aside">
          <!-- 侧边栏 -->
          <div class="search">
            <p>搜索</p>
            <el-input placeholder="Search Here" v-model="keyword" class="input-with-select">
              <el-button slot="append" icon="el-icon-search" @click="doSearch()"></el-button>
            </el-input>
          </div>
          <el-aside width="260px" class="sidebar">
            <el-tree
                ref="tree"
                :data="vuexTreeCates[2].channels"
                node-key="id"
                @node-click="menuSelect"
                :props="defaultProps"
                highlight-current
                accordion
            >
              <span slot-scope="{ node, data }">
                <span style="font-size: 16px;">{{ data.title }}({{ data.num }})</span>
              </span>
            </el-tree>
          </el-aside>
        </div>
        <div class="prod-wrap">
          <div class="product-wrap">
            <productReserveList :list="product_list" />
            <el-empty v-if="!count" description="没有查询到产品信息..."></el-empty>
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

import {mapState} from "vuex";
import productReserveList from "@/components/product/productReserveList.vue";

export default {
  name: "category",
  components: {
    pageBreadcrumb,
    productReserveList
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
      defaultProps: {
        children: "channels",
        label: "title",
      },
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
    ...mapState(["vuexTreeCates"]),
    nav_option() {
      let channelId_arr = this.$route.query.ids ? this.$route.query.ids.split(',') : []
      let channelId = channelId_arr.pop()
      console.log(channelId)

      let cate_info = this.vuexTreeCates.find(v => v.id == channelId) || {}

      let option = [
        {route: '/product-cates', title: '产品展示'},
        {route: '', title: cate_info.title || ''}
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

    doSearch() {
      this.pagination.page = 1;
      this.query_product();
    },

    menuSelect(index) {
      if (this.vuexTreeCates.length != 0) {
        // 判断是数字还是对象
        if (typeof index == 'object') {
          this.selectItem = index;
        } else {
          // 递归循环vuexTreeCates 通过index找到指定内容
          this.selectItem = findById(this.vuexTreeCates, +index);
          this.$refs.tree.setCurrentNode(this.selectItem);
        }

        function findById(data, id) {
          for (const item of data) {
            if (item.id === id) {
              return item; // 找到目标内容，直接返回
            }
            if (item.children && item.children.length > 0) {
              const result = findById(item.children, id); // 递归查找子节点
              if (result) {
                return result; // 如果在子节点中找到，返回结果
              }
            }
          }
          return null; // 如果没有找到，返回 null
        }

        this.$router.push({path: '/product-reserve', query: {ids: this.selectItem.id}});
      }
    },

  },
};
</script>

<style scoped lang="less">
.page {
  background: #FFFFFF;
  text-align: left;

  .top-banner {
    background-image: url("~@/assets/image/productReserve.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    width: 100%;
    height: 280px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 36px 0;

    .title {
      font-weight: bold;
      font-size: 64px;
      color: #FFFFFF;
      letter-spacing: 10px;
      text-stroke: 1px rgba(0,0,0,0);
      text-align: center;
    }
    .box {
      display: flex;
      width: 900px;
      justify-content: space-between;
      .item {
        .text {
          font-weight: 500;
          font-size: 20px;
          color: #FFFFFF;
          text-align: left;
        }
        .desc {
          margin-top: 10px;
          font-weight: 400;
          font-size: 16px;
          color: #D1D1D1;
        }
      }
    }
  }

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

        .sidebar {
          /deep/ .el-tree {
            background-color: #000;
          }
          /deep/ .el-tree-node {
            border-bottom: 1px solid #ccc;
            margin: 10px 0;
            padding-bottom: 10px;
          }
          /deep/ .el-tree-node.is-current {
            color: #fff;
          }

          /deep/ .el-tree-node__children {
            border-left: 1px solid #ccc;
            margin: 15px 0 15px 10px;
            padding-left: 20px;

            .el-tree-node {
              margin: 0;
              border-bottom: none;
            }
          }

          /deep/ .el-tree-node__content {
            height: 50px;
            background-color: #000;
          }

          /deep/ .el-tree-node__content:hover {
            color: #fff;
          }

          ///deep/ .el-tree-node__expand-icon {
          //  display: none;
          //}
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
            color: #fff;
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
