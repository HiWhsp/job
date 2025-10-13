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
              搜索
            </button>

            <button class="btn-cart">
              <!-- <img src="@pro/common/shopcart-t.png" alt /> -->
              <router-link to="myCart">购物车</router-link>
              <i>{{ vuex_cart_number }}</i>
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
        <!-- <img src="@pro/common/phone1.png" alt="" /> -->
        <div class="text-box">
          <div class="text-1">咨询热线</div>
          <div class="text-2">{{ vuex_config.com_title }}</div>
        </div>
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
        font-family: MicrosoftYaHei;
        color: #747474;
      }
      .text-2 {
        font-size: 24px;
        font-family: MicrosoftYaHei;
        color: #f00;
      }
    }
  }
}

.section-search {
  .search-box {
    width: 550px;
    height: 36px;
    background: #ffffff;

    opacity: 1;

    // overflow: hidden;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    // i {
    //   color: #8a8a8a;
    //   font-size: 22px;
    //   background: #fff;
    //   position: absolute;
    //   left: 5px;
    // }
    input {
      border-radius: 18px 0 0 18px;

      flex: 2;
      height: 100%;
      height: 36px;
      border: none;
      outline: none;
      background: #fff;
      padding-left: 40px;
      padding-right: 30px;
      border: 2px solid #f00;

      font-size: 14px;
      font-family: Microsoft YaHei;
      color: #000;
    }
    .btn-search {
        display: flex;
          justify-content: center;
          align-items: center;
      border-radius: 0 18px 18px 0;
      width: 96px;
      height: 100%;
      height: 36px;
      background: #f00;
      border: 2px solid #f00;
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

    .btn-cart {
      margin-left: 15px;
    }

    .btn-cart {
      width: 129px;
      transition: 0.3s;
      position: relative;
      &:hover {
        opacity: 0.8;
      }
      & + button {
        margin-left: 20px;
      }
        display: flex;
          justify-content: center;
          align-items: center;
      width: 129px;
      height: 35px;
      background: #f00;
      border: 1px solid #e3e3e3;
      opacity: 1;
      border-radius: 20px;

      img {
        width: 22px;
        margin-right: 5px;
      }
      a {
        font-size: 16px;
        color: #fff;
      }
      i {
        position: absolute;
        top: -7px;
        right: 0;

        width: 16px;
        height: 16px;
        background: #ff9900;
        border-radius: 50%;
        color: #fff;
        border-radius: 50%;
        font-style: normal;
        font-size: 12px;
      }
    }
  }
}
</style>
