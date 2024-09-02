<template>
  <div class="page">
    <pageTop :config="pageConfig" />

    <div class="inner">
      <div class="page-ctx">
        <div class="list">
          <div class="item" v-for="(item, index) in list" @click="tohuodong(item)">
            <div class="poster-box">
              <img :src="item.originalPic" alt="" class="poster">
            </div>
            <div class="info-box">
              <div class="title ellipsis-1">
                {{ item.title }}
              </div>
              <div class="date">
                {{ item.dtTime }}
              </div>
            </div>
          </div>
        </div>
        
        <div class="pagination-box" style="margin-top: 40px">
          <el-pagination background layout="total,prev, pager, next" :total="count" :current-page="pagination.page"
            :page-size="pagination.page_num" @current-change="changePage">
          </el-pagination>
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
      list: [],

      count: 0,
      pagination: {
        page: 1,
        page_num: 10,
      },
    };
  },
  computed: {
    ...mapState([]),
    pageConfig() {
      return {
        banner: this.bannerMap['市场活动'],
        title: '市场活动',
        title_en: 'activities',
        list_bread: [
          {
            title: '市场活动',
            route: '',
          }
        ],
        nav_list: this.activitiesCates
      };
    },
  },

  watch: {
    $route() {
      this.setView();
    }
  },
  created() {
    this.setView();
  },
  methods: {
    tohuodong(item) {
      this.$router.push(`/activitiesDetail?cid=${item.channelId}&id=${item.id}`)
    },
    setView() {
      this.$api("index_newsList", {
        channel_id: this.$route.query.id,
        ...this.pagination,
      }).then((res) => {
        let { code, data } = res;
        if (code == 200) {
          this.list = res.data.list;
          this.count = res.data.count;
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
.page {
  .inner {
    min-height: 700px;
    padding-top: 47px;
    padding-bottom: 70px;

    background: #FFFFFF url('~@img/company/culture-bg.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
}


.page-ctx {
  width: @width;
  margin: 0 auto;
  padding-top: 0;
  padding-bottom: 50px;
}


.list {
  display: flex;
  flex-wrap: wrap;

  .item {
    margin-bottom: 20px;
    margin-right: 20px;
    width: 440px;
    height: 374px;
    background: #FFFFFF;
    border-radius: 16px 16px 16px 16px;
    overflow: hidden;
    cursor: pointer;

    &:nth-child(3n) {
      margin-right: 0;
    }

    &:hover {
      .title {
        color: #4CA5E4 !important;
      }
    }

    .poster-box {
      width: 440px;
      height: 280px;

      .poster {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .info-box {
      padding: 20px 30px;

      .title {
        font-weight: 400;
        font-size: 18px;
        color: #333333;
      }

      .date {
        margin-top: 14px;
        font-size: 16px;
        color: #555555;
      }
    }
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/mobile/activities.less"></style>