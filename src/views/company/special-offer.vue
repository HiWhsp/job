<template>
  <div class="page">
    <div class="inner">
      <!--      <pageBreadcrumb :option="nav_option" />-->

      <div class="page-ctx w-1400 flex">
        <div class="aside">
          <h2 class="title">比例模型产品</h2>
          <!-- 侧边栏 -->
          <el-aside width="360px" class="sidebar">
            <el-tree
                ref="tree"
                :data="[vuexTreeCates[1]]"
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
          <div class="bread-box">
            <!--            <router-link to="/">首页</router-link>-->
            <template v-if="nav_option[0]">
              <!--              <span class="bread-divider">&gt;</span>-->
              <a href="javascript:void(0)" @click="toBread(list_bread[0].route)">{{ nav_option[0].title }}</a>
            </template>
            <template v-if="nav_option[1].title">
              <span class="bread-divider">&gt;</span>
              <a href="javascript:void(0)" @click="toBread(nav_option[1].route)">{{ nav_option[1].title }}</a>
            </template>
          </div>

          <div class="product-wrap">
            <productList :list="product_list"/>
            <el-empty v-if="!product_list.length" description="没有查询到产品信息..."></el-empty>
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
      defaultProps: {
        children: "channels",
        label: "title",
      },
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
        {route: '/product-cates', title: '特价商品'},
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

        this.$router.push({path: '/special-offer', query: {ids: this.selectItem.id}});
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

    .page-ctx {
      padding-top: 32px;
      align-items: start;

      .title {
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: 700;
        font-size: 18px;
        color: #000000;
      }

      .title::after {
        content: '';
        display: block;
        width: 100%;
        height: 2px;
        background: #000;
        margin-top: 10px;
      }

      .aside {
        width: 360px;
        margin-right: 32px;
        height: 100%;

        .sidebar {
          /deep/ .el-tree-node {
            border-bottom: 1px solid #ccc;
            margin: 10px 0;
            padding-bottom: 10px;
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
            color: #000;
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
            color: #000;
          }

          /deep/ .el-input-group__append {
            border: none;
          }
        }
      }

      .prod-wrap {
        flex: 1;

        .bread-box {
          margin-bottom: 20px;
          height: 42px;
          background: #F4F4F4;
          line-height: 42px;
          padding: 0 18px;
          font-size: 20px;
          color: #000;

          a {
            color: #000;
          }

          span {
            margin: 0 5px;
          }
        }
      }
    }
  }
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


<style scoped lang="less" src="@/assets/h5css/mobile/product-cates.less"></style>
