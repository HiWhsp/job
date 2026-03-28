<template>
  <div class="page">
    <div class="inner">
      <div class="bread-box">
        <div class="bread-inner flex w-1400">
          <router-link to="/">Home</router-link>

          <div class="bread-item" v-for="(item, index) in bread_list" :key="index">
            <span class="arrow">/</span>
            <template v-if="item">
              <a v-if="item && !item.route" class="link" href="javascript: void(0)">{{ item.title }}</a>
              <router-link
                v-else-if="item && item.route"
                :to="item.route"
                class="route-link"
              >{{ item.title }}</router-link>
            </template>
          </div>

          <div class="bread-item search-item" v-if="keyword">
            <span class="arrow">></span>
            <span class="search">
              搜索：
              <span class="search-keyword">“{{ keyword }}”</span>
            </span>
          </div>
        </div>
      </div>

      <div class="category-box filter-box w-1400">
        <div class="filter-item" v-for="(group_cates, gindex) in group_options" :key="gindex">
          <div class="label">{{ gindex == 0 ? "Classification" : "" }}</div>
          <div class="val">
            <div class="cate-box" :class="{ 'hidden-expand': !cate_is_expand_list[gindex] }">
              <div
                class="cate-item"
                v-for="(item, index) in group_cates"
                :key="index"
                :class="{ active: query_id_list.includes(item.id) }"
                @click="toCate(item)"
              >{{ item.title }}</div>
            </div>
          </div>

          <div class="cate-acts flex">
            <div class="all-box flex hover-color" @click="do_toggle_all(gindex)">
              fold up
              <img
                :class="{ rotate: cate_is_expand_list[gindex] }"
                src="@img/product/filter-arrow.png"
                alt
              />
            </div>
          </div>
        </div>

        <div class="filter-item">
          <div class="label">Brand</div>
          <div class="val">
            <div class="cate-box">
              <div
                class="cate-item"
                v-for="(item, index) in brand_list"
                :key="index"
                :class="{ active: item.id == brand_select.id }"
                @click="do_brand_toggle(item)"
              >{{ item.title }}</div>
            </div>
          </div>
        </div>

        <div class="filter-item">
          <div class="label">Current Selection</div>
          <div class="val">
            <div class="check-box">
              <div class="check-item" v-for="(item, index) in cate_select_list" :key="index">
                <div class="check-title">{{ item.title }}</div>
                <div class="remove-box" @click="do_remove_cate(item, index)">
                  <img src="@img/product/remove.png" alt />
                </div>
              </div>
              <div class="check-item" v-if="brand_select.title">
                <div class="check-title">{{ brand_select.title }}</div>
                <div class="remove-box" @click="do_remove_brand()">
                  <img src="@img/product/remove.png" alt />
                </div>
              </div>
            </div>
          </div>

          <div class="check-acts flex">
            <div class="clear-box flex hover-color" @click="do_clear()">
              <img src="@img/product/clear.png" alt />
              Clear
            </div>
          </div>
        </div>
      </div>

      <div class="category-box filter-box sort-wrap w-1400" style="margin-top: 16px">
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
                  placeholder="Lowest price"
                  @blur="on_blur_price"
                />
                <span>-</span>
                <input
                  v-model="searchMax"
                  type="number"
                  placeholder="Highest price"
                  @blur="on_blur_price"
                />
                <!-- <button class="btn fit-text" @click="setView()">筛选</button> -->
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="page-ctx w-1400">
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
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import productList from "@/components/product/productList.vue"; //

import { mapState } from "vuex";

export default {
  name: "category",
  components: {
    productList
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
        false
      ],
      keyword: this.$route.query.keyword || "",
      tags: this.$route.query.tags || "",

      product_list: [],
      pagination: {
        page: 1,
        pageNum: 16
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
      sort_list: [
        { type: "Comprehensive Ranking", ziduan: "ordering", is_arrow: false },
        { type: "Popularity ranking", ziduan: "orders", is_arrow: false },
        { type: "Sales", ziduan: "orders", is_arrow: false },
        { type: "Price", ziduan: "priceSale", is_arrow: true },
        { type: "New product", ziduan: "xinpin", is_arrow: true }
      ],
      sort_type: "Comprehensive Ranking",

      brand_list: [],
      brand_select: {},

      searchMin: "",
      searchMax: ""
    };
  },
  computed: {
    // ...mapState([""]),

    query_id_list() {
      let ids = this.$route.query.ids || "";
      let id_arr = ids.split("-").filter(v => !!v);
      let list = id_arr.map(v => +v);
      return list;
    },

    cate_select_list() {
      let option = [];
      let ids = this.$route.query.ids || "";
      let id_arr = ids.split("-").filter(v => !!v);
      id_arr.forEach(id => {
        let cate = this.vuex_category_flat.find(v => v.id == id) || {};
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
    }
  },

  watch: {
    $route(newVal) {
      this.pagination.page = 1;
      this.tags = newVal.query.tags;
      this.setView();
    }
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
          orderType: 0
        };
      } else if (this.sort_type == "销量排序") {
        sort_params = {
          orderType: 1
        };
      } else if (this.sort_type == "价格排序") {
        if (this.isAsc == "asc") {
          //价格升序
          sort_params = {
            orderType: 2
          };
        } else {
          sort_params = {
            orderType: 3
          };
        }
      }
      let price_params = {};
      if (this.searchMin && this.searchMax && this.searchMax > this.searchMin) {
        price_params = {
          searchMin: this.searchMin,
          searchMax: this.searchMax
        };
      }

      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "product_plist",
          channelId: channelId,
          brandId: this.brand_select.id || "",
          keyword: this.keyword || "",
          ...this.pagination,
          orderType: "", //排序：0-默认排序 1-销量排序 2-价格升序 3-价格降序
          ...sort_params,
          ...price_params,
          tags: this.tags || ""
        }
      }).then(res => {
        let { code, data, count } = res;
        if (code == 200) {
          let { list, count, pages } = data;
          this.product_list = list;
          this.count = count;
        }
      });
    },

    query_brand() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "product_brandList"
        }
      }).then(res => {
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
      this.$router.push(item.route);
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
    do_remove_brand() {
      this.brand_select = {};
      this.setView();
    },

    toDetail(item) {
      // this.$router.push(`/product-detail?id=${item.inventoryId}`);
      window.open(
        "/product-detail?id=" + item.inventoryId,
        "__blank",
        "",
        false
      );
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
    }
  }
};
</script>

