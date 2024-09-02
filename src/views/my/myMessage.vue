<template>
  <div class="page">
    <div class="main-title">
      <span>我的留言</span>
    </div>

    <div class="page-ctx">
      <div class="mess-list">
        <div class="mess-item" v-for="(item, index) in messList" :key="index">
          <div class="title-box">
            <div class="title">
              {{ item.feed_type }}
            </div>
            <div class="date">
              {{ item.dtTime }}
            </div>
          </div>
          <div class="content">
            {{ item.content }}
          </div>
        </div>
      </div>
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
        page_num: 10
      }
    };
  },
  computed: {
    ...mapState(["baseInfo"]),
  },
  watch: {},
  created() {
    this.setView();
  },
  methods: {
    setView() {

      this.$api("index_getFeedback", {

        ...this.pagination,
      }).then((res) => {
        let { code, data, pages, count } = res;
        this.messList = res.data

      });
    },




  },
};
</script>

<style scoped lang="less">
.page {
  text-align: left;
  padding-bottom: 80px;

  .main-title {
    .flex-between();
    padding: 0 32px;
    text-align: left;
    height: 56px;
    line-height: 56px;
    background: #ffffff;
    font-size: 16px;
    font-family: Microsoft YaHei-Bold, Microsoft YaHei;
    font-weight: bold;
    color: #333333;

    button {
      min-width: 96px;
      height: 30px;
      line-height: 30px;
      background: #4CA5E4;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }
  }

  .page-ctx {
    min-height: 400px;
    margin-top: 24px;
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
    border-bottom: 1px solid #ddd;
    padding: 25px 0;

    .title-box {
      .flex-between();

      .title {
        font-weight: 400;
        font-size: 16px;
        color: #333333;
      }

      .date {
        font-weight: 400;
        font-size: 14px;
        color: #999999;
      }
    }

    .content {
      margin-top: 20px;
    }
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/user/change-password.less"></style>
