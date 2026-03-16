<template>
  <div class="page">
    <div class="news-banner-wrap">
      <div class="page-top">
        <div class="page-top-banner">
          <img src="@img/banner/news-banner.png" alt="" />
        </div>
        <div class="page-top-text-wrap w-1400">
          <div class="page-top-text-inner">
            <div class="main-title">品牌馆</div>
            <div class="btn btn-ripple fit-text">大牌专区 质美价优</div>
          </div>
        </div>
      </div>
    </div>

    <div class="inner">
      <div class="page-ctx">
        <div class="brand-wrap">
          <div class="brand-list">
            <div class="brand-item scale-box" v-for="(item, index) in brand_list" :key="index">
              <img class="scale-img" :src="item.thumb" alt="">
            </div>
          </div>
        </div>
        <div class="pagination-box" v-if="count" style="margin-top: 50px;">
          <el-pagination background layout="prev, pager, next" :total="count" :current-page="pagination.page"
            :page-size="pagination.pageNum" @current-change="on_current_change"> </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";

export default {
  name: "product-brand",
  components: {

  },
  data() {
    return {
      brand_list: [],
      pagination: {
        page: 1,
        pageNum: 16,
      },
      count: 0,
    };
  },
  computed: {
    // ...mapState([""]),
  },

  watch: {

  },
  created() {
    this.setView();
  },
  methods: {
    setView() {
      this.query_brand();
    },
    query_brand() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "product_brandList",
          ...this.pagination
        },
      }).then((res) => {
        if (res.code == 200) {
          let data = res.data;
          this.brand_list = data;
          this.count = count;
        }
      });
    },

    on_current_change(value) {
      this.pagination.page = value
      this.setView()
    }

  },
};
</script>

<style scoped lang="less">
.page {
  background: #FFFFFF;
  background: #F3F3F3;
  text-align: left;

  .inner {
    width: 1400px;
    margin: 0 auto;
    padding-top: 35px;
    padding-bottom: 100px;

    .page-ctx {
      padding-top: 45px;
    }
  }
}



.page-top {
  position: relative;

  .page-top-banner {
    img {
      width: 100%;
      height: 400px;
      object-fit: cover;
    }
  }

  .page-top-text-wrap {
    margin: 0 auto;

    .page-top-text-inner {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      text-align: center;
      // padding-left: 60px;

      .main-title {
        font-family: Poppins, Poppins;
        font-weight: bold;
        font-size: 60px;
        color: #FFFFFF;
      }

      .btn {
        margin-top: 37px;
        padding: 0 24px;
        width: fit-content;
        height: 61px;
        background: #00306B;
        border-radius: 0px 0px 0px 0px;

        font-family: Poppins, Poppins;
        font-weight: 400;
        font-size: 30px;
        color: #FFFFFF;
      }
    }
  }
}


.brand-list {
  flex-wrap: wrap;
  display: flex;
  .brand-item {
    margin-right: 25px;
    margin-bottom: 27px;
    width: 330px;
    height: 140px;
    background: #FFFFFF;
    border-radius: 0px 0px 0px 0px;

    &:nth-child(4n) {
       margin-right: 0;
    }
  }
}
</style>


<style scoped lang="less" src="@/assets/h5css/mobile/product-cates.less"></style>
