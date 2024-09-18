<template>
  <div class="modal-container">
    <el-dialog
      class="modal-invite"
      title="邀请好友"
      width="486px"
      custom-class="modal-wrap"
      :close-on-click-modal="false"
      :visible.sync="showModal"
      :before-close="onModal_close"
    >
      <div class="modal-inner">
        <div class="text-1">邀请好友赚积分</div>
        <div class="text-2">邀请好友注册成功，即得{{ invite_jifen }}积分</div>
        <div class="text-3">
          注册链接： <span class="link" :href="link" target="_black">{{ link }}</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <button class="btn-ripple queding" @click="copy_link" v-copy="link">
          复制链接
        </button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "modal-yaoqing",
  components: {},
  // props: [""],
  data() {
    let user_id = localStorage.getItem("userId") || "";
    const registerLink = location.origin + "/register?invite=" + userId || location.href;

    return {
      inventoryId: "",
      showModal: false,
      link: registerLink,
    };
  },
  computed: {
    ...mapState(["baseInfo"]),
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
      alertSucc("已复制");
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
    padding: 10px 20px;
    text-align: center;

    .text-1 {
      font-weight: bold;
      font-size: 20px;
      color: #ff3d00;
      color: #333;
    }
    .text-2 {
      font-size: 14px;
      color: #333333;
      margin: 12px 0 12px;
    }
    .text-3 {
      font-size: 14px;
      color: #333;
      .link {
        font-size: 14px;
        color: @theme;
        // text-decoration: underline;
        // cursor: pointer;
      }
    }
  }
}

/deep/ .el-dialog__header {
  border-bottom: 1px solid #eee;
  // background: #ea5959;
  background: @theme;
  height: 40px;
  .flex-between();
  padding: 0 20px;

  .el-dialog__title {
    color: #fff;
    font-size: 16px;
  }
  .el-dialog__headerbtn .el-dialog__close {
    color: #fff;
  }

  .el-dialog__headerbtn {
    top: 10px;
    font-size: 16px;
    font-weight: bold;
  }
}

/deep/ .el-dialog__footer {
  text-align: center;

  button {
    width: 200px;
    height: 40px;
    background: linear-gradient(90deg, #ff9312 0%, #eb5d53 100%);
    // border-radius: 45px;
  }

  .queding {
    color: #fff;
    background: linear-gradient(90deg, #ff9312 0%, #eb5d53 100%);
    background: @theme;
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/modals/modalInviteUser.less"></style>
