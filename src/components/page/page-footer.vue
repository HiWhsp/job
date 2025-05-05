<template>
  <div class="page-footer">
    <div class="content">
      <div class="footer-nav">
        <div class="footer-nav_service flex flex-start">
          <div class="service">
            <img src="../../static/home/icon1.png" alt="" style="width: 34px;height: 40px">
            <div class="service-content">
              <p>地址</p>
              <p>{{ webConfig.site_address }}</p>
            </div>
          </div>
          <div class="service">
            <img src="../../static/home/icon2.png" alt="" style="width: 40px;height: 40px">
            <div class="service-content">
              <p>服务热线</p>
              <p>{{  webConfig.site_tel }}</p>
            </div>
          </div>
          <div class="service">
            <img src="../../static/home/icon3.png" alt="" style="width: 40px;height: 30px">
            <div class="service-content">
              <p>期待您的来信</p>
              <p>{{  webConfig.email }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="len"></div>
      <div class="copyright flex flex-center">
        <p class="info">
          Copyright © 2025 奉新砂轮行业协会 All Rights Reserved.
          <span style="margin: 0 10px;">|</span>
          <a href="">{{  webConfig.beian }}</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from "vuex";

export default {
  data() {
    return {}
  },
  computed: {
    ...mapState({
      map_banners: state => state.map_banners
    }),
    kefu_img() {
      const img = this.map_banners['客服'];
      return img ? img[0].image : '';
    }
  },
  mounted() {
    setTimeout(() => {
      console.log(this.map_banners);
    }, 1000)
  }
}
</script>

<style lang="less" scoped>
.col {
  width: 0px;
  height: 12px;
  border: 1px solid #C6CACD;
  margin: 0 5px;
}

.page-footer {
  height: 208px;
  background: #044FA0;

  .len {
    //width: 1400px;
    height: 1px;
    background-color: #ABADB2;
    opacity: 0.4;
  }

  .content {
    .footer-nav {
      width: 1400px;
      height: 132px;
      margin: 0 auto;
      display: flex;
      align-items: center;

      .footer-nav_service {
        flex: 1;
        .service {
          cursor: pointer;
          flex: 1;
          display: flex;
          align-items: center;
          color: #fff;
          font-size: 16px;
          img {
            margin-right: 16px;
          }
        }
        .service:first-child {
          margin-left: 80px;
        }
      }

      .qrcode {
        .qrcode-item {
          margin-right: 22px;

          .img {
            width: 87px;
            height: 85px;
            //background-color: #000;
            img {
              width: 100%;
              height: 100%;
            }
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
      color: #9AB7D9;
      height: 76px;

      a {
        color: #9AB7D9;
        margin-right: 5px;
      }
    }
  }
}
</style>
