<template>
  <div style="padding-bottom: 50px;">
    <!--    操作区-->
    <div class="index-box-first-content flex">
      <div class="banner">
        <el-carousel height="100%">
          <el-carousel-item v-for="(it, i) in index_banners" :key="i">
            <img :src="it.image" alt="banner"/>
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>

    <h2 class="title">砂轮原辅材料</h2>

    <div class="sand-materials main">
      <!-- 分类标签 -->
      <div class="category-tabs">
        <button v-for="(item, index) in vuexFlatCates" :key="index" :class="{ active: selectedCategory.name === item.name }"
                @click="selectedCategory = item">
          {{ item.name }}
        </button>
      </div>

      <div class="column-flex-center wrap" v-for="(item, index) in product_list" :key="index">
        <!-- 材料详情 -->
        <div class="material-info">
          <div class="text-section">
            <h3>{{ item.name }}</h3>
            <p class="description">
              {{ item.introduce }}
            </p>
            <p class="features">
              特征：{{ item.feature }}
            </p>
          </div>
          <div class="image-section">
            <img :src="item.cover_url_full" :alt="item.name"/>
          </div>
        </div>

        <!-- 供应商选择 -->
        <div class="suppliers">
          <div class="title-section">
            <div>
              <span class="tit">供应商选择</span>
              <span class="sub">实力厂家 行业优选</span>
            </div>

            <a href="/product-all" class="more-link" v-if="userInfo.type==1">查看全部供应商 ></a>
          </div>
          <div class="supplier-grid">
            <div v-for="(supplier, i) in item.user_list" :key="i" class="supplier" @click="toProduct(supplier)">
              <img src="@/static/home/supplier.png" alt="">
              {{ userInfo.type==1?supplier.username:supplier.company_name }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <pageAside></pageAside>
  </div>
</template>

<script>
import pageAside from "@/components/page/page-aside.vue";
import {mapState} from "vuex";
import dayjs from 'dayjs'

export default {
  name: "index",
  components: {
    pageAside
  },
  data() {
    return {
      keyword: "",
      // 首屏展示类型
      product_list: [],
      selectedCategory: {}
    };
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo,
      filterList: state => state.vuexTreeCates,
      index_banners: state => state.index_banners
    }),
  },
  watch: {
    vuexFlatCates() {
      this.selectedCategory = this.vuexFlatCates[0];
    },
    selectedCategory() {
      this.keyword = this.selectedCategory.name;
      this.setView();
    }
  },
  mounted() {
    this.selectedCategory = this.vuexFlatCates[0];
    this.setView();
  },
  methods: {
    setView() {
      this.query_product_cate()
    },
    // 获取商品列表
    query_product_cate() {
      this.$api({
        url: "index",
        method: "post",
        data: {
          page: 1,
          pageSize: 10,
          keyword: this.keyword
        },
      }).then((res) => {
        let {code, data} = res;
        if (code == 200) {
          let {list, count} = data;
          this.product_list = list;
          this.count = count;
        }
      });
    },
    // 跳转链接
    goUrl(item) {
      this.$router.push(item.url);
    },
    // 跳转商品
    toProduct(item) {
      this.$router.push(`/productCategories?ids=${item.user_id}&type_id=${this.selectedCategory.id}`);
    }
  },
}

</script>

<style scoped lang="less">
.el-carousel {
  height: 100%;
}

.main {
  width: 1400px;
  margin: 0 auto;
}

.index-box-first-content {
  // 轮播图
  .banner {
    width: 100%;
    height: 560px;
    border-radius: 4px 4px 4px 4px;
    background-color: #C4005B;

    img {
      width: 100%;
      height: 100%;
    }

    /deep/ .is-active {
      .el-carousel__button {
        background: #F8C268;
      }
    }

    /deep/ .el-carousel__button {
      width: 20px;
      height: 6px;
      background: #FFFFFF;
      border-radius: 0px 0px 0px 0px;
      opacity: 0.7;
    }
  }
}

.title {
  text-align: center;
  font-weight: 600;
  font-size: 40px;
  color: #000000;
  margin-top: 60px;
  margin-bottom: 48px;
}

.sand-materials {
  .category-tabs {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 20px;

    button {
      width: 174px;
      height: 48px;
      text-align: center;
      color: #333;
      border-radius: 4px 4px 4px 4px;
      border: 1px solid #DBDBDB;
      background: #fff;
      margin-right: 30px;
      margin-bottom: 20px;

      &:nth-child(7n) {
        margin-right: 0;
      }

      &.active {
        background: #044FA0;
        color: #fff;
      }
    }
  }

  .wrap {
    background: #fff;
    padding: 40px 50px;
    margin-bottom: 20px;
  }

  .material-info {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;

    .text-section {
      flex: 1;
      padding-right: 20px;

      h3 {
        font-size: 36px;
        margin-bottom: 20px;
      }

      .description {
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 18px;
        color: #333333;
        margin-bottom: 20px;
      }

      .features {
        font-family: PingFang SC, PingFang SC;
        font-weight: 600;
        font-size: 18px;
        color: #333333;
      }
    }

    .image-section {
      width: 240px;

      img {
        width: 100%;
      }
    }
  }

  .suppliers {
    width: 100%;
    margin-top: 30px;

    .title-section {
      display: flex;
      justify-content: space-between;
      font-family: PingFang SC, PingFang SC;
      font-weight: 500;
      font-size: 26px;
      margin-bottom: 10px;

      .sub {
        font-size: 16px;
        color: #999;
        margin-left: 10px;
      }

      .more-link {
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 14px;
        color: #044FA0;
      }
    }

    .supplier-grid {
      display: flex;
      flex-wrap: wrap;

      .supplier {
        margin-right: 20px;
        margin-bottom: 16px;
        padding-left: 16px;
        display: flex;
        align-items: center;
        img {
          width: 56px;
          height: 20px;
          margin-right: 10px;
        }

        width: 310px;
        height: 40px;
        color: #333;
        font-size: 16px;
        background: #F9FAFC;
        border-radius: 4px 4px 4px 4px;
        border: 1px solid #E4E7ED;

        &:nth-child(4n) {
          margin-right: 0;
        }
      }
    }
  }
}
</style>
