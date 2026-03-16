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
          <div class="sec-addr">
            <div class="sec-title">选择收货人地址</div>
            <div class="sec-ctx">
              <div class="address-list" v-if="address_list.length">
                <div
                  class="address-item"
                  v-for="(item, index) in address_list"
                  :key="index"
                  :class="{ active: item.id == address_select.id }"
                  @click="do_toggle_address(item)"
                >
                  <div class="address-top">{{ item.name_phone }}</div>
                  <div class="address-bottom">
                    {{ item.full_addr }}
                  </div>
                  <img src="@img/order/addr-select.png" alt="" class="marker" />
                </div>
              </div>
              <div class="addr-add">
                <div class="empty-title" v-if="!address_list.length">
                  还没有收件地址
                </div>
                <button class="btn btn-ripple" @click="open_addr_add()">
                  + 新增地址
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <button class="btn-ripple fit-text" @click="show = false">取消</button>
        <button class="btn-ripple fit-text btn-bg" @click="form_submit()">
          确定
        </button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { SHOP_TYPE } from "@/config/env.js";
export default {
  name: "reg-type-modal",
  components: {},
  // props: [""],
  data() {
    return {
      show: false,
      order_id: "",
      pagination_address: {
        page: 1,
        pagenum: 20,
      },
      info: {},
      address_list: [], //地址列表
      address_select: {},
    };
  },
  computed: {},
  watch: {},
  methods: {
    init(val) {
        console.log(val);
        
      this.show = true;
      this.info = val;
      this.query_address();
    },
    onModalClose() {
      this.show = false;
    },

    onConfirm() {
      this.show = false;
      this.$router.back();
    },
    open_addr_add() {
      this.$router.push("/address-list");
    },
    //选择收货地址
    do_toggle_address(item) {
      this.address_select = item;
    },
    //获取地址列表
    query_address() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "userAddress_lists",
          ...this.pagination_address,
          // shop_id: this.id,
        },
      }).then((res) => {
        if (res.code == 200) {
          let data = res.data;

          data.forEach((v) => {
            if (SHOP_TYPE == "foreign") {
              //医买买
              v.full_addr = [v.country, v.province, v.city, v.area, v.address]
                .filter((v) => !!v)
                .join(",");
              v.name_phone = `${v.firstName} ${v.lastName} (${v.phone})`;
            } else {
              v.full_addr = [v.country, v.province, v.city, v.area, v.address]
                .filter((v) => !!v)
                .join(",");
              v.name_phone = `${v.name} (${v.phone})`;
            }
          });
          this.address_list = data;

          let obj = data.find((v) => v.if_default) || {};
          this.address_select = obj || {};
        }
      });
    },
    form_submit() {
        if(!this.address_select.id){
            alert('请选择收货地址')
        }
      let productInfo = JSON.stringify([
        {
          inventoryId: this.info.inventoryId,
          productId: this.info.productId,
          num: this.info.num,
        },
      ]);

      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "orders_create",
          productInfo: productInfo,
          addressId: this.address_select.id || "",
          peisongType: 1, //配送类型：1-快递物流 2-上门自提
          peisongTime: "", //配送时间
          yhqId: "", //优惠券记录ID
          tuanId: "", //参与拼团的团ID
          tuanType: "", //拼团类型：0-普通订单 1-普通团 2-社区团
          remark: "", //备注
        },
      }).then((res) => {
        if (res.code == 200) {
          let { id, orderNo } = res.data;
          this.order_id = id;
          this.do_pay();
        }
      });
    },
    do_pay() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "pay_change",
          orderId: this.order_id,
          cardId: this.info.cardId,
          orderType: 1,
        },
      }).then((res) => {
        if (res.code == 200) {
          alertSucc("兑换成功");
        } else {
          alertErr(res.msg);
        }
        this.show = false;
      });
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
    height: 500px;
    overflow-y: auto;
    .sec-addr {
      padding-bottom: 55px;
      text-align: left;

      .sec-title {
        margin-bottom: 20px;
        padding-bottom: 16px;
        border-bottom: 1px solid #d5d8de;
        font-family: Poppins, Poppins;
        font-weight: 400;
        font-size: 24px;
        color: #333333;
      }

      .sec-ctx {
      }

      .address-list {
        display: flex;
        flex-wrap: wrap;

        .address-item {
          position: relative;
          margin-top: 20px;
          margin-bottom: 20px;
          width: 100%;
          min-height: 130px;
          padding: 15px 20px;
          background: #ffffff;
          border-radius: 4px 4px 4px 4px;
          border: 2px solid #d5d8de;
          overflow: hidden;
          cursor: pointer;

          &:nth-child(3n) {
            margin-right: 0;
          }
          &:nth-child(-n + 3) {
            margin-top: 0;
          }

          &.active {
            border: 2px solid #ff0000;

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
            font-family: Poppins, Poppins;
            font-weight: 400;
            color: #000000;
          }

          .address-bottom {
            padding-top: 15px;
            font-size: 14px;
            font-family: Poppins, Poppins;
            font-weight: 400;
            color: #505050;
          }
        }
      }

      .addr-add {
        margin-top: 32px;
        padding-left: 32px;

        .empty-title {
          margin-bottom: 40px;
          font-family: Poppins, Poppins;
          font-weight: 400;
          font-size: 16px;
          color: #333333;
        }

        .btn {
          min-width: 124px;
          height: 32px;
          background: #ffffff;
          border-radius: 2px 2px 2px 2px;
          border: 1px solid #009f39;
          font-family: Poppins, Poppins;
          font-weight: 400;
          font-size: 14px;
          color: #009f39;
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
    border: 1px solid #009f39;
    font-family: Poppins, Poppins;
    font-weight: 400;
    font-size: 14px;
    color: #009f39;

    & + button {
      margin-left: 20px;
    }
  }

  .btn-bg {
    background: #009f39;
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
  color: #009f39;
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

<style
  scoped
  lang="less"
  src="@/assets/h5css/modals/phone_bind_modal.less"
></style>
