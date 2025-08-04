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

    <div class="inner w-1400">
      <!-- <pageBreadcrumb :option="nav_option" /> -->

      <div class="bread-box">
        <div class="bread-inner flex w-1400">
          <router-link to="/"> 首页 </router-link>

          <div
            class="bread-item"
            v-for="(item, index) in bread_list"
            :key="index"
          >
            <span class="arrow">></span>
            <template v-if="item">
              <a
                v-if="item && !item.route"
                class="link"
                href="javascript: void(0)"
                >{{ item.title }}</a
              >
              <router-link
                v-else-if="item && item.route"
                :to="item.route"
                class="route-link"
                >{{ item.title }}</router-link
              >
            </template>
          </div>

          <div class="bread-item search-item" v-if="keyword">
            <span class="arrow">></span>
            <span class="search">搜索：<span class="search-keyword">“{{ keyword }}”</span></span>
          </div>
        </div>
      </div>
      <div v-if="count === 0" class="empty-box">
        <div class="suggestion">
          <p class="suggest_word">
            您好，未能找到“{{keyword}}”相关商品，请更换关键词搜索。</p>
          <div class="flex">
            <p class="refresh" @click="$router.go(0)">重新生成</p>
            <p class="refresh" @click="cleanCate">重置筛选</p>
          </div>

        </div>
        <div class="recomm_goods">
          <p class="recomm_title">
            推荐您可能喜欢的商品
          </p>
          <div class="goods-list">
            <div class="good" v-for="(good) in recomm_list" @click="toDetail(good)">
              <img class="good_pic" :src="good.thumb" alt="">
              <div class="good_info">
                <p>{{ good.title }}</p>
                <p><span style="font-size: 14px !important;">￥&nbsp;</span>{{ vuex_is_login?good.priceUser:'---' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="category-box filter-box" v-if="product_list.length > 0">
        <!-- <div class="filter-item">
          <div class="label">分类</div>
          <div class="val">
            <div class="cate-box" :class="{'hidden-expand': !v1_is_expand}">
              <div
                class="cate-item hover-color"
                v-for="(item, index) in vuex_category_tree"
                :key="index"
                :class="{ active: item.id == $route.query.ids }"
                @click="toCate(item)"
              >
                {{ item.title }}
              </div>
            </div>
          </div>

          <div class="cate-acts flex">
            <div class="all-box flex hover-color" @click="do_toggle_all()">
              全部
              <img :class="{rotate: v1_is_expand}" src="@img/product/filter-arrow.png" alt="" />
            </div>
          </div>
        </div> -->

        <div
          class="filter-item"
          v-for="(group_cates, gindex) in group_options"
          :key="gindex"
        >
          <div class="label">{{ gindex == 0 ? "分类" : "" }}</div>
          <div class="val">
            <div
              class="cate-box"
              :class="{ 'hidden-expand': !cate_is_expand_list[gindex] }"
            >
              <div
                class="cate-item hover-color"
                v-for="(item, index) in group_cates"
                :key="index"
                :class="{ active: query_id_list.includes(item.id) }"
                @click="toCate(item)"
              >
                {{ item.title }}
              </div>
            </div>
          </div>

          <div class="cate-acts flex">
            <div
              class="all-box flex hover-color"
              @click="do_toggle_all(gindex)"
            >
              全部
              <img
                :class="{ rotate: cate_is_expand_list[gindex] }"
                src="@img/product/filter-arrow.png"
                alt=""
              />
            </div>
          </div>
        </div>

        <div class="filter-item">
          <div class="label">品牌</div>
          <div class="val">
            <div class="cate-box">
              <div
                class="cate-item"
                v-for="(item, index) in brand_list"
                :key="index"
                :class="{ active: item.id == brand_select.id }"
                @click="do_brand_toggle(item)"
              >
                {{ item.title }}
              </div>
            </div>
          </div>
        </div>
        <div class="filter-item">
          <div class="label">精确搜索</div>
          <div class="val">
            <div class="cate-box">
              <div
                  class="cate-item"
                  v-for="(item, index) in accurateSearchType"
                  :key="index"
                  :class="{ active: item.id == accurate_select.id }"
                  @click="do_accurate_toggle(item)"
              >
                {{ item.title }}
              </div>
            </div>
          </div>
        </div>
        <div class="filter-item">
          <div class="label">当前筛选</div>
          <div class="val">
            <div class="check-box">
              <div
                class="check-item"
                v-for="(item, index) in cate_select_list"
                :key="index"
              >
                <div class="check-title">
                  {{ item.title }}
                </div>
                <div class="remove-box" @click="do_remove_cate(item, index)">
                  <img src="@img/product/remove.png" alt="" />
                </div>
              </div>
              <div class="check-item" v-if="brand_select.title">
                <div class="check-title">
                  {{ brand_select.title }}
                </div>
                <div class="remove-box" @click="do_remove_brand()">
                  <img src="@img/product/remove.png" alt="" />
                </div>
              </div>
              <div class="check-item" v-if="accurate_select.title">
                <div class="check-title">
                  {{ accurate_select.title }}
                </div>
                <div class="remove-box" @click="do_remove_accurate()">
                  <img src="@img/product/remove.png" alt="" />
                </div>
              </div>
            </div>
          </div>

          <div class="check-acts flex">
            <div class="clear-box flex hover-color" @click="do_clear()">
              <img src="@img/product/clear.png" alt="" />
              清除所选
            </div>
          </div>
        </div>
      </div>

      <div class="category-box filter-box sort-wrap" v-if="product_list.length > 0" style="margin-top: 16px">
        <div class="filter-item">
          <!-- <div class="label">产品排序</div> -->
          <div class="val" style="padding: 0">
            <div class="sort-box">
              <div
                class="item"
                v-for="(item, index) in sort_list"
                :key="index"
                :class="{ active: sort_type == item.type }"
                @click="do_sort(item)"
              >
                <div class="text">{{ item.type }}</div>
                <div class="sanjiao-box" v-if="item.is_arrow">
                  <div
                    class="top"
                    :class="{
                      active: sort_type == item.type && isAsc == 'asc',
                    }"
                  ></div>
                  <div
                    class="bottom"
                    :class="{
                      active: sort_type == item.type && isAsc == 'desc',
                    }"
                  ></div>
                </div>
              </div>

              <div class="price-input-box flex">
                <input
                  v-model="searchMin"
                  type="number"
                  placeholder="最低价"
                  @blur="on_blur_price"
                />
                <span>-</span>
                <input
                  v-model="searchMax"
                  type="number"
                  placeholder="最高价"
                  @blur="on_blur_price"
                />
                <button class="btn">筛选</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="page-ctx">
        <div class="product-wrap">
          <productList :list="product_list" />
        </div>

        <div class="pagination-box" v-if="count" style="margin-top: 50px">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="count"
            :current-page="pagination.page"
            :page-size="pagination.pageNum"
            @current-change="mix_current_change"
          >
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import pageBreadcrumb from "@/components/page/page-breadcrumb.vue";
import productList from "@/components/product/productList.vue"; //

