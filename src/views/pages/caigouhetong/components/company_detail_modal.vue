<template>
  <div class="custom-form-modal">
    <el-dialog
      title="上传回签"
      width="600px"
      custom-class="modal-form"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="show_modal"
      :append-to-body="true"
      @closed="on_dialog_closed()"
    >
      <div class="modal-ctx">
        <div class="f-list">
          <div class="f-item">
            <div class="f-label required">上传附件：</div>
            <div class="f-ele">
              <div class="cus-upload-wrap">
                <div class="upload-box">
                  <div class="upload-item">
                    <el-upload
                      class="cus-upload-image-drag"
                      accept="application/pdf"
                      :multiple="false"
                      :limit="1"
                      :show-file-list="true"
                      :drag="true"
                      :name="mix_upload_name"
                      :action="mix_upload_action"
                      :data="mix_upload_data"
                      :headers="mix_upload_headers"
                      :file-list="upload_file_list_map['businessLicense']"
                      :on-success="upload_on_success"
                      :on-remove="upload_on_remove"
                    >
                      <i class="el-icon-upload"></i>
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
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="show_modal = false">取消</el-button>
        <el-button
          type="primary"
          :loading="loading"
          @click="throttle_do_submit()"
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
        companyName: "",
        companyCode: "",
        contacts: "",
        contactNumber: "",
        businessLicense: "",
        address: "",
        email: "",
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
      }
      this.show_modal = true;
    },

    // on_before_close() {
    // 	this.show_modal = false;
    // },
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
        signBackPdfUrl: this.upload_url_map["businessLicense"].join(","),
      };
      params[this.id] = this.row.id;

      this.loading = true;
      this.$api({
        url: "signBackContract",
        method: "post",
        data: params,
      }).then((res) => {
        alert(res).then(() => {
          this.loading = false;
        });
        if (res.code == 200) {
          this.$emit("confirm");
          this.show_modal = false;
        }
      });
    },

    // 图片上传
    upload_on_before_upload(file) {
      console.warn("upload_before_upload");
      const isLt50M = file.size / 1024 / 1024 < 50; //文件大小 小于 50MB
      return isLt50M;
    },
    upload_on_success(res) {
      if (res.code == 200) {
        let url = res.data.path;
        this.upload_url_map["businessLicense"].push(url);
      } else {
        alert(res);
      }
    },
    upload_on_remove(file) {
      this.upload_url_map.businessLicense =
        this.upload_url_map.businessLicense.filter((v) => v !== file.url);
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
