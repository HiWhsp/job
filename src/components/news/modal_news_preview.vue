<template>
  <div class="modal-custom-base-wrap">
    <el-dialog
      :title="modalTitle"
      width="1200px"
      custom-class="modal-custom-base"
      :close-on-click-modal="false"
      :visible.sync="show"
      :before-close="onModalClose"
    >
      <div class="modal-ctx">
        <div class="html-wrap">
          <div class="news-title">
            {{ detail.newsTitle }}
          </div>
          <div class="news-desc">
            {{ detail.createTime }}
          </div>
          <div class="rich-box" v-html="detail.newsContents"></div>
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
      pageData: {},
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
      option = JSON.parse(JSON.stringify(option));

      let {
        //
        pageActionType,
        modalTitle,
        data,
      } = option;

      this.pageActionType = pageActionType;
      this.modalTitle = modalTitle;
      this.pageData = data;

      this.queryDetail();
    },

    queryDetail() {
      this.$api({
        url: "/app/news/information/" + this.pageData.newsId,
        method: "get",
        data: {},
      }).then((res) => {
        console.warn("新闻详情", res);
        if (res.code == 200) {
          this.detail = res.data;

          this.show = true;
        }
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
  .rich-box {
    text-align: left;
    line-height: 1.7;
    font-size: 14px;
    color: #333;

    img {
      max-width: 100%;
      display: block;
      margin: 10px auto;
    }
  }
}
</style>