import { mapState } from "vuex";

export default {
  name: "category",
  components: {
    // pageBreadcrumb,
    productList,
  },
  data() {
    return {
      cate_is_expand_list: [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ],
      keyword: this.$route.query.keyword || '',

      product_list: [],
      pagination: {
        page: 1,
        pageNum: 16,
      },
      count: '',

      //
      id: this.$route.query.id || "",
      useCache: false, // 是否使用缓存

      select_level_1: {}, //所选1级分类
      list_channel: [],
      list_goods: [],
      pages: 1,

      //排序方向 填写 desc 或者 asc 排序字段 填写 字段名称 比如时间就是createTime  阅读量就是 hits
      isAsc: "", //升asc 降序desc
      sort_list: [
        { type: "综合排序", ziduan: "ordering", is_arrow: false },
        // { type: "人气排序", ziduan: "orders", is_arrow: false },
        { type: "销量排序", ziduan: "orders", is_arrow: false },
        { type: "价格排序", ziduan: "priceSale", is_arrow: true },
        // { type: "新品", ziduan: "xinpin", is_arrow: true },
      ],
      sort_type: "综合排序",

      brand_list: [],
      brand_select: {},

      searchMin: "",
      searchMax: "",
      recomm_list: "",
      accurateSearchType: [
        {title: '产品名称', id: 1},
        {title: '品牌', id: 2},
        {title: '产品编码', id: 3},
        {title: '目录映射码', id: 4}
      ],
      accurate_select: {}
    };
  },
  computed: {
    // ...mapState([""]),

    query_id_list() {
      let ids = this.$route.query.ids || "";
      let id_arr = ids.split("-").filter((v) => !!v);
      let list = id_arr.map((v) => +v);
      return list;
    },

    cate_select_list() {
      let option = [];
      let ids = this.$route.query.ids || "";
      let id_arr = ids.split("-").filter((v) => !!v);
      id_arr.forEach((id) => {
        let cate = this.vuex_category_flat.find((v) => v.id == id) || {};
        option.push(cate);
      });

      return option;
    },

    bread_list() {
      return this.cate_select_list;
    },

    group_options() {
      let list = [this.vuex_category_tree];
      if (this.cate_select_list.length) {
        this.cate_select_list.forEach((cate, cate_index) => {
          if (cate && cate.channels && cate.channels.length) {
            list.push(cate.channels);
          }
        });
      }
      return list;
    },
  },

  watch: {
    $route() {
      this.pagination.page = 1;
      this.setView();
    },
  },

  created() {
    this.query_brand();
    this.setView();
  },

  methods: {
    setView() {
      this.query_product();
    },
    query_product() {
      let channelId_arr = (this.$route.query.ids || "").split("-");
      let channelId = channelId_arr.pop() || "";

      let sort_params = {};
      if (this.sort_type == "综合排序") {
        sort_params = {
          orderType: 0,
        };
      } else if (this.sort_type == "销量") {
        sort_params = {
          orderType: 1,
        };
      } else if (this.sort_type == "价格") {
        if (this.isAsc == "asc") {
          //价格升序
          sort_params = {
            orderType: 2,
          };
        } else {
          sort_params = {
            orderType: 3,
          };
        }
      }
      let price_params = {};
      if (this.searchMin && this.searchMax && this.searchMax > this.searchMin) {
        price_params = {
          searchMin: this.searchMin,
          searchMax: this.searchMax,
        };
      }

      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "product_plist",
          channelId: channelId,
          ...this.pagination,
          ...sort_params,//排序：0-默认排序 1-销量排序 2-价格升序 3-价格降序
          ...price_params,
          brandId: this.brand_select.id,
          accurateType: this.accurate_select.id == 0? '' : this.accurate_select.id,
          keyword: this.keyword
        },
      }).then((res) => {
        let { code, data, count } = res;
        if (code == 200) {
          let { list, count, pages } = data;
          this.product_list = list;
          this.count = count;
          if (count === 0){
            this.getRecomm();
          }
        }
      });
    },

    query_brand() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "product_brandList",
        },
      }).then((res) => {
        if (res.code == 200) {
          this.brand_list = res.data;
        }
      });
    },

    do_toggle_all(index) {
      console.log("切换全部,", index);
      // this.v1_is_expand = !this.v1_is_expand;

      this.cate_is_expand_list.splice(
        index,
        1,
        !this.cate_is_expand_list[index]
      );
    },

    toCate(item) {
      this.$log("item", item);
      console.log(item)
      this.$router.push(item.route + '&keyword=' + this.keyword);
    },

    do_remove_cate(item, index) {
      console.log("index", index);
      this.$log("cate_select_list", this.cate_select_list);
      let prev_item = this.cate_select_list[index - 1];
      this.$log("prev_item", prev_item);
      if (prev_item) {
        this.$router.push(prev_item.route);
      } else {
        this.$router.push("/product-cates");
      }
    },

    do_clear() {
      this.$router.push("/product-cates");
      this.brand_select = {};
      this.setView();
    },

    do_brand_toggle(item) {
      this.brand_select = item;
      this.setView();
    },
    do_accurate_toggle(item) {
      this.accurate_select = item;
      this.setView();
    },
    do_remove_brand() {
      this.brand_select = {};
      this.setView();
    },
    do_remove_accurate() {
      this.accurate_select = {};
      this.setView();
    },
    cleanCate() {
      this.accurate_select = {};
      this.brand_select = {};
      window.location.replace(`/product-cates?keyword=${this.keyword}`)
    },
    toDetail(item) {
      this.$router.push(`/product-detail?id=${item.inventoryId}`);
    },

    //排序方式
    do_sort(item) {
      if (this.sort_type == item.type) {
        this.isAsc = this.isAsc == "asc" ? "desc" : "asc";
      } else {
        this.isAsc = "asc";
      }
      this.sort_type = item.type;
      this.setView();
    },

    on_blur_price() {
      if (this.searchMin && this.searchMax && this.searchMax > this.searchMin) {
        this.setView();
      }
    },
    getRecomm(){
      this.$api({
        url: '/service.php',
        method: 'get',
        data: {
          action: 'product_plist',
          // ifHot: 1,
          page: 1,
          pageNum: 6,
        }
      }).then((res) => {
        let { code, data, count } = res
        if (code == 200) {
          let { list, count, pages } = data
          this.recomm_list = list
          console.log(res.data)
        }
      })
    }
  },
};
</script>

