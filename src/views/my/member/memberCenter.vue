<template>
  <div class="page">
    <div class="section-1">
      <div class="left">
        <div class="avatar-box">
          <div class="img-box">
            <!-- <cusUploader col="uploadimg"> -->
            <div class="user-avatar" @click="toRoute('/my-info')">
              <img v-if="userAvatar" :src="userAvatar" alt />
              <img v-else src="@img/avatar.png" alt />
            </div>
            <!-- </cusUploader> -->
          </div>
        </div>

        <div class="info-box">
          <div class="text-1">Hi! {{ baseInfo.name }}</div>
          <div class="text-2">
            <span>
              {{ baseInfo.name }}
            </span>
          </div>
        </div>
      </div>

      <div class="right">
        <div class="progress-box">
          <div class="progress-shuoming">
            <div class="shuoming-left">{{ curr_level.title }}</div>
            <div class="shuoming-center" v-if="level_id != 74">
              <img src="@img/my/level-arrow.png" alt="" />
            </div>
            <div class="shuoming-right">{{ next_level.title }}</div>
          </div>
          <div class="progress-item">
            <div class="progress">
              <div class="left" :style="progress_style"></div>
              <div class="right"></div>
            </div>
            <div class="progress-title">
              <div class="progress-title-left">{{ next_level.content }}</div>
              <div class="progress-title-right">
                {{ progress_number_info }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import cusUploader from "@/components/uploader/cusUploader.vue"; //上传

import listGood from "@/components/goods/listGood.vue"; //
import { mapState } from "vuex";

export default {
  name: "servicePage",
  components: {
    listGood,
    cusUploader,
  },
  data() {
    return {
      pagination: {
        page: "1",
        pageNum: "8",
      },
      user_index: {}, //用户首页数据

      list_order: [],
      list_goods: [],

      uploadImg: "",
      youhui_code: "",
      youhui_msg: "",
    };
  },
  computed: {
    ...mapState(["defaultAvatar", "baseInfo"]),
    userAvatar() {
      return this.uploadImg || this.baseInfo.user_image;
    },

    curr_level() {
      return this.baseInfo.curr_level || {};
    },
    next_level() {
      return this.baseInfo.next_level || {};
    },

    progress_style() {
      let obj = {};
      if (this.next_level.jifen) {
        let curr_val = this.next_level.jifen - this.next_level.differ;
        let percentage = (curr_val / this.next_level.jifen).toFixed(0) + "%";
        obj = { width: percentage };
      } else {
        obj = { width: "100%" };
      }

      return obj;
    },

    level_id() {
      return this.baseInfo.level_id;
    },

    role() {
      return this.baseInfo.level_title;
    },

    progressInfo() {
      //数据 differ 是 还差多少 升级
      let next_level = this.baseInfo.next_level || {};
      let percentage = (100 / 100).toFixed(0) + "%";

      let info = {
        from: this.baseInfo.level,
        to: next_level.title,
      };
      let list = [];
      if (this.level_id == 72) {
        list = [
          {
            percentage: percentage,
            text_1: "升级会员，享受更多权益",
          },
        ];
      }
      if (this.level_id == 74) {
        list = [
          {
            percentage: percentage,
            text_1: "您已是最高等级会员，享受最高等级优惠",
          },
        ];
      }

      let progressInfo = {
        info: info,
        list: list,
      };

      return progressInfo;
    },

    progressLevel() {
      return this.progressInfo.info;
    },
    progressList() {
      return this.progressInfo.list;
    },

    progress_number_info() {
      // debugger
      if (!this.next_level.jifen) {
        return this.curr_level.jifen;
      } else {
        return `(${this.curr_level.jifen}/${this.next_level.jifen})`;
      }
    },
  },
  created() {
    this.setView();
  },
  methods: {
    uploadSuccess(col, data) {
      //console.log("父组件接收", col, data);

      if (data.code == 200) {
        this.uploadImg = data.image;
      }
    },

    setView() {
      this.$store.dispatch("query_user");
    },
  },
};
</script>


<style scoped lang="less">
/deep/ .box-wrap .list .item:nth-child(4n) {
  margin-right: 0;
}
/deep/ .box-wrap .list .item:nth-child(5n) {
  margin-right: 10px;
}

/deep/ .box-wrap .list .item {
  margin-top: 10px;
}
/deep/ .box-wrap .list .item:nth-child(-n + 4) {
  margin-top: 10px;
}

.section-1 {
  .flex();
  min-height: 200px;
  background: #111111;
  border: 1px solid #707070;
  padding: 50px;

  .left {
    flex: 2;
    .flex();
    .img-box {
      img {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        object-fit: cover;
        cursor: pointer;
      }
    }

    .info-box {
      text-align: left;
      padding-left: 15px;
      .text-1 {
        font-size: 16px;
        color: #fff;
      }
      .text-2 {
        margin-top: 10px;
        span {
          display: inline-block;
          min-width: 26px;
          padding-left: 0;

          height: 16px;
          line-height: 16px;
          // background: #c78d66;
          opacity: 1;
          border-radius: 2px;
          font-size: 24px;
          font-size: 16px;

          color: #fff;
        }
      }
    }
  }

  .right {
    width: 500px;
  }
}

.page {
  padding-bottom: 70px;
}

.progress-box {
  padding: 0 10px;
  .progress {
    width: 100%;
    height: 4px;
    background: #707070;
    .flex-between();
    position: relative;

    .left {
      position: absolute;
      left: 0;
      height: 100%;
      background: #ffd89e;
    }
    .right {
    }
  }

  .progress-shuoming {
    .flex-between();
    margin-top: 10px;
    margin-bottom: 10px;
    font-size: 16px;
    .shuoming-left {
      color: #ffd89e;
    }
    .shuoming-center {
      img {
        width: 50px;
      }
    }
    .shuoming-right {
      color: #ffffff;
    }
  }

  .progress-title {
    .flex-between();
    font-size: 14px;
    margin-top: 15px;
    margin-bottom: 20px;
    .progress-title-left {
      color: #ffffff;
    }
    .progress-title-right {
      color: #ffd89e;
    }
  }
}
</style>
