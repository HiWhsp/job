<template>
  <div class="page">
    <div class="main-title">
      <span>我的收藏</span>
    </div>

    <div class="page-ctx">
      <div class="mess-list">
        <div
          class="mess-item"
          v-for="(item, index) in messList"
          :key="index"
          @click="handleToDetail(item)"
        >
          <div class="title-box">
            <div class="title">
              {{ item.title }}
            </div>
            <div class="date" @click="handleCancelCollect(item)">
              <img src="@/assets/img/ellsenn/share/collect-active.png" alt="" />
              取消收藏
            </div>
          </div>
          <div class="content">
            {{ item.created_at }}
          </div>
        </div>
      </div>
      <el-pagination
        style="margin-top: 20px; text-align: center"
        v-if="total > 0"
        :total="total"
        layout="prev, pager, next"
        :current-page="pagination.page"
        @current-change="handleCurrentChange"
      />
      <el-empty description="暂无数据" v-if="messList.length === 0" />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "servicePage",
  components: {},
  data() {
    return {
      messList: [],
      pagination: {
        page: 1,
        limit: 10,
      },
      total: 0,
    };
  },
  computed: {
    ...mapState([""]),
  },
  watch: {},
  created() {
    this.setView();
  },
  methods: {
    setView() {
      this.$api({
        url: "getMyCollect",
        method: "get",
        data: this.pagination,
      }).then((res) => {
        if (res.code == 200) {
          this.messList = res.data.list;
          this.total = res.data.count;
        }
      });
    },
    handleCurrentChange(page) {
      this.pagination.page = page;
      this.setView();
    },
    handleCancelCollect(item) {
      this.$api({
        url: "qxCollect",
        method: "post",
        data: { ids: item.id },
      }).then((res) => {
        if (res.code == 200) {
          this.setView();
        }
      });
    },
    handleToDetail(item) {
      this.$router.push(`/newsInsightsDetail?id=${item.p_id}`);
    },
  },
};
</script>

<style scoped lang="less">
.page {
  text-align: left;
  padding-bottom: 80px;

  .main-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 32px;
    text-align: left;
    height: 56px;
    line-height: 56px;
    background: #ffffff;
    font-size: 16px;
    font-family: OPPPSans;
    font-weight: bold;
    color: #000;
  }

  .page-ctx {
    min-height: 400px;
    margin-top: 14px;
    padding: 32px 32px 40px 32px;
    background: #fff;
  }
}

.page {
  .page-ctx {
    padding-bottom: 80px;
  }
}

.mess-list {
  .mess-item {
    cursor: pointer;
    border-bottom: 1px solid #ddd;
    padding-bottom: 20px;
    margin-bottom: 20px;
    .title-box {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .title {
        font-weight: 500;
        font-size: 16px;
        color: #000;
      }

      .date {
        font-weight: 400;
        font-size: 14px;
        color: #7b8599;
        cursor: pointer;
      }
    }

    .content {
      color: #999999;
      font-size: 12px;
      margin-top: 15px;
    }
  }
}
</style>
