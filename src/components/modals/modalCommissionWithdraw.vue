<template>
  <div class="sixin-container">
    <el-dialog title="确认提现" width="350px" :visible.sync="show" :before-close="onModal_close" :close-on-press-escape="false" :close-on-click-modal="false" custom-class="modal-custom">
      <div class="modal-inner">
        <div class="title">提现</div>
        <div class="input-box">
          <input type="text" v-model="money" placeholder="请输入提现金额" />
        </div>
        <div class="item">
          <span class="text">服务费</span>
          <span class="text">{{vuex_huobi}}0.50</span>
        </div>
        <div class="item">
          <span class="text">费率</span>
          <span class="text">5%</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button class="quxiao" @click="show = false">取 消</el-button> -->
        <el-button class="queding" @click="confirm_widthdraw">提现</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "address-add",
  components: {},
  props: [],
  data() {
    return {
      show: false,
      money: "",
    };
  },
  computed: {
    ...mapState([""]),
  },
  watch: {},

  methods: {
    init() {
      this.show = true;
    },

    confirm_widthdraw() {
      this.show = false;
      alertErr("暂不提供PC端提现功能，请使用小程序的提现功能");
    },
    onModal_close() {
      this.show = false;
    },
  },
};
</script>


<style scoped lang="less">
/deep/ .el-dialog__title {
  font-weight: bold;
}
/deep/ .el-dialog__headerbtn {
  .el-dialog__close {
    font-size: 24px;
    font-weight: bold;
  }
}

.biaoqing-box {
  text-align: left;
  margin-top: 10px;
}
/*私信 */
/deep/ .modal-custom {
  min-width: 350px;
  .modal-inner {
    padding: 0 20px;

    .title {
      font-size: 18px;
    }

    .input-box {
      margin-top: 15px;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 1px solid #ddd;
      input {
        width: 100%;
        text-align: center;
        font-size: 28px;

        &::-webkit-input-placeholder {
          font-size: 20px;
        }
      }
    }

    .item {
      margin-top: 20px;
      .flex-between();
      font-size: 14px;
    }
  }
}

/deep/ .el-dialog__header {
  border-bottom: 1px solid #eee;
}

/deep/ .el-textarea {
  .el-textarea__inner {
    background-color: #f5f5f5;
  }
}
/deep/ .el-input {
  .el-input__inner {
    background: #f2f2f2;
    &:disabled {
      background-color: #eee;
      color: #666;
    }
  }
}

/deep/ .el-dialog__footer {
  text-align: center;

  .quxiao {
    width: 270px;
    background: #fff;
    border-radius: 3px;

    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: 300;
    color: #414040;
    border-color: #aaa;
  }
  .queding {
    width: 270px;
    background: @theme;
    border-radius: 3px;

    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: 300;
    color: #ffffff;
  }
}
</style>
