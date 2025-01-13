<script>
export default {
  name: "detail",
  data() {
    return {
      orderno: '',
      detail: {},
      orderDetail: {},
      downloadVisible: false
    }
  },
  computed: {
    // 10待支付 20待实验，30实验中，40已完成，50售后
    process: function () {
      return this.detail.status
    }
  },
  mounted() {
    this.orderno = this.$route.query.orderno;
    this.getDetail();
  },
  methods: {
    getDetail() {
      this.$api({
        url: 'order_detail',
        method: 'post',
        data: {
          orderno: this.orderno
        }
      }).then(res => {
        this.detail = res.data;
        this.orderDetail = res.data.orderdetail;
      })
    },
    // 下载报告
    download_report() {
      this.downloadVisible = true
    },
    goUrl(item) {
      this.$router.push(item.url)
    },
    // 取消订单
    resetPay() {
      this.$alert('确定要取消当前订单', '取消订单', {
        confirmButtonText: '确定',
        callback: action => {
          if (action) {
            this.$api({
              url: 'order_cancel',
              method: 'post',
              data: {
                orderno: this.orderno
              }
            })
            this.$message({
              type: 'success',
              message: '取消成功!'
            })
          }
        }
      });
    },
    downLoad() {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      const orderno = this.orderno;
      const url = `https://jxjsjc.dx.hdapp.com.cn/api/download_order?userId=${userId}&token=${token}&orderno=${orderno}`
      window.open(url, "_blank")
    },
    // 立即支付， 修改订单
    toPay(item) {
      const params = {
        ...this.detail,
        attachment: JSON.stringify(this.detail.attachment),
        title: this.detail.product_info.title,
        form: []
      }
      this.detail.orderdetail.forEach((item, index) => {
        if (item.content.length) {
          // 将id作为key value作为值 存储到数组中 {id: 1252, value: "1", title: "样本数量", price: 0}
          item.content.forEach((subItem, subIndex) => {
            if (params.form[index]) {
              params.form[index][subItem.id] = subItem.value
            } else {
              params.form[index] = {
                [subItem.id]: subItem.value,
              }
            }
          })
        }
      })
      localStorage.setItem('preOrderDetail', JSON.stringify(params));
      if (item) {
        this.$router.push('/appointment?id=' + this.detail.product_id);
      } else {
        this.$router.push('/appointment-pay');

      }
    },
  }
}
</script>

