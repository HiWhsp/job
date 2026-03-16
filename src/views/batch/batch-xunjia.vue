<template>
  <div class="page">
    <div class="inner w-1400">
      <div class="banner-box">
        <!-- <div class="lunbo-box">
          <el-carousel trigger="click" :autoplay="true">
            <el-carousel-item
              v-for="(item, index) in banner_list"
              :key="index"
              @click.native="do_banner_click(item)"
            >
              <img :src="item.image" alt="" />
            </el-carousel-item>
          </el-carousel>
        </div> -->

        <div class="poster-box">
          <img :src="banner_poster" alt="" />
        </div>
        <div class="poster-info flex">
          <div class="info-left">快速报价</div>
          <div class="info-right">
            <div class="text-box">
              <div class="text text-1 active">1上传文件</div>
              <div class="text text-2">2核对结果</div>
              <div class="text text-3">3生成报价单/立刻下单</div>
            </div>
            <div class="step-box">
              <div class="step-item active">
                <div class="dot-box"></div>
              </div>
              <div class="step-item">
                <div class="dot-box"></div>
              </div>
              <div class="step-item">
                <div class="dot-box"></div>
              </div>
              <div class="step-item"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="page-ctx">
        <div class="upload-wrap">
          <div class="upload-box column-flex-center">
            <div class="btn btn-ripple flex-center" @click="do_upload()">
              <img src="@img/batch/upload.png" alt="" />
              上传文件
            </div>
            <div class="desc">上传文件，即可自动报价</div>
            <div class="tip">
              (目前仅支持excel、pdf文件，建议上传文件大小不超过400行500k
              您还可以选择下载我们的模版，进行填写
              <a href="" target="_blank">下载模版</a> )
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";

export default {
  name: "category",
  components: {},
  data() {
    return {
      banner_list: [],
      banner_poster: "",
    };
  },
  computed: {
    ...mapState([""]),
  },
  watch: {},
  created() {
    this.query_banner();
  },
  methods: {
    query_banner() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "banner_index",
          position: 0,
        },
      }).then((res) => {
        if (res.code == 200) {
          if (res.data[0]) {
            this.banner_list = res.data[3].images;
            this.$log("banner_list", this.banner_list);
            this.banner_poster = this.banner_list[0].image;
          }
        }
      });
    },
    do_banner_click(item) {
      //console.log({ ...item });
      if (item.url) {
        window.open(item.url, "_blank");
      } else if (item.inventoryId) {
        this.$router.push(
          "/product-detail/" + (item.skuId || item.inventoryId)
        );
      }
    },


    do_upload() {
      this.toRoute('/batch-xunjia-match')
    }
  },
};
</script>

<style scoped lang="less">
.page {
  background: #ffffff;
  background: #F3F3F3;
  text-align: left;

  .inner {
    width: 1400px;
    margin: 0 auto;
    padding-top: 35px;
    padding-bottom: 100px;

    .page-ctx {
      padding-top: 45px;
    }
  }
}

.banner-box {
  position: relative;
}

.banner-box .lunbo-box {
  position: relative;
  width: 100%;
  height: 318px;

  /deep/ .el-carousel__container {
    height: 318px;
  }

  /deep/ img {
    width: 100%;
    height: 318px;
    cursor: pointer;
  }
}

.poster-box {
  img {
    width: 100%;
  }
}
.poster-info {
  position: absolute;
  top: 64px;
  left: 50%;
  transform: translate(-50%);

  .info-left {
    width: 180px;
    font-family: Poppins, Poppins;
    font-weight: bold;
    font-size: 40px;
    color: #ffffff;
  }

  .info-right {
    margin-left: 82px;
    position: relative;
  }

  .text-box {
    width: 940px;
    height: 40px;
    position: relative;

    .text {
      font-family: Poppins, Poppins;
      font-weight: 400;
      font-size: 30px;
      color: #ffffff;

      &.text-1 {
        position: absolute;
        left: 38px;
      }
      &.text-2 {
        position: absolute;
        left: 310px;
      }
      &.text-3 {
        position: absolute;
        left: 580px;
      }

      &.active {
        color: #00306B;
      }
    }
  }

  .step-box {
    margin-top: 20px;
    display: flex;
    height: 3px;
    width: 940px;

    .step-item {
      position: relative;
      height: 3px;
      background: #fff;
      &:nth-child(1) {
        width: 48px;
      }
      &:nth-child(2) {
        width: 272px;
      }
      &:nth-child(3) {
        width: 272px;
      }
      &:nth-child(4) {
        width: 352px;
      }

      &.active {
        background: #00306B;
        .dot-box {
          background: #00306B;
        }
      }

      .dot-box {
        position: absolute;
        z-index: 2;
        right: 0;
        top: 0;
        transform: translate(50%, -50%);
        border-radius: 50%;
        width: 18px;
        height: 18px;
        background: #fff;
      }
    }
  }
}

.upload-wrap {
  position: relative;
  z-index: 2;
  margin-top: -100px;
  width: 1400px;
height: 299px;
background: #FFFFFF;
padding-top: 70px;
  .btn {
    width: 164px;
    height: 48px;
    background: #00306B;
    border-radius: 0px 0px 0px 0px;
    font-family: Poppins, Poppins;
    font-weight: bold;
    font-size: 16px;
    color: #ffffff;
    img {
      margin-right: 16px;
      width: 23.08px;
    }
  }
  .desc {
    margin: 13px 0;
    font-family: Poppins, Poppins;
    font-weight: bold;
    font-size: 18px;
    color: #333333;
  }
  .tip {
    max-width: 450px;
    text-align: center;
    font-family: Poppins, Poppins;
    font-weight: 400;
    font-size: 14px;
    color: #333333;

    a {
      font-family: Poppins, Poppins;
      font-weight: 400;
      font-size: 14px;
      color: #00306B;
    }
  }
}
</style>

