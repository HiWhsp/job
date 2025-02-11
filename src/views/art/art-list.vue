<template>
  <div class="page">
    <div class="top-banner">
      <div class="title">工艺鉴赏</div>
    </div>
    <div class="inner">
      <pageBreadcrumb :option="nav_option" />
      <div class="page-ctx w-1200 flex">
        <div class="prod-wrap">
          <div class="product-wrap">
            <div class="product-item" v-for="(item, index) in product_list" :key="index" @click="toDetail(item)">
              <div class="box-image">
                <div class="img-box">
                  <img :src="item.thumb" alt />
                </div>
              </div>
              <div class="box-title ellipsis-1">
                <div class="title">{{ item.title }}</div>
              </div>
              <div class="box-price">
                <div class="price">{{ item.subtitle }}</div>
              </div>
            </div>
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

export default {
  name: "artList",
  components: {
    pageBreadcrumb
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
      this.$router.push(`/art_detail?id=${item.inventoryId}`)
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

  .top-banner {
    background-image: url("~@/assets/image/art.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    width: 100%;
    height: 280px;
    display: flex;
    flex-direction: column;
    justify-content: center;
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
  }

  .inner {
    padding-bottom: 100px;
    background-color: #000000;

    .page-ctx {
      padding-top: 32px;
      align-items: start;

      .prod-wrap {
        .product-wrap {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;

          .product-item {
            width: 285px;
            height: 302px;
            background: #1F1C1F;
            margin-bottom: 20px;

            .box-image {
              width: 100%;
              height: 190px;
              overflow: hidden;
              .img-box {
                width: 100%;
                height: 100%;
                img {
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
                }
              }
            }

            .box-title {
              padding: 16px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              .title {
                font-size: 16px;
                color: #FFFFFF;
              }
            }

            .box-price {
              padding: 0 16px 16px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              .price {
                font-size: 14px;
                color: #BEBEBE;
              }
            }
          }
        }
      }
    }
  }
}
</style>