<template>
  <div class="content">
    <div class="status-item">
      <div class="status">
        <span>{{ detail.product_info ? detail.product_info.title : '' }}</span>
        <span>{{ detail.status_txt }}</span>
      </div>
      <div class="info">
        <div class="left">
          <p class="order-id">订单号：{{ detail.orderno }}</p>
          <p class="time">下单时间：{{ detail.created_at }}</p>
          <div class="btn-wrap">
            <div class="btn" v-if="process == 10" @click="toPay(true)">修改订单</div>
            <div class="btn" v-if="process == 10" @click="toPay(false)">立即支付</div>
            <div class="btn" v-if="process == 10" @click="resetPay()">取消订单</div>

            <div class="btn btn-bg" v-if="process == 30 || process == 40" @click="goUrl({url: '/invoice'})">申请开票
            </div>
            <div class="btn" v-if="process == 30" @click="downLoad">下载预约单</div>
            <div class="btn btn-bg" @click="download_report" v-if="process == 40">下载报告</div>
            <div class="btn" @click="goUrl({url: '/afterSales'})" v-if="process == 40">售后服务</div>
            <div class="btn" @click="download_report" v-if="process == 40">提交异议</div>
          </div>
        </div>
        <div class="right">
          <div class="process active">
            <img src="@/assets/img/my/order/1.png" alt="">
            <span>提交订单</span>
          </div>
          <div class="process" :class="{'active': process >= 20}">
            <img src="@/assets/img/my/order/2-active.png" alt="" v-if="process >= 20">
            <img src="@/assets/img/my/order/2.png" alt="" v-else>
            <span>支付成功</span>
          </div>
          <div class="process" :class="{'active': process >= 30}">
            <img src="@/assets/img/my/order/3-active.png" alt="" v-if="process >= 30">
            <img src="@/assets/img/my/order/3.png" alt="" v-else>
            <span>实验中</span>
          </div>
          <div class="process" :class="{'active': process >= 40}">
            <img src="@/assets/img/my/order/4-active.png" alt="" v-if="process >= 40">
            <img src="@/assets/img/my/order/4.png" alt="" v-else>
            <span>实验完成</span>
          </div>
        </div>
      </div>
    </div>
    <div class="address-item">
      <div class="sample-delivery">
        <!-- 左侧内容 -->
        <div class="left-content">
          <p class="delivery-method">寄样方式: {{
              detail.sample_type == 1 ? '自行寄样 (运费自付)' : detail.sample_type == 2 ? '上门取样' : '自己送样'
            }}</p>
          <p class="detail">
            <span>收货人：</span>{{ detail.jy_address ? detail.jy_address.receive_name : '' }}
          </p>
          <p class="detail">
            <span>联系方式：</span>{{ detail.jy_address ? detail.jy_address.receive_tel : '' }}
          </p>
          <p class="detail">
            <span>寄送地址：</span>{{ detail.jy_address ? detail.jy_address.receive_address : '' }}
          </p>
        </div>

        <!-- 右侧内容 -->
        <div class="right-content">
          <p class="payment-status">
            支付方式：<span>{{ detail.pay_type }}</span>
          </p>
          <p class="payment-amount">
            支付金额：<span class="amount">¥{{ detail.price }}</span>
          </p>
        </div>
      </div>
    </div>
    <div class="order-item">
      <div class="order-requirements">
        <h3 class="section-title">订单要求</h3>
        <!-- 实验联系人 -->
        <div class="info-row">
          <span class="label">实验有问题联系人</span>
          <div class="content">
            联系人：{{ detail.contact_user }} 联系方式：{{ detail.contact_tel }} 地址：{{ detail.contact_address }}
          </div>
        </div>
        <!-- 样品是否回收 -->
        <div class="info-row">
          <span class="label">样品是否回收</span>
          <div class="content">{{ detail.if_recover == 1 ? '是' : '否' }}</div>
        </div>
        <!-- 实验留言 -->
        <div class="info-row">
          <span class="label">实验留言</span>
          <div class="content">{{ detail.message }}</div>
        </div>
      </div>
    </div>
    <div class="orderInfo-item">
      <div class="order-info">
        <h3 class="section-title">下单信息</h3>
        <div class="info-row" v-for="(item, index) in orderDetail" :key="index">
          <p class="sample-info">{{ item.index }}，数量：{{ item.num }}，样品编号：{{ item.order_id }}</p>
          <!-- 表格 -->
          <table class="info-table">
            <tbody>
            <tr v-for="(it, i) in item.content" :key="i">
              <td class="label">{{ it.title }}</td>
              <td class="value">{{ it.value }}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!--    下载报告-->
    <el-dialog title="下载报告" :visible.sync="downloadVisible" center width="630px">
      <div class="real-content">
        <div class="tip">提示：报告文件只保存180天</div>
        <div class="info">
          <p>订单号：4545121232</p>
          <p>预约仪器：氧氮氢分析仪</p>
          <p>实验结果：2</p>
        </div>
        <div class="report">
          <p>1、报告文件1 <span>下载</span></p>
          <p>2、仪器测试结果 <span>下载</span></p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped lang="less">
