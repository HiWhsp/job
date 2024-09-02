<template>
  <div class="modal-container">
    <el-dialog :title="modal_title" width="1280px" custom-class="modal-wrap" :close-on-click-modal="false" :visible.sync="show" :before-close="onModalClose">
      <div class="modal-inner">
        <div class="html-box" v-html="detail.content"></div>
      </div>
      <span slot="footer" class="dialog-footer">
        <button class="" @click="show = false">关闭</button>
        <!-- <button class="queding" @click="onConfirm">确认</button> -->
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "modal-terms",
  components: {},
  props: [],
  data() {
    return {
      show: false,
      id: "",
      detail: {},
    };
  },
  computed: {
    ...mapState(["baseInfo"]),

    modal_title() {
      return this.detail.title;
    },
  },
  watch: {
    show(val) {
      if (val) {
      }
    },
  },

  methods: {
    onModalClose() {
      this.show = false;
    },
    init(id) {
      this.id = id;
      this.queryDetail();
    },

    queryDetail() {
      this.$api("index_newsDetail", {
        id: this.id,
      }).then((res) => {
        //console.log("协议内容", res);
        let { code, data, msg } = res;
        if (code == 200) {
          this.detail = data.info;
          this.show = true;
        }
      });
    },

    onConfirm() {
      this.show = false;
    },
  },
};
</script>


<style scoped lang="less">
/deep/ .el-dialog {
  margin-top: 7.5vh !important;
  height: 85vh;
}

.modal-wrap {
  .modal-inner {
    padding: 20px;

    .html-box {
      height: calc(85vh - 140px);
      overflow-y: scroll;
      padding: 0 30px;
      text-align: center;
      font-size: 14px;
      color: #333333;
    }
  }
}

/deep/ .el-dialog__header {
  border-bottom: 1px solid #eee;
  background: #4CA5E4;
  height: 40px;
  line-height: 40px;
  padding: 0;
  .flex-center();

  .el-dialog__title {
    color: #fff;
  }
  .el-dialog__headerbtn {
    top: 10px;
    .el-dialog__close {
      color: #fff;
      font-weight: bold;
    }
  }
}

/deep/ .el-dialog__body {
  padding: 0;
}

/deep/ .el-dialog__footer {
  .flex-center();
  text-align: center;
  padding: 0;
  height: 50px;

  button {
    width: 140px;
    height: 40px;
    // background: #036dd1;
    background: #fff;
    opacity: 1;
    border-radius: 0;
    border: 1px solid #4CA5E4;
    color: #4CA5E4;
    cursor: pointer;

    & + button {
      margin-left: 30px;
    }
  }

  .queding {
    background: #4CA5E4;
    border: 1px solid #aaa;
    color: #fff;
  }
}
</style>
