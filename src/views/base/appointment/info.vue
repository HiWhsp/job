<script>
export default {
  name: "pay",
  data() {
    return {
      isShow: true,
      tabIndex: 1, // 选中的标签
      address_selected: {}, // 选择的收货地址
      radioList: [], // 选中的单选框
      list_address: [], // 收货地址
      pagination_address: {
        page: 1,
        limit: 10
      },
    };
  },
  mounted() {
    this.setView();
  },
  methods: {
    setView() {
      this.query_address();
    },
    //选择收货地址
    do_toggle_address(item) {
      this.address_selected = item;
    },
    //获取地址列表
    query_address() {
      this.$api({
        url: 'address_list',
        method: 'post',
        data: {
          ...this.pagination_address,
        },
      }).then(res => {
        if (res.code == 200) {
          let data = res.data
          data.forEach((v) => {
            v.full_addr = [v.country, v.province, v.city, v.area, v.address].filter(v => !!v).join('');
            v.name_phone = `${v.receive_name} ${v.receive_phone}`
          });
          this.list_address = data;

          let obj = data.find((v) => v.is_default) || {};
          this.address_selected = obj || {};
        }
      })
    },
    goUrl() {
      this.$router.push({
        path: '/appointment-invoice'
      })
    }
  }
}
</script>

