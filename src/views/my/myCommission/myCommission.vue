<template>
  <div class="page">
    <div class="main-title">
      <span>会员管理</span>
    </div>

    <div class="page-ctx">
      <div class="title-wrap">
        <div class="info flex">
          <el-upload :action="UPLOAD_ACTION" :before-upload="upload_before_upload" :data="mix_upload_data"
                     :name="UPLOAD_NAME"
                     :on-success="upload_on_success" :show-file-list="false" accept="image/*"
                     class="upload-demo">
            <img v-if="form.image" :src="form.image" class="user-avatar"/>
            <img v-else class="user-avatar" src="@/static/my/avatar.png"/>
          </el-upload>
          <span class="name">{{ my_info.realName || "未设置" }}</span>
          <div class="vip">
            <img alt="" src="@/assets/image/product/vip.png"/>
            <span>已开通</span>
          </div>
        </div>
        <div class="card">会员卡号：2023123456789</div>
        <div class="status">状态：正常</div>
        <div class="date">期限：剩余 <span>50</span> 天 2023-06-12 到期</div>
      </div>
      <div class="section">
        <div class="price-section">
          <h3>会员制度 <img alt="" src="@/assets/image/product/level.png"></h3>
          <div class="column-flex-center price-info">
            <p class="price">￥365</p>
            <p class="date">会员期限：12个月</p>
          </div>
        </div>
        <div class="title">支付方式</div>
        <div class="pay-items">
          <div v-for="(item, index) in pay_method_list" :class="{ checked: pay_type_value == item.value }" class="item"
               @click="do_toggle_paytype(item)">
            <img alt="" class="img-check check-0 check-img check-img-0" src="@/assets/image/common/check0.png"/>
            <img alt="" class="img-check check-1 check-img check-img-1" src="@/assets/image/common/check1.png"/>
            <span>{{ item.title }}</span>
            <img :src="item.icon" alt="" class="marker-img"/>
          </div>
        </div>
      </div>
    </div>
    <div class="total">
      <p><span>会员费用：</span><span>¥365.00</span></p>
      <p class="sum"><span>合计：</span><span>¥365.00</span></p>
      <div class="pay">去支付</div>
    </div>

    <phone_bind_old_check_modal ref="phone_bind_old_check_modal" data-title="校验" @confirm="confirm_old_pass"/>
    <phone_bind_new_set_modal ref="phone_bind_new_set_modal" data-title="绑定" @confirm="confirm_new"/>
  </div>
</template>

<script>
import {UPLOAD_ACTION, UPLOAD_NAME} from '@/config/env.js'

import phone_bind_old_check_modal from "@/components/account/phone_bind_old_check_modal.vue";
import phone_bind_new_set_modal from "@/components/account/phone_bind_new_set_modal.vue";


import {mapState} from "vuex";

export default {
  name: "servicePage",
  components: {
    phone_bind_old_check_modal,
    phone_bind_new_set_modal,
  },
  data() {
    return {
      UPLOAD_ACTION,
      UPLOAD_NAME,

      my_info: {},
      form: {
        image: "",
        realName: "",
        address: "",
      },
      loading: false,
      pay_type_value: '',
      pay_method_list: [
        {value: 'weixin', title: '微信支付', icon: require('@img/pay-method/type-weixin.png')},
        {value: 'zhifubao', title: '支付宝支付', icon: require('@img/pay-method/type-zfb.png')},
        // { value: 'xianxia', title: '线下转款', icon: require('@img/pay-method/type-xianxia.png') },
        {value: 'paypal', title: 'PayPal', icon: require('@img/pay-method/type-paypal.png')},
        // {value: 'yue', title: '余额支付', icon: require('@img/pay-method/type-yue.png')},
      ],
    };
  },
  computed: {
    ...mapState(["baseInfo"]),
  },
  watch: {},
  created() {
    this.throttle_do_submit = this.mix_throttle(this.do_submit, 1000)
    this.setView();
  },
  methods: {
    throttle_do_submit() {

    },
    open_phone_update() {
      this.$refs.phone_bind_old_check_modal.init();
    },
    confirm_old_pass() {
      this.$refs.phone_bind_new_set_modal.init();
    },
    confirm_new() {
      this.query_user()
    },

    setView() {
      this.query_user();
    },
    query_user() {
      // this.$store.dispatch("query_user");
      this.$api({
        url: '/service.php',
        method: 'get',
        data: {
          action: 'users_userInfo',
        },
      }).then(res => {
        if (res.code == 200) {
          let data = res.data;
          this.my_info = data;

          this.form = {
            image: data.image || "",
            realName: data.realName || "",
            address: data.address || "",
          };


          this.$store.commit("set_baseInfo", res.data);
        }
      })
    },

    do_submit() {
      this.loading = true;
      this.$api({
        url: '/service.php',
        method: 'get',
        data: {
          action: 'users_editInfo',
          ...this.form
        },
      }).then((res) => {
        let {code, msg, data} = res;
        alert(res).then(() => {
          this.loading = false;
        });
        if (code == 200) {
          this.setView();
        }
      });
    },

    do_reset() {
      this.form = {
        image: this.my_info.image,
        realName: "",
        address: "",
      };
    },

    do_toggle_paytype(item) {
      this.pay_type_value = item.value
      this.payType = item.title
      let value = item.title
      if (value == "余额支付") {
        if (this.baseInfo.is_pay_pass == 0) {
          //未设置支付密码
          this.$refs.balance_password_set_modal.init(this.baseInfo);
        } else if (this.total_balance < this.real_payment_money) {
          //余额不足提示
          this.$refs.balance_pay_disable_modal.init({
            money: this.real_payment_money,
          });
        }
      }

    },

    //上传相关
    upload_on_success(res, file) {
      //console.log("上传结果", res);
      let {code, data, msg} = res;
      alert(res);
      if (code == 200) {
        this.form.image = res.data;
      }
    },
    upload_before_upload(file) {
      const isLt2M = file.size / 1024 / 1024 < 20; //文件大小
      return isLt2M;
    },
  },
};
</script>

