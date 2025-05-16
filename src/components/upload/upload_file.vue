<template>
  <div class="upload-cus">
    <el-upload 
    :file-list="fileList" 
    :action="uploadAction" 
    name="img" 
    :data="uploadExtraData" 
    :on-success="onSuccessUpload" 
    :on-preview="handlePictureCardPreview" 
    :on-remove="handleRemove" 
    :multiple="multiple" 
    :limit="limit" 
    :on-exceed="handleExceed">
      <slot><button class="fujian">添加附件</button></slot>
    </el-upload>
    <el-dialog :append-to-body="true" :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "address-add",
  components: {},
  props: {
    //上传图片的键名  图片数据源
    col: {},
    fileList: [],
    list_upload: [],
    limit: {
      default: 20,
    },
    multiple: {
      default: true,
    },
  },
  data() {
    return {
      // fileList: [],
      dialogImageUrl: "",
      dialogVisible: false,
    };
  },
  computed: {
    ...mapState(["baseInfo"]),

    uploadAction() {
      let ret = process.env.NODE_ENV !== "production" ? "/api/uploadImage" :  this.uploadPrefix + "/api/uploadImage";
      return ret;
    },

    uploadExtraData() {
      return {
        // userId: "xxx",
      };
    },
  },

  watch: {},

  created() {},

  methods: {
    //上传成功
    onSuccessUpload(res, file) {
      console.log("上传结果 res", res);
      console.log("上传结果 file", file);
      let { code, data, msg } = res;
      if (code == 200) {
        this.$emit("parentHandleUpload", {
          type: "上传成功",
          colName: this.col,
          file,
          res,
        });

        // this.$emit("parentHandleUploadSuccess", {
        //   res,
        //   file,
        //   colName: this.col,
        // });
      }
    },

    //预览图片
    handlePictureCardPreview(file) {
      // this.dialogImageUrl = file.url;
      // this.dialogVisible = true;
    },

    //移除上传
    handleRemove(file, fileList, other) {
      console.log("删除图片 file", file);
      console.log("删除图片 fileList", fileList);
      console.log("删除图片 other", other);
      // let index = this.list_upload.findIndex((item) => item.uid == file.uid);
      // this.list_upload.splice(index, 1);

      this.$emit("parentHandleUpload", {
        type: "删除成功",
        colName: this.col,
        file,
        res: file.response,
      });

      // this.$emit("parentHandleUploadDelete", {
      //   file,
      //   colName: this.col,
      // });
    },

    //上传超出数量
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择${this.limit}个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.el-upload--picture-card {
  border: none;
}

/deep/ .el-upload {
  // display: flex;
	align-items: center;
	justify-content: center;
  width: 140px;
  border: none;
  background: #fff;
}
.fujian {
  display: flex;
	align-items: center;
	justify-content: center;
  width: 110px;
  height: 35px;
  border: 1px solid #036dd1;
  border-radius: 4px;
  color: #036dd1;
  background: #fff;
  font-size: 14px;
}
</style>
