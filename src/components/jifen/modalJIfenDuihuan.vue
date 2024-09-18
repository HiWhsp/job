<template>
    <div class="modal-container">
        <el-dialog
                class="modal-duihuan"
                title="积分兑换"
                width="580px"
                custom-class="modal-wrap"
                :close-on-click-modal="true"
                :visible.sync="showModal"
                :before-close="onModal_close"
        >
            <div class="modal-inner">
                <div class="img-box">
                    <img :src="detail.image" alt=""/>
                </div>
                <!-- <div class="tip">请您输入要兑换的积分商品数量。</div> -->
                <div class="form-box">
                    <div class="input-box">
                        <span class="label">兑换数量</span>
                        <input type="text" placeholder="" v-model="number"/>
                    </div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
        <button class="btn-ripple quxiao" @click="showModal = false">取消</button>
        <button class="btn-ripple queding" @click="confirm_duihuan">确认</button>
      </span>
        </el-dialog>
    </div>
</template>

<script>
import {mapState} from "vuex";

export default {
    name: "commonShare",
    components: {},
    props: ["curr"],
    data() {
        return {
            showModal: false,
            // showModal: true,
            number: 1,
            detail: {},
        };
    },
    computed: {
        ...mapState(["baseInfo"]),
    },
    watch: {
        showModal(val) {
            if (!val) {
                this.number = 1;
                this.detail = {};
            }
        },
    },

    beforeDestroy() {
        clearInterval(this.timer);
        this.timer = null;
    },

    methods: {
        init(data) {
            //console.log("设置余额密码", { ...data });
            this.detail = data;
            this.showModal = true;
        },

        onModal_close() {
            this.showModal = false;
        },
        //确认兑换
        confirm_duihuan() {
            if (!this.number) {
                alertErr("请输入要兑换的积分商品数量");
                return;
            }

            var item = {...this.detail};

            let {image, inventoryId, jifen, key_vals, title} = item;

            var payment_products =
                {
                    num: this.number, //数量
                    inventoryId,
                };

            this.$api("jiFen_order", {
                ...payment_products,
            }).then((res) => {
                let {code, data, pages, msg} = res;
                if (code == 200) {
                    this.showModal = false;
                    this.$message.success('兑换成功');
                } else {
                    this.$message.error(msg);
                }
            });

        },
    },
};
</script>

<style scoped lang="less">
/deep/ .sms-box .label {
  width: 120px; /*no */
  color: #333;
}

.modal-wrap {
  .modal-inner {
    padding: 20px;
    padding: 0 20px;
    text-align: left;

    .tip {
      color: @theme;
      margin-bottom: 20px;
    }

    .img-box {
      .flex-center();
      margin-bottom: 20px;

      img {
        width: 150px;
        height: 150px;
        object-fit: cover;
      }
    }
  }
}

.input-wrap {
  width: 400px;
  margin: 0 auto;
}

.input-box {
  position: relative;
  margin-bottom: 20px;
  width: 70%;
  margin: 0 auto;
  height: 50px;
  background: #ffffff;
  border: 1px solid #eeeeee;
  border-radius: 4px;
  .flex();
  overflow: hidden;

  .label {
    display: inline-block;
    width: 120px; /*no */
    border-right: 1px solid #ccc;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: 24px;
    color: #333;
    text-indent: 1em;
  }

  .val {
    text-align: left;
    padding-left: 16px;
  }

  img {
    width: 36px;
  }

  input {
    flex: 2;
    height: 100%;
    padding-left: 16px;
    font-size: 14px;
    color: #000;

    &::-webkit-input-placeholder {
      font-size: 14px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      font-weight: 400;
      color: #d7d7d7;
    }
  }
}

/deep/ .el-dialog__header {
  border-bottom: 1px solid #eee;
  // background: @theme;
  background: #f7f7f7;
  text-align: left;

  .el-dialog__title {
    color: #fff;
    color: #333;
  }

  .el-dialog__headerbtn .el-dialog__close {
    color: #fff;
    color: #333;
  }
}

/deep/ .el-dialog__footer {
  text-align: center;

  button {
    width: 128px;
    height: 40px;
    background: #ffffff;
    border: 1px solid #eeeeee;
    font-size: 14px;
  }

  .quxiao {
    margin-right: 24px;
    // margin-right: 20px;
    font-size: 14px;
    font-family: Microsoft YaHei-Regular, Microsoft YaHei;
    font-weight: 400;
    color: @theme;
    border: 1px solid @theme;
  }

  .queding {
    background: @theme;
    color: #fff;
  }
}

.btn-validate-box {
  background: transparent;
  position: absolute;
  right: 0;
  .flex();
  cursor: pointer;
  color: @theme;

  &.disabled {
    color: #ccc;
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/modals/modalJIfenDuihuan.less"></style>
