<template>
  <div class="modal-container">
    <el-dialog
      title="会员注册"
      width="596px"
      custom-class="modal-custom"
      :close-on-click-modal="false"
      :visible.sync="show"
      :before-close="onModalClose"
    >
      <div class="modal-inner">
        <div class="modal-ctx">
          <div class="type-list flex">
            <div class="type-item column-flex-center" @click="decideMode(2)">
              <div class="icon-box">
                <img src="@img/register/reg-company.png" alt="" />
              </div>
              <div class="title">我是企业</div>
            </div>
            <div class="type-item column-flex-center" @click="decideMode(1)">
              <div class="icon-box">
                <img src="@img/register/reg-geren.png" alt="" />
              </div>
              <div class="title">我是个人</div>
            </div>
          </div>
        </div>
      </div>
      <!-- <span slot="footer" class="dialog-footer">
                <button class="btn-ripple fit-text" @click="show = false">取消</button>
                <button class="btn-ripple fit-text btn-bg" @click="form_submit()">修改</button>
            </span> -->
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "reg-type-modal",
  components: {},
  // props: [""],
  data() {
    return {
      show: false,
    };
  },
  computed: {},
  watch: {},
  methods: {
    init(text) {
      this.show = true;
    },
    onModalClose() {
      this.show = false;
    },

    onConfirm() {
      this.show = false;
      this.$router.back();
    },
    decideMode(mode) {
      this.$emit("confirm", mode);
      this.show = false;
    },
  },
};
</script>

<style scoped lang="less">
/deep/ .modal-custom {
  .modal-inner {
    padding: 0;
  }

  .modal-ctx {
    .type-list {
      .type-item {
        cursor: pointer;
        width: 331px;
        height: 231px;
        background: #f5f5f5;
        border-radius: 10px 10px 10px 10px;

        & + .type-item {
          margin-left: 60px;
        }

        .icon-box {
          img {
            width: 70px;
          }
        }

        .title {
          margin-top: 20px;
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: 400;
          font-size: 24px;
          color: #3B64FC;
        }
      }
    }
  }
}

/deep/ .el-dialog__header {
  text-align: center;
  padding: 16px 24px;
  border-bottom: 1px solid #eee;
  background: #f7f7f7;

  font-family: Poppins, Poppins;
  font-weight: 600;
  font-size: 18px;
  color: #333333;

  .el-dialog__close {
    font-size: 20px;
  }
}

/deep/ .el-dialog__body {
  padding: 70px 60px;
}

/deep/ .el-dialog__footer {
  text-align: center;
  padding-bottom: 50px;

  button {
    min-width: 120px;
    height: 32px;
    background: #ffffff;
    border-radius: 50px 50px 50px 50px;
    border: 1px solid #3B64FC;
    font-family: Arial, Arial;
    font-weight: 400;
    font-size: 14px;
    color: #3B64FC;

    & + button {
      margin-left: 20px;
    }
  }

  .btn-bg {
    background: #3B64FC;
    color: #ffffff;
  }
}

.btn-send {
  // position: absolute;
  // right: -50px;
  // top: 10px;
  min-width: 90px;
  padding: 0 10px;
  height: 40px;
  background: #fff;
  color: #3B64FC;
  font-size: 14px;
  margin-left: 15px;
  border-radius: 5px;

  &:disabled {
    background: #eee;
    color: #999;
    cursor: not-allowed;
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/modals/phone_bind_modal.less"></style>