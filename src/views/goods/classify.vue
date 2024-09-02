<template>
  <div class="wrap">
    <div class="inner-content">
      <div class="inner">
        <!-- 面包屑导航 -->
        <!-- <breadCrumb /> -->

        <!-- 筛选条件 -->
        <div class="filter-wrap" v-if="false">
          <div class="filter-box" v-if="curr_channel.channels && curr_channel.channels.length">
            <div class="more-filter" v-show="is_expand">
              <div class="filter-item" v-for="(item, index) in curr_channel.channels" :key="index">
                <div class="title">{{ item.title }}</div>
                <div class="items">
                  <div class="item" v-for="(ciji, index) in item.channels" :key="index" @click="click_filter_item(ciji)">
                    <span :class="filter_item.id == ciji.id ? 'active' : ''">{{ ciji.title }}</span>
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
          <!-- 分类列表 -->
          <div class="fenlei-box" v-if="curr_channel.channels && curr_channel.channels.length">
            <div class="filter-box">
              <div class="more-filter">
                <div class="filter-item">
                  <div class="title">分类</div>
                  <div class="items">
                    <div class="item" @click="click_filter_item({ id: '', title: '全部' })" :class="filter_item.id == '' ? 'active' : ''">
                      <span>全部</span>
                    </div>

                    <div class="item" v-for="(item, index) in curr_channel.channels" :key="index" @click="click_filter_item(item)" :class="filter_item.id == item.id ? 'active' : ''">
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

          <listGood :list_goods="list_goods" />

          <div v-if="list_goods.length" class="pagination-box" style="margin-top: 80px">
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="pagination.page" :page-size="pagination.pageNum" layout="total, prev, pager, next" :total="count"></el-pagination>
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
import listGood from "@/components/goods/listGood.vue"; //商品列表

export default {
  name: "classify",
  components: {
    goodSort,
    listGood,
  },

  data() {
    return {
      is_expand: true, //是否展开
      list_goods: [],
      pagination: {
        page: 1,
        pageNum: 40,
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
    ...mapState(["list_channel", "list_brand"]),

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
/deep/ .section-title {
  padding: 60px 0;
}

.wrap {
  background: #fff;
  .inner {
    padding-top: 0;
    padding-bottom: 80px;
    width: @width;
    margin: 0 auto;
  }
}

.section {
  padding-top: 20px;
  width: @width;

  .paixu-box {
    .flex-between();
    margin-bottom: 20px;
    background: #f9f9f9;

    .left {
    }
    .right {
    }
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

      .item {
        text-align: center;
        min-width: 70px;
        height: 26px;
        line-height: 26px;

        padding-left: 15px;
        padding-right: 15px;
        margin-right: 30px;
        font-size: 13px;
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
</style>