<style scoped lang="less">
page {
  background: #ffffff;
}
.page {
  background: #fff;
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
  background: #fbfbfb;
  margin-bottom: 24px;
  .bread-inner {
    margin: 0 auto;
    a {
      display: inline-flex;
      align-items: center;

      font-family: Poppins, Poppins;
      font-size: 15px;
      color: #505050;

      img {
        margin-right: 10px;
      }
    }

    .link {
      font-family: Poppins, Poppins;
      font-size: 15px;
      color: #505050;
    }

    .route-link {
      font-family: Poppins, Poppins;
      font-size: 15px;
      color: #505050;
    }

    .arrow {
      margin: 0 6px;
      color: #aeaeae;
    }

    > *:last-child {
      font-family: Poppins, Poppins;
      font-size: 15px;
      color: #000000;
    }

    .search-item {
      color: #aeaeae;
    }
    .search-keyword {
      color: #ec6a2b;
    }
  }
}

.filter-box {
  border: 1px solid #ddd;

  .filter-item {
    background: #fff;
    display: flex;
    align-items: flex-start;
    border-bottom: 1px solid #ddd;

    &:last-child {
      border-bottom: none;
    }

    .label {
      background: #fbfbfb;
      align-self: stretch;
      // background: #f8f8f8;
      width: 200px;
      display: inline-flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 25px;

      font-family: Arial, Arial;
      font-weight: bold;
      font-size: 20px;
      color: #1e262e;
      line-height: 28px;
    }

    .val {
      flex: 1;
      min-height: 70px;
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
      font-family: Arial, Arial;
      margin: 4px 10px 10px;
      font-family: Arial, Arial;
      font-weight: 400;
      font-size: 20px;
      color: #1e262e;
      line-height: 28px;

      &.active {
        color: #ec6a2b;
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
      height: 40px;
      margin-right: 20px;
      border-radius: 20px;
      background: #feeedd;
      border: 1px solid #ec6a2b;
      padding: 0 20px;
      padding-right: 0;

      &.active {
        color: #ec6a2b;
      }

      .check-title {
        font-family: Arial, Arial;
        font-weight: 400;
        font-size: 20px;
        color: #ec6a2b;
        line-height: 28px;
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
      font-family: Poppins, Poppins;
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
      font-family: Poppins, Poppins;
      font-weight: 400;
      font-size: 14px;
      color: #ec6a2b;

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
    font-family: Arial, Arial;
    font-size: 14px;
    color: #545454;

    .item {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 40px;
      border-right: 1px solid #eee;
      padding: 0 15px;

      width: fit-content;
      text-align: center;
      cursor: pointer;

      -webkit-user-select: none;
      -moz-user-select: none;
      -o-user-select: none;
      user-select: none;

      &.active {
        .text {
          color: #ec6a2b;
        }
      }
      .text {
        font-family: Arial, Arial;
        font-weight: 400;
        font-size: 20px;
        color: #1e262e;
        line-height: 28px;
      }

      .sanjiao-box {
        margin-left: 5px;

        .top {
          border: 6px solid;
          border-color: transparent;
          border-bottom-color: #aaa;

          &.active {
            border-bottom-color: #ec6a2b;
          }
        }

        .bottom {
          margin-top: 2px;
          border: 6px solid;
          border-color: transparent;
          border-top-color: #aaa;

          &.active {
            border-top-color: #ec6a2b;
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
        width: 160px;
        height: 43px;
        background: #ffffff;
        border-radius: 0px 0px 0px 0px;
        border: 1px solid #cccccc;
        font-family: Poppins, Poppins;
        font-weight: 400;
        font-size: 20px;
        color: #b9b9b9;
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
        margin-left: 20px;
        min-width: 70px;
        height: 32px;
        background: #ec6a2b;
        font-family: Poppins, Poppins;
        font-weight: 400;
        font-size: 16px;
        color: #ffffff;
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
        color: #ec6a2b !important;
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
            font-family: Poppins, Poppins;
            font-weight: 400;
            font-size: 16px;
            color: #ff3a30;
          }

          .price-2 {
            text-decoration: line-through;
            font-family: Poppins, Poppins;
            font-weight: 400;
            font-size: 14px;
            color: #505050;
          }
        }

        .yishou {
          font-weight: 400;
          font-size: 12px;
          color: #505050;
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
</style>


<style scoped lang="less" src="@/assets/h5css/mobile/product-cates.less"></style>
