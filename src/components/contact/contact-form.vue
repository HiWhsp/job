<template>
  <div class="liuyan-box">
    <div class="block-xunjia">
      <div class="detail-title">Become An Agent</div>
      <!-- <div class="detail-title-line"></div> -->
      <div class="page-block">
        <div class="xunjia-box">
          <div class="input-item ">
            <div class="label">名</div>
            <div class="input-box">
              <el-input clearable v-model="form.firstName" placeholder="名"></el-input>
            </div>
          </div>
          <div class="input-item">
            <div class="label">姓</div>
            <div class="input-box">
              <el-input clearable v-model="form.lastName" placeholder="姓"></el-input>
            </div>
          </div>
          <div class="input-item">
            <div class="label required">邮箱</div>
            <div class="input-box">
              <el-input clearable v-model="form.email" placeholder="邮箱"></el-input>
            </div>
          </div>
          <div class="input-item">
            <div class="label required">电话</div>
            <div class="input-box">
              <el-input clearable v-model="form.phone" placeholder="电话"></el-input>
            </div>
          </div>
          <div class="input-item">
            <div class="label required">国家</div>
            <div class="input-box">
              <el-input clearable v-model="form.country" placeholder="国家"></el-input>
            </div>
          </div>
          <div class="input-item">
            <div class="label required">主题</div>
            <div class="input-box">
              <el-input clearable v-model="form.subject" placeholder="主题"></el-input>
            </div>
          </div>

          <!-- <div class="input-item">
            <div class="label">所在省份：</div>
            <div class="input-box">
              <el-select v-model="form.address" placeholder="请选择">
                <el-option v-for="item in list_sheng" :key="item.id" :label="item.title" :value="item.id">
                </el-option>
              </el-select>
            </div>
          </div> -->


          <div class="input-item full" style="width: 100%; margin-right: 0;">
            <div class="label required">留言内容</div>
            <div class="input-box">
              <el-input v-model="form.content" placeholder="留言内容" clearable type="textarea" :autosize="{ minRows: 6 }">
              </el-input>
              <!-- <div class="upload-box">
                <el-upload class="upload-demo" multiple :limit="6" name="file" :data="uploadExtraData"
                  action="http://fujunjixie.dx.hdapp.com.cn/service.php?action=index_ossUpload" :on-success="onSuccess_upload" :on-preview="handlePreview"
                  :on-remove="handleRemove" :before-remove="beforeRemove" :on-exceed="handleExceed"
                  :file-list="fileList">
                  <button class="btn-ripple btn-upload">
                    <img src="@img/upload.png" alt="" />
                    <span>上传附件</span>
                  </button>
                  <div slot="tip" class="el-upload__tip">
                    (上传附件文件格式xls、doc、txt、pdf、jpg、png 每个文件最大1M)
                  </div>
                </el-upload>
              </div> -->
              <div class="desc-box"></div>
            </div>
          </div>
        </div>

        <div class="submit-box">
          <el-button class="btn-ripple" :loading="loading" @click="throttle_do_submit()" >提交</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "liuyan-form",
  components: {},
  data() {
    return {
      form: {
        firstName: "",
        lastName: "",
        phone: "",
        applyType: "1",//类型：1-代理
        country: "",
        subject: "",
        content: "",
        email: "",
      },

      //
      fileList: [
        // { name: "food2.jpeg", url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100" }
      ],
      list_sheng: [],
      uploadList: [],

      loading:false
    };
  },
  computed: {
    ...mapState([""]),
  },

  watch: {
    uploadList(list, prev) {
      //console.log("询价咨询 watch, uploadList", list);
      this.form.file_info = list.map((v) => v.data).join("|");
    },
  },

  created() {
    this.throttle_do_submit = this.mix_throttle(this.do_submit, 1000)
    this.setView();
  },
  methods: {
    setView() {

    },


    throttle_do_submit() {

    },

    do_submit() {
      let reg_phone = /^1[3-9]\d{9}$/;
      let reg_email = /^([a-zA-Z\d])(\w|\-)+@[a-zA-Z\d]+\.[a-zA-Z]{2,4}$/;
      let is_true_email = reg_email.test(this.form.email)
      let is_true_phone = reg_phone.test(this.form.phone)

      // if (!this.form.firstName) {
      //   alertErr("请填写名");
      //   return;
      // }
      // if (!this.form.lastName) {
      //   alertErr("请填写姓");
      //   return;
      // }
      if (!this.form.email) {
        alertErr("请填写邮箱");
        return;
      }
      if (!this.form.phone) {
        alertErr("请填写电话");
        return;
      }
      if (!this.form.country) {
        alertErr("请选择国家");
        return;
      }
      if (!this.form.subject) {
        alertErr("请填写主题");
        return;
      }
      if (!this.form.content) {
        alertErr("请填写内容");
        return;
      }

      this.loading = true;
      this.$api({
        url: '/service.php',
        method: 'get',
        data: {
          action: 'agent_apply',
          ...this.form,
        }
      }).then((res) => {
        alert(res).then(() => {
          this.loading = false;
        });

        if (res.code == 200) {
          this.do_clear()
        }
      });
    },

    do_clear() {
      this.form = {
        firstName: "",
        lastName: "",
        phone: "",
        applyType: "1",//类型：1-代理
        country: "",
        subject: "",
        content: "",
        email: "",
      };
    },


    onSuccess_upload(res, file) {
      // debugger
      //console.log("onSuccess_upload 上传结果 res", res);
      //console.log("onSuccess_upload 上传结果 file", file);
      let { code, data, msg } = res;

      if (code == 200) {
        // this.$parent.uploadSuccess(this.col, res);
        // this.form.file_info = res.data;
        let info = {
          ...res,
          name: file.name,
        };
        this.uploadList.push(info);
        //console.log("onSuccess_upload uploadList", this.uploadList);
      }
    },

    handleRemove(file, fileList) {
      //console.log(file, fileList);

      let index = this.uploadList.findIndex((v) => v.name == file.name);
      this.uploadList.splice(index, 1);

      //console.log("handleRemove uploadList", this.uploadList);
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
.page-block {
  width: 100%;
  margin: 0 auto;
}

.detail-title {
  margin-bottom: 78px;
  text-align: center;
  position: relative;
  font-size: 36px;
  font-family: Microsoft YaHei-Bold, Microsoft YaHei;
  font-weight: bold;
  color: #333333;
}

.detail-title-line {
  width: 80px;
  margin: 24px auto;
  height: 5px;
  background: @theme;
  border-radius: 3px 3px 3px 3px;
}

.block-xunjia {
  min-height: 500px;
  padding: 70px 80px 90px;
  background: #F5F5F5;

  .xunjia-box {
    padding-top: 0;
    display: flex;
    flex-wrap: wrap;

    .input-item {
      width: calc(50% - 30px);
      margin-right: 60px;
      margin-bottom: 64px;

      &:nth-child(2n) {
        margin-right: 0;
      }

      .label {
        margin-bottom: 26px;
        font-family: Arial, Arial;
        font-weight: 400;
        font-size: 20px;
        color: #000000;

        &.required {
          &::after {
            content: '*';
            color: #f00;
            margin-left: 5px;
          }
        }
      }

      .input-box {
        .el-select {
          width: 100%;
        }
      }
    }

    .upload-box {
      margin-top: 30px;
    }
  }

  .submit-box {
    text-align: center;

    button {
      width: 200px;
      height: 50px;
      background: @theme;
      border-radius: 0px 0px 0px 0px;

      font-family: OPPOSans, OPPOSans;
      font-weight: bold;
      font-size: 16px;
      color: #FFFFFF;
    }
  }
}

.btn-upload {
  .flex-center();
  min-width: 128px;
  height: 40px;
  background: #ffffff;
  border-radius: 4px 4px 4px 4px;
  border: 1px solid @theme;
  font-size: 14px;
  font-family: Microsoft YaHei-Regular, Microsoft YaHei;
  font-weight: 400;
  color: @theme;

  img {
    margin-right: 10px;
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/zujian/LiuyanForm.less"></style>
