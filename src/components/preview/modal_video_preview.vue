<template>
  <div class="modal-custom-base-wrap">
    <el-dialog
      :title="modalTitle || '视频预览'"
      width="800px"
      custom-class="modal-custom-base"
      :close-on-click-modal="false"
      :visible.sync="show"
      :before-close="onModalClose"
    >
      <div class="modal-ctx">
        <div class="html-wrap">
          <!-- 作品类型 ： 视频 -->
          <div class="video-box" data-type="视频">
            <div id="dplayer"></div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="show = false">关闭</el-button>
        <!-- <el-button type="primary" @click="form_submit()">确 定</el-button> -->
      </span>
    </el-dialog>
  </div>
</template>

<script>
import DPlayer from "dplayer";

import { mapState } from "vuex";
export default {
  name: "modal-hetong",
  components: {},
  props: {},
  data() {
    return {
      show: false,
      pageActionType: "",
      modalTitle: "",
      detail: {},
    };
  },
  computed: {
    // modal_title() {
    //   return "回复列表";
    // },
  },
  watch: {
    show(val) {
      if (!val) {
        this.pageActionType = "";
        this.modalTitle = "";
        this.pageData = {};
      }
    },
  },
  created() {},
  mounted() {},
  methods: {
    async init(option) {
      console.warn("初始参数 [option]", JSON.parse(JSON.stringify(option)));
      this.detail = option;
      this.show = true;
      this.initVideo();
    },

    initVideo() {
      this.$nextTick(() => {
        const dp = new DPlayer({
          container: document.getElementById("dplayer"),
          video: {
            url: this.detail.url,
            // pic: this.detail.videoCover,
          },
        });
      });
    },

    onModalClose() {
      this.show = false;
    },
  },
};
</script>

<style scoped lang="less">
/deep/ .modal-custom-base {
  margin-top: 50px !important;

  .el-dialog__header {
    display: flex;
		align-items: center;
		justify-content: space-between;
    border-bottom: 1px solid #eee;
    // background: #a98c4d;
    // background: #f7f7f7;
    // height: 50px;
    // line-height: 50px;
    // padding: 0 15px;
    // font-size: 14px;
    // color: #333;

    .el-dialog__title {
      color: #000;
    }
    .el-dialog__headerbtn {
      // top: 0;
      .el-dialog__close {
        color: #000;
        font-size: 20px;
        font-weight: bold;
      }
    }
  }

  .el-dialog__body {
    padding: 30px 40px;
    padding: 0px 15px;
    max-height: calc(100vh - 100px - 150px);
    overflow-y: auto;
    &::-webkit-scrollbar-thumb {
      border-radius: 5px;
      border: 8px solid #409eff;
      background: #fff;
    }
    &::-webkit-scrollbar {
      width: 8px;
      height: 0px;
    }
  }

  .el-dialog__footer {
    // text-align: center;
    border-top: 1px solid #eee;
  }
}

.modal-ctx {
  // padding: 30px 50px;
  // max-height: 60vh;
  // overflow-y: auto;
  // border-bottom: 1px solid #ddd;
}

// 处理表单样式
/deep/ .el-upload {
  // width: auto;
}

/deep/ .el-upload-list__item {
  // padding: 0 10px;
  // height: 32px;
  // line-height: 32px;
  background: #eef6ff !important;
  font-size: 16px;
}

.html-wrap {
  padding: 30px;

  .news-title {
    text-align: center;
    font-size: 18px;
    color: #333;
    font-weight: bold;
  }
  .news-desc {
    text-align: center;
    margin-top: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid #ccc;
    margin-bottom: 20px;
    font-size: 14px;
    color: #999;
  }
}

.photo-box {
  .photo-item {
    text-align: center;
    .image {
      max-width: 500px;
      max-height: 500px;
    }
  }
}

.heji-box {
  .lunbo-box {
    .image-box {
      text-align: center;
      .image {
      }
    }
  }
}
</style>
