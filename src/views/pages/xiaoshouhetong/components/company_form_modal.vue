<template>
  <div class="custom-form-modal">
    <el-dialog
      title="上传附件合同"
      width="600px"
      custom-class="modal-form"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="show_modal"
      :append-to-body="true"
      @closed="on_dialog_closed()"
    >
      <div class="modal-ctx">
        <div class="f-list" v-if="type === 'add'">
          <div class="f-item">
            <div class="f-label required">销售合同编号：</div>
            <div class="f-ele">
              <el-input
                v-model="form.contractNo"
                type="text"
                placeholder="请输入销售合同编号"
              ></el-input>
            </div>
          </div>
          <div class="f-item">
            <div class="f-label required">签订日期：</div>
            <div class="f-ele">
              <el-date-picker
                v-model="form.signDate"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </div>
          </div>
          <div class="f-item">
            <div class="f-label required">单位名称：</div>
            <div class="f-ele">
              <el-input
                v-model="form.company"
                type="text"
                placeholder="请输入单位名称"
              ></el-input>
            </div>
          </div>
          <div class="f-item">
            <div class="f-label">电话：</div>
            <div class="f-ele">
              <el-input
                v-model="form.phone"
                type="text"
                placeholder="请输入电话"
              ></el-input>
            </div>
          </div>
          <div class="f-item">
            <div class="f-label">产品总金额：</div>
            <div class="f-ele">
              <el-input
                v-model="form.price"
                type="text"
                placeholder="请输入产品总金额"
              ></el-input>
            </div>
          </div>
          <div class="f-item">
            <div class="f-label required">上传附件：</div>
            <div class="f-ele">
              <div class="cus-upload-wrap">
                <div class="upload-box">
                  <div class="upload-item">
                    <el-upload
                      class="cus-upload-image-drag"
                      list-type="picture-card"
                      accept="application/pdf"
                      :multiple="false"
                      :limit="1"
                      :show-file-list="true"
                      :drag="true"
                      :disabled="false"
                      :name="mix_upload_name"
                      :action="mix_upload_action"
                      :data="mix_upload_data"
                      :headers="mix_upload_headers"
                      :file-list="upload_file_list_map['businessLicense']"
                      :before-upload="upload_on_before_upload"
                      :on-success="
                        (res, file, fileList) =>
                          upload_on_success({
                            field_info: { field: 'businessLicense' },
                            res,
                            file,
                            fileList,
                          })
                      "
                      :on-remove="
                        (file, fileList) =>
                          upload_on_remove({
                            field_info: { field: 'businessLicense' },
                            file,
                            fileList,
                          })
                      "
                      :on-preview="upload_on_preview"
                    >
                      <i class="el-icon-picture"></i>
                      <div class="el-upload__text">
                        将文件拖到此处，或<em>点击上传</em>
                      </div>
                      <div class="el-upload__tip" slot="tip">
                        请上传PDF文件。
                      </div>
                    </el-upload>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="over" v-else>
          <img src="@/assets/imgs/success.png" alt="" />
          <span>提交成功！</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          :loading="loading"
          @click="throttle_do_submit()"
          v-if="type === 'over'"
          >在线预览</el-button
        >
        <el-button @click="show_modal = false">取消</el-button>
        <el-button
          type="primary"
          :loading="loading"
          @click="throttle_do_submit()"
          v-if="type === 'add'"
          >确定</el-button
        >
      </span>
    </el-dialog>

    <el-dialog :visible.sync="is_preview_image">
      <img width="100%" :src="preview_image_src" alt="" />
    </el-dialog>
    <el-dialog :visible.sync="is_preview_video">
      <video width="100%" :src="preview_video_src" controls alt="" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "form-modal",
  components: {},
  data() {
    return {
      unique_key: "companyId",
      show_modal: false,
      is_edit: false, //新增 编辑
      row: {},
      form: {
        contractNo: "",
        signDate: "",
        company: "",
        phone: "",
        price: "",
      },
      origin_form: {},
      loading: false,
      type: "add",

      //
      rangeId_values: "",
      rangeId_options: [],

      treePopWidth: "",

      tree_field_title_map: {
        // column: title
        channelId: "",
      },

      // 上传
      upload_url_map: {
        businessLicense: [],
      },
      origin_upload_url_map: {
        businessLicense: [],
      },
      upload_file_list_map: {
        businessLicense: [],
      },
      origin_upload_file_list_map: {
        businessLicense: [],
      },
      //
      is_preview_image: false,
      preview_image_src: "",
      is_preview_video: false,
      preview_video_src: "",
    };
  },
  created() {
    this.set_params();
    this.throttle_do_submit = this.mix_throttle(this.do_submit, 1000);
  },
  methods: {
    set_params() {
      this.origin_form = {
        ...this.form,
      };
    },

    init(row) {
      if (row) {
        this.row = row || {};
        this.is_edit = true;
        this.query_detail();
      }
      this.show_modal = true;
    },

    query_detail() {
      this.$api({
        url: `/company/info/${this.row.id}`,
        method: "get",
        data: {},
      }).then((res) => {
        if (res.code == 200) {
          let data = res.data;
          this.form = {
            companyName: data.companyName || "",
            companyCode: data.companyCode || "",
            contacts: data.contacts || "",
            contactNumber: data.contactNumber || "",
            businessLicense: data.businessLicense || "",
            address: data.address || "",
            email: data.email || "",
          };

          // this.tree_field_title_map.channelId = data.channel_title
          if (data.businessLicense) {
            this.upload_file_list_map["businessLicense"] = data.businessLicense
              .split(",")
              .filter((v) => !!v)
              .map((v) => ({
                url: v,
              }));
          }
        }
      });
    },

    on_dialog_closed() {
      this.row = {};
      this.is_edit = false;
      this.form = {
        ...this.origin_form,
      };

      this.upload_file_list_map = JSON.parse(
        JSON.stringify(this.origin_upload_file_list_map)
      );
      this.origin_upload_url_map = JSON.parse(
        JSON.stringify(this.origin_upload_url_map)
      );
    },
    do_submit() {
      let params = {
        ...this.form,
        pdfUrl: this.upload_url_map["businessLicense"].join(","),
        type: 1,
      };

      if (this.is_edit) {
        params[this.unique_key] = this.row.id;
      }

      if (!params.contractNo) {
        return alertErr("请填写" + "销售合同编号");
      }
      if (!params.signDate) {
        return alertErr("请填写" + "签订日期");
      }
      if (!params.company) {
        return alertErr("请填写" + "单位名称");
      }
      if (!params.phone) {
        return alertErr("请填写" + "电话");
      }
      if (!params.price) {
        return alertErr("请填写" + "产品总金额");
      }

      this.loading = true;
      this.$api({
        url: "createAnnexContract",
        method: "post",
        data: params,
      }).then((res) => {
        alert(res).then(() => {
          this.loading = false;
        });
        if (res.code == 200) {
          this.$emit("confirm");
          // this.show_modal = false;
        }
      });
    },

    //
    // 图片上传
    upload_on_before_upload(file) {
      console.warn("upload_before_upload");
      const isLt50M = file.size / 1024 / 1024 < 50; //文件大小 小于 50MB
      return isLt50M;
    },
    upload_on_success(option) {
      let { field_info, res, file, fileList } = option;
      this.$log("upload_on_success option", option);

      if (res.code == 200) {
        let url = res.url;
        this.upload_file_list_map[field_info.field] = fileList;
        // this.upload_url_map[field_info.field].push(url)
        this.upload_url_map[field_info.field] = fileList.map(
          (v) => v.response && v.response.path
        );
      } else {
        alert(res);
      }
    },
    upload_on_remove(option) {
      let { field_info, file, fileList } = option;
      this.$log("upload_on_remove option", option);
      this.upload_file_list_map[field_info.field] = fileList;
      this.upload_url_map[field_info.field] = fileList.map(
        (v) => v.response && v.response.url
      );
    },
    upload_on_preview(file) {
      this.preview_image_src = file.url;
      this.is_preview_image = true;
    },
    //
  },
};
</script>

<style scoped lang="less">
@import "~@/config/style/modal-form-style.less";
</style>
