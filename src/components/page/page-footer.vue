<template>
  <div class="page-footer">
    <div class="footer-container">
      <div class="container-1">
        <div class="icon-text">
          <div class="icon">
            <img src="../../static/home/footer/footer_img01.png" />
          </div>
          <div class="text">
            <div class="text-1">质量保证</div>
            <div class="text-2">正品保障 诚信服务</div>
          </div>
        </div>
        <div class="icon-text">
          <div class="icon">
            <img src="../../static/home/footer/footer_img02.png" />
          </div>
          <div class="text">
            <div class="text-1">标品现货</div>
            <div class="text-2">一站式服务</div>
          </div>
        </div>
        <div class="icon-text">
          <div class="icon">
            <img src="../../static/home/footer/footer_img03.png" />
          </div>
          <div class="text">
            <div class="text-1">非标定制</div>
            <div class="text-2">全网比价 惠到实处</div>
          </div>
        </div>
        <div class="icon-text">
          <div class="icon">
            <img src="../../static/home/footer/footer_img04.png" />
          </div>
          <div class="text">
            <div class="text-1">产品研发</div>
            <div class="text-2">专业团队 无忧售后</div>
          </div>
        </div>
      </div>

      <div class="container-2">
        <div class="table-left">
          <table>
            <tr>
              <th>特色服务</th>
              <th>支付方式</th>
              <th>服务支持</th>
              <th>联系我们</th>
              <th>服务热线</th>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td></td>
              <td></td>
              <td></td>
              <td rowspan="2" style="font-size: 24px; color: #ff7b23">
                027-87180496
              </td>
            </tr>
            <tr>
              <td style="color: #ff7b23">一键选型</td>
              <td>微信支付</td>
              <td>产品资料</td>
              <td>公司简介</td>
            </tr>
            <tr>
              <td>激光加工</td>
              <td>支付宝支付</td>
              <td>投诉建议</td>
              <td>公司动态</td>
              <td>手机:13277960367</td>
            </tr>
            <tr>
              <td>电光计算</td>
              <td>对公转账</td>
              <td>商家合作</td>
              <td>展会信息</td>
              <td>邮箱:info@huaraylaser.com</td>
            </tr>
            <tr>
              <td></td>
              <td>月结支付</td>
              <td>会员权益</td>
              <td>联系我们</td>
              <td>工作时间</td>
            </tr>
            <tr>
              <td></td>
              <td>发票说明</td>
              <td></td>
              <td></td>
              <td>周一到周六 9:00-18:00</td>
            </tr>
          </table>
        </div>
        <div class="table-right">
          <img src="../../static/home/footer/footer_img05.png" />
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <div>
        Copyright 华锐科仪 苏公网安备************ 苏CPi************
        苏ICP备***********
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.page-footer {
  .footer-container {
    background-color: #272727;
    color: #fff;
    height: 465px;
    padding-top: 56px;
    padding-left: 262px;
    padding-right: 260px;

    .container-1 {
      height: 93px;
      display: flex;

      justify-content: space-between;
      border-bottom: 1px solid #707070;

      .icon-text {
        width: 310px;
        height: 56px;
        //margin-right: 67px;
        float: left;
        display: flex;

        .icon {
          width: 56px;
          height: 56px;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .text {
          width: 239px;
          margin-left: 15px;

          .text-1 {
            font-size: 18px;
          }

          .text-2 {
            margin-top: 9px;
            font-size: 14px;
          }
        }
      }
    }

    .container-2 {
      margin-top: 36px;
      text-align: left;
      //display: flex;

      .table-left {
        width: 1130px;
        float: left;

        th {
          width: 226px;
          font-size: 16px;
        }

        td {
          font-size: 14px;
          height: 30px;
        }
      }

      .table-right {
        width: 135px;
        height: 135px;
        float: right;

        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }

  .footer-bottom {
    height: 73px;
    background-color: #141414;
    justify-content: center;
    /* 水平居中 */
    align-items: center;
    /* 垂直居中，可选 */
    color: #77797b;
    display: flex;
    font-size: 13px;
  }
}
</style>
