<script>
import address_modal from "@/components/address/address_modal.vue";

export default {
  name: "pay",
  components: {address_modal},
  data() {
    return {
      isShow: true,
      priceList: [], // 样品价格
      address_selected: {}, // 选择的收货地址
      params: {
        if_contact_user: '',// 是否曾与工作人员联系
        if_recover: '',// 是否需要回收
        tongshebei: '',// 设备类型
        if_urgent: '',// 是否加急
        contact_user: '',// 联系人
        contact_tel: '',// 联系电话
        contact_address: '',// 联系地址
        sample_type: 1, //1自行寄样2上门取样3自己送样
      },
      radioList: [], // 选中的单选框
      list_address: [], // 收货地址
      pagination_address: {
        page: 1,
        limit: 10
      },
      preOrderDetail: {},
      orderNo: ''
    };
  },
  mounted() {
    this.setView();
  },
  methods: {
    setView() {
      this.preOrderDetail = JSON.parse(localStorage.getItem('preOrderDetail')) || {};
      this.params.if_recover = this.preOrderDetail.if_recover || '否';
      this.params.if_contact_user = this.preOrderDetail.if_contact_user || '否';
      this.params.tongshebei = this.preOrderDetail.tongshebei || '否';
      this.params.if_urgent = this.preOrderDetail.if_urgent || '0';
      this.params.contact_user = this.preOrderDetail.contact_user || '';
      this.params.contact_tel = this.preOrderDetail.contact_tel || '';
      this.params.contact_address = this.preOrderDetail.contact_address || '';
      this.params.address_id = this.preOrderDetail.address_id || '';
      this.query_address();
      if (this.preOrderDetail.form.length) {
        this.getPriceList(this.preOrderDetail.form);
      }
    },
    getPriceList(form) {
      this.$api({
        url: 'order_pay_info',
        method: 'post',
        data: {
          yf_type: this.preOrderDetail.yf_type || '1',
          tongshebei: this.preOrderDetail.tongshebei || '',
          if_urgent: this.preOrderDetail.if_urgent || '',
          sample_type: this.preOrderDetail.sample_type || '',
          product_id: this.preOrderDetail.product_id || '',
          form: this.filterForm(form)
        }
      }).then(res => {
        if (res.code === 200) {
          this.priceList = res.data;
        }
      })
    },
    //选择收货地址
    do_toggle_address(item) {
      console.log(item)
      this.address_selected = item;
      this.params.address_id = item.id
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
          this.params.address_id = this.address_selected.id
        }
      })
    },
    goUrl() {
      if (this.params.tongshebei === '是') {
        if (!this.orderNo) {
          this.$message.error('请填写相对应的订单号');
          return
        } else {
          this.params.tongshebei = this.orderNo
        }
      }
      localStorage.setItem('preOrderDetail', JSON.stringify({...this.preOrderDetail, ...this.params}));
      this.$router.push({
        path: '/appointment-invoice'
      })
    },
    do_address_add() {
      this.$refs.address_modal.init();
    }
  }
}
</script>

