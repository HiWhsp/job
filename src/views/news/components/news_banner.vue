<template>
    <div class="news-banner-wrap">
        <div class="page-top">
      <div class="page-top-banner">
        <img src="@img/banner/news-banner.png" alt="" />
      </div>
      <div class="page-top-text-wrap w-1400">
        <div class="page-top-text-inner">
          <div class="main-title">内容资讯</div>
          <div class="btn btn-ripple fit-text">了解更多行业资讯</div>
        </div>
      </div>
    </div>
    </div>
</template>
<script>

import { mapState } from "vuex";

export default {
    name: "index",
    components: {},
    data() {
        return {
            suggest_news: [],
            first_suggest: {},
            //
        };
    },
    computed: {
        ...mapState([""]),

    },
    watch: {

    },
    created() {
        this.query_suggest();
    },

    methods: {
        query_suggest() {
            this.$api({
                url: "/service.php",
                method: "get",
                data: {
                    action: "news_lists",
                    ...this.pagination,
                    isIndex: 1,//类型：0-全部 1-推荐
                    contentLen: '100',//
                    orderType: 0,//排序情况：0-自然排序 1-最新
                },
            }).then((res) => {
                if (res.code == 200) {
                    let data = res.data;
                    this.suggest_news = data.list;
                    this.first_suggest = data.list[0]
                    // this.count = data.count;
                }
            });
        },
    },
};
</script>

<style scoped lang="less">

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
      top: 67px;
      text-align: left;
      padding-left: 60px;

      .main-title {
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: bold;
        font-size: 60px;
        color: #FFFFFF;
      }

      .btn {
        margin-top: 37px;
        padding: 0 24px;
        width: fit-content;
        height: 61px;
        background: #F74747;
        border-radius: 0px 0px 0px 0px;

        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: 400;
        font-size: 30px;
        color: #FFFFFF;
      }
    }
  }
}



</style>
