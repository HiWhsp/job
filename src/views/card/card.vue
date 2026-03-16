<template>
  <div class="page">
    <div class="page-bg">
      <img src="@img/login/card-bg.jpg" alt="" />
    </div>

    <div class="page-ctx">
      <div class="page-inner page-inner flex-between w-1400">
        <div class="page-poster">
          <!-- <img src="" alt=""> -->
        </div>

        <div class="form-box">
          <div class="input-wrap">
            <div class="title">兑换卡</div>
            <div class="tab-box">
              <div
                class="tab-item"
                v-for="(item, index) in tabList"
                :class="activeTab == item.value ? 'active' : ''"
                :key="index"
                @click="changeTab(item)"
              >
                {{ item.title }}
                <div v-if="activeTab == item.value" class="active-line"></div>
              </div>
            </div>

            <template>
              <div class="input-box">
                <span>卡号</span>
                <input
                  type="text"
                  placeholder="请输入卡号"
                  v-model="form.code"
                />
              </div>

              <div class="input-box">
                <span>卡密</span>
                <input
                  type="password"
                  placeholder="请输入卡密"
                  v-model="form.pass"
                />
              </div>

              <div class="btn-box">
                <button class="btn-ripple" @click="do_submit()">
                  确定兑换
                </button>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { mapState } from "vuex";

export default {
  name: "card",
  components: {
  },
  data() {
    return {
      is_agree: true,

      mode: "账号密码", //微信扫码
      tabType: "PASS", //登录方式
      agreed: false,

      form: {
        code: "",
        pass: "",
      },
      activeTab: 0,
      tabList: [
        {
          title: "普通兑换卡",
          value: 0,
        },
        {
          title: "商品兑换卡",
          value: 1,
        },
      ],
    };
  },
  computed: {
    ...mapState(["logo"]),
  },
  created() {},

  methods: {
    changeTab(tab){
      this.activeTab=tab.value
      // this.form = {
      //   code: "",
      //   pass: "",
      // };
    },

    do_submit() {
      if (!this.vuex_is_login) {
        alertErr("Please log in first");
        this.$router.push("/login");
        return;
      }
      if (!this.form.code) {
        alertErr("请输入卡号");
        return;
      }
      if (!this.form.pass) {
        alertErr("请输入卡密");
        return;
      }

      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "recharge_bind",
          type:this.activeTab,
          ...this.form,
        },
      }).then((res) => {
        if (res.code == 200) {
          this.form = {
            code: "",
            pass: "",
          };
          alertSucc("兑换成功！");
          if(this.activeTab==1){
             this.toRoute({
              path: "/card-goods",
              query: {
                id: res.data.id,
                num: res.data.changeNum
              },
            });
          }
        } else {
          alertErr(res.message || res.msg);
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
.page {
  position: relative;

  .page-bg {
    img {
      width: 100%;
      min-height: 665px;
    }
  }

  .page-ctx {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;

    display: flex;
    align-items: center;
  }

  .page-poster {
    margin-left: 46px;

    img {
      width: 664px;
      height: 664px;
    }
  }

  .page-inner {
    margin: 0 auto;
    background: transparent;
    align-items: center;
    position: relative;

    .form-box {
      position: relative;
      width: fit-content;
      min-height: 200px;
      background: #f9fafc;
      background: #ffffff;
      box-shadow: 0px 2px 15px 1px rgba(79, 79, 79, 0.15);
      border: 1px solid rgba(76, 165, 228, 0.1);

      padding: 40px 40px 70px;
      opacity: 1;
      border-radius: 10px;
    }

    .input-wrap {
      width: 400px;
      margin: 0 auto;
      .title {
        font-family: Poppins, Poppins;
        font-weight: 600;
        font-size: 26px;
        color: #333333;
        text-align: center;
        margin-bottom: 28px;
      }
      .tab-box {
        width: 400px;
        margin-bottom: 30px;
        display: flex;
        justify-content: space-around;

        .tab-item {
          font-family: Poppins, Poppins;
          font-weight: 400;
          font-size: 18px;
          color: #2b2b2b;

          &.active {
            color: #009f39;
            font-weight: bold;
          }
          .active-line{
            margin: 11px auto;
            width: 56px;
            height: 3px;
            background: #00306B;
          }
        }
        
      }

      .input-box {
        margin-bottom: 20px;
        width: 100%;
        height: 50px;
        background: #ffffff;
        border: 1px solid #eeeeee;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        overflow: hidden;

        span {
          text-align: center;
          display: inline-block;
          width: 90px;
          border-right: 1px solid #ccc;
          font-family: Poppins, Poppins;
          font-weight: 400;
          font-size: 14px;
          color: #7d7d7d;
          // text-indent: 1em;
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
            font-family: Poppins, Poppins;
            font-weight: 400;
            color: #d7d7d7;
          }
        }
      }

      .agree-box {
        text-align: left;
        margin-top: 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        font-size: 14px;
        font-family: Poppins, Poppins;
        font-weight: 400;
        line-height: 24px;
        color: #505050;

        a {
          color: #009f39;
        }
      }

      .btn-box {
        margin-top: 40px;

        button {
          border-radius: 6px;
          width: 100%;
          height: 44px;
          background: linear-gradient(90deg, #ff7327 0%, #ea5959 100%);
          background: #009f39;
          font-size: 18px;
          font-family: Poppins, Poppins;
          font-weight: 400;
          color: #ffffff;
        }
      }

      .register-box {
        text-align: center;
        margin-top: 20px;
        font-size: 14px;

        a {
          font-size: 14px;
          font-family: Poppins, Poppins;
          font-weight: 400;
          line-height: 24px;
          color: #009f39;
          border-bottom: 1px solid #009f39;
        }
      }
    }
  }
}

.terms-box {
  position: absolute;
  height: 40px;
  background: #f5f6f8;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  justify-content: flex-start;
  padding-left: 20px;
  text-align: center;

  .terms-check {
    cursor: pointer;
    font-family: Poppins, Poppins;
    font-weight: 400;
    font-size: 12px;
    color: #505050;

    img {
      margin-right: 10px;
      width: 18px;
      height: 18px;
    }
  }

  .terms-text {
    cursor: pointer;
    font-family: Poppins, Poppins;
    font-weight: 400;
    font-size: 12px;
    color: #505050;

    &:hover {
      color: #009f39;
    }
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/page/register.less"></style>
<style scoped lang="less" src="@/assets/h5css/page/shipei.less"></style>
