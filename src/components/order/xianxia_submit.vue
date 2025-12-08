<script>
import { UPLOAD_ACTION, UPLOAD_NAME, UPLOAD_PARAMS_ACTION } from "@/config/env";
export default {
  data() {
    return {
      show: false,
      upload_limit_number: 6,
      info: {},
      xianxia_file_list: [],
      dialogImageUrl: "",
      dialogVisible: false,
      upload_col_name: "",
      UPLOAD_ACTION: UPLOAD_ACTION,
      UPLOAD_NAME,
      UPLOAD_PARAMS_ACTION: "index_localUpload",
    };
  },
  methods: {
    init(info) {
      this.show = true;
      this.info = info;
    },
    onModalClose() {
      this.show = false;
    },
    uploadSuccess_pingjia(res, file) {
      //console.log("上传结果", res);
      let { code, data, msg } = res;
      alert(res);
      if (code == 200) {
        this.xianxia_file_list.push(res.data);
        console.log(this.xianxia_file_list);
      }
    },
    beforeUpload_pingjia(file) {
      const isLt2M = file.size / 1024 / 1024 < 20; //文件大小
      return isLt2M;
    },

    handlePictureCardPreview(file) {
      // this.dialogImageUrl = file.url;
      this.dialogImageUrl = file.response.data;
      this.dialogVisible = true;
    },
    throttle_do_confirm() {
      if (this.xianxia_file_list.length) {
        let images = this.xianxia_file_list.join("|");
        this.$api({
          url: "/service.php",
          method: "post",
          data: {
            action: "orders_savePayImg",
            id: this.info.id,
            payImg: images,
          },
        }).then((res) => {
          alert(res);
          if (res.code == 200) {
            this.$emit("confirm");
            this.show = false;
          }
        });
      }
    },
  },
};
</script>

<template>
  <div class="modal-container">
    <el-dialog
      :before-close="onModalClose"
      :close-on-click-modal="false"
      :visible.sync="show"
      custom-class="modal-custom"
      title="上传支付凭证"
      width="680px"
    >
      <div class="modal-inner">
        <div class="modal-ctx">
          <!-- <div class="xianxia-info">
            <p style="font-size: 16px; margin-bottom: 8px">收款信息</p>
            <div class="info-item">
              <div class="info-label">户名:</div>
              <div class="info-val">{{ vuex_config.offline_company }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">开户银行:</div>
              <div class="info-val">{{ vuex_config.offline_bank }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">账号:</div>
              <div class="info-val">{{ vuex_config.offline_code }}</div>
            </div>
          </div> -->
          <div class="info-item scroll-target-pingzheng">
            <div class="info-val">
              <el-upload
                :action="UPLOAD_ACTION"
                :name="UPLOAD_NAME"
                :before-upload="beforeUpload_pingjia"
                :data="mix_upload_data"
                :limit="upload_limit_number"
                :on-preview="handlePictureCardPreview"
                :on-success="uploadSuccess_pingjia"
                accept="image/*"
                class="upload-demo"
                multiple
              >
                <div class="upload-wrap">
                  <img src="@/assets/img/order/upload.png" alt="" />
                  <div class="btn-text">
                    <img src="@/assets/img/batch/upload.png" alt="" />
                    <span>点击上传</span>
                  </div>
                  <p>或直接拖到这里</p>
                </div>
              </el-upload>
              <p style="margin-top: 10px; color: #999">
                可添加JPG、PNG、PDF文件，大小限制10M以内
              </p>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <button class="btn btn-ripple fit-text btn-1" @click="show = false">
          取消
        </button>
        <el-button
          class="btn btn-ripple fit-text btn-2 btn-bg"
          @click="throttle_do_confirm()"
          >确定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<style scoped lang="less">
/deep/ .el-dialog__header {
  padding: 16px 24px;
  border-bottom: 1px solid #eee;
  background: #f7f7f7;

  font-family: Poppins, Poppins;
  // font-weight: 600;
  font-size: 18px;
  color: #333333;

  .el-dialog__close {
    font-size: 20px;
  }
}

/deep/ .el-dialog__body {
  padding: 34px 60px 53px;
}

/deep/ .el-dialog__footer {
  text-align: center;
  padding-bottom: 60px;

  button {
    width: 120px;
    height: 48px;
    background: #ffffff;
    border-radius: 5px;
    border: 1px solid #DEDEDE;

    font-size: 18px;
    color: #666666;

    & + button {
      margin-left: 16px;
    }
  }

  .btn-bg {
    background: #f74747;
    color: #ffffff;
  }
}

.xianxia-info {
  margin-top: 32px;
  padding: 24px 120px;
  padding: 24px 32px;
  // padding-bottom: 0;
  border: 1px dashed #f2d0d0;
  background-color: #fcefef;
  margin-bottom: 16px;
  .info-item {
    display: flex;
    //align-items: center;
    align-items: flex-start;
    //margin-bottom: 10px;

    .info-label {
      line-height: 32px;
      padding-right: 10px;
      font-size: 14px;
      font-family: sans-serif;
      font-weight: 400;
      color: #666666;
    }

    .info-val {
      line-height: 32px;
      font-size: 14px;
      font-family: sans-serif;
      font-weight: 400;
      color: #666666;
    }
  }
}

.upload-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 558px;
  height: 202px;

  background: #f8f8f8;
  border-radius: 4px 4px 4px 4px;
  border: 1px solid #ebebeb;
  img {
    width: 48px;
    height: 38px;
  }
  .btn-text {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 16px;
    margin-bottom: 5px;

    width: 100px;
    height: 36px;
    background: rgba(229, 34, 43, 0.3);
    border-radius: 4px 4px 4px 4px;
    border: 1px solid rgba(0, 0, 0, 0);
    color: #fff;
    img {
      width: 16px;
      height: 16px;
      margin-right: 5px;
    }
  }
  p {
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #a2a2a2;
    line-height: 24px;
  }
}
</style>
