<script>
import { UPLOAD_ACTION, UPLOAD_NAME, UPLOAD_PARAMS_ACTION } from '@/config/env'
export default {

  data() {
    return {
      show: false,
      upload_limit_number: 6,
      info: {},
      xianxia_file_list: [],
      dialogImageUrl: '',
      dialogVisible: false,
      upload_col_name: '',
      UPLOAD_ACTION: "http://jzgy360.com/service.php",
      UPLOAD_NAME,
      UPLOAD_PARAMS_ACTION: "index_localUpload",
    }
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
      let {code, data, msg} = res;
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
    throttle_do_confirm(){
      if (this.xianxia_file_list.length){
        let images = this.xianxia_file_list.join('|')
        this.$api({
          url: '/service.php',
          method: 'post',
          data: {
            action: 'pay_offline',
            orderType: 1,
            orderId: this.info.id,
            images: images
          }
        }).then(res => {
          alert(res)
          if (res.code == 200){
            this.$emit('confirm');
            this.show = false;
          }
        })
      }

    }
  }
}
</script>

<template>
  <div class="modal-container">
    <el-dialog
        :before-close="onModalClose"
        :close-on-click-modal="false"
        :visible.sync="show"
        custom-class="modal-custom"
        title="上传支付凭证"
        width="768px"
    >
      <div class="modal-inner">
        <div class="modal-ctx">
          <div class="xianxia-info">
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
          </div>
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
                  list-type="picture-card"
                  multiple
              >
                <i class="el-icon-plus" style="display: flex; align-items: center; justify-content: center; flex-direction: column; height: 100%">
                  <div slot="tip" class="el-upload__tip">
                    <div class="tip-text-1">上传凭证</div>
                  </div>
                </i>


              </el-upload>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="btn btn-ripple fit-text btn-2 btn-bg"
                   @click="throttle_do_confirm()">确定</el-button>
        <button class="btn btn-ripple fit-text btn-1" @click="show = false">取消</button>



      </span>
    </el-dialog>
  </div>

</template>

<style scoped lang="less">
/deep/ .el-dialog__header {
  padding: 16px 24px;
  border-bottom: 1px solid #eee;
  background: #F7F7F7;

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
    height: 32px;
    background: #FFFFFF;
    border-radius: 50px 50px 50px 50px;
    border: 1px solid #3b64fc;

    font-family: Arial, Arial;
    font-weight: 400;
    font-size: 14px;
    color: #3b64fc;

    & + button {
      margin-left: 16px;
    }
  }

  .btn-1 {

  }

  .btn-2 {

  }

  .btn-bg {
    background: #3b64fc;
    color: #ffffff;
  }
}

.cus-modal-wrap {
  .modal-inner {
    padding: 0;
    text-align: center;

    .img-list {
      .img-box {
        margin: 0 10px;
        width: 120px;
        height: 120px;

        img {
          width: 120px;
          height: 120px;
          object-fit: cover;
        }
      }
    }

    .text-box {
      margin-top: 20px;
      flex: 2;
      text-align: center;
      font-size: 16px;
      font-family: Microsoft YaHei;
      // font-weight: bold;
      line-height: 20px;
      color: #333333;

      img {
        width: 25px;
        margin-right: 10px;
      }
    }
  }
}
.xianxia-info {
  margin-top: 32px;
  padding: 24px 120px;
  padding: 24px 32px;
  // padding-bottom: 0;
  border: 1px dashed #F2D0D0;
  background-color: #FCEFEF;
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
</style>