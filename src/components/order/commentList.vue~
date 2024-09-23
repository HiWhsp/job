<template>
  <div class="wrap-comments">
    <div class="comment-item" v-for="(item, index) in list" :key="index">
      <div class="left">
        <img :src="item.image || defaultAvatar" alt class="avatar"/>
        <div class="info">
          <span>{{ item.nickname }}</span>
          <span>{{ item.createdTime }}</span>
        </div>
      </div>
      <div class="right">
        <el-rate
            v-model="item.star"
            disabled
            :colors="['@theme', '@theme', '@theme']"
        ></el-rate>
        <div class="content ellipsis-2">{{ item.content }}</div>
        <div class="img-list cover">
          <div class="img-item" v-for="(url, index) in item.images" :key="index" alt>
            <el-image style="" :src="url" :preview-src-list="item.images"></el-image>
          </div>
        </div>
        <div class="txt">{{ item.productKeyVals }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: "comment-list",
  components: {},
  props: ["list"],
  data() {
    return {};
  },
  computed: {
    ...mapState(["defaultAvatar"]),
  },
  methods: {},
};
</script>

<style scoped lang="less">
.wrap-comments {
  .comment-item {
    height: 279px;
    border-radius: 4px;
    border: 1px solid #D5D8DE;
    padding: 20px;
    .flex();
    align-items: start;

    .left {
      .flex();

      .avatar {
        width: 64px;
        height: 64px;
        border-radius: 50%;
      }

      .info {
        margin-left: 24px;
        .flex();
        flex-direction: column;
        align-items: start;
        span:nth-child(1) {
          font-family: Roboto, Roboto;
          font-weight: 400;
          font-size: 14px;
          color: #666666;
          line-height: 24px;
        }

        span:last-child {
          font-family: Roboto, Roboto;
          font-weight: 400;
          font-size: 12px;
          color: #666666;
          line-height: 24px;
        }
      }
    }

    .right {
      margin-left: 50px;
      .content {
        margin-top: 10px;
      }

      .img-list {
        margin-top: 20px;
        .flex();
        .img-item {
          width: 100px;
          height: 100px;
          margin-right: 10px;
        }
      }

      .txt {
        margin-top: 10px;
        font-family: Roboto, Roboto;
        font-weight: 400;
        font-size: 14px;
        color: #999999;
        line-height: 18px;
      }
    }
  }
}
</style>
