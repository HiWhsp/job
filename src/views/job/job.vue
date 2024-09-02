<template>
  <div class="page">
    <pageTop :config="pageConfig" />

    <!-- <pageBread /> -->

    <div class="page-box">
      <div class="page-inner">
        <div class="p-page-title">
          人才招聘
        </div>


        <div class="list-box">
          <div class="tabs">
            <div class="tab-item" v-for="(item, index) in job_cate_list" :key="index"
              :class="{ active: active_cate.id == item.id }" @click="toggleTab(item)">
              {{ item.title }}
            </div>
          </div>

          <div class="job-list">
            <div class="job-item" v-for="(item, index) in job_list" :key="index">
              <div class="info-box">
                <div class="title">{{ item.title }}</div>
                <div class="desc">
                  <div class="desc-item">
                    <img src="@img/job-dizhi.png" alt="" />
                    <span>工作地点：{{ item.address }}</span>
                  </div>
                  <div class="desc-item">
                    <img src="@img/job-user.png" alt="" />
                    <span>招聘人数：{{ item.num }}人</span>
                  </div>
                  <div class="desc-item">
                    <img src="@img/job-date.png" alt="" />
                    <span>发布时间：{{ item.dtTime.substr(0, 10) }}</span>
                  </div>
                </div>
              </div>
              <div class="btn-box">
                <button class="btn-ripple" @click="$router.push('/jobdetail?id=' + item.id)">
                  申请职位
                </button>
              </div>
            </div>
          </div>

          <div class="pagination-box" style="margin-top: 40px">
            <el-pagination background @current-change="changePage" :current-page.sync="pagination.page"
              :page-size="pagination.pageNum" layout="total, prev, pager, next" :total="count"></el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "create-order",
  components: {},
  data() {
    return {
      job_cate_list: [],
      active_cate: {},
      job_list: [],

      pagination: {
        page: 1,
        pageNum: 10,
      },
      count: 0,
    };
  },
  computed: {
    ...mapState([""]),

    pageConfig() {
      return {
        banner: this.bannerMap['关于我们'],
        title: '关于我们',
        title_en: 'ABOUT US',
        list_bread: [
          {
            title: '关于我们',
            route: '',
          },
          {
            title: '人才招聘',
            route: '',
          },
        ],
        nav_list: this.child_about
      };
    },
  },
  watch: {},

  created() {
    // this.queryCate();
    this.setView();
  },
  methods: {
    queryCate() {
      this.$api("index_channelRecruits", {
        recurit_num: 10,
        language: this.lang,
      }).then((res) => {
        this.job_cate_list = res.data;
        this.active_cate = res.data[0] || {};

        this.setView();
      });
    },
    //分页
    changePage() {
      this.setView();
    },

    setView() {
      this.$api("index_recruitList", {
        // channel_id: this.active_cate.id,
        language: this.lang,
        ...this.pagination,
        // content_len: '',
      }).then((res) => {
        this.job_list = res.data.list;
        this.count = res.data.count;
      });
    },

    toggleTab(item) {
      this.active_cate = item;
      this.setView();
    },
  },
};
</script>

<style scoped lang="less">
.page {
  background: #FFFFFF;
  min-height: 50vh;


  .page-box {
    // background: #f7f7f7;
  }

  .page-inner {
    width: @width;
    margin: 0 auto;
    padding: 80px 0;

    .detail-title {
      font-size: 36px;
      font-family: Microsoft YaHei-Bold, Microsoft YaHei;
      font-weight: bold;
      color: #333333;
    }

    .detail-title-line {
      width: 80px;
      margin: 24px auto;
      height: 5px;
      background: #ea3200;
      border-radius: 3px 3px 3px 3px;
    }
  }
}

.tabs {
  margin-top: 0;
  display: flex;
  justify-content: center;

  .tab-item {
    text-align: center;
    margin-left: 10px;
    width: 232px;
    height: 42px;
    line-height: 42px;
    background: #e5e5e5;
    border-radius: 4px 4px 4px 4px;
    font-size: 14px;
    font-family: Microsoft YaHei-Regular, Microsoft YaHei;
    font-weight: 400;
    color: #333333;
    cursor: pointer;

    &:first-child {
      margin-left: 0;
    }

    &.active {
      background: #ea3200;
      color: #fff;
    }
  }
}

.job-list {
  margin-top: 64px;
  .flex();
  flex-wrap: wrap;

  .job-item {
    width: calc((100% - 32px) / 2);
    margin-bottom: 24px;
    padding: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    height: 222px;
    background: #ffffff;
    box-shadow: 0px 0px 18px 1px rgba(0, 0, 0, 0.08);
    border-radius: 8px 8px 8px 8px;

    &:nth-child(2n) {
      margin-left: 32px;
    }

    .info-box {
      text-align: left;
      padding-right: 92px;

      .title {
        font-size: 24px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        font-weight: 400;
        color: #333333;
      }

      .desc {
        margin-top: 20px;

        .desc-item {
          margin-bottom: 10px;
          .flex();

          img {
            margin-right: 10px;
          }

          span {
            font-size: 14px;
            font-family: Microsoft YaHei-Regular, Microsoft YaHei;
            font-weight: 400;
            color: #666666;
          }
        }
      }
    }

    .btn-box {
      button {
        width: 132px;
        height: 40px;
        background: #ffffff;
        border-radius: 4px 4px 4px 4px;
        border: 1px solid #4CA5E4;
        font-size: 14px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        font-weight: 400;
        color: #4CA5E4;
      }
    }
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/page/job.less"></style>

<style scoped lang="less" src="@/assets/h5css/mobile/job.less"></style>
