<template>
  <div class="page">
    <div class="main-title">
      <span>账户安全</span>
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
        <div class="item">
          <div class="left">
            <h3>修改密码</h3>
            <span>为了您的购物安全，建议您定期修改密码</span>
          </div>
          <div class="right" @click="open_update('password')">修改</div>
        </div>
        <div class="item">
          <div class="left">
            <h3>修改邮箱</h3>
            <span>您的电子邮箱是：815625979@qq.com</span>
          </div>
          <div class="right" @click="open_update('email')">修改</div>
        </div>
      </div>
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
    open_update(type) {
      if (type == "password") {
        this.$router.push("/change-password");
      }else {
        this.$router.push("/change-email");
      }
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
      .item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 32px;
        height: 104px;
        border-bottom: 1px solid #EBEBEB;

        &:last-child {
          border: none;
        }

        .left {
          h3 {
            font-weight: 400;
            font-size: 16px;
            color: #000000;
            text-align: left;
            margin-bottom: 15px;
          }

          span {
            font-weight: 400;
            font-size: 12px;
            color: #3E4E5E;
            text-align: left;
          }
        }

        .right {
          cursor: pointer;
          width: 122px;
          height: 32px;
          background: #F8F8F8;
          border: 1px solid #E2E2E2;
          color: #3D3D3D;
          text-align: center;
          line-height: 32px;
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
