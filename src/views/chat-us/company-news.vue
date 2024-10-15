<template>
  <div class="page">
    <div class="list-wrap">
      <div class="list-item" v-for="(i, index) in 5" :key="index">
        <div class="img-wrap">
          <img src="" alt="" />
        </div>
        <div class="title-wrap">现场直击 | 华日激光亮相上海慕尼黑光博会！</div>
        <div class="desc-wrap">
          <div class="left">
            <div class="icon-wrap">
              <img src="@/assets/img/chat-us/icon1.png" alt="" />
            </div>
            <div class="time">2024-05-07</div>
          </div>
          <div class="right" @click="toDetail">
            <div class="text">了解详情</div>
            <div class="next-wrap">
              <img src="@/assets/img/chat-us/icon1.png" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="center">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentPage: 0
    };
  },
  created() {},
  methods: {
    handleSizeChange() {},
    handleCurrentChange() {},
    toDetail() {
      this.$router.push("company-news-detail");
    }
  },
};
</script>

<style lang="less" scoped>
.page {
  background: #f4f4f6;
  padding-bottom: 73px;
}

.list-wrap {
  padding: 57px 260px 50px;
  display: flex;
  row-gap: 20px;
  column-gap: 36px;
  flex-wrap: wrap;
  .list-item {
    width: 436px;
    background: #fff;
    .img-wrap {
      width: 436px;
      height: 292px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .title-wrap {
      padding: 24px 26px 29px;
      border-bottom: 1px solid #e5e5e5;
      font-size: 20px;
      color: #333333;
      line-height: 36px;
    }
    .desc-wrap {
      height: 62px;
      padding: 0 22px 0 19px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        display: flex;
        align-items: center;
        gap: 9px;
        .icon-wrap {
          width: 15px;
          height: 15px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .time {
          font-size: 16px;
          color: #757575;
        }
      }
      .right {
        display: flex;
        align-items: center;
        gap: 13px;
        cursor: pointer;
        .text {
          font-size: 18px;
          color: #757575;
        }
        .next-wrap {
          width: 20px;
          height: 16px;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
}

.center {
  text-align: center;
}
</style>
