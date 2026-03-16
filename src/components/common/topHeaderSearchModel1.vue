<template>
  <div class="header-box">
    <div class="header w-1400">
      <div class="left">
        <div class="logo" @click="$router.push('/')">
          <img :src="logo" />
        </div>
      </div>
      <div class="center">
        <!-- <img class="caidai" :src="index_custom_banner.banner_top.originalPic"   @click="jump_banner(index_custom_banner.banner_top)" v-if="$route.name == 'index'" /> -->

        <div class="section-search">
          <div class="search-box">
            <!-- <i class="el-icon-search"></i> -->
            <input
              type="text"
              v-model="keyword"
              @keyup.enter="click_search"
              placeholder="请输入您要搜索的产品名称"
            />
            <button class="btn-search" @click="click_search">
              <!-- <img src="@pro/common/search.png" alt /> -->
            </button>
          </div>
          <!-- <div class="search-suggest">
            <b>热门搜索:</b>

            <div class="suggest-list">
              <div
                class="item"
                v-for="(item, index) in hot_keywords"
                :key="index"
                @click="click_search_suggest(item)"
              >{{ item }}</div>
            </div>
          </div>-->
        </div>
      </div>
      <div class="right">
        <!-- <img src="@pro/common/phone1.png" alt="" />
        <div class="text-box">
          <div class="text-1">咨询热线</div>
          <div class="text-2">{{ vuex_config.com_title }}</div>
        </div> -->

        <button class="btn-cart">
          <!-- <img src="@pro/common/shopcart-t.png" alt /> -->
          <router-link to="myCart">我的购物车</router-link>
          <i>{{ vuex_cart_number }}</i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

export default {
  name: "HeaderIndex",
  data() {
    return {
      keyword: "",
    };
  },

  computed: {
    ...mapState([
      "config",
      "index_custom_banner",
      "hot_keywords",
      "logo",
    ]),
    suggestKeywods() {
      let arr = [];
      if (this.vuex_config.xieyi) {
        arr = this.vuex_config.xieyi.split("|");
      }
      return arr;
    },
  },

  created() {},

  methods: {
    //搜索
    click_search() {
      this.handleSearch(this.keyword);
    },
    //热搜
    click_search_suggest(item) {
      this.keyword = item;
      this.handleSearch(item);
    },
    handleSearch(keyword) {
      this.$router.push({
        path: "/search",
        query: {
          keyword: keyword,
        },
      });
    },

    //自定义 banner跳转
    jump_banner(item) {
      console.log({ ...item });
      let url = item.url;
      if (!url) {
        return;
      }
      window.open(url, "_blank");
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.header-box {
  padding: 20px 0;
  background: #fff;
}
.header {

  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .left {
    .logo {
      cursor: pointer;
      img {
        width: 200px;
      }
    }
  }
  .right {
      display: flex;
  align-items: center;
    img {
      width: 40px;
    }
    .text-box {
      margin-left: 5px;
      text-align: left;
      .text-1 {
        font-size: 14px;
        font-family: Poppins, Poppins;
        color: #747474;
      }
      .text-2 {
        font-size: 24px;
        font-family: Poppins, Poppins;
        color: #f00;
      }
    }
  }
}

.section-search {
  .search-box {
    // width: 550px;
    height: 36px;
    background: #ffffff;

    opacity: 1;

    // overflow: hidden;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    width: 660px;
    // i {
    //   color: #8a8a8a;
    //   font-size: 22px;
    //   background: #fff;
    //   position: absolute;
    //   left: 5px;
    // }
    input {
      border-radius: 4px 0 0 4px;
      flex: 3;
      height: 100%;
      height: 36px;
      border: none;
      outline: none;
      background: #fff;
      padding-left: 40px;
      padding-right: 30px;
      border: 1px solid #f00;

      font-size: 14px;
      font-family: Poppins, Poppins;
      color: #000;
    }
    .btn-search {
        display: flex;
          justify-content: center;
          align-items: center;
      border-radius: 0 4px 4px 0;
      width: 96px;
      height: 100%;
      height: 36px;
      background: #f00;
      border: 1px solid #f00;
      border: none;
      outline: none;
      cursor: pointer;
      font-size: 16px;
      color: #fff;

      &:hover {
        filter: opacity(0.8);
      }

      img {
        margin-right: 10px;
        width: 17px;
      }
    }
  }
}

.btn-cart {
  width: 166px;
  transition: 0.3s;
  position: relative;
  padding-left: 24px;
  &:hover {
    opacity: 0.8;
  }
  & + button {
    margin-left: 20px;
  }
    display: flex;
  align-items: center;
  // width: 129px;
  height: 35px;
  background: transparent;
  border: 1px solid #505050;
  opacity: 1;
  border-radius: 4px;

  img {
    width: 24px !important;
    margin-right: 24px;
  }
  a {
    font-size: 14px;
    color: #222;
  }
  i {
    position: absolute;
    top: 0;
    left: 42px;

    width: 16px;
    height: 16px;
    background: #E61E18;
    border-radius: 50%;
    color: #fff;
    border-radius: 50%;
    font-style: normal;
    font-size: 12px;
  }
}
</style>