<style lang="less" scoped>
.user-avatar {
  object-fit: cover;
}

.page {
  text-align: left;
  padding-bottom: 80px;

  .main-title {
    font-family: Microsoft YaHei, Microsoft YaHei;
    font-weight: 400;
    font-size: 16px;
    color: #000000;
    margin-bottom: 15px;
  }
}

.page {
  .page-ctx {
    padding-bottom: 80px;
    border: 1px solid #E5E5E5;

    .title-wrap {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 98px;
      background: #F8F8F8;
      border-bottom: 1px solid rgba(29, 32, 136, 0.2);
      padding: 0 28px;

      .info {
        .upload-demo {
          width: 42px;
          height: 42px;
          border-radius: 7px;
          border: 1px solid #FFFFFF;
          margin-right: 10px;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }

        .name {
          font-weight: 400;
          font-size: 16px;
          color: #000000;
          margin-right: 15px;
        }

        .vip {
          width: 71px;
          height: 26px;
          background: rgba(255, 255, 255, 0.88);
          text-align: center;
          line-height: 26px;

          font-weight: 400;
          font-size: 12px;
          color: #3D3D3D;

          img {
            width: 16px;
            height: 14px;
            margin-right: 5px;
          }
        }
      }

      .card, .status, .date {
        color: #777777;
        font-size: 15px;

        span {
          color: #D41C17;
        }
      }
    }

    .section {
      width: 900px;
      margin-left: 28px;
      margin-top: 28px;

      .price-section {
        width: 240px;
        height: 142px;
        background: #FFFFFF;
        border: 2px solid #000000;

        h3 {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 35px;
          background: rgba(29, 32, 136, 0.051);
          font-size: 15px;

          img {
            margin-left: 5px;
            width: 16px;
            height: 14px;
          }
        }

        .price-info {
          height: 107px;
          justify-content: center;

          .price {
            color: #000;
            font-weight: bold;
            font-size: 25px;
            margin-bottom: 10px;
          }

          .date {
            font-weight: 400;
            font-size: 14px;
            color: #888888;
          }
        }
      }

      .title {
        margin-top: 40px;
        font-weight: 400;
        font-size: 16px;
        color: #000000;
      }

      .pay-items {
        display: flex;

        .item {
          padding-right: 60px;
          height: 64px;
          line-height: 64px;
          display: flex;
          align-items: center;
          cursor: pointer;

          &:last-child {
            border: none;
          }

          .check-img {
            width: 21px;
          }

          .check-img-1 {
            display: none;
          }

          .marker-img {
            width: 30%;
            margin: 0 10px;
          }

          span {
            margin-left: 10px;
            font-size: 14px;
            font-family: Microsoft YaHei-Regular, Microsoft YaHei;
            font-weight: 400;
            color: #3D3D3D;
          }
        }

        .checked {
          cursor: pointer;

          .check-0 {
            display: none !important;
          }

          .check-1 {
            display: block !important;
          }
        }
      }
    }

    .item {
      margin-bottom: 32px;
      display: flex;
      align-items: center;

      .text {
        display: inline-block;
        min-width: 134px;
        text-align: right;
        font-size: 14px;
        color: #fff;
      }

      .info {
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #fff;
        display: inline-block;
        min-width: 120px;


        /deep/ .el-input__inner {
          width: 400px;
          height: 40px;
          background: transparent;
          border: 1px solid #7B7B7B;
          color: #fff;
        }
      }

      .action {
        margin-left: 20px;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #F74747;

        span {
          margin-right: 20px;
          cursor: pointer;
        }
      }
    }
  }

  .total {
    display: flex;
    flex-direction: column;
    align-items: end;
    line-height: 42px;
    p {
      width: 220px;
      display: flex;
      justify-content: space-between;

      font-weight: 400;
      font-size: 14px;
      color: #666666;
    }
    .sum {
      color: #000;
      font-size: 20px;
      font-weight: 700;
    }
    .pay {
      cursor: pointer;
      margin-top: 30px;
      width: 191px;
      height: 46px;
      line-height: 46px;
      text-align: center;
      color: #fff;
      font-size: 14px;
      background: #D41C17;
      border-radius: 4px 4px 4px 4px;
    }
  }
}
</style>

<style lang="less" scoped src="@/assets/h5css/user/my-info.less"></style>
