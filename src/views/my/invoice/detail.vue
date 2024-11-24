<script>
export default {
  name: "detail",
  data() {
    return {
      process: 4,
      downloadVisible: false
    }
  },
  methods: {
    // 下载报告
    download_report() {
      this.downloadVisible = true
    },
    goUrl(item) {
      this.$router.push(item.url)
    }
  }
}
</script>

<template>
  <div class="content">
    <div class="status-item">
      <div class="status">
        <span>氧氮氢分析仪</span>
        <span>等待支付</span>
      </div>
    </div>
    <div class="info">
      <h3 class="section-title">发票信息</h3>
      <div class="info-row">
        <span class="label">发票类型</span>
        <div class="content">专用发票</div>
      </div>
      <div class="info-row">
        <span class="label">发票类型</span>
        <div class="content">专用发票</div>
      </div>

      <div class="btn btn-bg" @click="download_report">下载发票</div>
    </div>
    <div class="address-item">
      <div class="sample-delivery">
        <!-- 左侧内容 -->
        <div class="left-content">
          <p class="delivery-method">寄样方式: 自行寄样 (运费自付)</p>
          <p class="detail">
            <span>收货人：</span>徐老师
          </p>
          <p class="detail">
            <span>联系方式：</span>15931263165
          </p>
          <p class="detail">
            <span>寄送地址：</span>厦门市集美区杏林湾路465号1号楼2560单元
          </p>
        </div>

        <!-- 右侧内容 -->
        <div class="right-content">
          <p class="payment-status">
            支付方式：<span>待支付</span>
          </p>
          <p class="payment-amount">
            支付金额：<span class="amount">¥40.00</span>
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
            联系人：郭菲菲 联系方式：15931263145 地址：北京市朝阳区数码庄园 .....
          </div>
        </div>
        <!-- 样品是否回收 -->
        <div class="info-row">
          <span class="label">样品是否回收</span>
          <div class="content">不需要回收</div>
        </div>
        <!-- 实验留言 -->
        <div class="info-row">
          <span class="label">实验留言</span>
          <div class="content">
            这里是实验留言内容这里是实验留言内容这里是实验留言内容这里是实验留言内容这里是实验留言内容这里是实验留言内容这里是实验留言内容这里是实验留言内容这里是实验留言内容这里是实验留言内容这里是实验留言内容这里是实验留言内容这里是实验留言内容这里是实验留言内容这里是实验留言内容这里是实验留言内容这里是实验留言内容这里是实验留言内容
          </div>
        </div>
      </div>
    </div>
    <div class="orderInfo-item">
      <div class="order-info">
        <h3 class="section-title">下单信息</h3>
        <p class="sample-info">A组样品，数量：1，样品编号：1</p>

        <!-- 表格 -->
        <table class="info-table">
          <tbody>
          <tr>
            <td class="label">样品主要成分</td>
            <td class="value">氯化锂</td>
          </tr>
          <tr>
            <td class="label">样品是否含有磁性元素，如铁钴镍等</td>
            <td class="value">否</td>
          </tr>
          <tr>
            <td class="label">样品形态</td>
            <td class="value">粉末</td>
          </tr>
          <tr>
            <td class="label">测试靶材</td>
            <td class="value">铜靶</td>
          </tr>
          <tr>
            <td class="label">扫描范围选择</td>
            <td class="value">常规（10-80度）</td>
          </tr>
          <tr>
            <td class="label">具体扫描角度范围（°）</td>
            <td class="value">10~50</td>
          </tr>
          <tr>
            <td class="label">扫描速度</td>
            <td class="value">10°/min</td>
          </tr>
          </tbody>
        </table>
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
  }

  .info {
    margin-top: 20px;
    width: 100%;
    background-color: #fff;
    padding-bottom: 40px;

    .section-title {
      padding-left: 35px;
      height: 63px;
      line-height: 63px;
      font-size: 18px;
      color: #000000;
      border-bottom: 1px solid #E5E5E5;
      margin-bottom: 20px;
    }

    .info-row {
      min-height: 57px;
      display: flex;
      border-bottom: 1px solid #f5f5f5;
      margin: 0 35px;

      //&:last-child {
      //  border-bottom: none;
      //}

      .label {
        line-height: 57px;
        flex: 0 0 180px; // 固定宽度
        font-weight: 400;
        font-size: 16px;
        color: #333333;
        text-align: right;
        padding-right: 40px;
      }

      .content {
        line-height: 57px;
        font-weight: 400;
        font-size: 14px;
        color: #818181;
      }
    }

    .btn {
      cursor: pointer;
      margin-top: 15px;
      width: 133px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      background: #FFFFFF;
      border-radius: 4px;
      border: 1px solid #00479D;
      margin-left: 110px;
      font-size: 14px;
    }

    .btn-bg {
      background: @theme;
      color: #FFFFFF;
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
