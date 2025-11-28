<template>
  <div class="page">
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
            <div class="text text-3">3生成询价单</div>
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
    <div class="inner w-1400">
      <div class="page-ctx">
        <div class="upload-wrap flex-center">
          <div class="download-box column-flex-center">
            <div class="btn btn-ripple flex-center" @click="showTemplate()">
              <img src="@img/batch/download.png" alt="" />
              点我下载
            </div>
            <div class="tip">按照模版填写可以提高匹配成功率哦</div>
          </div>
          <div class="line-box">
            <img src="@img/batch/line.png" alt="" />
          </div>
          <div class="upload-box column-flex-center">
            <el-upload
              class="upload-demo"
              :action="UPLOAD_ACTION"
              name="file"
              :data="custom_upload_data"
              accept=".xls,.xlsx,.et"
              :before-upload="beforeAvatarUpload"
              :on-success="handleAvatarSuccess"
              :show-file-list="false"
            >
              <div class="btn btn-ripple flex-center">
                <img src="@img/batch/upload.png" alt="" />
                上传文件
              </div>
            </el-upload>

            <div class="tip">提交文件直接下单，表格最多支持100行</div>
          </div>
        </div>
      </div>
    </div>
    <Enterprise_template_down ref="download"></Enterprise_template_down>
  </div>
</template>
<script>
import { UPLOAD_ACTION, UPLOAD_NAME, UPLOAD_PARAMS_ACTION } from "@/config/env";
import Enterprise_template_down from "@/components/enterprise/enterprise_template_down";
import { mapState } from "vuex";

export default {
  name: "category",
  components: {
    Enterprise_template_down,
  },
  data() {
    return {
      banner_list: [],
      banner_poster: "",
      UPLOAD_ACTION: UPLOAD_ACTION,
      UPLOAD_NAME: UPLOAD_NAME,
    };
  },
  computed: {
    ...mapState([""]),

    custom_upload_data() {
      let token = localStorage.getItem("token") || "";
      let userId = localStorage.getItem("userId") || "";

      let info = {
        action: "upload_uploadFile",
        token: token,
        userId: userId,
      };
      return info;
    },
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
            this.banner_list = res.data[7].images;
            this.$log("banner_list", this.banner_list);
            this.banner_poster = this.banner_list[0].image;
          }
        }
      });
    },
    showTemplate() {
      // this.$refs.download.init({});
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
    beforeAvatarUpload(file) {},
    handleAvatarSuccess(res, file, fileList) {
      console.log(file);
      console.log(res);
      this.batchConfirm(res.data.url, file.name);
    },
    batchConfirm(url, name) {
      this.toRoute({
        path: "/batch-xunjia-match",
        query: {
          filePath: url,
          fileName: name,
        },
      });
    },
    do_upload() {
      this.batchUp();
    },
  },
};
</script>

<style scoped lang="less">
.page {
  background: #ffffff;
  background: #f3f3f3;
  text-align: left;
  position: relative;
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
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
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
    height: 352px;
    object-fit: cover;
  }
}
.poster-info {
  position: absolute;
  top: 64px;
  left: 50%;
  transform: translate(-50%);

  .info-left {
    width: 180px;
    font-family: Microsoft YaHei, Microsoft YaHei;
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
      font-family: Microsoft YaHei, Microsoft YaHei;
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
        color: #f74747;
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
        background: #f74747;
        .dot-box {
          background: #f74747;
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
  // z-index: 2;
  margin-top: 170px;
  width: 1400px;
  height: 299px;
  background: #ffffff;
  padding-top: 70px;

  .download-box {
    .btn {
      margin-bottom: 16px;
      width: 164px;
      height: 48px;
      background: #ffeded;
      border-radius: 0px 0px 0px 0px;
      border: 1px solid #f74747;

      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: bold;
      font-size: 16px;
      color: #f74747;
      img {
        margin-right: 16px;
        width: 23px;
      }
    }
    .tip {
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: 400;
      font-size: 12px;
      color: #333333;
    }
  }

  .line-box {
    margin: 0 60px;
    img {
      width: 221.84px;
    }
  }
  .btn {
    width: 164px;
    height: 48px;
    background: #f74747;
    border-radius: 0px 0px 0px 0px;
    font-family: Microsoft YaHei, Microsoft YaHei;
    font-weight: bold;
    font-size: 16px;
    color: #ffffff;
    margin-bottom: 16px;
    img {
      margin-right: 16px;
      width: 23.08px;
    }
  }
  .desc {
    margin: 13px 0;
    font-family: Microsoft YaHei, Microsoft YaHei;
    font-weight: bold;
    font-size: 18px;
    color: #333333;
  }
  .tip {
    font-family: Microsoft YaHei, Microsoft YaHei;
    font-weight: 400;
    font-size: 12px;
    color: #333333;
  }
}
.download {
  color: #f74747;
  cursor: pointer;
}
</style>
