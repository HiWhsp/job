<template>
  <div class="wrap">
    <div class="inner-content">
      <div class="inner">
        <!-- 面包屑导航 -->
        <!-- <breadCrumb /> -->

        <!-- 筛选条件 -->
        <div class="filter-wrap" v-if="false">
          <div
            class="filter-box"
            v-if="curr_channel.channels && curr_channel.channels.length"
          >
            <div class="more-filter" v-show="is_expand">
              <div
                class="filter-item"
                v-for="(item, index) in curr_channel.channels"
                :key="index"
              >
                <div class="title">{{ item.title }}</div>
                <div class="items">
                  <div
                    class="item"
                    v-for="(ciji, index) in item.channels"
                    :key="index"
                    @click="click_filter_item(ciji)"
                  >
                    <span :class="filter_item.id == ciji.id ? 'active' : ''">{{
                      ciji.title
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- <div class="filter-toggle">
            <span class="toggle-more" @click="toggle_expand">
              {{ is_expand ? "收起" : "展开" }}更多筛选
              <i
                :class="is_expand ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
              ></i>
            </span>
          </div> -->

          <!-- <div class="filter-checked-box">
            <el-tag
              v-for="tag in tags"
              :key="tag.name"
              closable
              effect="plain"
              type="danger"
              size="medium"
              @close="cancel_filter(tag)"
              >{{ tag.name || tag.title }}</el-tag
            >
          </div> -->

          <div class="other">
            <goodSort />
          </div>
        </div>

        <!-- 列表 -->
        <div class="section">
          <div class="search-box">
            <div class="search-inner">
              <!-- <input type="text" placeholder="请输入搜索关键词" v-model="keyword" @keyup.enter="on_search_keyword" /> -->
              <el-input
                placeholder="请输入搜索关键词"
                v-model="keyword"
                clearable
                @keyup.enter="on_search_keyword"
              >
              </el-input>
              <button class="btn-search" @click="search_result">搜索</button>
            </div>
            <!-- <div class="search-tip">按Enter键进行搜索，多个关键词用空格相隔</div> -->
          </div>

          <!-- 分类列表 -->
          <div class="fenlei-box">
            <div class="filter-box">
              <div class="more-filter">
                <div class="filter-item">
                  <div class="title">分类</div>
                  <div class="items">
                    <div
                      class="item"
                      @click="click_filter_item({ id: '', title: '全部' })"
                      :class="filter_item.id == '' ? 'active' : ''"
                    >
                      <span>全部</span>
                    </div>

                    <div
                      class="item"
                      v-for="(item, index) in list_channel"
                      :key="index"
                      @click="click_filter_item(item)"
                      :class="filter_item.id == item.id ? 'active' : ''"
                    >
                      <span>{{ item.title }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 排序 -->
          <div class="paixu-box">
            <div class="left"><goodSort /></div>
            <div class="right"></div>
          </div>

          <div class="goods-wrap">
            <div class="goods-list">
              <router-link
                :to="`/product-detail/${item.skuId || item.inventoryId}`"
                class="goods-item scale-wrap"
                v-for="(item, index) in list_goods"
                :key="index"
              >
                <div class="img-box cover scale-inner">
                  <img :src="item.img" alt="" class="scale-target" />
                </div>
                <div class="info-box">
                  <div class="title">{{ item.title }}</div>
                  <div class="price">{{vuex_huobi}} {{ item.priceSale }}</div>
                </div>
              </router-link>
            </div>
          </div>

          <div v-if="list_goods.length" class="pagination-box" style="margin-top: 80px">
            <el-pagination
              background
              @current-change="handleCurrentChange"
              :current-page.sync="pagination.page"
              :page-size="pagination.pageNum"
              layout="total, prev, pager, next"
              :total="count"
            ></el-pagination>
          </div>

          <el-empty v-if="!list_goods.length" description="商品列表为空..."></el-empty>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Loading } from "element-ui";

import { mapState } from "vuex";

import goodSort from "@/components/goods/goodSort.vue"; //排序

export default {
  name: "classify",
  components: {
    goodSort,
  },

  data() {
    return {
      keyword: this.$route.query.keyword || "",
      is_expand: true, //是否展开
      list_goods: [],
      pagination: {
        page: 1,
        pageNum: 10,
      },
      count: 0,

      filter_brand: {}, //品牌参数
      filter_item: {
        id: "",
      }, //筛选参数
      orderParams: {}, //排序参数
    };
  },
  computed: {
    ...mapState(["list_channel", "list_brand", "store_keyword"]),

    //当前分类
    curr_channel() {
      let obj = {};
      if (this.$route.query.id && this.list_channel && this.list_channel.length) {
        obj = this.list_channel.find((v) => v.id == this.$route.query.id);
      }

      if (!obj.id) {
        obj = this.list_channel[0];
      }

      return obj;
    },

    //所有选择的筛选项目
    tags() {
      let arr = [];
      if (this.filter_brand && this.filter_brand.id) {
        arr.push({
          ...this.filter_brand,
          type: "brand", //
        });
      }

      if (this.filter_item && this.filter_item.id) {
        arr.push({
          ...this.filter_item,
          type: "cate", //分类
        });
      }

      return arr;
    },
  },

  watch: {
    filter_brand(val, val_prev) {
      this.query_list();
    },
    filter_item(val, val_prev) {
      this.query_list();
    },
    store_keyword(val, prev) {
      this.keyword = val.keyword;
      this.setView();
    },
  },

  beforeRouteUpdate(to, from, next) {
    //console.log("组件复用 from", from);
    //console.log("组件复用 to", to);

    next({
      query: to.query,
    });

    this.pagination.page = 1;
    this.query_list("no-filter");
  },

  created() {
    this.setView();
  },

  mounted() {},

  methods: {
    search_result() {
      this.pagination.page = 1;
      this.setView();
    },
    scrollTop() {
      document.documentElement.scrollTop = 0;
    },

    showLoading() {
      this.loadingImpl = Loading.service({ fullscreen: true });
    },
    hideLoading() {
      this.loadingImpl.close();
    },

    setView() {
      if (this.$route.query.sub_id) {
        this.filter_item = {
          id: this.$route.query.sub_id,
          title: this.$route.query.sub_title,
        };
      }

      this.query_list();
    },

    query_list() {
      this.showLoading();
      //console.log("当前分类channel_id", this.$route.query.id);
      this.$api("product_plist", {
        // channel_id: this.$route.query.id,
        ...this.pagination,
        ...this.getFilterParams(), //筛选参数
        ...this.orderParams, //排序参数
        brand_id: this.filter_brand.id || "",
        keyword: this.keyword,
      }).then((res) => {
        //console.log("商品", res);
        let { code, data, count } = res;
        if (code == 200) {
          this.list_goods = data;
          this.count = count;
        }
        this.hideLoading();
      });
    },

    getFilterParams() {
      // debugger
      let channel_id = this.filter_item.id || this.$route.query.id;

      return {
        channel_id,
      };
    },

    //筛选 品牌
    click_filter_brand(item) {
      //console.log({ ...item });
      this.filter_brand = item;
    },

    //点击筛选 分类
    click_filter_item(item) {
      //console.log("当前分类", { ...item });
      this.filter_item = item;
    },

    //取消筛选项目
    cancel_filter(item) {
      if (item.type == "brand") {
        this.filter_brand = {};
      } else if (item.type == "cate") {
        this.filter_item = {};
      }
    },

    //设置排序字段
    set_sortParams(params) {
      // //console.log('设置排序字段', {...params})
      this.orderParams = params;
      this.query_list();
    },

    //分页
    handleCurrentChange(page) {
      //console.log("页面变化", page);

      this.scrollTop();
      this.query_list();
    },

    //展开收起
    toggle_expand() {
      this.is_expand = !this.is_expand;
    },
  },
};
</script>

<style scoped lang="less">
.search-box {
  width: 800px;
  margin: 30px auto;

  .search-inner {
    .flex();
    height: 40px;
    line-height: 40px;
    border: 2px solid #4CA5E4;

    .btn-search {
      background: #4CA5E4;
      width: 120px;
      height: 100%;
      color: #fff;
      font-size: 14px;
      transition: 0.3s;
      &:hover {
        opacity: 0.8;
      }
    }

    input {
      flex: 2;
      background: transparent;
      // width: 100%;
      font-size: 14px;
      padding-left: 20px;
      border: none;
      outline: none;
      color: #000;
    }
    /deep/ input {
      flex: 2;
      background: transparent;
      // width: 100%;
      font-size: 14px;
      padding-left: 20px;
      border: none;
      outline: none;
      color: #000;
    }

    .search-tip {
      margin-top: 10px;
      text-align: right;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #666666;
    }
  }
}

/deep/ .section-title {
  padding: 60px 0;
}

.wrap {
  background: #fff;
  .inner {
    padding-top: 0;
    padding-bottom: 80px;
    width: 1250px;
    margin: 0 auto;
  }
}

.section {
  padding-top: 20px;
  width: 100%;

  .paixu-box {
    .flex-between();
    margin-bottom: 20px;
    background: #f9f9f9;
  }
}

// 分类
.fenlei-box {
  margin-bottom: 20px;
  min-height: 40px;
  border: 1px solid #eeeeee;

  .filter-item {
    height: auto;
    .flex-between();

    .title {
      align-self: stretch;
      width: 120px;
      line-height: 40px;
      background: #f9f9f9;
      font-size: 14px;
      font-weight: bold;
      color: #333333;
    }
    .items {
      .flex();
      flex-wrap: wrap;
      text-align: left;
      width: calc(100% - 120px);
      padding: 0 20px;
      min-height: 40px;
      line-height: 40px;
      border-bottom: 1px dashed #eee;
      font-size: 14px;

      .item {
        text-align: center;
        min-width: 70px;
        height: 26px;
        line-height: 26px;

        padding-left: 15px;
        padding-right: 15px;
        margin-right: 30px;
        font-size: 14px;
        color: #333333;
        user-select: none;
        cursor: pointer;
        border: 1px solid transparent;

        &:hover {
          color: #4CA5E4;
        }

        &.active {
          color: #4CA5E4;
          border: 1px solid #ff9312;

          background: url(~@img/other/fenlei-checked.png) no-repeat right bottom;
          background-size: 14px;
        }
      }
    }
  }
}

.filter-wrap {
  .filter-toggle {
    margin-top: 20px;
    span {
      cursor: pointer;
    }
  }
  .filter-box {
    border: 1px solid #eee;
    .filter-item {
      height: auto;
      .flex-between();

      .title {
        align-self: stretch;
        width: 120px;
        line-height: 40px;
        background: #f9f9f9;
        font-size: 14px;
        font-weight: bold;
        color: #333333;
      }
      .items {
        .flex();
        flex-wrap: wrap;
        text-align: left;
        width: calc(100% - 120px);
        padding: 0 20px;
        min-height: 40px;
        line-height: 40px;
        border-bottom: 1px dashed #eee;

        .item {
          min-width: 100px;
          text-align: left;
          font-size: 12px;
          color: #333333;
          user-select: none;

          span {
            cursor: pointer;
            &:hover {
              color: #4CA5E4;
            }

            &.active {
              color: #4CA5E4;
            }
          }
        }
      }
    }
  }

  .filter-checked-box {
    text-align: left;
    margin: 30px 0;

    .el-tag {
      margin-right: 10px;
    }
  }

  .other {
    .flex();
    height: 40px;
    background: #f9f9f9;
    border: 1px solid #eeeeee;

    .zonghe {
    }
  }
}

.goods-wrap {
  width: 100%;
  text-align: left;
  // 商品列表
  .goods-list {
    padding-top: 6px;
    width: 100%;
    margin: 0 auto;
    .flex();
    flex-wrap: wrap;
    .goods-item {
      width: 240px;
      padding: 6px;
      padding-bottom: 15px;
      margin-right: 12px;
      margin-bottom: 20px;
      transition: 0.3s;
      &:nth-child(5n) {
        margin-right: 0;
      }

      &:hover {
        box-shadow: 0px 3px 20px rgba(0, 0, 0, 0.32);
      }

      .img-box {
        width: 228px;
        height: 228px;
        img {
          width: 228px;
          height: 228px;
        }
      }

      .info-box {
        padding-top: 5px;
        .title {
          .ellipsis-2();
          height: 48px;
          font-size: 18px;
          font-family: Microsoft YaHei;
          font-weight: 400;

          color: #333333;
        }
        .price {
          text-align: left;
          margin-top: 15px;
          font-size: 16px;
          font-family: Microsoft YaHei;
          font-weight: bold;
          line-height: 16px;
          color: #4CA5E4;
        }
      }
    }
  }
}
</style>
