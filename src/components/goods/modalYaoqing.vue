<template>
  <div class="modal-container">
    <el-dialog
      title="分享"
      width="500px"
      custom-class="modal-wrap"
      :close-on-click-modal="false"
      :visible.sync="showModal"
      :before-close="onModal_close"
    >
      <div class="modal-inner">
        <!-- <div class="text-1">折上折</div> -->
        <!-- <div class="text-2">邀请两个好友注册砍价，第一刀砍个位归0，第二刀砍十位归0。</div> -->
        <div class="text-3">分享链接：</div>
        <div class="text-3">
          <a :href="link" target="_black">{{ link }}</a>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <button class="queding" @click="copy_link" v-copy="link">
          复制链接
        </button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";

let userId = localStorage.getItem("userId") || "";
let cutId = sessionStorage.getItem("cutId") || "";
const registerLink = location.href;

export default {
  name: "modal-yaoqing",
  components: {},
  props: ["curr"],
  data() {
    return {
      inventoryId: "",
      showModal: false,
      link: registerLink,
    };
  },
  computed: {
    ...mapState(["baseInfo"]),

    firstImage() {
      let src = "";
      if (this.curr && this.curr.images && this.curr.images.length) {
        src = this.curr.images[0];
      }

      return src;
    },
  },
  watch: {
    showModal(val) {
      if (val) {
      }
    },
  },

  mounted() {},

  beforeDestroy() {
    clearTimeout(this.timer);
    this.timer = null;
  },

  methods: {
    init() {
      this.showModal = true;
    },

    copy_link() {
      this.showModal = false;
    },

    onModal_close() {
      this.showModal = false;
    },
  },
};
</script>


<style scoped lang="less">
.modal-wrap {
  .modal-inner {
    padding: 20px;

    .text-1 {
      font-weight: bold;
      font-size: 20px;
      color: #ff3d00;
    }
    .text-2 {
      font-size: 14px;
      color: #333333;
      margin: 12px 0 24px;
    }
    .text-3 {
      margin-bottom: 12px;
      font-size: 14px;
      color: #333;
      a {
        font-size: 14px;
        color: #FF9312;
        text-decoration: underline;
        cursor: pointer;
      }
    }
  }
}

/deep/ .el-dialog__header {
  border-bottom: 1px solid #eee;
  background: #ea5959;

  .el-dialog__title {
    color: #fff;
  }
  .el-dialog__headerbtn .el-dialog__close {
    color: #fff;
  }
}

/deep/ .el-dialog__footer {
  text-align: center;

  button {
    width: 200px;
    height: 40px;
    background: linear-gradient(90deg, #ff9312 0%, #eb5d53 100%);
    border-radius: 45px;
  }

  .queding {
    color: #fff;
    background: linear-gradient(90deg, #FF9312 0%, #EB5D53 100%);
  }
}
</style>
