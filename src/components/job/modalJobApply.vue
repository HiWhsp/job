<template>
  <div class="modal-container">
    <el-dialog class="modal-job-wrap modal-wrap" title="申请岗位" width="580px" custom-class="modal-job  modal-wrap"
      :close-on-click-modal="false" :visible.sync="showModal" :before-close="onModal_close">
      <div class="modal-inner">
        <div class="item">
          <div class="label">您的姓名：</div>
          <div class="val">
            <input type="text" v-model="form.name" />
          </div>
        </div>
        <div class="item">
          <div class="label">您的电话：</div>
          <div class="val">
            <input type="text" v-model="form.mobile" />
          </div>
        </div>
        <div class="item">
          <div class="label">您的邮箱：</div>
          <div class="val">
            <input type="text" v-model="form.email" />
          </div>
        </div>
        <div class="item">
          <div class="label">简历附件：</div>
          <div class="val">
            <div class="upload-box">
              <el-upload class="upload-demo" multiple :limit="1" name="img" :data="uploadExtraData"
                :action="uploadAction" :on-success="onSuccess_upload" :on-preview="handlePreview"
                :on-remove="handleRemove" :before-remove="beforeRemove" :on-exceed="handleExceed" :file-list="fileList">
                <button class="btn-ripple btn-upload">
                  <img src="@img/upload.png" alt="" />
                  <span>上传附件</span>
                </button>
                <!-- <div slot="tip" class="el-upload__tip">(上传附件文件格式xls、doc、txt、pdf、jpg、png 每个文件最大1M)</div> -->
              </el-upload>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <button class="btn-ripple quxiao" @click="showModal = false">取消</button>
        <button class="btn-ripple queding" @click="confirm_submit()">提交</button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "commonShare",
  components: {},
  props: ["curr"],
  data() {
    return {
      showModal: false,
      // showModal: true,
      job_id: "",
      form: {
        name: "",
        mobile: "",
        email: "",
        file: "",
        job_id: "",
        job_title: "",
      },

      fileList: [
        // { name: "food2.jpeg", url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100" }
      ],

      uploadList: [],
    };
  },
  computed: {
    ...mapState(["baseInfo"]),
  },
  watch: {
    showModal(val) {
      if (!val) {
        this.form = {
          name: "",
          mobile: "",
          email: "",
          file: "",
          job_id: "",
          job_title: "",
        };
      }
    },
  },

  methods: {
    init(item) {
      this.showModal = true;
      this.job_id = item.id;
      this.form.job_id = item.id;
      this.form.job_title = item.title;
    },
    onModal_close() {
      this.showModal = false;
      //console.log("余额支付关闭 onModal_close");

      this.cancelPay();
    },

    cancelPay() {
      this.showModal = false;
    },

    //余额支付
    confirm_submit() {
      //console.log("要提交的信息", { ...this.form });

      let reg_phone = /^1[3-9]\d{9}$/;
      let reg_email = /^([a-zA-Z\d])(\w|\-)+@[a-zA-Z\d]+\.[a-zA-Z]{2,4}$/;

      let is_true_phone = reg_phone.test(this.form.mobile);
      let is_true_email = reg_email.test(this.form.email);

      if (!this.form.name) {
        alertErr("请输入您的姓名");
        return;
      }
      if (!is_true_phone) {
        alertErr("请输入正确的电话号码");
        return;
      }
      if (!is_true_email) {
        alertErr("请输入正确的邮箱");
        return;
      }
      if (!this.form.file) {
        alertErr("请上传简历附件");
        return;
      }

      this.$api("index_applyJob", {
        ...this.form,
      }).then((res) => {
        //console.log("岗位申请", res);
        let { code, message } = res;
        alert(res);
        if (code == 200) {
          this.showModal = false;
        } else {
        }
      });
    },

    onSuccess_upload(res, file) {
      // debugger
      //console.log("onSuccess_upload 上传结果 res", res);
      //console.log("onSuccess_upload 上传结果 file", file);
      let { code, data, msg} = res;

      if (code == 200) {
        // this.$parent.uploadSuccess(this.col, res);
        // this.form.file_info = res.data;
        // let info = {
        //   ...res,
        //   name: file.name,
        // };
        // this.uploadList.push(info);
        // //console.log("onSuccess_upload uploadList", this.uploadList);

        this.form.file = res.data;
      }
    },

    handleRemove(file, fileList) {
      // //console.log(file, fileList);
      // let index = this.uploadList.findIndex((v) => v.name == file.name);
      // this.uploadList.splice(index, 1);
      // //console.log("handleRemove uploadList", this.uploadList);

      this.form.file = "";
    },

    handlePreview(file) {
      //console.log(file);
    },

    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length
        } 个文件`
      );
    },

    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
  },
};
</script>

<style scoped lang="less">
.btn-upload {
  .flex-center();
  min-width: 128px;
  height: 40px;
  background: #ffffff;
  border-radius: 4px 4px 4px 4px;
  border: 1px solid #4CA5E4;
  font-size: 14px;
  font-family: Microsoft YaHei-Regular, Microsoft YaHei;
  font-weight: 400;
  color: #4CA5E4;

  img {
    margin-right: 10px;
  }
}

.modal-wrap {
  .modal-inner {
    padding: 0 25px;

    .item {
      // .flex();
      margin-bottom: 20px;
      text-align: left;

      .label {
        margin-bottom: 15px;
        min-width: 100px;
        text-align: left;
        font-size: 14px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        font-weight: 400;
        color: #333;
      }

      .val {
        .money {
          font-size: 20px;
          font-family: Microsoft YaHei-Bold, Microsoft YaHei;
          font-weight: bold;
          color: #4CA5E4;
        }

        input {
          padding: 0 20px;
          width: 350px;
          width: 100%;
          height: 43px;
          background: #ffffff;
          border-radius: 3px 3px 3px 3px;
          opacity: 1;
          border: 1px solid #e5e5e5;
        }
      }
    }
  }
}

/deep/ .el-dialog__header {
  border-bottom: 1px solid #eee;
  // background: #4CA5E4;
  background: #f7f7f7;
  text-align: left;

  .el-dialog__title {
    color: #fff;
    color: #333;
  }

  .el-dialog__headerbtn .el-dialog__close {
    color: #fff;
    color: #333;
  }
}

/deep/ .el-dialog__footer {
  text-align: center;

  button {
    width: 128px;
    height: 40px;
    background: #ffffff;
    border: 1px solid #eeeeee;
    font-size: 14px;
  }

  .quxiao {
    margin-right: 24px;
    color: #4CA5E4;
    border: 1px solid #4CA5E4;
  }

  .queding {
    // margin-right: 24px;
    background: #4CA5E4;
    color: #fff;
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/modals/modalJobApply.less"></style>