<template>
  <div class="container main">
    <div class="title">下单：原子力显微镜</div>
    <div class="content">
      <div class="item">
        <p class="label">是否曾与工作人员联系？</p>
        <div class="val">
          <div class="sel">
            <el-radio-group v-model="radioList[0]">
              <el-radio :label="3">是</el-radio>
              <el-radio :label="6">否</el-radio>
            </el-radio-group>
          </div>
          <div class="info"></div>
        </div>
      </div>
      <div class="item">
        <p class="label">是否需要回收样品？</p>
        <div class="val">
          <div class="sel">
            <el-radio-group v-model="radioList[1]">
              <el-radio :label="3">不回收 <img
                  :src="require(`@/assets/img/base/appointment/${radioList[1] !== 3 ? 'recycle' : 'Recycle-active'}.png`)"
                  alt=""></el-radio>
              <el-radio :label="6">回收 <img
                  :src="require(`@/assets/img/base/appointment/${radioList[1] !== 6 ? 'recycle' : 'Recycle-active'}.png`)"
                  alt=""></el-radio>
            </el-radio-group>
          </div>
          <div class="info" v-if="radioList[1] === 6">
            <div class="tip">
              <p>回收时没法保证样品100%不被污染</p>
              <p>回收流程较繁琐，且部分测试对样品有破坏，如您的样品足够，建议不要选择回收</p>
            </div>
          </div>
        </div>
      </div>
      <div class="item" v-if="radioList[1] === 6">
        <p class="label">回收地址</p>
        <div class="val">
          <div class="sel">
            <div class="btn-ripple" v-if="list_address.length === 0">
              <img src="@/assets/img/base/appointment/address.png" alt="">
              <span>新增地址</span>
            </div>
            <div class="address-list">
              <div class="address-item" v-for="(item, index) in list_address" :key="index"
                   :class="{ active: item.id == address_selected.id }" @click="do_toggle_address(item)">
                <div class="address-top">{{ item.name_phone }}</div>
                <div class="address-bottom">
                  <div class="more" v-if="item.is_default">默认</div>
                  <span>{{ item.full_addr }}</span>
                  <div class="updateAddr pointer">修改</div>
                </div>
                <img src="@/assets/img/base/appointment/address-select.png" alt="" class="marker"/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="item">
        <p class="label">实验有问题联系谁？</p>
        <div class="val">
          <div class="sel">
            <el-radio-group v-model="radioList[2]">
              <el-radio :label="3">本人</el-radio>
              <el-radio :label="6">其他人 <span>（请填写实验人员联系方式，以便沟通实验信息）</span></el-radio>
            </el-radio-group>
          </div>
          <div class="info">
            <div class="other-addr">
              <div class="it">
                <label>联系人</label>
                <el-input placeholder="请填写实验人员姓名"></el-input>
              </div>
              <div class="it">
                <label>联系电话</label>
                <el-input placeholder="请填写实验人员联系方式"></el-input>
              </div>
              <div class="it">
                <label>地址</label>
                <el-input placeholder="请填写联系人地址"></el-input>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="item">
        <p class="label">是否与之前的测试同设备？</p>
        <div class="val">
          <div class="sel">
            <el-radio-group v-model="radioList[3]">
              <el-radio :label="3">不需要/之前未在平台做过该测试</el-radio>
              <el-radio :label="6">需要</el-radio>
            </el-radio-group>
          </div>
          <div class="info">
            <div class="tip tip3" v-if="radioList[3] === 3">
              <p>如果您需要和历史订单使用相同的设备测试，请填写之前的订单号。</p>
            </div>
            <div class="other-addr">
              <el-input placeholder="请填写相对应的订单号" v-if="radioList[3] === 6"></el-input>
            </div>
          </div>
        </div>
      </div>
      <div class="item">
        <p class="label">加急服务</p>
        <div class="val">
          <div class="sel">
            <el-radio-group v-model="radioList[4]">
              <el-radio :label="3">3个工作日完成，1.5倍费用</el-radio>
              <el-radio :label="6">24小时完成，2倍费用</el-radio>
            </el-radio-group>
          </div>
          <div class="info"></div>
        </div>
      </div>
    </div>

    <div class="tabs-wrap">
      <div class="tabs">
        <div class="tab-item pointer" :class="{'tab-active': tabIndex === 1}" @click="tabIndex = 1">自行寄样</div>
        <div class="tab-item pointer" :class="{'tab-active': tabIndex === 2}" @click="tabIndex = 2">自行送样</div>
      </div>
      <div class="tab-content">
        <div class="tip-box">
          <p>易碎、不稳定样品请自行妥善包装，以免造成不必要损失，多个样品请编好号。</p>
          <p>寄样建议您使用顺丰快递，请勿邮寄易燃易爆样品。</p>
        </div>

        <div class="sel">
          <el-radio-group v-model="radioList[0]">
            <el-radio :label="3">自付</el-radio>
            <el-radio :label="6">到付</el-radio>
          </el-radio-group>
        </div>

      </div>
    </div>
    <div class="all-money">
      <div class="money-info">
        <p>合计费用: <span>{{ vuex_huobi }}0.00</span></p>
        <i class="el-icon-arrow-down" :class="{'hide': isShow}" @click="isShow = !isShow"></i>
      </div>
      <div class="next-btn" @click="goUrl()">下一步</div>

      <div class="popup" :class="{'hide': isShow}">
        <div class="item">
          <span>A组样品</span>
          <span class="num">样品数量：1</span>
          <span class="money">¥40.00 * 1</span>
        </div>
        <div class="item">
          <span>A组样品</span>
          <span class="num">样品数量：1</span>
          <span class="money">¥40.00 * 1</span>
        </div>
        <div class="item">
          <span>A组样品</span>
          <span class="num"></span>
          <span class="money">¥40.00 * 1</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.container {
  padding: 25px 0 70px;

  .title {
    height: 89px;
    line-height: 89px;
    background: #00479D;
    border-radius: 4px;
    font-weight: bold;
    font-size: 24px;
    color: #FFFFFF;
    padding-left: 35px;
  }

  .content {
    margin-top: 20px;
    background-color: #fff;
    padding: 54px 90px;

    .item {
      display: flex;
      align-items: start;
      margin-bottom: 30px;

      .label {
        width: 220px;
        font-weight: 400;
        font-size: 16px;
        color: #333333;
        text-align: right;
        margin-right: 100px;
      }

      .sel {
        .el-radio {
          min-width: 150px;

          /deep/ .el-radio__label {
            font-weight: 400;
            font-size: 16px;
            color: #333333;

            img {
              width: 21px;
              height: 21px;
            }
          }
        }

        span {
          font-weight: 400;
          font-size: 14px;
          color: #818181;
        }

        .btn-ripple {
          cursor: pointer;
          display: flex;
          align-items: center;
          font-weight: 400;
          font-size: 14px;

          img {
            width: 27px;
            height: 27px;
          }

          span {
            margin-left: 10px;
            color: #00479D;
          }
        }

        .address-list {
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          width: 786px;
          height: 144px;
          padding-right: 20px;

          .address-item {
            position: relative;
            width: 100%;
            height: 134px;
            background: #FFFFFF;
            border: 2px dashed #D5D8DE;
            min-height: 130px;
            padding: 15px 20px;
            border-radius: 4px;
            overflow: hidden;
            cursor: pointer;
            margin-bottom: 20px;

            &.active {
              border: 2px dashed @theme;

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
              font-weight: 400;
              color: #999999;
              display: flex;
              align-items: center;

              span {
                flex: 1;
              }

              .more {
                width: 60px;
                height: 27px;
                line-height: 27px;
                text-align: center;
                background: #FFFFFF;
                border-radius: 14px 14px 14px 14px;
                border: 1px solid #00479D;
                margin-right: 15px;
              }

              .updateAddr {
                font-weight: 400;
                font-size: 14px;
                color: #00479D;
              }
            }
          }
        }
      }

      .val {
        .tip {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 0 20px;
          width: 760px;
          height: 72px;
          line-height: 24px;
          background: #FFFAF1;
          border: 1px solid #F1CE9C;
          font-weight: 400;
          font-size: 14px;
          color: #A28160;
          margin-top: 20px;
          // 上三角
          &:before {
            content: '';
            position: absolute;
            top: -10px;
            left: 210px;
            width: 0;
            height: 0;
            border-left: 10px solid transparent;
            border-right: 10px solid transparent;
            border-bottom: 10px solid #F1CE9C;
          }
        }

        .tip3 {
          height: 40px;

          &:before {
            left: 40px;
          }
        }

        .other-addr {
          margin-top: 30px;

          .it {
            display: flex;
            margin-bottom: 20px;

            label {
              width: 100px;
              text-align: right;
              font-weight: 400;
              font-size: 16px;
              color: #333333;
              margin-left: -180px;
            }

            .el-input {
              margin-left: 80px;
            }
          }
        }
      }
    }
  }

  .tabs-wrap {
    margin-top: 20px;
    background-color: #fff;

    .tabs {
      display: flex;
      background-color: #E8EDF2;

      .tab-item {
        width: 187px;
        height: 60px;
        line-height: 60px;
        text-align: center;
        border-right: 1px solid #CACED2;

        &.tab-active {
          background-color: #fff;
          color: #00479D;
        }
      }
    }

    .tab-content {
      padding: 30px;

      .tip-box {
        height: 75px;
        background: #FFF1D9;
        padding: 0 15px;
        color: #FF8000;
        font-size: 14px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-bottom: 50px;

        p:last-child {
          margin-top: 10px;
        }
      }

      .sel {
        padding-left: 30px;

        .el-radio {
          min-width: 150px;

          /deep/ .el-radio__label {
            font-weight: 400;
            font-size: 16px;
            color: #333333;
          }
        }

        .img {
          width: 21px;
          height: 21px;
        }
      }
    }
  }

  .all-money {
    position: relative;
    margin-top: 20px;
    padding: 0 30px;
    height: 95px;
    background: #FFFFFF;
    box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.11);
    display: flex;
    justify-content: space-between;
    align-items: center;

    .money-info {
      .flex();
      font-weight: 400;
      font-size: 16px;
      color: #333333;

      span {
        color: #00479D;
      }

      i {
        margin-left: 10px;
        font-size: 18px;
        font-weight: bold;
        color: #818181;
        transition: all 0.5s ease-in-out;

        &.hide {
          transform: rotate(180deg);
          transition: all 0.5s ease-in-out;
        }
      }
    }

    .next-btn {
      cursor: pointer;
      width: 140px;
      height: 49px;
      background: #00479D;
      border-radius: 8px;
      font-weight: 400;
      font-size: 18px;
      color: #FFFFFF;
      text-align: center;
      line-height: 49px;
    }

    .popup {
      width: 100%;
      padding: 40px;
      background-color: #fff;
      box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.11);
      position: absolute;
      left: 0;
      bottom: 95px;
      transition: all 0.5s ease-in-out;

      .item {
        margin-bottom: 28px;
        display: flex;

        span {
          font-weight: 400;
          font-size: 16px;
          color: #333333;
          margin-right: 30px;
        }

        .num {
          width: 200px;
        }

        .money {
          font-weight: 400;
          font-size: 18px;
          color: #00479D;
        }

        &:last-child {
          margin-bottom: 0;
        }
      }

      &.hide {
        // 慢慢收起
        height: 0;
        overflow: hidden;
        transition: all 0.5s ease-in-out;
        padding: 0 45px;
      }
    }
  }
}
</style>
