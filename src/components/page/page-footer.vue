<template>
  <div class="page-footer">
    <div class="content">
      <div class="footer-nav">
        <div class="footer-nav_service flex flex-start">
          <div class="service">
            <img src="../../static/home/logo.png" alt="">
          </div>
        </div>
      </div>
      <div class="len"></div>
      <div class="copyright flex flex-center">
        <p class="info">
          Copyright © 2018 广东弘儒投资有限责任公司
          <span style="margin: 0 10px;">|</span>
          <a href="">粤ICP备14039237号</a>
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
  background: #F3F3F3;

  .len {
    //width: 1200px;
    height: 1px;
    background-color: #ABADB2;
    opacity: 0.4;
  }

  .content {
    .footer-nav {
      width: 1200px;
      height: 132px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;

      .footer-nav_service {
        .service {
          cursor: pointer;
          display: flex;
          align-items: center;
          color: #fff;
          font-size: 16px;

          img {
            width: 208px;
            height: 62px;
          }
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
      color: #000;
      height: 76px;

      a {
        color: #000;
        margin-right: 5px;
      }
    }
  }
}
</style>
