<template>
  <div class="modal-box">
    <el-dialog custom-class="modal-terms" :title="info.title" width="780px" :close-on-click-modal="false"
      :visible.sync="show" :before-close="onbeforeclose" :closed="onclosed">
      <div class="modal-inner">
        <!-- <div class="modal-title">{{ detail.title }}</div> -->
        <div class="modal-ctx">
          <div class="ctx-rich scrollbar-y">
            <div class="ctx-rich" v-html="info.content"></div>
          </div>
        </div>
        <div class="modal-footer">
          <div class="left-check">
            <label class="el-checkbox check-box" :class="{ checked: checked }" @click="checked = !checked">
              <img src="@/static/common/check0.png" alt="" class="check-0" />
              <img src="@/static/common/check1.png" alt="" class="check-1" />
              <span>登录注册即表示您已阅读并同意上述内容</span>
            </label>
          </div>
          <button :disabled="!checked" class="btn-confirm fit-text btn-ripple" @click="show = false">
            确定
          </button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "level_2_3",
  data() {
    return {
      info: {},
      show: false,
      checked: false,
      mode: "",
    };
  },
  watch: {
    show(val) {
      if (!val) {
        this.info = {};
        this.mode = "";

        document.querySelector("body").classList.remove("lock");
        document.querySelector("#app").classList.remove("lock");
      } else {
        document.querySelector("body").classList.add("lock");
        document.querySelector("#app").classList.add("lock");
      }
    },
  },

  methods: {
    onbeforeclose() {
      this.show = false;
    },
    onclosed() {
      this.info = {}
    },

    init(id) {
      this.id = id;
      this.queryDetail();
      this.show = true;
    },

    queryDetail() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "news_detail",
          id: this.id,
        }
      }).then((res) => {
        let { code, data, msg } = res;
        if (code == 200) {
          this.info = data.info;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.check-box {
  &.checked {
    .check-0 {
      display: none;
    }

    .check-1 {
      display: block;
    }
  }

  img {
    width: 20px;
    &.check-0 {
      display: block;
    }

    &.check-1 {
      display: none;
    }
  }
}

.modal-terms {
  /*margin-top: 5vh !important;*/
  height: 70vh;
  height: auto;
  max-width: 41.666667vw;
  background: #e4f5fc;
  position: relative;
  margin: 0 auto 50px;
  border-radius: 2px;
  box-shadow: 0 1px 3px #eee;
  box-sizing: border-box;
  width: 50%;
}

/deep/ .el-dialog__header {
  padding: 15px;
  border-bottom: 1px solid #ddd;
  background: #e4f5fc;
}

.el-dialog__headerbtn {
  background: transparent;
  font-size: 30px;
  border: none;
  outline: none;
  cursor: pointer;
}

/deep/ .el-dialog__body {
  color: #606266;
  font-size: 14px;
  word-break: break-all;
  height: auto;
  padding: 20px 30px;
  background: #e4f5fc;
}

.modal-title {
  margin-bottom: 1.302083vw;
  text-align: center;
  font-size: 1.197917vw;
  font-family: Microsoft YaHei-Bold, Microsoft YaHei;
  font-weight: bold;
  color: #000000;
}

.modal-ctx {
  padding: 1.041667vw;
  width: 40.479167vw;
  width: 100%;
  height: 55vh;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 0.677083vw 0.677083vw 0.677083vw 0.677083vw;
  opacity: 1;
  border: 1px solid #ccc;
  overflow-y: auto;
  overflow-x: hidden;


}

.modal-footer {
  margin: 0 auto;
  margin-top: 1.041667vw;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: none;
}

.ctx-rich {
  text-align: left;
  font-size: 14px;
  font-family: Microsoft YaHei-Regular, Microsoft YaHei;
  font-weight: 400;
  color: #000000;
  line-height: 1.5;
  /* visibility: hidden; */

  /deep/ img {
    max-width: 100%;
    margin: 15px auto;
  }
}

.btn-confirm {
  min-width: 100px;
  height: 35px;
  line-height: 35px;
  border: 1px solid #999;
  color: #999;

  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.btn-confirm:disabled {
  cursor: not-allowed;
}

.el-checkbox {
  cursor: pointer;
  .flex();

  img {
    margin-right: 5px;
  }
}

.btn-confirm:not(:disabled) {
  background: @theme;
  border-color: @theme;
  color: #fff;
}

.el-dialog__close {
  font-style: normal;
}

.el-dialog__headerbtn {
  /* display: none; */
}

@media screen and (max-width: 1199px) {
  .modal-terms {
    max-width: 100% !important;
    width: 90% !important;
    height: auto !important;
  }

  .modal-terms .modal-inner .modal-ctx {
    width: 90% !important;
    height: 55vh !important;
  }

  .modal-terms .modal-inner .modal-footer {
    width: 100% !important;
  }

  .el-dialog__body {
    padding-bottom: 15px !important;
    height: auto !important;
  }

  .ctx-rich {
    line-height: 1.7 !important;
    font-size: 12px !important;
  }

  .modal-footer {
    padding: 0 10px;
  }

  .btn-confirm {
    display: block;
    margin: 0 auto;
    width: 60px;
  }

  .modal-ctx {
    margin-top: 15px !important;
  }

  .el-dialog__header {
    padding: 0 10px;
  }

  .modal-title {
    font-size: 14px !important;
    padding-top: 10px;
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/account/terms_modal.less"></style>
