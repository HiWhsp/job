<template>
    <div class="page">
        <div class="nav-bar">
            <el-breadcrumb separator=">">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>公告列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="inner">
            <div class="title">公告</div>

            <div class="item pointer" v-for="(item, index) in list" :key="index" @click="toDetail(item)">
                <div class="left">
                    <div class="day">{{ item.dtTime.split(' ')[0].split('-')[2] }}</div>
                    <div class="date">{{ item.dtTime.split(' ')[0].split('-').slice(0, 2).join('/') }}</div>
                </div>
                <div class="right ">
                    <div class="tit">{{ item.title }}</div>
                    <div class="desc">{{ item.content }}</div>
                </div>
            </div>

            <div v-if="count" class="pagination-box" style="margin-top: 40px; text-align: center;">
                <el-pagination background layout="total, prev, pager, next" @current-change="setView"
                               :current-page.sync="pagination.page" :page-size="pagination.pageNum"
                               :total="count"></el-pagination>
            </div>

            <el-empty v-if="!count" description="没有查询到公告信息..."></el-empty>
        </div>
    </div>
</template>

<script>
export default {
    name: "helpCenter",
    components: {},
    data() {
        return {
            count: 0,
            list: [],
            pagination: {
                page: 1,
                pageNum: 10,
            },
        };
    },
    mounted() {
        this.setView();
    },
    methods: {
        setView() {
            this.$api({
                url: '/service.php',
                method: 'get',
                data: {
                    action: 'news_lists',
                    channelId: 52,
                    contentLen: 200,
                    ...this.pagination
                },
            }).then(res => {
                if (res.code === 200) {
                    this.list = res.data.list;
                    this.count = res.data.count;
                }
            })
        },

        toDetail(item) {
            this.$router.push('/notice-detail?id=' + item.id);
        }
    },
};
</script>


<style scoped lang="less">
.page {
  text-align: center;
  font-size: 14px;

  .inner {
    width: 100%;
    margin-top: 21px;
    padding: 30px;
    background-color: #fff;

    .title {
      position: relative;
      cursor: pointer;
      padding-left: 15px;
      text-align: left;

      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: bold;
      font-size: 20px;
      color: #000000;

      &:before {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 4px;
        background-color: @theme;
      }
    }

    .item {
      height: 214px;
      padding: 30px 0 30px 47px;
      .flex();

      .left {
        margin-right: 60px;
        .flex();
        flex-direction: column;

        .day {
          font-family: Roboto, Roboto;
          font-weight: 900;
          font-size: 44px;
          color: #EA3200;
        }

        .date {
          margin-top: 18px;
          font-weight: 400;
          font-size: 18px;
          color: #B1B1B1;
        }
      }

      .right {
        flex: 1;
        padding-left: 60px;
        border-left: 1px solid #D5D8DE;
        text-align: left;

        .tit {
          font-family: Roboto, Roboto;
          font-weight: 400;
          font-size: 20px;
          color: #333333;
        }

        .desc {
          margin-top: 30px;
          height: 90px;
          font-family: Roboto, Roboto;
          font-weight: 400;
          font-size: 14px;
          color: #999999;
        }
      }

    }
  }
}
</style>
