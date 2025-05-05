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
                    <img :src="detail.images ? detail.images[0] : ''" alt=""/>
                </div>

                <div class="section-ctx">
                    <div class="address-list p-l-30">
                        <div class="address-item" v-for="(item, index) in list_address" :key="index"
                             :class="{ active: item.id == address_selected.id }" @click="do_toggle_address(item)">
                            <div class="address-top">{{ item.name_phone }}</div>
                            <div class="address-bottom">
                                {{ item.full_addr }}
                            </div>
                            <img src="@/static/order/addr-select.png" alt="" class="marker"/>
                        </div>
                        <div v-if="list_address.length == 0" class="empty-dev">还没有收件地址</div>
                    </div>
                    <!--                    <div class="btn-box p-l-30">-->
                    <!--                        <button class="btn-ripple" @click="open_addr_add()">+ 新增地址</button>-->
                    <!--                    </div>-->
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
import {SHOP_TYPE} from "@/config/env";

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
            address_selected: {},
            list_address: []
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
            this.detail = data;
            this.showModal = true;
            this.query_address();
        },
        //获取地址列表
        query_address() {
            this.$api({
                url: '/service.php',
                method: 'get',
                data: {
                    action: 'userAddress_lists',
                    page: 1,
                    pagenum: 20
                },
            }).then(res => {
                if (res.code == 200) {
                    let data = res.data
                    data.forEach((v) => {
                        if (SHOP_TYPE == 'foreign') {//海外商城
                            v.full_addr = [v.country, v.province, v.city, v.area, v.address].filter(v => !!v).join(',');
                            v.name_phone = `${v.firstName} ${v.lastName} (${v.phone})`
                        } else {
                            v.full_addr = [v.country, v.province, v.city, v.area, v.address].filter(v => !!v).join(',');
                            v.name_phone = `${v.name} (${v.phone})`
                        }
                    });
                    this.list_address = data;

                    let obj = data.find((v) => v.moren) || {};
                    this.address_selected = obj || {};
                }
            })
        },
        //选择收货地址
        do_toggle_address(item) {
            this.address_selected = item;
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
            if (!this.address_selected.id) {
                alertErr("请选择收货地址");
                return;
            }

            var item = {...this.detail};

            let {image, inventoryId, jifen, key_vals, title} = item;

            var payment_products =
                {
                    num: this.number, //数量
                    inventoryId,
                    addressId: this.address_selected.id,
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

.section-ctx {
  margin-top: 24px;
  margin-bottom: 20px;

  .address-list {
    display: flex;
    overflow: hidden;
    overflow-x: auto;
    width: 500px;
    height: 160px;

    .address-item {
      position: relative;
      min-width: 250px;
      height: 100px;
      background: #FFFFFF;
      border: 2px solid @theme;
      margin-top: 20px;
      margin-right: 45px;
      min-height: 130px;
      padding: 15px 20px;
      border-radius: 4px 4px 4px 4px;
      overflow: hidden;
      cursor: pointer;


      &:nth-child(3n) {
        margin-right: 0;
      }

      &:nth-child(-n + 3) {
        margin-top: 0;
      }

      &.active {
        border: 2px solid @theme;

        .marker {
          display: block;
        }
      }

      .marker {
        position: absolute;
        right: -1px;
        bottom: -1px;
        display: none;
      }

      .address-top {
        padding-bottom: 15px;
        border-bottom: 1px solid #d5d8de;
        font-size: 14px;
        font-family: Roboto, Roboto;;
        font-weight: 400;
        color: #000000;
      }

      .address-bottom {
        padding-top: 15px;
        font-size: 14px;
        font-family: Roboto, Roboto;;
        font-weight: 400;
        color: #999999;
      }
    }

    .empty-dev {
      font-family: Roboto, Roboto;
      font-weight: 400;
      font-size: 16px;
      color: #333333;
      font-style: normal;
      text-transform: none;
    }
  }

  .btn-box {
    margin-top: 25px;

    button {
      width: 124px;
      height: 32px;
      background: #FFFFFF;
      border-radius: 2px 2px 2px 2px;
      border: 1px solid @theme;
      font-size: 14px;
      font-weight: normal;
      color: @theme;
    }
  }

  .invoice-info {
    padding-left: 120px;
    margin-top: 31px;

    .info-item {
      .flex();
      margin-top: 26px;

      .info-label {
        width: 100px;
        text-align: right;
        margin-right: 18px;
        color: #666;

        span {
          color: #FF5F00;
        }
      }
    }
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/modals/modalJIfenDuihuan.less"></style>