.content {
  display: flex;
  flex-direction: column;

  .status-item {
    width: 100%;
    background-color: #fff;

    .status {
      display: flex;
      justify-content: space-between;
      padding: 0 55px 0;
      height: 89px;
      line-height: 89px;
      background: #DFEEFF;

      span {
        font-size: 20px;

        &:first-child {
          color: #333333;
          font-weight: 400;
        }

        &:last-child {
          color: #00479D;
        }
      }
    }

    .info {
      margin: 30px 0;
      padding: 0 40px;
      display: flex;

      .left {
        width: 320px;
        padding-right: 80px;
        border-right: 1px solid #D5D5D5;

        .order-id, .time {
          text-align: center;
          font-weight: 400;
          font-size: 14px;
          color: #333333;
          margin-top: 5px;
        }

        .btn-wrap {
          margin-top: 15px;
          display: flex;
          flex-direction: column;
          align-items: center;

          .btn {
            cursor: pointer;
            margin-top: 15px;
            width: 115px;
            height: 29px;
            line-height: 29px;
            text-align: center;
            background: #FFFFFF;
            border-radius: 4px 4px 4px 4px;
            border: 1px solid #00479D;
          }

          .btn-bg {
            background: @theme;
            color: #FFFFFF;
          }
        }
      }

      .right {
        padding-left: 80px;
        display: flex;
        align-items: center;

        .process {
          margin-right: 110px;
          text-align: center;
          display: flex;
          flex-direction: column;

          img {
            width: 65px;
            height: 65px;
            margin-bottom: 10px;
          }

          span {
            font-weight: 400;
            font-size: 14px;
            color: #818181;
          }

          &:last-child {
            margin-right: 0;
          }

          &.active {
            span {
              color: #333333;
            }
          }
        }
      }
    }
  }

  .address-item {
    margin-top: 20px;
    width: 100%;
    height: 289px;

    .sample-delivery {
      height: 100%;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      background: #fff;
      padding: 32px 35px;

      .left-content {
        flex: 2;

        .delivery-method {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 10px;
          color: #333;
        }

        .detail {
          font-size: 14px;
          color: #818181;
          margin-top: 20px;

          span {
            //font-weight: bold;
          }
        }
      }

      .right-content {
        height: 100%;
        flex: 1;
        text-align: right;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .payment-status,
        .payment-amount {
          padding-top: 25px;
          font-size: 14px;
          color: #666;
          margin-bottom: 10px;

          span {
            font-weight: bold;
            color: #333;
          }

          .amount {
            margin-left: 25px;
            color: #00479D;
            font-size: 16px;
          }
        }

        .payment-amount {
          border-top: 1px solid #E5E5E5;
        }
      }
    }
  }

  .order-item {
    margin-top: 20px;
    width: 100%;
    background: #fff;

    .order-requirements {
      padding-bottom: 30px;

      .section-title {
        padding-left: 35px;
        height: 63px;
        line-height: 63px;
        font-size: 18px;
        color: #000000;
        border-bottom: 1px solid #E5E5E5;
      }

      .info-row {
        min-height: 57px;
        display: flex;
        border-bottom: 1px solid #f5f5f5;
        margin: 0 35px;

        &:last-child {
          border-bottom: none;
        }

        .label {
          flex: 0 0 180px; // 固定宽度
          font-weight: 400;
          font-size: 16px;
          color: #333333;
          text-align: right;
          padding-right: 40px;
          margin-top: 15px;
        }

        .content {
          margin-top: 15px;
          font-weight: 400;
          font-size: 14px;
          color: #818181;
        }
      }
    }
  }

  .orderInfo-item {
    width: 100%;
    background: #fff;
    margin-top: 20px;
    padding-bottom: 30px;

    .order-info {
      .section-title {
        height: 63px;
        line-height: 63px;
        padding-left: 35px;
        color: #000;
        font-size: 18px;
        border-bottom: 1px solid #eaeaea;
      }

      .sample-info {
        margin-top: 30px;
        margin-bottom: 20px;
        padding: 0 35px;
        font-weight: 400;
        font-size: 16px;
        color: #333333;
      }

      .info-table {
        width: 100%;
        margin: 0 35px;
        border-collapse: collapse;


        tbody {
          border: 1px solid #E8E8E8;

          tr {
            border-bottom: 1px solid #f5f5f5;

            &:last-child {
              border-bottom: none;
            }

            td {
              border: 1px solid #E8E8E8;
              padding: 10px 10px 10px 25px;
              font-size: 14px;

              &.label {
                width: 40%;
                font-weight: bold;
                color: #555;
              }

              &.value {
                color: #666;
              }
            }
          }
        }
      }
    }
  }

  .real-content {
    .tip {
      height: 44px;
      line-height: 44px;
      padding-left: 15px;
      background: #FFF5E5;
      border-radius: 3px;
      color: #FF8000;
    }

    .info {
      margin-top: 20px;
      padding-left: 15px;

      p {
        margin-bottom: 15px;
      }
    }

    .report {
      margin-top: 30px;
      padding-left: 15px;

      p {
        margin-bottom: 20px;

        span {
          margin-left: 10px;
          color: #00479D;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
