<template>
  <div class="page">
    <div class="main-title">
      <span>My Favorites</span>
    </div>

    <div class="page-ctx">
      <div class="card-grid">
        <div class="card-item" v-for="(item, index) in messList" :key="index">
          <div class="card-content">
            <div class="logo-section">
              <div class="logo-icon">
                <img :src="item.logo_full" alt="logo" />
              </div>
            </div>
            <div class="card-title">
              {{ item.companyName }}
            </div>
            <div class="card-subtitle" @click="handleCancelCollect(item)">Unfollow</div>
          </div>
        </div>
      </div>
      <el-pagination
        style="margin-top: 40px; text-align: center"
        v-if="total > 0"
        :total="total"
        layout="prev, pager, next"
        :current-page="pagination.page"
        @current-change="handleCurrentChange"
      />
      <el-empty description="No Data" v-if="messList.length === 0" />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "my-follows",
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
        url: "myFollowCompanyList",
        method: "get",
        data: this.pagination,
      }).then((res) => {
        if (res.code == 200) {
          this.messList = res.data.list;
          this.total = res.data.totalCount;
        }
      });
    },
    handleCurrentChange(page) {
      this.pagination.page = page;
      this.setView();
    },
    handleCancelCollect(item) {
      this.$api({
        url: "followCompany",
        method: "post",
        data: { type: 2, companyId: item.id },
      }).then((res) => {
        if (res.code == 200) {
          this.$message.success("Unfollowed successfully");
          this.setView();
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
.page {
  text-align: left;
  padding-bottom: 80px;
  background: #fff;
  border-radius: 12px;

  .main-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 32px;
    text-align: left;
    height: 56px;
    line-height: 56px;
    font-size: 16px;
    font-family: Microsoft YaHei-Bold, Microsoft YaHei;
    font-weight: bold;
    color: #000;
  }

  .page-ctx {
    min-height: 400px;
    padding: 0px 32px 40px 32px;
    background: #fff;
  }
}

.page {
  .page-ctx {
    padding-bottom: 80px;
  }
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;

  .card-item {
    width: 190px;
    height: 200px;
    border-radius: 14px;
    background: linear-gradient(180deg, #f6f6f8 0%, #ffffff 100%);
    box-sizing: border-box;
    border: 1px solid #e7e7e7;

    .card-content {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      position: relative;

      .logo-section {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 10px;

        .logo-icon {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;

          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }
      }

      .card-title {
        font-size: 16px;
        font-weight: 500;
        color: #333;
        line-height: 1.4;
        margin-bottom: 20px;
      }

      .card-subtitle {
        cursor: pointer;
        font-size: 12px;
        color: #999;
      }
    }
  }

  // 响应式布局
  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
}
</style>
