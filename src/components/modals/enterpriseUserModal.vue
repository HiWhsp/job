<template>
  <div class="modal-container">
    <el-dialog
      title="提示"
      width="580px"
      custom-class="cus-modal-wrap"
      :close-on-click-modal="true"
      :visible.sync="show_modal"
      :before-close="onBeforeClose"
    >
      <div class="modal-inner">
        <!-- 成功图标 -->
        <div class="success-icon">
          <div class="icon-circle">
            <img src="@img/common/success.png" alt="" />
          </div>
        </div>

        <!-- 主要内容 -->
        <div class="modal-body">
          <h2 class="main-title">成为{{vuex_user.userType==1?'企业用户':'兼职销售代表'}}，<br/>请前往会员中心继续完善相关资料以完成认证！</h2> 
          <p v-if="vuex_user.userType==1" class="disclaimer">只有成为企业用户才可购买第三类医疗器械产品</p>
          <p v-if="vuex_user.userType==2" class="disclaimer">只有成为兼职销售才可代表本公司开发客户并获得相应报酬</p>
        </div>
      </div>
      
      <span slot="footer" class="dialog-footer">
        <button class="btn btn-ripple btn-bg" @click="confirmAction">
          确定
        </button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "EnterpriseUserModal",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      show_modal: false,
    };
  },
  watch: {
    visible: {
      handler(newVal) {
        this.show_modal = newVal;
      },
      immediate: true,
    },
  },
  methods: {
    onBeforeClose() {
      this.show_modal = false;
      this.$emit("close");
    },
    confirmAction() {
      this.$emit("confirm");
      this.show_modal = false;
    },
  },
};
</script>

<style scoped lang="less">
/deep/ .el-dialog__header {
  padding: 16px 24px;
  border-bottom: 1px solid #eee;
  background: #f7f7f7;

  font-family: Poppins, Poppins;
  font-weight: 600;
  font-size: 18px;
  color: #333333;
  text-align: left;

  .el-dialog__close {
    font-size: 20px;
  }
}

/deep/ .el-dialog__body {
  padding: 34px 60px 53px;
}

/deep/ .el-dialog__footer {
  text-align: center;
  padding-bottom: 60px;

  button {
    margin: 0 8px;
    width: 150px;
    font-size: 18px;
    height: 46px;
    background: #fffefe;
    border-radius: 4px 4px 4px 4px;
    border: 1px solid #7853b2;
    color: #7853b2;
  }

  .btn-bg {
    width: 150px;
    height: 46px;
    background: #7853b2;
    border-radius: 4px 4px 4px 4px;
    font-family: Microsoft YaHei, Microsoft YaHei;
    font-weight: 400;
    font-size: 18px;
    color: #ffffff;
  }
}

.cus-modal-wrap {
  .modal-inner {
    padding: 0;
    text-align: center;

    .success-icon {
      margin-bottom: 17px;

      .icon-circle {
        width: 44px;
        height: 44px;
        margin: 0 auto; 
        img {
          width: 44px;
          height: 44px;
        }
      }
    }

    .modal-body {
      margin-bottom: 40px;

      .main-title {
        font-size: 20px;
        font-weight: bold;
        color: #1F1F1F;
        margin: 0 0 17px 0;
        line-height: 1.4;
      }

      .instruction {
        font-size: 16px;
        color: #333;
        margin: 0 0 15px 0;
        line-height: 1.5;
      }

      .disclaimer {
        font-size: 16px;
        color: #333;
        margin: 0;
        line-height: 1.4;
      }
    }
  }
}
</style>

