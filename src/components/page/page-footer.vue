<template>
  <div class="page-footer">
    <div class="content">
      <div class="advantage flex flex-between">
        <div class="item flex">
          <img src="../../static/home/advantage-1.png" alt="">
          <div class="advantage_content">
            <p class="tag">降本</p>
            <p class="tips">价格低</p>
          </div>
        </div>
        <div class="item flex">
          <img src="../../static/home/advantage-2.png" alt="">
          <div class="advantage_content">
            <p class="tag">简化</p>
            <p class="tips">效率高</p>
          </div>
        </div>
        <div class="item flex">
          <img src="../../static/home/advantage-3.png" alt="">
          <div class="advantage_content">
            <p class="tag">高稳定性</p>
            <p class="tips">效率高</p>
          </div>
        </div>
        <div class="item flex">
          <img src="../../static/home/advantage-4.png" alt="">
          <div class="advantage_content">
            <p class="tag">高耐久性</p>
            <p class="tips">效率高</p>
          </div>
        </div>
        <div class="item flex">
          <img src="../../static/home/advantage-5.png" alt="">
          <div class="advantage_content">
            <p class="tag">高刚性</p>
            <p class="tips">效率高</p>
          </div>
        </div>
        <div class="item flex">
          <img src="../../static/home/advantage-6.png" alt="">
          <div class="advantage_content">
            <p class="tag">高精度</p>
            <p class="tips">效率高</p>
          </div>
        </div>
      </div>
      <div class="len"></div>
      <div class="footer-nav">
        <div class="logo">
          <img src="../../static/home/logo-1.png" alt="">
        </div>
        <div class="footer-nav_service flex flex-start">
          <div class="service">
            <p class="service-title">关于我们</p>
            <a href="" class="service-item">关于富俊</a>
            <a href="" class="service-item">帮助中心</a>
            <a href="" class="service-item">收藏网址</a>
          </div>
          <div class="service">
            <p class="service-title">咨询</p>
            <a href="" class="service-item">服务热线：400 085 7709</a>
            <a href="" class="service-item">业务咨询：13953657709 李先生</a>
            <a href="" class="service-item">技术支持：15265813830 王工</a>
          </div>
          <div class="service">
            <p class="service-title"></p>
            <a href="" class="service-item">技术支持：15265813830 王工</a>
            <a href="" class="service-item">服务时间：周一至周六（8：00-17：00）</a>
            <a href="" class="service-item">(国家法定节假日除外)</a>
          </div>
        </div>
        <div class="qrcode flex">
          <div class="qrcode-item">
            <div class="img"></div>
            <p>微信公众号</p>
          </div>
          <div class="qrcode-item">
            <div class="img"></div>
            <p>抖音号</p>
          </div>
        </div>
      </div>
      <div class="len"></div>
      <div class="copyright flex flex-center">
        <p class="info">
          Copyright © 2024 山东富俊机械科技有限公司
          <a href="">鲁ICP备11084592号</a>
          <a href="">鲁公网安备44030402005642号</a>
          <a href="">增值电信业务经营许可证鲁B2-20201198</a>
          <a href="">ISO/IEC</a>
        </p>
        <p class="agreement">
          <a href="">隐私协议</a>
          <div class="col"></div>
          <a href="">用户协议</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
.col {
  width: 0px;
  height: 12px;
  border: 1px solid #C6CACD;
  margin: 0 5px;
}
.page-footer {
  height: 476px;
  background: #EBEBEB;

  .len {
    width: 1200px;
    height: 1px;
    background-color: #707070;
    opacity: 0.2;
  }

  .content {
    width: 1200px;
    margin: 0 auto;

    .advantage {
      padding: 48px 0 50px 0;

      .item {
        img {
          width: 53px;
          height: 53px;
        }

        .advantage_content {
          margin-left: 10px;

          .tag {
            color: #000;
            font-size: 18px;
            font-weight: bold;
          }

          .tips {
            color: #000;
            font-size: 12px;
          }
        }
      }
    }

    .footer-nav {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      padding: 58px 0 56px 0;
      .logo {
        img {
          width: 217.26px;
          height: 24.12px;
        }
      }

      .footer-nav_service {
        width: 650px;
        justify-content: space-between;
        .service {
          display: flex;
          flex-direction: column;

          .service-title {
            height: 24px;
            color: #000;
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 29px;
          }

          .service-item {
            font-family: Roboto, Roboto;
            font-weight: 400;
            font-size: 14px;
            color: #333333;
            font-style: normal;
            text-transform: none;
            margin-bottom: 18px;
          }

          .service-item:last-child {
            margin: 0;
          }
        }
      }
      .qrcode {
        .qrcode-item {
          margin-right: 22px;

          .img {
            width: 87px;
            height: 85px;
            background-color: #000;
          }

          p {
            font-family: Roboto, Roboto;
            font-weight: 400;
            font-size: 14px;
            color: #333333;
            font-style: normal;
            text-transform: none;
            text-align: center;
            margin-top: 20px;
          }
        }

        .qrcode-item:last-child {
          margin: 0;
        }
      }

    }

    .copyright {
      font-size: 14px;
      color: #77797B;
      height: 62px;
      a {
        color: #77797B;
        margin-right: 5px;
      }
      .agreement {
        margin-left: 29px;
      }
    }
  }
}
</style>