<template>
  <div class="container main">
    <div class="title">下单：{{ preOrderDetail.title }}</div>
    <div class="content">
      <div class="item">
        <p class="label">是否曾与工作人员联系？</p>
        <div class="val">
          <div class="sel">
            <el-radio-group v-model="params.if_contact_user">
              <el-radio label="是">是</el-radio>
              <el-radio label="否">否</el-radio>
            </el-radio-group>
          </div>
          <div class="info"></div>
        </div>
      </div>
      <div class="item">
        <p class="label">是否需要回收样品？</p>
        <div class="val">
          <div class="sel">
            <el-radio-group v-model="params.if_recover">
              <el-radio label="0">不回收 <img
                  :src="require(`@/assets/img/base/appointment/${params.if_recover != '1' ? 'recycle' : 'Recycle-active'}.png`)"
                  alt=""></el-radio>
              <el-radio label="1">回收 <img
                  :src="require(`@/assets/img/base/appointment/${params.if_recover != '0' ? 'recycle' : 'Recycle-active'}.png`)"
                  alt=""></el-radio>
            </el-radio-group>
          </div>
          <div class="info" v-if="params.if_recover == '1'">
            <div class="tip">
              <p>回收时没法保证样品100%不被污染</p>
              <p>回收流程较繁琐，且部分测试对样品有破坏，如您的样品足够，建议不要选择回收</p>
            </div>
          </div>
        </div>
      </div>
      <div class="item" v-if="params.if_recover == '1'">
        <p class="label">回收地址</p>
        <div class="val">
          <div class="sel">
            <div class="btn-ripple" v-if="list_address.length === 0" @click="do_address_add()">
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
                <el-input placeholder="请填写实验人员姓名" v-model="params.contact_user"></el-input>
              </div>
              <div class="it">
                <label>联系电话</label>
                <el-input placeholder="请填写实验人员联系方式" v-model="params.contact_tel"></el-input>
              </div>
              <div class="it">
                <label>地址</label>
                <el-input placeholder="请填写联系人地址" v-model="params.contact_address"></el-input>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="item">
        <p class="label">是否与之前的测试同设备？</p>
        <div class="val">
          <div class="sel">
            <el-radio-group v-model="params.tongshebei">
              <el-radio label="否">不需要/之前未在平台做过该测试</el-radio>
              <el-radio label="是">需要</el-radio>
            </el-radio-group>
          </div>
          <div class="info">
            <div class="tip tip3" v-if="params.tongshebei === '否'">
              <p>如果您需要和历史订单使用相同的设备测试，请填写之前的订单号。</p>
            </div>
            <div class="other-addr" v-else>
              <el-input placeholder="请填写相对应的订单号" v-model="orderNo"></el-input>
            </div>
          </div>
        </div>
      </div>
      <div class="item">
        <p class="label">加急服务</p>
        <div class="val">
          <div class="sel">
            <el-radio-group v-model="params.if_urgent">
              <el-radio label="0">不加急</el-radio>
              <el-radio label="1">3个工作日完成</el-radio>
              <el-radio label="2">24小时</el-radio>
            </el-radio-group>
          </div>
          <div class="info"></div>
        </div>
      </div>
    </div>

    <div class="tabs-wrap">
      <div class="tabs">
        <div class="tab-item pointer" :class="{'tab-active': params.sample_type === 1}" @click="params.sample_type = 1">
          自行寄样
        </div>
        <div class="tab-item pointer" :class="{'tab-active': params.sample_type === 3}" @click="params.sample_type = 3">
          自行送样
        </div>
      </div>
      <div class="tab-content">
        <div class="tip-box">
          <p>易碎、不稳定样品请自行妥善包装，以免造成不必要损失，多个样品请编好号。</p>
          <p>寄样建议您使用顺丰快递，请勿邮寄易燃易爆样品。</p>
        </div>

        <div class="sel">
          <el-radio-group v-model="params.yf_type">
            <el-radio :label="0">自付</el-radio>
            <el-radio :label="1">到付</el-radio>
          </el-radio-group>

          <div class="item">
            <p class="label">寄样地址</p>
            <div class="val">
              <div class="info">
                <span>{{ vuex_config.receive_name }}</span>
              </div>
              <div class="col"></div>
              <div class="info">
                <span>{{ vuex_config.receive_tel }}</span>
                <span>收件地址：{{ vuex_config.receive_address }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="all-money">
      <div class="money-info">
        <p>合计费用: <span>{{ vuex_huobi }}{{ priceList.total || 0 }}</span></p>
        <i class="el-icon-arrow-down" :class="{'hide': isShow}" @click="isShow = !isShow"></i>
      </div>
      <div class="next-btn" @click="goUrl()">下一步</div>

      <div class="popup" :class="{'hide': isShow}">
        <div class="item" v-for="(item, index) in priceList.data" :key="index">
          <span>{{ item.sample_title || '暂无' }}</span>
          <span class="num">样品数量：{{ item.num || 0 }}</span>
          <span class="money">¥{{ item.unit_price || 0 }} * {{  item.num || 0 }}</span>
        </div>
        <div class="item">
          <span>运费</span>
          <span class="num"> </span>
          <span class="money">¥{{ priceList.yunfei || 0 }}</span>
        </div>
      </div>
    </div>

    <address_modal ref="address_modal" @confirm="setView"/>
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

        .item {
          margin-top: 30px;
          display: flex;
          align-items: start;
          margin-bottom: 20px;

          .label {
            width: 180px;
            font-weight: 400;
            font-size: 16px;
            color: #333333;
            text-align: left;
          }

          .val {
            .info {
              display: flex;
              flex-direction: column;

              font-family: Microsoft YaHei, Microsoft YaHei;
              font-weight: 400;
              font-size: 16px;
              color: #333333;
            }

            .col {
              margin: 20px 0;
              width: 450px;
              height: 1px;
              border: 1px solid #D6D6D6;
            }
          }
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
          min-width: 50px;
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
