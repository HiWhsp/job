<template>
  <div class="wrap-review">
    <div class="review-item" v-for="(item, index) in list" :key="index">
      <div class="avatar-info flex">
        <div class="left">
          <img :src="item.image || avatar_default" alt class="avatar" />
          <span>{{ item.nickname }}</span>
        </div>
        <div class="right">
          <el-rate v-model="item.star" disabled :colors="['@theme', '@theme', '@theme']"
            text-color="@theme"></el-rate>
        </div>
      </div>
      <div class="content">{{ item.content }}</div>
      <div class="img-list cover">
        <div class="img-item" v-for="(url, index) in item.images" :key="index" alt>
          <el-image style="" :src="url" :preview-src-list="item.images"> </el-image>
        </div>
      </div>
      <div class="date">{{ item.createdTime }}</div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "review-list",
  components: {},
  props: ["list"],
  data() {
    return {};
  },
  computed: {
    ...mapState([""]),
  },
  methods: {},
};
</script>

<style scoped lang="less">
/deep/ .el-rate__icon {
  color: #F7BB04 !important;
}

.wrap-review {
  .review-item {
    padding: 30px 40px;
    border: 1px solid #eee;
    margin-bottom: 25px;

    .avatar-info {

      .left {
        min-width: 150px;
        .flex-center();

        .avatar {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          object-fit: cover;
        }

        span {
          flex: 2;
          margin-left: 10px;
          display: inline-block;
          // min-width: 100px;
          text-align: left;

          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #333333;
        }
      }

      .right {}
    }

    .content {
      margin: 20px 0;
      padding-left: 150px;
      text-align: left;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      line-height: 30px;
      color: #222222;
    }

    .img-list {
      .flex();
      padding-left: 150px;
      text-align: left;

      .img-item {
        width: 100px;
        height: 100px;
        margin-right: 15px;
        border: 1px solid #eee;

        .el-image {
          width: 100%;
          height: 100%;
        }
      }

      img {
        // width: 100px;
        // height: 100px;
        // margin-right: 10px;
        // margin-bottom: 10px;
      }
    }

    .date {
      margin-top: 20px;
      padding-left: 150px;
      text-align: left;
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: 400;
      line-height: 19px;
      color: #999999;
    }
  }
}

// 手机端
@media screen and (max-width: 1199px) {
  .wrap-review {
    .review-item {
      padding: 10px 0;
      border-bottom: 1px solid #eee;

      .avatar-info {
        .flex();
        justify-content: space-between;

        .left {
          min-width: 150px;
          .flex-center();

          .avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            object-fit: cover;
          }

          span {
            flex: 2;
            margin-left: 10px;
            display: inline-block;
            // min-width: 100px;
            text-align: left;

            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #333333;
          }
        }

        .right {}
      }

      .content {
        margin: 10px 0;
        padding-left: 0;
        text-align: justify;
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 1.7;
        color: #222222;
      }

      .img-list {
        .flex();
        padding-left: 0;
        text-align: left;

        .img-item {
          width: 100px;
          height: 100px;
          margin-right: 15px;
          border: 1px solid #eee;
          width: 70px;
          height: 70px;

          .el-image {
            width: 100%;
            height: 100%;

            width: 70px;
            height: 70px;
          }
        }

        img {
          // width: 100px;
          // height: 100px;
          // margin-right: 10px;
          // margin-bottom: 10px;
        }
      }

      .date {
        margin-top: 20px;
        padding-left: 0;
        text-align: left;
        font-size: 12px;
        font-family: PingFang SC;
        font-weight: 400;
        line-height: 1.2;
        color: #999999;
      }
    }
  }
}
</style>


<style scoped lang="less" src="@/assets/h5css/mobile/product-detail.less"></style>