<style scoped lang="less">
.page {
  background: #ffffff;
  text-align: left;

  .inner {
    padding-top: 0px;
    padding-bottom: 100px;

    .page-ctx {
      padding-top: 45px;
    }
  }
}

.bread-box {
  padding: 16px 0;

  .bread-inner {
    margin: 0 auto;
    a {
      display: inline-flex;
      align-items: center;

      font-family: OPPOSans, OPPOSans;
      font-size: 15px;
      color: #999999;

      img {
        margin-right: 10px;
      }
    }

    .link {
      font-family: OPPOSans, OPPOSans;
      font-size: 15px;
      color: #999999;
    }

    .route-link {
      font-family: OPPOSans, OPPOSans;
      font-size: 15px;
      color: #999999;
    }

    .arrow {
      margin: 0 6px;
      color: #aeaeae;
    }

    > *:last-child {
      font-family: OPPOSans, OPPOSans;
      font-size: 15px;
      color: #000000;
    }

    .search-item {
      color: #aeaeae;
    }
    .search-keyword{
      color: #3B64FC;
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
      background: #fafafa;
      align-self: stretch;
      // background: #f8f8f8;
      width: 113px;
      display: inline-flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 25px;

      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: 400;
      font-size: 16px;
      color: #333333;
    }

    .val {
      flex: 1;
      min-height: 46px;
      background: #fff;
      padding: 10px 24px;
      display: flex;
      align-items: center;
    }
  }

  .cate-box {
    display: flex;
    flex-wrap: wrap;

    &.hidden-expand {
      height: 28px;
      height: 32px;
      overflow: hidden;
    }

    .cate-item {
      margin: 4px 10px;
      font-weight: 400;
      font-size: 14px;
      color: #545454;
      border-radius: 2px 2px 2px 2px;
      padding: 2px 12px;
      font-size: 14px;
      color: #333;
      cursor: pointer;

      &.active {
        color: #3B64FC;
      }
    }
  }

  .check-box {
    display: flex;
    flex-wrap: wrap;

    .check-item {
      display: flex;
      justify-content: center;
      align-items: center;
      min-width: 30px;
      margin-right: 20px;
      border-radius: 15px 15px 15px 15px;
      background: #eef1fc;
      border: 1px solid #3B64FC;
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: 400;
      font-size: 13px;
      color: #3B64FC;
      padding: 0 14px;
      padding-right: 0;

      &.active {
        color: #3B64FC;
      }

      .check-title {
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: 400;
        font-size: 13px;
        color: #3B64FC;
      }
      .remove-box {
        cursor: pointer;
        margin-left: 2px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 30px;
        height: 30px;
        img {
          width: 10px;
        }
      }
    }
  }

  .check-acts {
    align-self: stretch;
    margin-right: 32px;
    margin-left: 32px;
    .clear-box {
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: 400;
      font-size: 14px;
      color: #6a6a6a;

      img {
        margin-right: 4px;
        width: 17.1px;
      }
    }
  }

  .cate-acts {
    align-self: stretch;
    margin-right: 32px;
    margin-left: 32px;
    .all-box {
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: 400;
      font-size: 14px;
      color: #3B64FC;

      img {
        margin-left: 6px;
        width: 15.46px;
        transition: 0.3s;

        &.rotate {
          transform: rotate(180deg);
        }
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
      display: flex;
      justify-content: center;
      align-items: center;
      height: 40px;
      min-width: 124px;
      border-right: 1px solid #eee;

      padding: 0;
      width: fit-content;
      text-align: center;
      cursor: pointer;

      -webkit-user-select: none;
      -moz-user-select: none;
      -o-user-select: none;
      user-select: none;

      &.active {
        .text {
          color: #3B64FC;
        }
      }

      .text {
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: 400;
        font-size: 14px;
        color: #333333;
      }

      .sanjiao-box {
        margin-left: 5px;

        .top {
          border: 6px solid;
          border-color: transparent;
          border-bottom-color: #aaa;

          &.active {
            border-bottom-color: #3B64FC;
          }
        }

        .bottom {
          margin-top: 2px;
          border: 6px solid;
          border-color: transparent;
          border-top-color: #aaa;

          &.active {
            border-top-color: #3B64FC;
          }
        }
      }
    }

    .price-input-box {
      margin-left: 30px;

      input {
        text-align: center;
        padding: 0 10px;
        display: inline-block;
        width: 79px;
        height: 35px;
        background: #ffffff;
        border-radius: 0px 0px 0px 0px;
        border: 1px solid #cccccc;
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: 400;
        font-size: 14px;
        color: #333;
      }

      input[type="number"]::-webkit-inner-spin-button,
      input[type="number"]::-webkit-outer-spin-button {
        -webkit-appearance: none; /* 隐藏小三角 */
        margin: 0; /* 可选：移除默认的外边距 */
      }
      span {
        margin: 0 8px;
      }

      .btn {
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
        color: #a76737;
      }
    }

    .pagi-box {
      margin-left: 20px;
      margin-right: 10px;
      font-size: 14px;
      color: #333333;

      .num {
        color: #a76737;
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
  justify-content: flex-start;
  flex-wrap: wrap;

  .product-item {
    margin-right: 16px;
    margin-top: 16px;
    width: 220px;
    height: 349px;
    background: #ffffff;
    cursor: pointer;

    &:nth-child(6n) {
      margin-right: 0;
    }

    &:nth-child(-n + 6) {
      margin-top: 0;
    }

    &:hover {
      .title {
        color: #3B64FC !important;
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
            color: #ff3a30;
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
          display: flex;
          justify-content: center;
          align-items: center;
          width: fit-content;
          height: 32px;

          img {
            margin-right: 5px;
            width: 18px;
            height: 18px;
          }
        }

        .cart-box {
          display: flex;
          justify-content: center;
          align-items: center;
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
.suggestion {
  padding: 36px 64px;
  box-sizing: border-box;
  background: linear-gradient(135deg, #FCFFFF 0%, #ddd 100%);
  border-radius: 20px;

  .suggest_word {
    font-size: 16px;
    color: #202020;
  }

  .refresh {
    font-size: 16px;
    color: #3B64FC;
    margin-top: 14px;
    cursor: pointer;
    text-decoration: underline;
    margin-right: 16px;
  }

  .suggestion-inner {
    background-color: white;
    margin: 48px 0;
    padding: 36px;

    h1 {
      font-size: 20px;
      font-weight: bold;
      color: #202020;
    }

    .suggest-hint {
      font-size: 16px;
      color: #202020;
      margin-top: 14px;
    }

    .protection-msg {
      background-color: #E6F0FF;
      margin: 28px 0;
      padding: 16px;
      box-sizing: border-box;
      display: flex;
      align-items: center;

      p {
        color: #3B64FC;
      }

      .suggest-protect {
        height: 20px;
        margin-right: 8px;
      }
    }
    form{
      .suggest_form {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;

        div {
          padding: 0 12px;

          &:first-child {
            padding-left: 0
          }

          &:nth-child(3) {
            padding-right: 0;
          }

          label {
            display: block;
            font-size: 16px;
            margin-left: 20px;
            margin-bottom: 8px;
            font-weight: bold;
          }

          input {
            display: block;
            background-color: #FAFAFA;
            padding: 20px 14px;
            color: #202020;
            width: 100%;
            font-size: 14px;
          }
          p{
            color: red;
            margin-top: 4px;
            font-size: 14px;
          }
        }

      }
      button{
        background-color: #2B5190;
        color: #fff;
        width: 380px;
        height: 45px;
        margin-top: 28px;
        border-radius: 10px;
        font-size: 20px;
      }
    }
    .agreement{
      margin-top: 16px;
      color: #999999;
      span{
        color: #2B5190;
        cursor: pointer;
      }
    }
  }
}
.recomm_goods{
  margin-top: 64px;
  .recomm_title{
    font-weight: bold;
    font-size: 18px;
    padding-left: 18px;
    position: relative;
    &:before{
      position: absolute;
      top: 0;
      left: 0;
      width: 9px;
      height: 100%;
      background: #3B64FC;
      content: '';
    }
  }
  .goods-list{
    margin-top: 28px;
    flex-grow: 1;
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    margin-left: -24px;
    margin-right: -24px;
    .good{
      background: white;
      box-sizing: border-box;
      margin: 16px 24px;
      overflow: hidden;
      cursor: pointer;
      .good_pic{
        width: 100%;
        height: 207px;
        object-fit: cover;
      }
      .good_info{
        font-family: PingFang SC, PingFang SC, sans-serif;

        margin-top: 8px;
        overflow: hidden;
        p:first-child{
          white-space: none;
          text-overflow: ellipsis;
          text-wrap: nowrap;
          overflow: hidden;
          font-size: 14px;
        }
        p:nth-child(2){
          font-size: 20px;
          font-weight: bold;
          margin-top: 18px;
          color: #FF0909;
        }
      }
    }
  }
}
</style>


<style scoped lang="less" src="@/assets/h5css/mobile/product-cates.less"></style>
