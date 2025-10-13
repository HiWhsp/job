<template>
  <div class="modal-container">
    <el-dialog
      title="下载模板"
      width="596px"
      custom-class="modal-custom"
      :close-on-click-modal="false"
      :visible.sync="show"
      :before-close="onModalClose"
    >
      <div class="modal-inner">
        <div class="modal-ctx">
          <div class="type-list flex">
            <div class="type-item column-flex-center" @click="toLink(1)">
              <div class="icon-box">
                <img src="@img/common/download.png" alt="" />
              </div>
              <div class="title">批量询价模板</div>
            </div>
            <div class="type-item column-flex-center" @click="toLink(2)">
              <div class="icon-box">
                <img src="@img/common/download.png" alt="" />
              </div>
              <div class="title">批量员工模板</div>
            </div>
          </div>
        </div>
      </div>
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
      passwd: "",
      passwdConfirm: "",
      passWarn: "",
      links: {},
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getLink();
  },
  methods: {
    init(info) {
      this.show = true;
      console.log(info);
    },
    onModalClose() {
      this.show = false;
    },

    onConfirm() {
      this.show = false;
      this.$router.back();
    },
    getLink() {
      this.$api({
        url: "/service.php",
        method: "post",
        data: {
          action: "product_getXunjiaTemp",
        },
      }).then((res) => {
        console.log(res);
        this.links = res.data;
      });
    },
    toLink(mode) {
      if (mode === 1) {
        let path = "" + this.links.productTemplate;
        window.location.href = path;
      }
      if (mode === 2) {
        let path = "" + this.links.stuffTemplate;
        window.location.href = path;
      }
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
          color: #F74747;
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
    border: 1px solid #F74747;
    font-family: Arial, Arial;
    font-weight: 400;
    font-size: 14px;
    color: #F74747;

    & + button {
      margin-left: 20px;
    }
  }

  .btn-bg {
    background: #F74747;
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
  color: #F74747;
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