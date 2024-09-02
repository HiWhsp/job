<template>
  <div class="">
    <div class="upload-box">
      <!-- <input type="text" disabled placeholder="点击右侧上传文件"/> -->
      <div class="action">
        <el-upload name="img" :data="uploadExtraData" :action="uploadAction"  :show-file-list="false" :on-success="onSuccess_upload" :before-upload="onBefore_upload">
          <slot></slot>
        </el-upload>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "address-add",
  components: {},
  props: ["col", "imgUrl"], //上传图片的键名  图片链接
  data() {
    return {};
  },
  computed: {
    ...mapState(["baseInfo"]),
  },

  created() {},

  methods: {
    onSuccess_upload(res, file) {
      // debugger
      //console.log("上传结果 res", res);
      let { code, image, message } = res;

      if (code == 200) {
        this.$parent.uploadSuccess(this.col, res);
      }
    },
    onBefore_upload(file) {
      const isLt2M = file.size / 1024 / 1024 < 20;
      return isLt2M;
    },
  },
};
</script>


<style scoped lang="less">
input {
  border: 1px solid #dddddd;
  text-align: left;
  padding-left: 20px;
}

.wrap-zujian {
  // 上传类型
  .upload-box {
    .flex();
    input {
      width: 280px;
      height: 48px;
      &:disabled {
        background: #f5f5f5;
        cursor: not-allowed;
      }
      margin-right: 20px;
    }
    .action {
      .flex();
      .btn-upload {
        min-width: 100px;
        height: 48px;
        background: #000000;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 400;
        line-height: 24px;
        color: #ffffff;
      }

      .img-box {
        margin-left: 20px;
        width: 48px;
        height: 48px;
        border: 1px solid #ccc;

        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
      }
    }
  }
}
</style>
